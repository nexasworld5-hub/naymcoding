export type CategoryId =
  | 'all'
  | 'men'
  | 'women'
  | 'shoes'
  | 'bags'
  | 'kids'
  | 'accessories'
  | 'trending'
  | 'more';

export type ScreenView =
  | 'home'
  | 'categories'
  | 'product'
  | 'cart'
  | 'wishlist'
  | 'account'
  | 'checkout'
  | 'orders'
  | 'addresses'
  | 'payments'
  | 'refer'
  | 'support'
  | 'about'
  | 'settings'
  | 'gold-member';

export interface ProductReview {
  id: string;
  authorBn: string;
  rating: number;
  dateBn: string;
  commentBn: string;
}

export interface Product {
  id: string;
  nameBn: string;
  category: Exclude<CategoryId, 'all' | 'more'>;
  subCategoryBn: string;
  price: number;
  originalPrice: number;
  discountPercent: number;
  rating: number;
  reviewCountBn: string;
  inStock: boolean;
  sizes: string[];
  images: string[];
  descriptionBn: string;
  fabricBn: string;
  isHotDeal?: boolean;
  isTrending?: boolean;
  reviews: ProductReview[];
}

export interface CartItem {
  id: string;
  product: Product;
  size: string;
  quantity: number;
}

export interface CategoryTile {
  id: CategoryId;
  labelBn: string;
  bgTint: string;
  iconColor: string;
}

export interface HeroSlide {
  id: string;
  badgeBn: string;
  titleBn: string;
  subtitleBn: string;
  highlightBn: string;
  ctaBn: string;
  image: string;
  targetCategory: CategoryId;
  accentGradient: string;
}

export interface Address {
  id: string;
  labelBn: string;
  recipientName: string;
  phone: string;
  street: string;
  city: string;
  isDefault: boolean;
}

export interface Order {
  id: string;
  dateBn: string;
  statusBn: 'প্রক্রিয়াধীন' | 'শিপমেন্টের জন্য প্রস্তুত' | 'ডেলিভারি সম্পন্ন';
  items: {
    nameBn: string;
    size: string;
    quantity: number;
    price: number;
    image: string;
  }[];
  subtotal: number;
  deliveryCharge: number;
  discount: number;
  total: number;
  paymentMethodBn: string;
  addressSummary: string;
}

export interface NotificationItem {
  id: string;
  titleBn: string;
  messageBn: string;
  timeBn: string;
  read: boolean;
  targetScreen?: ScreenView;
  targetCategory?: CategoryId;
}

export interface PaymentMethod {
  id: string;
  typeBn: string;
  accountMasked: string;
  isDefault: boolean;
}

export interface UserProfile {
  nameBn: string;
  email: string;
  phone: string;
  avatar: string;
  isGoldMember: boolean;
  points: number;
  pushNotifications: boolean;
  promoAlerts: boolean;
}
