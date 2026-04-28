import { motion } from 'framer-motion';
import { Battery, Zap, ArrowDown, ArrowUp, Shield } from 'lucide-react';

const STATS = [
  { label: 'Total Capacity',  value: '124 kWh', icon: Battery, accent: '#1d4ed8', bg: 'var(--accent-subtle)' },
  { label: 'Current Charge',  value: '82%',     icon: Zap,     accent: '#b45309', bg: 'var(--warning-subtle)' },
  { label: 'Discharge Rate',  value: '4.2 kW',  icon: ArrowDown, accent: '#dc2626', bg: 'var(--danger-subtle)' },
  { label: 'System Health',   value: 'Optimal', icon: Shield,  accent: '#16a34a', bg: 'var(--success-subtle)' },
];

const CYCLES = [
  { type: 'Charge',    cluster: 1, delta: '+12.4 kWh', time: '2h ago',  up: true },
  { type: 'Discharge', cluster: 2, delta: '−8.2 kWh',  time: '3h ago',  up: false },
  { type: 'Charge',    cluster: 3, delta: '+9.1 kWh',  time: '5h ago',  up: true },
  { type: 'Discharge', cluster: 4, delta: '−6.8 kWh',  time: '7h ago',  up: false },
];

export default function Storage() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
      className="space-y-6"
    >
      {/* Header */}
      <div>
        <h1 className="text-lg font-bold" style={{ color: 'var(--text-primary)', letterSpacing: '-0.01em' }}>
          Energy Storage Systems
        </h1>
        <p className="text-sm mt-0.5" style={{ color: 'var(--text-muted)' }}>
          Monitoring Tesla Powerwall cluster & distribution nodes
        </p>
      </div>

      {/* KPI row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {STATS.map(({ label, value, icon: Icon, accent, bg }) => (
          <div key={label} className="card px-5 py-4">
            <div
              className="flex items-center justify-center w-9 h-9 rounded-lg mb-3"
              style={{ background: bg }}
            >
              <Icon className="w-4 h-4" style={{ color: accent }} />
            </div>
            <p className="kpi-label">{label}</p>
            <p className="kpi-value">{value}</p>
          </div>
        ))}
      </div>

      {/* Cycle history + ring */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">

        {/* Cycle log */}
        <div className="card overflow-hidden">
          <div
            className="px-5 py-3.5"
            style={{ borderBottom: '1px solid var(--border)', background: 'var(--bg-subtle)' }}
          >
            <p className="section-title">Charge Cycle History</p>
          </div>
          <div className="divide-y" style={{ borderColor: 'var(--border)' }}>
            {CYCLES.map((c, i) => (
              <div
                key={i}
                className="flex items-center gap-4 px-5 py-3.5"
                style={{ borderBottom: i < CYCLES.length - 1 ? '1px solid var(--border)' : 'none' }}
              >
                <div
                  className="flex items-center justify-center w-8 h-8 rounded-lg shrink-0"
                  style={{
                    background: c.up ? 'var(--success-subtle)' : 'var(--danger-subtle)',
                    border: `1px solid ${c.up ? 'var(--success-border)' : 'var(--danger-border)'}`,
                  }}
                >
                  {c.up
                    ? <ArrowUp className="w-3.5 h-3.5" style={{ color: 'var(--success)' }} />
                    : <ArrowDown className="w-3.5 h-3.5" style={{ color: 'var(--danger)' }} />}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
                    {c.type} Cycle
                  </p>
                  <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
                    Node Cluster {c.cluster}
                  </p>
                </div>
                <div className="text-right shrink-0">
                  <p
                    className="text-sm font-semibold mono"
                    style={{ color: c.up ? 'var(--success)' : 'var(--danger)' }}
                  >
                    {c.delta}
                  </p>
                  <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
                    {c.time}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Battery ring */}
        <div className="card flex flex-col items-center justify-center py-10 gap-6">
          <div className="relative w-40 h-40">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="42" fill="none" stroke="var(--border)" strokeWidth="8" />
              <motion.circle
                cx="50" cy="50" r="42" fill="none"
                stroke="#1d4ed8" strokeWidth="8"
                strokeDasharray={String(2 * Math.PI * 42)}
                initial={{ strokeDashoffset: 2 * Math.PI * 42 }}
                animate={{ strokeDashoffset: 2 * Math.PI * 42 * (1 - 0.82) }}
                transition={{ duration: 1.4, ease: 'easeOut' }}
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-3xl font-bold" style={{ color: 'var(--text-primary)', letterSpacing: '-0.03em' }}>
                82%
              </span>
              <span className="kpi-label mt-0.5">Charged</span>
            </div>
          </div>

          <div className="text-center px-6">
            <p className="text-sm font-semibold mb-1" style={{ color: 'var(--text-primary)' }}>
              Battery Optimization
            </p>
            <p className="text-xs leading-relaxed" style={{ color: 'var(--text-muted)' }}>
              AI-driven load balancing active to preserve lithium-ion lifecycle and maximize storage efficiency.
            </p>
          </div>

          <button className="btn-secondary w-[200px]">
            Optimize Now
          </button>
        </div>
      </div>
    </motion.div>
  );
}
