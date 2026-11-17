import { useState } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  Heart,
  Minus,
  Plus,
  ShieldCheck,
  ShoppingBag,
  Tag,
  Trash2,
} from 'lucide-react';
import { CartItem, Product } from '../types/shop';
import { formatTaka, toBanglaDigits } from '../utils/format';

interface CartViewProps {
  cart: CartItem[];
  wishlistIds: string[];
  onToggleWishlist: (productId: string) => void;
  onUpdateQuantity: (cartItemId: string, delta: number) => void;
  onRemoveItem: (cartItemId: string) => void;
  onClearCart: () => void;
  onSelectProduct: (product: Product) => void;
  onProceedToCheckout: (promoDiscount: number) => void;
  onContinueShopping: () => void;
  onBack: () => void;
}

export function CartView({
  cart,
  wishlistIds,
  onToggleWishlist,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
  onSelectProduct,
  onProceedToCheckout,
  onContinueShopping,
  onBack,
}: CartViewProps) {
  const [promoCode, setPromoCode] = useState('');
  const [appliedCode, setAppliedCode] = useState<string | null>(null);
  const [promoError, setPromoError] = useState('');
  const [confirmClear, setConfirmClear] = useState(false);

  const subtotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const deliveryCharge = cart.length > 0 ? 70 : 0;
  const discount = appliedCode === 'GOLD10' ? Math.round(subtotal * 0.1) : 0;
  const total = subtotal + deliveryCharge - discount;

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    const code = promoCode.trim().toUpperCase();
    if (!code) return;
    if (code === 'GOLD10') {
      setAppliedCode('GOLD10');
      setPromoError('');
    } else {
      setPromoError('সঠিক কুপন কোড নয় (টিপস: GOLD10 ব্যবহার করুন)');
    }
  };

  return (
    <div className="min-h-[75vh] pb-8">
      {/* Top Bar matching Screenshot #5 */}
      <div className="bg-gradient-to-r from-[#1A0838] via-[#280B54] to-[#3B107C] text-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between">
          <button
            type="button"
            onClick={onBack}
            aria-label="পিছনে যান"
            className="w-10 h-10 -ml-2 rounded-xl flex items-center justify-center hover:bg-white/10 transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>

          <h1 className="text-base sm:text-lg font-bold">আমার কার্ট</h1>

          {cart.length > 0 ? (
            <button
              type="button"
              onClick={() => setConfirmClear((prev) => !prev)}
              aria-label="কার্ট খালি করুন"
              className="w-10 h-10 -mr-2 rounded-xl flex items-center justify-center hover:bg-white/10 transition-colors cursor-pointer"
            >
              <Trash2 className="w-5 h-5" />
            </button>
          ) : (
            <div className="w-10" />
          )}
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-5 space-y-4">
        {confirmClear && cart.length > 0 && (
          <div className="bg-red-50 border border-red-200 rounded-2xl p-4 flex flex-wrap items-center justify-between gap-3">
            <p className="text-sm font-semibold text-red-900">
              আপনি কি কার্টের সব পণ্য মুছে ফেলতে চান?
            </p>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setConfirmClear(false)}
                className="px-3.5 py-1.5 rounded-xl bg-white border border-red-200 text-xs font-semibold text-slate-700 cursor-pointer"
              >
                না
              </button>
              <button
                type="button"
                onClick={() => {
                  onClearCart();
                  setConfirmClear(false);
                }}
                className="px-3.5 py-1.5 rounded-xl bg-red-600 text-white text-xs font-semibold cursor-pointer"
              >
                হ্যাঁ, মুছুন
              </button>
            </div>
          </div>
        )}

        {cart.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-[#EAE4F5] shadow-xs">
            <div className="w-16 h-16 rounded-full bg-[#F5F0FF] text-[#6D0CE0] flex items-center justify-center mx-auto mb-4">
              <ShoppingBag className="w-8 h-8" />
            </div>
            <h2 className="text-lg font-bold text-[#1A102E]">আপনার কার্ট এখন খালি</h2>
            <p className="text-sm text-slate-500 mt-1">
              পছন্দের পোশাক বা এক্সেসরিজ কার্টে যোগ করে কেনাকাটা শুরু করুন।
            </p>
            <button
              type="button"
              onClick={onContinueShopping}
              className="mt-5 px-6 py-3 rounded-2xl bg-gradient-to-r from-[#5E0AC9] to-[#7E16F0] text-white text-sm font-bold shadow-md hover:opacity-95 transition-opacity cursor-pointer"
            >
              শপিং শুরু করুন →
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
            {/* Cart Items List */}
            <div className="lg:col-span-7 space-y-3">
              {cart.map((item) => {
                const isWishlisted = wishlistIds.includes(item.product.id);
                return (
                  <div
                    key={item.id}
                    className="bg-white rounded-2xl p-3 sm:p-4 border border-[#EAE4F5] shadow-xs flex items-center gap-3.5"
                  >
                    {/* Thumbnail with mini wishlist heart matching Screenshot #5 */}
                    <div className="relative w-20 h-22 sm:w-24 sm:h-24 rounded-xl bg-[#F6F3FB] overflow-hidden shrink-0">
                      <button
                        type="button"
                        onClick={() => onSelectProduct(item.product)}
                        className="w-full h-full block cursor-pointer"
                      >
                        <img
                          src={item.product.images[0]}
                          alt={item.product.nameBn}
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover object-top"
                        />
                      </button>
                      <button
                        type="button"
                        onClick={() => onToggleWishlist(item.product.id)}
                        aria-label="পছন্দ টগল"
                        className="absolute top-1.5 right-1.5 w-6 h-6 rounded-full bg-white/95 flex items-center justify-center shadow-xs cursor-pointer"
                      >
                        <Heart
                          className={`w-3.5 h-3.5 ${
                            isWishlisted ? 'fill-[#E91E63] text-[#E91E63]' : 'text-slate-600'
                          }`}
                        />
                      </button>
                    </div>

                    {/* Details */}
                    <div className="flex-1 min-w-0">
                      <button
                        type="button"
                        onClick={() => onSelectProduct(item.product)}
                        className="text-left block w-full cursor-pointer"
                      >
                        <h3 className="text-sm sm:text-base font-bold text-[#1A102E] truncate hover:text-[#6D0CE0]">
                          {item.product.nameBn}
                        </h3>
                      </button>
                      <p className="text-xs text-slate-500 mt-0.5">সাইজ: {item.size}</p>

                      <div className="mt-2.5 flex items-center justify-between gap-2">
                        <span className="text-base font-extrabold text-[#1A102E] tabular-nums">
                          {formatTaka(item.product.price * item.quantity)}
                        </span>

                        <div className="flex items-center gap-2">
                          {/* Quantity Stepper matching Screenshot #5 */}
                          <div className="inline-flex items-center rounded-full border border-[#E0D7F2] bg-[#FAF8FE] px-1 py-0.5">
                            <button
                              type="button"
                              onClick={() => onUpdateQuantity(item.id, -1)}
                              aria-label="পরিমাণ কমান"
                              className="w-7 h-7 rounded-full flex items-center justify-center text-[#1A102E] hover:bg-purple-100 transition-colors cursor-pointer"
                            >
                              <Minus className="w-3.5 h-3.5" />
                            </button>
                            <span className="w-7 text-center text-sm font-bold text-[#1A102E] tabular-nums">
                              {toBanglaDigits(item.quantity)}
                            </span>
                            <button
                              type="button"
                              onClick={() => onUpdateQuantity(item.id, 1)}
                              aria-label="পরিমাণ বাড়ান"
                              className="w-7 h-7 rounded-full flex items-center justify-center text-[#1A102E] hover:bg-purple-100 transition-colors cursor-pointer"
                            >
                              <Plus className="w-3.5 h-3.5" />
                            </button>
                          </div>

                          <button
                            type="button"
                            onClick={() => onRemoveItem(item.id)}
                            aria-label="আইটেম সরান"
                            className="w-8 h-8 rounded-xl flex items-center justify-center text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Summary & Checkout Card matching Screenshot #5 */}
            <div className="lg:col-span-5 bg-white rounded-3xl p-5 border border-[#EAE4F5] shadow-xs space-y-4">
              {/* Promo Code Input */}
              <form onSubmit={handleApplyPromo} className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-600 flex items-center gap-1.5">
                  <Tag className="w-3.5 h-3.5 text-[#6D0CE0]" />
                  <span>কুপন কোড আছে? (গোল্ড কোড: GOLD10)</span>
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value)}
                    placeholder="GOLD10 লিখুন"
                    className="flex-1 h-10 px-3 rounded-xl border border-[#DDD4F0] text-sm focus:outline-none focus:ring-2 focus:ring-[#6D0CE0]"
                  />
                  <button
                    type="submit"
                    className="px-4 h-10 rounded-xl bg-[#F2EAFF] hover:bg-[#E7D8FF] text-[#6D0CE0] text-xs font-bold transition-colors cursor-pointer whitespace-nowrap"
                  >
                    প্রয়োগ করুন
                  </button>
                </div>
                {promoError && <p className="text-xs text-red-600">{promoError}</p>}
                {appliedCode && (
                  <p className="text-xs text-emerald-700 font-semibold">
                    কুপন "{appliedCode}" যুক্ত হয়েছে — ১০% ছাড়!
                  </p>
                )}
              </form>

              <div className="border-t border-slate-100 pt-4 space-y-2.5 text-sm">
                <div className="flex items-center justify-between text-slate-600">
                  <span>সাবটোটাল</span>
                  <span className="font-semibold text-[#1A102E] tabular-nums">
                    {formatTaka(subtotal)}
                  </span>
                </div>
                <div className="flex items-center justify-between text-slate-600">
                  <span>ডেলিভারি চার্জ</span>
                  <span className="font-semibold text-[#1A102E] tabular-nums">
                    {formatTaka(deliveryCharge)}
                  </span>
                </div>
                {discount > 0 && (
                  <div className="flex items-center justify-between text-emerald-700">
                    <span>গোল্ড মেম্বার ছাড়</span>
                    <span className="font-semibold tabular-nums">-{formatTaka(discount)}</span>
                  </div>
                )}

                <div className="border-t border-slate-100 pt-3 flex items-center justify-between">
                  <span className="text-base font-bold text-[#1A102E]">সর্বমোট</span>
                  <span className="text-xl font-extrabold text-[#6D0CE0] tabular-nums">
                    {formatTaka(total)}
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => onProceedToCheckout(discount)}
                className="w-full h-12 rounded-2xl bg-gradient-to-r from-[#5E0AC9] to-[#7E16F0] hover:from-[#5208B2] hover:to-[#6F10DA] active:scale-[0.99] text-white font-bold text-sm flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer"
              >
                <ShieldCheck className="w-5 h-5" />
                <span>চেকআউট করুন</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
