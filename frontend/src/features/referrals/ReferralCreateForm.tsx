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
  const [ageInput, setAgeInput] = useState('');
  const [ageError, setAgeError] = useState('');
  const [gestInput, setGestInput] = useState('');
  const [gestError, setGestError] = useState('');

  const isFormValid =
    formData.patientName.trim() !== '' &&
    formData.patientAge >= 10 &&
    formData.patientAge <= 60 &&
    !ageError &&
    !gestError &&
    formData.reason.trim() !== '' &&
    formData.receivingFacilityId !== '';

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setError('');

    if (!formData.patientName.trim()) {
      return setError('Patient name is required.');
    }
    if (ageError || gestError) {
      return setError('Please resolve the validation errors before submitting.');
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
              type="text"
              required
              placeholder="e.g. 28"
              value={ageInput}
              onChange={(e) => {
                const val = e.target.value;
                if (!/^\d*$/.test(val)) {
                  setAgeError('Numbers only');
                  return;
                }
                
                setAgeInput(val);
                
                if (val === '') {
                  setAgeError('');
                  setFormData({ ...formData, patientAge: 0 });
                  return;
                }
                
                const num = parseInt(val);
                if (num < 10 || num > 60) {
                  setAgeError('Must be 10-60');
                } else {
                  setAgeError('');
                }
                setFormData({ ...formData, patientAge: num });
              }}
              className={`w-full rounded-xl border bg-white px-3.5 py-2.5 text-sm text-[#1b2a32] outline-none transition focus:ring-4 ${
                ageError 
                  ? 'border-rose-300 focus:border-rose-500 focus:ring-rose-500/15' 
                  : 'border-slate-200 focus:border-[#86b3b5] focus:ring-[#86b3b5]/15'
              }`}
            />
            {ageError && <span className="mt-1.5 block text-xs font-medium text-rose-500">{ageError}</span>}
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
              type="text"
              placeholder="e.g. 32"
              value={gestInput}
              onChange={(e) => {
                const val = e.target.value;
                if (!/^\d*$/.test(val)) {
                  setGestError('Numbers only');
                  return;
                }
                
                setGestInput(val);
                
                if (val === '') {
                  setGestError('');
                  setFormData({ ...formData, gestationalWeeks: 0 });
                  return;
                }
                
                const num = parseInt(val);
                if (num < 1 || num > 45) {
                  setGestError('Must be 1-45');
                } else {
                  setGestError('');
                }
                setFormData({ ...formData, gestationalWeeks: num });
              }}
              className={`w-full rounded-xl border bg-white px-3.5 py-2.5 text-sm text-[#1b2a32] outline-none transition focus:ring-4 ${
                gestError 
                  ? 'border-rose-300 focus:border-rose-500 focus:ring-rose-500/15' 
                  : 'border-slate-200 focus:border-[#86b3b5] focus:ring-[#86b3b5]/15'
              }`}
            />
            {gestError && <span className="mt-1.5 block text-xs font-medium text-rose-500">{gestError}</span>}
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
          disabled={isSubmitting || !isFormValid}
          className={`inline-flex min-w-[140px] items-center justify-center rounded-xl px-5 py-2.5 text-sm font-bold text-white shadow-sm transition focus:outline-none focus:ring-4 focus:ring-[#3e8995]/20 disabled:cursor-not-allowed ${
            isFormValid
              ? 'bg-[#3e8995] hover:bg-[#327581] active:bg-[#2d6d78] opacity-100'
              : 'bg-[#9aa8aa] opacity-70'
          }`}
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

