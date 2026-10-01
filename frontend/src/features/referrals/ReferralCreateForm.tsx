import { FormEvent, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useFacilities } from '@/hooks/useFacilities';
import { createReferral } from './referralService';
import { CreateReferralPayload } from './types';
import { ReferralUrgency } from '@/types';
import { ROUTES } from '@/constants/routes';

export default function ReferralCreateForm() {
  const navigate = useNavigate();
  const { data: facilities, loading: facilitiesLoading } = useFacilities();

  const [formData, setFormData] = useState<CreateReferralPayload>({
    patientName: '',
    patientAge: 0,
    gestationalWeeks: 0,
    urgency: 'ROUTINE',
    reason: '',
    receivingFacilityId: '',
  });

  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setError('');

    if (!formData.patientName.trim()) {
      return setError('Patient name is required.');
    }
    if (!formData.patientAge || formData.patientAge < 10) {
      return setError('Please provide a valid patient age.');
    }
    if (!formData.reason.trim()) {
      return setError('Reason for referral is required.');
    }
    if (!formData.receivingFacilityId) {
      return setError('Please select a receiving facility.');
    }

    setIsSubmitting(true);
    try {
      await createReferral({
        ...formData,
        gestationalWeeks: formData.gestationalWeeks || undefined,
      });
      navigate(ROUTES.REFERRALS);
    } catch (err: any) {
      setError(err.message || 'Failed to create referral.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="mx-auto w-full max-w-[700px] rounded-2xl border border-slate-100 bg-white p-6 text-slate-800 shadow-xl sm:p-8"
    >
      <div className="mb-8 border-b border-slate-100 pb-5">
        <h2 className="font-display text-2xl font-bold tracking-tight text-[#1b2a32]">
          Create Referral
        </h2>
        <p className="mt-1.5 text-[14px] text-[#6b7d87]">
          Transfer a maternal patient to another facility for specialized care.
        </p>
      </div>

      {error && (
        <div
          role="alert"
          className="mb-6 rounded-xl border border-rose-100 bg-rose-50 px-4 py-3 text-sm font-medium text-rose-600"
        >
          {error}
        </div>
      )}

      <div className="space-y-5">
        <div>
          <label
            htmlFor="patient-name"
            className="mb-1.5 block text-[13px] font-semibold text-[#334752]"
          >
            Patient Full Name
          </label>
          <input
            id="patient-name"
            type="text"
            required
            placeholder="e.g. Jane Doe"
            value={formData.patientName}
            onChange={(e) => setFormData({ ...formData, patientName: e.target.value })}
            className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-[#1b2a32] outline-none transition placeholder:text-[#8fa0aa] focus:border-[#86b3b5] focus:ring-4 focus:ring-[#86b3b5]/15"
          />
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <div>
            <label
              htmlFor="patient-age"
              className="mb-1.5 block text-[13px] font-semibold text-[#334752]"
            >
              Patient Age
            </label>
            <input
              id="patient-age"
              type="number"
              required
              min="10"
              max="60"
              placeholder="e.g. 28"
              value={formData.patientAge || ''}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  patientAge: parseInt(e.target.value) || 0,
                })
              }
              className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-[#1b2a32] outline-none transition focus:border-[#86b3b5] focus:ring-4 focus:ring-[#86b3b5]/15"
            />
          </div>

          <div>
            <label
              htmlFor="gestational-weeks"
              className="mb-1.5 block text-[13px] font-semibold text-[#334752]"
            >
              Gestational Weeks <span className="font-normal text-[#8fa0aa]">(Optional)</span>
            </label>
            <input
              id="gestational-weeks"
              type="number"
              min="0"
              max="45"
              placeholder="e.g. 32"
              value={formData.gestationalWeeks || ''}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  gestationalWeeks: parseInt(e.target.value) || 0,
                })
              }
              className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-[#1b2a32] outline-none transition focus:border-[#86b3b5] focus:ring-4 focus:ring-[#86b3b5]/15"
            />
          </div>
        </div>

        <div>
          <label
            htmlFor="urgency"
            className="mb-1.5 block text-[13px] font-semibold text-[#334752]"
          >
            Urgency
          </label>
          <div className="relative">
            <select
              id="urgency"
              value={formData.urgency}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  urgency: e.target.value as ReferralUrgency,
                })
              }
              className="w-full cursor-pointer appearance-none rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 pr-10 text-sm text-[#1b2a32] outline-none transition focus:border-[#86b3b5] focus:ring-4 focus:ring-[#86b3b5]/15"
            >
              <option value="ROUTINE">Routine - Non-emergency</option>
              <option value="URGENT">Urgent - Needs attention soon</option>
              <option value="EMERGENCY">Emergency - Immediate life-threatening</option>
            </select>
            <ChevronIcon />
          </div>
        </div>

        <div>
          <label htmlFor="reason" className="mb-1.5 block text-[13px] font-semibold text-[#334752]">
            Reason for Referral
          </label>
          <textarea
            id="reason"
            required
            rows={4}
            placeholder="Describe the complications, current vitals, and reasons for transfer..."
            value={formData.reason}
            onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
            className="w-full resize-y rounded-xl border border-slate-200 bg-white px-3.5 py-3 text-sm text-[#1b2a32] outline-none transition placeholder:text-[#8fa0aa] focus:border-[#86b3b5] focus:ring-4 focus:ring-[#86b3b5]/15"
          />
        </div>

        <div>
          <label
            htmlFor="receiving-facility"
            className="mb-1.5 block text-[13px] font-semibold text-[#334752]"
          >
            Receiving Facility
          </label>
          <div className="relative">
            <select
              id="receiving-facility"
              required
              value={formData.receivingFacilityId}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  receivingFacilityId: e.target.value,
                })
              }
              disabled={facilitiesLoading}
              className={`w-full appearance-none rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 pr-10 text-sm outline-none transition focus:border-[#86b3b5] focus:ring-4 focus:ring-[#86b3b5]/15 ${
                formData.receivingFacilityId ? 'text-[#1b2a32]' : 'text-[#8fa0aa]'
              } ${facilitiesLoading ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}`}
            >
              <option value="" disabled>
                {facilitiesLoading ? 'Loading facilities...' : 'Select destination facility...'}
              </option>
              {facilities?.map((facility) => (
                <option key={facility.id} value={facility.id} className="text-[#1b2a32]">
                  {facility.name} ({facility.type.replace('_', ' ')})
                </option>
              ))}
            </select>
            <ChevronIcon />
          </div>
        </div>
      </div>

      <div className="mt-8 flex items-center justify-end gap-3 border-t border-slate-100 pt-5">
        <button
          type="button"
          onClick={() => navigate(ROUTES.REFERRALS)}
          disabled={isSubmitting}
          className="rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-medium text-[#334752] transition hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-[#86b3b5]/30 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="inline-flex min-w-[140px] items-center justify-center rounded-xl bg-[#3e8995] px-5 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-[#327581] active:bg-[#2d6d78] focus:outline-none focus:ring-4 focus:ring-[#3e8995]/20 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isSubmitting ? 'Submitting...' : 'Submit Referral'}
        </button>
      </div>
    </form>
  );
}

function ChevronIcon() {
  return (
    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3.5 text-[#334752]">
      <svg
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <polyline points="6 9 12 15 18 9" />
      </svg>
    </div>
  );
}
