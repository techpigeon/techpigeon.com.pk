'use client';
import { createContext, useContext, useState, useEffect } from 'react';
import { contentApi } from '../lib/api';

const SiteContext = createContext(null);

export function SiteProvider({ children }) {
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    contentApi.getSettings()
      .then(({ data }) => setSettings(data.settings))
      .catch(() => {
        // Fallback defaults if API unavailable
        setSettings({
          site_name: 'TechPigeon',
          site_tagline: 'We arrange High Tech / AI Boot camps and AI Classes Nationwide.',
          primary_color: '#5cc4eb',
          secondary_color: '#bba442',
          navy_color: '#0B1D3A',
          text_color: '#1d1d1d',
          heading_font: 'Aleo',
          body_font: 'Open Sans',
          logo_url: '/logo.png',
          social_facebook: '#',
          social_linkedin: '#',
          social_twitter: '#',
          site_copyright: '© 2024 Techpigeon SMC Private Limited.',
          site_legal: '© 2024 Techpigeon. All rights reserved.',
          site_address: '',
          site_phone: '',
          site_email: '',
          custom_head_code: '',
          custom_body_code: '',
          google_analytics_id: '',
          google_tag_manager_id: '',
          facebook_pixel_id: '',
        });
      })
      .finally(() => setLoading(false));
  }, []);

  const s = (key, fallback = '') => (settings && settings[key]) || fallback;

  return (
    <SiteContext.Provider value={{ settings, loading, s }}>
      {children}
    </SiteContext.Provider>
  );
}

export function useSite() {
  const ctx = useContext(SiteContext);
  if (!ctx) throw new Error('useSite must be used inside SiteProvider');
  return ctx;
}
