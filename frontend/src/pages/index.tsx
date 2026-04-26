import { useState, useEffect } from 'react';
import Head from 'next/head';
import { motion, AnimatePresence } from 'framer-motion';
import { SolarPanel } from '../components/SolarPanelCard';
import DashboardContent from '../components/sections/DashboardContent';
import Storage from '../components/sections/Storage';
import Analytics from '../components/sections/Analytics';
import MLModels from '../components/sections/MLModels';
import Incidents from '../components/sections/Incidents';
import { 
  LayoutDashboard, 
  Battery, 
  TrendingUp, 
  AlertCircle, 
  Settings, 
  LogOut,
  Zap,
  Cpu
} from 'lucide-react';

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState('Dashboard');
  const [panels, setPanels] = useState<SolarPanel[]>([]);
  const [loading, setLoading] = useState(true);
  const [alerts, setAlerts] = useState<any[]>([]);
  const [stats, setStats] = useState<any>(null);

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 5000);
    return () => clearInterval(interval);
  }, []);

  const fetchData = async () => {
    try {
      const panelRes = await fetch('http://localhost:8000/api/solar/panels');
      const panelData = await panelRes.json();
      
      if (Array.isArray(panelData)) {
        setPanels(panelData);
        const newAlerts = panelData
          .filter((panel: SolarPanel) => panel.status !== 'normal')
          .map((panel: SolarPanel) => ({
            panelId: panel.id,
            status: panel.status,
            faults: panel.faults,
            timestamp: panel.timestamp
          }));
        setAlerts(newAlerts);
      }
      
      const statsRes = await fetch('http://localhost:8000/api/dashboard/stats');
      if (statsRes.ok) {
        const statsData = await statsRes.json();
        setStats(statsData);
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'Dashboard':
        return <DashboardContent key="dashboard" panels={panels} stats={stats} alerts={alerts} />;
      case 'Storage':
        return <Storage key="storage" />;
      case 'Analytics':
        return <Analytics key="analytics" />;
      case 'ML Models':
        return <MLModels key="ml" />;
      case 'Incidents':
        return <Incidents key="incidents" />;
      default:
        return <DashboardContent key="default" panels={panels} stats={stats} alerts={alerts} />;
    }
  };

  if (loading && panels.length === 0) {
    return (
      <div className="flex flex-col justify-center items-center h-screen gap-4 bg-[#0a0a0c]">
        <div className="w-16 h-16 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
        <p className="text-slate-400 font-medium animate-pulse">Initializing Neural Link...</p>
      </div>
    );
  }

  return (
    <div className="h-screen text-slate-100 flex overflow-hidden">
      <Head>
        <title>Helios | {activeTab}</title>
      </Head>

      {/* Sidebar - Desktop */}
      <aside className="w-20 lg:w-64 border-r border-white/5 bg-black/20 backdrop-blur-xl hidden md:flex flex-col p-6 h-full shrink-0 z-50">
        <div className="flex items-center gap-3 mb-10 px-2 cursor-pointer" onClick={() => setActiveTab('Dashboard')}>
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-lg shadow-primary/20">
            <Zap className="w-6 h-6 text-white" />
          </div>
          <span className="text-xl font-black tracking-tighter lg:block hidden">HELIOS</span>
        </div>

        <nav className="space-y-2 flex-1">
          <NavItem 
            icon={<LayoutDashboard className="w-5 h-5" />} 
            label="Dashboard" 
            active={activeTab === 'Dashboard'} 
            onClick={() => setActiveTab('Dashboard')}
          />
          <NavItem 
            icon={<Battery className="w-5 h-5" />} 
            label="Storage" 
            active={activeTab === 'Storage'} 
            onClick={() => setActiveTab('Storage')}
          />
          <NavItem 
            icon={<TrendingUp className="w-5 h-5" />} 
            label="Analytics" 
            active={activeTab === 'Analytics'} 
            onClick={() => setActiveTab('Analytics')}
          />
          <NavItem 
            icon={<Cpu className="w-5 h-5" />} 
            label="ML Models" 
            active={activeTab === 'ML Models'} 
            onClick={() => setActiveTab('ML Models')}
          />
          <NavItem 
            icon={<AlertCircle className="w-5 h-5" />} 
            label="Incidents" 
            active={activeTab === 'Incidents'} 
            onClick={() => setActiveTab('Incidents')}
          />
        </nav>

        <div className="pt-6 border-t border-white/5 space-y-2">
          <NavItem icon={<Settings className="w-5 h-5" />} label="Settings" onClick={() => {}} />
          <NavItem icon={<LogOut className="w-5 h-5" />} label="Sign Out" onClick={() => {}} />
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-4 md:p-8 lg:p-12 overflow-y-auto custom-scrollbar">
        <div className="max-w-[1600px] mx-auto w-full">
          <AnimatePresence mode="wait">
            {renderContent()}
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}

interface NavItemProps {
  icon: any;
  label: string;
  active?: boolean;
  onClick: () => void;
}

function NavItem({ icon, label, active = false, onClick }: NavItemProps) {
  return (
    <button 
      onClick={onClick}
      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all relative group ${
        active ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'text-slate-400 hover:bg-white/5 hover:text-white'
      }`}
    >
      {active && (
        <motion.div 
          layoutId="nav-glow"
          className="absolute inset-0 bg-primary/20 blur-xl -z-10"
        />
      )}
      {icon}
      <span className="font-bold text-sm lg:block hidden">{label}</span>
      {!active && (
        <div className="absolute right-2 w-1.5 h-1.5 rounded-full bg-primary scale-0 group-hover:scale-100 transition-transform hidden lg:block" />
      )}
    </button>
  );
}
