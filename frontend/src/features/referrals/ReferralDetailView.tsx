import { useState } from 'react';
import { useAuth } from '@/features/auth/useAuth';
import { ReferralDetail, UpdateReferralStatusPayload } from './types';
import { ReferralStatus } from '@/types';

interface Props {
  referral: ReferralDetail;
  onUpdateStatus: (payload: UpdateReferralStatusPayload) => Promise<void>;
}

export default function ReferralDetailView({ referral, onUpdateStatus }: Props) {
  const { user } = useAuth();
  const [isUpdating, setIsUpdating] = useState(false);
  const [error, setError] = useState('');
  const [reason, setReason] = useState('');
  const [showRejectForm, setShowRejectForm] = useState(false);
  const [showCancelForm, setShowCancelForm] = useState(false);

  const handleAction = async (newStatus: ReferralStatus, requiresReason = false) => {
    if (requiresReason && !reason.trim()) {
      setError('Please provide a reason.');
      return;
    }
    setError('');
    setIsUpdating(true);
    try {
      await onUpdateStatus({ newStatus, reasonText: requiresReason ? reason : undefined });
      setShowRejectForm(false);
      setShowCancelForm(false);
      setReason('');
    } catch (err: any) {
      setError(err.message || 'Action failed.');
    } finally {
      setIsUpdating(false);
    }
  };

  const isIncoming = referral.receivingFacilityId === user?.facilityId;
  const isOutgoing = referral.referringFacilityId === user?.facilityId;
  const isAdmin = user?.role === 'ADMIN';

  const canCancel = (isOutgoing || isAdmin) && ['SUBMITTED', 'ACKNOWLEDGED'].includes(referral.status);
  const canAcknowledge = (isIncoming || isAdmin) && referral.status === 'SUBMITTED';
  const canAcceptOrReject = (isIncoming || isAdmin) && ['SUBMITTED', 'ACKNOWLEDGED'].includes(referral.status);
  const canArrive = (isIncoming || isAdmin) && referral.status === 'ACCEPTED';
  const canComplete = (isIncoming || isAdmin) && referral.status === 'ARRIVED';

  return (
    <div className="referral-detail-view" style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
      <div className="main-panel" style={{ flex: '1 1 60%', minWidth: '300px' }}>
        <div className="form-panel">
          <h2>Referral Information</h2>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginTop: '1rem' }}>
            <div>
              <p className="text-sm text-gray">Patient Name</p>
              <p className="font-semibold">{referral.patientName}</p>
            </div>
            <div>
              <p className="text-sm text-gray">Code</p>
              <p className="font-semibold">{referral.code}</p>
            </div>
            <div>
              <p className="text-sm text-gray">Age</p>
              <p>{referral.patientAge}</p>
            </div>
            <div>
              <p className="text-sm text-gray">Gestational Weeks</p>
              <p>{referral.gestationalWeeks || 'N/A'}</p>
            </div>
            <div>
              <p className="text-sm text-gray">Urgency</p>
              <span className={`badge badge-${referral.urgency.toLowerCase()}`}>
                {referral.urgency}
              </span>
            </div>
            <div>
              <p className="text-sm text-gray">Current Status</p>
              <span className={`badge badge-${referral.status.toLowerCase()}`}>
                {referral.status.replace('_', ' ')}
              </span>
            </div>
          </div>

          <div style={{ marginTop: '1.5rem' }}>
            <p className="text-sm text-gray">Reason for Referral</p>
            <p style={{ background: '#f8f9fa', padding: '1rem', borderRadius: '4px', marginTop: '0.5rem' }}>
              {referral.reason}
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginTop: '1.5rem' }}>
            <div>
              <p className="text-sm text-gray">From (Origin)</p>
              <p className="font-semibold">{referral.referringFacility.name}</p>
              <p className="text-xs">{referral.referringFacility.type.replace('_', ' ')}</p>
              <p className="text-xs text-gray mt-1">Requested by: {referral.createdByUser.name}</p>
            </div>
            <div>
              <p className="text-sm text-gray">To (Destination)</p>
              <p className="font-semibold">{referral.receivingFacility.name}</p>
              <p className="text-xs">{referral.receivingFacility.type.replace('_', ' ')}</p>
            </div>
          </div>
        </div>

        {error && <div className="form-error mt-4">{error}</div>}

        <div className="action-panel mt-4" style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          {canAcknowledge && (
            <button className="primary-button" onClick={() => handleAction('ACKNOWLEDGED')} disabled={isUpdating}>
              Acknowledge Receipt
            </button>
          )}

          {canAcceptOrReject && !showRejectForm && (
            <>
              <button className="primary-button" onClick={() => handleAction('ACCEPTED')} disabled={isUpdating}>
                Accept Patient
              </button>
              <button className="secondary-button" onClick={() => setShowRejectForm(true)} disabled={isUpdating}>
                Reject...
              </button>
            </>
          )}

          {canArrive && (
            <button className="primary-button" onClick={() => handleAction('ARRIVED')} disabled={isUpdating}>
              Mark as Arrived
            </button>
          )}

          {canComplete && (
            <button className="primary-button" onClick={() => handleAction('COMPLETED')} disabled={isUpdating}>
              Mark as Completed
            </button>
          )}

          {canCancel && !showCancelForm && (
            <button className="secondary-button" onClick={() => setShowCancelForm(true)} disabled={isUpdating} style={{ marginLeft: 'auto' }}>
              Cancel Referral
            </button>
          )}
        </div>

        {(showRejectForm || showCancelForm) && (
          <div className="form-panel mt-4">
            <h3>{showRejectForm ? 'Reject Referral' : 'Cancel Referral'}</h3>
            <textarea
              rows={3}
              placeholder="Please provide a reason..."
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="full-field mt-2"
            />
            <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
              <button
                className="secondary-button"
                onClick={() => {
                  setShowRejectForm(false);
                  setShowCancelForm(false);
                  setReason('');
                  setError('');
                }}
              >
                Go Back
              </button>
              <button
                className="primary-button"
                onClick={() => handleAction(showRejectForm ? 'REJECTED' : 'CANCELLED', true)}
                disabled={isUpdating}
              >
                Confirm {showRejectForm ? 'Rejection' : 'Cancellation'}
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="side-panel" style={{ flex: '1 1 30%', minWidth: '250px' }}>
        <div className="form-panel">
          <h2>Timeline</h2>
          <div className="timeline" style={{ marginTop: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {referral.statusHistory.map((history) => (
              <div key={history.id} className="timeline-event" style={{ borderLeft: '2px solid #e2e8f0', paddingLeft: '1rem' }}>
                <p className="text-sm font-semibold">{history.newStatus.replace('_', ' ')}</p>
                <p className="text-xs text-gray">{new Date(history.timestamp).toLocaleString()}</p>
                <p className="text-xs mt-1">By {history.changedByUser.name}</p>
                {history.reasonText && (
                  <p className="text-xs mt-1" style={{ fontStyle: 'italic', color: '#64748b' }}>
                    "{history.reasonText}"
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
