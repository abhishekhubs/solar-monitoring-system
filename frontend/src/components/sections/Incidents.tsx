import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  AlertCircle, Filter, CheckCircle2, AlertTriangle, XCircle, Clock, BarChart3, TrendingDown
} from 'lucide-react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const TIME_RANGES = ['1D', '1W', '1M', '1Y'] as const;
type Range = typeof TIME_RANGES[number];

type Incident = {
  id: string; panel: string; type: string;
  status: 'Active' | 'Resolved'; severity: string; time: string;
};

const BASE_INCIDENTS: Incident[] = [
  { id: 'INC-2941', panel: 'Panel_01', type: 'Soiling',      status: 'Active',   severity: 'Low',      time: '10m ago'    },
  { id: 'INC-2940', panel: 'Panel_04', type: 'Shadowing',    status: 'Resolved', severity: 'Medium',   time: '2h ago'     },
  { id: 'INC-2938', panel: 'Panel_08', type: 'Hot Spot',     status: 'Active',   severity: 'High',     time: '5h ago'     },
];

const WEEK_EXTRA: Incident[] = [
  { id: 'INC-2935', panel: 'Panel_02', type: 'Normal',       status: 'Resolved', severity: 'None',     time: 'Yesterday'  },
  { id: 'INC-2931', panel: 'Panel_05', type: 'Short Circuit',status: 'Resolved', severity: 'Critical', time: '2 days ago' },
];

const MONTH_EXTRA: Incident[] = [
  { id: 'INC-2812', panel: 'Panel_12', type: 'Dust',         status: 'Resolved', severity: 'Low',      time: '2 weeks ago'},
  { id: 'INC-2705', panel: 'Panel_06', type: 'Inverter Fail',status: 'Resolved', severity: 'High',     time: '1 month ago'},
];

const INCIDENTS: Record<Range, Incident[]> = {
  '1D': BASE_INCIDENTS,
  '1W': [...BASE_INCIDENTS, ...WEEK_EXTRA],
  '1M': [...BASE_INCIDENTS, ...WEEK_EXTRA, ...MONTH_EXTRA],
  '1Y': [...BASE_INCIDENTS, ...WEEK_EXTRA, ...MONTH_EXTRA],
};

const MTTR_LABELS: Record<Range, string[]> = {
  '1D': ['6AM','9AM','12PM','3PM','6PM','9PM','12AM'],
  '1W': ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'],
  '1M': ['W1','W2','W3','W4'],
  '1Y': ['J','F','M','A','M','J','J','A','S','O','N','D'],
};

const MTTR_DATA: Record<Range, number[]> = {
  '1D': [2, 1.5, 3, 2.5, 4, 3, 2],
  '1W': [4, 6, 3, 5, 8, 4, 5],
  '1M': [12, 15, 10, 18],
  '1Y': [45, 52, 40, 38, 42, 35, 30, 28, 25, 22, 20, 18],
};

function SeverityBadge({ s }: { s: string }) {
  const map: Record<string, { cls: string; icon: any }> = {
    Critical: { cls: 'badge-danger',   icon: <XCircle className="w-3 h-3" /> },
    High:     { cls: 'badge-danger',   icon: <AlertTriangle className="w-3 h-3" /> },
    Medium:   { cls: 'badge-warning',  icon: <AlertCircle className="w-3 h-3" /> },
    Low:      { cls: 'badge-success',  icon: <AlertCircle className="w-3 h-3" /> },
    None:     { cls: 'badge-neutral',  icon: <CheckCircle2 className="w-3 h-3" /> },
  };
  const cfg = map[s] || map.None;
  return <span className={`badge ${cfg.cls}`}>{cfg.icon}{s}</span>;
}

export default function Incidents() {
  const [range, setRange] = useState<Range>('1W');
  const incidents = INCIDENTS[range];

  const chartData = {
    labels: MTTR_LABELS[range],
    datasets: [{
      label: 'MTTR (hrs)',
      data: MTTR_DATA[range],
      backgroundColor: 'rgba(29,78,216,0.12)',
      borderColor: '#1d4ed8',
      borderWidth: 2,
      borderRadius: 5,
    }],
  };

  const chartOpts = {
    responsive: true,
    maintainAspectRatio: false,
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
        callbacks: { label: (ctx: any) => `${ctx.raw} hours` },
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
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-lg font-bold" style={{ color: 'var(--text-primary)', letterSpacing: '-0.01em' }}>
            Incidents & Logs
          </h1>
          <p className="text-sm mt-0.5" style={{ color: 'var(--text-muted)' }}>
            Fault history and resolution tracking
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div
            className="flex p-0.5 rounded-md gap-0.5"
            style={{ background: 'var(--bg-muted)', border: '1px solid var(--border)' }}
          >
            {TIME_RANGES.map(t => (
              <button
                key={t}
                onClick={() => setRange(t)}
                className="px-3 py-1.5 rounded text-xs font-semibold transition-colors"
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
          <button className="btn-icon">
            <Filter className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Incidents table */}
      <div className="card overflow-hidden">
        <div
          className="flex items-center justify-between px-5 py-3"
          style={{ borderBottom: '1px solid var(--border)', background: 'var(--bg-subtle)' }}
        >
          <p className="section-title">Incident Log</p>
          <span className="badge badge-neutral">{incidents.length} records</span>
        </div>
        <div className="overflow-x-auto">
          <table className="data-table">
            <thead>
              <tr>
                <th>Incident ID</th>
                <th>Node</th>
                <th>Type</th>
                <th>Severity</th>
                <th>Time</th>
                <th style={{ textAlign: 'right' }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {incidents.map(inc => (
                <tr key={inc.id}>
                  <td>
                    <span className="mono font-semibold" style={{ color: 'var(--accent)' }}>
                      {inc.id}
                    </span>
                  </td>
                  <td>
                    <span className="font-semibold" style={{ color: 'var(--text-primary)' }}>
                      {inc.panel}
                    </span>
                  </td>
                  <td>
                    <span className="chip">{inc.type}</span>
                  </td>
                  <td><SeverityBadge s={inc.severity} /></td>
                  <td>
                    <span className="flex items-center gap-1.5 text-xs" style={{ color: 'var(--text-muted)' }}>
                      <Clock className="w-3.5 h-3.5" style={{ color: 'var(--text-disabled)' }} />
                      {inc.time}
                    </span>
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <span
                      className="badge"
                      style={{
                        background: inc.status === 'Active' ? 'var(--danger-subtle)' : 'var(--success-subtle)',
                        color: inc.status === 'Active' ? 'var(--danger)' : 'var(--success)',
                        borderColor: inc.status === 'Active' ? 'var(--danger-border)' : 'var(--success-border)',
                      }}
                    >
                      <span
                        className={`live-dot ${inc.status !== 'Active' ? '' : ''}`}
                        style={{
                          width: '5px', height: '5px',
                          background: inc.status === 'Active' ? 'var(--danger)' : 'var(--success)',
                          animation: inc.status === 'Active' ? undefined : 'none',
                        }}
                      />
                      {inc.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* MTTR chart + Resolution rate */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

        <div
          className="lg:col-span-2 card overflow-hidden"
          style={{ height: '320px', display: 'flex', flexDirection: 'column' }}
        >
          <div
            className="flex items-center justify-between px-5 py-3.5 shrink-0"
            style={{ borderBottom: '1px solid var(--border)' }}
          >
            <div className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4" style={{ color: 'var(--accent)' }} />
              <p className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
                Mean Time To Resolution
              </p>
            </div>
            <div className="flex items-center gap-1.5 text-xs font-semibold" style={{ color: 'var(--success)' }}>
              <TrendingDown className="w-3.5 h-3.5" />
              −14% vs last period
            </div>
          </div>
          <div className="flex-1 px-4 py-4">
            <Bar data={chartData} options={chartOpts as any} />
          </div>
        </div>

        {/* Resolution rate */}
        <div className="card flex flex-col items-center justify-center gap-5 py-8">
          <div className="relative w-28 h-28">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="42" fill="none" stroke="var(--border)" strokeWidth="8" />
              <motion.circle
                cx="50" cy="50" r="42" fill="none"
                stroke="#16a34a" strokeWidth="8"
                strokeDasharray={String(2 * Math.PI * 42)}
                initial={{ strokeDashoffset: 2 * Math.PI * 42 }}
                animate={{ strokeDashoffset: 2 * Math.PI * 42 * 0.06 }}
                transition={{ duration: 1.2, ease: 'easeOut' }}
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <CheckCircle2 className="w-6 h-6 mb-1" style={{ color: 'var(--success)' }} />
              <span className="text-2xl font-bold" style={{ color: 'var(--text-primary)', letterSpacing: '-0.03em' }}>
                94%
              </span>
            </div>
          </div>
          <div className="text-center px-4">
            <p className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
              Resolution Rate
            </p>
            <p
              className="text-xs mt-1 leading-relaxed"
              style={{ color: 'var(--text-muted)' }}
            >
              System-automated resolutions stable. MTTR trending down across all nodes.
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
