import {
  ChevronRight,
  ClipboardList,
  CreditCard,
  Crown,
  Heart,
  HelpCircle,
  Info,
  MapPin,
  Settings,
  Users,
} from 'lucide-react';
import { IMAGES } from '../data/catalog';
import { ScreenView, UserProfile } from '../types/shop';
import { toBanglaDigits } from '../utils/format';

interface AccountViewProps {
  user: UserProfile;
  ordersCount: number;
  wishlistCount: number;
  onNavigate: (screen: ScreenView) => void;
}

export function AccountView({
  user,
  ordersCount,
  wishlistCount,
  onNavigate,
}: AccountViewProps) {
  const menuItems: {
    screen: ScreenView;
    labelBn: string;
    subtitleBn?: string;
    icon: typeof ClipboardList;
  }[] = [
    {
      screen: 'orders',
      labelBn: 'আমার অর্ডারসমূহ',
      subtitleBn: `${toBanglaDigits(ordersCount)}টি অর্ডার`,
      icon: ClipboardList,
    },
    {
      screen: 'wishlist',
      labelBn: 'পছন্দের তালিকা',
      subtitleBn: `${toBanglaDigits(wishlistCount)}টি পণ্য`,
      icon: Heart,
    },
    {
      screen: 'addresses',
      labelBn: 'আমার ঠিকানা',
      icon: MapPin,
    },
    {
      screen: 'payments',
      labelBn: 'পেমেন্ট পদ্ধতি',
      icon: CreditCard,
    },
    {
      screen: 'refer',
      labelBn: 'রেফার করুন ও আয় করুন',
      icon: Users,
    },
    {
      screen: 'support',
      labelBn: 'সহায়তা ও সাপোর্ট',
      icon: HelpCircle,
    },
    {
      screen: 'about',
      labelBn: 'আমাদের সম্পর্কে',
      icon: Info,
    },
  ];

  return (
    <div className="max-w-3xl mx-auto sm:px-6 lg:px-8 sm:py-6 pb-8">
      <div className="bg-white sm:rounded-3xl sm:border sm:border-[#EAE4F5] shadow-xs overflow-hidden">
        {/* Curved Dark Purple Header matching Screenshot #6 */}
        <div className="relative bg-gradient-to-b from-[#1B073E] via-[#4C0D9F] to-[#6B13D2] pt-4 pb-16 px-5 text-white">
          <div className="flex justify-end">
            <button
              type="button"
              onClick={() => onNavigate('settings')}
              aria-label="সেটিংস"
              className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors cursor-pointer"
            >
              <Settings className="w-5 h-5" />
            </button>
          </div>

          {/* White Curved Divider */}
          <div className="absolute -bottom-1 left-0 right-0 h-10 bg-white rounded-t-[100%]" />
        </div>

        {/* Profile Avatar & Name overlapping curve */}
        <div className="relative -mt-16 px-5 pb-6 text-center">
          <div className="inline-block p-1 rounded-full bg-gradient-to-tr from-[#00D2FF] via-[#7E16F0] to-[#FF3EC9] shadow-lg">
            <img
              src={user.avatar || IMAGES.avatarNayem}
              alt={user.nameBn}
              referrerPolicy="no-referrer"
              className="w-24 h-24 rounded-full object-cover border-3 border-white"
            />
          </div>

          <h1 className="mt-2.5 text-xl font-extrabold text-[#1A102E]">{user.nameBn}</h1>
          <p className="text-sm text-slate-500">{user.email}</p>

          {/* Gold Member Banner matching Screenshot #6 */}
          <button
            type="button"
            onClick={() => onNavigate('gold-member')}
            className="mt-5 w-full flex items-center justify-between gap-3 p-3.5 rounded-2xl bg-gradient-to-r from-[#FCEEB5] via-[#FAE08A] to-[#F6CE5B] text-[#1A102E] shadow-xs hover:brightness-[0.98] transition-all text-left cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#F5A623] text-white flex items-center justify-center shadow-xs shrink-0">
                <Crown className="w-5 h-5 fill-white" />
              </div>
              <div>
                <p className="text-sm font-extrabold text-[#3B2600]">গোল্ড মেম্বার</p>
                <p className="text-xs font-medium text-[#6B4A00]">আরও সুবিধা উপভোগ করুন!</p>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-[#5C4000] shrink-0" />
          </button>

          {/* 7 Interactive Menu Rows matching Screenshot #6 */}
          <div className="mt-4 divide-y divide-slate-100 text-left">
            {menuItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.screen}
                  type="button"
                  onClick={() => onNavigate(item.screen)}
                  className="w-full min-h-[54px] py-3 px-2 flex items-center justify-between gap-3 hover:bg-[#FAF6FF] rounded-xl transition-colors cursor-pointer group"
                >
                  <div className="flex items-center gap-3.5">
                    <div className="w-9 h-9 rounded-xl bg-[#F5F0FF] text-[#3B107C] group-hover:bg-[#6D0CE0] group-hover:text-white flex items-center justify-center transition-colors">
                      <Icon className="w-[18px] h-[18px]" />
                    </div>
                    <div>
                      <span className="text-sm sm:text-[15px] font-semibold text-[#1A102E]">
                        {item.labelBn}
                      </span>
                      {item.subtitleBn && (
                        <span className="ml-2 text-xs text-slate-400">· {item.subtitleBn}</span>
                      )}
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-[#6D0CE0] transition-colors" />
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
