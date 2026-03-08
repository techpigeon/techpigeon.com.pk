'use client';
export const dynamic = 'force-dynamic';
import { useState } from 'react';
import Link from 'next/link';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import Modal from '@/components/ui/Modal';

// ─── Mock data matching enrollments + courses schema ──────────────
const ENROLLMENTS = [
  {
    id: 'e1',
    course: { id: 'c1', title: 'AWS Cloud Practitioner Essentials', slug: 'aws-cloud-practitioner', category: 'Cloud', level: 'Beginner', emoji: '☁️', bg: 'linear-gradient(135deg,#e8f6fc,#DBEAFE)', duration_hours: 18, total_modules: 12, total_lessons: 48, instructor_name: 'Muhammad Ali Khan', cert_included: true, price_pkr: 8999 },
    status: 'active',
    progress_pct: 72,
    current_module: 9,
    current_lesson: 'VPC and Networking Fundamentals',
    enrolled_at: '2024-10-15',
    last_accessed: '2025-01-28',
    completed_at: null,
    cert_url: null,
  },
  {
    id: 'e2',
    course: { id: 'c4', title: 'Linux System Administration', slug: 'linux-sysadmin', category: 'Linux', level: 'Beginner', emoji: '🐧', bg: 'linear-gradient(135deg,#FEF3C7,#FDE68A)', duration_hours: 22, total_modules: 15, total_lessons: 60, instructor_name: 'Muhammad Ali Khan', cert_included: true, price_pkr: 8999 },
    status: 'active',
    progress_pct: 35,
    current_module: 5,
    current_lesson: 'File Permissions and Ownership',
    enrolled_at: '2024-12-01',
    last_accessed: '2025-01-26',
    completed_at: null,
    cert_url: null,
  },
  {
    id: 'e3',
    course: { id: 'c5', title: 'Docker & Kubernetes Mastery', slug: 'docker-kubernetes', category: 'DevOps', level: 'Advanced', emoji: '🐳', bg: 'linear-gradient(135deg,#DBEAFE,#BFDBFE)', duration_hours: 28, total_modules: 18, total_lessons: 72, instructor_name: 'Sara Ahmed', cert_included: true, price_pkr: 11999 },
    status: 'active',
    progress_pct: 12,
    current_module: 2,
    current_lesson: 'Building Custom Docker Images',
    enrolled_at: '2025-01-10',
    last_accessed: '2025-01-29',
    completed_at: null,
    cert_url: null,
  },
  {
    id: 'e4',
    course: { id: 'c2', title: 'CompTIA Security+ Full Prep', slug: 'comptia-security-plus', category: 'Security', level: 'Intermediate', emoji: '🛡️', bg: 'linear-gradient(135deg,#FEE2E2,#FECACA)', duration_hours: 32, total_modules: 20, total_lessons: 80, instructor_name: 'Sara Ahmed', cert_included: true, price_pkr: 12999 },
    status: 'completed',
    progress_pct: 100,
    current_module: 20,
    current_lesson: 'Final Exam Simulation',
    enrolled_at: '2024-03-01',
    last_accessed: '2024-08-20',
    completed_at: '2024-08-20',
    cert_url: '/certs/security-plus-cert.pdf',
  },
];

const LEVEL_COLORS = {
  Beginner: 'green',
  Intermediate: 'yellow',
  Advanced: 'red',
};

function CourseModulesModal({ enrollment, open, onClose }) {
  if (!enrollment) return null;
  const course = enrollment.course;

  // Generate mock modules
  const modules = Array.from({ length: course.total_modules }, (_, i) => ({
    id: i + 1,
    title: `Module ${i + 1}`,
    lessons: Math.ceil(course.total_lessons / course.total_modules),
    completed: i + 1 < enrollment.current_module,
    current: i + 1 === enrollment.current_module,
  }));

  return (
    <Modal open={open} onClose={onClose} title={course.title} width={600}>
      {/* Course Header */}
      <div className="flex items-center gap-4 p-4 rounded border border-slate-200 bg-slate-50 mb-5">
        <div className="w-14 h-14 rounded flex items-center justify-center text-3xl" style={{ background: course.bg }}>{course.emoji}</div>
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <Badge variant={LEVEL_COLORS[course.level]}>{course.level}</Badge>
            <Badge variant="blue">{course.category}</Badge>
          </div>
          <p className="text-xs text-slate-400">{course.instructor_name} &middot; {course.duration_hours}h &middot; {course.total_lessons} lessons</p>
        </div>
        <div className="text-right">
          <div style={{ fontFamily: "'Aleo',serif" }} className="text-2xl text-[#bba442]">{enrollment.progress_pct}%</div>
          <div className="text-xs text-slate-400">Complete</div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-5">
        <div className="bg-slate-200 rounded-full h-2.5">
          <div className="h-2.5 rounded-full bg-[#5cc4eb] transition-all duration-500" style={{ width: `${enrollment.progress_pct}%` }} />
        </div>
        <div className="flex justify-between text-xs text-slate-400 mt-1.5">
          <span>Module {enrollment.current_module} of {course.total_modules}</span>
          <span>{enrollment.progress_pct}% complete</span>
        </div>
      </div>

      {/* Module List */}
      <div className="space-y-2 max-h-[350px] overflow-y-auto pr-1">
        {modules.map(m => (
          <div key={m.id} className={`flex items-center gap-3 p-3 rounded border transition-all ${m.current ? 'border-[#5cc4eb] bg-[#e8f6fc]' : m.completed ? 'border-emerald-200 bg-emerald-50/50' : 'border-slate-200 bg-white'}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${m.completed ? 'bg-emerald-500 text-white' : m.current ? 'bg-[#5cc4eb] text-white' : 'bg-slate-200 text-slate-500'}`}>
              {m.completed ? '✓' : m.id}
            </div>
            <div className="flex-1">
              <div className={`text-sm font-medium ${m.current ? 'text-[#3ba8d4]' : m.completed ? 'text-emerald-700' : 'text-slate-600'}`}>{m.title}</div>
              <div className="text-xs text-slate-400">{m.lessons} lessons</div>
            </div>
            {m.current && <Badge variant="blue">In Progress</Badge>}
            {m.completed && <span className="text-xs text-emerald-600 font-semibold">Completed</span>}
          </div>
        ))}
      </div>

      <div className="flex gap-3 mt-5 pt-4 border-t border-slate-100">
        {enrollment.status === 'completed' && enrollment.cert_url ? (
          <Button full variant="teal">Download Certificate</Button>
        ) : (
          <Button full>Continue Learning</Button>
        )}
        <Button full variant="outline" onClick={onClose}>Close</Button>
      </div>
    </Modal>
  );
}

export default function TrainingPage() {
  const [moduleModal, setModuleModal] = useState(null);
  const [filter, setFilter] = useState('all');

  const activeCourses = ENROLLMENTS.filter(e => e.status === 'active');
  const completedCourses = ENROLLMENTS.filter(e => e.status === 'completed');
  const avgProgress = activeCourses.length > 0
    ? Math.round(activeCourses.reduce((a, e) => a + e.progress_pct, 0) / activeCourses.length)
    : 0;

  const filtered = filter === 'all' ? ENROLLMENTS : ENROLLMENTS.filter(e => e.status === filter);

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 style={{ fontFamily: "'Aleo',serif" }} className="text-2xl text-[#bba442]">My Training</h1>
          <p className="text-sm text-slate-500 mt-1">{ENROLLMENTS.length} courses enrolled</p>
        </div>
        <Link href="/training"><Button size="sm">+ Browse Courses</Button></Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {[
          { label: 'Enrolled Courses', value: String(ENROLLMENTS.length), icon: '🎓', color: '#5cc4eb' },
          { label: 'In Progress', value: String(activeCourses.length), icon: '📖', color: '#F59E0B' },
          { label: 'Avg Progress', value: avgProgress + '%', icon: '📊', color: '#10B981' },
          { label: 'Certificates', value: String(completedCourses.length), icon: '🏆', color: '#8B5CF6' },
        ].map(s => (
          <div key={s.label} className="bg-white border border-slate-200 rounded-2xl p-5 relative overflow-hidden hover:shadow-md transition-shadow">
            <div className="absolute top-4 right-4 w-11 h-11 rounded flex items-center justify-center text-xl" style={{ background: s.color + '18' }}>{s.icon}</div>
            <p className="text-xs font-medium text-slate-400 mb-2">{s.label}</p>
            <p className="text-2xl font-bold text-[#bba442]" style={{ fontFamily: "'Aleo',serif" }}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex gap-2 mb-5 flex-wrap">
        {['all', 'active', 'completed'].map(f => (
          <button key={f} onClick={() => setFilter(f)} className={`px-4 py-1.5 rounded-full border text-xs font-semibold cursor-pointer transition-all capitalize ${filter === f ? 'bg-[#e8f6fc] border-[#5cc4eb] text-[#5cc4eb]' : 'bg-white border-slate-200 text-slate-500 hover:border-slate-300'}`}>
            {f === 'all' ? `All (${ENROLLMENTS.length})` : `${f} (${ENROLLMENTS.filter(e => e.status === f).length})`}
          </button>
        ))}
      </div>

      {/* Course Cards Grid */}
      <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-5">
        {filtered.map(enrollment => {
          const course = enrollment.course;
          const isCompleted = enrollment.status === 'completed';

          return (
            <div key={enrollment.id} className="bg-white border border-slate-200 rounded-2xl overflow-hidden hover:shadow-lg hover:-translate-y-0.5 transition-all">
              {/* Course Image */}
              <div className="h-32 flex items-center justify-center text-5xl relative" style={{ background: course.bg }}>
                <span>{course.emoji}</span>
                {isCompleted && (
                  <div className="absolute top-3 right-3 bg-emerald-500 text-white text-xs font-bold px-2.5 py-1 rounded-full">
                    ✓ Completed
                  </div>
                )}
              </div>

              {/* Card Body */}
              <div className="p-5">
                {/* Tags */}
                <div className="flex items-center gap-2 mb-2">
                  <Badge variant={LEVEL_COLORS[course.level]}>{course.level}</Badge>
                  <Badge variant="blue">{course.category}</Badge>
                </div>

                {/* Title */}
                <h3 className="font-semibold text-sm text-[#1d1d1d] mb-1.5 leading-snug">{course.title}</h3>
                <p className="text-xs text-slate-400 mb-3">{course.instructor_name}</p>

                {/* Progress */}
                <div className="mb-3">
                  <div className="flex justify-between text-xs mb-1.5">
                    <span className="text-slate-500">Progress</span>
                    <span className="font-semibold text-[#1d1d1d]">{enrollment.progress_pct}%</span>
                  </div>
                  <div className="bg-slate-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full transition-all duration-500 ${isCompleted ? 'bg-emerald-500' : 'bg-[#5cc4eb]'}`}
                      style={{ width: `${enrollment.progress_pct}%` }}
                    />
                  </div>
                  <div className="text-xs text-slate-400 mt-1">
                    Module {enrollment.current_module} of {course.total_modules}
                  </div>
                </div>

                {/* Current Lesson */}
                {!isCompleted && (
                  <div className="bg-[#e8f6fc] rounded p-3 mb-3">
                    <div className="text-xs text-[#3ba8d4] font-semibold mb-0.5">Currently on</div>
                    <div className="text-xs text-[#1d1d1d] font-medium">{enrollment.current_lesson}</div>
                  </div>
                )}

                {/* Meta */}
                <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                  <span className="text-xs text-slate-400">{course.duration_hours}h &middot; {course.total_lessons} lessons</span>
                  <div className="text-xs text-slate-400">
                    {isCompleted
                      ? `Completed ${new Date(enrollment.completed_at).toLocaleDateString('en-PK', { month: 'short', year: 'numeric' })}`
                      : `Last: ${new Date(enrollment.last_accessed).toLocaleDateString('en-PK', { month: 'short', day: 'numeric' })}`
                    }
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2 mt-4">
                  {isCompleted && enrollment.cert_url ? (
                    <>
                      <Button full size="sm" variant="teal">Download Certificate</Button>
                      <Button full size="sm" variant="outline" onClick={() => setModuleModal(enrollment)}>View Modules</Button>
                    </>
                  ) : (
                    <>
                      <Button full size="sm" onClick={() => setModuleModal(enrollment)}>Continue Learning</Button>
                      <Button full size="sm" variant="outline" onClick={() => setModuleModal(enrollment)}>Modules</Button>
                    </>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Empty state */}
      {filtered.length === 0 && (
        <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center">
          <div className="text-4xl mb-3">🎓</div>
          <h3 className="font-semibold text-[#1d1d1d] mb-1">No courses found</h3>
          <p className="text-sm text-slate-400 mb-4">You haven't enrolled in any {filter !== 'all' ? filter : ''} courses yet.</p>
          <Link href="/training"><Button size="sm">Browse Courses</Button></Link>
        </div>
      )}

      <CourseModulesModal enrollment={moduleModal} open={!!moduleModal} onClose={() => setModuleModal(null)} />
    </div>
  );
}
