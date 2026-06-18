import { createPortal } from "react-dom";
import { useEffect, useState } from "react";
import Image from "next/image";
import { Product } from "@/components/ProductCard";
import api from "@/utils/api";
import toast from "react-hot-toast";

interface BuyNowModalProps {
  open: boolean;
  onClose: () => void;
  product: Product;
}

export default function BuyNowModal({ open, onClose, product }: BuyNowModalProps) {
  const [quantity, setQuantity] = useState(1);
  const [customer, setCustomer] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
  });
  const [loading, setLoading] = useState(false);

  const total = product.price * quantity;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCustomer({ ...customer, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    if (!customer.name || !customer.phone || !customer.address || !customer.city) {
      toast.error("Vui lòng nhập đầy đủ thông tin bắt buộc");
      return;
    }
    try {
      setLoading(true);
      await api.post("/orders", {
        customer,
        items: [{ productId: product.id, quantity }],
        paymentMethod: "cash",
        notes: "Đặt hàng mua ngay từ website",
      });
      toast.success("Đặt hàng thành công! Chúng tôi sẽ liên hệ sớm.");
      onClose();
    } catch (error: any) {
      console.error("Order failed", error);
      toast.error("Đặt hàng thất bại. Vui lòng thử lại");
    } finally {
      setLoading(false);
    }
  };

  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  if (!open || !mounted || typeof window === 'undefined') return null;

  const modalContent = (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
      <div className="bg-white w-full max-w-lg rounded-xl shadow-lg overflow-hidden animate-fadeIn">
        {/* Header */}
        <div className="flex justify-between items-center px-6 py-4 border-b border-secondary-200">
          <h3 className="text-lg font-semibold text-secondary-900">Đặt hàng nhanh</h3>
          <button onClick={onClose} className="text-secondary-500 hover:text-secondary-700">
            ✕
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-6 max-h-[80vh] overflow-y-auto">
          {/* Product summary */}
          <div className="flex gap-4">
            <div className="relative w-24 h-24 flex-shrink-0">
              <Image src={product.image} alt={product.name} fill className="object-cover rounded" unoptimized />
            </div>
            <div className="flex-1">
              <h4 className="font-medium text-secondary-900 text-sm line-clamp-2">
                {product.name}
              </h4>
              <p className="text-secondary-600 text-sm">
                {[product.category?.name, product.packageSize].filter(Boolean).join(" • ")}
              </p>
              <p className="text-primary-600 font-semibold mt-1">
                {product.price.toLocaleString("vi-VN")} ₫
              </p>
            </div>
          </div>

          {/* Quantity */}
          <div className="flex items-center gap-3">
            <span className="text-secondary-700 text-sm">Số lượng:</span>
            <div className="flex items-center border border-secondary-300 rounded-lg overflow-hidden">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="px-3 py-1 hover:bg-secondary-50"
              >
                -
              </button>
              <input
                type="number"
                value={quantity}
                min={1}
                onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                className="w-14 text-center focus:outline-none"
              />
              <button
                onClick={() => setQuantity(quantity + 1)}
                className="px-3 py-1 hover:bg-secondary-50"
              >
                +
              </button>
            </div>
          </div>

          {/* Total */}
          <div className="flex justify-between items-center bg-primary-50 px-4 py-3 rounded-lg">
            <span className="text-secondary-700 font-medium">Thành tiền:</span>
            <span className="text-primary-600 font-semibold text-lg">
              {total.toLocaleString("vi-VN")} ₫
            </span>
          </div>

          {/* Customer form */}
          <div className="space-y-4">
            <input
              type="text"
              name="name"
              placeholder="Họ và tên*"
              value={customer.name}
              onChange={handleChange}
              className="w-full border border-secondary-200 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-200 focus:border-primary-500"
            />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <input
                type="tel"
                name="phone"
                placeholder="Số điện thoại*"
                value={customer.phone}
                onChange={handleChange}
                className="w-full border border-secondary-200 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-200 focus:border-primary-500"
              />
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={customer.email}
                onChange={handleChange}
                className="w-full border border-secondary-200 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-200 focus:border-primary-500"
              />
            </div>
            <input
              type="text"
              name="address"
              placeholder="Địa chỉ giao hàng*"
              value={customer.address}
              onChange={handleChange}
              className="w-full border border-secondary-200 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-200 focus:border-primary-500"
            />
            <input
              type="text"
              name="city"
              placeholder="Tỉnh / Thành phố*"
              value={customer.city}
              onChange={handleChange}
              className="w-full border border-secondary-200 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-200 focus:border-primary-500"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 px-6 py-4 border-t border-secondary-200 bg-secondary-50">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg border border-secondary-300 text-secondary-700 hover:bg-secondary-100 text-sm"
          >
            Thoát
          </button>
          <button
            disabled={loading}
            onClick={handleSubmit}
            className="px-5 py-2 rounded-lg bg-primary-600 text-white hover:bg-primary-700 text-sm disabled:opacity-60"
          >
            {loading ? "Đang gửi..." : "Đặt hàng"}
          </button>
        </div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
} 