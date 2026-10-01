import { DashboardReferral } from '../types';

interface RecentReferralsPanelProps {
  title: string;
  referrals: DashboardReferral[];
  loading: boolean;
}

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
};
const STATUS_FALLBACK = { text: 'text-[#7e9194]', dot: 'bg-[#9aa8aa]' };

const panel = 'rounded-[13px] border border-[#e8eeee] bg-white';
const th = 'px-3 py-3 text-xs font-bold tracking-[0.6px] text-[#a3b0b1]';
const td = 'px-3 py-3.5 align-middle';

export default function RecentReferralsPanel({
  title,
  referrals,
  loading,
}: RecentReferralsPanelProps) {
  if (loading) {
    return (
      <div className={`${panel} p-8 text-center text-[#9aa8aa]`}>
        <p>Loading recent referrals...</p>
      </div>
    );
  }

  return (
    <div className={`${panel} min-w-0`}>
      <div className="px-6 pt-[23px] pb-3">
        <h2 className="font-display text-[17px] font-bold text-[#2d444a]">{title}</h2>
      </div>

      {referrals.length === 0 ? (
        <div className="p-8 text-center text-[#9aa8aa]">
          <p>No recent referrals found.</p>
        </div>
      ) : (
        <div className="overflow-x-auto px-3 pb-3">
          <table className="w-full border-collapse text-left">
            <thead>
              <tr className="border-b border-[#eff3f3]">
                <th className={th}>ID</th>
                <th className={th}>Patient</th>
                <th className={th}>From</th>
                <th className={th}>To</th>
                <th className={th}>Urgency</th>
                <th className={th}>Status</th>
              </tr>
            </thead>
            <tbody>
              {referrals.map((r) => {
                const urgency = r.urgency.toLowerCase();
                const status = r.status.toLowerCase();
                const s = STATUS_STYLES[status] ?? STATUS_FALLBACK;

                return (
                  <tr
                    key={r.id}
                    className="border-b border-[#f3f6f6] last:border-0 hover:bg-[#f9fbfb]"
                  >
                    <td className={`${td} text-sm font-bold text-[#789296]`}>
                      {r.code || r.id.substring(0, 8)}
                    </td>
                    <td className={td}>
                      <div className="text-[15px] font-bold text-[#294148]">{r.patientName}</div>
                      <div className="mt-1 text-xs text-[#9aa8aa]">Age: {r.patientAge}</div>
                    </td>
                    <td className={`${td} text-[15px] text-[#294148]`}>
                      {r.referringFacilityName}
                    </td>
                    <td className={`${td} text-[15px] text-[#294148]`}>
                      {r.receivingFacilityName}
                    </td>
                    <td className={td}>
                      <span
                        className={`w-fit rounded-[5px] px-[7px] py-[5px] text-xs font-bold capitalize ${
                          URGENCY_STYLES[urgency] ?? 'bg-[#f1f5f5] text-[#7e9194]'
                        }`}
                      >
                        {urgency}
                      </span>
                    </td>
                    <td className={td}>
                      <span
                        className={`inline-flex items-center gap-[5px] text-xs font-bold whitespace-nowrap capitalize ${s.text}`}
                      >
                        <i className={`block size-1.5 rounded-full ${s.dot}`} />
                        {status}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
