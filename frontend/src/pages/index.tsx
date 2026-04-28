import { useState, useEffect, useRef } from 'react';
import Head from 'next/head';
import { motion, AnimatePresence } from 'framer-motion';
import { SolarPanel } from '../components/SolarPanelCard';
import DashboardContent from '../components/sections/DashboardContent';
import Storage from '../components/sections/Storage';
import Analytics from '../components/sections/Analytics';
import MLModels from '../components/sections/MLModels';
import Incidents from '../components/sections/Incidents';
import {
  LayoutDashboard, Battery, TrendingUp, AlertCircle,
  Settings, LogOut, Zap, Cpu, ChevronRight, Menu, X
} from 'lucide-react';

const NAV_ITEMS = [
  { label: 'Dashboard', icon: LayoutDashboard },
  { label: 'Storage',   icon: Battery },
  { label: 'Analytics', icon: TrendingUp },
  { label: 'ML Models', icon: Cpu },
  { label: 'Incidents', icon: AlertCircle },
];

/* ── Shared sidebar content ─────────────────────────────────────── */
function SidebarContent({
  activeTab,
  setActiveTab,
  panels,
  onNavigate,
}: {
  activeTab: string;
  setActiveTab: (t: string) => void;
  panels: any[];
  onNavigate: (t: string) => void;
}) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      {/* Logo */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          padding: '0 20px',
          height: '56px',
          borderBottom: '1px solid var(--border)',
          flexShrink: 0,
          cursor: 'pointer',
        }}
        onClick={() => onNavigate('Dashboard')}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '28px',
            height: '28px',
            borderRadius: '8px',
            background: 'var(--accent)',
            flexShrink: 0,
          }}
        >
          <Zap size={14} color="#fff" />
        </div>
        <span
          style={{
            fontWeight: 700,
            fontSize: '13px',
            color: 'var(--text-primary)',
            letterSpacing: '-0.01em',
            whiteSpace: 'nowrap',
          }}
        >
          SolarGuard
        </span>
        <span
          style={{
            marginLeft: 'auto',
            fontSize: '10px',
            fontWeight: 700,
            padding: '2px 6px',
            borderRadius: '4px',
            background: 'var(--accent-subtle)',
            color: 'var(--accent)',
            letterSpacing: '0.04em',
            flexShrink: 0,
          }}
        >
          PRO
        </span>
      </div>

      {/* Nav */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '16px 12px 8px' }}>
        <p
          style={{
            padding: '0 12px',
            marginBottom: '8px',
            fontSize: '10px',
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: '0.09em',
            color: 'var(--text-disabled)',
          }}
        >
          Navigation
        </p>

        <nav style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
          {NAV_ITEMS.map(({ label, icon: Icon }) => {
            const isActive = activeTab === label;
            return (
              <button
                key={label}
                onClick={() => onNavigate(label)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  padding: '8px 12px',
                  borderRadius: '8px',
                  border: 'none',
                  width: '100%',
                  textAlign: 'left',
                  cursor: 'pointer',
                  fontSize: '13px',
                  fontWeight: isActive ? 600 : 500,
                  color: isActive ? 'var(--accent)' : 'var(--text-secondary)',
                  background: isActive ? 'var(--accent-subtle)' : 'transparent',
                  transition: 'background 0.15s, color 0.15s',
                }}
                onMouseEnter={e => {
                  if (!isActive) {
                    (e.currentTarget as HTMLButtonElement).style.background = 'var(--bg-muted)';
                    (e.currentTarget as HTMLButtonElement).style.color = 'var(--text-primary)';
                  }
                }}
                onMouseLeave={e => {
                  if (!isActive) {
                    (e.currentTarget as HTMLButtonElement).style.background = 'transparent';
                    (e.currentTarget as HTMLButtonElement).style.color = 'var(--text-secondary)';
                  }
                }}
              >
                <Icon size={16} style={{ flexShrink: 0 }} />
                <span style={{ flex: 1, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {label}
                </span>
                {isActive && <ChevronRight size={12} style={{ flexShrink: 0, opacity: 0.5 }} />}
              </button>
            );
          })}
        </nav>

        {/* Divider */}
        <div style={{ height: '1px', background: 'var(--border)', margin: '16px 0' }} />

        {/* Status widget */}
        <div
          style={{
            margin: '0 4px',
            padding: '10px 12px',
            borderRadius: '8px',
            background: 'var(--success-subtle)',
            border: '1px solid var(--success-border)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
            <span
              style={{
                display: 'inline-block',
                width: '7px',
                height: '7px',
                borderRadius: '50%',
                background: 'var(--success)',
                animation: 'pulse-dot 2s ease infinite',
                flexShrink: 0,
              }}
            />
            <span style={{ fontSize: '11px', fontWeight: 600, color: 'var(--success)' }}>
              All Systems Operational
            </span>
          </div>
          <p style={{ fontSize: '11px', color: 'var(--text-muted)', marginLeft: '15px' }}>
            {panels.length} panels active
          </p>
        </div>
      </div>

      {/* Footer */}
      <div style={{ padding: '8px 12px 12px', borderTop: '1px solid var(--border)', flexShrink: 0 }}>
        {[
          { label: 'Settings', icon: Settings, color: 'var(--text-secondary)' },
          { label: 'Sign Out', icon: LogOut,   color: 'var(--danger)' },
        ].map(({ label, icon: Icon, color }) => (
          <button
            key={label}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              padding: '8px 12px',
              borderRadius: '8px',
              border: 'none',
              width: '100%',
              textAlign: 'left',
              cursor: 'pointer',
              fontSize: '13px',
              fontWeight: 500,
              color,
              background: 'transparent',
              transition: 'background 0.15s',
            }}
            onMouseEnter={e => ((e.currentTarget as HTMLButtonElement).style.background = 'var(--bg-muted)')}
            onMouseLeave={e => ((e.currentTarget as HTMLButtonElement).style.background = 'transparent')}
          >
            <Icon size={16} style={{ flexShrink: 0 }} />
            <span>{label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

/* ── Main Dashboard Page ──────────────────────────────────────────── */
export default function Dashboard() {
  const [activeTab, setActiveTab]   = useState('Dashboard');
  const [panels, setPanels]         = useState<SolarPanel[]>([]);
  const [loading, setLoading]       = useState(true);
  const [alerts, setAlerts]         = useState<any[]>([]);
  const [stats, setStats]           = useState<any>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const mainRef = useRef<HTMLDivElement>(null);

  /* Close mobile menu on scroll */
  useEffect(() => {
    const el = mainRef.current;
    if (!el) return;
    const handleScroll = () => { if (mobileOpen) setMobileOpen(false); };
    el.addEventListener('scroll', handleScroll, { passive: true });
    return () => el.removeEventListener('scroll', handleScroll);
  }, [mobileOpen]);

  /* Close on ESC */
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') setMobileOpen(false); };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, []);

  /* Data fetching */
  useEffect(() => {
    fetchData();
    const id = setInterval(fetchData, 5000);
    return () => clearInterval(id);
  }, []);

  const fetchData = async () => {
    try {
      const base = process.env.NEXT_PUBLIC_API_URL ||
        (typeof window !== 'undefined' && window.location.hostname === 'localhost'
          ? 'http://localhost:8000' : '/backend');

      const panelRes = await fetch(`${base}/api/solar/panels`);
      const panelData = await panelRes.json();
      if (Array.isArray(panelData)) {
        setPanels(panelData);
        setAlerts(panelData.filter((p: SolarPanel) => p.status !== 'normal').map((p: SolarPanel) => ({
          panelId: p.id, status: p.status, faults: p.faults, timestamp: p.timestamp,
        })));
      }
      const statsRes = await fetch(`${base}/api/dashboard/stats`);
      if (statsRes.ok) setStats(await statsRes.json());
    } catch (err) {
      console.error('Fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleNavigate = (tab: string) => {
    setActiveTab(tab);
    setMobileOpen(false);
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'Dashboard': return <DashboardContent key="dashboard" panels={panels} stats={stats} alerts={alerts} />;
      case 'Storage':   return <Storage   key="storage" />;
      case 'Analytics': return <Analytics key="analytics" />;
      case 'ML Models': return <MLModels  key="ml" />;
      case 'Incidents': return <Incidents key="incidents" />;
      default:          return <DashboardContent key="default" panels={panels} stats={stats} alerts={alerts} />;
    }
  };

  if (loading && panels.length === 0) {
    return (
      <div
        style={{
          display: 'flex', flexDirection: 'column', alignItems: 'center',
          justifyContent: 'center', height: '100vh', gap: '12px',
          background: 'var(--bg-base)',
        }}
      >
        <div
          style={{
            width: '36px', height: '36px', borderRadius: '50%',
            border: '2px solid var(--border)', borderTopColor: 'var(--accent)',
            animation: 'spin 0.7s linear infinite',
          }}
        />
        <p style={{ fontSize: '13px', color: 'var(--text-muted)', fontWeight: 500 }}>
          Loading SolarGuard...
        </p>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', height: '100vh', overflow: 'hidden', background: 'var(--bg-base)' }}>
      <Head>
        <title>SolarGuard | {activeTab}</title>
        <meta name="description" content="SolarGuard — Enterprise Solar Monitoring System" />
      </Head>


      {/* ── Mobile Overlay ───────────────────────────────────────── */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              key="backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setMobileOpen(false)}
              style={{
                position: 'fixed', inset: 0, zIndex: 40,
                background: 'rgba(15,23,42,0.35)',
              }}
            />

            <motion.aside
              key="drawer"
              initial={{ x: -260 }}
              animate={{ x: 0 }}
              exit={{ x: -260 }}
              transition={{ type: 'spring', stiffness: 320, damping: 32 }}
              style={{
                position: 'fixed', top: 0, left: 0, bottom: 0,
                width: '240px', zIndex: 50,
                background: 'var(--bg-surface)',
                borderRight: '1px solid var(--border)',
                boxShadow: 'var(--shadow-lg)',
              }}
            >
              <SidebarContent
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                panels={panels}
                onNavigate={handleNavigate}
              />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* ── Right: Topbar + Content ─────────────────────────────── */}
      <div style={{ display: 'flex', flexDirection: 'column', flex: 1, overflow: 'hidden', minWidth: 0 }}>

        {/* Topbar */}
        <header
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            padding: '0 20px',
            height: '56px',
            background: 'var(--bg-surface)',
            borderBottom: '1px solid var(--border)',
            boxShadow: 'var(--shadow-xs)',
            flexShrink: 0,
            zIndex: 60,
          }}
        >
          {/* Hamburger — always visible */}
          <button
            onClick={() => setMobileOpen(v => !v)}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '36px',
              height: '36px',
              borderRadius: '8px',
              border: '1px solid var(--border)',
              background: mobileOpen ? 'var(--accent-subtle)' : 'var(--bg-subtle)',
              cursor: 'pointer',
              color: mobileOpen ? 'var(--accent)' : 'var(--text-secondary)',
              flexShrink: 0,
              transition: 'background 0.15s, color 0.15s',
            }}
            title={mobileOpen ? 'Close menu' : 'Open menu'}
          >
            {mobileOpen ? <X size={18} /> : <Menu size={18} />}
          </button>

          {/* Page title */}
          <div style={{ minWidth: 0 }}>
            <p style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-primary)', whiteSpace: 'nowrap' }}>
              {activeTab}
            </p>
            <p style={{ fontSize: '11px', color: 'var(--text-muted)', lineHeight: 1 }}>
              SolarGuard Dashboard
            </p>
          </div>

          {/* Right chips */}
          <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '8px' }}>
            {alerts.length > 0 && (
              <div
                style={{
                  display: 'flex', alignItems: 'center', gap: '5px',
                  padding: '5px 10px', borderRadius: '6px', fontSize: '12px', fontWeight: 600,
                  background: 'var(--danger-subtle)', color: 'var(--danger)',
                  border: '1px solid var(--danger-border)',
                  whiteSpace: 'nowrap',
                }}
              >
                <AlertCircle size={13} />
                {alerts.length} Alert{alerts.length !== 1 ? 's' : ''}
              </div>
            )}
            <div
              style={{
                display: 'flex', alignItems: 'center', gap: '5px',
                padding: '5px 10px', borderRadius: '6px', fontSize: '12px', fontWeight: 600,
                background: 'var(--success-subtle)', color: 'var(--success)',
                border: '1px solid var(--success-border)',
              }}
            >
              <span
                style={{
                  display: 'inline-block', width: '6px', height: '6px',
                  borderRadius: '50%', background: 'var(--success)',
                  animation: 'pulse-dot 2s ease infinite',
                  flexShrink: 0,
                }}
              />
              Live
            </div>
            <div
              style={{
                width: '32px', height: '32px', borderRadius: '50%',
                background: 'var(--accent)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '11px', fontWeight: 700, color: '#fff', flexShrink: 0,
              }}
            >
              SG
            </div>
          </div>
        </header>

        {/* Page content */}
        <main
          ref={mainRef}
          className="custom-scrollbar"
          style={{
            flex: 1,
            overflowY: 'auto',
            padding: '24px',
          }}
        >
          <AnimatePresence mode="wait">
            {renderContent()}
          </AnimatePresence>
        </main>
      </div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}
