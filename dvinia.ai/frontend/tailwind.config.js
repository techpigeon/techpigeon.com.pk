module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        heading: ['Aleo', 'serif'],
        body: ['Open Sans', 'sans-serif'],
      },
      colors: {
        tp: {
          gold:      '#bba442',    // Title/heading accent — from techpigeon.org
          'gold-lt': '#f5edc8',    // Light gold for backgrounds
          'gold-dk': '#9a8735',    // Darker gold for hover states
          blue:      '#5cc4eb',    // Primary button / CTA — from techpigeon.org
          'blue-dk': '#3ba8d4',    // Hover state
          'blue-lt': '#e8f6fc',    // Light blue backgrounds
          navy:      '#0B1D3A',    // Dark sections, admin sidebar
          'navy-lt': '#1E3A5F',    // Navy hover / lighter variant
          text:      '#1d1d1d',    // Body text — from techpigeon.org
          surface:   '#FFFFFF',    // Card backgrounds
          bg:        '#FFFFFF',    // Page background
          success:   '#41D33E',    // Success green — from techpigeon.org
          warning:   '#F8D313',    // Warning yellow — from techpigeon.org
          danger:    '#F73730',    // Danger red — from techpigeon.org
          teal:      '#00C8B4',    // Accent teal (kept from original)
        }
      },
      borderRadius: {
        'btn': '0.25rem',         // Button roundness — from techpigeon.org
      },
      boxShadow: {
        'card': '0 2px 12px rgba(0,0,0,0.08)',
        'card-hover': '0 8px 24px rgba(0,0,0,0.12)',
      }
    }
  },
  plugins: []
};
