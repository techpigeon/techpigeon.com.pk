'use client';
export const dynamic = 'force-dynamic';

import Link from 'next/link';
import Footer from '../../components/layout/Footer';
import Button from '../../components/ui/Button';
import { useProjects } from '../../lib/useContent';

const STATUS_COLORS = {
  planning: 'bg-slate-100 text-slate-700',
  active: 'bg-emerald-100 text-emerald-700',
  on_hold: 'bg-amber-100 text-amber-700',
  completed: 'bg-blue-100 text-blue-700',
  cancelled: 'bg-rose-100 text-rose-700',
};

export default function ProjectsPage() {
  const { projects, loading } = useProjects();

  return (
    <main>
      <section className="relative overflow-hidden py-16 px-5" style={{ background: 'linear-gradient(160deg,#0B1D3A 0%,#1c365f 100%)' }}>
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-[#5cc4eb] text-xs font-bold tracking-widest uppercase mb-3">TechPigeon Projects</p>
          <h1 className="text-4xl md:text-5xl text-[#bba442] mb-4" style={{ fontFamily: 'var(--font-heading, Aleo, serif)' }}>
            Live Projects Portfolio
          </h1>
          <p className="text-white/70 max-w-2xl mx-auto">Explore active, planned, and completed projects managed through TechPigeon.</p>
        </div>
      </section>

      <section className="py-14 px-5 bg-slate-50">
        <div className="max-w-7xl mx-auto">
          {loading ? (
            <div className="text-center py-20 text-slate-400">Loading projects...</div>
          ) : projects.length === 0 ? (
            <div className="text-center py-20 text-slate-400">No projects available yet.</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {projects.map((p) => (
                <div key={p.id} className="bg-white border border-slate-200 rounded-2xl p-6 hover:shadow-lg transition-all">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-bold text-[#5cc4eb]">{p.project_id}</span>
                    <span className={`text-xs font-semibold px-2 py-1 rounded-full ${STATUS_COLORS[p.project_status] || 'bg-slate-100 text-slate-700'}`}>
                      {(p.project_status || 'active').replace('_', ' ')}
                    </span>
                  </div>
                  <h3 className="text-lg text-[#1d1d1d] mb-2" style={{ fontFamily: 'var(--font-heading, Aleo, serif)' }}>{p.project_name}</h3>
                  <div className="text-xs text-slate-500 space-y-1 mb-4">
                    <p>Start: {p.project_start_date ? new Date(p.project_start_date).toLocaleDateString('en-PK') : '-'}</p>
                    <p>Close: {p.project_close_date ? new Date(p.project_close_date).toLocaleDateString('en-PK') : '-'}</p>
                  </div>
                  <div className="flex gap-2">
                    {p.project_url ? (
                      <a href={p.project_url} target="_blank" rel="noreferrer" className="inline-flex">
                        <Button size="sm">Open URL</Button>
                      </a>
                    ) : (
                      <Button size="sm" variant="outline">No URL</Button>
                    )}
                    <Link href={`/verification?projectId=${encodeURIComponent(p.project_id)}`}>
                      <Button size="sm" variant="outline">Verify</Button>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      <Footer />
    </main>
  );
}
