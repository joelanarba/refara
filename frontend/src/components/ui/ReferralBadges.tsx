/* Put this at src/components/ui/ReferralBadges.tsx (or wherever you keep shared UI). */

const URGENCY_STYLES: Record<string, string> = {
  routine: 'bg-[#e9f4eb] text-[#5c8b76]',
  urgent: 'bg-[#fff0dd] text-[#bd8250]',
  emergency: 'bg-[#fde7e2] text-[#bd6255]',
};

const STATUS_STYLES: Record<string, { text: string; dot: string }> = {
  submitted: { text: 'text-[#bd7655]', dot: 'bg-[#df8c67]' },
  acknowledged: { text: 'text-[#ba8c4e]', dot: 'bg-[#e0ad63]' },
  accepted: { text: 'text-[#568a9a]', dot: 'bg-[#67a9b4]' },
  arrived: { text: 'text-[#638b71]', dot: 'bg-[#79ab87]' },
  completed: { text: 'text-[#598a6f]', dot: 'bg-[#68a580]' },
  rejected: { text: 'text-[#bd6255]', dot: 'bg-[#e2836f]' },
  cancelled: { text: 'text-[#7e9194]', dot: 'bg-[#a9b7b9]' },
};
const STATUS_FALLBACK = { text: 'text-[#7e9194]', dot: 'bg-[#a9b7b9]' };

export function titleCase(s: string) {
  const clean = s.replace(/_/g, ' ');
  return clean.charAt(0).toUpperCase() + clean.slice(1).toLowerCase();
}

export function UrgencyBadge({ urgency }: { urgency: string }) {
  return (
    <span
      className={`w-fit rounded-[5px] px-[7px] py-[5px] text-xs font-bold ${
        URGENCY_STYLES[urgency.toLowerCase()] ?? 'bg-[#f1f5f5] text-[#7e9194]'
      }`}
    >
      {titleCase(urgency)}
    </span>
  );
}

export function StatusPill({ status }: { status: string }) {
  const s = STATUS_STYLES[status.toLowerCase()] ?? STATUS_FALLBACK;
  return (
    <span
      className={`inline-flex w-fit items-center gap-[5px] text-xs font-bold whitespace-nowrap ${s.text}`}
    >
      <i className={`block size-1.5 rounded-full ${s.dot}`} />
      {titleCase(status)}
    </span>
  );
}
