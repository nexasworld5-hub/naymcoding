import { useState, useEffect, useCallback } from 'react';
import { CheckCircle2 } from 'lucide-react';
import {
  INITIAL_ADDRESSES,
  INITIAL_CART,
  INITIAL_NOTIFICATIONS,
  INITIAL_ORDERS,
  INITIAL_PAYMENT_METHODS,
  INITIAL_USER,
  INITIAL_WISHLIST_IDS,
  PRODUCTS,
} from './data/catalog';
import {
  Address,
  CartItem,
  CategoryId,
  NotificationItem,
  Order,
  PaymentMethod,
  Product,
  ScreenView,
  UserProfile,
} from './types/shop';
import { toBanglaDigits } from './utils/format';
import { Header } from './components/Header';
import { BottomNav } from './components/BottomNav';
import { DrawerMenu } from './components/DrawerMenu';
import { SplashShowcaseModal } from './components/SplashShowcaseModal';
import { HomeView } from './components/HomeView';
import { CatalogView } from './components/CatalogView';
import { ProductDetailView } from './components/ProductDetailView';
import { CartView } from './components/CartView';
import { CheckoutView } from './components/CheckoutView';
import { WishlistView } from './components/WishlistView';
import { AccountView } from './components/AccountView';
import { AccountSubViews } from './components/AccountSubViews';

function usePersistentState<T>(key: string, initialValue: T) {
  const [state, setState] = useState<T>(() => {
    try {
      const saved = window.localStorage.getItem(key);
      return saved ? (JSON.parse(saved) as T) : initialValue;
    } catch {
      return initialValue;
    }
  });

  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(state));
    } catch {
      // Ignore storage quota errors
    }
  }, [key, state]);

  return [state, setState] as const;
}

export default function App() {
  const [products, setProducts] = useState<Product[]>(PRODUCTS);
  const [activeScreen, setActiveScreen] = useState<ScreenView>('home');
  const [historyStack, setHistoryStack] = useState<ScreenView[]>([]);
  const [activeCategory, setActiveCategory] = useState<CategoryId>('women');
  const [selectedProductId, setSelectedProductId] = useState<string>(PRODUCTS[0].id);
  const [searchQuery, setSearchQuery] = useState('');
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [splashOpen, setSplashOpen] = useState(false);
  const [promoDiscount, setPromoDiscount] = useState(0);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const [cart, setCart] = usePersistentState<CartItem[]>('sw_cart_v1', INITIAL_CART);
  const [wishlistIds, setWishlistIds] = usePersistentState<string[]>(
    'sw_wishlist_v1',
    INITIAL_WISHLIST_IDS
  );
  const [orders, setOrders] = usePersistentState<Order[]>('sw_orders_v1', INITIAL_ORDERS);
  const [addresses, setAddresses] = usePersistentState<Address[]>(
    'sw_addresses_v1',
    INITIAL_ADDRESSES
  );
  const [payments, setPayments] = usePersistentState<PaymentMethod[]>(
    'sw_payments_v1',
    INITIAL_PAYMENT_METHODS
  );
  const [user, setUser] = usePersistentState<UserProfile>('sw_user_v1', INITIAL_USER);
  const [notifications, setNotifications] = usePersistentState<NotificationItem[]>(
    'sw_notifications_v1',
    INITIAL_NOTIFICATIONS
  );

  const showToast = useCallback((msg: string) => {
    setToastMsg(msg);
  }, []);

  useEffect(() => {
    if (!toastMsg) return;
    const t = window.setTimeout(() => setToastMsg(null), 2600);
    return () => window.clearTimeout(t);
  }, [toastMsg]);

  const navigate = useCallback(
    (nextScreen: ScreenView, category?: CategoryId) => {
      if (category) {
        setActiveCategory(category);
      }
      if (nextScreen !== activeScreen) {
        setHistoryStack((prev) => [...prev.slice(-10), activeScreen]);
        setActiveScreen(nextScreen);
      }
      window.scrollTo({ top: 0, behavior: 'smooth' });
    },
    [activeScreen]
  );

  const goBack = useCallback(() => {
    if (historyStack.length > 0) {
      const prev = historyStack[historyStack.length - 1];
      setHistoryStack((stack) => stack.slice(0, -1));
      setActiveScreen(prev);
    } else {
      setActiveScreen('home');
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [historyStack]);

  const handleSelectProduct = (product: Product) => {
    setSelectedProductId(product.id);
    navigate('product');
  };

  const handleToggleWishlist = (productId: string) => {
    setWishlistIds((prev) => {
      const exists = prev.includes(productId);
      showToast(
        exists
          ? 'পছন্দের তালিকা থেকে সরানো হয়েছে'
          : 'পছন্দের তালিকায় যোগ করা হয়েছে!'
      );
      return exists ? prev.filter((id) => id !== productId) : [...prev, productId];
    });
  };

  const handleAddToCart = (product: Product, chosenSize?: string) => {
    const size = chosenSize || (product.sizes.includes('M') ? 'M' : product.sizes[0]);
    setCart((prev) => {
      const existingIndex = prev.findIndex(
        (item) => item.product.id === product.id && item.size === size
      );
      if (existingIndex >= 0) {
        const updated = [...prev];
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: updated[existingIndex].quantity + 1,
        };
        return updated;
      }
      return [
        ...prev,
        {
          id: `cart-${product.id}-${size}-${Date.now()}`,
          product,
          size,
          quantity: 1,
        },
      ];
    });
    showToast(`"${product.nameBn}" কার্টে যোগ করা হয়েছে!`);
  };

  const handleBuyNow = (product: Product, size: string) => {
    handleAddToCart(product, size);
    navigate('cart');
  };

  const handleUpdateQuantity = (cartItemId: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((item) =>
          item.id === cartItemId ? { ...item, quantity: item.quantity + delta } : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  const handleRemoveCartItem = (cartItemId: string) => {
    setCart((prev) => prev.filter((item) => item.id !== cartItemId));
    showToast('পণ্যটি কার্ট থেকে সরানো হয়েছে');
  };

  const handleClearCart = () => {
    setCart([]);
    showToast('কার্ট সম্পূর্ণ খালি করা হয়েছে');
  };

  const handlePlaceOrder = ({
    addressSummary,
    paymentMethodBn,
    discount,
  }: {
    addressSummary: string;
    paymentMethodBn: string;
    discount: number;
  }): Order => {
    const subtotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
    const deliveryCharge = 70;
    const total = subtotal + deliveryCharge - discount;
    const orderNum = toBanglaDigits(Math.floor(1100 + Math.random() * 8800));

    const newOrder: Order = {
      id: `SW-${orderNum}`,
      dateBn: 'আজ, ১৬ নভেম্বর, ২০২৬',
      statusBn: 'প্রক্রিয়াধীন',
      items: cart.map((c) => ({
        nameBn: c.product.nameBn,
        size: c.size,
        quantity: c.quantity,
        price: c.product.price,
        image: c.product.images[0],
      })),
      subtotal,
      deliveryCharge,
      discount,
      total,
      paymentMethodBn,
      addressSummary,
    };

    setOrders((prev) => [newOrder, ...prev]);
    setCart([]);
    setPromoDiscount(0);
    setNotifications((prev) => [
      {
        id: `notif-${Date.now()}`,
        titleBn: `অর্ডার #${newOrder.id} নিশ্চিত হয়েছে!`,
        messageBn: 'আপনার অর্ডারটি সফলভাবে গৃহীত হয়েছে এবং দ্রুত ডেলিভারির জন্য প্রক্রিয়াধীন রয়েছে।',
        timeBn: 'এইমাত্র',
        read: false,
        targetScreen: 'orders',
      },
      ...prev,
    ]);
    return newOrder;
  };

  const handleShareProduct = (product: Product) => {
    const url = window.location.href;
    navigator.clipboard?.writeText(`${product.nameBn} — ${url}`).catch(() => {});
    showToast('পণ্যের লিংক কপি করা হয়েছে!');
  };

  const handleAddReview = (productId: string, rating: number, commentBn: string) => {
    setProducts((prev) =>
      prev.map((p) =>
        p.id === productId
          ? {
              ...p,
              reviews: [
                {
                  id: `rev-${Date.now()}`,
                  authorBn: user.nameBn,
                  rating,
                  dateBn: 'আজ',
                  commentBn,
                },
                ...p.reviews,
              ],
            }
          : p
      )
    );
    showToast('আপনার রিভিউ যুক্ত হয়েছে!');
  };

  const totalCartItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const selectedProduct =
    products.find((p) => p.id === selectedProductId) || products[0];

  const isAccountSubScreen = [
    'orders',
    'addresses',
    'payments',
    'refer',
    'support',
    'about',
    'settings',
    'gold-member',
  ].includes(activeScreen);

  return (
    <div className="min-h-screen flex flex-col bg-[#F5F3FA] text-[#1A102E]">
      <Header
        activeScreen={activeScreen}
        activeCategory={activeCategory}
        searchQuery={searchQuery}
        onSearchChange={(q) => {
          setSearchQuery(q);
          if (activeScreen !== 'home') {
            setActiveScreen('home');
          }
        }}
        onSearchSubmit={() => {
          if (activeScreen !== 'home') {
            setActiveScreen('home');
          }
        }}
        onNavigate={navigate}
        onOpenDrawer={() => setDrawerOpen(true)}
        cartCount={totalCartItems}
        wishlistCount={wishlistIds.length}
        notifications={notifications}
        onMarkAllRead={() =>
          setNotifications((prev) => prev.map((n) => ({ ...n, read: true })))
        }
        onNotificationClick={(notif) => {
          setNotifications((prev) =>
            prev.map((n) => (n.id === notif.id ? { ...n, read: true } : n))
          );
          if (notif.targetScreen) {
            navigate(notif.targetScreen, notif.targetCategory);
          }
        }}
      />

      <main className="flex-1 pb-20 md:pb-8">
        {activeScreen === 'home' && (
          <HomeView
            products={products}
            searchQuery={searchQuery}
            onClearSearch={() => setSearchQuery('')}
            wishlistIds={wishlistIds}
            onToggleWishlist={handleToggleWishlist}
            onAddToCart={(p, size) => handleAddToCart(p, size)}
            onSelectProduct={handleSelectProduct}
            onSelectCategory={(cat) => navigate('categories', cat)}
          />
        )}

        {activeScreen === 'categories' && (
          <CatalogView
            products={products}
            activeCategory={activeCategory}
            onCategoryChange={setActiveCategory}
            onBack={goBack}
            wishlistIds={wishlistIds}
            onToggleWishlist={handleToggleWishlist}
            onAddToCart={(p, size) => handleAddToCart(p, size)}
            onSelectProduct={handleSelectProduct}
          />
        )}

        {activeScreen === 'product' && (
          <ProductDetailView
            product={selectedProduct}
            isWishlisted={wishlistIds.includes(selectedProduct.id)}
            onToggleWishlist={handleToggleWishlist}
            onAddToCart={handleAddToCart}
            onBuyNow={handleBuyNow}
            onOpenCart={() => navigate('cart')}
            onBack={goBack}
            onShare={handleShareProduct}
            onAddReview={handleAddReview}
            cartCount={totalCartItems}
          />
        )}

        {activeScreen === 'cart' && (
          <CartView
            cart={cart}
            wishlistIds={wishlistIds}
            onToggleWishlist={handleToggleWishlist}
            onUpdateQuantity={handleUpdateQuantity}
            onRemoveItem={handleRemoveCartItem}
            onClearCart={handleClearCart}
            onSelectProduct={handleSelectProduct}
            onProceedToCheckout={(discount) => {
              setPromoDiscount(discount);
              navigate('checkout');
            }}
            onContinueShopping={() => navigate('categories', 'all')}
            onBack={goBack}
          />
        )}

        {activeScreen === 'checkout' && (
          <CheckoutView
            cart={cart}
            addresses={addresses}
            promoDiscount={promoDiscount}
            onPlaceOrder={handlePlaceOrder}
            onBack={goBack}
            onViewOrders={() => navigate('orders')}
            onContinueShopping={() => navigate('home')}
          />
        )}

        {activeScreen === 'wishlist' && (
          <WishlistView
            products={products}
            wishlistIds={wishlistIds}
            onToggleWishlist={handleToggleWishlist}
            onAddToCart={(p, size) => handleAddToCart(p, size)}
            onSelectProduct={handleSelectProduct}
            onBack={goBack}
            onBrowseCatalog={() => navigate('categories', 'all')}
          />
        )}

        {activeScreen === 'account' && (
          <AccountView
            user={user}
            ordersCount={orders.length}
            wishlistCount={wishlistIds.length}
            onNavigate={(s) => navigate(s)}
          />
        )}

        {isAccountSubScreen && (
          <AccountSubViews
            screen={
              activeScreen as
                | 'orders'
                | 'addresses'
                | 'payments'
                | 'refer'
                | 'support'
                | 'about'
                | 'settings'
                | 'gold-member'
            }
            user={user}
            orders={orders}
            addresses={addresses}
            payments={payments}
            onBack={() => navigate('account')}
            onUpdateUser={setUser}
            onAddAddress={(addr) =>
              setAddresses((prev) => [...prev, { ...addr, id: `addr-${Date.now()}` }])
            }
            onDeleteAddress={(id) =>
              setAddresses((prev) => prev.filter((a) => a.id !== id))
            }
            onSetDefaultAddress={(id) =>
              setAddresses((prev) =>
                prev.map((a) => ({ ...a, isDefault: a.id === id }))
              )
            }
            onSetDefaultPayment={(id) =>
              setPayments((prev) =>
                prev.map((p) => ({ ...p, isDefault: p.id === id }))
              )
            }
            onShowToast={showToast}
          />
        )}
      </main>

      {/* Clean Desktop Footer */}
      <footer className="hidden md:block bg-white border-t border-[#EAE4F5] py-6">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 flex flex-wrap items-center justify-between gap-4 text-xs text-slate-500">
          <p className="font-medium text-[#1A102E]">
            © ২০২৬ স্টাইলওয়্যার ফ্যাশন শপ (StyleWear) — স্মার্ট শপিং, স্টাইলিশ লুক
          </p>
          <div className="flex items-center gap-6">
            <button
              type="button"
              onClick={() => navigate('categories', 'women')}
              className="hover:text-[#6D0CE0] cursor-pointer"
            >
              নারী ফ্যাশন
            </button>
            <button
              type="button"
              onClick={() => navigate('categories', 'men')}
              className="hover:text-[#6D0CE0] cursor-pointer"
            >
              পুরুষ ফ্যাশন
            </button>
            <button
              type="button"
              onClick={() => navigate('support')}
              className="hover:text-[#6D0CE0] cursor-pointer"
            >
              সহায়তা ও সাপোর্ট
            </button>
            <button
              type="button"
              onClick={() => setSplashOpen(true)}
              className="hover:text-[#6D0CE0] cursor-pointer"
            >
              ব্র্যান্ড ইন্ট্রো
            </button>
          </div>
        </div>
      </footer>

      {/* Mobile Bottom Tab Navigation matching Screenshots #2 & #6 */}
      <BottomNav
        activeScreen={activeScreen}
        onNavigate={navigate}
        cartCount={totalCartItems}
        wishlistCount={wishlistIds.length}
      />

      {/* Slide-out Hamburger Drawer */}
      <DrawerMenu
        isOpen={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        user={user}
        onNavigate={navigate}
        onOpenSplash={() => setSplashOpen(true)}
      />

      {/* Screen 1 Brand Splash Showcase Modal */}
      <SplashShowcaseModal isOpen={splashOpen} onClose={() => setSplashOpen(false)} />

      {/* Feedback Toast */}
      {toastMsg && (
        <div
          role="status"
          aria-live="polite"
          className="fixed bottom-20 md:bottom-6 left-1/2 -translate-x-1/2 z-50 px-4 py-2.5 rounded-2xl bg-[#1A0838] text-white text-xs sm:text-sm font-semibold shadow-xl flex items-center gap-2 border border-purple-500/40 whitespace-nowrap"
        >
          <CheckCircle2 className="w-4 h-4 text-[#FFD13B] shrink-0" />
          <span>{toastMsg}</span>
        </div>
      )}
    </div>
  );
}
