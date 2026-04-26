import { useState } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, BarChart3, PieChart, Calendar, Download, Sun, Cloud, Wind, Zap } from 'lucide-react';
import { Line, Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

export default function Analytics() {
  const [timeRange, setTimeRange] = useState('1W');

  const getData = () => {
    switch (timeRange) {
      case '1D':
        return {
          labels: ['6AM', '9AM', '12PM', '3PM', '6PM', '9PM', '12AM'],
          actual: [10, 45, 85, 95, 60, 20, 5],
          predicted: [12, 40, 80, 90, 65, 25, 8]
        };
      case '1W':
        return {
          labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
          actual: [65, 78, 62, 95, 82, 70, 90],
          predicted: [70, 75, 65, 90, 85, 75, 85]
        };
      case '1M':
        return {
          labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
          actual: [450, 520, 480, 610],
          predicted: [470, 500, 500, 580]
        };
      case '1Y':
        return {
          labels: ['Jan', 'Mar', 'May', 'Jul', 'Sep', 'Nov'],
          actual: [1200, 1500, 2800, 3200, 2400, 1800],
          predicted: [1300, 1600, 2600, 3000, 2500, 1900]
        };
      default:
        return {
          labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
          actual: [65, 78, 62, 95, 82, 70, 90],
          predicted: [70, 75, 65, 90, 85, 75, 85]
        };
    }
  };

  const currentData = getData();

  const lineData = {
    labels: currentData.labels,
    datasets: [
      {
        label: 'Actual Production',
        data: currentData.actual,
        borderColor: '#00f2fe', // Cyan neon
        borderWidth: 4,
        pointBackgroundColor: '#00f2fe',
        pointBorderColor: 'rgba(0, 242, 254, 0.3)',
        pointBorderWidth: 8,
        pointHoverRadius: 8,
        pointRadius: 4,
        backgroundColor: (context: any) => {
          const chart = context.chart;
          const {ctx, chartArea} = chart;
          if (!chartArea) return null;
          const gradient = ctx.createLinearGradient(0, chartArea.top, 0, chartArea.bottom);
          gradient.addColorStop(0, 'rgba(0, 242, 254, 0.2)');
          gradient.addColorStop(1, 'rgba(0, 242, 254, 0)');
          return gradient;
        },
        fill: true,
        tension: 0.4,
      },
      {
        label: 'Predicted',
        data: currentData.predicted,
        borderColor: '#4facfe', // Blue neon
        borderWidth: 2,
        borderDash: [10, 5],
        pointRadius: 0,
        fill: false,
        tension: 0.4,
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    animation: {
      duration: 1500,
      easing: 'easeOutQuart'
    },
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: 'rgba(15, 23, 42, 0.95)',
        titleFont: { size: 14, weight: 'bold' },
        bodyFont: { size: 12 },
        padding: 16,
        cornerRadius: 16,
        displayColors: false,
        callbacks: {
          label: (context: any) => `Yield: ${context.raw} kWh`
        }
      }
    },
    scales: {
      y: { 
        grid: { 
          color: 'rgba(255, 255, 255, 0.03)',
          drawBorder: false
        }, 
        ticks: { 
          color: '#475569',
          font: { size: 10, weight: 'bold' },
          padding: 10
        } 
      },
      x: { 
        grid: { 
          display: false 
        }, 
        ticks: { 
          color: '#475569',
          font: { size: 10, weight: 'bold' },
          padding: 10
        } 
      }
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-8"
    >
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-white mb-2">Advanced Analytics</h1>
          <p className="text-slate-400 font-medium">Historical performance and efficiency deep-dive</p>
        </div>
        <button className="flex items-center gap-2 bg-white/5 border border-white/10 px-4 py-2.5 rounded-xl text-sm font-bold hover:bg-white/10 transition-all">
          <Download size={18} />
          Export Dataset
        </button>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 glass p-8 rounded-3xl min-h-[450px] flex flex-col">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <div className="w-1.5 h-8 bg-primary rounded-full shadow-[0_0_15px_rgba(59,130,246,0.5)]" />
              <div>
                <h3 className="text-xl font-bold flex items-center gap-2 text-white">
                  Production vs. Forecast
                </h3>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-[10px] font-black text-emerald-500 uppercase tracking-[0.2em]">Real-time Analysis</span>
                </div>
              </div>
            </div>
            <div className="flex bg-slate-900/50 backdrop-blur-md rounded-xl p-1 border border-white/5">
              {['1D', '1W', '1M', '1Y'].map(t => (
                <button 
                  key={t} 
                  onClick={() => setTimeRange(t)}
                  className={`px-4 py-1.5 rounded-lg text-xs font-black transition-all ${t === timeRange ? 'bg-primary text-white shadow-[0_0_20px_rgba(59,130,246,0.3)]' : 'text-slate-500 hover:text-white hover:bg-white/5'}`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>
          
          <div className="flex-1 min-h-[300px]">
            <Line data={lineData} options={chartOptions as any} />
          </div>
        </div>

        <div className="space-y-6">
          <div className="glass p-6 rounded-3xl">
            <h3 className="text-lg font-bold mb-6 flex items-center gap-2 text-white">
              <Sun className="text-amber-400 w-5 h-5" />
              Weather Correlation
            </h3>
            <div className="space-y-4">
              <WeatherStat label="Cloud Cover" value={24} icon={<Cloud size={14} />} color="text-slate-400" />
              <WeatherStat label="Solar Intensity" value={88} icon={<Sun size={14} />} color="text-amber-400" />
              <WeatherStat label="Wind Cooling" value={12} icon={<Wind size={14} />} color="text-sky-400" />
            </div>
          </div>

          <div className="glass p-6 rounded-3xl">
            <h3 className="text-lg font-bold mb-6 flex items-center gap-2 text-white">
              <Zap className="text-primary w-5 h-5" />
              System Efficiency
            </h3>
            <div className="flex flex-col items-center justify-center py-4">
              <div className="text-5xl font-black text-white mb-2">94.2%</div>
              <p className="text-[10px] uppercase tracking-widest text-emerald-400 font-black">+2.4% vs last week</p>
            </div>
          </div>

          <div className="glass p-6 rounded-3xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Peak Node</h3>
              <Calendar className="text-slate-600 w-4 h-4" />
            </div>
            <p className="text-xl font-bold text-white">Panel_04</p>
            <p className="text-xs text-slate-500">Highest daily yield: 4.2 kWh</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard title="Avg Voltage" value="234.2 V" trend="Stable" />
        <MetricCard title="Grid Frequency" value="60.02 Hz" trend="Normal" />
        <MetricCard title="Total Uptime" value="99.98%" trend="Excellent" />
        <MetricCard title="CO2 Saved" value="1,240 kg" trend="+42 kg" />
      </div>
    </motion.div>
  );
}

function WeatherStat({ label, value, icon, color }: any) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        <div className={`p-1.5 rounded-lg bg-white/5 ${color}`}>
          {icon}
        </div>
        <span className="text-sm font-medium text-slate-300">{label}</span>
      </div>
      <span className="text-sm font-bold text-white">{value}%</span>
    </div>
  );
}

function MetricCard({ title, value, trend }: any) {
  return (
    <div className="glass p-6 rounded-2xl border-white/5">
      <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">{title}</p>
      <div className="flex items-end justify-between">
        <p className="text-xl font-bold text-white">{value}</p>
        <span className="text-[10px] font-black text-emerald-400 uppercase">{trend}</span>
      </div>
    </div>
  );
}
