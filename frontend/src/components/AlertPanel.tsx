import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, XCircle, CheckCircle, ChevronRight } from 'lucide-react';

interface Alert {
  panelId: string;
  status: 'warning' | 'fault';
  faults: string[];
  timestamp: string;
}

export function AlertPanel({ alerts }: { alerts: Alert[] }) {
  if (alerts.length === 0) {
    return (
      <div
        className="flex items-center gap-3 px-4 py-3 rounded-lg"
        style={{
          background: 'var(--success-subtle)',
          border: '1px solid var(--success-border)',
        }}
      >
        <CheckCircle className="w-4 h-4 shrink-0" style={{ color: 'var(--success)' }} />
        <div>
          <p className="text-sm font-semibold" style={{ color: 'var(--success)' }}>
            All Systems Normal
          </p>
          <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>
            All solar units are operating within expected parameters.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="card overflow-hidden">
      <div
        className="flex items-center justify-between px-5 py-3"
        style={{ borderBottom: '1px solid var(--border)', background: 'var(--bg-subtle)' }}
      >
        <div className="flex items-center gap-2">
          <p className="section-title">Active Alerts</p>
          <span className="badge badge-danger">{alerts.length}</span>
        </div>
        <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
          Requires attention
        </p>
      </div>

      <div className="divide-y" style={{ ['--tw-divide-opacity' as any]: 1 }}>
        <AnimatePresence>
          {alerts.map((alert, index) => (
            <motion.div
              key={`${alert.panelId}-${alert.timestamp}`}
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="flex items-start gap-4 px-5 py-4"
              style={{ borderBottom: '1px solid var(--border)' }}
            >
              <div
                className="flex items-center justify-center w-8 h-8 rounded-lg shrink-0 mt-0.5"
                style={{
                  background: alert.status === 'fault' ? 'var(--danger-subtle)' : 'var(--warning-subtle)',
                  border: `1px solid ${alert.status === 'fault' ? 'var(--danger-border)' : 'var(--warning-border)'}`,
                }}
              >
                {alert.status === 'fault'
                  ? <XCircle className="w-4 h-4" style={{ color: 'var(--danger)' }} />
                  : <AlertTriangle className="w-4 h-4" style={{ color: 'var(--warning)' }} />}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <p className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
                    {alert.panelId}
                  </p>
                  <span className={`badge ${alert.status === 'fault' ? 'badge-danger' : 'badge-warning'}`}>
                    {alert.status}
                  </span>
                </div>
                <div className="flex flex-wrap gap-1">
                  {alert.faults.map((fault, i) => (
                    <span key={i} className="chip">
                      {fault.replace(/_/g, ' ')}
                    </span>
                  ))}
                </div>
              </div>

              <button className="btn-icon shrink-0 mt-0.5">
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
