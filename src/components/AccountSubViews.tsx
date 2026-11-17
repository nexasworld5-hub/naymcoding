import { useState } from 'react';
import {
  ArrowLeft,
  Check,
  Copy,
  CreditCard,
  Crown,
  Gift,
  HelpCircle,
  Info,
  MapPin,
  Package,
  Plus,
  Trash2,
} from 'lucide-react';
import {
  Address,
  Order,
  PaymentMethod,
  ScreenView,
  UserProfile,
} from '../types/shop';
import { formatTaka, toBanglaDigits } from '../utils/format';

interface AccountSubViewsProps {
  screen: Exclude<
    ScreenView,
    'home' | 'categories' | 'product' | 'cart' | 'wishlist' | 'account' | 'checkout'
  >;
  user: UserProfile;
  orders: Order[];
  addresses: Address[];
  payments: PaymentMethod[];
  onBack: () => void;
  onUpdateUser: (updated: UserProfile) => void;
  onAddAddress: (addr: Omit<Address, 'id'>) => void;
  onDeleteAddress: (id: string) => void;
  onSetDefaultAddress: (id: string) => void;
  onSetDefaultPayment: (id: string) => void;
  onShowToast: (msg: string) => void;
}

const TITLES: Record<AccountSubViewsProps['screen'], string> = {
  orders: 'আমার অর্ডারসমূহ',
  addresses: 'আমার ঠিকানা',
  payments: 'পেমেন্ট পদ্ধতি',
  refer: 'রেফার করুন ও আয় করুন',
  support: 'সহায়তা ও সাপোর্ট',
  about: 'আমাদের সম্পর্কে',
  settings: 'অ্যাকাউন্ট সেটিংস',
  'gold-member': 'গোল্ড মেম্বারশিপ',
};

export function AccountSubViews({
  screen,
  user,
  orders,
  addresses,
  payments,
  onBack,
  onUpdateUser,
  onAddAddress,
  onDeleteAddress,
  onSetDefaultAddress,
  onSetDefaultPayment,
  onShowToast,
}: AccountSubViewsProps) {
  // Address form state
  const [showAddrForm, setShowAddrForm] = useState(false);
  const [labelBn, setLabelBn] = useState('বাসা');
  const [recipientName, setRecipientName] = useState(user.nameBn);
  const [phone, setPhone] = useState(user.phone);
  const [street, setStreet] = useState('');
  const [city, setCity] = useState('ঢাকা');

  // Settings form state
  const [nameInput, setNameInput] = useState(user.nameBn);
  const [emailInput, setEmailInput] = useState(user.email);
  const [phoneInput, setPhoneInput] = useState(user.phone);

  // Support form state
  const [supportMsg, setSupportMsg] = useState('');
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [copiedCode, setCopiedCode] = useState(false);

  const handleSaveAddress = (e: React.FormEvent) => {
    e.preventDefault();
    if (!street.trim()) return;
    onAddAddress({
      labelBn,
      recipientName,
      phone,
      street: street.trim(),
      city: city.trim(),
      isDefault: addresses.length === 0,
    });
    setStreet('');
    setShowAddrForm(false);
    onShowToast('নতুন ঠিকানা সংরক্ষণ করা হয়েছে!');
  };

  const handleCopyReferral = () => {
    navigator.clipboard?.writeText('NAYEM250').catch(() => {});
    setCopiedCode(true);
    onShowToast('রেফারেল কোড "NAYEM250" কপি করা হয়েছে!');
    window.setTimeout(() => setCopiedCode(false), 2000);
  };

  return (
    <div className="min-h-[75vh] pb-10">
      <div className="bg-gradient-to-r from-[#1A0838] via-[#280B54] to-[#3B107C] text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between">
          <button
            type="button"
            onClick={onBack}
            aria-label="পিছনে যান"
            className="w-10 h-10 -ml-2 rounded-xl flex items-center justify-center hover:bg-white/10 cursor-pointer"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-base sm:text-lg font-bold">{TITLES[screen]}</h1>
          <div className="w-10" />
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-4">
        {screen === 'orders' && (
          <div className="space-y-4">
            {orders.length === 0 ? (
              <div className="bg-white rounded-3xl p-10 text-center border border-[#EAE4F5]">
                <Package className="w-10 h-10 text-[#6D0CE0] mx-auto mb-3" />
                <p className="font-bold text-[#1A102E]">কোনো অর্ডার পাওয়া যায়নি</p>
              </div>
            ) : (
              orders.map((order) => (
                <div
                  key={order.id}
                  className="bg-white rounded-3xl p-5 border border-[#EAE4F5] shadow-xs space-y-3"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-3">
                    <div>
                      <p className="text-sm font-extrabold text-[#1A102E]">
                        অর্ডার #{order.id}
                      </p>
                      <p className="text-xs text-slate-500">{order.dateBn}</p>
                    </div>
                    <span className="px-3 py-1 rounded-md bg-[#F2EAFF] text-[#6D0CE0] text-xs font-bold">
                      {order.statusBn}
                    </span>
                  </div>

                  <div className="space-y-2">
                    {order.items.map((item, idx) => (
                      <div key={idx} className="flex items-center gap-3 text-sm">
                        <img
                          src={item.image}
                          alt={item.nameBn}
                          referrerPolicy="no-referrer"
                          className="w-12 h-12 rounded-xl object-cover object-top bg-slate-100"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-[#1A102E] truncate">{item.nameBn}</p>
                          <p className="text-xs text-slate-500">
                            সাইজ: {item.size} · পরিমাণ: {toBanglaDigits(item.quantity)}
                          </p>
                        </div>
                        <span className="font-bold text-[#1A102E] tabular-nums">
                          {formatTaka(item.price * item.quantity)}
                        </span>
                      </div>
                    ))}
                  </div>

                  <div className="border-t border-slate-100 pt-3 flex flex-wrap items-center justify-between gap-2 text-sm">
                    <span className="text-xs text-slate-500">
                      পেমেন্ট: {order.paymentMethodBn}
                    </span>
                    <span className="font-extrabold text-[#6D0CE0] tabular-nums">
                      সর্বমোট: {formatTaka(order.total)}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {screen === 'addresses' && (
          <div className="space-y-4">
            <div className="flex justify-end">
              <button
                type="button"
                onClick={() => setShowAddrForm((p) => !p)}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#6D0CE0] text-white text-xs sm:text-sm font-bold cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>নতুন ঠিকানা যোগ করুন</span>
              </button>
            </div>

            {showAddrForm && (
              <form
                onSubmit={handleSaveAddress}
                className="bg-white rounded-3xl p-5 border border-[#EAE4F5] space-y-3"
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <input
                    type="text"
                    value={labelBn}
                    onChange={(e) => setLabelBn(e.target.value)}
                    placeholder="ঠিকানার ধরন (যেমন: বাসা / অফিস)"
                    className="h-10 px-3 rounded-xl border border-[#DDD4F0] text-sm"
                  />
                  <input
                    type="text"
                    value={recipientName}
                    onChange={(e) => setRecipientName(e.target.value)}
                    placeholder="প্রাপকের নাম"
                    className="h-10 px-3 rounded-xl border border-[#DDD4F0] text-sm"
                  />
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="মোবাইল নম্বর"
                    className="h-10 px-3 rounded-xl border border-[#DDD4F0] text-sm"
                  />
                  <input
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="শহর"
                    className="h-10 px-3 rounded-xl border border-[#DDD4F0] text-sm"
                  />
                </div>
                <input
                  type="text"
                  value={street}
                  onChange={(e) => setStreet(e.target.value)}
                  placeholder="বাড়ি নং, রোড নং, এলাকা"
                  className="w-full h-10 px-3 rounded-xl border border-[#DDD4F0] text-sm"
                />
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-[#6D0CE0] text-white text-sm font-bold cursor-pointer"
                >
                  সংরক্ষণ করুন
                </button>
              </form>
            )}

            {addresses.map((addr) => (
              <div
                key={addr.id}
                className="bg-white rounded-2xl p-4 border border-[#EAE4F5] flex items-start justify-between gap-3"
              >
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#F5F0FF] text-[#6D0CE0] flex items-center justify-center shrink-0">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div className="text-sm">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-[#1A102E]">{addr.labelBn}</span>
                      {addr.isDefault && (
                        <span className="text-xs font-bold text-emerald-700">· ডিফল্ট</span>
                      )}
                    </div>
                    <p className="text-slate-700 mt-0.5">
                      {addr.recipientName} · {addr.phone}
                    </p>
                    <p className="text-slate-500 text-xs mt-0.5">
                      {addr.street}, {addr.city}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {!addr.isDefault && (
                    <button
                      type="button"
                      onClick={() => onSetDefaultAddress(addr.id)}
                      className="text-xs font-semibold text-[#6D0CE0] hover:underline cursor-pointer"
                    >
                      ডিফল্ট করুন
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => onDeleteAddress(addr.id)}
                    aria-label="ঠিকানা মুছুন"
                    className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-red-600 cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {screen === 'payments' && (
          <div className="space-y-3">
            {payments.map((pay) => (
              <div
                key={pay.id}
                className="bg-white rounded-2xl p-4 border border-[#EAE4F5] flex items-center justify-between gap-3"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#F5F0FF] text-[#6D0CE0] flex items-center justify-center">
                    <CreditCard className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-[#1A102E]">{pay.typeBn}</p>
                    <p className="text-xs text-slate-500">{pay.accountMasked}</p>
                  </div>
                </div>

                {pay.isDefault ? (
                  <span className="text-xs font-bold text-emerald-700">ডিফল্ট</span>
                ) : (
                  <button
                    type="button"
                    onClick={() => onSetDefaultPayment(pay.id)}
                    className="px-3 py-1.5 rounded-xl bg-[#F5F0FF] text-[#6D0CE0] text-xs font-bold cursor-pointer"
                  >
                    ডিফল্ট করুন
                  </button>
                )}
              </div>
            ))}
          </div>
        )}

        {screen === 'refer' && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#EAE4F5] text-center space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-[#F5F0FF] text-[#6D0CE0] flex items-center justify-center mx-auto">
              <Gift className="w-7 h-7" />
            </div>
            <h2 className="text-xl font-extrabold text-[#1A102E]">
              বন্ধুদের আমন্ত্রণ জানান, ৳ ২৫০ বোনাস পান!
            </h2>
            <p className="text-sm text-slate-600 max-w-md mx-auto">
              আপনার রেফারেল কোড ব্যবহার করে কেউ প্রথম অর্ডার করলেই আপনি এবং আপনার বন্ধু উভয়েই
              পাবেন ৳ ২৫০ ডিসকাউন্ট ভাউচার।
            </p>
            <div className="inline-flex items-center gap-3 px-5 py-3 rounded-2xl bg-[#FAF6FF] border border-dashed border-[#6D0CE0]">
              <span className="font-display font-extrabold text-lg tracking-wider text-[#6D0CE0]">
                NAYEM250
              </span>
              <button
                type="button"
                onClick={handleCopyReferral}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#6D0CE0] text-white text-xs font-bold cursor-pointer"
              >
                {copiedCode ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedCode ? 'কপি হয়েছে' : 'কপি করুন'}</span>
              </button>
            </div>
          </div>
        )}

        {screen === 'gold-member' && (
          <div className="bg-white rounded-3xl p-6 border border-[#EAE4F5] space-y-5">
            <div className="p-5 rounded-2xl bg-gradient-to-r from-[#FCEEB5] via-[#FAE08A] to-[#F6CE5B] text-[#3B2600] flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <Crown className="w-8 h-8 text-[#B57200]" />
                <div>
                  <h2 className="text-lg font-extrabold">স্টাইলওয়্যার গোল্ড মেম্বার</h2>
                  <p className="text-xs font-semibold">
                    আপনার বর্তমান পয়েন্ট: {toBanglaDigits(user.points)} পয়েন্ট
                  </p>
                </div>
              </div>
              <span className="text-xs font-extrabold bg-white/70 px-3 py-1.5 rounded-xl">
                কোড: GOLD10
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm">
              <div className="p-4 rounded-2xl bg-[#FAF7FF] border border-[#EAE4F5]">
                <p className="font-bold text-[#1A102E]">অতিরিক্ত ১০% ছাড়</p>
                <p className="text-xs text-slate-500 mt-1">
                  কার্টে GOLD10 কোড ব্যবহার করে যেকোনো অর্ডারে ১০% ছাড় পান।
                </p>
              </div>
              <div className="p-4 rounded-2xl bg-[#FAF7FF] border border-[#EAE4F5]">
                <p className="font-bold text-[#1A102E]">অগ্রাধিকার ডেলিভারি</p>
                <p className="text-xs text-slate-500 mt-1">
                  ঢাকার ভেতরে ২৪ ঘণ্টার মধ্যে এক্সপ্রেস ডেলিভারি সুবিধা।
                </p>
              </div>
              <div className="p-4 rounded-2xl bg-[#FAF7FF] border border-[#EAE4F5]">
                <p className="font-bold text-[#1A102E]">সহজ রিটার্ন</p>
                <p className="text-xs text-slate-500 mt-1">
                  ৭ দিনের মধ্যে সম্পূর্ণ ঝামেলামুক্ত সাইজ এক্সচেঞ্জ।
                </p>
              </div>
            </div>
          </div>
        )}

        {screen === 'support' && (
          <div className="space-y-5">
            <div className="bg-white rounded-3xl p-5 border border-[#EAE4F5] space-y-3">
              <h2 className="text-base font-bold text-[#1A102E] flex items-center gap-2">
                <HelpCircle className="w-4 h-4 text-[#6D0CE0]" />
                <span>সচরাচর জিজ্ঞাসিত প্রশ্ন (FAQ)</span>
              </h2>
              {[
                {
                  q: 'ডেলিভারি পেতে কতদিন সময় লাগে?',
                  a: 'ঢাকার ভেতরে ১–২ কার্যদিবস এবং ঢাকার বাইরে ২–৪ কার্যদিবসের মধ্যে ডেলিভারি সম্পন্ন হয়।',
                },
                {
                  q: 'পণ্য পছন্দ না হলে বা সাইজ না মিললে কি পরিবর্তন করা যাবে?',
                  a: 'হ্যাঁ, পণ্য হাতে পাওয়ার ৭ দিনের মধ্যে ইনভয়েসসহ সহজ এক্সচেঞ্জ বা রিটার্ন সুবিধা রয়েছে।',
                },
                {
                  q: 'ক্যাশ অন ডেলিভারি সুবিধা আছে কি?',
                  a: 'জ্বি, বাংলাদেশের যেকোনো প্রান্তে ক্যাশ অন ডেলিভারি এবং বিকাশ/নগদ পেমেন্ট চালু রয়েছে।',
                },
              ].map((faq, idx) => (
                <div key={idx} className="border border-slate-100 rounded-2xl overflow-hidden">
                  <button
                    type="button"
                    onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                    className="w-full text-left p-3.5 font-semibold text-sm text-[#1A102E] flex items-center justify-between cursor-pointer hover:bg-[#FAF7FF]"
                  >
                    <span>{faq.q}</span>
                    <span>{openFaq === idx ? '−' : '+'}</span>
                  </button>
                  {openFaq === idx && (
                    <p className="px-3.5 pb-3.5 text-xs sm:text-sm text-slate-600">{faq.a}</p>
                  )}
                </div>
              ))}
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (!supportMsg.trim()) return;
                setSupportMsg('');
                onShowToast('আপনার বার্তা সাপোর্ট টিমে পাঠানো হয়েছে!');
              }}
              className="bg-white rounded-3xl p-5 border border-[#EAE4F5] space-y-3"
            >
              <h3 className="text-sm font-bold text-[#1A102E]">সরাসরি মেসেজ পাঠান</h3>
              <textarea
                rows={3}
                value={supportMsg}
                onChange={(e) => setSupportMsg(e.target.value)}
                placeholder="আপনার সমস্যা বা প্রশ্নটি বিস্তারিত লিখুন..."
                className="w-full rounded-xl border border-[#DDD4F0] p-3 text-sm"
              />
              <button
                type="submit"
                className="px-5 py-2.5 rounded-xl bg-[#6D0CE0] text-white text-sm font-bold cursor-pointer"
              >
                বার্তা পাঠান
              </button>
            </form>
          </div>
        )}

        {screen === 'about' && (
          <div className="bg-white rounded-3xl p-6 border border-[#EAE4F5] space-y-3">
            <div className="flex items-center gap-2 text-[#6D0CE0] font-bold">
              <Info className="w-5 h-5" />
              <h2>স্টাইলওয়্যার ফ্যাশন শপ (StyleWear)</h2>
            </div>
            <p className="text-sm text-slate-600 leading-relaxed">
              স্টাইলওয়্যার বাংলাদেশের অন্যতম আধুনিক অনলাইন ফ্যাশন প্ল্যাটফর্ম। আমরা নারী, পুরুষ
              ও শিশুদের জন্য ট্রেন্ডি এবং মানসম্মত পোশাক, জুতা ও এক্সেসরিজ সাশ্রয়ী মূল্যে
              সরাসরি আপনার দোরগোড়ায় পৌঁছে দিই।
            </p>
            <p className="text-xs text-slate-500">
              হটলাইন: ০৯৬১২-০০০০০০ · ইমেইল: support@stylewear.com.bd · ঢাকা, বাংলাদেশ
            </p>
          </div>
        )}

        {screen === 'settings' && (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              onUpdateUser({
                ...user,
                nameBn: nameInput.trim() || user.nameBn,
                email: emailInput.trim() || user.email,
                phone: phoneInput.trim() || user.phone,
              });
              onShowToast('প্রোফাইল তথ্য আপডেট করা হয়েছে!');
            }}
            className="bg-white rounded-3xl p-5 border border-[#EAE4F5] space-y-4"
          >
            <h2 className="text-base font-bold text-[#1A102E]">প্রোফাইল তথ্য পরিবর্তন</h2>
            <div className="space-y-3">
              <div>
                <label className="text-xs font-semibold text-slate-600 block mb-1">নাম</label>
                <input
                  type="text"
                  value={nameInput}
                  onChange={(e) => setNameInput(e.target.value)}
                  className="w-full h-10 px-3 rounded-xl border border-[#DDD4F0] text-sm"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-600 block mb-1">ইমেইল</label>
                <input
                  type="email"
                  value={emailInput}
                  onChange={(e) => setEmailInput(e.target.value)}
                  className="w-full h-10 px-3 rounded-xl border border-[#DDD4F0] text-sm"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-600 block mb-1">মোবাইল</label>
                <input
                  type="tel"
                  value={phoneInput}
                  onChange={(e) => setPhoneInput(e.target.value)}
                  className="w-full h-10 px-3 rounded-xl border border-[#DDD4F0] text-sm"
                />
              </div>
            </div>

            <div className="pt-2 border-t border-slate-100 space-y-2.5 text-sm">
              <label className="flex items-center justify-between cursor-pointer">
                <span>অর্ডার পুশ নোটিফিকেশন</span>
                <input
                  type="checkbox"
                  checked={user.pushNotifications}
                  onChange={(e) =>
                    onUpdateUser({ ...user, pushNotifications: e.target.checked })
                  }
                  className="w-4 h-4 accent-[#6D0CE0]"
                />
              </label>
              <label className="flex items-center justify-between cursor-pointer">
                <span>অফার ও ডিসকাউন্ট অ্যালার্ট</span>
                <input
                  type="checkbox"
                  checked={user.promoAlerts}
                  onChange={(e) => onUpdateUser({ ...user, promoAlerts: e.target.checked })}
                  className="w-4 h-4 accent-[#6D0CE0]"
                />
              </label>
            </div>

            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-[#6D0CE0] text-white text-sm font-bold cursor-pointer"
            >
              সেভ করুন
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
