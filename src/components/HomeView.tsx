import { useState, useEffect } from 'react';
import {
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Flame,
  Footprints,
  LayoutGrid,
  Shirt,
  ShoppingBag,
  Watch,
} from 'lucide-react';
import { CATEGORY_TILES, HERO_SLIDES } from '../data/catalog';
import { CategoryId, Product } from '../types/shop';
import { toBanglaDigits } from '../utils/format';
import { ProductCard } from './ProductCard';

interface HomeViewProps {
  products: Product[];
  searchQuery: string;
  onClearSearch: () => void;
  wishlistIds: string[];
  onToggleWishlist: (productId: string) => void;
  onAddToCart: (product: Product, size?: string) => void;
  onSelectProduct: (product: Product) => void;
  onSelectCategory: (category: CategoryId) => void;
}

function CategoryGlyph({ id, className }: { id: CategoryId; className?: string }) {
  switch (id) {
    case 'men':
      return <Shirt className={className} />;
    case 'women':
      return (
        <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
          <path d="M9 3h6l-1.2 4.2L17.5 19a1 1 0 0 1-.96 1.28H7.46A1 1 0 0 1 6.5 19l3.7-11.8L9 3Z" />
        </svg>
      );
    case 'shoes':
      return <Footprints className={className} />;
    case 'bags':
      return <ShoppingBag className={className} />;
    case 'kids':
      return <Shirt className={className} />;
    case 'accessories':
      return <Watch className={className} />;
    case 'trending':
      return <Flame className={className} />;
    case 'more':
    default:
      return <LayoutGrid className={className} />;
  }
}

export function HomeView({
  products,
  searchQuery,
  onClearSearch,
  wishlistIds,
  onToggleWishlist,
  onAddToCart,
  onSelectProduct,
  onSelectCategory,
}: HomeViewProps) {
  const [slideIdx, setSlideIdx] = useState(0);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setSlideIdx((prev) => (prev + 1) % HERO_SLIDES.length);
    }, 5500);
    return () => window.clearInterval(timer);
  }, []);

  const currentSlide = HERO_SLIDES[slideIdx];
  const hotDeals = products.filter((p) => p.isHotDeal).slice(0, 4);
  const featuredProducts = products.slice(0, 8);

  const normalizedQuery = searchQuery.trim().toLowerCase();
  const searchResults = normalizedQuery
    ? products.filter(
        (p) =>
          p.nameBn.toLowerCase().includes(normalizedQuery) ||
          p.subCategoryBn.toLowerCase().includes(normalizedQuery) ||
          p.descriptionBn.toLowerCase().includes(normalizedQuery)
      )
    : [];

  if (normalizedQuery) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-5">
        <div className="flex items-center justify-between gap-4">
          <h2 className="text-lg sm:text-xl font-bold text-[#1A102E]">
            "{searchQuery}" এর জন্য ফলাফল ({toBanglaDigits(searchResults.length)})
          </h2>
          <button
            type="button"
            onClick={onClearSearch}
            className="text-sm font-semibold text-[#6D0CE0] hover:underline cursor-pointer"
          >
            সব দেখুন
          </button>
        </div>

        {searchResults.length === 0 ? (
          <div className="bg-white rounded-3xl p-10 text-center border border-[#EAE4F5]">
            <p className="text-base font-semibold text-[#1A102E]">
              দুঃখিত, কোনো পণ্য পাওয়া যায়নি
            </p>
            <p className="text-sm text-slate-500 mt-1">
              অনুগ্রহ করে ড্রেস, কুর্তি, হুডি, জুতা অথবা শাড়ি লিখে আবার খুঁজুন।
            </p>
            <button
              type="button"
              onClick={onClearSearch}
              className="mt-4 px-5 py-2.5 rounded-xl bg-[#6D0CE0] text-white text-sm font-semibold cursor-pointer"
            >
              হোমে ফিরে যান
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3.5 sm:gap-5">
            {searchResults.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                isWishlisted={wishlistIds.includes(product.id)}
                onToggleWishlist={onToggleWishlist}
                onAddToCart={onAddToCart}
                onSelectProduct={onSelectProduct}
              />
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 space-y-7 sm:space-y-9">
      {/* Hero Banner Carousel matching Screenshot #2 */}
      <section aria-label="প্রমোশনাল ব্যানার">
        <div
          className={`relative rounded-3xl overflow-hidden bg-gradient-to-r ${currentSlide.accentGradient} text-white shadow-lg`}
        >
          <div className="grid grid-cols-12 items-center min-h-[195px] sm:min-h-[260px] lg:min-h-[300px]">
            {/* Left Copy */}
            <div className="col-span-7 sm:col-span-6 p-5 sm:p-8 lg:p-12 z-10 flex flex-col items-start">
              <span className="text-[11px] sm:text-xs font-semibold text-purple-200 tracking-wide">
                {currentSlide.badgeBn}
              </span>
              <h1 className="mt-1 text-2xl sm:text-4xl lg:text-5xl font-extrabold leading-tight tracking-tight text-balance">
                {currentSlide.titleBn}
              </h1>
              <div className="mt-1.5 sm:mt-2 flex items-baseline gap-2">
                <span className="text-xs sm:text-base font-medium text-purple-100">
                  {currentSlide.subtitleBn}
                </span>
                <span className="text-xl sm:text-3xl lg:text-4xl font-extrabold text-[#FFD13B]">
                  {currentSlide.highlightBn}
                </span>
              </div>

              <button
                type="button"
                onClick={() => onSelectCategory(currentSlide.targetCategory)}
                className="mt-3.5 sm:mt-5 inline-flex items-center gap-1.5 px-4 sm:px-6 py-2 sm:py-2.5 rounded-full bg-[#FFD13B] hover:bg-[#FFC400] active:scale-[0.98] text-[#1A102E] font-bold text-xs sm:text-sm shadow-md transition-all cursor-pointer whitespace-nowrap"
              >
                <span>{currentSlide.ctaBn}</span>
                <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              </button>
            </div>

            {/* Right Image */}
            <div className="col-span-5 sm:col-span-6 h-full relative self-stretch">
              <img
                src={currentSlide.image}
                alt={currentSlide.titleBn}
                referrerPolicy="no-referrer"
                className="w-full h-full max-h-[320px] object-cover object-top"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-[#4A0D8A]/70 via-transparent to-transparent sm:from-[#4A0D8A]/45" />
            </div>
          </div>

          {/* Prev / Next Arrows for Desktop */}
          <button
            type="button"
            onClick={() =>
              setSlideIdx((prev) => (prev - 1 + HERO_SLIDES.length) % HERO_SLIDES.length)
            }
            aria-label="আগের ব্যানার"
            className="hidden sm:flex absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/25 hover:bg-black/45 text-white items-center justify-center transition-colors cursor-pointer"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            type="button"
            onClick={() => setSlideIdx((prev) => (prev + 1) % HERO_SLIDES.length)}
            aria-label="পরবর্তী ব্যানার"
            className="hidden sm:flex absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/25 hover:bg-black/45 text-white items-center justify-center transition-colors cursor-pointer"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        {/* Carousel Indicator Dots matching Screenshot #2 */}
        <div className="flex items-center justify-center gap-1.5 mt-3">
          {HERO_SLIDES.map((slide, index) => (
            <button
              key={slide.id}
              type="button"
              onClick={() => setSlideIdx(index)}
              aria-label={`স্লাইড ${toBanglaDigits(index + 1)}`}
              className={`h-2 rounded-full transition-all cursor-pointer ${
                index === slideIdx
                  ? 'w-5 bg-[#6D0CE0]'
                  : 'w-2 bg-purple-200 hover:bg-purple-300'
              }`}
            />
          ))}
        </div>
      </section>

      {/* 8 Category Icons Grid matching Screenshot #2 (4x2 mobile, 8x1 desktop) */}
      <section aria-label="ক্যাটাগরি সমূহ">
        <div className="grid grid-cols-4 md:grid-cols-8 gap-y-4 gap-x-2.5 sm:gap-4 bg-white rounded-3xl p-4 sm:p-5 border border-[#EAE4F5] shadow-xs">
          {CATEGORY_TILES.map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => onSelectCategory(cat.id === 'more' ? 'all' : cat.id)}
              className="group flex flex-col items-center gap-1.5 min-h-[44px] focus-visible:outline-none cursor-pointer"
            >
              <div
                className={`w-13 h-13 sm:w-14 sm:h-14 rounded-2xl ${cat.bgTint} ${cat.iconColor} flex items-center justify-center transition-transform duration-150 group-hover:scale-105 group-active:scale-95 shadow-2xs`}
              >
                <CategoryGlyph id={cat.id} className="w-6 h-6 sm:w-7 sm:h-7" />
              </div>
              <span className="text-xs sm:text-[13px] font-semibold text-[#1A102E] group-hover:text-[#6D0CE0] transition-colors whitespace-nowrap">
                {cat.labelBn}
              </span>
            </button>
          ))}
        </div>
      </section>

      {/* Hot Deals Section matching Screenshot #2 */}
      <section aria-label="হট ডিলস" className="space-y-4">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Flame className="w-5 h-5 text-[#FF4D2D] fill-[#FF4D2D]" />
            <h2 className="text-lg sm:text-xl font-bold text-[#1A102E]">হট ডিলস</h2>
          </div>
          <button
            type="button"
            onClick={() => onSelectCategory('trending')}
            className="inline-flex items-center gap-1 text-xs sm:text-sm font-bold text-[#6D0CE0] hover:text-[#5208B2] transition-colors cursor-pointer whitespace-nowrap"
          >
            <span>সব দেখুন</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3.5 sm:gap-5">
          {hotDeals.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              isWishlisted={wishlistIds.includes(product.id)}
              onToggleWishlist={onToggleWishlist}
              onAddToCart={onAddToCart}
              onSelectProduct={onSelectProduct}
            />
          ))}
        </div>
      </section>

      {/* Featured Collection */}
      <section aria-label="জনপ্রিয় কালেকশন" className="space-y-4">
        <div className="flex items-center justify-between gap-4">
          <h2 className="text-lg sm:text-xl font-bold text-[#1A102E]">জনপ্রিয় কালেকশন</h2>
          <button
            type="button"
            onClick={() => onSelectCategory('all')}
            className="inline-flex items-center gap-1 text-xs sm:text-sm font-bold text-[#6D0CE0] hover:text-[#5208B2] transition-colors cursor-pointer whitespace-nowrap"
          >
            <span>সকল পণ্য</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3.5 sm:gap-5">
          {featuredProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              isWishlisted={wishlistIds.includes(product.id)}
              onToggleWishlist={onToggleWishlist}
              onAddToCart={onAddToCart}
              onSelectProduct={onSelectProduct}
            />
          ))}
        </div>
      </section>
    </div>
  );
}
