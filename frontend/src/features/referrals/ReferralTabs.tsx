import { ReferralDirection } from './types';

interface ReferralTabsProps {
  active: ReferralDirection;
  onChange: (direction: ReferralDirection) => void;
}

const TABS: { key: ReferralDirection; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'sent', label: 'Sent' },
  { key: 'received', label: 'Received' },
];

export default function ReferralTabs({ active, onChange }: ReferralTabsProps) {
  return (
    <div className="mb-5 flex gap-1.5">
      {TABS.map((tab) => {
        const isActive = tab.key === active;
        return (
          <button
            key={tab.key}
            type="button"
            onClick={() => onChange(tab.key)}
            className={`rounded-lg px-4 py-[9px] text-xs font-bold transition ${
              isActive
                ? 'bg-[#eaf5f5] text-[#317c89]'
                : 'bg-transparent text-[#839396] hover:text-[#317c89]'
            }`}
          >
            {tab.label}
          </button>
        );
      })}
    </div>
  );
}
