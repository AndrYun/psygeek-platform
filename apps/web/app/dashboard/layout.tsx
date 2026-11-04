import type { ReactNode } from 'react';
import DashboardShell from './dashboard-shell';

export const instant = false;

export default function DashboardLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return <DashboardShell>{children}</DashboardShell>;
}
