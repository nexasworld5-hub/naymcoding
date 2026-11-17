interface BrandLogoProps {
  size?: 'sm' | 'lg';
  showTagline?: boolean;
}

export function BrandLogo({ size = 'sm', showTagline = false }: BrandLogoProps) {
  const isLarge = size === 'lg';

  return (
    <div className="inline-flex flex-col items-center select-none">
      {/* Hanger + Gold Crown Emblem matching the StyleWear logo */}
      <div className={`relative flex flex-col items-center ${isLarge ? 'mb-1' : ''}`}>
        <svg
          width={isLarge ? 72 : 34}
          height={isLarge ? 50 : 24}
          viewBox="0 0 80 54"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          {/* Gold Crown */}
          <path
            d="M28 16L32 7L40 13L48 7L52 16H28Z"
            fill="#F6C324"
            stroke="#FFE27A"
            strokeWidth="1.2"
            strokeLinejoin="round"
          />
          <circle cx="32" cy="6" r="2" fill="#FFE27A" />
          <circle cx="40" cy="4.5" r="2.2" fill="#FFE27A" />
          <circle cx="48" cy="6" r="2" fill="#FFE27A" />
          {/* Hanger Hook */}
          <path
            d="M36.5 22C36.5 19.8 38.1 18.2 40 18.2C41.9 18.2 43.5 19.7 43.5 21.5C43.5 23.1 42.2 24.1 40 25.2V27.5"
            stroke="#F6C324"
            strokeWidth="2.6"
            strokeLinecap="round"
          />
          {/* Hanger Shoulders */}
          <path
            d="M40 27.5L13 43.5C10.5 45 11.5 48.5 14.5 48.5H65.5C68.5 48.5 69.5 45 67 43.5L40 27.5Z"
            stroke="url(#hangerGrad)"
            strokeWidth="3.5"
            strokeLinejoin="round"
          />
          <defs>
            <linearGradient id="hangerGrad" x1="12" y1="38" x2="68" y2="38" gradientUnits="userSpaceOnUse">
              <stop stopColor="#FF3EC9" />
              <stop offset="0.5" stopColor="#FFFFFF" />
              <stop offset="1" stopColor="#D67BFF" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      <div className="flex items-center gap-1.5">
        <span
          className={`font-display font-extrabold tracking-tight text-white whitespace-nowrap ${
            isLarge ? 'text-3xl sm:text-4xl italic' : 'text-[17px] leading-none'
          }`}
        >
          স্টাইল<span className="text-[#FFD13B]">ওয়্যার</span>
        </span>
        {!isLarge && (
          <span className="text-[#FFD13B] text-xs" aria-hidden="true">
            ♛
          </span>
        )}
      </div>

      {showTagline && (
        <span
          className={`text-purple-200/90 font-medium tracking-wide whitespace-nowrap ${
            isLarge ? 'text-sm mt-1' : 'text-[10px] mt-0.5'
          }`}
        >
          ফ্যাশন শপ
        </span>
      )}
    </div>
  );
}
