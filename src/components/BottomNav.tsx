import { Heart, Home, LayoutGrid, ShoppingCart, User } from 'lucide-react';
import { CategoryId, ScreenView } from '../types/shop';
import { toBanglaDigits } from '../utils/format';

interface BottomNavProps {
  activeScreen: ScreenView;
  onNavigate: (screen: ScreenView, category?: CategoryId) => void;
  cartCount: number;
  wishlistCount: number;
}

export function BottomNav({
  activeScreen,
  onNavigate,
  cartCount,
  wishlistCount,
}: BottomNavProps) {
  const isAccountSection = [
    'account',
    'orders',
    'addresses',
    'payments',
    'refer',
    'support',
    'about',
    'settings',
    'gold-member',
  ].includes(activeScreen);

  const items: {
    id: ScreenView;
    labelBn: string;
    icon: typeof Home;
    active: boolean;
    badge?: number;
    category?: CategoryId;
  }[] = [
    {
      id: 'home',
      labelBn: 'হোম',
      icon: Home,
      active: activeScreen === 'home',
    },
    {
      id: 'categories',
      labelBn: 'ক্যাটাগরি',
      icon: LayoutGrid,
      active: activeScreen === 'categories' || activeScreen === 'product',
      category: 'all',
    },
    {
      id: 'cart',
      labelBn: 'কার্ট',
      icon: ShoppingCart,
      active: activeScreen === 'cart' || activeScreen === 'checkout',
      badge: cartCount,
    },
    {
      id: 'wishlist',
      labelBn: 'পছন্দ',
      icon: Heart,
      active: activeScreen === 'wishlist',
      badge: wishlistCount > 0 ? wishlistCount : undefined,
    },
    {
      id: 'account',
      labelBn: 'অ্যাকাউন্ট',
      icon: User,
      active: isAccountSection,
    },
  ];

  return (
    <nav
      aria-label="প্রধান মোবাইল নেভিগেশন"
      className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-[#E6DFF3] shadow-[0_-4px_16px_rgba(25,11,54,0.06)]"
    >
      <div className="grid grid-cols-5 h-16 max-w-lg mx-auto">
        {items.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onNavigate(item.id, item.category)}
              className={`relative flex flex-col items-center justify-center gap-0.5 min-h-[44px] transition-colors cursor-pointer ${
                item.active ? 'text-[#6D0CE0]' : 'text-[#473E5C] hover:text-[#6D0CE0]'
              }`}
            >
              <div
                className={`relative flex items-center justify-center w-9 h-7 rounded-xl transition-colors ${
                  item.active ? 'bg-[#6D0CE0] text-white shadow-sm' : ''
                }`}
              >
                <Icon className="w-[18px] h-[18px]" strokeWidth={item.active ? 2.4 : 2} />
                {item.badge !== undefined && item.badge > 0 && (
                  <span className="absolute -top-1.5 -right-2 min-w-[17px] h-[17px] px-1 rounded-full bg-[#FF2E7E] text-white text-[10px] font-bold flex items-center justify-center tabular-nums shadow">
                    {toBanglaDigits(item.badge)}
                  </span>
                )}
              </div>
              <span
                className={`text-[11px] leading-none whitespace-nowrap ${
                  item.active ? 'font-bold text-[#6D0CE0]' : 'font-medium'
                }`}
              >
                {item.labelBn}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
