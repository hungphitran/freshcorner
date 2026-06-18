import AdminLayout from "@/components/admin/AdminLayout";
import { Search, Filter, MoreVertical, Download, Plus, CheckCircle, PhoneCall, X, Loader2, ChevronDown } from "lucide-react";
import { debounce } from "lodash";
import { useState, useEffect, useRef } from "react";
import api from "@/utils/api";
import Link from "next/link";

type ApiOrderStatus = "contacted" | "not contacted";
type OrderStatusVn = "Đã liên hệ" | "Chưa liên hệ";

const statusMapToVn: Record<ApiOrderStatus, OrderStatusVn> = {
  contacted: "Đã liên hệ",
  "not contacted": "Chưa liên hệ",
};
const statusMapToApi: Record<OrderStatusVn, ApiOrderStatus> = {
  "Đã liên hệ": "contacted",
  "Chưa liên hệ": "not contacted",
};

// Status badges component
const StatusBadge = ({ status }: { status: ApiOrderStatus }) => {
  const statusStyles: Record<string, string> = {
    contacted: "bg-green-100 text-green-800",
    "not contacted": "bg-indigo-100 text-indigo-800",
  };

  const statusIcons: Record<string, JSX.Element> = {
    contacted: <CheckCircle className="w-3.5 h-3.5" />,
    "not contacted": <PhoneCall className="w-3.5 h-3.5" />,
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium ${statusStyles[status]}`}
    >
      {statusIcons[status]}
      {statusMapToVn[status]}
    </span>
  );
};

interface Order {
  _id: string;
  orderNumber: string;
  customer: {
    name: string;
    phone: string;
    address: string;
    city: string;
    district: string;
    ward: string;
  };
  status: ApiOrderStatus;
  orderDate: string;
  totalAmount?: number;
  totalItems?: number;
}

const goToPage = (pageNumber: number, pagination:any, fetchCallBack:any) => {
  if (pageNumber < 1 || pageNumber > pagination.pages || pageNumber === pagination.page) return;
  fetchCallBack(pageNumber);
};

export default function OrdersPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<"Tất cả" | OrderStatusVn>("Tất cả");
  const [orders, setOrders] = useState<Order[]>([]);
  const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0, limit: 10 });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const CACHE_KEY = 'admin_orders_default';
  const CACHE_TTL = 2 * 60 * 1000; // 2 minutes

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [createLoading, setCreateLoading] = useState(false);
  const [createForm, setCreateForm] = useState({
    customerName: '',
    customerEmail: '',
    customerPhone: '',
    customerAddress: '',
    customerCity: '',
    quantity: 1,
    notes: ''
  });
  const [productSearch, setProductSearch] = useState('');
  const [productSuggestions, setProductSuggestions] = useState<any[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const suggestionsContainerRef = useRef<HTMLDivElement>(null);

  const provinces = [
    'An Giang','Bà Rịa - Vũng Tàu','Bắc Giang','Bắc Kạn','Bạc Liêu','Bắc Ninh','Bến Tre','Bình Định','Bình Dương','Bình Phước','Bình Thuận','Cà Mau','Cần Thơ','Cao Bằng','Đà Nẵng','Đắk Lắk','Đắk Nông','Điện Biên','Đồng Nai','Đồng Tháp','Gia Lai','Hà Giang','Hà Nam','Hà Nội','Hà Tĩnh','Hải Dương','Hải Phòng','Hậu Giang','Hòa Bình','Hưng Yên','Khánh Hòa','Kiên Giang','Kon Tum','Lai Châu','Lâm Đồng','Lạng Sơn','Lào Cai','Long An','Nam Định','Nghệ An','Ninh Bình','Ninh Thuận','Phú Thọ','Phú Yên','Quảng Bình','Quảng Nam','Quảng Ngãi','Quảng Ninh','Quảng Trị','Sóc Trăng','Sơn La','Tây Ninh','Thái Bình','Thái Nguyên','Thanh Hóa','Thừa Thiên Huế','Tiền Giang','TP. Hồ Chí Minh','Trà Vinh','Tuyên Quang','Vĩnh Long','Vĩnh Phúc','Yên Bái'
  ];

  const fetchProductSuggestions = async (term: string) => {
    try {
      const params: any = { limit: 5 };
      if (term.length >= 1) params.search = term;
      const res = await api.get('/products', { params });
      if (res.data.success) setProductSuggestions(res.data.data);
    } catch { /* ignore */ }
  };

  const debouncedSearch = debounce(fetchProductSuggestions, 400);

  const fetchOrders = async (page = 1) => {
    try {
      setLoading(true);
      const params: any = { page };
      if (statusFilter !== "Tất cả") params.status = statusMapToApi[statusFilter];
      if (searchTerm) params.search = searchTerm;

      const res = await api.get('/orders', { params });
      if (res.data.success) {
        setOrders(res.data.data.orders);
        const { currentPage, totalPages, totalOrders, limit=10 } = res.data.data.pagination;
        setPagination({ page: currentPage, pages: totalPages, total: totalOrders, limit });
        if(page===1 && statusFilter==='Tất cả' && searchTerm===''){
          sessionStorage.setItem(CACHE_KEY, JSON.stringify({
            ts: Date.now(), orders: res.data.data.orders, 
            pagination: { page: currentPage, pages: totalPages, total: totalOrders, limit }
          }));
        }
      }
    } catch (e: any) {
      setError(e.response?.data?.message || 'Lỗi tải đơn hàng');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (suggestionsContainerRef.current && !suggestionsContainerRef.current.contains(event.target as Node)) {
        setProductSuggestions([]);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    const cached = sessionStorage.getItem(CACHE_KEY);
    if(statusFilter==='Tất cả' && searchTerm===''){
      if(cached){
        try{
          const parsed = JSON.parse(cached) as {ts: number, orders: Order[], pagination: typeof pagination};
          if(Date.now()-parsed.ts < CACHE_TTL){
            setOrders(parsed.orders);
            setPagination(parsed.pagination);
            setLoading(false);
            return;
          }
        }catch{/* ignore */}
      }
    }
    fetchOrders(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [statusFilter]);

  // Debounce search
  useEffect(() => {
    const timeout = setTimeout(() => {
      fetchOrders(1);
    }, 500);
    return () => clearTimeout(timeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchTerm]);

  // Client-side filter for instant UI feedback on search
  const normalizedSearch = searchTerm.toLowerCase();
  const displayedOrders = orders.filter(order => {
    if (!searchTerm) return true;
    return (
      order.orderNumber.toLowerCase().includes(normalizedSearch) ||
      order.customer.name.toLowerCase().includes(normalizedSearch) ||
      order.customer.phone.includes(normalizedSearch) ||
      (order.customer.address && order.customer.address.toLowerCase().includes(normalizedSearch)) ||
      (order.customer.city && order.customer.city.toLowerCase().includes(normalizedSearch))
    );
  });

  if(loading && orders.length===0){
    return (
      <AdminLayout title="Quản lý đơn hàng | Fresh Corner">
        <div className="mb-6 h-8 w-48 bg-gray-100 rounded animate-pulse" />
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="divide-y divide-gray-100">
            {Array.from({length:10}).map((_,i)=>(<div key={i} className="h-14 bg-gray-50 animate-pulse"/>))}
          </div>
        </div>
      </AdminLayout>
    );
  }

  if (error) return <AdminLayout title="Quản lý đơn hàng | Fresh Corner"><div className="p-6 text-red-600">{error}</div></AdminLayout>;

  return (
    <AdminLayout title="Quản lý đơn hàng | Fresh Corner">
      <div className="flex flex-col h-full">
        <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-6 gap-4">
          <h1 className="text-2xl font-bold text-gray-800 text-left">Quản lý đơn hàng</h1>
          <button onClick={() => setShowCreateModal(true)} className="bg-primary-600 text-white rounded-lg px-4 py-2 font-medium flex items-center gap-2 hover:bg-primary-700 transition-colors">
            <Plus size={18} />
            Tạo đơn hàng
          </button>
        </div>
        
        {/* Filters */}
        <div className="bg-white rounded-xl border border-gray-200 p-4 mb-6 flex flex-wrap gap-4 items-center justify-between">
          <div className="flex-grow max-w-md relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Tìm kiếm đơn hàng, khách hàng, địa chỉ..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Filter size={18} className="text-gray-500" />
              <div className="relative group">
                <select 
                  className="appearance-none border border-gray-300 rounded-lg pl-3 pr-8 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 bg-white text-sm cursor-pointer"
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value as "Tất cả" | OrderStatusVn)}
                >
                  <option value="Tất cả">Tất cả trạng thái</option>
                  <option value="Đã liên hệ">Đã liên hệ</option>
                  <option value="Chưa liên hệ">Chưa liên hệ</option>
                </select>
                <ChevronDown className="w-4 h-4 text-gray-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none group-focus-within:text-primary-500 transition-colors" />
              </div>
            </div>
            
            {/* <button className="flex items-center gap-2 px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
              <Download size={18} className="text-gray-500" />
              <span className="text-sm font-medium text-gray-700">Xuất Excel</span>
            </button> */}
          </div>
        </div>
        
        {/* Orders Table */}
        <div className="bg-white rounded-xl border border-gray-200 flex-1 relative">
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-2 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden xl:table-cell">Mã đơn</th>
                  <th className="px-2 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Khách hàng</th>
                  <th className="px-2 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden xl:table-cell">Ngày</th>
                  <th className="px-2 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">Trạng thái</th>
                  <th className="px-2 md:px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider hidden lg:table-cell">Tổng tiền</th>
                  <th className="px-2 md:px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {displayedOrders.map((order) => (
                  <tr key={order._id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-2 md:px-6 py-4 whitespace-nowrap hidden xl:table-cell">
                      <Link href={`/admin/orders/${order._id}`}>
                        <span className="text-sm font-medium text-primary-600 underline cursor-pointer">{order.orderNumber}</span>
                      </Link>
                    </td>
                    <td className="px-2 md:px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{order.customer.name}</div>
                      <div className="text-sm text-gray-500">{order.customer.phone}</div>
                    </td>
                    <td className="px-2 md:px-6 py-4 whitespace-nowrap hidden xl:table-cell">
                      <span className="text-sm text-gray-700">{new Date(order.orderDate).toLocaleDateString('vi-VN')}</span>
                    </td>
                    <td className="px-2 md:px-6 py-4 whitespace-nowrap hidden md:table-cell">
                      <StatusBadge status={order.status} />
                    </td>
                    <td className="px-2 md:px-6 py-4 whitespace-nowrap text-right hidden lg:table-cell">
                      <span className="text-sm font-medium text-gray-800">
                        {order.totalAmount?.toLocaleString('vi-VN') || 'N/A'} ₫
                      </span>
                    </td>
                    <td className="px-2 md:px-6 py-4 whitespace-nowrap text-right">
                       <Link href={`/admin/orders/${order._id}`}>
                        <button className="text-primary-600 hover:text-primary-800 font-medium text-sm">
                          Xem
                        </button>
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {pagination.pages > 1 && (
            <div className="flex items-center justify-between flex-wrap gap-4 px-2 md:px-6 py-3 border-t border-gray-200">
              <div className="flex items-center text-sm text-gray-500">
                <p>
                  Trang <span className="font-medium">{pagination.page}</span> / <span className="font-medium">{pagination.pages}</span> (Tổng: <span className="font-medium">{pagination.total}</span> đơn)
                </p>
              </div>
              
              <nav>
                <ul className="inline-flex items-center -space-x-px text-sm">
                  <li>
                    <button
                      onClick={() => goToPage(pagination.page - 1, pagination, fetchOrders)}
                      disabled={pagination.page === 1}
                      className="flex items-center justify-center px-3 h-8 ml-0 leading-tight text-gray-500 bg-white border border-gray-300 rounded-l-lg hover:bg-gray-100 hover:text-gray-700 disabled:opacity-50"
                    >
                      Trước
                    </button>
                  </li>
                  
                  {((): React.ReactNode => {
                      const pageNumbers = [];
                      const { page, pages } = pagination;
                      const maxPagesToShow = 5;
                      const ellipsis = <li key="ellipsis..."><span className="flex items-center justify-center px-3 h-8 leading-tight text-gray-500 bg-white border border-gray-300">...</span></li>;

                      if (pages <= maxPagesToShow + 2) {
                        for (let i = 1; i <= pages; i++) {
                          pageNumbers.push(i);
                        }
                      } else {
                        if (page <= maxPagesToShow - 1) {
                          pageNumbers.push(1, 2, 3, 4, 5, 'ellipsis', pages);
                        } else if (page >= pages - (maxPagesToShow - 2)) {
                          pageNumbers.push(1, 'ellipsis', pages - 4, pages - 3, pages - 2, pages - 1, pages);
                        } else {
                          pageNumbers.push(1, 'ellipsis', page - 1, page, page + 1, 'ellipsis_end', pages);
                        }
                      }

                      return pageNumbers.map((p, index) => {
                        if (p === 'ellipsis' || p === 'ellipsis_end') return ellipsis;
                        const pageNum = p as number;
                        return (
                          <li key={index}>
                            <button
                              onClick={() => goToPage(pageNum, pagination, fetchOrders)}
                              className={`flex items-center justify-center px-3 h-8 leading-tight border ${
                                pageNum === page
                                  ? 'text-primary-600 bg-primary-50 border-primary-500'
                                  : 'text-gray-500 bg-white border-gray-300 hover:bg-gray-100 hover:text-gray-700'
                              }`}
                            >
                              {pageNum}
                            </button>
                          </li>
                        );
                      });
                  })()}
                  
                  <li>
                    <button
                      onClick={() => goToPage(pagination.page + 1, pagination, fetchOrders)}
                      disabled={pagination.page === pagination.pages}
                      className="flex items-center justify-center px-3 h-8 leading-tight text-gray-500 bg-white border border-gray-300 rounded-r-lg hover:bg-gray-100 hover:text-gray-700 disabled:opacity-50"
                    >
                      Sau
                    </button>
                  </li>
                </ul>
              </nav>
            </div>
          )}
        </div>
      </div>
      {/* Create Order Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-xl w-full max-w-lg p-6 relative max-h-[90vh] overflow-y-auto">
            <button className="absolute top-3 right-3 text-gray-500 hover:text-gray-700" onClick={() => setShowCreateModal(false)}>
              <X size={20} />
            </button>
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Tạo đơn hàng mới</h2>
            <div className="space-y-4 text-sm">
              <input type="text" placeholder="Tên khách" className="w-full border rounded-lg px-3 py-2" value={createForm.customerName} onChange={(e)=>setCreateForm({...createForm, customerName:e.target.value})} />
              <input type="email" placeholder="Email" className="w-full border rounded-lg px-3 py-2" value={createForm.customerEmail} onChange={(e)=>setCreateForm({...createForm, customerEmail:e.target.value})} />
              <input type="text" placeholder="Số điện thoại" className="w-full border rounded-lg px-3 py-2" value={createForm.customerPhone} onChange={(e)=>setCreateForm({...createForm, customerPhone:e.target.value})} />
              <input type="text" placeholder="Địa chỉ" className="w-full border rounded-lg px-3 py-2" value={createForm.customerAddress} onChange={(e)=>setCreateForm({...createForm, customerAddress:e.target.value})} />
              <div className="relative group">
                <select 
                  className="w-full appearance-none border border-gray-300 rounded-lg pl-3 pr-10 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 bg-white text-sm cursor-pointer" 
                  value={createForm.customerCity} 
                  onChange={(e)=>setCreateForm({...createForm, customerCity:e.target.value})}
                >
                  <option value="">Chọn tỉnh/thành</option>
                  {provinces.map(p=>(<option key={p} value={p}>{p}</option>))}
                </select>
                <ChevronDown className="w-4 h-4 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none group-focus-within:text-primary-500 transition-colors" />
              </div>
              <div className="relative" ref={suggestionsContainerRef}>
                <input
                  type="text"
                  placeholder="Tìm sản phẩm theo mã hoặc tên"
                  className="w-full border rounded-lg px-3 py-2"
                  value={productSearch}
                  onChange={(e)=>{setProductSearch(e.target.value); debouncedSearch(e.target.value);} }
                  onFocus={()=>{if(productSuggestions.length===0) fetchProductSuggestions('');}}
                />
                {productSuggestions.length > 0 && (
                  <ul className="absolute z-50 bg-white shadow border w-full rounded-b-md max-h-60 overflow-auto">
                    {productSuggestions.map(p => (
                      <li key={p._id} className="px-3 py-2 text-sm hover:bg-gray-100 cursor-pointer" onClick={()=>{setSelectedProduct(p); setProductSearch(p.code + ' - ' + p.name); setProductSuggestions([]);} }>
                        {p.code} - {p.name}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
              {/* {selectedProduct && <p className="text-xs text-gray-500">Đã chọn: {selectedProduct.name}</p>} */}
              <input type="number" min={1} className="w-full border rounded-lg px-3 py-2" value={createForm.quantity} onChange={(e)=>setCreateForm({...createForm, quantity:Number(e.target.value)})} />
              <textarea placeholder="Ghi chú" className="w-full border rounded-lg px-3 py-2" value={createForm.notes} onChange={(e)=>setCreateForm({...createForm, notes:e.target.value})} />
            </div>
            <div className="mt-6 flex justify-end gap-3">
              <button onClick={()=>setShowCreateModal(false)} className="px-4 py-2 rounded-lg border text-sm">Huỷ</button>
              <button disabled={createLoading} onClick={async ()=>{
                try {
                  setCreateLoading(true);
                  if(!selectedProduct){alert('Chọn sản phẩm'); return;}
                  await api.post('/orders',{
                    customer:{
                      name:createForm.customerName,
                      email:createForm.customerEmail,
                      phone:createForm.customerPhone,
                      address:createForm.customerAddress,
                      city:createForm.customerCity,
                    },
                    items:[{productId:selectedProduct._id,quantity:createForm.quantity}],
                    notes:createForm.notes
                  });
                  setSelectedProduct(null);
                  setProductSearch('');
                  setShowCreateModal(false);
                  setCreateForm({customerName:'',customerEmail:'',customerPhone:'',customerAddress:'',customerCity:'',quantity:1,notes:''});
                  fetchOrders(1);
                } catch(e:any){alert(e.response?.data?.message||'Lỗi tạo đơn');}
                finally{setCreateLoading(false);}
              }} className="px-4 py-2 rounded-lg bg-primary-600 text-white text-sm disabled:opacity-50">
                {createLoading?'Đang lưu...':'Lưu'}
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
} 