import { useState } from 'react';
import {
  ArrowLeft,
  CheckCircle2,
  CreditCard,
  MapPin,
  ShieldCheck,
  Truck,
} from 'lucide-react';
import { Address, CartItem, Order } from '../types/shop';
import { formatTaka, toBanglaDigits } from '../utils/format';

interface CheckoutViewProps {
  cart: CartItem[];
  addresses: Address[];
  promoDiscount: number;
  onPlaceOrder: (payload: {
    addressSummary: string;
    paymentMethodBn: string;
    discount: number;
  }) => Order;
  onBack: () => void;
  onViewOrders: () => void;
  onContinueShopping: () => void;
}

const PAYMENT_OPTIONS = [
  { id: 'bkash', labelBn: 'বিকাশ (bKash)', descBn: 'দ্রুত মোবাইল পেমেন্ট' },
  { id: 'nagad', labelBn: 'নগদ (Nagad)', descBn: 'তাৎক্ষণিক ওয়ালেট পেমেন্ট' },
  { id: 'card', labelBn: 'ডেবিট / ক্রেডিট কার্ড', descBn: 'ভিসা ও মাস্টারকার্ড' },
  { id: 'cod', labelBn: 'ক্যাশ অন ডেলিভারি', descBn: 'পণ্য হাতে পেয়ে মূল্য পরিশোধ' },
];

export function CheckoutView({
  cart,
  addresses,
  promoDiscount,
  onPlaceOrder,
  onBack,
  onViewOrders,
  onContinueShopping,
}: CheckoutViewProps) {
  const defaultAddr = addresses.find((a) => a.isDefault) || addresses[0];
  const [selectedAddressId, setSelectedAddressId] = useState(defaultAddr?.id || 'custom');
  const [customName, setCustomName] = useState('');
  const [customPhone, setCustomPhone] = useState('');
  const [customStreet, setCustomStreet] = useState('');
  const [paymentMethod, setPaymentMethod] = useState(PAYMENT_OPTIONS[0].labelBn);
  const [confirmedOrder, setConfirmedOrder] = useState<Order | null>(null);
  const [errorMsg, setErrorMsg] = useState('');

  const subtotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const deliveryCharge = cart.length > 0 ? 70 : 0;
  const total = subtotal + deliveryCharge - promoDiscount;

  const handleConfirm = (e: React.FormEvent) => {
    e.preventDefault();
    let addressSummary = '';
    if (selectedAddressId === 'custom') {
      if (!customName.trim() || !customPhone.trim() || !customStreet.trim()) {
        setErrorMsg('অনুগ্রহ করে নাম, মোবাইল নম্বর এবং ঠিকানা সঠিকভাবে লিখুন।');
        return;
      }
      addressSummary = `${customName.trim()} (${customPhone.trim()}), ${customStreet.trim()}`;
    } else {
      const addr = addresses.find((a) => a.id === selectedAddressId);
      if (!addr) {
        setErrorMsg('একটি ডেলিভারি ঠিকানা নির্বাচন করুন।');
        return;
      }
      addressSummary = `${addr.recipientName} (${addr.phone}), ${addr.street}, ${addr.city}`;
    }

    setErrorMsg('');
    const order = onPlaceOrder({
      addressSummary,
      paymentMethodBn: paymentMethod,
      discount: promoDiscount,
    });
    setConfirmedOrder(order);
  };

  if (confirmedOrder) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-10">
        <div className="bg-white rounded-3xl p-7 sm:p-9 border border-[#EAE4F5] shadow-sm text-center space-y-4">
          <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-10 h-10" />
          </div>
          <h1 className="text-2xl font-extrabold text-[#1A102E]">
            অর্ডার সফলভাবে সম্পন্ন হয়েছে!
          </h1>
          <p className="text-sm text-slate-600">
            ধন্যবাদ! আপনার অর্ডার নম্বর{' '}
            <span className="font-bold text-[#6D0CE0]">#{confirmedOrder.id}</span> নিশ্চিত করা
            হয়েছে।
          </p>

          <div className="bg-[#FAF7FF] rounded-2xl p-4 text-left text-sm space-y-2 border border-[#EAE4F5]">
            <div className="flex justify-between">
              <span className="text-slate-500">মোট মূল্য</span>
              <span className="font-bold text-[#6D0CE0] tabular-nums">
                {formatTaka(confirmedOrder.total)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">পেমেন্ট পদ্ধতি</span>
              <span className="font-semibold text-[#1A102E]">
                {confirmedOrder.paymentMethodBn}
              </span>
            </div>
            <div className="pt-1 border-t border-purple-100">
              <span className="text-slate-500 block text-xs">ডেলিভারি ঠিকানা</span>
              <span className="font-medium text-[#1A102E]">{confirmedOrder.addressSummary}</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <button
              type="button"
              onClick={onViewOrders}
              className="flex-1 h-11 rounded-2xl bg-[#6D0CE0] hover:bg-[#5B08BE] text-white font-bold text-sm cursor-pointer"
            >
              আমার অর্ডার দেখুন
            </button>
            <button
              type="button"
              onClick={onContinueShopping}
              className="flex-1 h-11 rounded-2xl bg-[#F4EEFF] hover:bg-[#E7D8FF] text-[#6D0CE0] font-bold text-sm cursor-pointer"
            >
              আরও শপিং করুন
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[75vh] pb-10">
      <div className="bg-gradient-to-r from-[#1A0838] via-[#280B54] to-[#3B107C] text-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between">
          <button
            type="button"
            onClick={onBack}
            aria-label="পিছনে যান"
            className="w-10 h-10 -ml-2 rounded-xl flex items-center justify-center hover:bg-white/10 cursor-pointer"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-base sm:text-lg font-bold">চেকআউট ও পেমেন্ট</h1>
          <div className="w-10" />
        </div>
      </div>

      <form
        onSubmit={handleConfirm}
        className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6 grid grid-cols-1 lg:grid-cols-12 gap-6"
      >
        <div className="lg:col-span-7 space-y-5">
          {/* Delivery Address */}
          <div className="bg-white rounded-3xl p-5 border border-[#EAE4F5] space-y-3">
            <h2 className="text-base font-bold text-[#1A102E] flex items-center gap-2">
              <MapPin className="w-4 h-4 text-[#6D0CE0]" />
              <span>ডেলিভারি ঠিকানা নির্বাচন করুন</span>
            </h2>

            <div className="space-y-2.5">
              {addresses.map((addr) => (
                <label
                  key={addr.id}
                  className={`block p-3.5 rounded-2xl border cursor-pointer transition-all ${
                    selectedAddressId === addr.id
                      ? 'border-[#6D0CE0] bg-[#FAF6FF]'
                      : 'border-slate-200 hover:border-purple-200'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <input
                      type="radio"
                      name="address"
                      checked={selectedAddressId === addr.id}
                      onChange={() => setSelectedAddressId(addr.id)}
                      className="mt-1 accent-[#6D0CE0]"
                    />
                    <div className="text-sm">
                      <p className="font-bold text-[#1A102E]">
                        {addr.labelBn} — {addr.recipientName}
                      </p>
                      <p className="text-slate-600 text-xs mt-0.5">{addr.phone}</p>
                      <p className="text-slate-600 text-xs mt-0.5">
                        {addr.street}, {addr.city}
                      </p>
                    </div>
                  </div>
                </label>
              ))}

              <label
                className={`block p-3.5 rounded-2xl border cursor-pointer transition-all ${
                  selectedAddressId === 'custom'
                    ? 'border-[#6D0CE0] bg-[#FAF6FF]'
                    : 'border-slate-200 hover:border-purple-200'
                }`}
              >
                <div className="flex items-center gap-3">
                  <input
                    type="radio"
                    name="address"
                    checked={selectedAddressId === 'custom'}
                    onChange={() => setSelectedAddressId('custom')}
                    className="accent-[#6D0CE0]"
                  />
                  <span className="text-sm font-bold text-[#1A102E]">নতুন ঠিকানায় ডেলিভারি নিন</span>
                </div>

                {selectedAddressId === 'custom' && (
                  <div className="mt-3 space-y-2.5 pl-6">
                    <input
                      type="text"
                      value={customName}
                      onChange={(e) => setCustomName(e.target.value)}
                      placeholder="আপনার পূর্ণ নাম"
                      className="w-full h-10 px-3 rounded-xl border border-[#DDD4F0] bg-white text-sm"
                    />
                    <input
                      type="tel"
                      value={customPhone}
                      onChange={(e) => setCustomPhone(e.target.value)}
                      placeholder="মোবাইল নম্বর (যেমন: ০১৭১২-৩৪৫৬৭৮)"
                      className="w-full h-10 px-3 rounded-xl border border-[#DDD4F0] bg-white text-sm"
                    />
                    <input
                      type="text"
                      value={customStreet}
                      onChange={(e) => setCustomStreet(e.target.value)}
                      placeholder="বিস্তারিত ঠিকানা (বাড়ি, রোড, এলাকা, শহর)"
                      className="w-full h-10 px-3 rounded-xl border border-[#DDD4F0] bg-white text-sm"
                    />
                  </div>
                )}
              </label>
            </div>
          </div>

          {/* Payment Methods */}
          <div className="bg-white rounded-3xl p-5 border border-[#EAE4F5] space-y-3">
            <h2 className="text-base font-bold text-[#1A102E] flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-[#6D0CE0]" />
              <span>পেমেন্ট পদ্ধতি</span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {PAYMENT_OPTIONS.map((opt) => (
                <label
                  key={opt.id}
                  className={`p-3.5 rounded-2xl border cursor-pointer transition-all flex items-start gap-2.5 ${
                    paymentMethod === opt.labelBn
                      ? 'border-[#6D0CE0] bg-[#FAF6FF]'
                      : 'border-slate-200 hover:border-purple-200'
                  }`}
                >
                  <input
                    type="radio"
                    name="payment"
                    checked={paymentMethod === opt.labelBn}
                    onChange={() => setPaymentMethod(opt.labelBn)}
                    className="mt-1 accent-[#6D0CE0]"
                  />
                  <div>
                    <p className="text-sm font-bold text-[#1A102E]">{opt.labelBn}</p>
                    <p className="text-xs text-slate-500">{opt.descBn}</p>
                  </div>
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* Summary */}
        <div className="lg:col-span-5 bg-white rounded-3xl p-5 border border-[#EAE4F5] space-y-4 h-fit">
          <h2 className="text-base font-bold text-[#1A102E] flex items-center gap-2">
            <Truck className="w-4 h-4 text-[#6D0CE0]" />
            <span>অর্ডার সারসংক্ষেপ ({toBanglaDigits(cart.length)}টি আইটেম)</span>
          </h2>

          <div className="divide-y divide-slate-100 max-h-60 overflow-y-auto">
            {cart.map((item) => (
              <div key={item.id} className="py-2.5 flex items-center justify-between gap-3 text-sm">
                <div className="min-w-0">
                  <p className="font-semibold text-[#1A102E] truncate">{item.product.nameBn}</p>
                  <p className="text-xs text-slate-500">
                    সাইজ: {item.size} · পরিমাণ: {toBanglaDigits(item.quantity)}
                  </p>
                </div>
                <span className="font-bold text-[#1A102E] tabular-nums shrink-0">
                  {formatTaka(item.product.price * item.quantity)}
                </span>
              </div>
            ))}
          </div>

          <div className="border-t border-slate-100 pt-3 space-y-2 text-sm">
            <div className="flex justify-between text-slate-600">
              <span>সাবটোটাল</span>
              <span className="tabular-nums font-semibold">{formatTaka(subtotal)}</span>
            </div>
            <div className="flex justify-between text-slate-600">
              <span>ডেলিভারি চার্জ</span>
              <span className="tabular-nums font-semibold">{formatTaka(deliveryCharge)}</span>
            </div>
            {promoDiscount > 0 && (
              <div className="flex justify-between text-emerald-700">
                <span>কুপন ছাড়</span>
                <span className="tabular-nums font-semibold">-{formatTaka(promoDiscount)}</span>
              </div>
            )}
            <div className="border-t border-slate-100 pt-2.5 flex justify-between text-base font-extrabold text-[#1A102E]">
              <span>সর্বমোট পরিশোধযোগ্য</span>
              <span className="text-[#6D0CE0] tabular-nums">{formatTaka(total)}</span>
            </div>
          </div>

          {errorMsg && <p className="text-xs font-semibold text-red-600">{errorMsg}</p>}

          <button
            type="submit"
            className="w-full h-12 rounded-2xl bg-gradient-to-r from-[#5E0AC9] to-[#7E16F0] hover:from-[#5208B2] hover:to-[#6F10DA] text-white font-bold text-sm flex items-center justify-center gap-2 shadow-md cursor-pointer"
          >
            <ShieldCheck className="w-5 h-5" />
            <span>অর্ডার নিশ্চিত করুন</span>
          </button>
        </div>
      </form>
    </div>
  );
}
