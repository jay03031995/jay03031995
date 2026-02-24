'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  Plus,
  ArrowUpRight,
  AlertCircle,
  Clock,
  Webhook,
  Filter,
  RefreshCw,
  Key,
  AlertTriangle,
  BookOpen,
  MessageSquare,
  Flag,
  Bell,
  User
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { formatDate } from '@/lib/utils';
import toast from 'react-hot-toast';

export default function ApiManagementPage() {
  const [integrations, setIntegrations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchIntegrations();
  }, []);

  const fetchIntegrations = async () => {
    try {
      const res = await fetch('/api/admin/api-management');
      const data = await res.json();
      setIntegrations(data);
    } catch (error) {
      toast.error('Failed to fetch integrations');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-background-light dark:bg-background-dark font-display text-slate-900 dark:text-slate-100">
      <header className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-6 py-3 sticky top-0 z-50">
        <div className="flex items-center gap-8">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-white">
              <span className="material-symbols-outlined">dermatology</span>
            </div>
            <div className="flex flex-col">
              <h2 className="text-lg font-bold leading-tight tracking-tight text-slate-900 dark:text-white">DermCare CMS</h2>
              <span className="text-slate-500 text-xs font-medium uppercase tracking-wider">Medical Admin</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" className="bg-slate-100 dark:bg-slate-800">
            <Bell className="h-5 w-5" />
          </Button>
          <div className="flex items-center gap-3">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-semibold">Dr. Sarah Chen</p>
              <p className="text-xs text-slate-500">System Admin</p>
            </div>
            <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center border-2 border-primary/30">
              <User className="h-5 w-5 text-primary" />
            </div>
          </div>
        </div>
      </header>

      <div className="flex flex-1">
        <aside className="w-64 border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hidden lg:flex flex-col p-4 gap-2 text-slate-900 dark:text-slate-100">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-4 px-3">Navigation</p>
          <Link href="/admin/posts" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-100 transition-all">
            <span className="material-symbols-outlined">article</span>
            <span className="text-sm font-semibold">Posts</span>
          </Link>
          <Link href="/admin/api-management" className="flex items-center gap-3 px-3 py-2.5 rounded-lg bg-primary/10 text-primary border border-primary/20 transition-all">
            <span className="material-symbols-outlined">api</span>
            <span className="text-sm font-bold">API Management</span>
          </Link>
          <div className="mt-auto p-4 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
            <p className="text-xs font-bold mb-1">Quota Usage</p>
            <div className="w-full h-1.5 bg-slate-200 rounded-full mb-2 overflow-hidden">
              <div className="h-full bg-primary w-3/4 rounded-full"></div>
            </div>
            <p className="text-[10px] text-slate-500">75% of monthly API calls used</p>
          </div>
        </aside>

        <main className="flex-1 flex flex-col p-6 lg:p-10 gap-8 overflow-y-auto">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-3xl font-extrabold tracking-tight">API Management</h1>
              <p className="text-slate-500 mt-1">Configure and monitor your dermatological service integrations.</p>
            </div>
            <Button className="flex items-center gap-2 bg-primary text-white px-5 py-2.5 rounded-lg font-bold shadow-lg shadow-primary/20">
              <Plus className="h-5 w-5" />
              <span>Connect New API</span>
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { label: 'Total API Calls', value: '1,248,502', change: '+12%', icon: ArrowUpRight, color: 'blue' },
              { label: 'Error Rate (%)', value: '0.45%', change: '-2%', icon: AlertCircle, color: 'red' },
              { label: 'Avg Response Time', value: '120ms', change: '+5%', icon: Clock, color: 'amber' },
              { label: 'Active Webhooks', value: '8', change: '0%', icon: Webhook, color: 'emerald' },
            ].map((m, i) => (
              <div key={i} className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 flex flex-col gap-2 shadow-sm">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-slate-500 text-sm font-medium">{m.label}</span>
                  <div className={`p-2 bg-slate-100 dark:bg-slate-800 rounded-lg text-primary`}>
                    <m.icon className="h-5 w-5" />
                  </div>
                </div>
                <div className="flex items-end gap-2 text-slate-900 dark:text-white">
                  <span className="text-2xl font-bold">{m.value}</span>
                  <span className={`${m.change.startsWith('+') ? 'text-green-500' : 'text-red-500'} text-xs font-bold pb-1`}>{m.change}</span>
                </div>
              </div>
            ))}
          </div>

          <div className="flex flex-col xl:flex-row gap-6">
            <div className="flex-[3] flex flex-col gap-4">
              <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
                <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center">
                  <h3 className="font-bold text-slate-900 dark:text-white">Active Integrations</h3>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="bg-slate-50 dark:bg-slate-800/50 text-xs font-bold text-slate-500 uppercase tracking-wider">
                        <th className="px-6 py-3">Service Name</th>
                        <th className="px-6 py-3">Status</th>
                        <th className="px-6 py-3">API Key</th>
                        <th className="px-6 py-3">Last Sync</th>
                        <th className="px-6 py-3 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 dark:divide-slate-800 text-sm text-slate-900 dark:text-slate-100">
                      {loading ? (
                         <tr><td colSpan={5} className="px-6 py-8 text-center">Loading...</td></tr>
                      ) : integrations.length === 0 ? (
                        <tr><td colSpan={5} className="px-6 py-8 text-center text-slate-500 italic">No integrations found. Connect your first service above.</td></tr>
                      ) : integrations.map(item => (
                        <tr key={item.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <div className="h-8 w-8 rounded-lg bg-blue-100 flex items-center justify-center text-blue-600">
                                <span className="material-symbols-outlined text-sm">inventory_2</span>
                              </div>
                              <span className="font-bold">{item.name}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold ${item.status ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-700'}`}>
                              <span className={`h-1.5 w-1.5 rounded-full ${item.status ? 'bg-green-600' : 'bg-slate-400'}`}></span> {item.status ? 'Active' : 'Inactive'}
                            </span>
                          </td>
                          <td className="px-6 py-4 font-mono text-xs text-slate-500">{item.apiKey?.substring(0, 10)}••••••</td>
                          <td className="px-6 py-4 text-xs text-slate-500">{item.lastSync ? formatDate(item.lastSync) : 'Never'}</td>
                          <td className="px-6 py-4 text-right">
                            <Link href={`/admin/api-management/${item.id}`}>
                              <button className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded text-slate-500"><span className="material-symbols-outlined text-[20px]">edit</span></button>
                            </Link>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            <aside className="flex-1 flex flex-col gap-6">
              <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
                <h3 className="font-bold text-slate-900 dark:text-white mb-6 flex items-center justify-between">Recent Activity</h3>
                <div className="flex flex-col gap-6">
                  {integrations.flatMap(i => i.activities).slice(0, 4).map((act, idx) => (
                    <div key={idx} className="flex gap-4 relative">
                      <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 flex-shrink-0 z-10">
                        <RefreshCw className="h-4 w-4" />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-slate-900 dark:text-white">{act.type}</p>
                        <p className="text-xs text-slate-500 mt-0.5">{act.description}</p>
                        <span className="text-[10px] text-slate-400 font-medium">{formatDate(act.createdAt)}</span>
                      </div>
                    </div>
                  ))}
                  {(!loading && integrations.length === 0) && <p className="text-xs text-slate-400 italic">No recent activity.</p>}
                </div>
              </div>

              <div className="bg-gradient-to-br from-primary to-blue-700 p-6 rounded-xl text-white shadow-xl shadow-blue-500/10">
                <h4 className="font-bold mb-2">Developer Documentation</h4>
                <p className="text-xs text-blue-100 mb-4 leading-relaxed">Need help integrating with our internal CMS APIs? Explore our technical guides.</p>
                <button className="inline-flex items-center gap-2 bg-white text-primary px-4 py-2 rounded-lg text-xs font-bold hover:bg-blue-50 transition-colors">
                  <BookOpen className="h-4 w-4" />
                  Explore Docs
                </button>
              </div>

              <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
                <h3 className="font-bold text-slate-900 dark:text-white mb-4">Support</h3>
                <div className="flex flex-col gap-3">
                  <div className="flex items-center justify-between p-3 rounded-lg border border-slate-100 dark:border-slate-800 hover:border-primary/20 transition-all cursor-pointer group">
                    <div className="flex items-center gap-3">
                      <MessageSquare className="h-4 w-4 text-slate-400 group-hover:text-primary" />
                      <span className="text-sm font-medium">API Support Chat</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-lg border border-slate-100 dark:border-slate-800 hover:border-primary/20 transition-all cursor-pointer group">
                    <div className="flex items-center gap-3">
                      <Flag className="h-4 w-4 text-slate-400 group-hover:text-primary" />
                      <span className="text-sm font-medium">Report a Bug</span>
                    </div>
                  </div>
                </div>
              </div>
            </aside>
          </div>
        </main>
      </div>
    </div>
  );
}
