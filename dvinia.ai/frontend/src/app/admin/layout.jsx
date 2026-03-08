'use client';
import AdminLayout from '../../components/layout/AdminLayout';
import { AdminGuard } from '../../context/AuthContext';
export default function Layout({ children }) {
  return (
    <AdminGuard>
      <AdminLayout>{children}</AdminLayout>
    </AdminGuard>
  );
}
