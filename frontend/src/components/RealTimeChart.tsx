import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS, CategoryScale, LinearScale, PointElement,
  LineElement, Title, Tooltip, Legend, Filler
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler);

interface SolarPanel { id: string; power: number; }

export function RealTimeChart({ panels }: { panels: SolarPanel[] }) {
  const data = {
    labels: panels.map(p => p.id),
    datasets: [{
      label: 'Power Output (W)',
      data: panels.map(p => p.power),
      borderColor: '#1d4ed8',
      backgroundColor: 'rgba(29, 78, 216, 0.06)',
      borderWidth: 2,
      pointBackgroundColor: '#1d4ed8',
      pointBorderColor: '#ffffff',
      pointBorderWidth: 2,
      pointRadius: 4,
      pointHoverRadius: 6,
      tension: 0.35,
      fill: true,
    }],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: '#ffffff',
        titleColor: '#0f172a',
        bodyColor: '#475569',
        borderColor: '#e2e8f0',
        borderWidth: 1,
        padding: 10,
        cornerRadius: 8,
        titleFont: { family: 'Inter', size: 12, weight: '600' },
        bodyFont: { family: 'Inter', size: 12 },
        callbacks: {
          label: (ctx: any) => `${ctx.raw.toFixed(1)} W`,
        },
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
        ticks: { color: '#94a3b8', font: { family: 'Inter', size: 11 }, maxRotation: 45, padding: 8 },
      },
    },
  };

  return (
    <div className="card h-[340px] flex flex-col">
      <div
        className="flex items-center justify-between px-5 py-3.5 shrink-0"
        style={{ borderBottom: '1px solid var(--border)' }}
      >
        <div>
          <p className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
            Live Power Output
          </p>
          <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>
            Aggregated across all panels
          </p>
        </div>
        <div
          className="flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold"
          style={{
            background: 'var(--success-subtle)',
            color: 'var(--success)',
            border: '1px solid var(--success-border)',
          }}
        >
          <span className="live-dot" style={{ width: '6px', height: '6px' }} />
          Live
        </div>
      </div>
      <div className="flex-1 px-4 py-4">
        <Line data={data} options={options as any} />
      </div>
    </div>
  );
}
