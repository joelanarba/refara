import { ActivityPoint } from '../types';

interface ReferralActivityChartProps {
  points: ActivityPoint[];
  changePct: number | null;
  loading?: boolean;
}

const CHART_WIDTH = 400;
const CHART_HEIGHT = 150;

function buildPath(points: ActivityPoint[]) {
  if (points.length === 0) return '';
  const max = Math.max(...points.map((p) => p.count), 1);
  const stepX = CHART_WIDTH / (points.length - 1 || 1);

  return points
    .map((p, i) => {
      const x = i * stepX;
      const y = CHART_HEIGHT - (p.count / max) * CHART_HEIGHT;
      return `${i === 0 ? 'M' : 'L'}${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(' ');
}

export default function ReferralActivityChart({
  points,
  changePct,
  loading,
}: ReferralActivityChartProps) {
  const max = Math.max(...points.map((p) => p.count), 1);
  const yLabels = [max, Math.round(max * 0.66), Math.round(max * 0.33), 0];

  const dayLabels = points.filter((_, i) => i % 2 === 0 || i === points.length - 1);

  return (
    <div className="min-w-0 rounded-[13px] border border-[#e8eeee] bg-white">
      <div className="flex items-start justify-between gap-[15px] px-6 pt-[23px] pb-[18px]">
        <div>
          <h2 className="font-display text-[17px] font-bold text-[#2d444a]">Referral activity</h2>
          <p className="mt-[5px] text-sm text-[#9aa8aa]">Last 7 days</p>
        </div>
        <button type="button" className="text-[#9aabad]" aria-label="More options">
          <MoreIcon />
        </button>
      </div>

      {loading ? (
        <div className="px-6 py-5 text-sm text-[#9aa8aa]">Loading…</div>
      ) : (
        <>
          <div className="flex h-[190px] px-6 pt-4">
            <div className="flex flex-col justify-between pb-6 text-xs text-[#a2afb1]">
              {yLabels.map((v, i) => (
                <span key={i}>{v}</span>
              ))}
            </div>
            <div className="relative ml-[9px] flex-1">
              <div className="absolute inset-x-0 top-0.5 bottom-6 flex flex-col justify-between">
                {yLabels.map((_, i) => (
                  <i key={i} className="block border-t border-dashed border-[#e8eeee]" />
                ))}
              </div>
              <svg
                className="absolute inset-x-0 top-0.5 h-[calc(100%-24px)] w-full"
                viewBox={`0 0 ${CHART_WIDTH} ${CHART_HEIGHT}`}
                preserveAspectRatio="none"
              >
                <path
                  d={buildPath(points)}
                  fill="none"
                  stroke="#4a97a2"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <div className="absolute inset-x-0 bottom-0 flex justify-between text-[11px] text-[#a2afb1]">
                {dayLabels.map((p, i) => (
                  <span key={i}>
                    {new Date(p.date).toLocaleDateString('en-GB', {
                      day: '2-digit',
                      month: 'short',
                    })}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between border-t border-[#eff3f3] px-6 pt-3.5 pb-[17px] text-sm text-[#829396]">
            <span>
              <span className="mr-1.5 inline-block size-1.5 rounded-full bg-[#4a97a2]" />
              Referrals submitted
            </span>
            {changePct !== null && (
              <span>
                <strong className="text-sm text-[#5aa078]">
                  {changePct > 0 ? '+' : ''}
                  {changePct}%
                </strong>{' '}
                <small className="font-normal text-[#a1adae]">vs last week</small>
              </span>
            )}
          </div>
        </>
      )}
    </div>
  );
}

function MoreIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
      <circle cx="5" cy="12" r="1.5" />
      <circle cx="12" cy="12" r="1.5" />
      <circle cx="19" cy="12" r="1.5" />
    </svg>
  );
}
