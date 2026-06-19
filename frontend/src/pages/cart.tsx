import { useState } from "react";
import { Trash } from "lucide-react";
import toast from "react-hot-toast";
import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import api from "@/utils/api";
import Seo from "@/components/Seo";

export default function CartPage() {
  const { items: cartItems, updateQuantity, removeItem } = useCart();

  const [customer, setCustomer] = useState({
    name: "",
    phone: "",
    email: "",
    address: "",
    city: "",
    note: "",
  });
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");

  // Helpers to update quantity
  const increaseQty = (id: string) => updateQuantity(id, cartItems.find(i=>i.id===id)?.quantity! + 1);
  const decreaseQty = (id: string) => updateQuantity(id, Math.max(1, (cartItems.find(i=>i.id===id)?.quantity! -1)));

  const total = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setCustomer({ ...customer, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!cartItems.length) return;
    if (!customer.name || !customer.phone) {
      toast.error("Vui lòng nhập họ tên và số điện thoại");
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const payload = {
        customer: {
          name: customer.name,
          email: customer.email,
          phone: customer.phone,
          address: customer.address,
          city: customer.city,
        },
        items: cartItems.map((i) => ({ productId: i.id, quantity: i.quantity })),
        notes: customer.note,
        paymentMethod: "cash",
      };

      await api.post("/orders", payload);
      setStatus("success");
      toast.success("Đặt hàng thành công! Chúng tôi sẽ liên hệ sớm.");
      // Clear cart
      cartItems.forEach((i) => removeItem(i.id));
    } catch (error) {
      console.error("Order failed", error);
      setStatus("error");
      toast.error("Có lỗi, vui lòng thử lại");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Seo 
        title="Giỏ hàng - Fresh Corner"
        description="Xem và quản lý sản phẩm trong giỏ hàng của bạn."
        url="https://freshcorner.vn/cart"
        image="/logo.png"
      />
    <div className="min-h-screen bg-secondary-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {cartItems.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-xl shadow-soft border">
            <div className="w-24 h-24 mx-auto mb-6 bg-secondary-100 rounded-full flex items-center justify-center">
              <svg className="w-12 h-12 text-secondary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Giỏ hàng của bạn trống</h3>
            <p className="text-gray-500 mb-6">Thêm sản phẩm để bắt đầu</p>
            <Link 
              href="/"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 transition-colors"
            >
              Bắt đầu mua sắm
            </Link>
          </div>
        ) : (
          <div className="lg:grid lg:grid-cols-12 lg:gap-x-12">
            {/* Cart Items */}
            <div className="lg:col-span-8">
              <div className="bg-white border border-secondary-200 rounded-xl shadow-soft">
                {/* Header */}
                <div className="px-4 sm:px-6 py-4 border-b border-secondary-200 flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-secondary-900">Sản phẩm</h2>
                  <span className="hidden md:block text-xs text-secondary-500 w-32 text-right">Thành tiền</span>
                </div>

                <ul className="divide-y divide-secondary-200">
                  {cartItems.map((item) => {
                    const productMeta = [item.category?.name, item.packageSize, item.product_code].filter(Boolean).join(" • ");
                    return (
                    <li key={item.id} className="px-4 sm:px-6 py-4 grid grid-cols-12 gap-4 md:gap-6">
                      {/* Image */}
                      <div className="col-span-3 md:col-span-2">
                        <Link href={`/products/${item.slug}`} className="aspect-square w-full block overflow-hidden rounded-lg bg-secondary-100 group">
                          <Image
                            src={item.image || "/fallback-product.jpg"}
                            alt={item.name}
                            width={96}
                            height={96}
                            className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
                            unoptimized
                          />
                        </Link>
                      </div>

                      {/* Details & Quantity */}
                      <div className="col-span-9 md:col-span-7 flex flex-col gap-2 min-w-0">
                        <Link href={`/products/${item.slug}`} className="group">
                          <h3 className="font-medium text-secondary-900 line-clamp-2 group-hover:text-primary-600 group-hover:underline transition-colors">
                            {item.name}
                          </h3>
                        </Link>
                        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-secondary-500">
                          <span>{productMeta || "Fresh Corner"}</span>
                        </div>

                        <div className="mt-auto flex flex-col sm:flex-row sm:items-center gap-4 text-sm">
                          {/* Quantity controls */}
                          <div className="flex items-center gap-1 border border-secondary-300 rounded-lg overflow-hidden self-start">
                            <button
                              type="button"
                              onClick={() => decreaseQty(item.id)}
                              className="px-3 py-1.5 disabled:opacity-40 text-secondary-700"
                              disabled={item.quantity === 1}
                            >
                              -
                            </button>
                            <input
                              readOnly
                              value={item.quantity}
                              className="w-10 text-center bg-secondary-50 text-secondary-800 focus:outline-none"
                            />
                            <button
                              type="button"
                              onClick={() => increaseQty(item.id)}
                              className="px-3 py-1.5 text-secondary-700"
                            >
                              +
                            </button>
                          </div>
                          <span className="text-secondary-600">Đơn giá: <strong>{item.price.toLocaleString('vi-VN')} ₫</strong></span>
                        </div>
                      </div>

                      {/* Price & Delete */}
                      <div className="col-span-12 md:col-span-3 flex md:block items-center justify-between md:items-start text-right">
                        <p className="font-semibold text-secondary-900 md:mb-4">
                          {(item.price * item.quantity).toLocaleString('vi-VN')} ₫
                        </p>
                        <button
                          type="button"
                          onClick={() => {
                            if (confirm('Bạn có chắc muốn xoá sản phẩm này khỏi giỏ hàng?')) {
                              removeItem(item.id);
                              toast.success('Đã xoá sản phẩm');
                            }
                          }}
                          className="mt-2 md:mt-0 inline-flex items-center justify-center gap-1.5 rounded-lg bg-red-50 py-2 px-3 text-xs font-medium text-red-600 transition-colors hover:bg-red-100"
                          aria-label="Xoá sản phẩm"
                        >
                          <Trash className="h-3 w-3"/>
                          <span className="hidden sm:inline">Xoá</span>
                        </button>
                      </div>
                    </li>
                  )})}
                </ul>
              </div>
            </div>

            {/* Order Summary & Form */}
            <div className="lg:col-span-4 mt-8 lg:mt-0">
              <div className="bg-white rounded-xl shadow-soft border border-secondary-200 sticky top-24">
                <div className="px-6 py-4 border-b border-secondary-200">
                  <h2 className="text-lg font-semibold text-secondary-900">Thông tin khách hàng</h2>
                </div>
                <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-secondary-700 mb-1.5">
                      Họ tên *
                    </label>
                    <input
                      type="text"
                      name="name"
                      required
                      value={customer.name}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-secondary-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-200 focus:border-primary-500"
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-secondary-700 mb-1.5">
                        Số điện thoại *
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        required
                        value={customer.phone}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-secondary-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-200 focus:border-primary-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-secondary-700 mb-1.5">
                        Email
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={customer.email}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-secondary-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-200 focus:border-primary-500"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-secondary-700 mb-1.5">
                      Địa chỉ giao hàng
                    </label>
                    <input
                      type="text"
                      name="address"
                      value={customer.address}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-secondary-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-200 focus:border-primary-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-secondary-700 mb-1.5">
                      Tỉnh / Thành phố *
                    </label>
                    <input
                      type="text"
                      name="city"
                      value={customer.city}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-secondary-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-200 focus:border-primary-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-secondary-700 mb-1.5">
                      Ghi chú đơn hàng
                    </label>
                    <textarea
                      name="note"
                      rows={3}
                      value={customer.note}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-secondary-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-200 focus:border-primary-500 resize-none"
                    />
                  </div>
                  
                  <div className="pt-4">
                    <button
                      type="submit"
                      disabled={loading || !cartItems.length}
                      className="w-full bg-primary-600 text-white py-3 px-4 rounded-md font-medium hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:bg-primary-400 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
                    >
                      {loading ? (
                        <>
                          <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Đang xử lý...
                        </>
                      ) : (
                        "Đặt hàng"
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
    </>
  );
}