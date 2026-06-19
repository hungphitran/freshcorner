import AdminLayout from "@/components/admin/AdminLayout";
import { Search, Filter, CheckCircle, PhoneCall, X, Trash2, Mail, Eye, Clock } from "lucide-react";
import { useState, useEffect } from "react";
import api from "@/utils/api";
import toast from "react-hot-toast";

type ContactStatus = "pending" | "contacted" | "cancelled";

const statusMapToVn: Record<ContactStatus, string> = {
  pending: "Chưa xử lý",
  contacted: "Đã liên hệ",
  cancelled: "Đã hủy",
};

const StatusBadge = ({ status }: { status: ContactStatus }) => {
  const statusStyles: Record<ContactStatus, string> = {
    pending: "bg-yellow-100 text-yellow-800 border-yellow-200",
    contacted: "bg-green-100 text-green-800 border-green-200",
    cancelled: "bg-gray-100 text-gray-800 border-gray-200",
  };

  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold border ${statusStyles[status]}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${
        status === "contacted" ? "bg-green-500" : status === "pending" ? "bg-yellow-500" : "bg-gray-500"
      }`} />
      {statusMapToVn[status]}
    </span>
  );
};

interface Contact {
  _id: string;
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  status: ContactStatus;
  createdAt: string;
}

export default function ContactsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("Tất cả");
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0, limit: 10 });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [statusChangeLoading, setStatusChangeLoading] = useState(false);

  const fetchContacts = async (page = 1) => {
    try {
      setLoading(true);
      setError(null);
      const params: any = { page, limit: 10 };
      if (statusFilter !== "Tất cả") params.status = statusFilter;
      if (searchTerm) params.search = searchTerm;

      const res = await api.get('/contacts', { params });
      if (res.data.success) {
        setContacts(res.data.data.contacts);
        const { currentPage, totalPages, totalContacts, limit = 10 } = res.data.data.pagination;
        setPagination({ page: currentPage, pages: totalPages, total: totalContacts, limit });
      }
    } catch (e: any) {
      setError(e.response?.data?.message || 'Lỗi tải danh sách liên hệ');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContacts(1);
  }, [statusFilter]);

  // Debounce search
  useEffect(() => {
    const timeout = setTimeout(() => {
      fetchContacts(1);
    }, 500);
    return () => clearTimeout(timeout);
  }, [searchTerm]);

  const handleStatusChange = async (id: string, newStatus: ContactStatus) => {
    try {
      setStatusChangeLoading(true);
      const res = await api.patch(`/contacts/${id}/status`, { status: newStatus });
      if (res.data.success) {
        toast.success("Cập nhật trạng thái thành công!");
        
        // Update local state
        setContacts(prev => prev.map(c => c._id === id ? { ...c, status: newStatus } : c));
        
        if (selectedContact && selectedContact._id === id) {
          setSelectedContact(prev => prev ? { ...prev, status: newStatus } : null);
        }
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Cập nhật trạng thái thất bại");
    } finally {
      setStatusChangeLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Bạn có chắc chắn muốn xóa lượt liên hệ này?")) return;
    try {
      const res = await api.delete(`/contacts/${id}`);
      if (res.data.success) {
        toast.success("Xóa liên hệ thành công!");
        setContacts(prev => prev.filter(c => c._id !== id));
        if (selectedContact && selectedContact._id === id) {
          setSelectedContact(null);
        }
        // If the current page becomes empty and we're not on page 1, fetch previous page
        if (contacts.length === 1 && pagination.page > 1) {
          fetchContacts(pagination.page - 1);
        } else {
          fetchContacts(pagination.page);
        }
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Xóa liên hệ thất bại");
    }
  };

  const goToPage = (pageNumber: number) => {
    if (pageNumber < 1 || pageNumber > pagination.pages || pageNumber === pagination.page) return;
    fetchContacts(pageNumber);
  };

  return (
    <AdminLayout title="Quản lý liên hệ | Fresh Corner">
      <div className="flex flex-col h-full">
        {/* Title */}
        <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-6 gap-4">
          <h1 className="text-2xl font-bold text-gray-800 text-left">Quản lý liên hệ</h1>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl border border-gray-200 p-4 mb-6 flex flex-wrap gap-4 items-center justify-between shadow-sm">
          <div className="flex-grow max-w-md relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Tìm kiếm theo tên, SĐT, email, tiêu đề..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 text-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="flex items-center gap-2">
            <Filter size={18} className="text-gray-500" />
            <select
              className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 bg-white text-sm cursor-pointer"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="Tất cả">Tất cả trạng thái</option>
              <option value="pending">Chưa xử lý</option>
              <option value="contacted">Đã liên hệ</option>
              <option value="cancelled">Đã hủy</option>
            </select>
          </div>
        </div>

        {/* Error or Empty states */}
        {error && (
          <div className="bg-red-50 text-red-700 p-4 rounded-xl mb-6 text-sm border border-red-100">
            {error}
          </div>
        )}

        {/* Loading state */}
        {loading && contacts.length === 0 ? (
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
            <div className="divide-y divide-gray-100">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="h-16 bg-gray-50/50 animate-pulse flex items-center px-6 justify-between">
                  <div className="w-1/4 h-4 bg-gray-200 rounded" />
                  <div className="w-1/4 h-4 bg-gray-200 rounded" />
                  <div className="w-1/6 h-4 bg-gray-200 rounded" />
                  <div className="w-10 h-4 bg-gray-200 rounded" />
                </div>
              ))}
            </div>
          </div>
        ) : contacts.length === 0 ? (
          <div className="bg-white text-center py-16 rounded-xl border border-gray-200 shadow-sm">
            <Mail className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <h3 className="text-base font-semibold text-gray-700">Không có đơn liên hệ nào</h3>
            <p className="text-sm text-gray-500 mt-1">Không tìm thấy dữ liệu liên hệ phù hợp với bộ lọc.</p>
          </div>
        ) : (
          /* Table */
          <div className="bg-white rounded-xl border border-gray-200 flex-1 relative shadow-sm overflow-hidden flex flex-col justify-between">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Khách hàng</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider hidden md:table-cell">Tiêu đề</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider hidden lg:table-cell">Ngày gửi</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Trạng thái</th>
                    <th className="px-6 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Thao tác</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {contacts.map((contact) => (
                    <tr key={contact._id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-semibold text-gray-900">{contact.name}</div>
                        <div className="text-xs text-gray-500 flex flex-col gap-0.5 mt-0.5">
                          <span>SĐT: {contact.phone}</span>
                          {contact.email && <span>Email: {contact.email}</span>}
                        </div>
                      </td>
                      <td className="px-6 py-4 hidden md:table-cell max-w-xs truncate">
                        <div className="text-sm font-medium text-gray-800">{contact.subject}</div>
                        <div className="text-xs text-gray-500 truncate mt-0.5">{contact.message}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap hidden lg:table-cell text-sm text-gray-600">
                        {new Date(contact.createdAt).toLocaleString('vi-VN', {
                          hour: '2-digit',
                          minute: '2-digit',
                          day: '2-digit',
                          month: '2-digit',
                          year: 'numeric'
                        })}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <StatusBadge status={contact.status} />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex justify-end gap-3 items-center">
                          <button
                            onClick={() => setSelectedContact(contact)}
                            className="text-primary-600 hover:text-primary-800 flex items-center gap-1 bg-primary-50 px-2.5 py-1.5 rounded-lg transition-colors"
                          >
                            <Eye size={14} />
                            <span>Xem</span>
                          </button>
                          
                          <button
                            onClick={() => handleDelete(contact._id)}
                            className="text-red-600 hover:text-red-800 flex items-center gap-1 bg-red-50 hover:bg-red-100 p-1.5 rounded-lg transition-colors"
                            title="Xóa yêu cầu"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {pagination.pages > 1 && (
              <div className="flex items-center justify-between flex-wrap gap-4 px-6 py-3 border-t border-gray-200 bg-gray-50/50">
                <div className="text-xs text-gray-500">
                  Trang <span className="font-semibold">{pagination.page}</span> / <span className="font-semibold">{pagination.pages}</span> (Tổng: <span className="font-semibold">{pagination.total}</span> liên hệ)
                </div>
                
                <nav className="inline-flex -space-x-px rounded-md shadow-sm">
                  <button
                    onClick={() => goToPage(pagination.page - 1)}
                    disabled={pagination.page === 1}
                    className="relative inline-flex items-center rounded-l-md px-2.5 py-1.5 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 disabled:opacity-40 disabled:hover:bg-white text-xs font-semibold"
                  >
                    Trước
                  </button>
                  {Array.from({ length: pagination.pages }).map((_, idx) => {
                    const pageNum = idx + 1;
                    return (
                      <button
                        key={pageNum}
                        onClick={() => goToPage(pageNum)}
                        className={`relative inline-flex items-center px-3 py-1.5 text-xs font-semibold ring-1 ring-inset ring-gray-300 focus:z-20 focus:outline-offset-0 ${
                          pageNum === pagination.page
                            ? "z-10 bg-primary-600 text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600 ring-primary-600"
                            : "text-gray-900 hover:bg-gray-50"
                        }`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}
                  <button
                    onClick={() => goToPage(pagination.page + 1)}
                    disabled={pagination.page === pagination.pages}
                    className="relative inline-flex items-center rounded-r-md px-2.5 py-1.5 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 disabled:opacity-40 disabled:hover:bg-white text-xs font-semibold"
                  >
                    Sau
                  </button>
                </nav>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Details Modal */}
      {selectedContact && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in">
          <div className="bg-white rounded-2xl w-full max-w-xl shadow-2xl relative border border-gray-100 overflow-hidden max-h-[90vh] flex flex-col">
            {/* Header */}
            <div className="px-6 py-4 bg-gray-50 border-b border-gray-200 flex justify-between items-center">
              <div className="flex items-center gap-2">
                <Mail className="w-5 h-5 text-primary-600" />
                <h2 className="text-lg font-bold text-gray-800">Chi tiết thư liên hệ</h2>
              </div>
              <button 
                className="text-gray-400 hover:text-gray-600 bg-white hover:bg-gray-100 border border-gray-200 p-1.5 rounded-lg transition-all" 
                onClick={() => setSelectedContact(null)}
              >
                <X size={18} />
              </button>
            </div>

            {/* Content */}
            <div className="p-6 overflow-y-auto space-y-5 text-sm flex-1">
              {/* Customer Info Card */}
              <div className="bg-primary-50/50 border border-primary-100/50 rounded-xl p-4 grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <span className="text-xs text-gray-400 block font-medium">HỌ TÊN</span>
                  <span className="font-semibold text-gray-800">{selectedContact.name}</span>
                </div>
                <div>
                  <span className="text-xs text-gray-400 block font-medium">SỐ ĐIỆN THOẠI</span>
                  <span className="font-semibold text-gray-800">{selectedContact.phone}</span>
                </div>
                <div>
                  <span className="text-xs text-gray-400 block font-medium">EMAIL</span>
                  <span className="font-semibold text-gray-800 truncate block">{selectedContact.email}</span>
                </div>
                <div>
                  <span className="text-xs text-gray-400 block font-medium">THỜI GIAN GỬI</span>
                  <span className="font-semibold text-gray-800 flex items-center gap-1">
                    <Clock size={14} className="text-gray-400" />
                    {new Date(selectedContact.createdAt).toLocaleString('vi-VN')}
                  </span>
                </div>
              </div>

              {/* Message Details */}
              <div className="space-y-3">
                <div>
                  <span className="text-xs text-gray-400 block font-medium mb-1">TIÊU ĐỀ THƯ</span>
                  <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 font-semibold text-gray-800">
                    {selectedContact.subject}
                  </div>
                </div>

                <div>
                  <span className="text-xs text-gray-400 block font-medium mb-1">NỘI DUNG LIÊN HỆ</span>
                  <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 text-gray-700 whitespace-pre-wrap leading-relaxed min-h-[100px]">
                    {selectedContact.message}
                  </div>
                </div>
              </div>

              {/* Status Update Section */}
              <div className="border-t border-gray-150 pt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-400 font-semibold uppercase">TRẠNG THÁI HIỆN TẠI:</span>
                  <StatusBadge status={selectedContact.status} />
                </div>
                
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-500 font-medium">Chuyển trạng thái:</span>
                  <div className="flex gap-1.5">
                    {selectedContact.status !== "contacted" && (
                      <button
                        disabled={statusChangeLoading}
                        onClick={() => handleStatusChange(selectedContact._id, "contacted")}
                        className="bg-green-600 hover:bg-green-700 text-white px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-colors disabled:opacity-50"
                      >
                        Đã liên hệ
                      </button>
                    )}
                    {selectedContact.status !== "cancelled" && (
                      <button
                        disabled={statusChangeLoading}
                        onClick={() => handleStatusChange(selectedContact._id, "cancelled")}
                        className="bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-colors disabled:opacity-50"
                      >
                        Hủy bỏ
                      </button>
                    )}
                    {selectedContact.status !== "pending" && (
                      <button
                        disabled={statusChangeLoading}
                        onClick={() => handleStatusChange(selectedContact._id, "pending")}
                        className="bg-yellow-50 hover:bg-yellow-100 text-yellow-600 border border-yellow-200 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-colors disabled:opacity-50"
                      >
                        Chưa xử lý
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
            
            {/* Footer */}
            <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-end">
              <button 
                onClick={() => setSelectedContact(null)}
                className="bg-white hover:bg-gray-100 border border-gray-300 text-gray-700 px-4 py-2 rounded-lg text-xs font-semibold transition-all"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
