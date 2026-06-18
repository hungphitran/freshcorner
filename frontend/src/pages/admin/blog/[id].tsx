import AdminLayout from "@/components/admin/AdminLayout";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import api from "@/utils/api";
import { ArrowLeft } from "lucide-react";
import Image from "next/image";
interface Blog {
  _id: string;
  title: string;
  content: string;
  excerpt?: string;
  featuredImage?: string;
  author: string;
  category: string;
  tags?: string[];
  status: "published" | "draft";
  publishDate?: string;
}

export default function BlogDetailPage() {
  const router = useRouter();
  const { id } = router.query;
  const [blog, setBlog] = useState<Blog | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    const fetchBlog = async () => {
      try {
        setLoading(true);
        const res = await api.get(`/blogs/admin/${id}`);
        if (res.data.success) setBlog(res.data.data || res.data.blog || res.data);
      } catch (e: any) {
        setError(e.response?.data?.message || "Lỗi tải bài viết");
      } finally {
        setLoading(false);
      }
    };
    fetchBlog();
  }, [id]);

  if (loading) {
    return (
      <AdminLayout title="Chi tiết blog | Fresh Corner">
        <div className="p-6 space-y-4">
          <div className="h-8 w-64 bg-gray-100 rounded animate-pulse" />
          <div className="h-96 bg-gray-100 rounded animate-pulse" />
        </div>
      </AdminLayout>
    );
  }
  if (error) return <AdminLayout title="Chi tiết blog | Fresh Corner"><div className="p-6 text-red-600">{error}</div></AdminLayout>;
  if (!blog) return null;

  return (
    <AdminLayout title={`Chi tiết blog | Fresh Corner`}>
      <div className="p-6 max-w-4xl mx-auto space-y-6">
        <button className="flex items-center text-sm text-primary-600 hover:text-primary-800" onClick={()=>router.back()}>
          <ArrowLeft className="w-4 h-4 mr-1"/> Quay lại
        </button>
        <h1 className="text-3xl font-bold text-gray-800">{blog.title}</h1>
        {blog.featuredImage && (
          <Image   src={blog.featuredImage || "/categories.jpg"} alt={blog.title} width={1000} height={1000} className="w-full max-h-[400px] object-cover rounded" unoptimized />
        )}
        <div className="text-sm text-gray-500 space-x-3">
          <span>Tác giả: <span className="font-medium text-gray-700">{blog.author}</span></span>
          <span>•</span>
          <span>Chủ đề: <span className="font-medium text-gray-700">{blog.category}</span></span>
          {blog.publishDate && (<><span>•</span><span>{new Date(blog.publishDate).toLocaleDateString('vi-VN')}</span></>)}
          <span>•</span>
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium {blog.status==='published' ? 'bg-green-100 text-green-800' : 'bg-amber-100 text-amber-800'}">
            {blog.status==='published' ? 'Đã đăng' : 'Bản nháp'}
          </span>
        </div>
        {blog.tags && blog.tags.length > 0 && (
          <div className="space-x-2 text-sm">
            {blog.tags.map(t => (
              <span key={t} className="inline-block px-2 py-0.5 bg-primary-50 text-primary-700 rounded-full">#{t}</span>
            ))}
          </div>
        )}
        <div className="prose max-w-none" dangerouslySetInnerHTML={{__html: blog.content}} />
      </div>
    </AdminLayout>
  );
} 