import { useState, useEffect } from 'react';
import Head from 'next/head';
import { motion } from 'framer-motion';
import { SolarPanelCard, SolarPanel } from '@/components/SolarPanelCard';
import { RealTimeChart } from '@/components/RealTimeChart';
import { AlertPanel } from '@/components/AlertPanel';
import { 
  LayoutDashboard, 
  Battery, 
  TrendingUp, 
  AlertCircle, 
  Settings, 
  LogOut,
  Zap,
  Activity,
  Cpu
} from 'lucide-react';

export default function Dashboard() {
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
      // Fetch panels
      const panelRes = await fetch('http://localhost:8000/api/solar/panels');
      const panelData = await panelRes.json();
      
      // Defensive check: Ensure panelData is an array
      if (Array.isArray(panelData)) {
        setPanels(panelData);
        
        // Extract alerts
        const newAlerts = panelData
          .filter((panel: SolarPanel) => panel.status !== 'normal')
          .map((panel: SolarPanel) => ({
            panelId: panel.id,
            status: panel.status,
            faults: panel.faults,
            timestamp: panel.timestamp
          }));
        setAlerts(newAlerts);
      } else {
        console.warn('Received non-array data from /api/solar/panels:', panelData);
      }
      
      // Fetch stats
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

  if (loading && panels.length === 0) {
    return (
      <div className="flex flex-col justify-center items-center h-screen gap-4 bg-[#0a0a0c]">
        <div className="w-16 h-16 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
        <p className="text-slate-400 font-medium animate-pulse">Initializing Neural Link...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen text-slate-100 flex">
      <Head>
        <title>Helios | Smart Solar Monitoring</title>
      </Head>

      {/* Sidebar - Desktop */}
      <aside className="w-20 lg:w-64 border-r border-white/5 bg-black/20 backdrop-blur-xl hidden md:flex flex-col p-6 sticky top-0 h-screen">
        <div className="flex items-center gap-3 mb-10 px-2">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-lg shadow-primary/20">
            <Zap className="w-6 h-6 text-white" />
          </div>
          <span className="text-xl font-black tracking-tighter lg:block hidden">HELIOS</span>
        </div>

        <nav className="space-y-2 flex-1">
          <NavItem icon={<LayoutDashboard className="w-5 h-5" />} label="Dashboard" active />
          <NavItem icon={<Battery className="w-5 h-5" />} label="Storage" />
          <NavItem icon={<TrendingUp className="w-5 h-5" />} label="Analytics" />
          <NavItem icon={<Cpu className="w-5 h-5" />} label="ML Models" />
          <NavItem icon={<AlertCircle className="w-5 h-5" />} label="Incidents" />
        </nav>

        <div className="pt-6 border-t border-white/5 space-y-2">
          <NavItem icon={<Settings className="w-5 h-5" />} label="Settings" />
          <NavItem icon={<LogOut className="w-5 h-5" />} label="Sign Out" />
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-4 md:p-8 lg:p-12 max-w-[1600px] mx-auto w-full">
        <header className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-4">
          <div>
            <h1 className="text-3xl font-black tracking-tight text-white mb-2">Solar Network Overview</h1>
            <p className="text-slate-400 font-medium flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              Operational Efficiency: <span className="text-emerald-400">{stats ? (stats.system_efficiency * 100).toFixed(1) : '94.2'}%</span>
            </p>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="glass px-4 py-2 rounded-xl flex items-center gap-3 border-white/10">
              <div className="text-right">
                <p className="text-[10px] uppercase tracking-widest text-slate-500 font-bold">System Load</p>
                <p className="text-sm font-bold">4.2 kW</p>
              </div>
              <div className="w-10 h-1 h-10 rounded-full bg-white/5 relative overflow-hidden hidden lg:block">
                <div className="absolute bottom-0 left-0 right-0 bg-primary h-[60%]" />
              </div>
            </div>
            <button className="bg-primary hover:bg-primary/90 text-white px-6 py-2.5 rounded-xl font-bold transition-all shadow-lg shadow-primary/20 active:scale-95">
              Generate Report
            </button>
          </div>
        </header>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          <StatCard 
            title="Energy Produced" 
            value={stats ? `${stats.total_energy_today} kWh` : "84.2 kWh"} 
            trend="+12.4%" 
            icon={<TrendingUp className="w-5 h-5" />}
            color="text-emerald-400"
          />
          <StatCard 
            title="Active Panels" 
            value={stats ? stats.active_panels : "10"} 
            trend="100%" 
            icon={<Activity className="w-5 h-5" />}
            color="text-primary"
          />
          <StatCard 
            title="Fault Alerts" 
            value={alerts.length} 
            trend={alerts.length > 0 ? "Action Required" : "No Issues"} 
            icon={<AlertCircle className="w-5 h-5" />}
            color={alerts.length > 0 ? "text-rose-500" : "text-slate-400"}
          />
          <StatCard 
            title="Peak Power" 
            value={stats ? `${stats.peak_power} W` : "2,840 W"} 
            trend="Today" 
            icon={<Zap className="w-5 h-5" />}
            color="text-amber-400"
          />
        </div>

        {/* Alerts Section */}
        <section className="mb-10">
          <AlertPanel alerts={alerts} />
        </section>

        {/* Charts & Analytics */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-10">
          <div className="lg:col-span-2">
            <RealTimeChart panels={panels} />
          </div>
          <div className="glass p-8 rounded-3xl flex flex-col justify-between">
            <div>
              <h3 className="text-xl font-bold mb-2">Network Health</h3>
              <p className="text-slate-400 text-sm mb-6">Diagnostic summary across active nodes</p>
              
              <div className="space-y-6">
                <HealthMetric label="Inverter Integrity" value={98} color="bg-emerald-500" />
                <HealthMetric label="Grid Connection" value={100} color="bg-emerald-500" />
                <HealthMetric label="Storage Capacity" value={64} color="bg-primary" />
                <HealthMetric label="ML Confidence" value={89} color="bg-secondary" />
              </div>
            </div>
            
            <div className="mt-8 p-4 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                  <Zap className="w-4 h-4 text-primary" />
                </div>
                <span className="text-xs font-bold">Predictive AI Active</span>
              </div>
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            </div>
          </div>
        </div>

        {/* Panels Grid */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-black tracking-tight">Active Solar Units</h2>
            <div className="flex gap-2">
              <button className="px-4 py-1.5 rounded-lg bg-white/5 text-xs font-bold hover:bg-white/10 transition-colors">All</button>
              <button className="px-4 py-1.5 rounded-lg text-xs font-bold text-slate-500">Faulty</button>
              <button className="px-4 py-1.5 rounded-lg text-xs font-bold text-slate-500">Offline</button>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {panels.map((panel) => (
              <SolarPanelCard key={panel.id} panel={panel} />
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}

function NavItem({ icon, label, active = false }: { icon: any, label: string, active?: boolean }) {
  return (
    <button className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all ${
      active ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'text-slate-400 hover:bg-white/5 hover:text-white'
    }`}>
      {icon}
      <span className="font-bold text-sm lg:block hidden">{label}</span>
    </button>
  );
}

function StatCard({ title, value, trend, icon, color }: any) {
  return (
    <div className="glass p-6 rounded-3xl flex flex-col gap-4 border-white/5 hover:border-white/10 transition-colors">
      <div className="flex items-center justify-between">
        <div className={`p-2 rounded-xl bg-white/5 ${color}`}>
          {icon}
        </div>
        <span className={`text-[10px] font-black tracking-widest uppercase ${color}`}>{trend}</span>
      </div>
      <div>
        <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">{title}</p>
        <p className="text-2xl font-black text-white">{value}</p>
      </div>
    </div>
  );
}

function HealthMetric({ label, value, color }: any) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-xs font-bold">
        <span className="text-slate-400">{label}</span>
        <span>{value}%</span>
      </div>
      <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
        <motion.div 
          initial={{ width: 0 }}
          animate={{ width: `${value}%` }}
          className={`h-full ${color}`} 
        />
      </div>
    </div>
  );
}
