export default function Logo() {
  return (
    <svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="36" height="36" rx="10" fill="url(#grad)"/>
      <defs>
        <linearGradient id="grad" x1="0" y1="0" x2="36" y2="36" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#059669"/>
          <stop offset="100%" stopColor="#34d399"/>
        </linearGradient>
      </defs>
      <text x="5" y="22" fontSize="13" fontWeight="700" fill="white" fontFamily="Inter, sans-serif">W</text>
      <text x="17" y="22" fontSize="10" fontWeight="600" fill="#a7f3d0" fontFamily="Inter, sans-serif">AI</text>
      <circle cx="28" cy="10" r="3" fill="#a7f3d0" opacity="0.8"/>
      <circle cx="28" cy="10" r="1.5" fill="white"/>
    </svg>
  );
}
