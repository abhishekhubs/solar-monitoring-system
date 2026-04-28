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

const statusConfig = {
  normal:  { label: 'Normal',  icon: ShieldCheck, cls: 'status-normal'  },
  warning: { label: 'Warning', icon: AlertTriangle, cls: 'status-warning' },
  fault:   { label: 'Fault',   icon: XCircle,    cls: 'status-fault'   },
};

export function SolarPanelCard({ panel }: { panel: SolarPanel }) {
  const cfg = statusConfig[panel.status] || statusConfig.normal;
  const StatusIcon = cfg.icon;

  const formatTime = (ts: string) =>
    new Date(ts).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className="card flex flex-col gap-0 overflow-hidden"
      style={{ transition: 'box-shadow 0.15s' }}
      onMouseEnter={e => (e.currentTarget.style.boxShadow = 'var(--shadow-md)')}
      onMouseLeave={e => (e.currentTarget.style.boxShadow = 'var(--shadow-sm)')}
    >
      {/* Header */}
      <div
        className="flex items-center justify-between px-4 py-3"
        style={{ borderBottom: '1px solid var(--border)' }}
      >
        <div className="flex items-center gap-2.5">
          <div
            className="flex items-center justify-center w-8 h-8 rounded-lg"
            style={{ background: 'var(--accent-subtle)' }}
          >
            <Sun className="w-4 h-4" style={{ color: 'var(--accent)' }} />
          </div>
          <div>
            <p className="font-semibold text-sm" style={{ color: 'var(--text-primary)', lineHeight: 1.2 }}>
              {panel.id}
            </p>
            <p className="text-[11px] mono" style={{ color: 'var(--text-muted)' }}>
              {formatTime(panel.timestamp)}
            </p>
          </div>
        </div>
        <span className={`status-badge ${cfg.cls}`}>
          <StatusIcon className="w-3 h-3" />
          {cfg.label}
        </span>
      </div>

      {/* Metrics grid */}
      <div className="grid grid-cols-2 gap-px" style={{ background: 'var(--border)' }}>
        {[
          { label: 'Power',       value: `${panel.power.toFixed(1)} W`,  icon: Zap },
          { label: 'Temperature', value: `${panel.temperature.toFixed(1)} °C`, icon: Thermometer },
          { label: 'Voltage',     value: `${panel.voltage.toFixed(2)} V`, icon: null },
          { label: 'Current',     value: `${panel.current.toFixed(2)} A`, icon: null },
        ].map(({ label, value, icon: Icon }) => (
          <div key={label} className="px-4 py-3" style={{ background: 'var(--bg-surface)' }}>
            <p className="kpi-label">{label}</p>
            <p className="font-semibold text-sm mt-0.5" style={{ color: 'var(--text-primary)' }}>
              {value}
            </p>
          </div>
        ))}
      </div>

      {/* Faults */}
      {panel.faults.length > 0 && (
        <div
          className="px-4 py-3"
          style={{
            background: 'var(--danger-subtle)',
            borderTop: '1px solid var(--danger-border)',
          }}
        >
          <p
            className="text-[11px] font-bold uppercase tracking-wider mb-2"
            style={{ color: 'var(--danger)' }}
          >
            Detected Faults
          </p>
          <div className="flex flex-wrap gap-1">
            {panel.faults.map((fault, i) => (
              <span
                key={i}
                className="chip"
                style={{
                  background: 'var(--danger-subtle)',
                  color: 'var(--danger)',
                  borderColor: 'var(--danger-border)',
                }}
              >
                {fault.replace(/_/g, ' ')}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Footer */}
      <div
        className="flex items-center gap-1.5 px-4 py-2"
        style={{
          borderTop: '1px solid var(--border)',
          background: 'var(--bg-subtle)',
        }}
      >
        <Activity className="w-3 h-3" style={{ color: 'var(--text-disabled)' }} />
        <span className="text-[11px]" style={{ color: 'var(--text-muted)' }}>
          Live tracking
        </span>
      </div>
    </motion.div>
  );
}
