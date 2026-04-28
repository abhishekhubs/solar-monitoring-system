import { useState } from 'react';
import { motion } from 'framer-motion';
import { SolarPanelCard, SolarPanel } from '../SolarPanelCard';
import { RealTimeChart } from '../RealTimeChart';
import { AlertPanel } from '../AlertPanel';
import { generatePDFReport } from '../../utils/generateReport';
import { TrendingUp, Activity, AlertCircle, Zap, RefreshCw, FileText, Loader2 } from 'lucide-react';

interface Props { panels: SolarPanel[]; stats: any; alerts: any[]; }

const STAT_CONFIG = [
  {
    key: 'energy',
    label: 'Energy Today',
    getValue: (s: any) => s ? `${s.total_energy_today} kWh` : '—',
    trend: '+12.4% vs yesterday',
    trendUp: true,
    icon: TrendingUp,
    accent: 'var(--accent)',
    accentBg: 'var(--accent-subtle)',
  },
  {
    key: 'panels',
    label: 'Active Panels',
    getValue: (s: any) => s ? String(s.active_panels) : '—',
    trend: '100% uptime',
    trendUp: true,
    icon: Activity,
    accent: 'var(--success)',
    accentBg: 'var(--success-subtle)',
  },
  {
    key: 'alerts',
    label: 'Open Alerts',
    getValue: (_: any, a: any[]) => String(a.length),
    trend: (a: any[]) => a.length > 0 ? 'Needs attention' : 'No issues',
    trendUp: false,
    icon: AlertCircle,
    accent: 'var(--danger)',
    accentBg: 'var(--danger-subtle)',
  },
  {
    key: 'peak',
    label: 'Peak Power',
    getValue: (s: any) => s ? `${s.peak_power} W` : '—',
    trend: 'Recorded today',
    trendUp: true,
    icon: Zap,
    accent: 'var(--warning)',
    accentBg: 'var(--warning-subtle)',
  },
];

const HEALTH_METRICS = [
  { label: 'Inverter Integrity', value: 98,  color: '#16a34a' },
  { label: 'Grid Connection',    value: 100, color: '#16a34a' },
  { label: 'Storage Capacity',   value: 64,  color: '#1d4ed8' },
  { label: 'ML Confidence',      value: 89,  color: '#7c3aed' },
];

export default function DashboardContent({ panels, stats, alerts }: Props) {
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerateReport = async () => {
    setIsGenerating(true);
    // Yield to browser to paint spinner before the synchronous PDF build
    await new Promise(r => setTimeout(r, 50));
    try {
      generatePDFReport(panels, stats, alerts);
    } catch (err) {
      console.error('Report generation failed:', err);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
      className="space-y-6"
    >
      {/* ── Page header ─────────────────────────── */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-bold" style={{ color: 'var(--text-primary)', letterSpacing: '-0.01em' }}>
            Solar Network Overview
          </h1>
          <p className="text-sm mt-0.5" style={{ color: 'var(--text-muted)' }}>
            Operational efficiency:{' '}
            <span className="font-semibold" style={{ color: 'var(--success)' }}>
              {stats ? `${(stats.system_efficiency * 100).toFixed(1)}%` : '94.2%'}
            </span>
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button className="btn-secondary flex items-center gap-1.5">
            <RefreshCw className="w-3.5 h-3.5" />
            Refresh
          </button>
          <button
            className="btn-primary flex items-center gap-1.5"
            onClick={handleGenerateReport}
            disabled={isGenerating}
            style={{ opacity: isGenerating ? 0.75 : 1, cursor: isGenerating ? 'not-allowed' : 'pointer' }}
          >
            {isGenerating
              ? <Loader2 className="w-3.5 h-3.5 animate-spin" />
              : <FileText className="w-3.5 h-3.5" />}
            {isGenerating ? 'Generating…' : 'Generate Report'}
          </button>
        </div>
      </div>

      {/* ── KPI Cards ───────────────────────────── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {STAT_CONFIG.map(({ key, label, getValue, trend, trendUp, icon: Icon, accent, accentBg }) => {
          const value = key === 'alerts' ? String(alerts.length) : getValue(stats, alerts);
          const trendText = typeof trend === 'function' ? trend(alerts) : trend;
          return (
            <div key={key} className="card px-5 py-4">
              <div className="flex items-start justify-between mb-3">
                <div
                  className="flex items-center justify-center w-9 h-9 rounded-lg"
                  style={{ background: accentBg }}
                >
                  <Icon className="w-4 h-4" style={{ color: accent }} />
                </div>
                <span
                  className="text-[11px] font-semibold"
                  style={{ color: trendUp || key !== 'alerts' ? 'var(--success)' : 'var(--danger)' }}
                >
                  {trendText}
                </span>
              </div>
              <p className="kpi-label">{label}</p>
              <p className="kpi-value">{value}</p>
            </div>
          );
        })}
      </div>

      {/* ── Alerts ──────────────────────────────── */}
      <AlertPanel alerts={alerts} />

      {/* ── Chart + Health ──────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2">
          <RealTimeChart panels={panels} />
        </div>

        <div className="card flex flex-col">
          <div
            className="px-5 py-3.5 shrink-0"
            style={{ borderBottom: '1px solid var(--border)' }}
          >
            <p className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
              Network Health
            </p>
            <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>
              Diagnostic summary
            </p>
          </div>
          <div className="flex-1 px-5 py-4 space-y-5">
            {HEALTH_METRICS.map(({ label, value, color }) => (
              <div key={label}>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs font-medium" style={{ color: 'var(--text-secondary)' }}>
                    {label}
                  </span>
                  <span className="text-xs font-semibold mono" style={{ color: 'var(--text-primary)' }}>
                    {value}%
                  </span>
                </div>
                <div className="progress-track">
                  <motion.div
                    className="progress-fill"
                    initial={{ width: 0 }}
                    animate={{ width: `${value}%` }}
                    transition={{ duration: 0.9, ease: 'easeOut' }}
                    style={{ background: color }}
                  />
                </div>
              </div>
            ))}
          </div>
          <div
            className="px-5 py-3"
            style={{ borderTop: '1px solid var(--border)', background: 'var(--bg-subtle)' }}
          >
            <div className="flex items-center gap-2">
              <span className="live-dot" style={{ width: '6px', height: '6px' }} />
              <span className="text-xs font-medium" style={{ color: 'var(--text-muted)' }}>
                Predictive AI active
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* ── Panel Grid ──────────────────────────── */}
      <div>
        <div className="section-header mb-4">
          <div className="flex items-center gap-3">
            <p className="section-title">Active Solar Units</p>
            <span className="badge badge-neutral">{panels.length} units</span>
          </div>
          <div className="flex gap-1">
            {['All', 'Faulty', 'Offline'].map((f, i) => (
              <button
                key={f}
                className="text-xs px-3 py-1.5 rounded-md font-medium transition-colors"
                style={{
                  background: i === 0 ? 'var(--accent)' : 'var(--bg-surface)',
                  color: i === 0 ? '#fff' : 'var(--text-muted)',
                  border: i === 0 ? 'none' : '1px solid var(--border)',
                }}
              >
                {f}
              </button>
            ))}
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {panels.map(panel => <SolarPanelCard key={panel.id} panel={panel} />)}
        </div>
      </div>
    </motion.div>
  );
}
