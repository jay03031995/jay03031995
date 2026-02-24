'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  Plus,
  Edit,
  Trash,
  ExternalLink,
  Search,
  Bell,
  Settings,
  Filter,
  CheckCircle,
  Clock,
  PlusCircle
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { formatDate } from '@/lib/utils';
import toast from 'react-hot-toast';

export default function PostsPage() {
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const res = await fetch('/api/admin/posts');
      const data = await res.json();
      setPosts(data);
    } catch (error) {
      toast.error('Failed to fetch posts');
    } finally {
      setLoading(false);
    }
  };

  const deletePost = async (id: string) => {
    if (!confirm('Are you sure you want to delete this post?')) return;

    try {
      const res = await fetch(`/api/admin/posts/${id}`, { method: 'DELETE' });
      if (res.ok) {
        toast.success('Post deleted');
        setPosts(posts.filter((p) => p.id !== id));
      } else {
        toast.error('Failed to delete post');
      }
    } catch (error) {
      toast.error('An error occurred');
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-background-light dark:bg-background-dark font-display text-slate-900 dark:text-slate-100">
      {/* Top Navigation Bar */}
      <header className="flex items-center justify-between whitespace-nowrap border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-10 py-3 sticky top-0 z-50">
        <div className="flex items-center gap-8">
          <div className="flex items-center gap-4 text-slate-900 dark:text-slate-100">
            <div className="size-8 bg-primary rounded-lg flex items-center justify-center text-white">
              <span className="material-symbols-outlined">medical_services</span>
            </div>
            <h2 className="text-lg font-bold leading-tight tracking-[-0.015em]">DermaCare CMS</h2>
          </div>
          <div className="flex h-10 w-64 items-center gap-2 rounded-lg bg-slate-100 dark:bg-slate-800 px-3">
            <Search className="h-5 w-5 text-slate-500" />
            <input className="w-full bg-transparent border-none text-sm focus:ring-0 placeholder:text-slate-500 dark:text-white" placeholder="Search blog posts..." />
          </div>
        </div>
        <div className="flex flex-1 justify-end gap-4">
          <button className="flex size-10 items-center justify-center rounded-lg bg-slate-100 dark:bg-slate-800">
            <Bell className="h-5 w-5 text-slate-500" />
          </button>
          <button className="flex size-10 items-center justify-center rounded-lg bg-slate-100 dark:bg-slate-800">
            <Settings className="h-5 w-5 text-slate-500" />
          </button>
          <div className="bg-slate-200 rounded-full size-10 flex items-center justify-center">
            <span className="material-symbols-outlined">person</span>
          </div>
        </div>
      </header>

      <div className="flex flex-1">
        {/* Sidebar */}
        <aside className="w-64 border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex flex-col justify-between p-4">
          <div className="flex flex-col gap-4 text-slate-900 dark:text-slate-100">
            <div className="flex flex-col mb-4">
              <h1 className="text-base font-bold leading-normal">DermaCare Admin</h1>
              <p className="text-slate-500 text-xs font-normal leading-normal">Blog Content Management</p>
            </div>
            <nav className="flex flex-col gap-1">
              <Link href="/admin/posts" className="flex items-center gap-3 px-3 py-2 rounded-lg bg-primary/10 text-primary">
                <span className="material-symbols-outlined">description</span>
                <p className="text-sm font-semibold">Posts</p>
              </Link>
              <Link href="/admin/categories" className="flex items-center gap-3 px-3 py-2 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg">
                <span className="material-symbols-outlined">folder</span>
                <p className="text-sm font-medium">Categories</p>
              </Link>
              <Link href="/admin/api-management" className="flex items-center gap-3 px-3 py-2 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg">
                <span className="material-symbols-outlined">api</span>
                <p className="text-sm font-medium">API Management</p>
              </Link>
            </nav>
          </div>
          <Link href="/admin/posts/new">
            <button className="flex w-full items-center justify-center rounded-lg h-10 px-4 bg-primary text-white text-sm font-bold shadow-md hover:bg-primary/90">
              <Plus className="mr-2 h-4 w-4" />
              <span>Create New Post</span>
            </button>
          </Link>
        </aside>

        {/* Main Content */}
        <main className="flex-1 flex flex-col overflow-y-auto bg-background-light dark:bg-background-dark">
          <div className="flex justify-between items-center p-8">
            <div>
              <p className="text-slate-900 dark:text-white text-3xl font-black tracking-tight">Blog Posts</p>
              <p className="text-slate-500 text-base">Review and manage dermatological clinical content.</p>
            </div>
            <div className="flex gap-3">
              <button className="flex items-center justify-center rounded-lg h-10 px-4 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 text-sm font-bold border border-slate-200 dark:border-slate-700">
                <Filter className="mr-2 h-4 w-4" />
                <span>Filter</span>
              </button>
              <Link href="/admin/posts/new">
                <button className="flex items-center justify-center rounded-lg h-10 px-4 bg-primary text-white text-sm font-bold shadow-sm">
                  <PlusCircle className="mr-2 h-4 w-4" />
                  <span>New Post</span>
                </button>
              </Link>
            </div>
          </div>

          <div className="px-8 mb-4">
            <div className="flex border-b border-slate-200 dark:border-slate-800 gap-8">
              <button className="border-b-2 border-primary text-primary pb-3 pt-2 text-sm font-bold">All Posts</button>
              <button className="border-b-2 border-transparent text-slate-500 pb-3 pt-2 text-sm font-bold">Published</button>
              <button className="border-b-2 border-transparent text-slate-500 pb-3 pt-2 text-sm font-bold">Drafts</button>
            </div>
          </div>

          <div className="px-8 py-3">
            <div className="overflow-hidden rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
              <table className="w-full text-left">
                <thead className="bg-slate-50 dark:bg-slate-800/50">
                  <tr className="text-slate-600 dark:text-slate-400 text-xs font-semibold uppercase tracking-wider">
                    <th className="px-6 py-4">Title</th>
                    <th className="px-6 py-4">Author</th>
                    <th className="px-6 py-4">Review Status</th>
                    <th className="px-6 py-4">Date</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                  {loading ? (
                    <tr><td colSpan={5} className="px-6 py-4 text-center">Loading...</td></tr>
                  ) : posts.length === 0 ? (
                    <tr><td colSpan={5} className="px-6 py-4 text-center text-gray-500">No posts found</td></tr>
                  ) : (
                    posts.map((post) => (
                      <tr key={post.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                        <td className="px-6 py-5">
                          <div className="flex items-center gap-3">
                            <div className="size-10 rounded-lg bg-slate-200 dark:bg-slate-700 flex-shrink-0 bg-cover bg-center" style={{ backgroundImage: post.featuredImage ? `url(${post.featuredImage})` : 'none' }}></div>
                            <p className="text-slate-900 dark:text-slate-100 text-sm font-semibold">{post.title}</p>
                          </div>
                        </td>
                        <td className="px-6 py-5">
                          <div className="flex items-center gap-2">
                            <div className="size-6 rounded-full bg-primary/20 flex items-center justify-center text-[10px] text-primary font-bold">
                              {post.author?.name?.substring(0, 2).toUpperCase() || '??'}
                            </div>
                            <p className="text-slate-600 dark:text-slate-400 text-sm">{post.author?.name}</p>
                          </div>
                        </td>
                        <td className="px-6 py-5">
                          {post.verificationStatus === 'VERIFIED' ? (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">
                              <CheckCircle className="h-3.5 w-3.5" />
                              Verified
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400">
                              <Clock className="h-3.5 w-3.5" />
                              Pending
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-5 text-slate-600 dark:text-slate-400 text-sm">{formatDate(post.createdAt)}</td>
                        <td className="px-6 py-5 text-right">
                          <div className="flex justify-end gap-2">
                            <Link href={`/admin/posts/${post.id}`}>
                              <button className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-slate-500"><Edit className="h-5 w-5" /></button>
                            </Link>
                            <Link href={`/blog/${post.slug}`} target="_blank">
                              <button className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-slate-500"><ExternalLink className="h-5 w-5" /></button>
                            </Link>
                            <button onClick={() => deletePost(post.id)} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-red-500"><Trash className="h-5 w-5" /></button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* FAQ Schema Editor Section Placeholder */}
          <div className="px-8 py-8 mt-4">
            <div className="p-6 rounded-xl border border-primary/20 bg-primary/5 dark:bg-primary/10">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-primary">schema</span>
                  <div>
                    <h3 className="text-slate-900 dark:text-slate-100 font-bold">Quick FAQ Schema Editor</h3>
                    <p className="text-slate-500 text-xs">Select a post above to manage its JSON-LD structured data.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
