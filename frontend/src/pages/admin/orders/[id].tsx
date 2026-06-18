import AdminLayout from "@/components/admin/AdminLayout";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import api from "@/utils/api";
import { CheckCircle, PhoneCall, ArrowLeft } from "lucide-react";

const statusBadge = (status: string) => {
  const style = status === 'contacted' ? 'bg-green-100 text-green-800' : 'bg-indigo-100 text-indigo-800';
  const Icon = status === 'contacted' ? CheckCircle : PhoneCall;
  const label = status === 'contacted' ? 'Đã liên hệ' : 'Chưa liên hệ';
  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium ${style}`}>
      <Icon className="w-3.5 h-3.5" />
      {label}
    </span>
  );
};

export default function OrderDetail() {
  const router = useRouter();
  const { id } = router.query;
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    const fetchOrder = async () => {
      try {
        setLoading(true);
        const res = await api.get(`/orders/${id}`);
        if (res.data.success) {
          setOrder(res.data.data);
        }
      } catch (e: any) {
        setError(e.response?.data?.message || 'Lỗi tải đơn hàng');
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [id]);

  if (loading) return (
    <AdminLayout title="Chi tiết đơn hàng | Fresh Corner">
      <div className="p-8">Đang tải...</div>
    </AdminLayout>
  );
  if (error) return <AdminLayout title="Chi tiết đơn hàng | Fresh Corner"><div className="p-6 text-red-600">{error}</div></AdminLayout>;
  if (!order) return null;

  return (
    <AdminLayout title={`Chi tiết đơn hàng | Fresh Corner`}>
      <div className="md:p-8 space-y-6">
        
        <button onClick={() => router.push('/admin/orders')} className="inline-flex items-center gap-2 text-sm text-primary-600 hover:text-primary-800">
          <ArrowLeft size={18} />
          Quay lại danh sách
        </button>

        <div className="flex items-center justify-between gap-4 flex-wrap">
          <h1 className="text-xl md:text-2xl font-bold text-gray-800">Đơn hàng {order.orderNumber}</h1>
          {statusBadge(order.status)}
        </div>

        {/* Customer info */}
        <div className="bg-white rounded-xl border border-gray-200 p-4 md:p-6 shadow">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Thông tin khách hàng</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-700">
            <div><span className="font-medium">Tên:</span> {order.customer.name}</div>
            <div><span className="font-medium">Email:</span> {order.customer.email}</div>
            <div><span className="font-medium">SĐT:</span> {order.customer.phone}</div>
            <div className="md:col-span-2"><span className="font-medium">Địa chỉ:</span> {order.customer.address}, {order.customer.ward}, {order.customer.district}, {order.customer.city}</div>
          </div>
        </div>

        {/* Items table */}
        <div className="bg-white rounded-xl border border-gray-200 p-4 md:p-6 shadow">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Sản phẩm</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-4 py-2 text-left text-xs md:text-base font-medium text-gray-500 uppercase">Tên sản phẩm</th>
                  <th className="px-4 py-2 text-center text-xs md:text-base font-medium text-gray-500 uppercase">Số lượng</th>
                  <th className="px-4 py-2 text-right text-xs md:text-base font-medium text-gray-500 uppercase">Giá</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {order.items.map((it: any) => {
                  const product = it.product;
                  const fullProductName = [product.name, product.packageSize, product.code ? `(${product.code})` : ""].filter(Boolean).join(" ");
                  
                  return (
                    <tr key={it._id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-3 text-gray-800 text-sm md:text-base">{fullProductName}</td>
                      <td className="px-4 py-3 text-center text-sm md:text-base">{it.quantity}</td>
                      <td className="px-4 py-3 text-right text-sm md:text-base">{it.price.toLocaleString('vi-VN')}₫</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <div className="text-right mt-4 text-md md:text-lg font-semibold text-gray-800">
            Tổng tiền: {order.totalAmount.toLocaleString('vi-VN')}₫
          </div>
        </div>

        {/* Notes */}
        {order.notes && (
          <div className="bg-white rounded-xl border border-gray-200 p-4 md:p-6 shadow">
            <h2 className="text-lg font-semibold text-gray-800 mb-2">Ghi chú</h2>
            <p className="text-sm text-gray-700 whitespace-pre-line">{order.notes}</p>
          </div>
        )}
      </div>
    </AdminLayout>
  );
} 