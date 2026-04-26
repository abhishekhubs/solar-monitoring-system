import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, XCircle, Info, ChevronRight } from 'lucide-react';

interface Alert {
  panelId: string;
  status: 'warning' | 'fault';
  faults: string[];
  timestamp: string;
}

export function AlertPanel({ alerts }: { alerts: Alert[] }) {
  if (alerts.length === 0) {
    return (
      <div className="glass p-6 rounded-3xl flex items-center gap-4 border-emerald-500/20 bg-emerald-500/5">
        <div className="p-3 rounded-2xl bg-emerald-500/20">
          <Info className="w-6 h-6 text-emerald-400" />
        </div>
        <div>
          <h3 className="text-lg font-bold text-emerald-400">System Optimal</h3>
          <p className="text-slate-400 text-sm">All solar units are operating within normal parameters.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between px-2">
        <h2 className="text-xl font-bold text-slate-100 flex items-center gap-2">
          System Alerts
          <span className="px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-500 text-xs font-bold">
            {alerts.length}
          </span>
        </h2>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <AnimatePresence mode="popLayout">
          {alerts.map((alert, index) => (
            <motion.div
              key={`${alert.panelId}-${alert.timestamp}`}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className={`glass p-5 rounded-2xl border-l-4 ${
                alert.status === 'fault' ? 'border-l-rose-500' : 'border-l-amber-500'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex gap-3">
                  <div className={`p-2 rounded-lg ${
                    alert.status === 'fault' ? 'bg-rose-500/10' : 'bg-amber-500/10'
                  }`}>
                    {alert.status === 'fault' ? (
                      <XCircle className="w-5 h-5 text-rose-500" />
                    ) : (
                      <AlertTriangle className="w-5 h-5 text-amber-500" />
                    )}
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-100">{alert.panelId}</h4>
                    <p className={`text-xs font-bold uppercase tracking-wider ${
                      alert.status === 'fault' ? 'text-rose-500' : 'text-amber-500'
                    }`}>
                      {alert.status} Detected
                    </p>
                  </div>
                </div>
                <button className="p-1 hover:bg-white/5 rounded-lg transition-colors">
                  <ChevronRight className="w-4 h-4 text-slate-500" />
                </button>
              </div>
              
              <div className="mt-4 flex flex-wrap gap-1.5">
                {alert.faults.map((fault, i) => (
                  <span key={i} className="text-[10px] px-2 py-0.5 rounded-md bg-white/5 text-slate-400 font-medium">
                    {fault.replace('_', ' ')}
                  </span>
                ))}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
