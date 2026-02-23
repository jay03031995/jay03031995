'use client';

import { useEffect, useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import toast from 'react-hot-toast';

export default function CategoriesPage() {
  const [categories, setCategories] = useState<any[]>([]);
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const res = await fetch('/api/admin/categories');
      const data = await res.json();
      setCategories(data);
    } catch (_error) {
      toast.error('Failed to fetch categories');
    } finally {
      setLoading(false);
    }
  };

  const addCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name) return;

    try {
      const res = await fetch('/api/admin/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name }),
      });
      if (res.ok) {
        toast.success('Category added');
        setName('');
        fetchCategories();
      } else {
        toast.error('Failed to add category');
      }
    } catch (_error) {
      toast.error('An error occurred');
    }
  };

  const deleteCategory = async (id: string) => {
    if (!confirm('Are you sure?')) return;

    try {
      const res = await fetch(`/api/admin/categories/${id}`, { method: 'DELETE' });
      if (res.ok) {
        toast.success('Category deleted');
        setCategories(categories.filter((c) => c.id !== id));
      } else {
        toast.error('Failed to delete category');
      }
    } catch (_error) {
      toast.error('An error occurred');
    }
  };

  return (
    <div className="max-w-2xl">
      <h1 className="text-3xl font-bold text-gray-900">Categories</h1>

      <form onSubmit={addCategory} className="mt-8 flex gap-4">
        <Input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="New category name"
          className="flex-1"
        />
        <Button type="submit">
          <Plus className="mr-2 h-4 w-4" />
          Add Category
        </Button>
      </form>

      <div className="mt-8 space-y-4">
        {loading ? (
          <div>Loading...</div>
        ) : categories.length === 0 ? (
          <div className="text-gray-500">No categories found</div>
        ) : (
          categories.map((cat) => (
            <div key={cat.id} className="flex items-center justify-between rounded-lg bg-white p-4 shadow-sm border">
              <div>
                <div className="font-medium text-gray-900">{cat.name}</div>
                <div className="text-sm text-gray-500">/{cat.slug}</div>
              </div>
              <Button variant="ghost" size="sm" onClick={() => deleteCategory(cat.id)} className="text-red-600 hover:text-red-700">
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
