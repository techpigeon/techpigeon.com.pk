'use client';
export const dynamic = 'force-dynamic';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import Alert from '@/components/ui/Alert';
import { coursesApi, ordersApi } from '@/lib/api';

const STATUS_MAP = {
  active: { variant: 'green', label: 'Active' },
  completed: { variant: 'teal', label: 'Completed' },
  pending: { variant: 'yellow', label: 'Pending Approval' },
  dropped: { variant: 'gray', label: 'Dropped' },
};

export default function TrainingPage() {
  const [enrollments, setEnrollments] = useState([]);
  const [pendingCourses, setPendingCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState('');

  const load = async () => {
    setLoading(true);
    setErr('');
    try {
      const [eRes, oRes] = await Promise.all([coursesApi.enrollments(), ordersApi.list()]);
      const enrolled = eRes.data.enrollments || [];
      setEnrollments(enrolled);

      const pending = (oRes.data.orders || [])
        .filter(o => o.status === 'pending')
        .flatMap(o => (Array.isArray(o.items) ? o.items : []))
        .filter(Boolean)
        .filter(i => i.item_type === 'course')
        .map(i => ({
          id: i.id,
          title: i.description || 'Course',
          amount: Number(i.total_price || 0),
        }));
      setPendingCourses(pending);
    } catch (e) {
      setErr(e.response?.data?.error || 'Failed to load training data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const combined = useMemo(() => {
    const mapped = enrollments.map(e => ({
      key: `enr-${e.id}`,
      title: e.title,
      slug: e.slug,
      status: e.status || 'active',
      progress: Number(e.progress_pct || 0),
      enrolledAt: e.enrolled_at,
      certUrl: e.cert_url,
      amount: null,
    }));

    const pending = pendingCourses.map(p => ({
      key: `pend-${p.id}`,
      title: p.title,
      slug: null,
      status: 'pending',
      progress: 0,
      enrolledAt: null,
      certUrl: null,
      amount: p.amount,
    }));

    return [...pending, ...mapped];
  }, [enrollments, pendingCourses]);

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 style={{ fontFamily: "'Aleo',serif" }} className="text-2xl text-[#bba442]">My Training</h1>
          <p className="text-sm text-slate-500 mt-1">Course orders remain pending until admin payment verification.</p>
        </div>
        <Link href="/training"><Button size="sm">+ Browse Courses</Button></Link>
      </div>

      {err && <Alert type="error">{err}</Alert>}

      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-slate-50">
            <tr>
              {['Course', 'Status', 'Progress', 'Amount', 'Enrolled', 'Action'].map(h => (
                <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-slate-400 uppercase border-b border-slate-200">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading && <tr><td colSpan={6} className="px-4 py-8 text-center text-slate-400">Loading training...</td></tr>}
            {!loading && combined.length === 0 && <tr><td colSpan={6} className="px-4 py-8 text-center text-slate-400">No training records found.</td></tr>}
            {!loading && combined.map(c => {
              const st = STATUS_MAP[c.status] || STATUS_MAP.pending;
              return (
                <tr key={c.key} className="border-b border-slate-100">
                  <td className="px-4 py-3.5 font-semibold text-[#1d1d1d]">{c.title}</td>
                  <td className="px-4 py-3.5"><Badge variant={st.variant}>{st.label}</Badge></td>
                  <td className="px-4 py-3.5 text-slate-600">{c.status === 'pending' ? '-' : `${c.progress}%`}</td>
                  <td className="px-4 py-3.5 text-slate-600">{c.amount ? `Rs.${c.amount.toLocaleString('en-PK')}` : '-'}</td>
                  <td className="px-4 py-3.5 text-xs text-slate-400">{c.enrolledAt ? new Date(c.enrolledAt).toLocaleDateString('en-PK') : '-'}</td>
                  <td className="px-4 py-3.5">
                    {c.status === 'pending' ? (
                      <Link href="/dashboard/billing"><Button size="sm" variant="outline">Complete Payment</Button></Link>
                    ) : c.certUrl ? (
                      <Button size="sm" variant="teal">Certificate</Button>
                    ) : (
                      <Link href="/training"><Button size="sm">Continue</Button></Link>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
