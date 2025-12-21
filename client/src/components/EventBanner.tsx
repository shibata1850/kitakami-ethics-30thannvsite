import { useState } from "react";
import { Link } from "wouter";
import { X } from "lucide-react";

export default function EventBanner() {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="relative group">
        {/* Close button */}
        <button
          onClick={() => setIsVisible(false)}
          className="absolute -top-2 -right-2 z-10 bg-white rounded-full p-1 shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-gray-100"
          aria-label="バナーを閉じる"
        >
          <X className="h-4 w-4 text-gray-600" />
        </button>

        {/* Banner link */}
        <Link href="/events/30th-anniversary">
          <a className="block rounded-2xl overflow-hidden shadow-2xl hover:shadow-3xl transition-all duration-300 hover:scale-105 cursor-pointer">
            <img
              src="/images/30th-event-banner.jpg"
              alt="30周年記念式典 2026.4.19 参加申し込み受付中"
              className="w-64 md:w-72 h-auto"
            />
          </a>
        </Link>
      </div>
    </div>
  );
}
