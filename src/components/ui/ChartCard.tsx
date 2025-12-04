"use client";

import {
  LineChart,
  Line,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

const scrollbarStyles = `
  .chart-scroll-container {
    scrollbar-width: thin;
    scrollbar-color: transparent transparent;
    transition: scrollbar-color 0.3s ease;
  }
  .chart-scroll-container:hover {
    scrollbar-color: rgba(139, 92, 246, 0.6) rgba(139, 92, 246, 0.1);
  }
  .chart-scroll-container::-webkit-scrollbar {
    height: 6px;
  }
  .chart-scroll-container::-webkit-scrollbar-track {
    background: transparent;
  }
  .chart-scroll-container::-webkit-scrollbar-thumb {
    background: transparent;
    border-radius: 3px;
    transition: background 0.3s ease;
  }
  .chart-scroll-container:hover::-webkit-scrollbar-thumb {
    background: rgba(139, 92, 246, 0.6);
  }
`;

const sampleData = [
  { name: "Jan", value: 40},
  { name: "Feb", value: 55},
  { name: "Mar", value: 100},
  { name: "Apr", value: 95},
  { name: "May", value: 98},
  { name: "Jun", value: 120},
  { name: "Jul", value: 105},
  { name: "Aug", value: 110},
  { name: "Sept", value: 98},
  { name: "Oct", value: 129},
  { name: "Nov", value: 100},
  { name: "Dec", value: 89},
];

export default function ChartCard() {
  return (
    <>
      <style>{scrollbarStyles}</style>
      <div className="w-full rounded-2xl border border-white/6 shadow-lg bg-gradient-to-br from-indigo-900/10 to-purple-900/12 backdrop-blur-sm overflow-hidden group" style={{ height: '280px' }}>
        <h2 className="text-lg font-semibold text-white/90 px-5 pt-4 pb-2" style={{ height: '60px' }}>Monthly Performance</h2>

        <div className="chart-scroll-container" style={{ height: 'calc(320px - 60px)', overflowX: 'auto', overflowY: 'hidden', paddingLeft: '20px', paddingRight: '20px' }}>
          <ResponsiveContainer width="400%" height="80%" minWidth={1}>
          <LineChart data={sampleData}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
          <XAxis dataKey="name" tick={{ fill: "#c7d2fe" }} />
          <YAxis tick={{ fill: "#c7d2fe" }} />
          <Tooltip
            contentStyle={{ background: 'rgba(15, 23, 42, 0.9)', border: '1px solid rgba(255,255,255,0.04)'}}
            itemStyle={{ color: '#c7d2fe' }}
            labelStyle={{ color: '#94a3b8' }}
          />

          {/* Gradient + neon filter */}
          <defs>
            <linearGradient id="purpleBlueGradient" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#6366F1" />
              <stop offset="50%" stopColor="#8B5CF6" />
            </linearGradient>

            <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#8B5CF6" stopOpacity="0.18" />
              <stop offset="100%" stopColor="#6366F1" stopOpacity="0.02" />
            </linearGradient>

            <filter id="neon" x="-50%" y="-50%" width="200%" height="200%">
              <feDropShadow dx="0" dy="0" stdDeviation="6" floodColor="#8B5CF6" floodOpacity="0.7" />
              <feDropShadow dx="0" dy="0" stdDeviation="12" floodColor="#6366F1" floodOpacity="0.6" />
            </filter>
          </defs>

          {/* Line using gradient + neon filter */}
          <Line
            type="monotone"
            dataKey="value"
            stroke="url(#purpleBlueGradient)"
            strokeWidth={2}
            dot={{ r: 4, fill: "#bfafeeff", stroke: "#7568bd71", strokeWidth: 1 }}
            strokeLinecap="round"
            strokeLinejoin="round"
            filter="url(#neon)"
          />
        </LineChart>
        </ResponsiveContainer>
        </div>
      </div>
    </>
  );
}
                      