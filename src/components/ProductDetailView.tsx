import { useState } from 'react';
import {
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  Heart,
  Share2,
  ShoppingCart,
  Star,
} from 'lucide-react';
import { Product } from '../types/shop';
import { formatTaka, toBanglaDigits } from '../utils/format';

interface ProductDetailViewProps {
  product: Product;
  isWishlisted: boolean;
  onToggleWishlist: (productId: string) => void;
  onAddToCart: (product: Product, size: string) => void;
  onBuyNow: (product: Product, size: string) => void;
  onOpenCart: () => void;
  onBack: () => void;
  onShare: (product: Product) => void;
  onAddReview: (productId: string, rating: number, commentBn: string) => void;
  cartCount: number;
}

export function ProductDetailView({
  product,
  isWishlisted,
  onToggleWishlist,
  onAddToCart,
  onBuyNow,
  onOpenCart,
  onBack,
  onShare,
  onAddReview,
  cartCount,
}: ProductDetailViewProps) {
  const [imageIdx, setImageIdx] = useState(0);
  const [selectedSize, setSelectedSize] = useState(
    product.sizes.includes('M') ? 'M' : product.sizes[0]
  );
  const [reviewText, setReviewText] = useState('');
  const [reviewRating, setReviewRating] = useState(5);

  const images = product.images;
  const totalImages = images.length;

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewText.trim()) return;
    onAddReview(product.id, reviewRating, reviewText.trim());
    setReviewText('');
  };

  return (
    <div className="max-w-6xl mx-auto px-0 sm:px-6 lg:px-8 sm:py-6 pb-24 sm:pb-10">
      <div className="bg-white sm:rounded-3xl sm:border sm:border-[#EAE4F5] sm:shadow-sm overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-12">
          {/* Left: Product Image Gallery matching Screenshot #4 */}
          <div className="lg:col-span-6 relative bg-[#F5F2FA]">
            {/* Floating Top Icons (Back, Heart, Share) */}
            <div className="absolute top-3.5 left-3.5 right-3.5 z-10 flex items-center justify-between">
              <button
                type="button"
                onClick={onBack}
                aria-label="পিছনে যান"
                className="w-10 h-10 rounded-full bg-white/90 hover:bg-white text-[#1A102E] shadow flex items-center justify-center transition-transform active:scale-95 cursor-pointer"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => onToggleWishlist(product.id)}
                  aria-label="পছন্দের তালিকায় যোগ করুন"
                  className="w-10 h-10 rounded-full bg-white/90 hover:bg-white shadow flex items-center justify-center transition-transform active:scale-95 cursor-pointer"
                >
                  <Heart
                    className={`w-5 h-5 ${
                      isWishlisted ? 'fill-[#E91E63] text-[#E91E63]' : 'text-[#1A102E]'
                    }`}
                  />
                </button>
                <button
                  type="button"
                  onClick={() => onShare(product)}
                  aria-label="শেয়ার করুন"
                  className="w-10 h-10 rounded-full bg-white/90 hover:bg-white text-[#1A102E] shadow flex items-center justify-center transition-transform active:scale-95 cursor-pointer"
                >
                  <Share2 className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Main Image */}
            <div className="relative aspect-[4/4.5] lg:aspect-[4/4.8] w-full overflow-hidden">
              <img
                src={images[imageIdx]}
                alt={`${product.nameBn} ছবি ${toBanglaDigits(imageIdx + 1)}`}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover object-top"
              />

              {totalImages > 1 && (
                <>
                  <button
                    type="button"
                    onClick={() =>
                      setImageIdx((prev) => (prev - 1 + totalImages) % totalImages)
                    }
                    aria-label="আগের ছবি"
                    className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/35 hover:bg-black/55 text-white flex items-center justify-center cursor-pointer"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setImageIdx((prev) => (prev + 1) % totalImages)}
                    aria-label="পরবর্তী ছবি"
                    className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/35 hover:bg-black/55 text-white flex items-center justify-center cursor-pointer"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </>
              )}

              {/* Image Counter 1/5 matching Screenshot #4 */}
              <div className="absolute bottom-3 right-3 px-2.5 py-1 rounded-lg bg-black/60 text-white text-xs font-semibold tabular-nums">
                {toBanglaDigits(imageIdx + 1)}/{toBanglaDigits(totalImages)}
              </div>
            </div>

            {/* Thumbnail Strip */}
            {totalImages > 1 && (
              <div className="flex items-center gap-2 p-3 bg-white border-t border-slate-100 overflow-x-auto no-scrollbar">
                {images.map((img, i) => (
                  <button
                    key={`${product.id}-thumb-${i}`}
                    type="button"
                    onClick={() => setImageIdx(i)}
                    className={`w-14 h-14 rounded-xl overflow-hidden border-2 shrink-0 transition-all cursor-pointer ${
                      i === imageIdx
                        ? 'border-[#6D0CE0] ring-2 ring-purple-200'
                        : 'border-transparent opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img
                      src={img}
                      alt=""
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover object-top"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right: Contiguous Purchase Module matching Screenshot #4 */}
          <div className="lg:col-span-6 p-5 sm:p-7 flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <div>
                <p className="text-xs font-semibold text-[#6D0CE0]">{product.subCategoryBn}</p>
                <h1 className="mt-1 text-xl sm:text-2xl font-bold text-[#1A102E]">
                  {product.nameBn}
                </h1>
              </div>

              {/* Rating & Stock Row */}
              <div className="flex items-center justify-between gap-3 flex-wrap">
                <div className="flex items-center gap-1.5 text-sm">
                  <Star className="w-4 h-4 fill-[#FFC107] text-[#FFC107]" />
                  <span className="font-bold text-[#1A102E] tabular-nums">
                    {toBanglaDigits(product.rating)}
                  </span>
                  <span className="text-slate-500">({product.reviewCountBn})</span>
                </div>

                <span className="px-2.5 py-1 rounded-md bg-emerald-50 text-emerald-700 text-xs font-bold">
                  {product.inStock ? 'স্টকে আছে' : 'স্টক শেষ'}
                </span>
              </div>

              {/* Price & Discount */}
              <div className="flex items-center gap-3 flex-wrap tabular-nums pt-1">
                <span className="text-2xl sm:text-3xl font-extrabold text-[#6D0CE0]">
                  {formatTaka(product.price)}
                </span>
                {product.originalPrice > product.price && (
                  <span className="text-base text-slate-400 line-through">
                    {formatTaka(product.originalPrice)}
                  </span>
                )}
                {product.discountPercent > 0 && (
                  <span className="px-2.5 py-1 rounded-md bg-[#E91E63] text-white text-xs font-bold">
                    {toBanglaDigits(product.discountPercent)}% ছাড়
                  </span>
                )}
              </div>

              {/* Size Selector matching Screenshot #4 */}
              <div className="pt-2">
                <p className="text-sm font-bold text-[#1A102E] mb-2.5">
                  সাইজ নির্বাচন করুন: <span className="text-[#6D0CE0]">{selectedSize}</span>
                </p>
                <div className="grid grid-cols-4 gap-2.5">
                  {product.sizes.map((size) => (
                    <button
                      key={size}
                      type="button"
                      onClick={() => setSelectedSize(size)}
                      className={`min-h-[42px] px-3 py-2 rounded-xl text-sm font-bold border transition-all cursor-pointer ${
                        selectedSize === size
                          ? 'bg-[#6D0CE0] text-white border-[#6D0CE0] shadow-sm'
                          : 'bg-white text-[#1A102E] border-[#E0D7F2] hover:border-[#6D0CE0]'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              {/* Description & Fabric */}
              <div className="pt-2 border-t border-slate-100 space-y-2">
                <h2 className="text-sm font-bold text-[#1A102E]">পণ্যের বিবরণ</h2>
                <p className="text-sm text-slate-600 leading-relaxed">{product.descriptionBn}</p>
                <p className="text-xs text-slate-500">
                  <span className="font-semibold text-[#1A102E]">ফ্যাব্রিক:</span> {product.fabricBn}
                </p>
              </div>
            </div>

            {/* Bottom Action Bar matching Screenshot #4 */}
            <div className="pt-4 border-t border-slate-100 flex items-center gap-3">
              <button
                type="button"
                onClick={onOpenCart}
                aria-label="কার্ট দেখুন"
                className="relative w-12 h-12 rounded-xl border border-[#DDD4F0] bg-[#FAF7FF] hover:bg-[#F1E8FF] text-[#1A102E] flex items-center justify-center shrink-0 transition-colors cursor-pointer"
              >
                <ShoppingCart className="w-5 h-5" />
                {cartCount > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 min-w-[18px] h-[18px] px-1 rounded-full bg-[#FF2E7E] text-white text-[10px] font-bold flex items-center justify-center tabular-nums">
                    {toBanglaDigits(cartCount)}
                  </span>
                )}
              </button>

              <button
                type="button"
                onClick={() => onAddToCart(product, selectedSize)}
                className="flex-1 h-12 px-4 rounded-xl bg-gradient-to-r from-[#5E0AC9] to-[#7E16F0] hover:from-[#5208B2] hover:to-[#6F10DA] active:scale-[0.99] text-white font-bold text-sm flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer whitespace-nowrap"
              >
                <ShoppingCart className="w-4 h-4" />
                <span>কার্টে যোগ করুন</span>
              </button>

              <button
                type="button"
                onClick={() => onBuyNow(product, selectedSize)}
                className="hidden sm:flex h-12 px-5 rounded-xl bg-[#FFD13B] hover:bg-[#FFC400] text-[#1A102E] font-bold text-sm items-center justify-center transition-colors cursor-pointer whitespace-nowrap"
              >
                এখনই কিনুন
              </button>
            </div>
          </div>
        </div>

        {/* Customer Reviews Section */}
        <div className="border-t border-[#EAE4F5] p-5 sm:p-7 bg-[#FCFAFF]">
          <h2 className="text-base sm:text-lg font-bold text-[#1A102E] mb-4">
            ক্রেতাদের রিভিউ ({toBanglaDigits(product.reviews.length)})
          </h2>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-7 space-y-3">
              {product.reviews.length === 0 ? (
                <p className="text-sm text-slate-500">
                  এখনো কোনো রিভিউ নেই। প্রথম রিভিউটি আপনিই দিন!
                </p>
              ) : (
                product.reviews.map((rev) => (
                  <div
                    key={rev.id}
                    className="bg-white rounded-2xl p-4 border border-[#EAE4F5]"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-sm font-bold text-[#1A102E]">{rev.authorBn}</span>
                      <span className="text-xs text-slate-400">{rev.dateBn}</span>
                    </div>
                    <div className="flex items-center gap-0.5 mt-1">
                      {Array.from({ length: rev.rating }).map((_, idx) => (
                        <Star
                          key={idx}
                          className="w-3.5 h-3.5 fill-[#FFC107] text-[#FFC107]"
                        />
                      ))}
                    </div>
                    <p className="mt-2 text-sm text-slate-600">{rev.commentBn}</p>
                  </div>
                ))
              )}
            </div>

            <form
              onSubmit={handleReviewSubmit}
              className="lg:col-span-5 bg-white rounded-2xl p-4 border border-[#EAE4F5] space-y-3 h-fit"
            >
              <h3 className="text-sm font-bold text-[#1A102E]">আপনার রিভিউ লিখুন</h3>
              <div className="flex items-center gap-1.5">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setReviewRating(star)}
                    aria-label={`${toBanglaDigits(star)} স্টার`}
                    className="p-1 cursor-pointer"
                  >
                    <Star
                      className={`w-5 h-5 ${
                        star <= reviewRating
                          ? 'fill-[#FFC107] text-[#FFC107]'
                          : 'text-slate-300'
                      }`}
                    />
                  </button>
                ))}
              </div>
              <textarea
                rows={3}
                value={reviewText}
                onChange={(e) => setReviewText(e.target.value)}
                placeholder="পণ্যটি সম্পর্কে আপনার মতামত লিখুন..."
                className="w-full rounded-xl border border-[#DDD4F0] p-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#6D0CE0]"
              />
              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-[#6D0CE0] hover:bg-[#5B08BE] text-white text-sm font-semibold transition-colors cursor-pointer"
              >
                রিভিউ জমা দিন
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
