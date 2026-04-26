import { motion } from 'framer-motion';
import { Battery, Zap, ArrowDown, ArrowUp, Shield } from 'lucide-react';

export default function Storage() {
  const batteryStats = [
    { label: 'Total Capacity', value: '124 kWh', icon: <Battery />, color: 'text-primary' },
    { label: 'Current Charge', value: '82%', icon: <Zap />, color: 'text-amber-400' },
    { label: 'Discharge Rate', value: '4.2 kW', icon: <ArrowDown />, color: 'text-rose-400' },
    { label: 'System Health', value: 'Optimal', icon: <Shield />, color: 'text-emerald-400' },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-8"
    >
      <header>
        <h1 className="text-3xl font-black tracking-tight text-white mb-2">Energy Storage Systems</h1>
        <p className="text-slate-400 font-medium">Monitoring Tesla Powerwall cluster & distribution nodes</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {batteryStats.map((stat, i) => (
          <div key={i} className="glass p-6 rounded-3xl border-white/5">
            <div className={`p-3 rounded-2xl bg-white/5 w-fit mb-4 ${stat.color}`}>
              {stat.icon}
            </div>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">{stat.label}</p>
            <p className="text-2xl font-black text-white">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="glass p-8 rounded-3xl">
          <h3 className="text-xl font-bold mb-6">Charge Cycle History</h3>
          <div className="space-y-6">
            {[1, 2, 3, 4].map((_, i) => (
              <div key={i} className="flex items-center justify-between p-4 rounded-2xl bg-white/5">
                <div className="flex items-center gap-4">
                  <div className={`p-2 rounded-lg ${i % 2 === 0 ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400'}`}>
                    {i % 2 === 0 ? <ArrowUp size={16} /> : <ArrowDown size={16} />}
                  </div>
                  <div>
                    <p className="font-bold text-sm">{i % 2 === 0 ? 'Charge Cycle' : 'Discharge Cycle'}</p>
                    <p className="text-xs text-slate-500">Node Cluster {i + 1}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-sm">{i % 2 === 0 ? '+12.4 kWh' : '-8.2 kWh'}</p>
                  <p className="text-xs text-slate-500">2h ago</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="glass p-8 rounded-3xl flex flex-col justify-center items-center text-center">
          <div className="relative w-48 h-48 mb-8">
            <svg className="w-full h-full" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeWidth="8" className="text-white/5" />
              <motion.circle 
                cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeWidth="8" 
                strokeDasharray="283"
                initial={{ strokeDashoffset: 283 }}
                animate={{ strokeDashoffset: 283 - (283 * 0.82) }}
                transition={{ duration: 1.5, ease: "easeOut" }}
                className="text-primary"
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-4xl font-black">82%</span>
              <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Charged</span>
            </div>
          </div>
          <h3 className="text-xl font-bold mb-2">Battery Optimization</h3>
          <p className="text-slate-400 text-sm max-w-xs">AI-driven load balancing active to preserve lithium-ion lifecycle.</p>
          <button className="mt-8 w-full py-4 rounded-2xl bg-white/5 border border-white/10 font-bold hover:bg-white/10 transition-all active:scale-95">
            Optimize Now
          </button>
        </div>
      </div>
    </motion.div>
  );
}
