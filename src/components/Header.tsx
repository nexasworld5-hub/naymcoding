import { useState, useRef, useEffect } from 'react';
import { Bell, Menu, Search, ShoppingCart, X, CheckCheck } from 'lucide-react';
import { CategoryId, NotificationItem, ScreenView } from '../types/shop';
import { toBanglaDigits } from '../utils/format';
import { BrandLogo } from './BrandLogo';

interface HeaderProps {
  activeScreen: ScreenView;
  activeCategory: CategoryId;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  onSearchSubmit: () => void;
  onNavigate: (screen: ScreenView, category?: CategoryId) => void;
  onOpenDrawer: () => void;
  cartCount: number;
  wishlistCount: number;
  notifications: NotificationItem[];
  onMarkAllRead: () => void;
  onNotificationClick: (notif: NotificationItem) => void;
}

export function Header({
  activeScreen,
  activeCategory,
  searchQuery,
  onSearchChange,
  onSearchSubmit,
  onNavigate,
  onOpenDrawer,
  cartCount,
  wishlistCount,
  notifications,
  onMarkAllRead,
  onNotificationClick,
}: HeaderProps) {
  const [notifOpen, setNotifOpen] = useState(false);
  const notifRef = useRef<HTMLDivElement>(null);

  const unreadCount = notifications.filter((n) => !n.read).length;

  useEffect(() => {
    function handleOutsideClick(e: MouseEvent) {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setNotifOpen(false);
      }
    }
    if (notifOpen) {
      document.addEventListener('mousedown', handleOutsideClick);
    }
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, [notifOpen]);

  return (
    <header className="sticky top-0 z-40 bg-gradient-to-b from-[#170933] via-[#220B4D] to-[#2C0E63] text-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Row: 3 clean zones */}
        <div className="h-14 sm:h-16 flex items-center justify-between gap-4 sm:gap-8">
          {/* Left: Hamburger + Brand */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              type="button"
              onClick={onOpenDrawer}
              aria-label="মেনু খুলুন"
              className="w-10 h-10 -ml-2 rounded-xl flex items-center justify-center text-white/90 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            >
              <Menu className="w-6 h-6" />
            </button>

            <button
              type="button"
              onClick={() => onNavigate('home')}
              className="flex items-center text-left focus-visible:outline-none cursor-pointer"
              aria-label="স্টাইলওয়্যার হোম"
            >
              <BrandLogo size="sm" showTagline />
            </button>
          </div>

          {/* Center: Desktop Nav Links (hidden on mobile where BottomNav handles navigation) */}
          <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-purple-100/90">
            <button
              type="button"
              onClick={() => onNavigate('home')}
              className={`whitespace-nowrap shrink-0 py-1 border-b-2 transition-colors cursor-pointer ${
                activeScreen === 'home'
                  ? 'border-[#FFD13B] text-white font-semibold'
                  : 'border-transparent hover:text-white'
              }`}
            >
              হোম
            </button>
            <button
              type="button"
              onClick={() => onNavigate('categories', 'all')}
              className={`whitespace-nowrap shrink-0 py-1 border-b-2 transition-colors cursor-pointer ${
                activeScreen === 'categories' && activeCategory !== 'trending'
                  ? 'border-[#FFD13B] text-white font-semibold'
                  : 'border-transparent hover:text-white'
              }`}
            >
              ক্যাটাগরি
            </button>
            <button
              type="button"
              onClick={() => onNavigate('categories', 'trending')}
              className={`whitespace-nowrap shrink-0 py-1 border-b-2 transition-colors cursor-pointer ${
                activeScreen === 'categories' && activeCategory === 'trending'
                  ? 'border-[#FFD13B] text-white font-semibold'
                  : 'border-transparent hover:text-white'
              }`}
            >
              হট ডিলস
            </button>
            <button
              type="button"
              onClick={() => onNavigate('wishlist')}
              className={`whitespace-nowrap shrink-0 py-1 border-b-2 transition-colors cursor-pointer ${
                activeScreen === 'wishlist'
                  ? 'border-[#FFD13B] text-white font-semibold'
                  : 'border-transparent hover:text-white'
              }`}
            >
              পছন্দের তালিকা ({toBanglaDigits(wishlistCount)})
            </button>
            <button
              type="button"
              onClick={() => onNavigate('account')}
              className={`whitespace-nowrap shrink-0 py-1 border-b-2 transition-colors cursor-pointer ${
                activeScreen === 'account'
                  ? 'border-[#FFD13B] text-white font-semibold'
                  : 'border-transparent hover:text-white'
              }`}
            >
              অ্যাকাউন্ট
            </button>
          </nav>

          {/* Right: Notification Bell + Desktop Cart */}
          <div className="flex items-center gap-2 shrink-0" ref={notifRef}>
            <div className="relative">
              <button
                type="button"
                onClick={() => setNotifOpen((prev) => !prev)}
                aria-label="নোটিফিকেশন দেখুন"
                className="relative w-10 h-10 rounded-xl flex items-center justify-center text-white hover:bg-white/10 transition-colors cursor-pointer"
              >
                <Bell className="w-5 h-5" />
                {unreadCount > 0 && (
                  <span className="absolute top-1 right-1 min-w-[18px] h-[18px] px-1 rounded-full bg-[#FF2E7E] text-white text-[10px] font-bold flex items-center justify-center tabular-nums shadow">
                    {toBanglaDigits(unreadCount)}
                  </span>
                )}
              </button>

              {/* Notifications Dropdown */}
              {notifOpen && (
                <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white text-[#1A102E] rounded-2xl shadow-2xl border border-purple-100 overflow-hidden z-50">
                  <div className="px-4 py-3 bg-[#F6F2FC] border-b border-purple-100 flex items-center justify-between">
                    <span className="font-bold text-sm">নোটিফিকেশন</span>
                    {unreadCount > 0 && (
                      <button
                        type="button"
                        onClick={onMarkAllRead}
                        className="text-xs font-semibold text-[#6D0CE0] hover:underline flex items-center gap-1 cursor-pointer"
                      >
                        <CheckCheck className="w-3.5 h-3.5" />
                        সবগুলো পঠিত করুন
                      </button>
                    )}
                  </div>
                  <div className="max-h-80 overflow-y-auto divide-y divide-slate-100">
                    {notifications.length === 0 ? (
                      <p className="p-6 text-center text-sm text-slate-500">
                        কোনো নতুন নোটিফিকেশন নেই
                      </p>
                    ) : (
                      notifications.map((notif) => (
                        <button
                          key={notif.id}
                          type="button"
                          onClick={() => {
                            onNotificationClick(notif);
                            setNotifOpen(false);
                          }}
                          className={`w-full text-left px-4 py-3 hover:bg-purple-50/70 transition-colors cursor-pointer ${
                            !notif.read ? 'bg-[#FAF6FF]' : 'bg-white'
                          }`}
                        >
                          <div className="flex items-start justify-between gap-2">
                            <p className="text-sm font-semibold text-[#1A102E]">
                              {notif.titleBn}
                            </p>
                            {!notif.read && (
                              <span className="text-[10px] font-bold text-[#6D0CE0] shrink-0">
                                নতুন
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                            {notif.messageBn}
                          </p>
                          <p className="text-[11px] text-slate-400 mt-1.5">{notif.timeBn}</p>
                        </button>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            <button
              type="button"
              onClick={() => onNavigate('cart')}
              aria-label="আমার কার্ট দেখুন"
              className="hidden md:flex relative items-center gap-2 px-3.5 py-2 rounded-xl bg-[#6D0CE0] hover:bg-[#7E16F0] text-white text-xs font-semibold transition-colors cursor-pointer whitespace-nowrap"
            >
              <ShoppingCart className="w-4 h-4" />
              <span>কার্ট</span>
              {cartCount > 0 && (
                <span className="min-w-[20px] h-5 px-1.5 rounded-full bg-[#FFD13B] text-[#1A102E] text-[11px] font-bold flex items-center justify-center tabular-nums">
                  {toBanglaDigits(cartCount)}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Search Bar Row on Home view matching Screenshot #2 */}
        {activeScreen === 'home' && (
          <div className="pb-3.5 pt-0.5">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                onSearchSubmit();
              }}
              className="relative max-w-2xl mx-auto"
            >
              <Search className="w-4 h-4 text-[#6D0CE0] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="search"
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder="পণ্য খুঁজুন... (যেমন: ড্রেস, হুডি, জুতা, শাড়ি)"
                className="w-full h-10 sm:h-11 pl-10 pr-10 rounded-full bg-white text-[#1A102E] placeholder:text-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-[#FFD13B] shadow-inner"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => onSearchChange('')}
                  aria-label="খোঁজা মুছুন"
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-100 cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </form>
          </div>
        )}
      </div>
    </header>
  );
}
