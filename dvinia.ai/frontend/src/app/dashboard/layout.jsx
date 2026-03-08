'use client';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { AuthGuard } from '../../context/AuthContext';
export default function Layout({ children }) {
  return (
    <AuthGuard>
      <DashboardLayout>{children}</DashboardLayout>
    </AuthGuard>
  );
}
