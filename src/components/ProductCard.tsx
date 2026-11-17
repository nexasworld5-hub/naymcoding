import { useState } from 'react';
import { Heart, ShoppingCart, Shirt } from 'lucide-react';
import { Product } from '../types/shop';
import { formatTaka } from '../utils/format';

interface ProductCardProps {
  product: Product;
  isWishlisted: boolean;
  onToggleWishlist: (productId: string) => void;
  onAddToCart: (product: Product, size?: string) => void;
  onSelectProduct: (product: Product) => void;
  compact?: boolean;
}

export function ProductCard({
  product,
  isWishlisted,
  onToggleWishlist,
  onAddToCart,
  onSelectProduct,
  compact = false,
}: ProductCardProps) {
  const [imgError, setImgError] = useState(false);

  return (
    <article className="group bg-white rounded-2xl border border-[#EAE4F5] shadow-sm hover:shadow-md transition-all duration-200 hover:-translate-y-0.5 flex flex-col overflow-hidden">
      {/* Product Image Area */}
      <div className="relative aspect-[4/4.3] bg-[#F8F6FC] overflow-hidden">
        <button
          type="button"
          onClick={() => onSelectProduct(product)}
          className="w-full h-full block text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6D0CE0]"
          aria-label={`${product.nameBn} বিস্তারিত দেখুন`}
        >
          {!imgError ? (
            <img
              src={product.images[0]}
              alt={product.nameBn}
              referrerPolicy="no-referrer"
              onError={() => setImgError(true)}
              className="w-full h-full object-cover object-top transition-transform duration-300 group-hover:scale-[1.03]"
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-[#F2ECFA] to-[#E8DDF8] text-[#5B21B6] p-4 text-center">
              <Shirt className="w-10 h-10 mb-2 opacity-70" />
              <span className="text-xs font-medium">{product.nameBn}</span>
            </div>
          )}
        </button>

        {/* Wishlist Heart Button */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onToggleWishlist(product.id);
          }}
          aria-label={isWishlisted ? 'পছন্দের তালিকা থেকে সরান' : 'পছন্দের তালিকায় যোগ করুন'}
          className="absolute top-2.5 right-2.5 w-9 h-9 rounded-full bg-white/95 backdrop-blur-sm shadow-sm border border-purple-100 flex items-center justify-center transition-transform active:scale-90 hover:scale-105 cursor-pointer"
        >
          <Heart
            className={`w-4 h-4 transition-colors ${
              isWishlisted ? 'fill-[#E91E63] text-[#E91E63]' : 'text-[#4B3B6B]'
            }`}
          />
        </button>
      </div>

      {/* Product Info */}
      <div className={`flex flex-col flex-1 ${compact ? 'p-2.5' : 'p-3 sm:p-3.5'}`}>
        <button
          type="button"
          onClick={() => onSelectProduct(product)}
          className="text-left focus-visible:outline-none"
        >
          <h3 className="text-sm sm:text-[15px] font-semibold text-[#1A102E] truncate leading-snug group-hover:text-[#6D0CE0] transition-colors">
            {product.nameBn}
          </h3>
        </button>

        <div className="mt-1 flex items-baseline gap-2 flex-wrap tabular-nums">
          <span className="text-[15px] sm:text-base font-bold text-[#6D0CE0]">
            {formatTaka(product.price)}
          </span>
          {product.originalPrice > product.price && (
            <span className="text-xs text-slate-400 line-through">
              {formatTaka(product.originalPrice)}
            </span>
          )}
        </div>

        {!compact && (
          <button
            type="button"
            onClick={() => onAddToCart(product)}
            className="mt-3 w-full min-h-[40px] py-2 px-3 rounded-xl bg-gradient-to-r from-[#5E0AC9] to-[#7E16F0] hover:from-[#5208B2] hover:to-[#6F10DA] active:scale-[0.98] text-white text-xs sm:text-[13px] font-semibold flex items-center justify-center gap-1.5 shadow-sm transition-all cursor-pointer whitespace-nowrap"
          >
            <ShoppingCart className="w-3.5 h-3.5 shrink-0" />
            <span>কার্টে যোগ করুন</span>
          </button>
        )}
      </div>
    </article>
  );
}
