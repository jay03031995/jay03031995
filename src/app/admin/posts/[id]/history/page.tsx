'use client';

import { useEffect, useState, use } from 'react';
import Link from 'next/link';
import {
  ChevronRight,
  History,
  Columns2,
  Rows2,
  UserCircle,
  FileText,
  Circle,
  PlusCircle,
  MinusCircle,
  ShieldCheck,
  User
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { formatDate } from '@/lib/utils';
import toast from 'react-hot-toast';

export default function VersionHistoryPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [post, setPost] = useState<any>(null);
  const [versions, setVersions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedVersionIndex, setSelectedVersionIndex] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [postRes, versionsRes] = await Promise.all([
          fetch(`/api/admin/posts/${id}`),
          fetch(`/api/admin/posts/${id}/versions`)
        ]);

        if (postRes.ok && versionsRes.ok) {
          setPost(await postRes.json());
          setVersions(await versionsRes.json());
        }
      } catch (error) {
        toast.error('Failed to fetch version history');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  if (loading) return <div className="p-8 text-slate-900 dark:text-slate-100">Loading history...</div>;
  if (!post) return <div className="p-8 text-slate-900 dark:text-slate-100">Post not found</div>;

  const previousVersion = versions[selectedVersionIndex] || null;

  return (
    <div className="bg-background-light dark:bg-background-dark font-display text-slate-900 dark:text-slate-100 antialiased min-h-screen flex flex-col">
      <header className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-6 lg:px-10 py-3 sticky top-0 z-50">
        <div className="flex items-center gap-4 text-slate-900 dark:text-slate-100">
          <div className="size-8 flex items-center justify-center text-primary">
            <span className="material-symbols-outlined text-3xl">medical_services</span>
          </div>
          <h2 className="text-lg font-bold leading-tight tracking-[-0.015em]">DermCare CMS</h2>
        </div>
        <div className="flex items-center gap-4">
           <Link href={`/admin/posts/${id}`}>
            <Button className="bg-primary text-white text-sm font-bold">Back to Editor</Button>
           </Link>
           <div className="size-10 rounded-full bg-slate-200 flex items-center justify-center dark:bg-slate-800">
             <User className="h-5 w-5 text-slate-500" />
           </div>
        </div>
      </header>

      <main className="flex-1 flex flex-col max-w-[1440px] mx-auto w-full px-4 lg:px-10 py-6">
        <div className="flex flex-wrap items-center gap-2 mb-4">
          <Link href="/admin/posts" className="text-slate-500 dark:text-slate-400 text-sm font-medium hover:text-primary">Blog Editor</Link>
          <ChevronRight className="h-4 w-4 text-slate-400" />
          <span className="text-slate-500 text-sm">{post.title}</span>
          <ChevronRight className="h-4 w-4 text-slate-400" />
          <span className="text-slate-900 dark:text-slate-100 text-sm font-bold">Version History</span>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 mb-6">
          <div className="flex flex-col gap-1">
            <h1 className="text-slate-900 dark:text-white text-3xl font-extrabold tracking-tight">Version Comparison</h1>
            <p className="text-slate-500 text-sm">Reviewing changes between the current working draft and previous versions.</p>
          </div>
          <div className="flex gap-3">
            <Button variant="ghost" className="flex items-center gap-2 bg-slate-200 dark:bg-slate-800 text-sm font-bold">
              <History className="h-4 w-4" />
              Restore Selected Version
            </Button>
          </div>
        </div>

        {/* Comparison Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 flex-1">
          {/* Left: Previous Version */}
          <div className="flex flex-col bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
            <div className="bg-slate-50 dark:bg-slate-800/50 px-5 py-4 border-b border-slate-200 dark:border-slate-800">
              <div className="flex items-center justify-between mb-2">
                <span className="px-2 py-0.5 bg-slate-200 dark:bg-slate-700 text-slate-600 text-xs font-bold rounded uppercase">
                  {previousVersion ? previousVersion.version : 'Initial'}
                </span>
                <span className="text-slate-400 text-xs font-medium">
                  {previousVersion ? formatDate(previousVersion.createdAt) : 'N/A'}
                </span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xs">
                   {previousVersion?.author?.name?.substring(0,2).toUpperCase() || '??'}
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-bold">{previousVersion?.author?.name || 'Unknown Author'}</span>
                  <span className="text-[10px] text-slate-500 uppercase tracking-wider">Editor</span>
                </div>
              </div>
            </div>
            <div className="p-6 space-y-4 overflow-y-auto max-h-[600px] text-slate-700 dark:text-slate-300 leading-relaxed">
               <h2 className="text-xl font-bold text-slate-900 dark:text-white">{previousVersion?.title || 'No previous version'}</h2>
               <div dangerouslySetInnerHTML={{ __html: previousVersion?.content || '<p>No content available for comparison.</p>' }} />
            </div>
          </div>

          {/* Right: Current Version */}
          <div className="flex flex-col bg-white dark:bg-slate-900 rounded-xl border border-primary/30 dark:border-primary/20 overflow-hidden shadow-xl shadow-primary/5">
            <div className="bg-primary/5 dark:bg-primary/10 px-5 py-4 border-b border-primary/20">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 bg-primary text-white text-xs font-bold rounded uppercase tracking-wide">Current Draft</span>
                  <span className="flex items-center gap-1 text-green-500 text-[10px] font-bold uppercase">
                    <Circle className="h-3 w-3 fill-current" />
                    Active
                  </span>
                </div>
                <span className="text-slate-400 text-xs font-medium">Modified {formatDate(post.updatedAt)}</span>
              </div>
              <div className="flex items-center gap-3">
                 <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary">
                    <FileText className="h-5 w-5" />
                 </div>
                 <div className="flex flex-col">
                   <span className="text-sm font-bold">Admin User</span>
                   <span className="text-[10px] text-slate-500 uppercase tracking-wider">Medical Editor</span>
                 </div>
              </div>
            </div>
            <div className="p-6 space-y-4 overflow-y-auto max-h-[600px] text-slate-700 dark:text-slate-300 leading-relaxed">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">{post.title}</h2>
              <div dangerouslySetInnerHTML={{ __html: post.content }} />
              <div className="mt-8 p-4 bg-primary/5 rounded-lg border-l-4 border-primary">
                <p className="italic text-sm">Tip: Compare the sections above to review clinical guideline updates.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Stats */}
        <div className="mt-8 bg-slate-100 dark:bg-slate-800/50 rounded-xl p-6 border border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-6">
           <div className="flex items-center gap-8">
             <div className="flex flex-col gap-1">
               <span className="text-[10px] uppercase font-bold text-slate-500 tracking-widest">Version Selector</span>
               <select
                className="bg-transparent font-bold text-lg focus:outline-none dark:text-white"
                value={selectedVersionIndex}
                onChange={(e) => setSelectedVersionIndex(parseInt(e.target.value))}
               >
                 {versions.map((v, i) => (
                   <option key={v.id} value={i} className="dark:bg-slate-900">{v.version} - {formatDate(v.createdAt)}</option>
                 ))}
                 {versions.length === 0 && <option value={0}>No other versions</option>}
               </select>
             </div>
             <div className="h-10 w-px bg-slate-300"></div>
             <div className="flex flex-col gap-1">
               <span className="text-[10px] uppercase font-bold text-slate-500 tracking-widest">Reviewer</span>
               <div className="flex items-center gap-2">
                 <ShieldCheck className="h-5 w-5 text-primary" />
                 <span className="text-sm font-bold">{post.medicalReviewer?.name || 'Awaiting Assignment'}</span>
               </div>
             </div>
           </div>
           <div className="flex gap-4">
             <button type="button" className="text-red-500 font-bold border-red-500/50 border px-4 py-2 rounded-lg hover:bg-red-50 transition-colors">Reject Changes</button>
             <Button className="bg-primary text-white font-bold px-8">Approve & Publish</Button>
           </div>
        </div>
      </main>
    </div>
  );
}
