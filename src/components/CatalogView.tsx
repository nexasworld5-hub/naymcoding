import { useState, useMemo, useEffect } from 'react';
import { ArrowLeft, Search, X } from 'lucide-react';
import {
  CATEGORY_NAMES_BN,
  SUBCATEGORIES_BY_CATEGORY,
} from '../data/catalog';
import { CategoryId, Product } from '../types/shop';
import { toBanglaDigits } from '../utils/format';
import { ProductCard } from './ProductCard';

interface CatalogViewProps {
  products: Product[];
  activeCategory: CategoryId;
  onCategoryChange: (cat: CategoryId) => void;
  onBack: () => void;
  wishlistIds: string[];
  onToggleWishlist: (productId: string) => void;
  onAddToCart: (product: Product, size?: string) => void;
  onSelectProduct: (product: Product) => void;
}

const MAIN_CATEGORIES: { id: CategoryId; labelBn: string }[] = [
  { id: 'all', labelBn: 'সব ক্যাটাগরি' },
  { id: 'women', labelBn: 'নারী' },
  { id: 'men', labelBn: 'পুরুষ' },
  { id: 'shoes', labelBn: 'জুতা' },
  { id: 'bags', labelBn: 'ব্যাগ' },
  { id: 'kids', labelBn: 'শিশু' },
  { id: 'accessories', labelBn: 'এক্সেসরিজ' },
  { id: 'trending', labelBn: 'ট্রেন্ডিং' },
];

export function CatalogView({
  products,
  activeCategory,
  onCategoryChange,
  onBack,
  wishlistIds,
  onToggleWishlist,
  onAddToCart,
  onSelectProduct,
}: CatalogViewProps) {
  const [subCategory, setSubCategory] = useState('সব');
  const [sortBy, setSortBy] = useState<'popular' | 'price-asc' | 'price-desc'>('popular');
  const [searchOpen, setSearchOpen] = useState(false);
  const [localSearch, setLocalSearch] = useState('');

  useEffect(() => {
    setSubCategory('সব');
  }, [activeCategory]);

  const subTabs = SUBCATEGORIES_BY_CATEGORY[activeCategory] || ['সব'];

  const filteredProducts = useMemo(() => {
    let list = products.filter((p) => {
      if (activeCategory === 'all' || activeCategory === 'more') return true;
      if (activeCategory === 'trending') return p.isTrending || p.isHotDeal;
      return p.category === activeCategory;
    });

    if (subCategory !== 'সব') {
      list = list.filter((p) => p.subCategoryBn === subCategory);
    }

    if (localSearch.trim()) {
      const q = localSearch.trim().toLowerCase();
      list = list.filter(
        (p) =>
          p.nameBn.toLowerCase().includes(q) ||
          p.subCategoryBn.toLowerCase().includes(q)
      );
    }

    if (sortBy === 'price-asc') {
      list = [...list].sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price-desc') {
      list = [...list].sort((a, b) => b.price - a.price);
    }

    return list;
  }, [products, activeCategory, subCategory, localSearch, sortBy]);

  return (
    <div className="min-h-[70vh]">
      {/* Screen 3 Style Purple Sub-Header Bar */}
      <div className="bg-gradient-to-r from-[#240B52] via-[#3A0E7D] to-[#5212A8] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={onBack}
            aria-label="পিছনে যান"
            className="w-10 h-10 -ml-2 rounded-xl flex items-center justify-center hover:bg-white/10 transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>

          <h1 className="text-base sm:text-lg font-bold truncate">
            {CATEGORY_NAMES_BN[activeCategory]}
          </h1>

          <button
            type="button"
            onClick={() => setSearchOpen((prev) => !prev)}
            aria-label="ক্যাটাগরিতে খুঁজুন"
            className="w-10 h-10 -mr-2 rounded-xl flex items-center justify-center hover:bg-white/10 transition-colors cursor-pointer"
          >
            {searchOpen ? <X className="w-5 h-5" /> : <Search className="w-5 h-5" />}
          </button>
        </div>

        {/* Expandable Inline Search */}
        {searchOpen && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-3">
            <div className="relative max-w-md ml-auto">
              <Search className="w-4 h-4 text-[#6D0CE0] absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="search"
                autoFocus
                value={localSearch}
                onChange={(e) => setLocalSearch(e.target.value)}
                placeholder="এই ক্যাটাগরিতে পণ্য খুঁজুন..."
                className="w-full h-10 pl-10 pr-8 rounded-full bg-white text-[#1A102E] text-sm focus:outline-none"
              />
              {localSearch && (
                <button
                  type="button"
                  onClick={() => setLocalSearch('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 space-y-4">
        {/* Main Category Switcher */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
          {MAIN_CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => onCategoryChange(cat.id)}
              className={`px-3.5 py-1.5 rounded-full text-xs sm:text-sm font-semibold whitespace-nowrap shrink-0 transition-colors cursor-pointer ${
                activeCategory === cat.id
                  ? 'bg-[#2B0D5C] text-white shadow-xs'
                  : 'bg-white text-[#473E5C] border border-[#E5DDF5] hover:border-[#6D0CE0]'
              }`}
            >
              {cat.labelBn}
            </button>
          ))}
        </div>

        {/* Sub-category Filter Tabs (All, Dress, Top, Saree, T-Shirt) + Sort */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
            {subTabs.map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => setSubCategory(tab)}
                className={`px-4 py-1.5 rounded-full text-xs sm:text-sm font-semibold whitespace-nowrap shrink-0 transition-all cursor-pointer ${
                  subCategory === tab
                    ? 'bg-[#6D0CE0] text-white shadow-sm'
                    : 'bg-white text-[#4B3B6B] border border-[#E5DDF5] hover:bg-[#F5F0FF]'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2 ml-auto">
            <span className="text-xs text-slate-500 whitespace-nowrap">
              {toBanglaDigits(filteredProducts.length)}টি পণ্য
            </span>
            <select
              aria-label="সাজানোর ধরন"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
              className="h-9 px-3 rounded-xl bg-white border border-[#E5DDF5] text-xs sm:text-sm font-medium text-[#1A102E] focus:outline-none focus:ring-2 focus:ring-[#6D0CE0] cursor-pointer"
            >
              <option value="popular">জনপ্রিয় অনুযায়ী</option>
              <option value="price-asc">কম থেকে বেশি দাম</option>
              <option value="price-desc">বেশি থেকে কম দাম</option>
            </select>
          </div>
        </div>

        {/* Product Grid */}
        {filteredProducts.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-[#EAE4F5]">
            <p className="text-base font-bold text-[#1A102E]">
              এই ফিল্টারে কোনো পণ্য পাওয়া যায়নি
            </p>
            <button
              type="button"
              onClick={() => {
                setSubCategory('সব');
                setLocalSearch('');
              }}
              className="mt-4 px-5 py-2.5 rounded-xl bg-[#6D0CE0] text-white text-sm font-semibold cursor-pointer"
            >
              ফিল্টার রিসেট করুন
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3.5 sm:gap-5">
            {filteredProducts.map((product) => (
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
    </div>
  );
}
