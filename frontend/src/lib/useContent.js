'use client';
import { useState, useEffect } from 'react';
import { contentApi } from './api';
import { SERVICES, VENTURES, PARTNERS, TLDS, PLANS, COURSES, NAV_LINKS, FOOTER_COLS } from './data';

const FALLBACK_SERVICES = SERVICES.map((s, i) => ({
  id: `svc-${i}`,
  title: s.title,
  description: s.desc,
  icon: s.icon,
  href: s.href,
}));

const FALLBACK_VENTURES = VENTURES.map((v, i) => ({
  id: `ven-${i}`,
  name: v.name,
  tagline: v.tagline,
  description: v.desc,
  category: 'General',
}));

const FALLBACK_PARTNERS = PARTNERS.map((p, i) => ({
  id: `par-${i}`,
  name: p.name,
  logo_url: null,
  website: '#',
  description: 'Trusted Partner',
}));

const FALLBACK_TLDS = TLDS.map((t, i) => ({
  id: `tld-${i}`,
  ext: t.ext,
  price_pkr: t.pkr,
}));

const FALLBACK_PLANS = PLANS.map((p, i) => ({
  id: p.id,
  slug: p.id,
  name: p.name,
  description: '',
  price_monthly_pkr: p.price_m,
  price_annual_pkr: p.price_a,
  disk_gb: parseInt(String(p.disk), 10) || 0,
  bandwidth_gb: String(p.bw).toLowerCase().includes('unlimited') ? null : (parseInt(String(p.bw), 10) || null),
  websites: p.sites,
  is_featured: !!p.featured,
  features: p.features || [],
}));

const FALLBACK_COURSES = COURSES.map((c) => ({
  id: c.id,
  slug: c.slug,
  title: c.title,
  short_desc: '',
  level: String(c.level || 'beginner').toLowerCase(),
  category: c.cat,
  thumbnail_url: null,
  price_pkr: c.price,
  duration_hours: c.hrs,
  total_modules: Math.max(1, Math.round(c.hrs * 0.6)),
  instructor_name: null,
}));

const FALLBACK_NAV = NAV_LINKS.map((l, i) => ({
  id: `nav-${i}`,
  label: l.label,
  href: l.href,
  position: i <= 4 ? 'primary' : 'secondary',
}));

const FALLBACK_FOOTER = FOOTER_COLS.map((c, i) => ({
  id: `foot-${i}`,
  title: c.title,
  links: c.links,
}));

// Generic hook to fetch content from API with fallback
export function usePageContent(page) {
  const [sections, setSections] = useState({});
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    contentApi.getPage(page).then(r => setSections(r.data.sections)).catch(() => {}).finally(() => setLoading(false));
  }, [page]);
  return { sections, loading };
}

export function useServices() {
  const [services, setServices] = useState(FALLBACK_SERVICES);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    contentApi.getServices()
      .then(r => setServices(r.data.services?.length ? r.data.services : FALLBACK_SERVICES))
      .catch(() => setServices(FALLBACK_SERVICES))
      .finally(() => setLoading(false));
  }, []);
  return { services, loading };
}

export function useVentures() {
  const [ventures, setVentures] = useState(FALLBACK_VENTURES);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    contentApi.getVentures()
      .then(r => setVentures(r.data.ventures?.length ? r.data.ventures : FALLBACK_VENTURES))
      .catch(() => setVentures(FALLBACK_VENTURES))
      .finally(() => setLoading(false));
  }, []);
  return { ventures, loading };
}

export function usePartners() {
  const [partners, setPartners] = useState(FALLBACK_PARTNERS);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    contentApi.getPartners()
      .then(r => setPartners(r.data.partners?.length ? r.data.partners : FALLBACK_PARTNERS))
      .catch(() => setPartners(FALLBACK_PARTNERS))
      .finally(() => setLoading(false));
  }, []);
  return { partners, loading };
}

export function useTlds() {
  const [tlds, setTlds] = useState(FALLBACK_TLDS);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    contentApi.getTlds()
      .then(r => setTlds(r.data.tlds?.length ? r.data.tlds : FALLBACK_TLDS))
      .catch(() => setTlds(FALLBACK_TLDS))
      .finally(() => setLoading(false));
  }, []);
  return { tlds, loading };
}

export function useHostingPlans() {
  const [plans, setPlans] = useState(FALLBACK_PLANS);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    contentApi.getHostingPlans()
      .then(r => setPlans(r.data.plans?.length ? r.data.plans : FALLBACK_PLANS))
      .catch(() => setPlans(FALLBACK_PLANS))
      .finally(() => setLoading(false));
  }, []);
  return { plans, loading };
}

export function useCourses() {
  const [courses, setCourses] = useState(FALLBACK_COURSES);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    contentApi.getCourses()
      .then(r => setCourses(r.data.courses?.length ? r.data.courses : FALLBACK_COURSES))
      .catch(() => setCourses(FALLBACK_COURSES))
      .finally(() => setLoading(false));
  }, []);
  return { courses, loading };
}

export function useNavLinks() {
  const [links, setLinks] = useState(FALLBACK_NAV);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    contentApi.getNav()
      .then(r => setLinks(r.data.links?.length ? r.data.links : FALLBACK_NAV))
      .catch(() => setLinks(FALLBACK_NAV))
      .finally(() => setLoading(false));
  }, []);
  return { links, loading };
}

export function useFooterColumns() {
  const [columns, setColumns] = useState(FALLBACK_FOOTER);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    contentApi.getFooter()
      .then(r => setColumns(r.data.columns?.length ? r.data.columns : FALLBACK_FOOTER))
      .catch(() => setColumns(FALLBACK_FOOTER))
      .finally(() => setLoading(false));
  }, []);
  return { columns, loading };
}
