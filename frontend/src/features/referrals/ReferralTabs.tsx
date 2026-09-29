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
    <div style={{ display: 'flex', gap: 6, marginBottom: 20 }}>
      {TABS.map((tab) => {
        const isActive = tab.key === active;
        return (
          <button
            key={tab.key}
            type="button"
            onClick={() => onChange(tab.key)}
            style={{
              border: 0,
              borderRadius: 8,
              padding: '9px 16px',
              fontSize: 12,
              fontWeight: 700,
              cursor: 'pointer',
              color: isActive ? '#317c89' : '#839396',
              background: isActive ? '#eaf5f5' : 'transparent',
            }}
          >
            {tab.label}
          </button>
        );
      })}
    </div>
  );
}
