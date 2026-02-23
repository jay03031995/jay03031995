'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import TipTapEditor from '@/components/admin/TipTapEditor';
import toast from 'react-hot-toast';

interface PostFormProps {
  initialData?: any;
  isEditing?: boolean;
}

export default function PostForm({ initialData, isEditing }: PostFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<any[]>([]);
  const [tags, setTags] = useState<any[]>([]);

  const [formData, setFormData] = useState({
    title: initialData?.title || '',
    content: initialData?.content || '',
    excerpt: initialData?.excerpt || '',
    featuredImage: initialData?.featuredImage || '',
    isFeatured: initialData?.isFeatured || false,
    status: initialData?.status || 'DRAFT',
    metaTitle: initialData?.metaTitle || '',
    metaDescription: initialData?.metaDescription || '',
    categoryIds: initialData?.categories?.map((c: any) => c.categoryId) || [],
    tagIds: initialData?.tags?.map((t: any) => t.tagId) || [],
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [catsRes, tagsRes] = await Promise.all([
          fetch('/api/admin/categories'),
          fetch('/api/admin/tags'),
        ]);
        setCategories(await catsRes.json());
        setTags(await tagsRes.json());
      } catch (error) {
        toast.error('Failed to fetch categories/tags');
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

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <div className="rounded-xl bg-white p-6 shadow-sm space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-700">Title</label>
              <Input
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
                placeholder="Post title"
                className="mt-1 text-lg font-bold"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">Content</label>
              <div className="mt-1">
                <TipTapEditor
                  content={formData.content}
                  onChange={(content) => setFormData({ ...formData, content })}
                />
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">Excerpt</label>
              <textarea
                value={formData.excerpt}
                onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                rows={3}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm border p-2"
                placeholder="Brief summary of the post"
              />
            </div>
          </div>

          <div className="rounded-xl bg-white p-6 shadow-sm space-y-4">
            <h3 className="text-lg font-medium">SEO Settings</h3>
            <div>
              <label className="text-sm font-medium text-gray-700">Meta Title</label>
              <Input
                value={formData.metaTitle}
                onChange={(e) => setFormData({ ...formData, metaTitle: e.target.value })}
                placeholder="SEO title"
                className="mt-1"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">Meta Description</label>
              <textarea
                value={formData.metaDescription}
                onChange={(e) => setFormData({ ...formData, metaDescription: e.target.value })}
                rows={3}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm border p-2"
                placeholder="SEO description"
              />
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-xl bg-white p-6 shadow-sm space-y-4">
            <h3 className="text-lg font-medium">Publishing</h3>
            <div className="flex items-center justify-between">
              <label className="text-sm text-gray-700">Status</label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                className="rounded-md border-gray-300 py-1 pl-3 pr-10 text-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 border"
              >
                <option value="DRAFT">Draft</option>
                <option value="PUBLISHED">Published</option>
              </select>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="isFeatured"
                checked={formData.isFeatured}
                onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
                className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <label htmlFor="isFeatured" className="text-sm text-gray-700">Featured Post</label>
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Saving...' : isEditing ? 'Update Post' : 'Publish Post'}
            </Button>
          </div>

          <div className="rounded-xl bg-white p-6 shadow-sm space-y-4">
            <h3 className="text-lg font-medium">Organization</h3>
            <div>
              <label className="text-sm font-medium text-gray-700">Featured Image URL</label>
              <Input
                value={formData.featuredImage}
                onChange={(e) => setFormData({ ...formData, featuredImage: e.target.value })}
                placeholder="https://..."
                className="mt-1"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">Categories</label>
              <div className="mt-2 space-y-2 max-h-40 overflow-y-auto">
                {categories.map((cat) => (
                  <div key={cat.id} className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id={`cat-${cat.id}`}
                      checked={formData.categoryIds.includes(cat.id)}
                      onChange={(e) => {
                        const ids = e.target.checked
                          ? [...formData.categoryIds, cat.id]
                          : formData.categoryIds.filter((id: string) => id !== cat.id);
                        setFormData({ ...formData, categoryIds: ids });
                      }}
                      className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <label htmlFor={`cat-${cat.id}`} className="text-sm text-gray-700">{cat.name}</label>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">Tags</label>
              <div className="mt-2 space-y-2 max-h-40 overflow-y-auto">
                {tags.map((tag) => (
                  <div key={tag.id} className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id={`tag-${tag.id}`}
                      checked={formData.tagIds.includes(tag.id)}
                      onChange={(e) => {
                        const ids = e.target.checked
                          ? [...formData.tagIds, tag.id]
                          : formData.tagIds.filter((id: string) => id !== tag.id);
                        setFormData({ ...formData, tagIds: ids });
                      }}
                      className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <label htmlFor={`tag-${tag.id}`} className="text-sm text-gray-700">{tag.name}</label>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
}
