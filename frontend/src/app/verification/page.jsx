'use client';
export const dynamic = 'force-dynamic';

import { useMemo, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Footer from '../../components/layout/Footer';
import Button from '../../components/ui/Button';
import { contentApi } from '../../lib/api';

export default function VerificationPage() {
  const params = useSearchParams();
  const initial = useMemo(() => params.get('projectId') || '', [params]);
  const [projectId, setProjectId] = useState(initial);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState(null);

  const verify = async () => {
    const code = projectId.trim();
    if (!code) return;
    setLoading(true);
    setError('');
    setResult(null);
    try {
      const { data } = await contentApi.verifyProject(code);
      setResult(data.project);
    } catch (e) {
      setError(e.response?.data?.error || 'Project verification failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main>
      <section className="py-16 px-5" style={{ background: 'linear-gradient(160deg,#f8fbfd 0%,#eef6fa 100%)' }}>
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-[#5cc4eb] text-xs font-bold tracking-widest uppercase mb-3">Verification Portal</p>
          <h1 className="text-4xl text-[#bba442] mb-4" style={{ fontFamily: 'var(--font-heading, Aleo, serif)' }}>Project Verification</h1>
          <p className="text-slate-600">Enter ProjectID to verify project authenticity and status.</p>
        </div>
      </section>

      <section className="py-12 px-5 bg-white">
        <div className="max-w-2xl mx-auto bg-slate-50 border border-slate-200 rounded-2xl p-6">
          <label className="block text-sm font-semibold text-slate-700 mb-2">ProjectID</label>
          <div className="flex gap-3">
            <input
              value={projectId}
              onChange={(e) => setProjectId(e.target.value)}
              placeholder="e.g. TP-PROJ-001"
              className="flex-1 px-4 py-2.5 border-2 border-slate-200 rounded text-sm outline-none focus:border-[#5cc4eb]"
            />
            <Button onClick={verify} loading={loading}>Verify</Button>
          </div>

          {error && <div className="mt-4 text-sm text-red-600 bg-red-50 border border-red-200 rounded px-3 py-2">{error}</div>}

          {result && (
            <div className="mt-5 bg-white border border-emerald-200 rounded-xl p-4">
              <p className="text-xs font-bold text-emerald-700 uppercase tracking-wider mb-2">Verified</p>
              <h3 className="text-lg text-[#1d1d1d] mb-3" style={{ fontFamily: 'var(--font-heading, Aleo, serif)' }}>{result.project_name}</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-slate-600">
                <p><b>ProjectID:</b> {result.project_id}</p>
                <p><b>Status:</b> {String(result.project_status || '').replace('_', ' ')}</p>
                <p><b>Start Date:</b> {result.project_start_date ? new Date(result.project_start_date).toLocaleDateString('en-PK') : '-'}</p>
                <p><b>Close Date:</b> {result.project_close_date ? new Date(result.project_close_date).toLocaleDateString('en-PK') : '-'}</p>
              </div>
              {result.project_url && (
                <a href={result.project_url} target="_blank" rel="noreferrer" className="inline-block mt-4 text-sm font-semibold text-[#5cc4eb] hover:underline">Visit Project URL</a>
              )}
            </div>
          )}
        </div>
      </section>

      <Footer />
    </main>
  );
}
