// src/pages/DashboardPage.tsx
import { DashboardLayout } from '@/components/DashboardLayout';
import { AnalyticsSection } from '@/components/DashboardSection';

export function DashboardPage() {
  return (
    <DashboardLayout>
      <AnalyticsSection />
    </DashboardLayout>
  );
}