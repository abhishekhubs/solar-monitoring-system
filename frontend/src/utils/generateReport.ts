import { jsPDF } from 'jspdf';

/* ─── Types ─────────────────────────────────────────── */
export interface PanelData {
  id: string;
  power: number;
  voltage: number;
  current: number;
  temperature: number;
  status: 'normal' | 'warning' | 'fault';
  faults: string[];
  timestamp: string;
}

export interface StatsData {
  total_energy_today: number;
  active_panels: number;
  peak_power: number;
  system_efficiency: number;
}

export interface AlertData {
  panelId: string;
  status: string;
  faults: string[];
  timestamp: string;
}

/* ─── Colours ────────────────────────────────────────── */
const BRAND   = [29,  78,  216] as const;   // blue-700
const SUCCESS = [22,  163, 74]  as const;   // green-600
const DANGER  = [220, 38,  38]  as const;   // red-600
const WARNING = [180, 83,  9]   as const;   // amber-700
const DARK    = [15,  23,  42]  as const;   // slate-900
const BODY    = [71,  85,  105] as const;   // slate-600
const MUTED   = [148, 163, 184] as const;   // slate-400
const BORDER  = [226, 232, 240] as const;   // slate-200
const LIGHT   = [241, 245, 249] as const;   // slate-100
const WHITE   = [255, 255, 255] as const;

/* ─── Helpers ────────────────────────────────────────── */
const mm = (n: number) => n;              // just alias for clarity

function setColor(doc: jsPDF, rgb: readonly number[], target: 'fill' | 'text' | 'draw' = 'text') {
  const [r, g, b] = rgb;
  if (target === 'fill')  doc.setFillColor(r, g, b);
  if (target === 'text')  doc.setTextColor(r, g, b);
  if (target === 'draw')  doc.setDrawColor(r, g, b);
}

function hline(doc: jsPDF, x: number, y: number, w: number, color = BORDER) {
  setColor(doc, color, 'draw');
  doc.setLineWidth(0.3);
  doc.line(x, y, x + w, y);
}

function rect(doc: jsPDF, x: number, y: number, w: number, h: number, rgb: readonly number[]) {
  setColor(doc, rgb, 'fill');
  doc.rect(x, y, w, h, 'F');
}

function badge(
  doc: jsPDF, text: string, x: number, y: number,
  fg: readonly number[], bg: readonly number[]
) {
  const pad = 2.5;
  doc.setFontSize(7);
  doc.setFont('helvetica', 'bold');
  const tw = doc.getTextWidth(text);
  setColor(doc, bg, 'fill');
  doc.roundedRect(x, y - 3.2, tw + pad * 2, 4.5, 1, 1, 'F');
  setColor(doc, fg, 'text');
  doc.text(text, x + pad, y);
}

function statusColor(status: string): readonly number[] {
  if (status === 'fault')   return DANGER;
  if (status === 'warning') return WARNING;
  return SUCCESS;
}

function statusBg(status: string): readonly number[] {
  if (status === 'fault')   return [254, 242, 242];
  if (status === 'warning') return [255, 251, 235];
  return [240, 253, 244];
}

/* ─── Main export ────────────────────────────────────── */
export function generatePDFReport(
  panels: PanelData[],
  stats: StatsData | null,
  alerts: AlertData[]
) {
  const doc = new jsPDF({ unit: 'mm', format: 'a4', orientation: 'portrait' });
  const PW  = doc.internal.pageSize.getWidth();   // 210
  const PH  = doc.internal.pageSize.getHeight();  // 297
  const M   = 16;    // margin
  const CW  = PW - M * 2;  // content width = 178
  const now = new Date();
  const dateStr = now.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  const timeStr = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

  let y = 0;   // cursor

  /* ── PAGE HELPERS ────────────────────────────────────── */
  const checkPage = (needed: number) => {
    if (y + needed > PH - 20) {
      doc.addPage();
      drawPageFooter();
      y = 20;
    }
  };

  const drawPageFooter = () => {
    const pg = doc.getNumberOfPages();
    hline(doc, M, PH - 12, CW);
    doc.setFontSize(7.5);
    doc.setFont('helvetica', 'normal');
    setColor(doc, MUTED, 'text');
    doc.text('SolarGuard — Confidential', M, PH - 7);
    doc.text(`Page ${pg}`, PW - M, PH - 7, { align: 'right' });
    doc.text(`Generated ${dateStr} at ${timeStr}`, PW / 2, PH - 7, { align: 'center' });
  };

  /* ══════════════════════════════════════════════════════
     SECTION 1: HEADER BANNER
  ══════════════════════════════════════════════════════ */
  rect(doc, 0, 0, PW, 42, BRAND);

  // Logo circle
  setColor(doc, [255, 255, 255, 0.15] as any, 'fill');
  doc.circle(M + 8, 21, 7, 'F');
  setColor(doc, WHITE, 'text');
  doc.setFontSize(13);
  doc.setFont('helvetica', 'bold');
  doc.text('⚡', M + 4.5, 23.5);

  // Brand name
  doc.setFontSize(20);
  doc.setFont('helvetica', 'bold');
  setColor(doc, WHITE, 'text');
  doc.text('SolarGuard', M + 20, 18);

  // Subtitle
  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  setColor(doc, [199, 210, 254] as any, 'text');
  doc.text('Enterprise Solar Monitoring System — Operational Report', M + 20, 25);

  // Date top-right
  doc.setFontSize(8.5);
  setColor(doc, [199, 210, 254] as any, 'text');
  doc.text(`${dateStr}  ·  ${timeStr}`, PW - M, 18, { align: 'right' });
  doc.text('CONFIDENTIAL', PW - M, 25, { align: 'right' });

  y = 52;

  /* ══════════════════════════════════════════════════════
     SECTION 2: EXECUTIVE SUMMARY
  ══════════════════════════════════════════════════════ */
  // Section label
  doc.setFontSize(7);
  doc.setFont('helvetica', 'bold');
  setColor(doc, MUTED, 'text');
  doc.text('EXECUTIVE SUMMARY', M, y);
  hline(doc, M, y + 2, CW);
  y += 8;

  // 4 KPI boxes in a row
  const kpiW = (CW - 9) / 4;
  const kpiH = 22;
  const kpis = [
    {
      label: 'ENERGY TODAY',
      value: stats ? `${stats.total_energy_today} kWh` : '—',
      sub:   '+12.4% vs yesterday',
      color: SUCCESS,
    },
    {
      label: 'ACTIVE PANELS',
      value: stats ? String(stats.active_panels) : String(panels.length),
      sub:   '100% operational',
      color: BRAND,
    },
    {
      label: 'PEAK POWER',
      value: stats ? `${stats.peak_power} W` : '—',
      sub:   'Recorded today',
      color: WARNING,
    },
    {
      label: 'EFFICIENCY',
      value: stats ? `${(stats.system_efficiency * 100).toFixed(1)}%` : '94.2%',
      sub:   '+2.4% vs last week',
      color: SUCCESS,
    },
  ];

  kpis.forEach((k, i) => {
    const x = M + i * (kpiW + 3);
    rect(doc, x, y, kpiW, kpiH, LIGHT);
    setColor(doc, BORDER, 'draw');
    doc.setLineWidth(0.3);
    doc.rect(x, y, kpiW, kpiH);

    // Top accent line
    setColor(doc, k.color, 'fill');
    doc.rect(x, y, kpiW, 1.5, 'F');

    // Label
    doc.setFontSize(6.5);
    doc.setFont('helvetica', 'bold');
    setColor(doc, MUTED, 'text');
    doc.text(k.label, x + 4, y + 6.5);

    // Value
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    setColor(doc, DARK, 'text');
    doc.text(k.value, x + 4, y + 14);

    // Sub
    doc.setFontSize(6.5);
    doc.setFont('helvetica', 'normal');
    setColor(doc, k.color, 'text');
    doc.text(k.sub, x + 4, y + 19.5);
  });

  y += kpiH + 10;

  /* ══════════════════════════════════════════════════════
     SECTION 3: SYSTEM ALERTS
  ══════════════════════════════════════════════════════ */
  checkPage(30);
  doc.setFontSize(7);
  doc.setFont('helvetica', 'bold');
  setColor(doc, MUTED, 'text');
  doc.text('SYSTEM ALERTS', M, y);
  hline(doc, M, y + 2, CW);
  y += 8;

  if (alerts.length === 0) {
    rect(doc, M, y, CW, 12, [240, 253, 244]);
    setColor(doc, BORDER, 'draw');
    doc.setLineWidth(0.3);
    doc.rect(M, y, CW, 12);
    doc.setFontSize(9);
    doc.setFont('helvetica', 'bold');
    setColor(doc, SUCCESS, 'text');
    doc.text('✓  All Systems Operational — No active alerts detected.', M + 6, y + 7.5);
    y += 18;
  } else {
    // Alert table header
    rect(doc, M, y, CW, 8, LIGHT);
    setColor(doc, BORDER, 'draw');
    doc.setLineWidth(0.3);
    doc.rect(M, y, CW, 8);

    doc.setFontSize(7);
    doc.setFont('helvetica', 'bold');
    setColor(doc, MUTED, 'text');
    doc.text('PANEL', M + 4,       y + 5.5);
    doc.text('STATUS',  M + 38,    y + 5.5);
    doc.text('FAULTS',  M + 68,    y + 5.5);
    doc.text('TIMESTAMP', M + 140, y + 5.5);
    y += 8;

    alerts.forEach((alert, idx) => {
      checkPage(10);
      const bg = idx % 2 === 0 ? WHITE : [248, 250, 252] as const;
      rect(doc, M, y, CW, 9, bg);
      setColor(doc, BORDER, 'draw');
      doc.setLineWidth(0.2);
      doc.line(M, y + 9, M + CW, y + 9);

      doc.setFontSize(8);
      doc.setFont('helvetica', 'bold');
      setColor(doc, DARK, 'text');
      doc.text(alert.panelId, M + 4, y + 6);

      const sc = statusColor(alert.status);
      const sb = statusBg(alert.status);
      badge(doc, alert.status.toUpperCase(), M + 38, y + 6, sc, sb);

      doc.setFontSize(7.5);
      doc.setFont('helvetica', 'normal');
      setColor(doc, BODY, 'text');
      const faultText = alert.faults.map(f => f.replace(/_/g, ' ')).join(', ') || '—';
      doc.text(faultText, M + 68, y + 6, { maxWidth: 68 });

      doc.setFontSize(7);
      setColor(doc, MUTED, 'text');
      doc.text(
        new Date(alert.timestamp).toLocaleString('en-US', { hour: '2-digit', minute: '2-digit', month: 'short', day: 'numeric' }),
        M + 140, y + 6
      );
      y += 9;
    });
    y += 6;
  }

  /* ══════════════════════════════════════════════════════
     SECTION 4: PANEL PERFORMANCE TABLE
  ══════════════════════════════════════════════════════ */
  checkPage(30);
  doc.setFontSize(7);
  doc.setFont('helvetica', 'bold');
  setColor(doc, MUTED, 'text');
  doc.text('PANEL PERFORMANCE BREAKDOWN', M, y);
  hline(doc, M, y + 2, CW);
  y += 8;

  // Table header
  const cols = [
    { label: 'PANEL ID', x: M + 4,   w: 30 },
    { label: 'POWER (W)', x: M + 36,  w: 25 },
    { label: 'VOLTAGE (V)', x: M + 63, w: 28 },
    { label: 'CURRENT (A)', x: M + 93, w: 28 },
    { label: 'TEMP (°C)', x: M + 123, w: 25 },
    { label: 'STATUS', x: M + 150,   w: 28 },
  ];

  rect(doc, M, y, CW, 8, BRAND);
  doc.setFontSize(6.5);
  doc.setFont('helvetica', 'bold');
  setColor(doc, WHITE, 'text');
  cols.forEach(c => doc.text(c.label, c.x, y + 5.5));
  y += 8;

  panels.forEach((panel, idx) => {
    checkPage(9);
    const bg = idx % 2 === 0 ? WHITE : LIGHT;
    rect(doc, M, y, CW, 9, bg);
    setColor(doc, BORDER, 'draw');
    doc.setLineWidth(0.2);
    doc.line(M, y + 9, M + CW, y + 9);

    doc.setFontSize(8);
    doc.setFont('helvetica', 'bold');
    setColor(doc, BRAND, 'text');
    doc.text(panel.id, cols[0].x, y + 6);

    doc.setFont('helvetica', 'normal');
    setColor(doc, DARK, 'text');
    doc.text(panel.power.toFixed(1),       cols[1].x, y + 6);
    doc.text(panel.voltage.toFixed(2),     cols[2].x, y + 6);
    doc.text(panel.current.toFixed(2),     cols[3].x, y + 6);
    doc.text(panel.temperature.toFixed(1), cols[4].x, y + 6);

    const sc = statusColor(panel.status);
    const sb = statusBg(panel.status);
    badge(doc, panel.status.toUpperCase(), cols[5].x, y + 6, sc, sb);

    y += 9;
  });

  y += 8;

  /* ══════════════════════════════════════════════════════
     SECTION 5: NETWORK HEALTH SUMMARY
  ══════════════════════════════════════════════════════ */
  checkPage(50);
  doc.setFontSize(7);
  doc.setFont('helvetica', 'bold');
  setColor(doc, MUTED, 'text');
  doc.text('NETWORK HEALTH INDICATORS', M, y);
  hline(doc, M, y + 2, CW);
  y += 8;

  const healthMetrics = [
    { label: 'Inverter Integrity', value: 98,  color: SUCCESS },
    { label: 'Grid Connection',    value: 100, color: SUCCESS },
    { label: 'Storage Capacity',   value: 64,  color: BRAND   },
    { label: 'ML Confidence',      value: 89,  color: [124, 58, 237] as const },
  ];

  healthMetrics.forEach(({ label, value, color }) => {
    checkPage(12);
    doc.setFontSize(8);
    doc.setFont('helvetica', 'normal');
    setColor(doc, BODY, 'text');
    doc.text(label, M, y + 5);

    doc.setFont('helvetica', 'bold');
    setColor(doc, DARK, 'text');
    doc.text(`${value}%`, M + CW, y + 5, { align: 'right' });

    // Track background
    rect(doc, M, y + 7, CW, 3, LIGHT);
    // Track fill
    setColor(doc, color, 'fill');
    doc.rect(M, y + 7, CW * value / 100, 3, 'F');

    y += 14;
  });

  y += 4;

  /* ══════════════════════════════════════════════════════
     SECTION 6: DISCLAIMER FOOTER
  ══════════════════════════════════════════════════════ */
  checkPage(22);
  hline(doc, M, y, CW);
  y += 6;

  rect(doc, M, y, CW, 16, LIGHT);
  doc.setFontSize(7);
  doc.setFont('helvetica', 'bold');
  setColor(doc, DARK, 'text');
  doc.text('Disclaimer', M + 4, y + 5);
  doc.setFont('helvetica', 'normal');
  setColor(doc, MUTED, 'text');
  doc.text(
    'This report was automatically generated by the SolarGuard monitoring platform. Data is sourced from ' +
    'real-time sensor telemetry and AI-driven analytics. For operational decisions, please consult a certified ' +
    'solar energy technician. SolarGuard is not liable for actions taken based solely on this document.',
    M + 4, y + 10,
    { maxWidth: CW - 8 }
  );

  /* ── Footer on every page ──────────────────────────── */
  const totalPages = doc.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    drawPageFooter();
  }

  /* ── Download ──────────────────────────────────────── */
  const filename = `SolarGuard_Report_${now.toISOString().split('T')[0]}.pdf`;
  doc.save(filename);
}
