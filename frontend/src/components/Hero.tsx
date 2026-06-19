import Image from "next/image";

export default function Hero() {
  return (
    <div className="relative h-[280px] md:h-[380px] overflow-hidden w-full">
      <Image
        src="/banner.jpg"
        alt="Hero Banner"
        fill
        priority
        className="object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-primary-950/50 via-primary-900/30 to-primary-800/10"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(9,48,12,0.05),rgba(9,48,12,0.3))]"></div>

      {/* Decorative Elements */}
      <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-white to-transparent"></div>
      <div className="absolute top-6 right-10 w-16 h-16 bg-primary-300/20 rounded-full blur-2xl animate-pulse"></div>
      <div className="absolute bottom-6 left-10 w-24 h-24 bg-orange-400/10 rounded-full blur-2xl animate-pulse" style={{ animationDelay: '1s' }}></div>
    </div>
  );
} 