/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { BankProvider, useBank } from './context/BankContext';
import { Header } from './components/layout/Header';
import { SidebarDesktop } from './components/layout/SidebarDesktop';
import { BottomNavMobile } from './components/layout/BottomNavMobile';
import { HomeView } from './components/views/HomeView';
import { PixView } from './components/views/PixView';
import { PaymentsView } from './components/views/PaymentsView';
import { TransferView } from './components/views/TransferView';
import { StatementView } from './components/views/StatementView';
import { ContactsCrudView } from './components/views/ContactsCrudView';
import { SettingsView } from './components/views/SettingsView';
import { LoginView } from './components/views/LoginView';
import { PresenterGuideModal } from './components/presentation/PresenterGuideModal';
import { ReceiptModal } from './components/presentation/ReceiptModal';
import { Wifi, Battery, Signal } from 'lucide-react';

const BankAppContent: React.FC = () => {
  const { currentView, deviceMode, session } = useBank();

  const renderCurrentView = () => {
    if (!session.isAuthenticated) {
      return <LoginView />;
    }

    switch (currentView) {
      case 'home':
        return <HomeView />;
      case 'pix':
        return <PixView />;
      case 'payments':
        return <PaymentsView />;
      case 'transfers':
        return <TransferView />;
      case 'statement':
        return <StatementView />;
      case 'contacts':
        return <ContactsCrudView />;
      case 'settings':
        return <SettingsView />;
      default:
        return <HomeView />;
    }
  };

  // If mobile mockup mode is selected for classroom projection
  if (deviceMode === 'mobile') {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-2 sm:p-6 text-slate-100">
        <Header />
        
        <div className="w-full max-w-sm my-6 bg-slate-900 border-4 border-slate-700/80 rounded-[44px] shadow-2xl overflow-hidden relative flex flex-col h-[780px] ring-12 ring-slate-950/80">
          {/* Smartphone Speaker / Notch */}
          <div className="h-7 bg-slate-950 flex items-center justify-between px-6 text-[10px] text-slate-400 select-none z-30 shrink-0">
            <span>09:41</span>
            <div className="w-16 h-3.5 bg-slate-900 rounded-full flex items-center justify-center">
              <div className="w-2.5 h-2.5 rounded-full bg-slate-950"></div>
            </div>
            <div className="flex items-center gap-1.5">
              <Signal className="w-2.5 h-2.5" />
              <Wifi className="w-2.5 h-2.5" />
              <Battery className="w-3 h-3" />
            </div>
          </div>

          {/* Internal Mobile Viewport */}
          <div className="flex-1 overflow-y-auto p-4 pb-20 bg-slate-950/90">
            {renderCurrentView()}
          </div>

          {/* Mobile Bottom Navigation inside frame */}
          {session.isAuthenticated && <BottomNavMobile />}
        </div>

        <PresenterGuideModal />
        <ReceiptModal />
      </div>
    );
  }

  // Standard Responsive / Desktop Layout
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-cyan-500 selection:text-slate-950 font-sans">
      <Header />

      <div className="flex-1 flex max-w-7xl w-full mx-auto">
        {/* Desktop Sidebar (Only when authenticated) */}
        {session.isAuthenticated && <SidebarDesktop />}

        {/* Main Workspace */}
        <main className={`flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto w-full ${
          session.isAuthenticated ? 'max-w-4xl mx-auto pb-24 md:pb-8' : 'max-w-xl mx-auto flex items-center justify-center'
        }`}>
          {renderCurrentView()}
        </main>
      </div>

      {/* Mobile Bottom Navigation for smaller screens */}
      {session.isAuthenticated && <BottomNavMobile />}

      {/* Presenter Academic Guide Modal & Receipt Modal */}
      <PresenterGuideModal />
      <ReceiptModal />
    </div>
  );
};

export default function App() {
  return (
    <BankProvider>
      <BankAppContent />
    </BankProvider>
  );
}
