'use client';

import { useEffect, useState, use } from 'react';
import PostForm from '@/components/admin/PostForm';
import toast from 'react-hot-toast';

export default function EditPostPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [post, setPost] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const res = await fetch(`/api/admin/posts/${id}`);
        if (res.ok) {
          const data = await res.json();
          setPost(data);
        } else {
          toast.error('Post not found');
        }
      } catch (error) {
        toast.error('Failed to fetch post');
      } finally {
        setLoading(false);
      }
    };
    fetchPost();
  }, [id]);

  if (loading) return <div>Loading...</div>;
  if (!post) return <div>Post not found</div>;

  return (
    <div>
      <h1 className="mb-8 text-3xl font-bold text-gray-900">Edit Post</h1>
      <PostForm initialData={post} isEditing />
    </div>
  );
}
