'use client';

import { useEffect, useState, use } from 'react';
import Link from 'next/link';
import { ChevronRight, Key, Link as LinkIcon, Settings2, Activity, RotateCw, Save, Eye } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import toast from 'react-hot-toast';
import { formatDate } from '@/lib/utils';

export default function ApiConfigPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [integration, setIntegration] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchIntegration = async () => {
      try {
        const res = await fetch(`/api/admin/api-management/${id}`);
        if (res.ok) {
          setIntegration(await res.json());
        }
      } catch (error) {
        toast.error('Failed to fetch integration details');
      } finally {
        setLoading(false);
      }
    };
    fetchIntegration();
  }, [id]);

  const handleSave = async () => {
    try {
      const res = await fetch(`/api/admin/api-management/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(integration),
      });
      if (res.ok) {
        toast.success('Configuration saved');
      } else {
        toast.error('Failed to save configuration');
      }
    } catch (error) {
      toast.error('An error occurred');
    }
  };

  if (loading) return <div className="p-8 text-slate-900 dark:text-slate-100">Loading configuration...</div>;
  if (!integration) return <div className="p-8 text-slate-900 dark:text-slate-100">Integration not found</div>;

  return (
    <div className="bg-background-light dark:bg-background-dark font-display text-slate-900 dark:text-slate-100 min-h-screen">
      <header className="flex items-center justify-between border-b border-slate-200 bg-white dark:bg-slate-900 px-10 py-3 sticky top-0 z-50">
        <div className="flex items-center gap-8">
          <div className="flex items-center gap-4 text-slate-900 dark:text-white">
            <div className="size-6 text-primary flex items-center justify-center">
              <span className="material-symbols-outlined text-3xl">medical_services</span>
            </div>
            <h2 className="text-lg font-bold tracking-tight">DermCare CMS</h2>
          </div>
          <nav className="flex items-center gap-9 text-sm font-medium">
            <Link href="/admin/posts" className="text-slate-600 hover:text-primary">Posts</Link>
            <Link href="/admin/api-management" className="text-primary border-b-2 border-primary py-1">API Management</Link>
          </nav>
        </div>
      </header>

      <main className="flex justify-center py-8">
        <div className="max-w-[1024px] flex-1 px-10">
          <div className="flex items-center gap-2 mb-6 text-sm">
            <Link href="/admin/api-management" className="text-slate-500 hover:text-primary">API Management</Link>
            <ChevronRight className="h-4 w-4 text-slate-400" />
            <span className="text-slate-900 dark:text-white font-bold">{integration.name}</span>
          </div>

          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-black tracking-tight">Configure {integration.name}</h1>
              <p className="text-slate-500">Manage your product recommendation engine integration and sync settings</p>
            </div>
            <div className="bg-white dark:bg-slate-800 p-2 rounded-xl shadow-sm border border-slate-200 flex items-center gap-3">
              <span className="text-sm font-semibold px-2">Status</span>
              <button
                type="button"
                onClick={() => setIntegration({...integration, status: !integration.status})}
                className={`px-4 py-2 rounded-lg font-bold text-sm flex items-center gap-2 border ${integration.status ? 'bg-emerald-100 text-emerald-700 border-emerald-200' : 'bg-slate-100 text-slate-700 border-slate-200'}`}
              >
                <span className={`h-2 w-2 rounded-full ${integration.status ? 'bg-emerald-500' : 'bg-slate-400'}`}></span>
                {integration.status ? 'Enabled' : 'Disabled'}
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
            <div className="md:col-span-8 space-y-8">
              <section className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 shadow-sm space-y-6">
                <div className="flex items-center gap-2 mb-2">
                  <Key className="h-5 w-5 text-primary" />
                  <h3 className="text-lg font-bold">Authentication</h3>
                </div>
                <div className="space-y-4">
                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-semibold">API Key</label>
                    <div className="flex rounded-lg border border-slate-300 overflow-hidden bg-slate-50 dark:bg-slate-800">
                      <input
                        type="password"
                        className="flex-1 p-3 text-sm bg-transparent border-none focus:ring-0"
                        value={integration.apiKey || ''}
                        onChange={e => setIntegration({...integration, apiKey: e.target.value})}
                      />
                      <button type="button" className="px-4 text-slate-500"><Eye className="h-4 w-4" /></button>
                    </div>
                  </div>
                </div>
              </section>

              <section className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 shadow-sm space-y-6">
                <div className="flex items-center gap-2">
                  <LinkIcon className="h-5 w-5 text-primary" />
                  <h3 className="text-lg font-bold">Endpoint Configuration</h3>
                </div>
                <div className="space-y-4">
                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-semibold">Base URL</label>
                    <Input
                      className="p-3"
                      value={integration.baseUrl || ''}
                      onChange={e => setIntegration({...integration, baseUrl: e.target.value})}
                    />
                  </div>
                </div>
              </section>
            </div>

            <aside className="md:col-span-4">
              <section className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 shadow-sm sticky top-8 space-y-6">
                <div className="flex items-center gap-2">
                  <Activity className="h-5 w-5 text-primary" />
                  <h3 className="text-lg font-bold">Health Check</h3>
                </div>
                <div className="bg-slate-50 dark:bg-slate-800/50 rounded-lg p-4">
                  <p className="text-xs font-bold text-slate-500 uppercase mb-4">Recent Logs</p>
                  <ul className="space-y-4">
                    {integration.activities?.slice(0, 3).map((act: any, i: number) => (
                      <li key={i} className="flex gap-3">
                        <span className="material-symbols-outlined text-emerald-500 text-sm">check_circle</span>
                        <div>
                          <p className="text-xs font-bold">{act.type}</p>
                          <p className="text-[10px] text-slate-500">{formatDate(act.createdAt)}</p>
                        </div>
                      </li>
                    ))}
                    {!integration.activities?.length && <p className="text-xs text-slate-400 italic">No logs available.</p>}
                  </ul>
                </div>
                <Button type="button" className="w-full bg-primary/10 text-primary hover:bg-primary hover:text-white font-bold border border-primary/20">
                  <RotateCw className="h-4 w-4 mr-2" />
                  Test Connection
                </Button>
              </section>
            </aside>
          </div>

          <div className="flex items-center justify-end gap-4 mt-12 py-6 border-t border-slate-200">
            <Link href="/admin/api-management">
              <button type="button" className="px-6 py-2.5 text-slate-600 font-bold text-sm">Cancel</button>
            </Link>
            <Button
              onClick={handleSave}
              className="px-8 py-2.5 bg-primary text-white font-bold rounded-lg shadow-lg shadow-primary/20 flex items-center gap-2"
            >
              <Save className="h-4 w-4" />
              Save Changes
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}
