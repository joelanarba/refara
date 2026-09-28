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
    <div className="panel activity-panel">
      <div className="panel-head">
        <div>
          <h2>Referral activity</h2>
          <p>Last 7 days</p>
        </div>
        <button type="button" className="row-more" aria-label="More options">
          <MoreIcon />
        </button>
      </div>

      {loading ? (
        <div style={{ padding: '20px 24px', color: '#9aa8aa', fontSize: 11 }}>Loading…</div>
      ) : (
        <>
          <div className="chart">
            <div className="chart-labels">
              {yLabels.map((v, i) => (
                <span key={i}>{v}</span>
              ))}
            </div>
            <div className="chart-area">
              <div className="chart-lines">
                {yLabels.map((_, i) => (
                  <i key={i} />
                ))}
              </div>
              <svg viewBox={`0 0 ${CHART_WIDTH} ${CHART_HEIGHT}`} preserveAspectRatio="none">
                <path
                  d={buildPath(points)}
                  fill="none"
                  stroke="#4a97a2"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <div className="chart-days">
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

          <div className="chart-legend">
            <span>
              <span className="legend-dot" />
              Referrals submitted
            </span>
            {changePct !== null && (
              <span>
                <strong>
                  {changePct > 0 ? '+' : ''}
                  {changePct}%
                </strong>{' '}
                <small>vs last week</small>
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
