import { AnalyticsSection } from '@/components/DashboardSection'
import { DashboardLayout } from '@/components/DashboardLayout'
import MonitoringSection from '@/components/monitoring/MonitoringSection'

const MonitoringPage = () => {
  return (
    <DashboardLayout>
      <MonitoringSection />
    </DashboardLayout>
  )
}

export default MonitoringPage