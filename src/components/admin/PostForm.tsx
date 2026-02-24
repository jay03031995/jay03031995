'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import TipTapEditor from '@/components/admin/TipTapEditor';
import toast from 'react-hot-toast';
import Link from 'next/link';
import slugify from 'slugify';

interface PostFormProps {
  initialData?: any;
  isEditing?: boolean;
}

export default function PostForm({ initialData, isEditing }: PostFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<any[]>([]);
  const [tags, setTags] = useState<any[]>([]);
  const [reviewers, setReviewers] = useState<any[]>([]);
  const [isPreviewMode, setIsPreviewMode] = useState(false);

  const [formData, setFormData] = useState({
    title: initialData?.title || '',
    content: initialData?.content || '',
    excerpt: initialData?.excerpt || '',
    featuredImage: initialData?.featuredImage || '',
    isFeatured: initialData?.isFeatured || false,
    status: initialData?.status || 'DRAFT',
    metaTitle: initialData?.metaTitle || '',
    metaDescription: initialData?.metaDescription || '',
    medicalReviewerId: initialData?.medicalReviewerId || '',
    verificationStatus: initialData?.verificationStatus || 'PENDING',
    faqSchema: initialData?.faqSchema || [],
    categoryIds: initialData?.categories?.map((c: any) => c.categoryId) || [],
    tagIds: initialData?.tags?.map((t: any) => t.tagId) || [],
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [catsRes, tagsRes, reviewersRes] = await Promise.all([
          fetch('/api/admin/categories'),
          fetch('/api/admin/tags'),
          fetch('/api/admin/users?role=REVIEWER'),
        ]);
        if (catsRes.ok) setCategories(await catsRes.json());
        if (tagsRes.ok) setTags(await tagsRes.json());
        if (reviewersRes.ok) setReviewers(await reviewersRes.json());
      } catch (error) {
        toast.error('Failed to fetch auxiliary data');
      }
    };
    fetchData();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const url = isEditing ? `/api/admin/posts/${initialData.id}` : '/api/admin/posts';
      const method = isEditing ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        toast.success(isEditing ? 'Post updated' : 'Post created');
        router.push('/admin/posts');
        router.refresh();
      } else {
        const data = await res.json();
        toast.error(data.error || 'Something went wrong');
      }
    } catch (error) {
      toast.error('An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const addFaq = () => {
    setFormData({
      ...formData,
      faqSchema: [...formData.faqSchema, { question: '', answer: '' }]
    });
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col lg:flex-row overflow-hidden min-h-screen bg-white dark:bg-background-dark text-slate-900 dark:text-slate-100">
      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto px-6 py-6 md:px-12">
        <div className="flex flex-wrap gap-2 mb-6">
          <Link href="/admin/posts" className="text-slate-500 text-sm font-medium hover:text-primary">Posts</Link>
          <span className="text-slate-400 text-sm">/</span>
          <span className="text-slate-900 dark:text-slate-100 text-sm font-bold">{isEditing ? 'Edit Post' : 'New Post'}</span>
        </div>

        <div className="mb-8">
          <input
            className="w-full text-3xl md:text-4xl font-extrabold border-none focus:ring-0 px-0 placeholder-slate-300 dark:placeholder-slate-700 bg-transparent text-slate-900 dark:text-slate-100"
            placeholder="Add Post Title..."
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            required
          />
        </div>

        <div className="flex border-b border-slate-200 dark:border-slate-800 mb-4 items-center justify-between">
          <div className="flex">
            <button type="button" className="px-6 py-3 text-sm font-bold text-primary border-b-2 border-primary">Content</button>
            {isEditing && (
              <Link href={`/admin/posts/${initialData.id}/history`} className="px-6 py-3 text-sm font-medium text-slate-500 hover:text-slate-700 transition-colors">History</Link>
            )}
          </div>
          <div className="flex items-center bg-slate-100 dark:bg-slate-800 rounded-lg p-0.5 mr-1">
            <button
              type="button"
              onClick={() => setIsPreviewMode(false)}
              className={`p-1.5 rounded transition-colors ${!isPreviewMode ? 'bg-white text-primary shadow-sm' : 'text-slate-500'}`}
            >
              <span className="material-symbols-outlined text-[18px]">desktop_windows</span>
            </button>
            <button
              type="button"
              onClick={() => setIsPreviewMode(true)}
              className={`p-1.5 rounded transition-colors ${isPreviewMode ? 'bg-white text-primary shadow-sm' : 'text-slate-500'}`}
            >
              <span className="material-symbols-outlined text-[18px]">smartphone</span>
            </button>
          </div>
        </div>

        <div className={`transition-all duration-300 ${isPreviewMode ? 'max-w-[375px] mx-auto shadow-[0_0_0_10px_#333,0_0_0_12px_#555] rounded-[2rem] h-[812px] overflow-y-auto mb-10' : ''}`}>
          {isPreviewMode && (
             <div className="bg-primary/10 text-primary text-[10px] font-bold uppercase tracking-widest py-1 text-center border-b border-primary/20">
               Mobile Preview Mode
             </div>
          )}
          <TipTapEditor
            content={formData.content}
            onChange={(content) => setFormData({ ...formData, content })}
          />
        </div>

        <div className="mb-12 mt-8">
          <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 mb-4 uppercase tracking-wider">Featured Image</h3>
          <div className="relative group cursor-pointer border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden aspect-video flex flex-col items-center justify-center bg-slate-50 dark:bg-slate-900 hover:bg-slate-100 transition-colors">
            {formData.featuredImage ? (
              <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${formData.featuredImage})` }}></div>
            ) : null}
            <div className="relative z-10 text-center p-6 bg-white/80 dark:bg-slate-900/80 rounded-xl">
              <span className="material-symbols-outlined text-4xl text-primary mb-2">add_a_photo</span>
              <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">Set Featured Image URL</p>
              <Input
                className="mt-2 text-xs"
                placeholder="https://..."
                value={formData.featuredImage}
                onChange={(e) => setFormData({...formData, featuredImage: e.target.value})}
              />
            </div>
          </div>
        </div>
      </div>

      <aside className="w-full lg:w-[380px] border-l border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-background-dark/50 overflow-y-auto px-6 py-6 space-y-8">
        <div className="flex gap-3 sticky top-0 bg-slate-50/90 dark:bg-background-dark/90 py-2 z-10">
          <Button type="submit" className="flex-1 bg-primary hover:bg-primary/90 text-white font-bold py-2.5 rounded-lg text-sm transition-all shadow-sm" disabled={loading}>
            {loading ? 'Saving...' : 'Publish'}
          </Button>
          <button
            type="button"
            onClick={() => { setFormData({...formData, status: 'DRAFT'}); handleSubmit(new Event('submit') as any); }}
            className="flex-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 font-bold py-2.5 rounded-lg text-sm transition-all"
          >
            Save Draft
          </button>
        </div>

        <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
            <span className="material-symbols-outlined text-[18px]">verified_user</span> Medical Review
          </h3>
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-slate-500 mb-1.5">Assigned Dermatologist</label>
              <select
                className="w-full bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 rounded-lg text-sm focus:ring-primary focus:border-primary p-2"
                value={formData.medicalReviewerId}
                onChange={(e) => setFormData({...formData, medicalReviewerId: e.target.value})}
              >
                <option value="">Select a doctor...</option>
                {reviewers.map(r => <option key={r.id} value={r.id}>{r.name}</option>)}
              </select>
            </div>
            <div className="flex items-center justify-between py-2">
              <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Verification Status</span>
              <select
                className="bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 rounded-lg text-xs p-1"
                value={formData.verificationStatus}
                onChange={(e) => setFormData({...formData, verificationStatus: e.target.value as any})}
              >
                <option value="PENDING">Pending</option>
                <option value="VERIFIED">Verified</option>
                <option value="REJECTED">Rejected</option>
              </select>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
            <span className="material-symbols-outlined text-[18px]">category</span> Categories
          </h3>
          <div className="flex flex-col gap-2">
            {categories.map(cat => (
              <label key={cat.id} className="flex items-center gap-2.5 px-2 py-1.5 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.categoryIds.includes(cat.id)}
                  onChange={(e) => {
                    const ids = e.target.checked ? [...formData.categoryIds, cat.id] : formData.categoryIds.filter((id: string) => id !== cat.id);
                    setFormData({...formData, categoryIds: ids});
                  }}
                  className="rounded text-primary focus:ring-primary w-4 h-4 border-slate-300 dark:border-slate-700 dark:bg-slate-800"
                />
                <span className="text-sm text-slate-700 dark:text-slate-300">{cat.name}</span>
              </label>
            ))}
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
            <span className="material-symbols-outlined text-[18px]">quiz</span> FAQ Schema
          </h3>
          <div className="space-y-4">
            {formData.faqSchema.map((item: any, index: number) => (
              <div key={index} className="p-3 bg-slate-50 dark:bg-slate-800 rounded-lg relative group">
                <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <span
                    className="material-symbols-outlined text-sm text-slate-400 cursor-pointer hover:text-red-500"
                    onClick={() => {
                      const newSchema = [...formData.faqSchema];
                      newSchema.splice(index, 1);
                      setFormData({...formData, faqSchema: newSchema});
                    }}
                  >delete</span>
                </div>
                <Input
                  className="text-[11px] font-bold text-primary mb-1 p-1 bg-transparent border-none"
                  value={item.question}
                  placeholder="Question?"
                  onChange={(e) => {
                    const newSchema = [...formData.faqSchema];
                    newSchema[index].question = e.target.value;
                    setFormData({...formData, faqSchema: newSchema});
                  }}
                />
                <textarea
                  className="text-[11px] text-slate-500 w-full bg-transparent border-none p-1 focus:ring-0"
                  rows={2}
                  value={item.answer}
                  placeholder="Answer..."
                  onChange={(e) => {
                    const newSchema = [...formData.faqSchema];
                    newSchema[index].answer = e.target.value;
                    setFormData({...formData, faqSchema: newSchema});
                  }}
                />
              </div>
            ))}
            <button
              type="button"
              onClick={addFaq}
              className="w-full border-2 border-dashed border-slate-200 dark:border-slate-700 py-2 rounded-lg text-xs font-semibold text-slate-500 hover:text-primary hover:border-primary transition-all flex items-center justify-center gap-1"
            >
              <span className="material-symbols-outlined text-sm">add</span> Add New Question
            </button>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
            <span className="material-symbols-outlined text-[18px]">search</span> SEO Preview
          </h3>
          <div className="space-y-2">
            <p className="text-blue-600 dark:text-blue-400 text-sm font-medium hover:underline cursor-pointer leading-tight">
              {formData.metaTitle || formData.title || 'Post Title'} | DermaCare
            </p>
            <p className="text-green-700 dark:text-green-500 text-xs truncate">dermcare.com/blog/{formData.title ? slugify(formData.title, {lower:true, strict:true}) : 'post-slug'}</p>
            <p className="text-slate-500 text-xs line-clamp-2">{formData.metaDescription || formData.excerpt || 'Discover expert skincare tips...'}</p>
          </div>
          <div className="mt-4 space-y-3">
             <Input
                className="text-xs"
                placeholder="Meta Title"
                value={formData.metaTitle}
                onChange={e => setFormData({...formData, metaTitle: e.target.value})}
              />
             <textarea
                className="text-xs w-full p-2 border rounded-md dark:bg-slate-800 dark:border-slate-700 text-slate-900 dark:text-white"
                placeholder="Meta Description"
                rows={3}
                value={formData.metaDescription}
                onChange={e => setFormData({...formData, metaDescription: e.target.value})}
              />
          </div>
        </div>
      </aside>
    </form>
  );
}
