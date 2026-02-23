'use client';

import { useEffect, useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import toast from 'react-hot-toast';

export default function TagsPage() {
  const [tags, setTags] = useState<any[]>([]);
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTags();
  }, []);

  const fetchTags = async () => {
    try {
      const res = await fetch('/api/admin/tags');
      const data = await res.json();
      setTags(data);
    } catch (error) {
      toast.error('Failed to fetch tags');
    } finally {
      setLoading(false);
    }
  };

  const addTag = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name) return;

    try {
      const res = await fetch('/api/admin/tags', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name }),
      });
      if (res.ok) {
        toast.success('Tag added');
        setName('');
        fetchTags();
      } else {
        toast.error('Failed to add tag');
      }
    } catch (error) {
      toast.error('An error occurred');
    }
  };

  const deleteTag = async (id: string) => {
    if (!confirm('Are you sure?')) return;

    try {
      const res = await fetch(`/api/admin/tags/${id}`, { method: 'DELETE' });
      if (res.ok) {
        toast.success('Tag deleted');
        setTags(tags.filter((t) => t.id !== id));
      } else {
        toast.error('Failed to delete tag');
      }
    } catch (error) {
      toast.error('An error occurred');
    }
  };

  return (
    <div className="max-w-2xl">
      <h1 className="text-3xl font-bold text-gray-900">Tags</h1>

      <form onSubmit={addTag} className="mt-8 flex gap-4">
        <Input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="New tag name"
          className="flex-1"
        />
        <Button type="submit">
          <Plus className="mr-2 h-4 w-4" />
          Add Tag
        </Button>
      </form>

      <div className="mt-8 flex flex-wrap gap-2">
        {loading ? (
          <div>Loading...</div>
        ) : tags.length === 0 ? (
          <div className="text-gray-500">No tags found</div>
        ) : (
          tags.map((tag) => (
            <div key={tag.id} className="group flex items-center gap-2 rounded-full bg-blue-50 px-4 py-2 text-sm font-medium text-blue-600 border border-blue-100">
              <span>{tag.name}</span>
              <button onClick={() => deleteTag(tag.id)} className="text-blue-400 hover:text-red-600 transition-colors">
                <Trash2 className="h-3 w-3" />
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
