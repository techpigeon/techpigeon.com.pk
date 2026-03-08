'use client';
import { useState, useEffect } from 'react';
import { contentApi } from './api';

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
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    contentApi.getServices().then(r => setServices(r.data.services)).catch(() => {}).finally(() => setLoading(false));
  }, []);
  return { services, loading };
}

export function useVentures() {
  const [ventures, setVentures] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    contentApi.getVentures().then(r => setVentures(r.data.ventures)).catch(() => {}).finally(() => setLoading(false));
  }, []);
  return { ventures, loading };
}

export function usePartners() {
  const [partners, setPartners] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    contentApi.getPartners().then(r => setPartners(r.data.partners)).catch(() => {}).finally(() => setLoading(false));
  }, []);
  return { partners, loading };
}

export function useTlds() {
  const [tlds, setTlds] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    contentApi.getTlds().then(r => setTlds(r.data.tlds)).catch(() => {}).finally(() => setLoading(false));
  }, []);
  return { tlds, loading };
}

export function useHostingPlans() {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    contentApi.getHostingPlans().then(r => setPlans(r.data.plans)).catch(() => {}).finally(() => setLoading(false));
  }, []);
  return { plans, loading };
}

export function useCourses() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    contentApi.getCourses().then(r => setCourses(r.data.courses)).catch(() => {}).finally(() => setLoading(false));
  }, []);
  return { courses, loading };
}

export function useNavLinks() {
  const [links, setLinks] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    contentApi.getNav().then(r => setLinks(r.data.links)).catch(() => {}).finally(() => setLoading(false));
  }, []);
  return { links, loading };
}

export function useFooterColumns() {
  const [columns, setColumns] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    contentApi.getFooter().then(r => setColumns(r.data.columns)).catch(() => {}).finally(() => setLoading(false));
  }, []);
  return { columns, loading };
}
