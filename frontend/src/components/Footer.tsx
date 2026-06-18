import Link from "next/link";
import Image from "next/image";

export default function Footer() {
  return (
    <footer className="bg-brown-50 text-gray-600 border-t border-brown-100">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-12 pb-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-12">
          {/* Column 1: Logo and Brand */}
          <div className="space-y-4 md:col-span-2 lg:col-span-2">
            <Link href="/" className="flex items-center space-x-3">
              <Image src="/logo.png" alt="Fresh Corner" width={60} height={60} className="rounded-md" />
              <span className="text-2xl font-bold bg-gradient-to-r from-primary-600 via-orange-500 to-brown-700 bg-clip-text text-transparent">
                Fresh Corner
              </span>
            </Link>
            <p className="text-sm max-w-md text-gray-500">
              Trái cây tươi, tea break, ăn vặt và smoothies cho văn phòng, gia đình và các buổi gặp mặt.
            </p>
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h3 className="text-sm font-semibold text-brown-700">Điều hướng</h3>
            <ul className="mt-4 space-y-2">
              <li><Link href="/about" className="text-gray-500 hover:text-orange-600 hover:underline text-sm transition-colors">Về chúng tôi</Link></li>
              <li><Link href="/products" className="text-gray-500 hover:text-orange-600 hover:underline text-sm transition-colors">Sản phẩm</Link></li>
              <li><Link href="/blog" className="text-gray-500 hover:text-orange-600 hover:underline text-sm transition-colors">Tin tức</Link></li>
              <li><Link href="/contact" className="text-gray-500 hover:text-orange-600 hover:underline text-sm transition-colors">Liên hệ</Link></li>
            </ul>
          </div>

          {/* Column 3: Contact & Map */}
          <div>
            <h3 className="text-sm font-semibold text-brown-700">Liên hệ & địa chỉ</h3>
            <div className="mt-4 space-y-4">
                <div className="overflow-hidden rounded-lg border border-gray-200">
                  <iframe 
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3919.537330756201!2d106.6036138760974!3d10.76993138937819!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31752c38af4d0001%3A0x77d9a6da06264fa8!2zNzA0LzkgSEwyLCBCw6xuaCBUcuG7iyDEkMO0bmcgQSwgQsOsbmggVMOibiwgSOG7kyBDaMOtIE1pbmggNzAwMDAwLCBWaWV0bmFt!5e0!3m2!1svi!2s!4v1687850501235!5m2!1svi!2s" 
                    width="100%" 
                    height="150" 
                    allowFullScreen 
                    loading="lazy" 
                    referrerPolicy="no-referrer-when-downgrade"
                    className="border-0"
                  ></iframe>
                </div>
            </div>
          </div>
        </div>
        
        {/* Copyright section */}
        <div className="mt-12 border-t border-brown-100 pt-4 text-center text-sm text-gray-500">
          <p>
            © {new Date().getFullYear()} Fresh Corner. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
} 