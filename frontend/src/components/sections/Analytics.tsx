import { useState } from 'react';
import { motion } from 'framer-motion';
import { Download, Sun, Cloud, Wind, Zap, Calendar } from 'lucide-react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS, CategoryScale, LinearScale, PointElement,
  LineElement, Title, Tooltip, Legend, Filler
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler);

const TIME_RANGES = ['1D', '1W', '1M', '1Y'] as const;
type Range = typeof TIME_RANGES[number];

const RANGE_DATA: Record<Range, { labels: string[]; actual: number[]; predicted: number[] }> = {
  '1D': { labels: ['6AM','9AM','12PM','3PM','6PM','9PM','12AM'], actual:[10,45,85,95,60,20,5],  predicted:[12,40,80,90,65,25,8]   },
  '1W': { labels: ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'],   actual:[65,78,62,95,82,70,90], predicted:[70,75,65,90,85,75,85]  },
  '1M': { labels: ['Week 1','Week 2','Week 3','Week 4'],          actual:[450,520,480,610],       predicted:[470,500,500,580]       },
  '1Y': { labels: ['Jan','Mar','May','Jul','Sep','Nov'],          actual:[1200,1500,2800,3200,2400,1800], predicted:[1300,1600,2600,3000,2500,1900] },
};

const WEATHER = [
  { label: 'Cloud Cover',    value: 24, icon: Cloud,  color: '#94a3b8' },
  { label: 'Solar Intensity',value: 88, icon: Sun,    color: '#b45309' },
  { label: 'Wind Cooling',   value: 12, icon: Wind,   color: '#0369a1' },
];

const METRIC_CARDS = [
  { title: 'Avg Voltage',   value: '234.2 V', trend: 'Stable'    },
  { title: 'Grid Frequency',value: '60.02 Hz', trend: 'Normal'   },
  { title: 'Total Uptime',  value: '99.98%',   trend: 'Excellent' },
  { title: 'CO₂ Saved',     value: '1,240 kg', trend: '+42 kg'   },
];

export default function Analytics() {
  const [range, setRange] = useState<Range>('1W');
  const d = RANGE_DATA[range];

  const chartData = {
    labels: d.labels,
    datasets: [
      {
        label: 'Actual',
        data: d.actual,
        borderColor: '#1d4ed8',
        borderWidth: 2,
        pointBackgroundColor: '#1d4ed8',
        pointBorderColor: '#fff',
        pointBorderWidth: 2,
        pointRadius: 4,
        pointHoverRadius: 6,
        backgroundColor: (ctx: any) => {
          const chart = ctx.chart;
          const { chartArea, ctx: c } = chart;
          if (!chartArea) return 'transparent';
          const g = c.createLinearGradient(0, chartArea.top, 0, chartArea.bottom);
          g.addColorStop(0, 'rgba(29,78,216,0.12)');
          g.addColorStop(1, 'rgba(29,78,216,0)');
          return g;
        },
        fill: true,
        tension: 0.35,
      },
      {
        label: 'Forecast',
        data: d.predicted,
        borderColor: '#94a3b8',
        borderWidth: 1.5,
        borderDash: [6, 4],
        pointRadius: 0,
        fill: false,
        tension: 0.35,
      },
    ],
  };

  const chartOpts = {
    responsive: true,
    maintainAspectRatio: false,
    animation: { duration: 900 },
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
        callbacks: { label: (ctx: any) => `${ctx.dataset.label}: ${ctx.raw} kWh` },
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
            Advanced Analytics
          </h1>
          <p className="text-sm mt-0.5" style={{ color: 'var(--text-muted)' }}>
            Historical performance and efficiency deep-dive
          </p>
        </div>
        <button className="btn-secondary flex items-center gap-1.5">
          <Download className="w-3.5 h-3.5" />
          Export Dataset
        </button>
      </div>

      {/* Chart + Sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

        {/* Line chart */}
        <div className="lg:col-span-2 card overflow-hidden" style={{ height: '380px', display: 'flex', flexDirection: 'column' }}>
          <div
            className="flex items-center justify-between px-5 py-3.5 shrink-0"
            style={{ borderBottom: '1px solid var(--border)' }}
          >
            <div>
              <p className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
                Production vs. Forecast
              </p>
              <div className="flex items-center gap-4 mt-1">
                <div className="flex items-center gap-1.5">
                  <div className="w-5 border-t-2 border-blue-700" />
                  <span className="text-xs" style={{ color: 'var(--text-muted)' }}>Actual</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-5 border-t-2 border-dashed border-slate-400" />
                  <span className="text-xs" style={{ color: 'var(--text-muted)' }}>Forecast</span>
                </div>
              </div>
            </div>
            {/* Range tabs */}
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
            <Line data={chartData} options={chartOpts as any} />
          </div>
        </div>

        {/* Right column */}
        <div className="flex flex-col gap-4">

          {/* Weather */}
          <div className="card overflow-hidden">
            <div
              className="px-5 py-3.5"
              style={{ borderBottom: '1px solid var(--border)', background: 'var(--bg-subtle)' }}
            >
              <p className="section-title">Weather Correlation</p>
            </div>
            <div className="px-5 py-4 space-y-4">
              {WEATHER.map(({ label, value, icon: Icon, color }) => (
                <div key={label}>
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-2">
                      <Icon className="w-3.5 h-3.5" style={{ color }} />
                      <span className="text-xs font-medium" style={{ color: 'var(--text-secondary)' }}>
                        {label}
                      </span>
                    </div>
                    <span className="text-xs font-semibold mono" style={{ color: 'var(--text-primary)' }}>
                      {value}%
                    </span>
                  </div>
                  <div className="progress-track">
                    <div className="progress-fill" style={{ width: `${value}%`, background: color }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Efficiency */}
          <div className="card px-5 py-4">
            <div className="flex items-center gap-2 mb-3">
              <Zap className="w-4 h-4" style={{ color: 'var(--accent)' }} />
              <p className="section-title">System Efficiency</p>
            </div>
            <p
              className="text-4xl font-bold"
              style={{ color: 'var(--text-primary)', letterSpacing: '-0.03em' }}
            >
              94.2%
            </p>
            <p className="text-xs mt-1 font-semibold" style={{ color: 'var(--success)' }}>
              ↑ 2.4% vs last week
            </p>
          </div>

          {/* Peak node */}
          <div className="card px-5 py-4">
            <div className="flex items-center justify-between mb-2">
              <p className="kpi-label">Peak Node</p>
              <Calendar className="w-3.5 h-3.5" style={{ color: 'var(--text-disabled)' }} />
            </div>
            <p className="text-base font-bold mono" style={{ color: 'var(--text-primary)' }}>
              Panel_04
            </p>
            <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>
              Highest daily yield: 4.2 kWh
            </p>
          </div>
        </div>
      </div>

      {/* Metric cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {METRIC_CARDS.map(({ title, value, trend }) => (
          <div key={title} className="card px-5 py-4">
            <p className="kpi-label">{title}</p>
            <p className="kpi-value mt-1">{value}</p>
            <p className="text-xs mt-1.5 font-semibold" style={{ color: 'var(--success)' }}>
              {trend}
            </p>
          </div>
        ))}
      </div>
    </motion.div>
  );
}
