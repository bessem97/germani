import { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from '@/context/AuthContext';
import { Sidebar } from '@/components/dashboard/Sidebar';
import { LandingPage } from '@/pages/LandingPage';
import DashboardPage from '@/pages/DashboardPage';
import { AlertsPage } from '@/pages/AlertsPage';
import { MaintenancePage } from '@/pages/MaintenancePage';
import { MaintenanceReportPage } from '@/pages/MaintenanceReportPage';
import { KPIMaintenancePage } from '@/pages/KPIMaintenancePage';
import { MagasinPDRPage } from '@/pages/MagasinPDRPage';
import { PlanningPreventifPage } from '@/pages/PlanningPreventifPage';
import { EquipeMaintenancePage } from '@/pages/EquipeMaintenancePage';
import { DemandeInterventionPage } from '@/pages/DemandeInterventionPage';
import { SensorsPage } from '@/pages/SensorsPage';
import { DigitalTwinPage } from '@/pages/DigitalTwinPage';
import { HistoriquePage } from '@/pages/HistoriquePage';
import { InterventionPage } from '@/pages/InterventionPage';
import { PreventivePage } from '@/pages/PreventivePage';
import { FuitePage } from '@/pages/FuitePage';
import { IaAnalytiquePage } from '@/pages/IaAnalytiquePage';
import { SensorSettingsPage } from '@/pages/config/SensorSettingsPage';
import { AlertThresholdsPage } from '@/pages/config/AlertThresholdsPage';
import { UsersPage } from '@/pages/config/UsersPage';
import { NotificationsPage } from '@/pages/config/NotificationsPage';
import { cn } from '@/lib/utils';
import { Toaster } from 'sonner';

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}

function DashboardLayout() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  return (
    <div className="min-h-screen bg-[#0d1526] text-slate-100 bg-grid-cyber relative overflow-x-hidden">
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-cyan-500/8 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-600/8 rounded-full blur-[120px] pointer-events-none" />

      <Sidebar
        collapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
      />

      <main className={cn('transition-all duration-300 min-h-screen relative z-10', sidebarCollapsed ? 'ml-[72px]' : 'ml-[260px]')}>
        <div className="p-6 xl:p-8">
          <Routes>
            <Route index element={<DashboardPage />} />
            <Route path="alerts" element={<AlertsPage />} />
            <Route path="maintenance/demande-intervention" element={<DemandeInterventionPage />} />
            <Route path="maintenance" element={<KPIMaintenancePage />} />
            <Route path="maintenance/magasin" element={<MagasinPDRPage />} />
            <Route path="maintenance/planning" element={<PlanningPreventifPage />} />
            <Route path="maintenance/equipe" element={<EquipeMaintenancePage />} />
            <Route path="maintenance/:id" element={<MaintenanceReportPage />} />
            <Route path="sensors" element={<SensorsPage />} />
            <Route path="sensors/ia-analytique" element={<IaAnalytiquePage />} />
            <Route path="digital-twin" element={<DigitalTwinPage />} />
            <Route path="historique" element={<HistoriquePage />} />
            <Route path="historique/intervention" element={<InterventionPage />} />
            <Route path="historique/preventive" element={<PreventivePage />} />
            <Route path="historique/fuite" element={<FuitePage />} />
            {/* Configuration pages */}
            <Route path="config/sensor-settings" element={<SensorSettingsPage />} />
            <Route path="config/alert-thresholds" element={<AlertThresholdsPage />} />
            <Route path="config/users" element={<UsersPage />} />
            <Route path="config/notifications" element={<NotificationsPage />} />
          </Routes>
        </div>
      </main>
    </div>
  );
}

function AppContent() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route
        path="/dashboard/*"
        element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Toaster position="top-right" theme="dark" richColors closeButton />
        <AppContent />
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
