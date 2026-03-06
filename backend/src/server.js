require('dotenv').config();
const express    = require('express');
const cors       = require('cors');
const helmet     = require('helmet');
const morgan     = require('morgan');
const rateLimit  = require('express-rate-limit');
const { errorHandler } = require('./middleware/middleware_v2');

const app = express();

app.use(helmet());
app.use(cors({ origin: process.env.FRONTEND_URL || '*', credentials: true }));
app.use(morgan('dev'));

// Stripe webhook needs raw body — mount BEFORE json parser
app.use('/api/payments/stripe/webhook', express.raw({ type: 'application/json' }));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Rate limiting
const general  = rateLimit({ windowMs: 15*60*1000, max: 300, message: { error: 'Too many requests.' } });
const authLimit= rateLimit({ windowMs: 15*60*1000, max: 20,  message: { error: 'Too many auth attempts.' } });
app.use('/api/', general);
app.use('/api/auth/', authLimit);

// Routes
app.use('/api/auth',      require('./routes/auth'));
app.use('/api/domains',   require('./routes/domains'));
app.use('/api/hosting',   require('./routes/hosting'));
app.use('/api/courses',   require('./routes/courses'));
app.use('/api/orders',    require('./routes/orders'));
app.use('/api/payments',  require('./routes/payments'));
app.use('/api/tickets',   require('./routes/tickets'));
app.use('/api/dashboard', require('./routes/dashboard'));
app.use('/api/admin',     require('./routes/admin'));
app.use('/api/users',     require('./routes/users'));

app.get('/api/health', (req, res) => res.json({ status: 'ok', env: process.env.NODE_ENV, ts: new Date() }));
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
if (require.main === module) app.listen(PORT, () => console.log(`🚀 TechPigeon API running on port ${PORT}`));

module.exports = app;
