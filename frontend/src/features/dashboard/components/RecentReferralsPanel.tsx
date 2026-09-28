import { DashboardReferral } from '../types';

interface RecentReferralsPanelProps {
  title: string;
  referrals: DashboardReferral[];
  loading: boolean;
}

export default function RecentReferralsPanel({ title, referrals, loading }: RecentReferralsPanelProps) {
  if (loading) {
    return (
      <div className="panel" style={{ padding: '2rem', textAlign: 'center' }}>
        <p>Loading recent referrals...</p>
      </div>
    );
  }

  return (
    <div className="panel recent-referrals-panel">
      <div className="panel-header" style={{ marginBottom: '1rem' }}>
        <h3 className="panel-title" style={{ fontSize: '1.2rem', fontWeight: 600 }}>{title}</h3>
      </div>
      
      {referrals.length === 0 ? (
        <div className="empty-state" style={{ padding: '2rem', textAlign: 'center', color: '#666' }}>
          <p>No recent referrals found.</p>
        </div>
      ) : (
        <div className="table-responsive" style={{ overflowX: 'auto' }}>
          <table className="referral-table" style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid #eee' }}>
                <th style={{ padding: '0.75rem 0.5rem' }}>ID</th>
                <th style={{ padding: '0.75rem 0.5rem' }}>Patient</th>
                <th style={{ padding: '0.75rem 0.5rem' }}>From</th>
                <th style={{ padding: '0.75rem 0.5rem' }}>To</th>
                <th style={{ padding: '0.75rem 0.5rem' }}>Urgency</th>
                <th style={{ padding: '0.75rem 0.5rem' }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {referrals.map((r) => (
                <tr key={r.id} style={{ borderBottom: '1px solid #f5f5f5' }}>
                  <td style={{ padding: '0.75rem 0.5rem' }}>{r.code || r.id.substring(0, 8)}</td>
                  <td style={{ padding: '0.75rem 0.5rem' }}>
                    <div style={{ fontWeight: 500 }}>{r.patientName}</div>
                    <div style={{ fontSize: '0.85em', color: '#666' }}>Age: {r.patientAge}</div>
                  </td>
                  <td style={{ padding: '0.75rem 0.5rem' }}>{r.referringFacilityName}</td>
                  <td style={{ padding: '0.75rem 0.5rem' }}>{r.receivingFacilityName}</td>
                  <td style={{ padding: '0.75rem 0.5rem' }}>
                    <span className={`badge urgency-${r.urgency.toLowerCase()}`}>
                      {r.urgency}
                    </span>
                  </td>
                  <td style={{ padding: '0.75rem 0.5rem' }}>
                    <span className={`badge status-${r.status.toLowerCase()}`}>
                      {r.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
