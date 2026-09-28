interface WelcomeBannerProps {
  title: string;
  text: string;
}

export default function WelcomeBanner({ title, text }: WelcomeBannerProps) {
  return (
    <div className="welcome-banner">
      <span className="banner-icon">
        <HeartIcon size={20} />
      </span>
      <div>
        <strong>{title}</strong>
        <p>{text}</p>
      </div>
      <span className="banner-mark">
        <HeartIcon size={64} />
      </span>
    </div>
  );
}

function HeartIcon({ size }: { size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 21s-6.7-4.35-9.3-8.28C.86 9.94 1.6 6.4 4.6 5.1c2.1-.9 4.3-.1 5.6 1.6.4.5.7 1 .8 1.3.1-.3.4-.8.8-1.3 1.3-1.7 3.5-2.5 5.6-1.6 3 1.3 3.74 4.84 1.9 7.62C18.7 16.65 12 21 12 21z" />
    </svg>
  );
}
