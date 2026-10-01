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
      await onUpdateStatus({
        newStatus,
        reasonText: requiresReason ? reason : undefined,
      });
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

  const canCancel =
    (isOutgoing || isAdmin) && ['SUBMITTED', 'ACKNOWLEDGED'].includes(referral.status);
  const canAcknowledge = (isIncoming || isAdmin) && referral.status === 'SUBMITTED';
  const canAcceptOrReject =
    (isIncoming || isAdmin) && ['SUBMITTED', 'ACKNOWLEDGED'].includes(referral.status);
  const canArrive = (isIncoming || isAdmin) && referral.status === 'ACCEPTED';
  const canComplete = (isIncoming || isAdmin) && referral.status === 'ARRIVED';

  return (
    <div className="flex flex-wrap gap-8">
      <div className="min-w-[300px] flex-[1_1_60%]">
        <div className="rounded-[13px] border border-[#e8eeee] bg-white p-7">
          <h2 className="font-display text-[17px] font-bold text-[#2d444a]">
            Referral Information
          </h2>

          <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <InfoItem label="Patient Name" value={referral.patientName} strong />
            <InfoItem label="Code" value={referral.code} strong />
            <InfoItem label="Age" value={String(referral.patientAge)} />
            <InfoItem
              label="Gestational Weeks"
              value={String(referral.gestationalWeeks || 'N/A')}
            />
            <div>
              <p className="text-sm text-[#8c9d9f]">Urgency</p>
              <StatusBadge type="urgency" value={referral.urgency} />
            </div>
            <div>
              <p className="text-sm text-[#8c9d9f]">Current Status</p>
              <StatusBadge type="status" value={referral.status} />
            </div>
          </div>

          <div className="mt-6">
            <p className="text-sm text-[#8c9d9f]">Reason for Referral</p>
            <p className="mt-2 rounded-lg bg-[#f8fafa] p-4 text-sm leading-6 text-[#425d62]">
              {referral.reason}
            </p>
          </div>

          <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <p className="text-sm text-[#8c9d9f]">From (Origin)</p>
              <p className="mt-1 font-semibold text-[#294148]">{referral.referringFacility.name}</p>
              <p className="text-xs text-[#60797d]">
                {referral.referringFacility.type.replace('_', ' ')}
              </p>
              <p className="mt-1 text-xs text-[#8c9d9f]">
                Requested by: {referral.createdByUser.name}
              </p>
            </div>
            <div>
              <p className="text-sm text-[#8c9d9f]">To (Destination)</p>
              <p className="mt-1 font-semibold text-[#294148]">{referral.receivingFacility.name}</p>
              <p className="text-xs text-[#60797d]">
                {referral.receivingFacility.type.replace('_', ' ')}
              </p>
            </div>
          </div>
        </div>

        {error && (
          <div
            role="alert"
            className="mt-4 rounded-lg border border-rose-100 bg-rose-50 px-4 py-3 text-sm font-medium text-rose-600"
          >
            {error}
          </div>
        )}

        <div className="mt-4 flex flex-wrap gap-3">
          {canAcknowledge && (
            <PrimaryButton onClick={() => handleAction('ACKNOWLEDGED')} disabled={isUpdating}>
              Acknowledge Receipt
            </PrimaryButton>
          )}

          {canAcceptOrReject && !showRejectForm && (
            <>
              <PrimaryButton onClick={() => handleAction('ACCEPTED')} disabled={isUpdating}>
                Accept Patient
              </PrimaryButton>
              <SecondaryButton onClick={() => setShowRejectForm(true)} disabled={isUpdating}>
                Reject...
              </SecondaryButton>
            </>
          )}

          {canArrive && (
            <PrimaryButton onClick={() => handleAction('ARRIVED')} disabled={isUpdating}>
              Mark as Arrived
            </PrimaryButton>
          )}

          {canComplete && (
            <PrimaryButton onClick={() => handleAction('COMPLETED')} disabled={isUpdating}>
              Mark as Completed
            </PrimaryButton>
          )}

          {canCancel && !showCancelForm && (
            <SecondaryButton
              onClick={() => setShowCancelForm(true)}
              disabled={isUpdating}
              className="ml-auto"
            >
              Cancel Referral
            </SecondaryButton>
          )}
        </div>

        {(showRejectForm || showCancelForm) && (
          <div className="mt-4 rounded-[13px] border border-[#e8eeee] bg-white p-7">
            <h3 className="font-display text-lg font-bold text-[#2d444a]">
              {showRejectForm ? 'Reject Referral' : 'Cancel Referral'}
            </h3>

            <textarea
              rows={3}
              placeholder="Please provide a reason..."
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="mt-3 w-full resize-y rounded-lg border border-[#dce6e6] bg-[#fbfdfd] px-3 py-2.5 text-sm text-[#3d5559] outline-none transition placeholder:text-[#9aa8aa] focus:border-[#78b5ba] focus:ring-4 focus:ring-[#eaf5f5]"
            />

            <div className="mt-4 flex gap-3">
              <SecondaryButton
                onClick={() => {
                  setShowRejectForm(false);
                  setShowCancelForm(false);
                  setReason('');
                  setError('');
                }}
              >
                Go Back
              </SecondaryButton>
              <PrimaryButton
                onClick={() => handleAction(showRejectForm ? 'REJECTED' : 'CANCELLED', true)}
                disabled={isUpdating}
              >
                Confirm {showRejectForm ? 'Rejection' : 'Cancellation'}
              </PrimaryButton>
            </div>
          </div>
        )}
      </div>

      <div className="min-w-[250px] flex-[1_1_30%]">
        <div className="rounded-[13px] border border-[#e8eeee] bg-white p-7">
          <h2 className="font-display text-[17px] font-bold text-[#2d444a]">Timeline</h2>
          <div className="mt-6 flex flex-col gap-4">
            {referral.statusHistory.map((history) => (
              <div key={history.id} className="border-l-2 border-[#e2e8f0] pl-4">
                <p className="text-sm font-semibold text-[#425d62]">
                  {history.newStatus.replace('_', ' ')}
                </p>
                <p className="text-xs text-[#8c9d9f]">
                  {new Date(history.timestamp).toLocaleString()}
                </p>
                <p className="mt-1 text-xs text-[#60797d]">By {history.changedByUser.name}</p>
                {history.reasonText && (
                  <p className="mt-1 text-xs italic text-[#64748b]">"{history.reasonText}"</p>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ---------- Helpers ---------- */

function InfoItem({
  label,
  value,
  strong = false,
}: {
  label: string;
  value: string;
  strong?: boolean;
}) {
  return (
    <div>
      <p className="text-sm text-[#8c9d9f]">{label}</p>
      <p className={strong ? 'font-semibold text-[#294148]' : 'text-[#425d62]'}>{value}</p>
    </div>
  );
}

function StatusBadge({ type, value }: { type: 'urgency' | 'status'; value: string }) {
  if (type === 'urgency') {
    const styles: Record<string, string> = {
      ROUTINE: 'bg-[#e9f4eb] text-[#5c8b76]',
      URGENT: 'bg-[#fff0dd] text-[#bd8250]',
      EMERGENCY: 'bg-[#fde7e2] text-[#bd6255]',
    };
    return (
      <span
        className={`mt-1 inline-flex w-fit rounded-md px-2 py-1 text-xs font-bold ${
          styles[value] || 'bg-slate-100 text-slate-600'
        }`}
      >
        {value}
      </span>
    );
  }

  const styles: Record<string, string> = {
    SUBMITTED: 'bg-[#fff0e9] text-[#bd7655]',
    ACKNOWLEDGED: 'bg-[#fff5e4] text-[#ba8c4e]',
    ACCEPTED: 'bg-[#e8f4f5] text-[#568a9a]',
    ARRIVED: 'bg-[#eaf5eb] text-[#638b71]',
    COMPLETED: 'bg-[#eaf5eb] text-[#598a6f]',
    REJECTED: 'bg-[#fde7e2] text-[#bd6255]',
    CANCELLED: 'bg-slate-100 text-slate-600',
  };

  return (
    <span
      className={`mt-1 inline-flex w-fit items-center gap-1.5 rounded-md px-2 py-1 text-xs font-bold ${
        styles[value] || 'bg-slate-100 text-slate-600'
      }`}
    >
      <i className="h-1.5 w-1.5 rounded-full bg-current" />
      {value.replace('_', ' ')}
    </span>
  );
}

function PrimaryButton({
  children,
  onClick,
  disabled,
  className = '',
}: {
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`rounded-lg bg-[#3e8995] px-4 py-2.5 text-sm font-bold text-white shadow-sm transition hover:bg-[#327581] focus:outline-none focus:ring-4 focus:ring-[#3e8995]/20 disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
    >
      {children}
    </button>
  );
}

function SecondaryButton({
  children,
  onClick,
  disabled,
  className = '',
}: {
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`rounded-lg border border-[#e0e9e9] bg-white px-4 py-2.5 text-sm font-semibold text-[#718285] transition hover:border-[#a7ccce] hover:text-[#3e8995] focus:outline-none focus:ring-2 focus:ring-[#86b3b5]/30 disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
    >
      {children}
    </button>
  );
}
