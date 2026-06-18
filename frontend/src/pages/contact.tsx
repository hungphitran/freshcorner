import { useState } from "react";
import { Mail, Phone, MapPin, Clock, Send } from "lucide-react";
import api from "@/utils/api";
import toast from "react-hot-toast";
import Seo from "@/components/Seo";

export default function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", phone: "", subject: "", message: "" });
  const [sent, setSent] = useState<null | "success" | "error" | "loading">(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.phone) {
      toast.error("Vui lòng nhập họ tên và số điện thoại");
      return;
    }
    try {
      setSent("loading");
      await api.post("/contacts", form);
      setSent("success");
      toast.success("Gửi tin nhắn thành công! Chúng tôi sẽ phản hồi sớm nhất.");
      setForm({ name: "", email: "", phone: "", subject: "", message: "" });
    } catch (error) {
      console.error("Contact form failed", error);
      setSent("error");
      toast.error("Gửi tin nhắn thất bại. Vui lòng thử lại.");
    } finally {
      setTimeout(() => setSent(null), 4000);
    }
  };

  const contactInfo = [
    {
      icon: Phone,
      title: "Hotline",
      content: "0345 8888 04",
      detail: "Hỗ trợ 24/24"
    },
    {
      icon: Mail,
      title: "Email",
      content: "hello@freshcorner.vn",
      detail: "Phản hồi sớm nhất"
    },
    {
      icon: MapPin,
      title: "Địa chỉ",
      content: "704/9a Hương Lộ 2, Phường Bình Trị Đông, TP.Hồ Chí Minh",
      detail: "TP. Hồ Chí Minh"
    },
    {
      icon: Clock,
      title: "Giờ làm việc",
      content: "24/24",
      detail: "Hỗ trợ 24/24"
    }
  ];

  return (
    <>
      <Seo 
        title="Liên hệ - Fresh Corner"
        description="Liên hệ Fresh Corner để đặt trái cây, tea break, ăn vặt và smoothies cho văn phòng hoặc tiệc nhẹ."
        url="https://freshcorner.vn/contact"
        image="/logo.png"
      />
    <div className="bg-white min-h-screen">
      {/* Header */}
      <div className="relative bg-gradient-to-br from-primary-50 via-orange-50 to-brown-50 py-14 mb-10 border-b border-brown-100">
        <div className="container mx-auto px-4 flex flex-col items-center">
          <div className="mb-4">
            <img src="/logo.png" alt="Fresh Corner" className="h-14 w-auto mx-auto drop-shadow" />
          </div>
          <h1 className="text-4xl font-extrabold text-brown-700 mb-2 text-center tracking-tight">
          Đặt Trái Cây, Tea Break & Smoothies Cho Mọi Dịp
          </h1>
          <p className="text-lg text-secondary-700 text-center max-w-4xl mx-auto">
          Fresh Corner hỗ trợ đơn cá nhân, gia đình, văn phòng và tiệc nhẹ. Gửi nhu cầu của bạn để được tư vấn set phù hợp và thời gian giao hàng.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 pb-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
          {/* Thông tin liên hệ */}
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {contactInfo.map((item, idx) => (
                <div
                  key={idx}
                  className="bg-white rounded-2xl border border-brown-100 shadow-md hover:shadow-lg transition-shadow p-6 flex flex-col items-start gap-2 group"
                >
                  <div className={`w-14 h-14 rounded-xl flex items-center justify-center mb-2 transition-colors ${
                    idx % 3 === 0 ? "bg-primary-50 group-hover:bg-primary-100" :
                    idx % 3 === 1 ? "bg-brown-50 group-hover:bg-brown-100" :
                    "bg-orange-50 group-hover:bg-orange-100"
                  }`}>
                    <item.icon className={`w-7 h-7 ${
                      idx % 3 === 0 ? "text-primary-600" :
                      idx % 3 === 1 ? "text-brown-600" :
                      "text-orange-600"
                    }`} />
                  </div>
                  <h3 className={`text-lg font-semibold mb-1 ${
                    idx % 3 === 0 ? "text-primary-700" :
                    idx % 3 === 1 ? "text-brown-700" :
                    "text-orange-700"
                  }`}>{item.title}</h3>
                  <p className="text-base font-bold text-secondary-900 mb-0.5">{item.content}</p>
                  <p className="text-base text-secondary-600">{item.detail}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Form liên hệ */}
          <div>
            <div className="bg-white rounded-2xl border border-secondary-200 shadow-lg p-8">
              <h2 className="text-2xl font-bold text-brown-700 mb-6 text-center">
                Liên hệ ngay
              </h2>
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label htmlFor="name" className="block text-base font-semibold text-secondary-900 mb-1.5">
                    Họ và tên
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    required
                    value={form.name}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-secondary-200 px-4 py-3 text-base text-secondary-900 placeholder:text-secondary-400 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-colors"
                    placeholder="Nhập họ và tên của bạn"
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="email" className="block text-base font-semibold text-secondary-900 mb-1.5">
                      Email
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={form.email}
                      onChange={handleChange}
                      className="w-full rounded-xl border border-secondary-200 px-4 py-3 text-base text-secondary-900 placeholder:text-secondary-400 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-colors"
                      placeholder="example@email.com"
                    />
                  </div>
                  <div>
                    <label htmlFor="phone" className="block text-base font-semibold text-secondary-900 mb-1.5">
                      Số điện thoại
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      required
                      value={form.phone}
                      onChange={handleChange}
                      className="w-full rounded-xl border border-secondary-200 px-4 py-3 text-base text-secondary-900 placeholder:text-secondary-400 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-colors"
                      placeholder="0123.456.789"
                    />
                  </div>
                </div>
                <div>
                  <label htmlFor="subject" className="block text-base font-semibold text-secondary-900 mb-1.5">
                    Tiêu đề
                  </label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    value={form.subject}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-secondary-200 px-4 py-3 text-base text-secondary-900 placeholder:text-secondary-400 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-colors"
                    placeholder="Chủ đề liên hệ"
                  />
                </div>
                <div>
                  <label htmlFor="message" className="block text-base font-semibold text-secondary-900 mb-1.5">
                    Nội dung tin nhắn
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows={5}
                    value={form.message}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-secondary-200 px-4 py-3 text-base text-secondary-900 placeholder:text-secondary-400 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-colors resize-none"
                    placeholder="Nhập nội dung tin nhắn của bạn..."
                  />
                </div>
                <button
                  type="submit"
                  className="w-full bg-primary-600 text-white rounded-xl py-3 px-6 text-base font-bold hover:bg-primary-700 transition-colors flex items-center justify-center gap-2 shadow-md shadow-primary-900/10"
                  disabled={sent === "loading"}
                >
                  <Send className="w-5 h-5" />
                  {sent === "loading" ? "Đang gửi..." : "Gửi tin nhắn"}
                </button>
                {sent === "success" && (
                  <div className="mt-2 text-green-600 text-center font-medium animate-fade-in">
                    Gửi thành công! Chúng tôi sẽ liên hệ lại sớm nhất.
                  </div>
                )}
                {sent === "error" && (
                  <div className="mt-2 text-red-600 text-center font-medium animate-fade-in">
                    Gửi thất bại. Vui lòng thử lại sau.
                  </div>
                )}
              </form>
            </div>
          </div>
        </div>  
      </div>
    </div>
    </>
  );
} 