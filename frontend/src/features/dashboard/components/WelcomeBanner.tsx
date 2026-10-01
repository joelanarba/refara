interface WelcomeBannerProps {
  title: string;
  text: string;
}

export default function WelcomeBanner({ title, text }: WelcomeBannerProps) {
  return (
    <div className="relative mb-[21px] flex min-h-[112px] items-center gap-[17px] overflow-hidden rounded-[14px] bg-[linear-gradient(104deg,#3d8792,#5a9fa3)] p-[18px] text-white shadow-[0_12px_25px_rgba(55,123,132,0.12)] min-[431px]:px-[29px] min-[431px]:py-[23px]">
      <span className="grid size-[43px] shrink-0 place-items-center rounded-xl bg-white/15 text-[#dff3f1]">
        <HeartIcon size={20} />
      </span>
      <div>
        <strong className="font-display text-lg">{title}</strong>
        <p className="mt-1.5 mb-0 text-[15px] text-[#d5eded]">{text}</p>
      </div>
      <span className="absolute top-7 -right-[5px] -rotate-[20deg] text-white/10 min-[431px]:right-[37px]">
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
