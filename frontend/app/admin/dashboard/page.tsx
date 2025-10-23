"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Lock, Users, Code, AlertCircle, Activity, LogOut, RefreshCw } from "lucide-react";
import { apiUrl } from "@/lib/api-config";

interface DashboardData {
  activeStudents24h: number;
  totalStudentsThisWeek: number;
  totalExecutions: number;
  commonErrors: Array<{ error: string; count: number }>;
}

interface Session {
  sessionId: string;
  username?: string;
  executionCount: number;
  errorMessages: string[];
  startTime: string;
  lastActivity: string;
  ipAddress?: string;
}

export default function AdminDashboard() {
  const [adminKey, setAdminKey] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [dashboard, setDashboard] = useState<DashboardData | null>(null);
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Check if admin key is stored in localStorage
  useEffect(() => {
    const stored = localStorage.getItem("adminKey");
    if (stored) {
      setAdminKey(stored);
      fetchDashboardData(stored);
    }
  }, []);

  const fetchDashboardData = async (key: string) => {
    setLoading(true);
    setError("");

    try {
      // Fetch dashboard stats
      const dashboardRes = await fetch(apiUrl("/api/admin/dashboard"), {
        headers: {
          "x-admin-key": key,
        },
      });

      if (!dashboardRes.ok) {
        if (dashboardRes.status === 403) {
          throw new Error("Invalid admin key");
        }
        throw new Error("Failed to fetch dashboard");
      }

      const dashboardData = await dashboardRes.json();
      setDashboard(dashboardData.dashboard);

      // Fetch sessions
      const sessionsRes = await fetch(
        apiUrl(`/api/admin/sessions?page=${currentPage}&limit=20`),
        {
          headers: {
            "x-admin-key": key,
          },
        }
      );

      if (!sessionsRes.ok) {
        throw new Error("Failed to fetch sessions");
      }

      const sessionsData = await sessionsRes.json();
      setSessions(sessionsData.sessions);
      setTotalPages(sessionsData.pagination.pages);

      setIsAuthenticated(true);
      localStorage.setItem("adminKey", key);
    } catch (err: any) {
      setError(err.message || "Failed to load dashboard");
      setIsAuthenticated(false);
      localStorage.removeItem("adminKey");
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (adminKey.trim()) {
      fetchDashboardData(adminKey.trim());
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setAdminKey("");
    setDashboard(null);
    setSessions([]);
    localStorage.removeItem("adminKey");
  };

  const handleRefresh = () => {
    if (adminKey) {
      fetchDashboardData(adminKey);
    }
  };

  // Login Screen
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
        <div className="bg-slate-800 rounded-lg shadow-2xl p-8 w-full max-w-md border border-slate-700">
          <div className="flex items-center justify-center mb-6">
            <Lock className="h-12 w-12 text-blue-500" />
          </div>
          <h1 className="text-2xl font-bold text-center mb-2 text-white">Admin Dashboard</h1>
          <p className="text-center text-slate-400 mb-6">Enter your secret key to access</p>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Admin Secret Key
              </label>
              <Input
                type="password"
                value={adminKey}
                onChange={(e) => setAdminKey(e.target.value)}
                placeholder="Enter your admin key..."
                className="w-full bg-slate-700 border-slate-600 text-white"
                disabled={loading}
              />
            </div>

            {error && (
              <div className="bg-red-500/10 border border-red-500/50 rounded-md p-3 flex items-start gap-2">
                <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-red-400">{error}</p>
              </div>
            )}

            <Button
              type="submit"
              className="w-full"
              disabled={loading || !adminKey.trim()}
            >
              {loading ? "Authenticating..." : "Access Dashboard"}
            </Button>
          </form>

          <p className="mt-4 text-xs text-center text-slate-500">
            The admin key is stored in backend/.env as ADMIN_SECRET_KEY
          </p>
        </div>
      </div>
    );
  }

  // Dashboard Screen
  return (
    <div className="min-h-screen bg-slate-900 text-white">
      {/* Header */}
      <div className="bg-slate-800 border-b border-slate-700 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Admin Dashboard</h1>
            <p className="text-sm text-slate-400">Monitor student activity</p>
          </div>
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={handleRefresh}
              disabled={loading}
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
            <Button variant="destructive" size="sm" onClick={handleLogout}>
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      {dashboard && (
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {/* Active Students */}
            <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-medium text-slate-400">Active Students (24h)</h3>
                <Users className="h-5 w-5 text-blue-500" />
              </div>
              <p className="text-3xl font-bold">{dashboard.activeStudents24h}</p>
            </div>

            {/* Total Students */}
            <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-medium text-slate-400">Students This Week</h3>
                <Activity className="h-5 w-5 text-green-500" />
              </div>
              <p className="text-3xl font-bold">{dashboard.totalStudentsThisWeek}</p>
            </div>

            {/* Total Executions */}
            <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-medium text-slate-400">Total Executions</h3>
                <Code className="h-5 w-5 text-purple-500" />
              </div>
              <p className="text-3xl font-bold">{dashboard.totalExecutions}</p>
            </div>

            {/* Error Count */}
            <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-medium text-slate-400">Unique Errors</h3>
                <AlertCircle className="h-5 w-5 text-red-500" />
              </div>
              <p className="text-3xl font-bold">{dashboard.commonErrors.length}</p>
            </div>
          </div>

          {/* Common Errors */}
          <div className="bg-slate-800 rounded-lg p-6 border border-slate-700 mb-8">
            <h2 className="text-lg font-semibold mb-4">Most Common Errors</h2>
            {dashboard.commonErrors.length > 0 ? (
              <div className="space-y-3">
                {dashboard.commonErrors.map((err, idx) => (
                  <div key={idx} className="flex items-center justify-between p-3 bg-slate-700 rounded">
                    <span className="text-sm text-slate-300">{err.error}</span>
                    <span className="text-sm font-semibold text-red-400">{err.count} times</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-slate-400">No errors recorded yet</p>
            )}
          </div>

          {/* Sessions List */}
          <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
            <h2 className="text-lg font-semibold mb-4">Student Sessions</h2>
            {sessions.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-slate-700">
                      <th className="text-left py-3 px-4 text-sm font-medium text-slate-400">Student Name</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-slate-400">Executions</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-slate-400">Errors</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-slate-400">Last Activity</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-slate-400">Session ID</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sessions.map((session) => (
                      <tr key={session.sessionId} className="border-b border-slate-700 hover:bg-slate-700/50">
                        <td className="py-3 px-4 text-sm font-semibold text-blue-400">
                          {session.username || 'Anonymous'}
                        </td>
                        <td className="py-3 px-4 text-sm">{session.executionCount}</td>
                        <td className="py-3 px-4 text-sm">{session.errorMessages.length}</td>
                        <td className="py-3 px-4 text-sm">
                          {new Date(session.lastActivity).toLocaleString()}
                        </td>
                        <td className="py-3 px-4 text-sm font-mono text-slate-500">
                          {session.sessionId.substring(0, 8)}...
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex items-center justify-center gap-2 mt-4">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                      disabled={currentPage === 1}
                    >
                      Previous
                    </Button>
                    <span className="text-sm text-slate-400">
                      Page {currentPage} of {totalPages}
                    </span>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                      disabled={currentPage === totalPages}
                    >
                      Next
                    </Button>
                  </div>
                )}
              </div>
            ) : (
              <p className="text-slate-400">No sessions recorded yet</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
