import AdminLayout from "@/components/admin/AdminLayout";
import { CalendarIcon, Edit, FileText, Plus, Search, Tag, Trash2, Filter, X, AlertTriangle, Image as ImgIcon, ChevronDown } from "lucide-react";
import { useRouter } from "next/router";
import { useEffect } from "react";
import api from "@/utils/api";
import { useState } from "react";
import Image from "next/image"; 
interface BlogPost {
  _id: string;
  title: string;
  excerpt?: string;
  category: string;
  author: string;
  publishDate?: string;
  status: "published" | "draft";
  featuredImage?: string;
  readTime?: number;
  content?: string;
  tags?: string[];
}

// Helper initial states
const emptyForm = {
  title: "",
  excerpt: "",
  content: "",
  author: "",
  category: "",
  status: "draft" as "published" | "draft",
  // tags managed separately
  featured: false,
  featuredImage: null as File | null,
};

export default function BlogManagementPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("Tất cả");
  const [statusFilter, setStatusFilter] = useState("Tất cả");

  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string|null>(null);

  const [showModal, setShowModal] = useState(false);
  const [editPost, setEditPost] = useState<BlogPost|null>(null);
  const [form, setForm] = useState({...emptyForm});
  const [imagePreview, setImagePreview] = useState<string|null>(null);
  const [tagsArr, setTagsArr] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');
  const EXCERPT_LIMIT = 500;

  // update preview when featuredImage changes
  useEffect(()=>{
    if(!form.featuredImage){ setImagePreview(null); return; }
    const url = URL.createObjectURL(form.featuredImage);
    setImagePreview(url);
    return ()=> URL.revokeObjectURL(url);
  }, [form.featuredImage]);

  const [deleteModal, setDeleteModal] = useState(false);
  const [postToDelete, setPostToDelete] = useState<BlogPost|null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const router = useRouter();
  const CACHE_KEY = 'admin_blog_cache';
  const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

  // Fetch posts
  const fetchPosts = async () => {
    try {
      setLoading(true);
      const res = await api.get('/blogs/admin/all');
      if(res.data.success){
        const blogsArray = Array.isArray(res.data.blogs)
          ? res.data.blogs
          : Array.isArray(res.data.data?.blogs)
            ? res.data.data.blogs
            : Array.isArray(res.data.data)
              ? res.data.data
              : [];
        setPosts(blogsArray);
        sessionStorage.setItem(CACHE_KEY, JSON.stringify({ts: Date.now(), blogs: blogsArray}));
      }
    } catch(e:any){ setError(e.response?.data?.message || 'Lỗi tải bài viết'); }
    finally{ setLoading(false); }
  };

  useEffect(()=>{
    const cached = sessionStorage.getItem(CACHE_KEY);
    if(cached){
      try{
        const parsed = JSON.parse(cached);
        if(Date.now()-parsed.ts < CACHE_TTL && Array.isArray(parsed.blogs)){
          setPosts(parsed.blogs);
          setLoading(false);
          return;
        }
      }catch{/* ignore */}
    }
    fetchPosts();
  },[]);

  // Categories derived
  const categories = Array.from(new Set(posts.map(p=>p.category).filter(Boolean)));

  if(loading && posts.length===0){
    return (
      <AdminLayout title="Quản lý blog | Fresh Corner">
        <div className="mb-6 h-8 w-56 bg-gray-100 rounded animate-pulse" />
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="divide-y divide-gray-100">
            {Array.from({length:8}).map((_,i)=>(<div key={i} className="h-20 bg-gray-50 animate-pulse"/>))}
          </div>
        </div>
      </AdminLayout>
    );
  }

  // Filter posts based on search term, category and status
  const filteredPosts = posts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          (post.excerpt || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                          post.author.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory = categoryFilter === "Tất cả" || post.category === categoryFilter;
    const matchesStatus = statusFilter === "Tất cả" ||
                          (statusFilter === "Đã đăng" && post.status === "published") ||
                          (statusFilter === "Bản nháp" && post.status === "draft");

    return matchesSearch && matchesCategory && matchesStatus;
  });

  // Handlers
  const openCreateModal = () => {
    setEditPost(null);
    setForm({...emptyForm});
    setTagsArr([]);
    setShowModal(true);
  };

  const openEditModal = (post: BlogPost) => {
    setEditPost(post);
    setForm({
      title: post.title || '',
      excerpt: post.excerpt || '',
      content: post.content || '',
      author: post.author || 'Admin',
      category: post.category || '',
      status: post.status,
      featured: false,
      featuredImage: null,
    });
    setTagsArr(post.tags || []);
    setShowModal(true);
  };

  const handleSave = async () => {
    try {
      const fd = new FormData();
      fd.append('title', form.title);
      fd.append('content', form.content);
      fd.append('excerpt', form.excerpt);
      fd.append('author', form.author);
      fd.append('category', form.category);
      fd.append('status', form.status);
      if(tagsArr.length) fd.append('tags', JSON.stringify(tagsArr));
      if(form.featuredImage) fd.append('featuredImage', form.featuredImage);

      if(editPost){
        await api.put(`/blogs/${editPost._id}`, fd, { headers:{'Content-Type':'multipart/form-data'} });
      } else {
        await api.post('/blogs', fd, { headers:{'Content-Type':'multipart/form-data'} });
      }
      setShowModal(false);
      setEditPost(null);
      fetchPosts();
    } catch(e:any){ alert(e.response?.data?.message || 'Lỗi lưu bài viết'); }
  };

  const openDeleteModal = (post: BlogPost) => { setPostToDelete(post); setDeleteModal(true); };
  const handleDelete = async () => {
    if(!postToDelete) return;
    try{
      setDeleteLoading(true);
      await api.delete(`/blogs/${postToDelete._id}`);
      setDeleteModal(false); setPostToDelete(null);
      fetchPosts();
    }catch(e:any){ alert(e.response?.data?.message || 'Lỗi xoá bài viết'); }
    finally{ setDeleteLoading(false);}
  };

  return (
    <AdminLayout title="Quản lý blog | Fresh Corner">
      <div className="flex flex-col h-full">
        <div className="flex justify-between items-center mb-6 flex-wrap gap-4">
          <h1 className="text-2xl font-bold text-gray-800">Quản lý bài viết</h1>
          <button className="bg-primary-600 text-white rounded-lg px-4 py-2 font-medium flex items-center gap-2 hover:bg-primary-700 transition-colors" onClick={openCreateModal}>
            <Plus size={18} />
            Thêm bài viết
          </button>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl border border-gray-200 p-4 mb-6 flex flex-wrap gap-4 items-center">
          <div className="flex-grow max-w-md relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Tìm kiếm bài viết theo tiêu đề, nội dung, tác giả..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Filter size={18} className="text-gray-500 md:block hidden" />
              <div className="relative group">
                <select
                  className="appearance-none border border-gray-300 text-sm rounded-lg pl-3 pr-8 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 bg-white cursor-pointer"
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                >
                  <option value="Tất cả">Tất cả chủ đề</option>
                  {categories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
                <ChevronDown className="w-4 h-4 text-gray-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none group-focus-within:text-primary-500 transition-colors" />
              </div>
            </div>

            <div className="flex items-center gap-2">
              <div className="relative group">
                <select
                  className="appearance-none border border-gray-300 text-sm rounded-lg pl-3 pr-8 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 bg-white cursor-pointer"
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  <option value="Tất cả">Tất cả trạng thái</option>
                  <option value="Đã đăng">Đã đăng</option>
                  <option value="Bản nháp">Bản nháp</option>
                </select>
                <ChevronDown className="w-4 h-4 text-gray-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none group-focus-within:text-primary-500 transition-colors" />
              </div>
            </div>
          </div>
        </div>

        {/* Blog Posts Table */}
        <div className="bg-white rounded-xl border border-gray-200 shadow overflow-hidden flex-1">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-2 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Bài viết
                  </th>
                  <th scope="col" className="px-2 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">
                    Chủ đề
                  </th>
                  <th scope="col" className="px-2 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden xl:table-cell">
                    Ngày đăng
                  </th>
                  <th scope="col" className="px-2 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden xl:table-cell">
                    Trạng thái
                  </th>
                  <th scope="col" className="px-2 md:px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Thao tác
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredPosts.map((post) => (
                  <tr key={post._id} className="hover:bg-gray-50 transition-colors cursor-pointer" onClick={()=>router.push(`/admin/blog/${post._id}`)}>
                    <td className="px-2 md:px-6 py-4">
                      <div className="flex md:items-center items-start">
                        {post.featuredImage ? (
                          <div className="flex-shrink-0 h-12 w-12 rounded-md bg-gray-200 overflow-hidden md:block hidden">
                            <Image src={post.featuredImage || "/categories.jpg"} alt={post.title} width={1000} height={1000} className="h-full w-full object-cover" unoptimized />
                          </div>
                        ) : (
                          <div className="flex-shrink-0 h-12 w-12 rounded-md bg-primary-100 items-center justify-center md:flex hidden">
                            <FileText className="h-6 w-6 text-primary-600" />
                          </div>
                        )}
                        <div className="md:ml-4">
                          <div className="text-sm font-medium text-gray-900 line-clamp-2">{post.title}</div>
                          <div className="text-xs text-gray-500 line-clamp-1 mt-0.5">{post.excerpt || ''}</div>
                          <div className=" items-center mt-1 text-xs text-gray-500 hidden md:flex">
                            <span className="flex items-center">
                              <svg className="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                              {post.readTime || 0} phút đọc
                            </span>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-2 md:px-6 py-4 whitespace-nowrap hidden md:table-cell">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-800">
                        {post.category}
                      </span>
                    </td>
                    <td className="px-2 md:px-6 py-4 whitespace-nowrap hidden xl:table-cell">
                      <div className="flex items-center text-sm text-gray-500">
                        <CalendarIcon className="mr-1.5 h-3.5 w-3.5" />
                        {post.publishDate ? new Date(post.publishDate).toLocaleDateString('vi-VN') : 'N/A'}
                      </div>
                    </td>
                    <td className="px-2 md:px-6 py-4 whitespace-nowrap hidden xl:table-cell">
                      {post.status === "published" ? (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          Đã đăng
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800">
                          Bản nháp
                        </span>
                      )}
                    </td>
                    <td className="px-2 md:px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end space-x-2">
                        <button className="p-1.5 rounded-lg text-blue-600 hover:bg-blue-50 transition-colors" onClick={(e)=>{e.stopPropagation();openEditModal(post);}}>
                          <Edit size={16} />
                        </button>
                        <button className="p-1.5 rounded-lg text-red-600 hover:bg-red-50 transition-colors" onClick={(e)=>{e.stopPropagation();openDeleteModal(post);}}>
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}

                {filteredPosts.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-6 py-16 text-center">
                      <div className="flex flex-col items-center justify-center text-gray-500">
                        <FileText className="w-16 h-16 mb-4 opacity-30" />
                        <p className="text-lg font-medium">Không tìm thấy bài viết nào</p>
                        <p className="text-sm">Thử tìm kiếm với từ khóa khác hoặc xóa bộ lọc</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {posts.length > 0 && (
            <div className="flex items-center justify-between flex-wrap gap-4 px-6 py-3 border-t border-gray-200">
              <div className="flex items-center text-sm text-gray-500">
                Hiển thị <span className="font-medium mx-1">{filteredPosts.length}</span> trong <span className="font-medium mx-1">{posts.length}</span> bài viết
              </div>
            </div>
          )}
        </div>
      </div>

        {/* Create / Edit Modal */}
        {showModal && (
          <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-sm px-2 md:px-0">
            <div className="bg-white rounded-xl w-full max-w-2xl p-4 md:p-6 relative overflow-y-auto max-h-[90vh]">
              <button className="absolute top-3 right-3 text-gray-500 hover:text-gray-700" onClick={()=>setShowModal(false)}><X size={20} /></button>
              <h2 className="text-lg font-semibold mb-4 text-gray-800">{editPost ? 'Sửa bài viết' : 'Thêm bài viết'}</h2>
              <div className="space-y-4 text-sm">
                <input type="text" placeholder="Tiêu đề" className="w-full border rounded-lg px-3 py-2" value={form.title} onChange={e=>setForm({...form,title:e.target.value})}/>
                <div className="relative">
                  <textarea placeholder="Tóm tắt bài viết (<= 500 ký tự)" rows={3} className="w-full border rounded-lg px-3 py-2 pr-16" value={form.excerpt} onChange={e=>{
                    if(e.target.value.length <= EXCERPT_LIMIT){ setForm({...form,excerpt:e.target.value}); }
                  }} />
                  <span className="absolute top-2 right-3 text-xs text-gray-400">{form.excerpt.length}/{EXCERPT_LIMIT}</span>
                </div>
                <textarea placeholder="Nội dung" rows={8} className="w-full border rounded-lg px-3 py-2" value={form.content} onChange={e=>setForm({...form,content:e.target.value})} />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {/* Author hidden input */}
                  <input type="hidden" value={form.author} />
                  <input type="text" placeholder="Danh mục" className="w-full border rounded-lg px-3 py-2" value={form.category} onChange={e=>setForm({...form,category:e.target.value})} />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="relative group w-full">
                    <select 
                      className="w-full appearance-none border border-gray-300 rounded-lg pl-3 pr-10 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 bg-white text-sm cursor-pointer" 
                      value={form.status} 
                      onChange={e=>setForm({...form,status:e.target.value as 'draft'|'published'})}
                    >
                      <option value="draft">Bản nháp</option>
                      <option value="published">Đã đăng</option>
                    </select>
                    <ChevronDown className="w-4 h-4 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none group-focus-within:text-primary-500 transition-colors" />
                  </div>

                  {/* Tags input with chips */}
                  <div>
                    <div className="flex flex-wrap gap-2 mb-2">
                      {tagsArr.map((tag,i)=>(
                        <span key={i} className="inline-flex items-center bg-primary-100 text-primary-800 text-xs rounded-full px-2 py-0.5">
                          {tag}
                          <button type="button" className="ml-1 text-primary-600 hover:text-primary-800" onClick={()=> setTagsArr(arr=> arr.filter((_t,idx)=>idx!==i))}><X size={10}/></button>
                        </span>
                      ))}
                    </div>
                    <input
                      type="text"
                      placeholder="Nhập tag và nhấn Enter"
                      className="w-full border rounded-lg px-3 py-2 text-sm"
                      value={tagInput}
                      onChange={e=>setTagInput(e.target.value)}
                      onKeyDown={e=>{
                        if(e.key==='Enter' && tagInput.trim()){
                          e.preventDefault();
                          if(!tagsArr.includes(tagInput.trim())) setTagsArr(arr=>[...arr, tagInput.trim()]);
                          setTagInput('');
                        }
                      }}
                    />
                  </div>
                </div>
                {/* Featured image uploader */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Ảnh đại diện</label>
                  {imagePreview ? (
                    <div className="relative w-32 h-32 mb-2">
                      <img src={imagePreview} alt="preview" className="w-full h-full object-cover rounded-lg" />
                      <button type="button" className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full p-1" onClick={()=>setForm({...form,featuredImage:null})}><X size={12}/></button>
                    </div>
                  ): null}
                  <div className="mt-2 flex justify-center rounded-lg border border-dashed border-gray-900/25 px-6 py-10">
                    <div className="text-center">
                      <ImgIcon className="mx-auto h-12 w-12 text-gray-300" aria-hidden="true" />
                      <div className="mt-4 flex text-sm leading-6 text-gray-600">
                        <label htmlFor="file-upload-blog" className="relative cursor-pointer rounded-md bg-white font-semibold text-primary-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-primary-600 focus-within:ring-offset-2 hover:text-primary-500">
                          <span>Tải ảnh lên</span>
                          <input id="file-upload-blog" name="file-upload-blog" type="file" accept="image/*" className="sr-only" onChange={e=>setForm({...form,featuredImage:e.target.files?e.target.files[0]:null})} />
                        </label>
                        <p className="pl-1">hoặc kéo và thả</p>
                      </div>
                      <p className="text-xs leading-5 text-gray-600">PNG, JPG, JPEG, WebP</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex justify-end gap-3 mt-6">
                <button className="px-4 py-2 rounded-lg border text-sm" onClick={()=>setShowModal(false)}>Huỷ</button>
                <button className="px-4 py-2 rounded-lg bg-primary-600 text-white text-sm" onClick={handleSave}>Lưu</button>
              </div>
            </div>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {deleteModal && postToDelete && (
          <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-sm">
            <div className="bg-white rounded-xl w-full max-w-sm p-6 relative">
              <button className="absolute top-3 right-3 text-gray-500 hover:text-gray-700" onClick={()=>setDeleteModal(false)}><X size={20} /></button>
              <div className="flex items-center gap-3 mb-4"><AlertTriangle className="w-6 h-6 text-red-600"/><h3 className="text-lg font-semibold text-gray-800">Xác nhận xoá</h3></div>
              <p className="text-sm text-gray-600 mb-6">Bạn có chắc muốn xoá bài viết <span className="font-medium text-gray-900">"{postToDelete.title}"</span> không?</p>
              <div className="flex justify-end gap-3">
                <button className="px-4 py-2 rounded-lg border text-sm" onClick={()=>setDeleteModal(false)}>Huỷ</button>
                <button disabled={deleteLoading} className="px-4 py-2 rounded-lg bg-red-600 text-white text-sm disabled:opacity-50" onClick={handleDelete}>{deleteLoading?'Đang xoá...':'Xoá'}</button>
              </div>
            </div>
          </div>
        )}
    </AdminLayout>
  );
} 