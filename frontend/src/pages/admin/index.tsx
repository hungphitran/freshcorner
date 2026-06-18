import AdminLayout from "@/components/admin/AdminLayout";
import { 
  BarChart3, 
  ArrowUpRight, 
  ArrowDownRight, 
  ShoppingBag,
  PhoneCall,
  CheckCircle,
  Box
} from "lucide-react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import api from '@/utils/api';

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

// No local sample data – everything comes from API

export default function AdminDashboard() {
  // Chart labels & data derived from API timeTrends
  const router = useRouter();
  const [dashboardStats, setDashboardStats] = useState<any>(null);
  const [ordersStats, setOrdersStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const CACHE_KEY = 'admin_dashboard_stats_v2';
  const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

  // Check if user is authenticated
  useEffect(() => {
    const isAuthenticated = localStorage.getItem("admin_token");
    if (!isAuthenticated) {
      router.push("/admin/login");
    }
  }, [router]);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const [dashRes, ordersRes] = await Promise.all([
          api.get('/statistics/dashboard'),
          api.get('/statistics/orders')
        ]);
        if (dashRes.data.success) {
          setDashboardStats(dashRes.data.data);
        }
        if (ordersRes.data.success) {
          setOrdersStats(ordersRes.data.data);
        }
        sessionStorage.setItem(
          CACHE_KEY,
          JSON.stringify({
            ts: Date.now(),
            dashboard: dashRes.data.data,
            orders: ordersRes.data.data
          })
        );
      } catch (err: any) {
        setError(err.response?.data?.message || 'Error fetching stats');
      } finally {
        setLoading(false);
      }
    };

    if (!localStorage.getItem('admin_token')) {
      router.push('/admin/login');
      return;
    }

    const cached = sessionStorage.getItem(CACHE_KEY);
    if (cached) {
      try {
        const parsed = JSON.parse(cached);
        if (Date.now() - parsed.ts < CACHE_TTL) {
          setDashboardStats(parsed.dashboard);
          setOrdersStats(parsed.orders);
          setLoading(false);
          return;
        }
      } catch {/* ignore parse error */}
    }
    fetchStats();
  }, [router]);
  
  // Skeleton cards
  if (loading) {
    return (
      <AdminLayout title="Bảng điều khiển | Fresh Corner">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-800">Bảng điều khiển</h1>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
          {[1,2,3,4].map(i=> (
            <div key={i} className="h-24 bg-gray-100 rounded-xl animate-pulse" />
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          <div className="lg:col-span-2 h-72 bg-gray-100 rounded-xl animate-pulse" />
          <div className="h-72 bg-gray-100 rounded-xl animate-pulse" />
        </div>
        <div className="h-64 bg-gray-100 rounded-xl animate-pulse" />
      </AdminLayout>
    );
  }
  if (error) return <AdminLayout title="Bảng điều khiển | Fresh Corner"><div className="p-6 text-red-600">Error: {error}</div></AdminLayout>;
  if (!dashboardStats || !ordersStats) return null;

  // Extract overview orders
  const overviewOrders = dashboardStats.overview?.orders ?? dashboardStats.orders ?? {};
  const orderOverviewFallback = ordersStats.overview ?? ordersStats.summary ?? {};

  const totalOrders = overviewOrders.total ?? orderOverviewFallback.totalOrders ?? orderOverviewFallback.total ?? 0;
  const totalContactedOrders = overviewOrders.contacted ?? orderOverviewFallback.contactedOrders ?? orderOverviewFallback.contacted ?? 0;
  const totalNewOrders = overviewOrders.notContacted ?? orderOverviewFallback.notContactedOrders ?? orderOverviewFallback.notContacted ?? 0;
  const contactRate = overviewOrders.contactRate ?? orderOverviewFallback.contactRate ?? (totalOrders ? ((totalContactedOrders/totalOrders)*100).toFixed(1) : '0');
  const productsTotal = dashboardStats.overview?.products?.total ?? dashboardStats.products?.total ?? 0;
  
  // Prepare chart data from ordersStats timeTrends
  const timeTrendData = ordersStats.timeTrends?.data ?? ordersStats.trends ?? [];
  const chartLabels = timeTrendData.map((item: any) => {
    const id = item._id || {};
    if (id.month) {
      return `${('0'+id.month).slice(-2)}/${id.year}`;
    }
    if (id.week) {
      return `W${id.week}/${id.year}`;
    }
    return id.year?.toString() || '';
  });
  const chartDataVals = timeTrendData.map((item: any) => item.totalOrders || item.orders || 0);

  const barData = {
    labels: chartLabels,
    datasets: [{
      label: 'Tổng đơn',
      data: chartDataVals,
      backgroundColor: 'rgba(59, 130, 246, 0.6)'
    }]
  };
  const barOptions = {
    responsive: true,
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: (ctx:any) => `${ctx.parsed.y.toLocaleString('vi-VN')} đơn`
        }
      }
    },
    scales: {
      x: { grid: { display: false } },
      y: { grid: { color: '#f3f4f6' }, ticks: { precision:0 } }
    }
  } as any;
  
  return (
    <AdminLayout title="Bảng điều khiển | Fresh Corner">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800">Bảng điều khiển</h1>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
        <StatCard 
          title="Tổng đơn hàng" 
          value={totalOrders} 
          change={0} 
          icon={ShoppingBag}
          color="bg-blue-500"
        />
        <StatCard 
          title="Đã liên hệ" 
          value={totalContactedOrders}
          change={0} 
          icon={PhoneCall}
          color="bg-green-500"
        />
        <StatCard 
          title="Chưa liên hệ" 
          value={totalNewOrders}
          change={0} 
          icon={CheckCircle}
          color="bg-indigo-500"
        />
        <StatCard 
          title="Tổng sản phẩm" 
          value={productsTotal}
          change={0}
          icon={Box}
          color="bg-purple-500"
        />
        {/* Bạn có thể thêm card khác nếu cần */}
      </div>

      {/* Charts & Tables */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Orders Chart */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-gray-200 p-6 shadow">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-semibold text-gray-800">
              Đơn hàng theo tháng
            </h2>
            <div className="flex items-center space-x-2 text-sm">
              <span className="flex items-center">
                <span className="w-3 h-3 rounded-full bg-primary-500 mr-1"></span>
                <span className="text-gray-600">Tổng đơn</span>
              </span>
            </div>
          </div>
          <div className="h-72">
            <Bar data={barData} options={barOptions} />
          </div>
        </div>

        {/* Order Statistics */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-semibold text-gray-800">Thống kê đơn hàng</h2>
          </div>
          
          <div className="space-y-6">
            {/* Orders By Status */}
            <div>
              <h3 className="text-sm font-medium text-gray-600 mb-4">Theo trạng thái</h3>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm text-gray-700">Đã liên hệ</span>
                    <span className="text-sm font-medium text-gray-900">{Math.round((totalContactedOrders / totalOrders) * 100)}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-green-500 h-2 rounded-full" 
                      style={{ width: `${(totalContactedOrders / totalOrders) * 100}%` }}
                    ></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm text-gray-700">Chưa liên hệ</span>
                    <span className="text-sm font-medium text-gray-900">{Math.round((totalNewOrders / totalOrders) * 100)}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-indigo-500 h-2 rounded-full" 
                      style={{ width: `${(totalNewOrders / totalOrders) * 100}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Order Growth */}
            <div>
              <h3 className="text-sm font-medium text-gray-600 mb-2">Tăng trưởng đơn hàng</h3>
              <div className="flex items-center">
                <div className="text-2xl font-bold text-gray-900">+24.5%</div>
                <div className="ml-2 text-sm text-green-600 flex items-center">
                  <ArrowUpRight size={16} className="mr-1" />
                  <span>so với tháng trước</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Orders */}
      <div className="bg-white rounded-xl border border-gray-200 shadow overflow-hidden">
        <div className="flex justify-between items-center px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-800">Đơn hàng gần đây</h2>
          <button className="text-sm text-primary-600 hover:text-primary-800 font-medium">Xem tất cả</button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Mã đơn</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Khách hàng</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Số điện thoại</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ngày</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Trạng thái</th>
                {/* <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Tổng tiền</th> */}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              { (dashboardStats.recentOrders ?? ordersStats.recentOrders ?? []).map((order: any) => (
                <tr key={order._id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-primary-600">{order.orderNumber}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">{order.customer.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{order.customer.phone}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(order.orderDate).toLocaleDateString('vi-VN')}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2.5 py-0.5 text-xs font-semibold rounded-full ${order.status === 'contacted' ? 'bg-green-100 text-green-800' : 'bg-indigo-100 text-indigo-800'}`}>
                      {order.status === 'contacted' ? 'Đã liên hệ' : 'Chưa liên hệ'}
                    </span>
                  </td>
                  {/* <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 text-right">
                    {order.totalAmount ? order.totalAmount.toLocaleString('vi-VN') + '₫' : '-'}
                  </td> */}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  );
}

interface StatCardProps {
  title: string;
  value: string | number;
  change: number;
  icon: React.ElementType;
  color: string;
}

function StatCard({ title, value, change, icon: Icon, color }: StatCardProps) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 shadow relative overflow-hidden">
      <div className="flex justify-between mb-4">
        <div className={`${color} bg-opacity-10 p-2 rounded-lg`}>
          <Icon className={color.replace('bg-', 'text-')} size={20} />
        </div>
        <div className={`flex items-center text-sm ${change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
          <span className="font-semibold">{Math.abs(change)}%</span>
          {change >= 0 ? <ArrowUpRight size={16} /> : <ArrowDownRight size={16} />}
        </div>
      </div>
      <h3 className="text-gray-500 text-sm font-medium mb-1">{title}</h3>
      <p className="text-2xl font-bold text-gray-900">{typeof value === 'number' ? value.toLocaleString('vi-VN') : value}</p>
      
      {/* Decorative element */}
      <div className="absolute -bottom-6 -right-6 w-20 h-20 rounded-full bg-gray-50 opacity-50"></div>
    </div>
  );
} 