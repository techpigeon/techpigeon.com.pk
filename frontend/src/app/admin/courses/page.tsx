'use client';
export const dynamic = 'force-dynamic';
import { useState } from 'react';
import Button from '../../../components/ui/Button';
import Badge from '../../../components/ui/Badge';
import Modal from '../../../components/ui/Modal';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';

// ─── Types ─────────────────────────────────────────────────────────
interface Course {
  id: string;
  emoji: string;
  title: string;
  slug: string;
  category: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  instructor: string;
  price: number;
  duration: string;
  modules: number;
  enrolled: number;
  published: boolean;
  description: string;
}

type BadgeVariant = 'blue' | 'green' | 'red' | 'yellow' | 'gray' | 'teal' | 'purple';

// ─── Mock data (matches data.ts) ──────────────────────────────────
const COURSES: Course[] = [
  {
    id: 'c1',
    emoji: '☁️',
    title: 'AWS Cloud Practitioner',
    slug: 'aws-cloud-practitioner',
    category: 'Cloud',
    level: 'Beginner',
    instructor: 'Ahmad Raza',
    price: 8999,
    duration: '18h',
    modules: 12,
    enrolled: 284,
    published: true,
    description:
      'Master the fundamentals of Amazon Web Services. Covers core AWS services, billing, security, and architecture. Ideal preparation for the AWS Cloud Practitioner certification exam.',
  },
  {
    id: 'c2',
    emoji: '🛡️',
    title: 'CompTIA Security+',
    slug: 'comptia-security-plus',
    category: 'Security',
    level: 'Intermediate',
    instructor: 'Fatima Noor',
    price: 12999,
    duration: '32h',
    modules: 20,
    enrolled: 197,
    published: true,
    description:
      'Comprehensive preparation for the CompTIA Security+ SY0-701 exam. Covers threat analysis, cryptography, identity management, and security operations.',
  },
  {
    id: 'c3',
    emoji: '🌐',
    title: 'CCNA Networking',
    slug: 'ccna-networking',
    category: 'Networking',
    level: 'Intermediate',
    instructor: 'Usman Tariq',
    price: 14999,
    duration: '40h',
    modules: 24,
    enrolled: 156,
    published: true,
    description:
      'Complete Cisco CCNA 200-301 preparation. Learn network fundamentals, IP connectivity, security, automation, and programmability with hands-on labs.',
  },
  {
    id: 'c4',
    emoji: '🐧',
    title: 'Linux SysAdmin',
    slug: 'linux-sysadmin',
    category: 'Linux',
    level: 'Beginner',
    instructor: 'Hassan Ali',
    price: 8999,
    duration: '22h',
    modules: 14,
    enrolled: 312,
    published: true,
    description:
      'Learn Linux system administration from scratch. Covers the command line, file systems, user management, networking, services, and shell scripting.',
  },
  {
    id: 'c5',
    emoji: '🐳',
    title: 'Docker & Kubernetes',
    slug: 'docker-and-kubernetes',
    category: 'DevOps',
    level: 'Advanced',
    instructor: 'Sara Ahmed',
    price: 11999,
    duration: '28h',
    modules: 18,
    enrolled: 143,
    published: true,
    description:
      'Deep dive into container orchestration. Build, ship, and run applications with Docker. Deploy and manage at scale with Kubernetes on AWS and GCP.',
  },
  {
    id: 'c6',
    emoji: '🕵️',
    title: 'Ethical Hacking',
    slug: 'ethical-hacking',
    category: 'Security',
    level: 'Intermediate',
    instructor: 'Bilal Khan',
    price: 15999,
    duration: '36h',
    modules: 22,
    enrolled: 231,
    published: false,
    description:
      'Learn penetration testing and ethical hacking methodologies. Covers reconnaissance, scanning, exploitation, post-exploitation, and reporting.',
  },
];

const CATEGORIES = ['All', 'Cloud', 'Security', 'Networking', 'DevOps', 'Linux'] as const;

const CATEGORY_COLORS: Record<string, string> = {
  Cloud: '#5cc4eb',
  Security: '#F73730',
  Networking: '#bba442',
  DevOps: '#41D33E',
  Linux: '#F8D313',
};

const LEVEL_VARIANTS: Record<Course['level'], BadgeVariant> = {
  Beginner: 'green',
  Intermediate: 'yellow',
  Advanced: 'red',
};

// ─── Edit / Add Course Modal ──────────────────────────────────────
function CourseModal({
  course,
  open,
  onClose,
  onSave,
}: {
  course: Course | null;
  open: boolean;
  onClose: () => void;
  onSave: (c: Course) => void;
}) {
  const isNew = !course;
  const defaults: Course = {
    id: `c${Date.now()}`,
    emoji: '📘',
    title: '',
    slug: '',
    category: 'Cloud',
    level: 'Beginner',
    instructor: '',
    price: 0,
    duration: '',
    modules: 0,
    enrolled: 0,
    published: false,
    description: '',
  };

  const [form, setForm] = useState<Course>(course ? { ...course } : defaults);
  const [saving, setSaving] = useState(false);

  // Reset form when course prop changes
  const formKey = course?.id ?? 'new';
  const [lastKey, setLastKey] = useState(formKey);
  if (formKey !== lastKey) {
    setForm(course ? { ...course } : defaults);
    setLastKey(formKey);
  }

  const set =
    (k: keyof Course) =>
    (v: unknown) => {
      const val = typeof v === 'object' && v !== null && 'target' in (v as Record<string, unknown>)
        ? (v as React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>).target.value
        : v;
      setForm((p) => ({ ...p, [k]: val }));
    };

  const handleSave = () => {
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      onSave(form);
      onClose();
    }, 500);
  };

  return (
    <Modal open={open} onClose={onClose} title={isNew ? 'Add New Course' : `Edit Course — ${course!.title}`} width={600}>
      {/* Title & Slug */}
      <div className="grid grid-cols-2 gap-3">
        <Input label="Course Title" value={form.title} onChange={set('title')} />
        <Input label="Slug" value={form.slug} onChange={set('slug')} />
      </div>

      {/* Category & Level */}
      <div className="grid grid-cols-2 gap-3">
        <Select
          label="Category"
          value={form.category}
          onChange={set('category')}
          options={[
            { value: 'Cloud', label: 'Cloud' },
            { value: 'Security', label: 'Security' },
            { value: 'Networking', label: 'Networking' },
            { value: 'DevOps', label: 'DevOps' },
            { value: 'Linux', label: 'Linux' },
          ]}
        />
        <Select
          label="Level"
          value={form.level}
          onChange={set('level')}
          options={[
            { value: 'Beginner', label: 'Beginner' },
            { value: 'Intermediate', label: 'Intermediate' },
            { value: 'Advanced', label: 'Advanced' },
          ]}
        />
      </div>

      {/* Price & Duration */}
      <div className="grid grid-cols-3 gap-3">
        <Input label="Price (PKR)" type="number" value={String(form.price)} onChange={(v: unknown) => set('price')(Number(typeof v === 'object' && v !== null && 'target' in (v as Record<string, unknown>) ? (v as React.ChangeEvent<HTMLInputElement>).target.value : v))} />
        <Input label="Duration" value={form.duration} onChange={set('duration')} />
        <Input label="Modules" type="number" value={String(form.modules)} onChange={(v: unknown) => set('modules')(Number(typeof v === 'object' && v !== null && 'target' in (v as Record<string, unknown>) ? (v as React.ChangeEvent<HTMLInputElement>).target.value : v))} />
      </div>

      {/* Instructor */}
      <Input label="Instructor" value={form.instructor} onChange={set('instructor')} />

      {/* Published Toggle */}
      <div className="flex items-center gap-3 p-3 rounded border border-slate-200 mb-4">
        <input
          type="checkbox"
          checked={form.published}
          onChange={(e) => setForm((p) => ({ ...p, published: e.target.checked }))}
          className="w-4 h-4 accent-[#5cc4eb]"
        />
        <span className="text-sm text-[#1d1d1d]">Published (visible to students)</span>
      </div>

      {/* Description */}
      <div className="mb-4">
        <label className="block text-xs font-semibold text-slate-500 mb-1.5">Description</label>
        <textarea
          value={form.description}
          onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))}
          rows={4}
          className="w-full px-4 py-2.5 border-2 border-slate-200 rounded text-sm text-[#1d1d1d] bg-white outline-none focus:border-[#5cc4eb] transition-all resize-none"
          placeholder="Brief description of this course..."
        />
      </div>

      {/* Actions */}
      <div className="flex gap-3">
        <Button full loading={saving} onClick={handleSave}>
          {isNew ? 'Create Course' : 'Save Changes'}
        </Button>
        <Button full variant="outline" onClick={onClose}>
          Cancel
        </Button>
      </div>
    </Modal>
  );
}

// ─── Mini Enrollment Bar ──────────────────────────────────────────
function EnrollmentBar({ enrolled, max }: { enrolled: number; max: number }) {
  const pct = max > 0 ? (enrolled / max) * 100 : 0;
  return (
    <div className="mt-2">
      <div className="flex items-center justify-between mb-1">
        <span className="text-[10px] font-semibold text-slate-400">Enrollments</span>
        <span className="text-[10px] font-bold text-[#1d1d1d]">{enrolled}</span>
      </div>
      <div className="bg-slate-200 rounded-full h-1.5">
        <div
          className="h-1.5 rounded-full transition-all duration-500"
          style={{ width: `${pct}%`, background: '#5cc4eb' }}
        />
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────
export default function AdminCoursesPage() {
  const [courses, setCourses] = useState<Course[]>(COURSES);
  const [categoryFilter, setCategoryFilter] = useState<string>('All');
  const [editModal, setEditModal] = useState<Course | null>(null);
  const [addModal, setAddModal] = useState(false);

  // Derived data
  const filtered =
    categoryFilter === 'All' ? courses : courses.filter((c) => c.category === categoryFilter);

  const totalEnrollments = courses.reduce((a, c) => a + c.enrolled, 0);
  const publishedCount = courses.filter((c) => c.published).length;
  const totalRevenue = courses.reduce((a, c) => a + c.price * c.enrolled, 0);
  const maxEnrolled = Math.max(...courses.map((c) => c.enrolled));

  const handleSave = (updated: Course) => {
    setCourses((prev) => {
      const exists = prev.find((c) => c.id === updated.id);
      if (exists) return prev.map((c) => (c.id === updated.id ? updated : c));
      return [...prev, updated];
    });
  };

  return (
    <div>
      {/* ── Header ─────────────────────────────────────────────── */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <span className="bg-[#5cc4eb] text-white text-xs font-bold px-2.5 py-1 rounded-full">
            ADMIN
          </span>
          <h1
            style={{ fontFamily: "'Aleo',serif" }}
            className="text-2xl text-[#bba442]"
          >
            Courses
          </h1>
        </div>
        <Button onClick={() => setAddModal(true)}>+ Add Course</Button>
      </div>

      {/* ── Stat Cards ─────────────────────────────────────────── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {[
          {
            label: 'Total Courses',
            value: String(courses.length),
            icon: '📚',
            color: '#5cc4eb',
          },
          {
            label: 'Published',
            value: String(publishedCount),
            icon: '✅',
            color: '#41D33E',
          },
          {
            label: 'Total Enrollments',
            value: totalEnrollments.toLocaleString(),
            icon: '🎓',
            color: '#bba442',
          },
          {
            label: 'Revenue from Courses',
            value: `Rs.${(totalRevenue / 1000000).toFixed(1)}M`,
            icon: '💰',
            color: '#F8D313',
          },
        ].map((s) => (
          <div
            key={s.label}
            className="bg-white border border-slate-200 rounded-2xl p-5 relative overflow-hidden hover:shadow-md transition-shadow"
          >
            <div
              className="absolute top-4 right-4 w-11 h-11 rounded flex items-center justify-center text-xl"
              style={{ background: s.color + '18' }}
            >
              {s.icon}
            </div>
            <p className="text-xs font-medium text-slate-400 mb-2">{s.label}</p>
            <p
              className="text-2xl font-bold text-[#bba442]"
              style={{ fontFamily: "'Aleo',serif" }}
            >
              {s.value}
            </p>
          </div>
        ))}
      </div>

      {/* ── Category Filter ────────────────────────────────────── */}
      <div className="flex gap-2 flex-wrap mb-6">
        {CATEGORIES.map((cat) => {
          const count =
            cat === 'All' ? courses.length : courses.filter((c) => c.category === cat).length;
          return (
            <button
              key={cat}
              onClick={() => setCategoryFilter(cat)}
              className={`px-4 py-1.5 rounded-full border text-xs font-semibold cursor-pointer transition-all ${
                categoryFilter === cat
                  ? 'bg-[#e8f6fc] border-[#5cc4eb] text-[#5cc4eb]'
                  : 'bg-white border-slate-200 text-slate-500 hover:border-slate-300'
              }`}
            >
              {cat} ({count})
            </button>
          );
        })}
      </div>

      {/* ── Course Cards Grid ──────────────────────────────────── */}
      {filtered.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center">
          <p className="text-slate-400 text-sm">No courses found in this category.</p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((course) => {
            const catColor = CATEGORY_COLORS[course.category] || '#5cc4eb';
            const levelVariant = LEVEL_VARIANTS[course.level] || 'blue';

            return (
              <div
                key={course.id}
                className="bg-white border border-slate-200 rounded-2xl p-5 hover:shadow-md transition-shadow flex flex-col"
              >
                {/* Top Row: Emoji + Status */}
                <div className="flex items-start justify-between mb-3">
                  <div
                    className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl"
                    style={{ background: catColor + '18' }}
                  >
                    {course.emoji}
                  </div>
                  <div className="flex items-center gap-2">
                    {course.published ? (
                      <span className="inline-flex items-center gap-1.5 text-[10px] font-semibold text-emerald-600">
                        <span className="w-2 h-2 rounded-full bg-emerald-500" />
                        Published
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 text-[10px] font-semibold text-amber-600">
                        <span className="w-2 h-2 rounded-full bg-amber-500" />
                        Draft
                      </span>
                    )}
                  </div>
                </div>

                {/* Title */}
                <h3
                  className="text-base font-bold text-[#1d1d1d] mb-2 leading-snug"
                  style={{ fontFamily: "'Aleo',serif" }}
                >
                  {course.title}
                </h3>

                {/* Badges: Category + Level */}
                <div className="flex items-center gap-2 mb-3">
                  <span
                    className="text-[10px] font-bold px-2.5 py-0.5 rounded-full"
                    style={{ background: catColor + '18', color: catColor }}
                  >
                    {course.category}
                  </span>
                  <Badge variant={levelVariant}>{course.level}</Badge>
                </div>

                {/* Info Row */}
                <div className="flex items-center gap-3 text-xs text-slate-400 mb-3">
                  <span>👤 {course.instructor}</span>
                  <span>⏱ {course.duration}</span>
                  <span>📦 {course.modules} modules</span>
                </div>

                {/* Price + Enrolled */}
                <div className="flex items-center justify-between mb-1">
                  <span
                    className="text-lg font-bold text-[#bba442]"
                    style={{ fontFamily: "'Aleo',serif" }}
                  >
                    Rs.{course.price.toLocaleString()}
                  </span>
                  <span className="text-xs font-semibold text-slate-500">
                    🎓 {course.enrolled} enrolled
                  </span>
                </div>

                {/* Mini Enrollment Bar */}
                <EnrollmentBar enrolled={course.enrolled} max={maxEnrolled} />

                {/* Action Buttons */}
                <div className="flex gap-2 mt-4 pt-3 border-t border-slate-100">
                  <Button size="sm" variant="outline" full onClick={() => setEditModal(course)}>
                    Edit Course
                  </Button>
                  <Button
                    size="sm"
                    variant={course.published ? 'ghost' : 'success'}
                    full
                    onClick={() =>
                      setCourses((prev) =>
                        prev.map((c) =>
                          c.id === course.id ? { ...c, published: !c.published } : c,
                        ),
                      )
                    }
                  >
                    {course.published ? 'Unpublish' : 'Publish'}
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ── Edit Modal ─────────────────────────────────────────── */}
      <CourseModal
        course={editModal}
        open={!!editModal}
        onClose={() => setEditModal(null)}
        onSave={handleSave}
      />

      {/* ── Add Modal ──────────────────────────────────────────── */}
      <CourseModal
        course={null}
        open={addModal}
        onClose={() => setAddModal(false)}
        onSave={handleSave}
      />
    </div>
  );
}
