import React from 'react';
import { AuthStoreProvider, useAuthStore } from './store/useAuthStore';
import { Sidebar } from './components/layout/Sidebar';
import { Header } from './components/layout/Header';
import { PrivacyConsentBanner } from './components/layout/PrivacyConsentBanner';

import { LandingPage } from './components/landing/LandingPage';
import { OverviewDashboard } from './components/dashboard/OverviewDashboard';
import { KeystrokeCapture } from './components/capture/KeystrokeCapture';
import { MouseCapture } from './components/capture/MouseCapture';
import { ScrollCapture } from './components/capture/ScrollCapture';
import { ProfileCreator } from './components/capture/ProfileCreator';
import { AIAuthEngine } from './components/ai/AIAuthEngine';
import { PatternRecognition } from './components/ai/PatternRecognition';
import { AnomalyDetector } from './components/ai/AnomalyDetector';
import { ContinuousMonitor } from './components/dashboard/ContinuousMonitor';
import { SecurityAlerts } from './components/dashboard/SecurityAlerts';
import { FraudDetection } from './components/dashboard/FraudDetection';
import { AuthHistoryTable } from './components/dashboard/AuthHistoryTable';
import { SettingsPage } from './components/settings/SettingsPage';

const MainContent: React.FC = () => {
  const { activeTab } = useAuthStore();

  const renderTabContent = () => {
    switch (activeTab) {
      case 'landing':
        return <LandingPage />;

      case 'dashboard':
        return <OverviewDashboard />;

      case 'capture':
        return (
          <div className="space-y-8">
            <KeystrokeCapture />
            <MouseCapture />
            <ScrollCapture />
            <ProfileCreator />
          </div>
        );

      case 'ai_engine':
        return <AIAuthEngine />;

      case 'pattern_recognition':
        return <PatternRecognition />;

      case 'anomaly_detection':
        return <AnomalyDetector />;

      case 'continuous_verification':
        return <ContinuousMonitor />;

      case 'security_alerts':
        return <SecurityAlerts />;

      case 'fraud_detection':
        return <FraudDetection />;

      case 'auth_history':
        return (
          <div className="space-y-4">
            <h3 className="text-base font-bold text-white">Full Authentication Log History</h3>
            <AuthHistoryTable />
          </div>
        );

      case 'settings':
        return <SettingsPage />;

      default:
        return <LandingPage />;
    }
  };

  return (
    <div className="min-h-screen bg-[#0B0F19] text-gray-100 flex font-sans">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <Header />
        <main className="p-6 md:p-8 flex-1 overflow-y-auto max-w-7xl w-full mx-auto">
          {renderTabContent()}
        </main>
        <PrivacyConsentBanner />
      </div>
    </div>
  );
};

export default function App() {
  return (
    <AuthStoreProvider>
      <MainContent />
    </AuthStoreProvider>
  );
}
