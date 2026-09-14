import React from 'react';
import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { getCurrentAdminSession } from '@/lib/auth';
import { AdminShell } from '@/components/admin/AdminShell';

export const metadata: Metadata = {
  title: 'Панель управления | ТАВ Coffee',
  description: 'Административная панель управления контентом, товарами и страницами',
  robots: {
    index: false,
    follow: false,
  },
};

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getCurrentAdminSession();

  return <AdminShell session={session}>{children}</AdminShell>;
}
