import { X } from 'lucide-react';
import { IMAGES } from '../data/catalog';
import { BrandLogo } from './BrandLogo';

interface SplashShowcaseModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SplashShowcaseModal({ isOpen, onClose }: SplashShowcaseModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
      <div className="relative w-full max-w-sm rounded-3xl overflow-hidden bg-gradient-to-b from-[#1A0838] via-[#270A54] to-[#14052B] text-white shadow-2xl border border-purple-500/30">
        <button
          type="button"
          onClick={onClose}
          aria-label="বন্ধ করুন"
          className="absolute top-3.5 right-3.5 z-20 w-9 h-9 rounded-full bg-black/40 hover:bg-black/60 text-white flex items-center justify-center transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Couple Hero Visual matching Screen 1 */}
        <div className="relative h-80 overflow-hidden">
          <img
            src={IMAGES.splashCouple}
            alt="স্টাইলওয়্যার ফ্যাশন কালেকশন"
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover object-top"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#1D0740] via-[#1D0740]/35 to-transparent" />
        </div>

        {/* Brand Identity & Tagline */}
        <div className="relative -mt-14 px-6 pb-7 pt-2 text-center flex flex-col items-center">
          <BrandLogo size="lg" showTagline />

          <p className="mt-4 text-base font-medium text-purple-100 leading-snug">
            স্মার্ট শপিং, স্টাইলিশ লুক
          </p>

          {/* Animated Loading Bar matching Screen 1 */}
          <div className="w-full max-w-[210px] mt-5">
            <div className="h-2 w-full rounded-full bg-white/15 overflow-hidden p-0.5">
              <div className="h-full w-4/5 rounded-full bg-gradient-to-r from-[#FF3EC9] via-[#A239FF] to-[#FFD13B]" />
            </div>
            <p className="mt-2 text-xs text-purple-200/80">স্টোর প্রস্তুত...</p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="mt-5 w-full min-h-[44px] py-2.5 px-6 rounded-2xl bg-gradient-to-r from-[#6D0CE0] to-[#9322FF] hover:from-[#7A17EE] hover:to-[#A038FF] text-white font-bold text-sm shadow-lg transition-all active:scale-[0.98] cursor-pointer"
          >
            শপিং শুরু করুন →
          </button>
        </div>
      </div>
    </div>
  );
}
