import { useState } from 'react';
import { motion } from 'framer-motion';
import { AlertCircle, Search, Filter, CheckCircle2, AlertTriangle, XCircle, Clock, BarChart3, TrendingDown } from 'lucide-react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export default function Incidents() {
  const [timeRange, setTimeRange] = useState('1W');

  const getIncidents = () => {
    const base = [
      { id: 'INC-2941', panel: 'Panel_01', type: 'Soiling', status: 'Active', severity: 'Low', time: '10m ago' },
      { id: 'INC-2940', panel: 'Panel_04', type: 'Shadowing', status: 'Resolved', severity: 'Medium', time: '2h ago' },
      { id: 'INC-2938', panel: 'Panel_08', type: 'Hot_Spot', status: 'Active', severity: 'High', time: '5h ago' },
    ];

    if (timeRange === '1D') return base;
    if (timeRange === '1W') return [
      ...base,
      { id: 'INC-2935', panel: 'Panel_02', type: 'Normal', status: 'Resolved', severity: 'None', time: 'Yesterday' },
      { id: 'INC-2931', panel: 'Panel_05', type: 'Short_Circuit', status: 'Resolved', severity: 'Critical', time: '2 days ago' },
    ];
    
    return [
      ...base,
      { id: 'INC-2935', panel: 'Panel_02', type: 'Normal', status: 'Resolved', severity: 'None', time: 'Yesterday' },
      { id: 'INC-2812', panel: 'Panel_12', type: 'Dust', status: 'Resolved', severity: 'Low', time: '2 weeks ago' },
      { id: 'INC-2705', panel: 'Panel_06', type: 'Inverter_Fail', status: 'Resolved', severity: 'High', time: '1 month ago' },
    ];
  };

  const getMTTRData = () => {
    switch (timeRange) {
      case '1D': return [2, 1.5, 3, 2.5, 4, 3, 2];
      case '1W': return [4, 6, 3, 5, 8, 4, 5];
      case '1M': return [12, 15, 10, 18];
      case '1Y': return [45, 52, 40, 38, 42, 35, 30, 28, 25, 22, 20, 18];
      default: return [4, 6, 3, 5, 8, 4, 5];
    }
  };

  const chartData = {
    labels: timeRange === '1D' ? ['6AM', '9AM', '12PM', '3PM', '6PM', '9PM', '12AM'] : 
            timeRange === '1W' ? ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'] :
            timeRange === '1M' ? ['W1', 'W2', 'W3', 'W4'] :
            ['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'],
    datasets: [{
      label: 'MTTR (Hours)',
      data: getMTTRData(),
      backgroundColor: 'rgba(59, 130, 246, 0.4)',
      borderColor: '#3b82f6',
      borderWidth: 2,
      borderRadius: 6,
    }]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: false } },
    scales: {
      y: { grid: { color: 'rgba(255, 255, 255, 0.05)' }, ticks: { color: '#64748b' } },
      x: { grid: { display: false }, ticks: { color: '#64748b' } }
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-8"
    >
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-white mb-2">Incidents & Logs</h1>
          <p className="text-slate-400 font-medium">History of detected faults and resolution tracking</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex bg-slate-900/50 backdrop-blur-md rounded-xl p-1 border border-white/5">
            {['1D', '1W', '1M', '1Y'].map(t => (
              <button 
                key={t} 
                onClick={() => setTimeRange(t)}
                className={`px-4 py-1.5 rounded-lg text-xs font-black transition-all ${t === timeRange ? 'bg-primary text-white' : 'text-slate-500 hover:text-white hover:bg-white/5'}`}
              >
                {t}
              </button>
            ))}
          </div>
          <button className="p-2.5 rounded-xl bg-white/5 border border-white/10 text-slate-400 hover:text-white hover:bg-white/10 transition-all">
            <Filter size={20} />
          </button>
        </div>
      </header>

      <div className="glass rounded-3xl overflow-hidden border-white/5">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/5 bg-white/[0.02]">
                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Incident ID</th>
                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Node</th>
                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Type</th>
                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Severity</th>
                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Time</th>
                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {getIncidents().map((inc) => (
                <tr key={inc.id} className="hover:bg-white/[0.01] transition-colors group">
                  <td className="px-8 py-5 font-mono text-sm text-primary font-bold">{inc.id}</td>
                  <td className="px-8 py-5 text-sm font-bold text-white">{inc.panel}</td>
                  <td className="px-8 py-5">
                    <span className="px-2 py-1 rounded-md bg-white/5 text-[10px] font-black text-slate-300 border border-white/5 uppercase tracking-tighter">
                      {inc.type.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-2">
                      <SeverityIcon severity={inc.severity} />
                      <span className="text-sm font-medium text-slate-200">{inc.severity}</span>
                    </div>
                  </td>
                  <td className="px-8 py-5 text-sm text-slate-500 flex items-center gap-2 font-medium">
                    <Clock size={14} className="text-slate-600" />
                    {inc.time}
                  </td>
                  <td className="px-8 py-5 text-right">
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black tracking-widest uppercase ${
                      inc.status === 'Active' ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20' : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                    }`}>
                      <div className={`w-1.5 h-1.5 rounded-full ${inc.status === 'Active' ? 'bg-rose-500' : 'bg-emerald-500'} ${inc.status === 'Active' ? 'animate-pulse' : ''}`} />
                      {inc.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 glass p-8 rounded-3xl flex flex-col h-[400px]">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className="text-xl font-bold flex items-center gap-2 text-white">
                <BarChart3 className="text-primary" />
                Mean Time To Resolution
              </h3>
              <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mt-1">Response efficiency tracking</p>
            </div>
            <div className="flex items-center gap-2 text-emerald-400">
              <TrendingDown size={16} />
              <span className="text-xs font-black">-14% vs last period</span>
            </div>
          </div>
          <div className="flex-1">
            <Bar data={chartData} options={chartOptions as any} />
          </div>
        </div>

        <div className="glass p-8 rounded-3xl flex flex-col justify-center items-center text-center">
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-emerald-500/20 to-primary/20 flex items-center justify-center mb-6 relative">
            <div className="absolute inset-0 rounded-full border-4 border-emerald-500/30 border-t-emerald-500 animate-spin" />
            <CheckCircle2 size={32} className="text-emerald-500" />
          </div>
          <p className="text-4xl font-black text-white mb-2">94%</p>
          <p className="text-xs font-bold text-slate-500 uppercase tracking-[0.2em] mb-4">Resolution Rate</p>
          <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden mb-6">
            <div className="h-full bg-emerald-500 w-[94%] shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
          </div>
          <p className="text-slate-400 text-sm leading-relaxed font-medium">
            System-automated resolutions have stabilized. MTTR is down across all nodes.
          </p>
        </div>
      </div>
    </motion.div>
  );
}

function SeverityIcon({ severity }: { severity: string }) {
  switch (severity) {
    case 'Critical': return <XCircle className="text-rose-500 w-4 h-4" />;
    case 'High': return <AlertTriangle className="text-rose-400 w-4 h-4" />;
    case 'Medium': return <AlertCircle className="text-amber-400 w-4 h-4" />;
    case 'Low': return <AlertCircle className="text-emerald-400 w-4 h-4" />;
    default: return <CheckCircle2 className="text-slate-400 w-4 h-4" />;
  }
}
