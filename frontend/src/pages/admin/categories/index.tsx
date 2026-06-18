import AdminLayout from "@/components/admin/AdminLayout";
import api from "@/utils/api";
import { Edit, FolderTree, Plus, Search, Trash2, X, ChevronDown } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

type ThemeKey = "fruit" | "teabreak" | "snacks" | "smoothies" | "default";

interface Category {
  _id: string;
  name: string;
  slug: string;
  themeKey: ThemeKey;
  description?: string;
  isActive?: boolean;
}

const themeOptions: { value: ThemeKey; label: string; className: string }[] = [
  { value: "fruit", label: "Trái cây", className: "bg-primary-50 text-primary-700" },
  { value: "teabreak", label: "Tea break", className: "bg-brown-50 text-brown-700" },
  { value: "snacks", label: "Ăn vặt", className: "bg-orange-50 text-orange-700" },
  { value: "smoothies", label: "Smoothies", className: "bg-orange-50 text-orange-700" },
  { value: "default", label: "Mặc định", className: "bg-gray-100 text-gray-700" },
];

const emptyForm = {
  name: "",
  slug: "",
  themeKey: "default" as ThemeKey,
  description: "",
  isActive: true,
};

const toSlug = (value: string) =>
  value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/Đ/g, "D")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [form, setForm] = useState(emptyForm);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      setError("");
      const res = await api.get("/categories", { params: { limit: 1000, sortBy: "name" } });
      if (res.data.success) {
        setCategories(res.data.categories || res.data.data || []);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || "Lỗi tải danh mục");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const filteredCategories = useMemo(() => {
    const keyword = searchTerm.trim().toLowerCase();
    if (!keyword) return categories;
    return categories.filter(category =>
      category.name.toLowerCase().includes(keyword) ||
      category.slug.toLowerCase().includes(keyword)
    );
  }, [categories, searchTerm]);

  const openCreateModal = () => {
    setEditingCategory(null);
    setForm(emptyForm);
    setModalOpen(true);
  };

  const openEditModal = (category: Category) => {
    setEditingCategory(category);
    setForm({
      name: category.name || "",
      slug: category.slug || "",
      themeKey: category.themeKey || "default",
      description: category.description || "",
      isActive: category.isActive !== false,
    });
    setModalOpen(true);
  };

  const handleNameChange = (name: string) => {
    setForm(prev => ({
      ...prev,
      name,
      slug: editingCategory || prev.slug ? prev.slug : toSlug(name),
    }));
  };

  const handleSubmit = async () => {
    if (!form.name.trim()) {
      alert("Vui lòng nhập tên danh mục");
      return;
    }

    try {
      setSaving(true);
      const payload = {
        name: form.name.trim(),
        slug: form.slug.trim() || toSlug(form.name),
        themeKey: form.themeKey,
        description: form.description.trim(),
        isActive: form.isActive,
      };

      if (editingCategory) {
        await api.put(`/categories/${editingCategory._id}`, payload);
      } else {
        await api.post("/categories", payload);
      }

      setModalOpen(false);
      setEditingCategory(null);
      setForm(emptyForm);
      await fetchCategories();
    } catch (err: any) {
      alert(err.response?.data?.message || "Lỗi lưu danh mục");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (category: Category) => {
    if (!confirm(`Bạn có chắc muốn xóa danh mục "${category.name}" không?`)) return;

    try {
      setDeletingId(category._id);
      await api.delete(`/categories/${category._id}`);
      await fetchCategories();
    } catch (err: any) {
      alert(err.response?.data?.message || "Lỗi xóa danh mục");
    } finally {
      setDeletingId(null);
    }
  };

  const actionButtonClass = "inline-flex h-9 w-9 items-center justify-center rounded-lg border transition-colors disabled:opacity-50";

  return (
    <AdminLayout title="Quản lý danh mục | Fresh Corner">
      <div className="flex flex-col h-full">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-xl md:text-2xl font-bold text-gray-800">Quản lý danh mục</h1>
            <p className="text-sm text-gray-500 mt-1">Tạo, chỉnh sửa và bật tắt danh mục sản phẩm Fresh Corner.</p>
          </div>
          <button
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-primary-700"
            onClick={openCreateModal}
          >
            <Plus size={18} />
            Thêm danh mục
          </button>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-4 mb-6">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Tìm theo tên hoặc slug..."
              className="w-full rounded-lg border border-gray-300 py-2 pl-10 pr-4 text-sm focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
            />
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          {loading ? (
            <div className="p-8 text-center text-gray-500">Đang tải danh mục...</div>
          ) : error ? (
            <div className="p-8 text-center text-red-600">{error}</div>
          ) : filteredCategories.length === 0 ? (
            <div className="p-12 flex flex-col items-center justify-center text-gray-500">
              <FolderTree className="w-14 h-14 mb-3 opacity-30" />
              <p className="font-medium">Không tìm thấy danh mục</p>
              <p className="text-sm">Tạo danh mục mới hoặc thử từ khóa khác.</p>
            </div>
          ) : (
            <table className="min-w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-4 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Danh mục</th>
                  <th className="px-4 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">Theme</th>
                  <th className="px-4 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden lg:table-cell">Mô tả</th>
                  <th className="px-4 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Trạng thái</th>
                  <th className="px-4 md:px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredCategories.map(category => {
                  const theme = themeOptions.find(option => option.value === category.themeKey) || themeOptions[4];
                  return (
                    <tr key={category._id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 md:px-6 py-4">
                        <div className="font-medium text-gray-900">{category.name}</div>
                        <div className="text-xs text-gray-500">{category.slug}</div>
                      </td>
                      <td className="px-4 md:px-6 py-4 hidden md:table-cell">
                        <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${theme.className}`}>
                          {theme.label}
                        </span>
                      </td>
                      <td className="px-4 md:px-6 py-4 text-sm text-gray-500 max-w-xs hidden lg:table-cell">
                        <span className="line-clamp-2">{category.description || "Chưa có mô tả"}</span>
                      </td>
                      <td className="px-4 md:px-6 py-4">
                        <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${
                          category.isActive === false ? "bg-gray-100 text-gray-600" : "bg-primary-50 text-primary-700"
                        }`}>
                          {category.isActive === false ? "Tạm ẩn" : "Đang dùng"}
                        </span>
                      </td>
                      <td className="px-4 md:px-6 py-4">
                        <div className="flex justify-end gap-2">
                          <button
                            className={`${actionButtonClass} border-blue-100 text-blue-600 hover:bg-blue-50`}
                            onClick={() => openEditModal(category)}
                            aria-label="Sửa danh mục"
                          >
                            <Edit size={16} />
                          </button>
                          <button
                            className={`${actionButtonClass} border-red-100 text-red-600 hover:bg-red-50`}
                            disabled={deletingId === category._id}
                            onClick={() => handleDelete(category)}
                            aria-label="Xóa danh mục"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {modalOpen && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 p-3 backdrop-blur-sm">
          <div className="relative w-full max-w-lg rounded-xl bg-white p-5 shadow-xl">
            <button
              className="absolute right-3 top-3 rounded-lg p-1 text-gray-500 hover:bg-gray-100 hover:text-gray-700"
              onClick={() => setModalOpen(false)}
            >
              <X size={20} />
            </button>
            <h2 className="text-lg font-semibold text-gray-800 mb-4">
              {editingCategory ? "Sửa danh mục" : "Thêm danh mục"}
            </h2>
            <div className="space-y-4 text-sm">
              <div>
                <label className="block font-medium text-gray-700 mb-1.5">Tên danh mục</label>
                <input
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
                  value={form.name}
                  onChange={(event) => handleNameChange(event.target.value)}
                  placeholder="Ví dụ: Trái cây nhập khẩu"
                />
              </div>
              <div>
                <label className="block font-medium text-gray-700 mb-1.5">Slug</label>
                <input
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
                  value={form.slug}
                  onChange={(event) => setForm({ ...form, slug: toSlug(event.target.value) })}
                  placeholder="trai-cay-nhap-khau"
                />
              </div>
              <div>
                <label className="block font-medium text-gray-700 mb-1.5">Theme danh mục</label>
                <div className="relative group">
                  <select
                    className="w-full appearance-none rounded-lg border border-gray-300 pl-3 pr-10 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 bg-white text-sm cursor-pointer"
                    value={form.themeKey}
                    onChange={(event) => setForm({ ...form, themeKey: event.target.value as ThemeKey })}
                  >
                    {themeOptions.map(option => (
                      <option key={option.value} value={option.value}>{option.label}</option>
                    ))}
                  </select>
                  <ChevronDown className="w-4 h-4 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none group-focus-within:text-primary-500 transition-colors" />
                </div>
              </div>
              <div>
                <label className="block font-medium text-gray-700 mb-1.5">Mô tả</label>
                <textarea
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
                  rows={3}
                  value={form.description}
                  onChange={(event) => setForm({ ...form, description: event.target.value })}
                  placeholder="Mô tả ngắn cho danh mục"
                />
              </div>
              <label className="flex items-center gap-2 text-gray-700">
                <input
                  type="checkbox"
                  className="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                  checked={form.isActive}
                  onChange={(event) => setForm({ ...form, isActive: event.target.checked })}
                />
                Hiển thị danh mục
              </label>
            </div>
            <div className="mt-6 flex justify-end gap-3">
              <button className="rounded-lg border px-4 py-2 text-sm" onClick={() => setModalOpen(false)}>
                Hủy
              </button>
              <button
                className="rounded-lg bg-primary-600 px-4 py-2 text-sm text-white disabled:opacity-50"
                disabled={saving}
                onClick={handleSubmit}
              >
                {saving ? "Đang lưu..." : "Lưu"}
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
