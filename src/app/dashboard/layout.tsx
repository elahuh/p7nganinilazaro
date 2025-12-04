"use client";

import { useRouter, usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { getToken, logoutUser } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Menu, Sun, Moon, ChevronDown, ChevronRight } from "lucide-react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();

  const [mobileOpen, setMobileOpen] = useState(false);
  const [dark, setDark] = useState(false);
  const [tokenValue, setTokenValue] = useState<string | null>(null);
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    const t = getToken();
    if (!t) {
      router.push("/");
    } else {
      setTokenValue(t);
    }
  }, [router]);

  function handleLogout() {
    logoutUser(); // clear token/session
    router.push("/"); // redirect to home page
  }

  useEffect(() => {
    if (dark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [dark]);

  const navItems = [
    { key: "overview", label: "Overview", href: "/dashboard" },
    {
      key: "reports",
      label: "Reports",
      href: "/dashboard/reports",
      children: [
        { key: "reports-all", label: "All Reports", href: "/dashboard/reports" },
        { key: "reports-new", label: "Create Report", href: "/dashboard/reports/new" },
      ],
    },
    {
      key: "settings",
      label: "Settings",
      href: "/dashboard/settings",
      children: [
        { key: "settings-profile", label: "Profile", href: "/dashboard/settings/profile" },
        { key: "settings-prefs", label: "Preferences", href: "/dashboard/settings/preferences" },
      ],
    },
  ];

  const [expanded, setExpanded] = useState<Record<string, boolean>>({});

  function toggleExpand(key: string) {
    setExpanded((prev) => ({ ...prev, [key]: !prev[key] }));
  }

  const sidebarOffsetClass = collapsed ? "md:ml-20" : "md:ml-64";

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex">
      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 z-40 h-full bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6 transition-all duration-200 shadow-2xl ring-1 ring-white/5 backdrop-blur-sm
        ${collapsed ? 'w-20 px-3' : 'w-64 px-6'}
        ${mobileOpen ? "translate-x-0" : "-translate-x-64"} md:translate-x-0`}
      >
        <div className="flex items-center justify-between mb-4">
          <h1 className={`text-2xl font-bold text-white ${collapsed ? 'sr-only' : ''}`}>Dashboard</h1>
          <button
            aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            onClick={() => setCollapsed((s) => !s)}
            className="p-2 rounded bg-white/6 hover:bg-white/8 text-white shadow-sm border border-white/5"
          >
            <ChevronRight size={18} className={`${collapsed ? 'transform rotate-180' : 'transform rotate-0'} transition-transform`} />
          </button>
        </div>
        <div className="absolute -right-6 top-8 w-24 h-24 bg-gradient-to-br from-indigo-500/10 to-purple-500/8 rounded-full blur-3xl opacity-30 pointer-events-none" />

        <nav className="flex flex-col gap-1">
          {navItems.map((item) => {
            const isActiveParent = pathname === item.href;
            const hasChildren = !!item.children?.length;

            return (
              <div key={item.key} className="w-full">
                <div className="flex items-center justify-between">
                  <button
                    onClick={() => (hasChildren ? toggleExpand(item.key) : router.push(item.href))}
                    aria-expanded={hasChildren ? !!expanded[item.key] : undefined}
                    className={`w-full text-left px-3 py-2 rounded-lg transition flex items-center justify-between gap-2 ${
                      isActiveParent
                        ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md"
                        : "text-slate-300 hover:bg-slate-700/40"
                    }`}
                  >
                    {collapsed ? (
                      <span className="w-8 h-8 flex items-center justify-center rounded-md text-sm font-medium text-white" title={item.label}>
                        <span className="flex flex-col gap-1">
                          <span className="block w-4 h-[2px] bg-slate-300/80" />
                          <span className="block w-4 h-[2px] bg-slate-300/80" />
                          <span className="block w-4 h-[2px] bg-slate-300/80" />
                        </span>
                      </span>
                    ) : (
                      <span className="truncate">{item.label}</span>
                    )}
                    {hasChildren && !collapsed && (
                      <ChevronDown
                        size={16}
                        className={`${expanded[item.key] ? "transform rotate-180" : ""} transition-transform text-slate-300`}
                      />
                    )}
                  </button>
                </div>

                {hasChildren && !collapsed && (
                  <div
                    className={`pl-4 mt-2 overflow-hidden transition-[max-height,opacity] duration-300 ${
                      expanded[item.key] ? "max-h-40 opacity-100" : "max-h-0 opacity-0"
                    }`}
                    aria-hidden={!expanded[item.key]}
                  >
                    <div className="flex flex-col gap-1">
                      {item.children!.map((child) => (
                        <button
                          key={child.key}
                          onClick={() => router.push(child.href)}
                          className={`px-3 py-2 rounded-md text-left text-sm transition w-full ${
                            pathname === child.href
                              ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white"
                              : "text-slate-300 hover:bg-slate-700/30"
                          }`}
                        >
                          {child.label}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </nav>

    

        <div className="mt-4">
          <Button
            className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 shadow-md"
            onClick={handleLogout}
          >
            Logout
          </Button>
        </div>
      </aside>

      {/* Overlay for mobile */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/40 md:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Mobile Top Bar */}
      <header className="md:hidden w-full fixed top-0 left-0 bg-gradient-to-br from-slate-900/90 via-slate-800/90 to-slate-900/90 border-b border-neutral-800 p-4 flex items-center justify-between z-30 backdrop-blur-sm">
        <button onClick={() => setMobileOpen(true)}>
          <Menu size={28} className="text-slate-200" />
        </button>

        <h2 className="text-lg font-semibold dark:text-white">Dashboard</h2>

        <div className="w-8"></div>
      </header>

      {/* Main Content */}
      <main className={`flex-1 p-6 mt-14 md:mt-0 transition-all duration-200 ${collapsed ? 'md:ml-20' : 'md:ml-64'}`}>
        {children}
      </main>
    </div>
  );
}
