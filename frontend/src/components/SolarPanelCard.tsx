import { motion } from 'framer-motion';
import { Activity, Thermometer, Zap, Sun, AlertTriangle, ShieldCheck, XCircle } from 'lucide-react';

export interface SolarPanel {
  id: string;
  timestamp: string;
  voltage: number;
  current: number;
  power: number;
  temperature: number;
  irradiance: number;
  status: 'normal' | 'warning' | 'fault';
  faults: string[];
}

export function SolarPanelCard({ panel }: { panel: SolarPanel }) {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'normal': return <ShieldCheck className="w-5 h-5 text-emerald-400" />;
      case 'warning': return <AlertTriangle className="w-5 h-5 text-amber-400" />;
      case 'fault': return <XCircle className="w-5 h-5 text-rose-400" />;
      default: return <Activity className="w-5 h-5 text-slate-400" />;
    }
  };

  const getStatusClass = (status: string) => {
    switch (status) {
      case 'normal': return 'status-normal';
      case 'warning': return 'status-warning';
      case 'fault': return 'status-fault';
      default: return '';
    }
  };

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02 }}
      className="glass glass-hover p-6 rounded-2xl flex flex-col gap-4 relative overflow-hidden group"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-white/5 group-hover:bg-primary/20 transition-colors">
            <Sun className="w-6 h-6 text-primary" />
          </div>
          <h3 className="text-lg font-bold text-slate-100">{panel.id}</h3>
        </div>
        <div className={`status-badge ${getStatusClass(panel.status)} flex items-center gap-1.5`}>
          {getStatusIcon(panel.status)}
          <span>{panel.status}</span>
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-4 mt-2">
        <div className="space-y-1">
          <div className="flex items-center gap-1.5 text-slate-400 text-xs">
            <Zap className="w-3 h-3" />
            <span>Power Output</span>
          </div>
          <p className="text-xl font-bold text-slate-100">{panel.power.toFixed(1)} <span className="text-sm font-medium text-slate-400">W</span></p>
        </div>
        
        <div className="space-y-1">
          <div className="flex items-center gap-1.5 text-slate-400 text-xs">
            <Thermometer className="w-3 h-3" />
            <span>Temperature</span>
          </div>
          <p className="text-xl font-bold text-slate-100">{panel.temperature.toFixed(1)}<span className="text-sm font-medium text-slate-400">°C</span></p>
        </div>

        <div className="space-y-1">
          <p className="text-[10px] uppercase tracking-wider text-slate-500 font-bold">Voltage</p>
          <p className="text-md font-semibold text-slate-200">{panel.voltage.toFixed(2)} V</p>
        </div>

        <div className="space-y-1">
          <p className="text-[10px] uppercase tracking-wider text-slate-500 font-bold">Current</p>
          <p className="text-md font-semibold text-slate-200">{panel.current.toFixed(2)} A</p>
        </div>
      </div>

      {panel.faults.length > 0 && (
        <div className="mt-2 p-3 rounded-xl bg-rose-500/10 border border-rose-500/20">
          <p className="text-[10px] uppercase tracking-wider text-rose-400 font-bold mb-2">Detected Faults</p>
          <div className="flex flex-wrap gap-1.5">
            {panel.faults.map((fault, index) => (
              <span key={index} className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-rose-500/20 text-rose-400 border border-rose-500/30">
                {fault.replace('_', ' ')}
              </span>
            ))}
          </div>
        </div>
      )}

      <div className="mt-auto pt-4 flex items-center justify-between border-t border-white/5">
        <div className="flex items-center gap-1.5 text-[10px] text-slate-500 font-medium">
          <Activity className="w-3 h-3 animate-pulse-soft" />
          <span>Real-time tracking</span>
        </div>
        <p className="text-[10px] text-slate-500 font-mono">
          {formatTime(panel.timestamp)}
        </p>
      </div>
    </motion.div>
  );
}
