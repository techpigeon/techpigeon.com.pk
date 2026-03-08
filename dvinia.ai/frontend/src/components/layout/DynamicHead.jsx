'use client';
import { useEffect } from 'react';
import { useSite } from '../../context/SiteContext';

export function DynamicHead() {
  const { settings, loading } = useSite();

  useEffect(() => {
    if (loading || !settings) return;

    // ── Apply CSS variables for dynamic colors/fonts ──
    const root = document.documentElement;
    if (settings.primary_color) root.style.setProperty('--color-primary', settings.primary_color);
    if (settings.secondary_color) root.style.setProperty('--color-secondary', settings.secondary_color);
    if (settings.navy_color) root.style.setProperty('--color-navy', settings.navy_color);
    if (settings.text_color) root.style.setProperty('--color-text', settings.text_color);
    if (settings.heading_font) root.style.setProperty('--font-heading', `'${settings.heading_font}', serif`);
    if (settings.body_font) root.style.setProperty('--font-body', `'${settings.body_font}', sans-serif`);

    // ── Dynamic Google Fonts ──
    const headingFont = settings.heading_font || 'Aleo';
    const bodyFont = settings.body_font || 'Open Sans';
    const fontsToLoad = [headingFont, bodyFont].filter(Boolean).map(f => f.replace(/\s+/g, '+'));
    const fontUrl = `https://fonts.googleapis.com/css2?${fontsToLoad.map(f => `family=${f}:wght@300;400;600;700`).join('&')}&display=swap`;
    
    let fontLink = document.getElementById('dynamic-fonts');
    if (!fontLink) {
      fontLink = document.createElement('link');
      fontLink.id = 'dynamic-fonts';
      fontLink.rel = 'stylesheet';
      document.head.appendChild(fontLink);
    }
    fontLink.href = fontUrl;

    // ── Dynamic favicon ──
    if (settings.favicon_url) {
      let favicon = document.querySelector("link[rel='icon']");
      if (!favicon) {
        favicon = document.createElement('link');
        favicon.rel = 'icon';
        document.head.appendChild(favicon);
      }
      favicon.href = settings.favicon_url;
    }

    // ── Dynamic meta title ──
    if (settings.meta_title) document.title = settings.meta_title;

    // ── Dynamic meta description ──
    if (settings.meta_description) {
      let meta = document.querySelector("meta[name='description']");
      if (!meta) { meta = document.createElement('meta'); meta.name = 'description'; document.head.appendChild(meta); }
      meta.content = settings.meta_description;
    }

    // ── Dynamic meta keywords ──
    if (settings.meta_keywords) {
      let meta = document.querySelector("meta[name='keywords']");
      if (!meta) { meta = document.createElement('meta'); meta.name = 'keywords'; document.head.appendChild(meta); }
      meta.content = settings.meta_keywords;
    }

    // ── Custom head code ──
    if (settings.custom_head_code) {
      let el = document.getElementById('custom-head-code');
      if (!el) { el = document.createElement('div'); el.id = 'custom-head-code'; document.head.appendChild(el); }
      el.innerHTML = settings.custom_head_code;
    }

    // ── Google Analytics ──
    if (settings.google_analytics_id) {
      if (!document.getElementById('ga-script')) {
        const s = document.createElement('script');
        s.id = 'ga-script';
        s.async = true;
        s.src = `https://www.googletagmanager.com/gtag/js?id=${settings.google_analytics_id}`;
        document.head.appendChild(s);
        const s2 = document.createElement('script');
        s2.id = 'ga-init';
        s2.textContent = `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${settings.google_analytics_id}');`;
        document.head.appendChild(s2);
      }
    }

    // ── Google Tag Manager ──
    if (settings.google_tag_manager_id) {
      if (!document.getElementById('gtm-script')) {
        const s = document.createElement('script');
        s.id = 'gtm-script';
        s.textContent = `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','${settings.google_tag_manager_id}');`;
        document.head.appendChild(s);
      }
    }

    // ── Facebook Pixel ──
    if (settings.facebook_pixel_id) {
      if (!document.getElementById('fb-pixel')) {
        const s = document.createElement('script');
        s.id = 'fb-pixel';
        s.textContent = `!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');fbq('init','${settings.facebook_pixel_id}');fbq('track','PageView');`;
        document.head.appendChild(s);
      }
    }

    // ── Custom body code ──
    if (settings.custom_body_code) {
      let el = document.getElementById('custom-body-code');
      if (!el) { el = document.createElement('div'); el.id = 'custom-body-code'; document.body.appendChild(el); }
      el.innerHTML = settings.custom_body_code;
    }

  }, [settings, loading]);

  return null;
}
