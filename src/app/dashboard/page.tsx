"use client";

import { getToken } from "@/lib/auth";
import { jwtDecode } from "jwt-decode";
import { useState } from "react";
import { motion } from "framer-motion";
import ChartCard from "@/components/ui/ChartCard";
import { Users, DollarSign, Activity, TrendingUp, Settings as SettingsIcon, DownloadCloud, MessageSquare, ArrowUpRight, Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEffect } from "react";

interface JwtPayload {
  sub: number;
  username: string;
  role: string;
  exp: number;
  iat: number;
}

export default function DashboardPage() {
  const token = getToken();
  const [showFull, setShowFull] = useState(false);
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [weeklySummary, setWeeklySummary] = useState(false);
  const [autoExport, setAutoExport] = useState(false);

  let username = "Guest";
  if (token) {
    try {
      const decoded = jwtDecode<JwtPayload>(token);
      if (decoded.username) {
        username = decoded.username;
      }
    } catch (e) {
      console.error("Token decoding failed:", e);
    }
  }

  const cards = [
    { title: "Overview", desc: "Quick glance at your stats." },
    { title: "Reports", desc: "Detailed insights and analytics." },
    { title: "Settings", desc: "Manage your preferences." },
  ];

  const clients = [
    { name: "Acme Corp", contact: "sarah@acme.com", status: "Interested", note: "Requested market overview" },
    { name: "BlueOcean", contact: "mike@blueocean.io", status: "Follow-up", note: "Need pricing" },
    { name: "FinEdge", contact: "nora@finedge.co", status: "Converted", note: "Signed POC" },
  ];

  useEffect(() => {
    // simple effect: could fetch real settings
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6">
      <div className="max-w-[1400px] w-full mx-auto">
      {/* Animated Header with Gradient */}
      <div className="mb-8 flex items-center justify-between gap-6">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400 bg-clip-text text-transparent">
            Welcome back, {username} , P.S. Personal Dashboard ko Ni Ser
          </h1>
          <p className="text-sm text-slate-400 mt-2">Deep-dive into current market signals</p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="p-2 rounded-full bg-white/3 backdrop-blur-sm border border-white/5 text-indigo-300 shadow-lg"
        >
          <Bell size={22} />
        </motion.div>
      </div>

      {/* Premium Stats Cards with Gradient Backgrounds */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        {[
          { icon: Users, label: "Active Users", value: "1,243", change: "+12%", gradient: "from-blue-600 to-blue-400" },
          { icon: DollarSign, label: "Monthly Revenue", value: "$12.4K", change: "+8%", gradient: "from-emerald-600 to-emerald-400" },
          { icon: TrendingUp, label: "Conversion Rate", value: "14%", change: "+2%", gradient: "from-violet-600 to-violet-400" },
          { icon: Activity, label: "System Health", value: "98%", change: "+1%", gradient: "from-cyan-600 to-cyan-400" },
        ].map((stat, i) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              whileHover={{ translateY: -4 }}
              className={`bg-gradient-to-br ${stat.gradient} p-[1px] rounded-2xl overflow-hidden group cursor-pointer shadow-lg`}
            >
                <div className="bg-slate-900 rounded-2xl p-5 relative ring-1 ring-white/5 backdrop-blur-sm">
                  <div className="absolute -right-8 -top-8 w-24 h-24 bg-gradient-to-br from-white/5 to-white/2 rounded-full blur-3xl opacity-30 group-hover:scale-125 transition-transform duration-300" />
                <div className="flex items-start justify-between relative z-10">
                  <div>
                    <div className="text-slate-400 text-sm font-medium">{stat.label}</div>
                    <div className="text-2xl font-bold text-white mt-2">{stat.value}</div>
                    <div className="text-xs text-emerald-400 font-semibold mt-2 flex items-center gap-1">
                      <ArrowUpRight size={14} /> {stat.change} this month
                    </div>
                  </div>
                  <div className={`p-3 rounded-lg bg-gradient-to-br ${stat.gradient} text-white shadow-md ring-1 ring-white/5`}>
                    <Icon size={20} />
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Report / Analyst Panel */}
        <div className="lg:col-span-2 space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-gradient-to-br from-indigo-900/20 to-purple-900/20 border border-indigo-500/30 rounded-2xl p-6 backdrop-blur-xl shadow-2xl overflow-hidden"
          >
            <div className="flex items-start justify-between gap-4 mb-6">
              <div>
                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-gradient-to-r from-blue-400 to-indigo-400" />
                  Research Report: Q4 Market Signals
                </h3>
                <p className="text-sm text-slate-400 mt-2">Comprehensive analysis of market trends and investment opportunities</p>
              </div>
              <Button className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 flex items-center gap-2">
                <DownloadCloud size={16} /> Export
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                { title: "Total Signals", value: "328", insight: "+12% vs last month" },
                { title: "Actionable Leads", value: "48", insight: "Conversion: 14%" },
                { title: "Avg. Time-to-Insight", value: "3.2d", insight: "Improved by 0.6d" },
              ].map((item, i) => (
                <div key={i} className="p-4 rounded-lg bg-slate-900 border border-black hover:border-black hover:border-indigo-500/30 transition-colors shadow-sm ring-1 ring-black/5">
                  <div className="text-xs text-slate-400 font-semibold uppercase tracking-wider">{item.title}</div>
                  <div className="text-3xl font-bold text-white mt-2">{item.value}</div>
                  <div className="text-xs text-slate-400 mt-2">{item.insight}</div>
                </div>
              ))}
            </div>

            <div className="mt-6 rounded-lg overflow-hidden border border-black shadow-lg">
            <ChartCard />
            </div>
          </motion.div>

          {/* Recent Reports */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-slate-700/50 rounded-2xl p-6 backdrop-blur-xl shadow-xl"
          >
            <h4 className="font-bold text-white mb-4 flex items-center gap-2">
              <MessageSquare size={18} className="text-indigo-400" />
              Recent Updates And Submissions
            </h4>
            <div className="space-y-3">
              {[
                { title: "Macro Trends — 2025-11-30", author: "J. Analyst", type: "PDF", color: "from-red-600 to-red-400" },
                { title: "Sector Watch — Semiconductors", author: "M. Rivera", type: "Draft", color: "from-yellow-600 to-yellow-400" },
              ].map((report, i) => (
                <div key={i} className="flex items-center justify-between p-3 rounded-lg hover:bg-slate-700/30 transition-colors group cursor-pointer shadow-sm ring-1 ring-white/5">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${report.color} opacity-20 group-hover:opacity-40 transition-opacity shadow-inner`} />
                    <div>
                      <div className="text-white font-medium text-sm">{report.title}</div>
                      <div className="text-xs text-slate-400">by {report.author}</div>
                    </div>
                  </div>
                  <div className="text-xs font-semibold text-slate-400">{report.type}</div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Right Column: Clients & Settings */}
        <div className="space-y-6">
          {/* Clients */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-slate-700/50 rounded-2xl p-6 backdrop-blur-xl shadow-xl"
          >
            <h3 className="font-bold text-white mb-4 flex items-center justify-between">
              <span className="flex items-center gap-2">
                <Users size={18} className="text-emerald-400" />
                People Who Need Your Expertise Today
              </span>
              <span className="text-xs text-slate-400">Active</span>
            </h3>

            <div className="space-y-3">
              {clients.map((c) => (
                <div key={c.name} className="flex items-start gap-3 p-3 rounded-lg hover:bg-slate-700/30 transition-colors shadow-sm ring-1 ring-white/5">
                  <div className={`w-12 h-12 rounded-lg flex items-center justify-center font-bold text-white flex-shrink-0 bg-gradient-to-br ${
                    c.status === "Converted" ? "from-emerald-600 to-emerald-400" :
                    c.status === "Follow-up" ? "from-yellow-600 to-yellow-400" :
                    "from-blue-600 to-blue-400"
                  }`}>
                    {c.name.charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <div className="text-white font-medium text-sm">{c.name}</div>
                      <span className={`text-xs font-semibold px-2 py-1 rounded-full ${
                        c.status === "Converted" ? "bg-emerald-900/30 text-emerald-300" :
                        c.status === "Follow-up" ? "bg-yellow-900/30 text-yellow-300" :
                        "bg-blue-900/30 text-blue-300"
                      }`}>
                        {c.status}
                      </span>
                    </div>
                    <div className="text-xs text-slate-400 mt-1 truncate">{c.contact}</div>
                    <div className="text-xs text-slate-500 mt-1 line-clamp-1">{c.note}</div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Settings */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-slate-700/50 rounded-2xl p-6 backdrop-blur-xl shadow-xl"
          >
            <h3 className="font-bold text-white mb-4 flex items-center gap-2">
              <SettingsIcon size={18} className="text-violet-400" />
              Customize How You Work
            </h3>

            <div className="space-y-4">
              {[
                { label: "Email Alerts", desc: "Key signal notifications", state: emailAlerts, setter: setEmailAlerts },
                { label: "Weekly Summary", desc: "Monday digest", state: weeklySummary, setter: setWeeklySummary },
                { label: "Auto Export", desc: "CSV reports periodically", state: autoExport, setter: setAutoExport },
              ].map((pref, i) => (
                <label key={i} className="flex items-center justify-between cursor-pointer group">
                  <div>
                    <div className="text-white font-medium text-sm">{pref.label}</div>
                    <div className="text-xs text-slate-400">{pref.desc}</div>
                  </div>
                  <input
                    type="checkbox"
                    checked={pref.state}
                    onChange={(e) => pref.setter(e.target.checked)}
                    className="w-5 h-5 rounded accent-indigo-500 cursor-pointer"
                  />
                </label>
              ))}

              <Button className="w-full mt-4 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 flex items-center justify-center gap-2 shadow-md">
                <DownloadCloud size={16} /> Export Now
              </Button>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Feature Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
        {[
          { title: "Overview", desc: "Your data in one place", icon: "📊" },
          { title: "Reports", desc: "In-depth reports and trends", icon: "📈" },
          { title: "Settings", desc: "Personalize your dashboard", icon: "⚙️" },
        ].map((card, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: i * 0.08 }}
            whileHover={{ translateY: -8, scale: 1.02 }}
            className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-slate-700/50 rounded-2xl p-6 backdrop-blur-xl group cursor-pointer overflow-hidden relative shadow-xl"
          >
            <div className="absolute -right-8 -top-8 w-24 h-24 bg-gradient-to-br from-indigo-500/20 to-purple-500/20 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-300" />
            <div className="relative z-10">
              <div className="text-3xl mb-3">{card.icon}</div>
              <h2 className="text-lg font-bold text-white">{card.title}</h2>
              <p className="text-slate-400 text-sm mt-2">{card.desc}</p>
            </div>
          </motion.div>
        ))}
      </div>

      </div>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="mt-12 text-slate-500 text-center text-sm"
      >
        ✨ More features coming soon — stay tuned!
      </motion.p>
    </div>
  );
}
