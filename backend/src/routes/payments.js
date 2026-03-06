const router = require('express').Router();
const crypto = require('crypto');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const { pool } = require('../db');
const { authenticate } = require('../middleware/middleware_v2');

// ── STRIPE ──────────────────────────────────────────────────────
router.post('/stripe/create-intent', authenticate, async (req, res, next) => {
  try {
    const { order_id } = req.body;
    const { rows } = await pool.query('SELECT * FROM orders WHERE id=$1 AND user_id=$2', [order_id, req.user.id]);
    if (!rows.length) return res.status(404).json({ error: 'Order not found.' });
    const order = rows[0];
    const amountUSD = Math.round((order.total_pkr / 280) * 100); // PKR to USD cents (approx rate)
    const intent = await stripe.paymentIntents.create({
      amount: amountUSD,
      currency: 'usd',
      metadata: { order_id, user_id: req.user.id, order_number: order.order_number }
    });
    await pool.query(`INSERT INTO payments(order_id,user_id,method,amount_pkr,status,gateway_ref) VALUES($1,$2,'stripe',$3,'pending',$4)`,
      [order_id, req.user.id, order.total_pkr, intent.id]);
    res.json({ client_secret: intent.client_secret, publishable_key: process.env.STRIPE_PUBLISHABLE_KEY });
  } catch(e) { next(e); }
});

router.post('/stripe/webhook', require('express').raw({ type: 'application/json' }), async (req, res) => {
  try {
    const sig = req.headers['stripe-signature'];
    const event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
    if (event.type === 'payment_intent.succeeded') {
      const pi = event.data.object;
      const { order_id } = pi.metadata;
      await pool.query('UPDATE orders SET status=$1,paid_at=NOW() WHERE id=$2', ['paid', order_id]);
      await pool.query('UPDATE payments SET status=$1,confirmed_at=NOW(),transaction_id=$2 WHERE gateway_ref=$3', ['completed', pi.id, pi.id]);
      await activateOrderItems(order_id);
    }
    res.json({ received: true });
  } catch(e) { res.status(400).json({ error: e.message }); }
});

// ── JAZZCASH ─────────────────────────────────────────────────────
router.post('/jazzcash/initiate', authenticate, async (req, res, next) => {
  try {
    const { order_id, mobile_number } = req.body;
    const { rows } = await pool.query('SELECT * FROM orders WHERE id=$1 AND user_id=$2', [order_id, req.user.id]);
    if (!rows.length) return res.status(404).json({ error: 'Order not found.' });
    const order = rows[0];
    const txnDateTime = new Date().toISOString().replace(/[-:T.Z]/g,'').substring(0,14);
    const txnRefNo    = `T${Date.now()}`;
    const amount      = Math.round(order.total_pkr * 100); // JazzCash uses paisas
    const postData = {
      pp_Version: '1.1',
      pp_TxnType: 'MWALLET',
      pp_Language: 'EN',
      pp_MerchantID: process.env.JAZZCASH_MERCHANT_ID,
      pp_SubMerchantID: '',
      pp_Password: process.env.JAZZCASH_PASSWORD,
      pp_BankID: 'TBANK',
      pp_ProductID: 'RETL',
      pp_TxnRefNo: txnRefNo,
      pp_Amount: String(amount),
      pp_TxnCurrency: 'PKR',
      pp_TxnDateTime: txnDateTime,
      pp_BillReference: `billRef${order.order_number}`,
      pp_Description: `TechPigeon Order ${order.order_number}`,
      pp_TxnExpiryDateTime: new Date(Date.now() + 3600000).toISOString().replace(/[-:T.Z]/g,'').substring(0,14),
      pp_ReturnURL: `${process.env.FRONTEND_URL}/dashboard/billing?order=${order_id}`,
      pp_SecureHash: '',
      ppmpf_1: mobile_number,
      ppmpf_2: '', ppmpf_3: '', ppmpf_4: '', ppmpf_5: ''
    };
    // Generate secure hash
    const hashStr = Object.keys(postData).sort().filter(k => k !== 'pp_SecureHash' && postData[k])
      .map(k => postData[k]).join('&');
    postData.pp_SecureHash = crypto.createHmac('sha256', process.env.JAZZCASH_INTEGRITY_SALT)
      .update(`${process.env.JAZZCASH_INTEGRITY_SALT}&${hashStr}`).digest('hex').toUpperCase();
    await pool.query(`INSERT INTO payments(order_id,user_id,method,amount_pkr,status,gateway_ref,gateway_response) VALUES($1,$2,'jazzcash',$3,'pending',$4,$5)`,
      [order_id, req.user.id, order.total_pkr, txnRefNo, JSON.stringify(postData)]);
    res.json({ redirect_data: postData, gateway_url: process.env.JAZZCASH_URL, txn_ref: txnRefNo });
  } catch(e) { next(e); }
});

router.post('/jazzcash/callback', async (req, res, next) => {
  try {
    const { pp_TxnRefNo, pp_ResponseCode, pp_TxnRefNo: ref } = req.body;
    if (pp_ResponseCode === '000') {
      const { rows } = await pool.query('SELECT order_id FROM payments WHERE gateway_ref=$1', [pp_TxnRefNo]);
      if (rows.length) {
        await pool.query('UPDATE orders SET status=$1,paid_at=NOW() WHERE id=$2', ['paid', rows[0].order_id]);
        await pool.query('UPDATE payments SET status=$1,confirmed_at=NOW(),transaction_id=$2,gateway_response=$3 WHERE gateway_ref=$4',
          ['completed', pp_TxnRefNo, JSON.stringify(req.body), pp_TxnRefNo]);
        await activateOrderItems(rows[0].order_id);
      }
    }
    res.json({ status: 'ok' });
  } catch(e) { next(e); }
});

// ── EASYPAISA ─────────────────────────────────────────────────
router.post('/easypaisa/initiate', authenticate, async (req, res, next) => {
  try {
    const { order_id, mobile_number } = req.body;
    const { rows } = await pool.query('SELECT * FROM orders WHERE id=$1 AND user_id=$2', [order_id, req.user.id]);
    if (!rows.length) return res.status(404).json({ error: 'Order not found.' });
    const order = rows[0];
    const orderId = `TP${Date.now()}`;
    const postData = {
      storeId: process.env.EASYPAISA_STORE_ID,
      amount: order.total_pkr.toString(),
      postBackURL: `${process.env.FRONTEND_URL}/dashboard/billing`,
      orderRefNum: orderId,
      paymentMethod: 'MA_PAYMENT',
      emailAddr: req.user.email || '',
      mobileNum: mobile_number,
      merchantHashedReq: ''
    };
    const hashStr = `amount=${postData.amount}&orderRefNum=${orderId}&paymentMethod=${postData.paymentMethod}&postBackURL=${postData.postBackURL}&storeId=${postData.storeId}&timeStamp=${new Date().toISOString()}`;
    postData.merchantHashedReq = crypto.createHmac('sha256', process.env.EASYPAISA_HASH_KEY).update(hashStr).digest('base64');
    await pool.query(`INSERT INTO payments(order_id,user_id,method,amount_pkr,status,gateway_ref,gateway_response) VALUES($1,$2,'easypaisa',$3,'pending',$4,$5)`,
      [order_id, req.user.id, order.total_pkr, orderId, JSON.stringify(postData)]);
    res.json({ redirect_data: postData, gateway_url: process.env.EASYPAISA_URL });
  } catch(e) { next(e); }
});

router.post('/easypaisa/callback', async (req, res, next) => {
  try {
    const { responseCode, orderRefNumber } = req.body;
    if (responseCode === '0000') {
      const { rows } = await pool.query('SELECT order_id FROM payments WHERE gateway_ref=$1', [orderRefNumber]);
      if (rows.length) {
        await pool.query('UPDATE orders SET status=$1,paid_at=NOW() WHERE id=$2', ['paid', rows[0].order_id]);
        await pool.query('UPDATE payments SET status=$1,confirmed_at=NOW(),transaction_id=$2 WHERE gateway_ref=$3',
          ['completed', orderRefNumber, orderRefNumber]);
        await activateOrderItems(rows[0].order_id);
      }
    }
    res.redirect(`${process.env.FRONTEND_URL}/dashboard/billing?paid=true`);
  } catch(e) { next(e); }
});

// ── MANUAL BANK TRANSFER ─────────────────────────────────────
router.post('/bank/initiate', authenticate, async (req, res, next) => {
  try {
    const { order_id, bank_name, transaction_ref } = req.body;
    const { rows } = await pool.query('SELECT * FROM orders WHERE id=$1 AND user_id=$2', [order_id, req.user.id]);
    if (!rows.length) return res.status(404).json({ error: 'Order not found.' });
    await pool.query(`INSERT INTO payments(order_id,user_id,method,amount_pkr,status,transaction_id,gateway_response) VALUES($1,$2,'bank_transfer',$3,'pending',$4,$5)`,
      [order_id, req.user.id, rows[0].total_pkr, transaction_ref, JSON.stringify({ bank_name, transaction_ref })]);
    res.json({ message: 'Bank transfer recorded. Admin will verify within 24 hours.', bank_details: { name: 'TechPigeon (TSN Pakistan)', account: '0123456789', bank: 'HBL', iban: 'PK00HABB0000000123456789' } });
  } catch(e) { next(e); }
});

// ── ADMIN: Confirm manual payment ───────────────────────────
const { requireRole } = require('../middleware/middleware_v2');
router.post('/admin/confirm/:payment_id', authenticate, requireRole('admin','support'), async (req, res, next) => {
  try {
    const { rows } = await pool.query('SELECT * FROM payments WHERE id=$1', [req.params.payment_id]);
    if (!rows.length) return res.status(404).json({ error: 'Payment not found.' });
    await pool.query('UPDATE payments SET status=$1,confirmed_at=NOW(),confirmed_by=$2 WHERE id=$3', ['completed', req.user.id, req.params.payment_id]);
    await pool.query('UPDATE orders SET status=$1,paid_at=NOW() WHERE id=$2', ['paid', rows[0].order_id]);
    await activateOrderItems(rows[0].order_id);
    res.json({ message: 'Payment confirmed and services activated.' });
  } catch(e) { next(e); }
});

// ── Helper: activate items after payment ────────────────────
async function activateOrderItems(orderId) {
  const { rows: items } = await pool.query('SELECT * FROM order_items WHERE order_id=$1', [orderId]);
  for (const item of items) {
    if (item.item_type === 'domain' && item.item_id) {
      await pool.query("UPDATE domains SET status='active' WHERE id=$1", [item.item_id]);
    }
    if (item.item_type === 'hosting' && item.item_id) {
      await pool.query("UPDATE hosting_subscriptions SET status='active' WHERE id=$1", [item.item_id]);
    }
    if (item.item_type === 'course' && item.item_id) {
      const meta = item.meta || {};
      if (meta.user_id) {
        await pool.query(`INSERT INTO enrollments(user_id,course_id,status) VALUES($1,$2,'active') ON CONFLICT(user_id,course_id) DO NOTHING`, [meta.user_id, item.item_id]);
      }
    }
  }
  // Notify user
  const { rows: order } = await pool.query('SELECT user_id,order_number FROM orders WHERE id=$1', [orderId]);
  if (order.length) {
    await pool.query(`INSERT INTO notifications(user_id,type,title,message,link) VALUES($1,'payment','Payment Confirmed ✅','Your order ${order[0].order_number} has been confirmed and services activated.','/dashboard/billing')`,
      [order[0].user_id]);
  }
}

module.exports = router;
