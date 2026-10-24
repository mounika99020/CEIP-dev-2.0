import React, { useState } from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation,
} from 'react-router-dom';
import { Sidebar } from './components/layout/Sidebar';
import { Header } from './components/layout/Header';
import { Overview } from './pages/Overview';
import { CustomerExperience } from './pages/CustomerExperience';
import { Sentiment } from './pages/Sentiment';
import { Churn } from './pages/Churn';
import { Retention } from './pages/Retention';
import { Predictions } from './pages/Predictions';
import { PowerBI } from './pages/PowerBI';
import { AIAssistant } from './pages/AIAssistant';

const PAGE_METADATA: Record<string, { title: string; subtitle?: string }> = {
  '/': {
    title: 'Customer Experience Intelligence',
    subtitle: 'Monitor customer sentiment, churn risk and retention opportunities in one place.',
  },
  '/overview': {
    title: 'Customer Experience Intelligence',
    subtitle: 'Monitor customer sentiment, churn risk and retention opportunities in one place.',
  },
  '/customer-experience': {
    title: 'Customer Experience Analytics',
    subtitle: 'Customer effort scoring, engagement telemetry, and tier segmentation.',
  },
  '/sentiment': {
    title: 'Sentiment Intelligence',
    subtitle: 'Understand customer feedback and sentiment patterns.',
  },
  '/churn': {
    title: 'Churn Intelligence',
    subtitle: 'Identify customers with elevated churn risk.',
  },
  '/retention': {
    title: 'Retention Intelligence',
    subtitle: 'Turn customer risk signals into actionable retention opportunities.',
  },
  '/predictions': {
    title: 'Prediction Center',
    subtitle: 'Use CEIP intelligence models to analyze individual customer signals.',
  },
  '/power-bi': {
    title: 'Business Intelligence',
    subtitle: 'Explore interactive customer intelligence dashboards and business insights.',
  },
  '/ai-assistant': {
    title: 'CEIP AI Assistant',
    subtitle: 'Ask questions about customer experience, sentiment, churn and retention intelligence.',
  },
};

const AppLayout: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  const currentMeta =
    PAGE_METADATA[location.pathname] || {
      title: 'Customer Experience Intelligence',
      subtitle: 'Monitor customer sentiment, churn risk and retention opportunities.',
    };

  return (
    <div className="min-h-screen bg-[#0b0f17] text-[#f1f5f9] flex">
      {/* Persistent Left Sidebar */}
      <Sidebar
        isOpen={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 lg:pl-64 transition-all duration-200">
        <Header
          title={currentMeta.title}
          subtitle={currentMeta.subtitle}
          onOpenMobileMenu={() => setMobileMenuOpen(true)}
        />

        <main className="flex-1 pb-12">
          <Routes>
            <Route path="/" element={<Navigate to="/overview" replace />} />
            <Route path="/overview" element={<Overview />} />
            <Route path="/customer-experience" element={<CustomerExperience />} />
            <Route path="/sentiment" element={<Sentiment />} />
            <Route path="/churn" element={<Churn />} />
            <Route path="/retention" element={<Retention />} />
            <Route path="/predictions" element={<Predictions />} />
            <Route path="/power-bi" element={<PowerBI />} />
            <Route path="/ai-assistant" element={<AIAssistant />} />
            <Route path="*" element={<Navigate to="/overview" replace />} />
          </Routes>
        </main>
      </div>
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <Router>
      <AppLayout />
    </Router>
  );
};

export default App;