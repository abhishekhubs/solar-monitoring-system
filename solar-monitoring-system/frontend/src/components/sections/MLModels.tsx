import { useState } from 'react';
import { motion } from 'framer-motion';
import { Cpu, Brain, ShieldAlert, Zap, Layers, RefreshCw, BarChart, Activity } from 'lucide-react';
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

export default function MLModels() {
  const [timeRange, setTimeRange] = useState('1W');

  const getDistributionData = () => {
    switch (timeRange) {
      case '1D':
        return [1, 3, 8, 22, 66];
      case '1W':
        return [2, 5, 12, 28, 53];
      case '1M':
        return [5, 8, 15, 32, 40];
      case '1Y':
        return [10, 15, 20, 25, 30];
      default:
        return [2, 5, 12, 28, 53];
    }
  };

  const distributionData = {
    labels: ['0-20%', '20-40%', '40-60%', '60-80%', '80-100%'],
    datasets: [
      {
        label: 'Prediction Confidence',
        data: getDistributionData(),
        backgroundColor: [
          'rgba(244, 63, 94, 0.4)', // Rose
          'rgba(245, 158, 11, 0.4)', // Amber
          'rgba(14, 165, 233, 0.4)', // Sky
          'rgba(99, 102, 241, 0.4)', // Indigo
          'rgba(16, 185, 129, 0.4)', // Emerald
        ],
        borderColor: [
          '#f43f5e',
          '#f59e0b',
          '#0ea5e9',
          '#6366f1',
          '#10b981',
        ],
        borderWidth: 2,
        borderRadius: 8,
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    animation: {
      duration: 1000,
      easing: 'easeInOutQuart'
    },
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: 'rgba(15, 23, 42, 0.95)',
        padding: 12,
        cornerRadius: 12,
      }
    },
    scales: {
      y: { 
        grid: { color: 'rgba(255, 255, 255, 0.05)' }, 
        ticks: { color: '#64748b' },
        title: { display: true, text: 'Percentage of Inferences', color: '#64748b', font: { size: 10, weight: 'bold' } }
      },
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
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-white mb-2">Neural Link Diagnostics</h1>
          <p className="text-slate-400 font-medium">Machine Learning models for fault detection & prediction</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs font-bold text-emerald-400 uppercase tracking-widest">Active</span>
          </div>
          <button className="p-2.5 rounded-xl bg-white/5 border border-white/10 text-slate-400 hover:text-white hover:bg-white/10 transition-all">
            <RefreshCw size={20} />
          </button>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <ModelCard 
          name="FaultGuard-V3" 
          type="Classification" 
          accuracy={99.2} 
          status="Online" 
          latency="12ms"
          icon={<ShieldAlert className="text-rose-400" />}
          color="from-rose-500/20"
        />
        <ModelCard 
          name="YieldPredictor" 
          type="Regression" 
          accuracy={94.5} 
          status="Training" 
          latency="45ms"
          icon={<Activity className="text-primary" />}
          color="from-primary/20"
        />
        <ModelCard 
          name="GridBalancer" 
          type="Reinforcement" 
          accuracy={88.9} 
          status="Online" 
          latency="28ms"
          icon={<Zap className="text-amber-400" />}
          color="from-amber-500/20"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="glass p-8 rounded-3xl flex flex-col h-[450px]">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className="text-xl font-bold flex items-center gap-2 text-white">
                <BarChart className="text-primary" />
                Confidence Distribution
              </h3>
              <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mt-1">Accuracy spread over time</p>
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
            <Bar data={distributionData} options={chartOptions as any} />
          </div>
        </div>

        <div className="glass p-8 rounded-3xl">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-xl font-bold flex items-center gap-2 text-white">
              <Layers className="text-secondary" />
              Model Lifecycle Logs
            </h3>
          </div>
          
          <div className="space-y-6">
            {[
              { model: 'FaultGuard-V3', date: '2024-04-25', metric: '+1.2% Accuracy', color: 'text-emerald-400', desc: 'Retrained on dataset 04-X' },
              { model: 'YieldPredictor', date: '2024-04-24', metric: '-0.4% Latency', color: 'text-primary', desc: 'Pruning optimization applied' },
              { model: 'GridBalancer', date: '2024-04-22', metric: 'Node Sync', color: 'text-secondary', desc: 'Synchronized with regional grid' }
            ].map((log, i) => (
              <div key={i} className="group flex items-start justify-between border-b border-white/5 pb-4 last:border-0 last:pb-0">
                <div>
                  <p className="font-bold text-sm text-white group-hover:text-primary transition-colors">{log.model}</p>
                  <p className="text-[10px] text-slate-500 mb-1">{log.date}</p>
                  <p className="text-xs text-slate-400">{log.desc}</p>
                </div>
                <span className={`text-[10px] font-black tracking-widest uppercase px-2 py-1 rounded bg-white/5 ${log.color}`}>{log.metric}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function ModelCard({ name, type, accuracy, status, latency, icon, color }: any) {
  return (
    <div className={`glass p-6 rounded-3xl border-white/5 relative overflow-hidden group bg-gradient-to-br ${color} to-transparent`}>
      <div className="absolute -right-4 -top-4 opacity-5 group-hover:opacity-10 transition-opacity">
        <Cpu size={120} />
      </div>
      <div className="flex items-center gap-3 mb-6 relative z-10">
        <div className="p-3 rounded-2xl bg-black/40 backdrop-blur-md border border-white/5">
          {icon}
        </div>
        <div>
          <h4 className="font-bold text-white leading-none mb-1">{name}</h4>
          <span className="text-[10px] uppercase tracking-widest text-slate-500 font-black">{type}</span>
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-4 relative z-10">
        <div className="p-3 rounded-2xl bg-black/20">
          <p className="text-[10px] uppercase tracking-widest text-slate-500 font-bold mb-1">Precision</p>
          <p className="text-xl font-black text-white">{accuracy}%</p>
        </div>
        <div className="p-3 rounded-2xl bg-black/20">
          <p className="text-[10px] uppercase tracking-widest text-slate-500 font-bold mb-1">Latency</p>
          <p className="text-xl font-black text-white">{latency}</p>
        </div>
      </div>
      
      <div className="mt-6 flex items-center justify-between relative z-10">
        <div className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${status === 'Online' ? 'bg-emerald-500' : 'bg-amber-500'} animate-pulse`} />
          <span className={`text-[10px] font-black tracking-widest uppercase ${status === 'Online' ? 'text-emerald-400' : 'text-amber-400'}`}>
            {status}
          </span>
        </div>
        <button className="text-[10px] font-black text-white/50 hover:text-white uppercase tracking-widest bg-white/5 px-3 py-1.5 rounded-lg transition-all">Inspect</button>
      </div>
    </div>
  );
}
