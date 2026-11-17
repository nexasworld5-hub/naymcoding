import { ArrowLeft, Heart } from 'lucide-react';
import { Product } from '../types/shop';
import { toBanglaDigits } from '../utils/format';
import { ProductCard } from './ProductCard';

interface WishlistViewProps {
  products: Product[];
  wishlistIds: string[];
  onToggleWishlist: (productId: string) => void;
  onAddToCart: (product: Product, size?: string) => void;
  onSelectProduct: (product: Product) => void;
  onBack: () => void;
  onBrowseCatalog: () => void;
}

export function WishlistView({
  products,
  wishlistIds,
  onToggleWishlist,
  onAddToCart,
  onSelectProduct,
  onBack,
  onBrowseCatalog,
}: WishlistViewProps) {
  const savedProducts = products.filter((p) => wishlistIds.includes(p.id));

  return (
    <div className="min-h-[75vh] pb-8">
      <div className="bg-gradient-to-r from-[#1A0838] via-[#280B54] to-[#3B107C] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between">
          <button
            type="button"
            onClick={onBack}
            aria-label="পিছনে যান"
            className="w-10 h-10 -ml-2 rounded-xl flex items-center justify-center hover:bg-white/10 cursor-pointer"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-base sm:text-lg font-bold">
            পছন্দের তালিকা ({toBanglaDigits(savedProducts.length)})
          </h1>
          <div className="w-10" />
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {savedProducts.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-[#EAE4F5]">
            <div className="w-16 h-16 rounded-full bg-pink-50 text-[#E91E63] flex items-center justify-center mx-auto mb-4">
              <Heart className="w-8 h-8" />
            </div>
            <h2 className="text-lg font-bold text-[#1A102E]">পছন্দের তালিকা খালি</h2>
            <p className="text-sm text-slate-500 mt-1">
              যেকোনো পণ্যের হার্ট আইকনে ক্লিক করে এখানে সংরক্ষণ করুন।
            </p>
            <button
              type="button"
              onClick={onBrowseCatalog}
              className="mt-5 px-6 py-3 rounded-2xl bg-[#6D0CE0] text-white text-sm font-bold cursor-pointer"
            >
              কালেকশন দেখুন
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3.5 sm:gap-5">
            {savedProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                isWishlisted={true}
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
