import { ReactNode } from 'react';

interface StatsCardProps {
  icon: ReactNode;
  iconVariant: 'blue' | 'amber' | 'green' | 'coral';
  label: string;
  value: number | string;
  trend?: { text: string; direction: 'up' | 'warn' | 'muted' };
}

const ICON_STYLES = {
  blue: 'bg-[#e4f2f5] text-[#4d91a4]',
  amber: 'bg-[#fbf0df] text-[#ca9251]',
  green: 'bg-[#e6f3e9] text-[#599276]',
  coral: 'bg-[#fbe8e2] text-[#ca725d]',
};

const TREND_STYLES = {
  up: 'text-[#5da57c]',
  warn: 'text-[#c48745]',
  muted: 'text-[#93a2a4]',
};

export default function StatsCard({ icon, iconVariant, label, value, trend }: StatsCardProps) {
  return (
    <div className="relative min-h-[130px] rounded-xl border border-[#e9efef] bg-white p-4 md:min-h-[139px] md:p-5">
      <span
        className={`mb-[13px] grid size-[33px] place-items-center rounded-[9px] ${ICON_STYLES[iconVariant]}`}
      >
        {icon}
      </span>
      <p className="m-0 mb-[5px] text-[15px] text-[#89989b]">{label}</p>
      <strong className="block font-display text-[25px] tracking-[-0.5px] text-[#2a4148] md:text-[29px]">
        {value}
      </strong>
      {trend && (
        <span
          className={`mt-1.5 block text-sm md:absolute md:right-[18px] md:bottom-[21px] md:mt-0 ${TREND_STYLES[trend.direction]}`}
        >
          {trend.text}
        </span>
      )}
    </div>
  );
}
