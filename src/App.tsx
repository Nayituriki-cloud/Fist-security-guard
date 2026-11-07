import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/common/Header';
import { Sidebar } from './components/common/Sidebar';
import { ControlRoomView } from './components/controlroom/ControlRoomView';
import { GuardsDirectory } from './components/guards/GuardsDirectory';
import { DeploymentPlanner } from './components/deployment/DeploymentPlanner';
import { PatrolManager } from './components/patrols/PatrolManager';
import { AttendanceTracker } from './components/attendance/AttendanceTracker';
import { IncidentReports } from './components/incidents/IncidentReports';
import { MobileGuardTerminal } from './components/guardapp/MobileGuardTerminal';
import { ClientPortalView } from './components/clients/ClientPortalView';
import { HumanResourcesView } from './components/hr/HumanResourcesView';
import { PayrollFinanceView } from './components/finance/PayrollFinanceView';
import { EquipmentInventory } from './components/inventory/EquipmentInventory';
import { AiSecurityAssistant } from './components/ai/AiSecurityAssistant';
import { InternalComms } from './components/comms/InternalComms';
import {
  Radar,
  Users,
  Smartphone,
  AlertTriangle,
  Route,
  Clock,
  Building2,
  GraduationCap,
  DollarSign,
  PackageCheck,
  BrainCircuit,
  MessageSquare,
  MapPin,
} from 'lucide-react';

const MainContent: React.FC = () => {
  const { currentView, setCurrentView } = useApp();

  const renderActiveView = () => {
    switch (currentView) {
      case 'control_room':
        return <ControlRoomView />;
      case 'guards':
        return <GuardsDirectory />;
      case 'deployment':
        return <DeploymentPlanner />;
      case 'patrols':
        return <PatrolManager />;
      case 'attendance':
        return <AttendanceTracker />;
      case 'incidents':
        return <IncidentReports />;
      case 'guard_app':
        return <MobileGuardTerminal />;
      case 'clients':
        return <ClientPortalView />;
      case 'hr':
        return <HumanResourcesView />;
      case 'finance':
        return <PayrollFinanceView />;
      case 'inventory':
        return <EquipmentInventory />;
      case 'ai_assistant':
        return <AiSecurityAssistant />;
      case 'comms':
        return <InternalComms />;
      default:
        return <ControlRoomView />;
    }
  };

  const mobileNavItems = [
    { id: 'control_room', label: 'Control', icon: Radar },
    { id: 'guard_app', label: 'Guard App', icon: Smartphone },
    { id: 'patrols', label: 'Patrols', icon: Route },
    { id: 'incidents', label: 'Incidents', icon: AlertTriangle },
    { id: 'ai_assistant', label: 'AI Intel', icon: BrainCircuit },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100">
      <Header />

      <div className="flex-1 flex overflow-hidden">
        <Sidebar />

        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full pb-20 md:pb-8">
          {renderActiveView()}
        </main>
      </div>

      {/* Mobile Sticky Bottom Navigation (Mobile Touch Compliance) */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-slate-950/95 backdrop-blur-md border-t border-slate-800/80 px-2 py-1.5 flex items-center justify-around">
        {mobileNavItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setCurrentView(item.id as any)}
              className={`flex flex-col items-center justify-center py-1 px-2 rounded-lg text-[10px] font-semibold transition-colors ${
                isActive ? 'text-amber-400 font-bold' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Icon className="w-4 h-4 mb-0.5" />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainContent />
    </AppProvider>
  );
}
