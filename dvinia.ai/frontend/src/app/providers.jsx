'use client';
import { AuthProvider } from '../context/AuthContext';
import { SiteProvider } from '../context/SiteContext';
import { DynamicHead } from '../components/layout/DynamicHead';

export function Providers({ children }) {
  return (
    <SiteProvider>
      <AuthProvider>
        <DynamicHead />
        {children}
      </AuthProvider>
    </SiteProvider>
  );
}
