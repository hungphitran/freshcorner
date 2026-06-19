import React from 'react';
import Image from 'next/image';
import { CheckCircle, Leaf, Shield, Award } from 'lucide-react';

export default function AboutPage() {
  const whyChooseUs = [
    {
      icon: Shield,
      title: "Tươi ngon chọn lọc",
      text: "Fresh Corner chọn trái cây, bánh, đồ ăn vặt và nguyên liệu đồ uống từ nguồn cung đáng tin cậy. Mỗi đơn đều được chuẩn bị kỹ trước khi giao.",
    },
    {
      icon: Leaf,
      title: "Phù hợp từng nhu cầu",
      text: "Từ hộp trái cây cá nhân đến set tea break cho văn phòng, Fresh Corner giúp bạn chọn đúng phần, đúng dịp và đúng ngân sách.",
    },
    {
      icon: Award,
      title: "Tư vấn đúng, phục vụ tận tâm",
      text: "Chúng tôi tập trung vào trải nghiệm đặt hàng nhanh, đóng gói gọn gàng và giao đúng hẹn để mỗi buổi gặp mặt đều dễ chuẩn bị hơn.",
    },
  ];

  const features = [
    { icon: CheckCircle, text: "Trái cây và món ăn được chuẩn bị trong ngày" },
    { icon: Leaf, text: "Ưu tiên lựa chọn tươi, nhẹ và dễ dùng" },
    { icon: Shield, text: "Đóng gói sạch sẽ, phù hợp giao văn phòng" },
    { icon: Award, text: "Linh hoạt cho cá nhân, gia đình và team" }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-br from-primary-700 via-primary-800 to-primary-950 overflow-hidden">
        <div className="absolute inset-0 bg-black opacity-10"></div>
        <div className="relative container mx-auto px-4 py-20 lg:py-28">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div className="text-white space-y-8">
              <div className="space-y-4">
                <div className="inline-block bg-primary-50 text-primary-700 px-4 py-2 rounded-full text-sm font-semibold">
                  Tươi ngon mỗi ngày
                </div>
                <h1 className="text-5xl lg:text-6xl font-bold leading-tight">
                  Fresh Corner
                </h1>
                <p className="text-xl lg:text-2xl text-primary-50 font-medium">
                  Chọn món tươi ngon, phục vụ gọn gàng
                </p>
              </div>
              
              <div className="space-y-6">
                <p className="text-lg text-white/90 leading-relaxed">
                  Fresh Corner mang đến trái cây tươi, tea break, ăn vặt và smoothies cho văn phòng, gia đình và tiệc nhẹ.
                </p>
                
                <div className="grid grid-cols-2 gap-4">
                  {features.map((feature, index) => (
                    <div key={index} className="flex items-center space-x-3">
                      <feature.icon className="w-5 h-5 text-primary-200 flex-shrink-0" />
                      <span className="text-sm text-white/90">{feature.text}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Image */}
            <div className="flex justify-center lg:justify-end">
              <div className="relative">
                <div className="absolute -inset-4 bg-gradient-to-r from-primary-300 to-orange-300 rounded-3xl blur opacity-30"></div>
                <div className="relative bg-white p-3 rounded-3xl shadow-2xl max-w-md">
                  <div className="relative w-full h-72 overflow-hidden rounded-2xl">
                    <Image
                      src="/categories.jpg"
                      alt="Trái cây, tea break, ăn vặt và smoothies Fresh Corner"
                      fill
                      className="object-cover"
                      priority
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* About Section */}
      <div className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">Về Chúng Tôi</h2>
              <div className="w-24 h-1 bg-gradient-to-r from-primary-600 via-primary-500 to-orange-500 mx-auto mb-6"></div>
              <p className="text-xl text-gray-600 leading-relaxed">
                Fresh Corner được xây dựng để việc đặt món tươi ngon cho mỗi ngày trở nên đơn giản hơn
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div className="space-y-6">
                <div className="bg-orange-50 p-6 rounded-2xl border-l-4 border-orange-500">
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">Sứ mệnh của chúng tôi</h3>
                  <p className="text-gray-700 leading-relaxed">
                    Chúng tôi tin rằng một phần trái cây tươi, một set bánh gọn đẹp hay một ly smoothie đúng lúc có thể làm ngày làm việc nhẹ nhàng hơn.
                  </p>
                </div>

                <div className="bg-primary-50/50 p-6 rounded-2xl border-l-4 border-primary-500">
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">Cam kết chất lượng</h3>
                  <p className="text-gray-700 leading-relaxed">
                    Cam kết của chúng tôi là món ăn rõ nguồn, đóng gói sạch, giao đúng hẹn và giữ được trải nghiệm tươi ngon khi đến tay khách hàng.
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="bg-gradient-to-r from-primary-800 to-primary-600 text-white p-8 rounded-2xl">
                  <h3 className="text-2xl font-bold mb-4">Tại Fresh Corner</h3>
                  <h4 className="text-lg font-semibold mb-4">Chúng tôi tập trung vào:</h4>
                  <ul className="space-y-3">
                    <li className="flex items-start space-x-3">
                      <CheckCircle className="w-5 h-5 text-primary-200 mt-0.5 flex-shrink-0" />
                      <div>
                        <span className="font-semibold">Sản phẩm tươi ngon:</span>
                        <span className="text-primary-50"> Chọn nguyên liệu phù hợp từng nhóm món</span>
                      </div>
                    </li>
                    <li className="flex items-start space-x-3">
                      <CheckCircle className="w-5 h-5 text-primary-200 mt-0.5 flex-shrink-0" />
                      <div>
                        <span className="font-semibold">Phù hợp từng dịp:</span>
                        <span className="text-orange-50"> Tư vấn set cá nhân, gia đình, văn phòng</span>
                      </div>
                    </li>
                    <li className="flex items-start space-x-3">
                      <CheckCircle className="w-5 h-5 text-primary-200 mt-0.5 flex-shrink-0" />
                      <div>
                        <span className="font-semibold">Dịch vụ tận tâm:</span>
                        <span className="text-primary-50"> Giao nhanh, hỗ trợ đơn lẻ và đơn nhóm</span>
                      </div>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Why Choose Us */}
      <div className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Tại Sao Chọn Fresh Corner?</h2>
            <div className="w-24 h-1 bg-gradient-to-r from-primary-600 via-primary-500 to-orange-500 mx-auto mb-6"></div>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Chúng tôi không chỉ bán món ăn, chúng tôi giúp bạn chuẩn bị nhanh hơn cho ngày làm việc và các buổi gặp mặt.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {whyChooseUs.map((reason, index) => (
              <div key={reason.title} className="group">
                <div className="bg-white p-8 rounded-3xl shadow-lg hover:shadow-sm h-full hover:scale-105 transition-all duration-300">
                  <div className="text-center mb-6">
                    <div className={`w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-4 ${
                      index === 0 ? "bg-gradient-to-br from-primary-500 to-primary-700" :
                      index === 1 ? "bg-gradient-to-br from-primary-600 to-primary-800" :
                      "bg-gradient-to-br from-orange-500 to-orange-700"
                    }`}>
                      <reason.icon className="w-10 h-10 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-4">{reason.title}</h3>
                  </div>
                  <p className="text-gray-600 leading-relaxed text-center">{reason.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

    </div>
  );
}