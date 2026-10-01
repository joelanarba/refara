import { ReactNode } from 'react';
import { formatDate } from '../../../utils';

interface DashboardHeaderProps {
  eyebrow: string;
  title: ReactNode;
  subtitle: string;
  action?: ReactNode;
}

export default function DashboardHeader({
  eyebrow,
  title,
  subtitle,
  action,
}: DashboardHeaderProps) {
  return (
    <div className="mb-6 flex flex-col items-start gap-5 md:mb-[31px] md:flex-row md:items-end md:justify-between">
      <div>
        <p className="text-sm leading-tight font-bold tracking-[1.5px] text-[#91a3a6]">{eyebrow}</p>
        <h1 className="mt-2.5 mb-[7px] font-display text-[28px] leading-[1.2] tracking-[-1.1px] text-[#253b42] md:text-[32px] [&_span]:text-[#3f8b98]">
          {title}
        </h1>
        <p className="m-0 text-lg text-[#87979a]">{subtitle}</p>
      </div>
      <div className="flex w-full items-center justify-between gap-2.5 md:w-auto md:justify-start">
        <span className="inline-flex items-center gap-2 rounded-lg border border-[#e0e9e9] bg-white p-2.5 text-sm font-semibold text-[#718285] hover:border-[#a7ccce] hover:text-brand min-[431px]:px-3.5 min-[431px]:py-[11px] min-[431px]:text-[15px]">
          <CalendarIcon />
          {formatDate()}
        </span>
        {action}
      </div>
    </div>
  );
}

function CalendarIcon() {
  return (
    <svg
      width="13"
      height="13"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 3" />
    </svg>
  );
}
