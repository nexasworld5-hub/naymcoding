import {
  Crown,
  Flame,
  Heart,
  HelpCircle,
  Info,
  Package,
  ShoppingBag,
  Sparkles,
  User,
  X,
} from 'lucide-react';
import { CATEGORY_NAMES_BN, IMAGES } from '../data/catalog';
import { CategoryId, ScreenView, UserProfile } from '../types/shop';
import { BrandLogo } from './BrandLogo';

interface DrawerMenuProps {
  isOpen: boolean;
  onClose: () => void;
  user: UserProfile;
  onNavigate: (screen: ScreenView, category?: CategoryId) => void;
  onOpenSplash: () => void;
}

export function DrawerMenu({
  isOpen,
  onClose,
  user,
  onNavigate,
  onOpenSplash,
}: DrawerMenuProps) {
  if (!isOpen) return null;

  const go = (screen: ScreenView, category?: CategoryId) => {
    onNavigate(screen, category);
    onClose();
  };

  const quickCategories: CategoryId[] = ['women', 'men', 'shoes', 'bags', 'kids', 'accessories'];

  return (
    <div className="fixed inset-0 z-50 flex">
      {/* Backdrop */}
      <button
        type="button"
        aria-label="মেনু বন্ধ করুন"
        onClick={onClose}
        className="fixed inset-0 bg-black/55 backdrop-blur-xs cursor-pointer"
      />

      {/* Drawer Panel */}
      <aside className="relative z-10 w-80 max-w-[85vw] bg-white h-full shadow-2xl flex flex-col overflow-hidden">
        {/* Top Purple Brand & User Header */}
        <div className="bg-gradient-to-br from-[#190B36] via-[#2B0D5C] to-[#51119C] text-white p-5">
          <div className="flex items-center justify-between mb-5">
            <BrandLogo size="sm" showTagline />
            <button
              type="button"
              onClick={onClose}
              aria-label="মেনু বন্ধ করুন"
              className="w-9 h-9 rounded-xl bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <button
            type="button"
            onClick={() => go('account')}
            className="w-full flex items-center gap-3 p-2.5 rounded-2xl bg-white/10 hover:bg-white/15 transition-colors text-left cursor-pointer"
          >
            <img
              src={user.avatar || IMAGES.avatarNayem}
              alt={user.nameBn}
              referrerPolicy="no-referrer"
              className="w-11 h-11 rounded-full object-cover border-2 border-[#FFD13B]"
            />
            <div className="min-w-0 flex-1">
              <p className="text-sm font-bold truncate">{user.nameBn}</p>
              <p className="text-xs text-purple-200 truncate">{user.email}</p>
            </div>
            <Crown className="w-4 h-4 text-[#FFD13B] shrink-0" />
          </button>
        </div>

        {/* Menu Links */}
        <div className="flex-1 overflow-y-auto p-4 space-y-5">
          <div>
            <p className="px-2 text-xs font-semibold text-slate-400 mb-2">ক্যাটাগরি অনুযায়ী শপিং</p>
            <div className="space-y-1">
              {quickCategories.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => go('categories', cat)}
                  className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium text-[#1A102E] hover:bg-[#F5F0FF] hover:text-[#6D0CE0] transition-colors cursor-pointer"
                >
                  <span>{CATEGORY_NAMES_BN[cat]}</span>
                  <span className="text-xs text-slate-400">›</span>
                </button>
              ))}
              <button
                type="button"
                onClick={() => go('categories', 'trending')}
                className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-semibold text-[#E53935] hover:bg-red-50 transition-colors cursor-pointer"
              >
                <Flame className="w-4 h-4" />
                <span>ট্রেন্ডিং ও হট ডিলস</span>
              </button>
            </div>
          </div>

          <div className="border-t border-slate-100 pt-4 space-y-1">
            <p className="px-2 text-xs font-semibold text-slate-400 mb-2">আমার অ্যাকাউন্ট</p>
            <button
              type="button"
              onClick={() => go('orders')}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-[#1A102E] hover:bg-[#F5F0FF] cursor-pointer"
            >
              <Package className="w-4 h-4 text-[#6D0CE0]" />
              <span>আমার অর্ডারসমূহ</span>
            </button>
            <button
              type="button"
              onClick={() => go('wishlist')}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-[#1A102E] hover:bg-[#F5F0FF] cursor-pointer"
            >
              <Heart className="w-4 h-4 text-[#E91E63]" />
              <span>পছন্দের তালিকা</span>
            </button>
            <button
              type="button"
              onClick={() => go('cart')}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-[#1A102E] hover:bg-[#F5F0FF] cursor-pointer"
            >
              <ShoppingBag className="w-4 h-4 text-[#6D0CE0]" />
              <span>আমার কার্ট</span>
            </button>
            <button
              type="button"
              onClick={() => go('account')}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-[#1A102E] hover:bg-[#F5F0FF] cursor-pointer"
            >
              <User className="w-4 h-4 text-[#6D0CE0]" />
              <span>প্রোফাইল ও সেটিংস</span>
            </button>
          </div>

          <div className="border-t border-slate-100 pt-4 space-y-1">
            <button
              type="button"
              onClick={() => {
                onClose();
                onOpenSplash();
              }}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-[#6D0CE0] bg-[#F5F0FF] hover:bg-[#EDE4FF] cursor-pointer"
            >
              <Sparkles className="w-4 h-4" />
              <span>ব্র্যান্ড ওয়েলকাম স্ক্রিন দেখুন</span>
            </button>
            <button
              type="button"
              onClick={() => go('support')}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-[#1A102E] hover:bg-[#F5F0FF] cursor-pointer"
            >
              <HelpCircle className="w-4 h-4 text-slate-500" />
              <span>সহায়তা ও সাপোর্ট</span>
            </button>
            <button
              type="button"
              onClick={() => go('about')}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-[#1A102E] hover:bg-[#F5F0FF] cursor-pointer"
            >
              <Info className="w-4 h-4 text-slate-500" />
              <span>আমাদের সম্পর্কে</span>
            </button>
          </div>
        </div>
      </aside>
    </div>
  );
}
