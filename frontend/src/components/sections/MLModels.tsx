import { useState } from 'react';
import { motion } from 'framer-motion';
import { ShieldAlert, Activity, Zap, Layers, RefreshCw, BarChart } from 'lucide-react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const TIME_RANGES = ['1D', '1W', '1M', '1Y'] as const;
type Range = typeof TIME_RANGES[number];

const DIST_DATA: Record<Range, number[]> = {
  '1D': [1, 3, 8, 22, 66],
  '1W': [2, 5, 12, 28, 53],
  '1M': [5, 8, 15, 32, 40],
  '1Y': [10, 15, 20, 25, 30],
};

const MODELS = [
  {
    name: 'FaultGuard-V3',
    type: 'Classification',
    accuracy: 99.2,
    latency: '12 ms',
    status: 'Online',
    icon: ShieldAlert,
    accent: '#dc2626',
    accentBg: 'var(--danger-subtle)',
    accentBorder: 'var(--danger-border)',
  },
  {
    name: 'YieldPredictor',
    type: 'Regression',
    accuracy: 94.5,
    latency: '45 ms',
    status: 'Training',
    icon: Activity,
    accent: '#1d4ed8',
    accentBg: 'var(--accent-subtle)',
    accentBorder: 'var(--accent-border)',
  },
  {
    name: 'GridBalancer',
    type: 'Reinforcement',
    accuracy: 88.9,
    latency: '28 ms',
    status: 'Online',
    icon: Zap,
    accent: '#b45309',
    accentBg: 'var(--warning-subtle)',
    accentBorder: 'var(--warning-border)',
  },
];

const LOGS = [
  { model: 'FaultGuard-V3', date: '2024-04-25', metric: '+1.2% Accuracy', note: 'Retrained on dataset 04-X', color: 'var(--success)', bg: 'var(--success-subtle)', border: 'var(--success-border)' },
  { model: 'YieldPredictor', date: '2024-04-24', metric: '−0.4% Latency', note: 'Pruning optimization applied', color: 'var(--accent)', bg: 'var(--accent-subtle)', border: 'var(--accent-border)' },
  { model: 'GridBalancer',  date: '2024-04-22', metric: 'Node Sync',     note: 'Synchronized with regional grid', color: '#7c3aed', bg: '#f5f3ff', border: '#ddd6fe' },
];

export default function MLModels() {
  const [range, setRange] = useState<Range>('1W');

  const barData = {
    labels: ['0–20%', '20–40%', '40–60%', '60–80%', '80–100%'],
    datasets: [{
      label: 'Inferences (%)',
      data: DIST_DATA[range],
      backgroundColor: ['rgba(220,38,38,0.15)','rgba(245,158,11,0.15)','rgba(14,165,233,0.15)','rgba(99,102,241,0.15)','rgba(22,163,74,0.15)'],
      borderColor:      ['#dc2626','#f59e0b','#0ea5e9','#6366f1','#16a34a'],
      borderWidth: 2,
      borderRadius: 6,
    }],
  };

  const barOpts = {
    responsive: true,
    maintainAspectRatio: false,
    animation: { duration: 800 },
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: '#fff',
        titleColor: '#0f172a',
        bodyColor: '#475569',
        borderColor: '#e2e8f0',
        borderWidth: 1,
        padding: 10,
        cornerRadius: 8,
        titleFont: { family: 'Inter', size: 12, weight: '600' },
        bodyFont: { family: 'Inter', size: 12 },
        callbacks: { label: (ctx: any) => `${ctx.raw}% of inferences` },
      },
    },
    scales: {
      y: {
        grid: { color: '#f1f5f9', drawBorder: false },
        border: { display: false },
        ticks: { color: '#94a3b8', font: { family: 'Inter', size: 11 }, padding: 8 },
      },
      x: {
        grid: { display: false },
        border: { display: false },
        ticks: { color: '#94a3b8', font: { family: 'Inter', size: 11 }, padding: 8 },
      },
    },
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-bold" style={{ color: 'var(--text-primary)', letterSpacing: '-0.01em' }}>
            Neural Link Diagnostics
          </h1>
          <p className="text-sm mt-0.5" style={{ color: 'var(--text-muted)' }}>
            Machine learning models for fault detection & yield prediction
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="badge badge-success">
            <span className="live-dot" style={{ width: '6px', height: '6px' }} />
            All Models Active
          </span>
          <button className="btn-icon">
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Model cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {MODELS.map(({ name, type, accuracy, latency, status, icon: Icon, accent, accentBg, accentBorder }) => (
          <div key={name} className="card overflow-hidden">
            {/* Top accent strip */}
            <div style={{ height: '3px', background: accent }} />
            <div className="px-5 py-4">
              <div className="flex items-start justify-between mb-4">
                <div
                  className="flex items-center justify-center w-9 h-9 rounded-lg"
                  style={{ background: accentBg, border: `1px solid ${accentBorder}` }}
                >
                  <Icon className="w-4 h-4" style={{ color: accent }} />
                </div>
                <span
                  className="badge"
                  style={{
                    background: status === 'Online' ? 'var(--success-subtle)' : 'var(--warning-subtle)',
                    color: status === 'Online' ? 'var(--success)' : 'var(--warning)',
                    borderColor: status === 'Online' ? 'var(--success-border)' : 'var(--warning-border)',
                  }}
                >
                  <span
                    className="live-dot"
                    style={{
                      width: '5px', height: '5px',
                      background: status === 'Online' ? 'var(--success)' : 'var(--warning)',
                    }}
                  />
                  {status}
                </span>
              </div>
              <p className="font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>{name}</p>
              <p className="kpi-label mt-0.5">{type}</p>

              <div
                className="grid grid-cols-2 gap-3 mt-4 pt-4"
                style={{ borderTop: '1px solid var(--border)' }}
              >
                <div>
                  <p className="kpi-label">Precision</p>
                  <p className="text-base font-bold mono mt-0.5" style={{ color: accent }}>
                    {accuracy}%
                  </p>
                </div>
                <div>
                  <p className="kpi-label">Latency</p>
                  <p className="text-base font-bold mono mt-0.5" style={{ color: 'var(--text-primary)' }}>
                    {latency}
                  </p>
                </div>
              </div>
            </div>
            <div
              className="px-5 py-2.5"
              style={{ borderTop: '1px solid var(--border)', background: 'var(--bg-subtle)' }}
            >
              <button className="text-xs font-semibold" style={{ color: 'var(--accent)' }}>
                View diagnostics →
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Chart + Log */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">

        {/* Bar chart */}
        <div className="card overflow-hidden" style={{ height: '380px', display: 'flex', flexDirection: 'column' }}>
          <div
            className="flex items-center justify-between px-5 py-3.5 shrink-0"
            style={{ borderBottom: '1px solid var(--border)' }}
          >
            <div className="flex items-center gap-2">
              <BarChart className="w-4 h-4" style={{ color: 'var(--accent)' }} />
              <p className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
                Confidence Distribution
              </p>
            </div>
            <div
              className="flex p-0.5 rounded-md gap-0.5"
              style={{ background: 'var(--bg-muted)', border: '1px solid var(--border)' }}
            >
              {TIME_RANGES.map(t => (
                <button
                  key={t}
                  onClick={() => setRange(t)}
                  className="px-3 py-1 rounded text-xs font-semibold transition-colors"
                  style={{
                    background: t === range ? 'var(--bg-surface)' : 'transparent',
                    color: t === range ? 'var(--accent)' : 'var(--text-muted)',
                    boxShadow: t === range ? 'var(--shadow-xs)' : 'none',
                  }}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>
          <div className="flex-1 px-4 py-4">
            <Bar data={barData} options={barOpts as any} />
          </div>
        </div>

        {/* Model lifecycle log */}
        <div className="card overflow-hidden">
          <div
            className="flex items-center gap-2 px-5 py-3.5"
            style={{ borderBottom: '1px solid var(--border)', background: 'var(--bg-subtle)' }}
          >
            <Layers className="w-4 h-4" style={{ color: 'var(--text-muted)' }} />
            <p className="section-title">Model Lifecycle Logs</p>
          </div>
          <div>
            {LOGS.map((log, i) => (
              <div
                key={i}
                className="flex items-start justify-between px-5 py-4"
                style={{ borderBottom: i < LOGS.length - 1 ? '1px solid var(--border)' : 'none' }}
              >
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
                    {log.model}
                  </p>
                  <p className="text-xs mono mt-0.5" style={{ color: 'var(--text-muted)' }}>
                    {log.date}
                  </p>
                  <p className="text-xs mt-1" style={{ color: 'var(--text-secondary)' }}>
                    {log.note}
                  </p>
                </div>
                <span
                  className="badge shrink-0 ml-3 mt-0.5"
                  style={{ background: log.bg, color: log.color, borderColor: log.border }}
                >
                  {log.metric}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
