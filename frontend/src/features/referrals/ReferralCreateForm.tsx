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

    if (!formData.patientName.trim()) return setError('Patient name is required.');
    if (!formData.patientAge || formData.patientAge < 10) return setError('Please provide a valid patient age.');
    if (!formData.reason.trim()) return setError('Reason for referral is required.');
    if (!formData.receivingFacilityId) return setError('Please select a receiving facility.');

    setIsSubmitting(true);
    try {
      await createReferral({
        ...formData,
        gestationalWeeks: formData.gestationalWeeks || undefined,
      });
      // Navigate back to the referrals list on success
      navigate(ROUTES.REFERRALS);
    } catch (err: any) {
      setError(err.message || 'Failed to create referral.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-[700px] mx-auto rounded-2xl border border-slate-100 bg-white p-6 shadow-xl sm:p-8 text-slate-800">
      <div className="mb-8 border-b border-slate-100 pb-5">
        <h2 className="text-2xl font-bold tracking-tight text-[#1b2a32]">Create Referral</h2>
        <p className="mt-1.5 text-[14px] text-[#6b7d87]">
          Transfer a maternal patient to another facility for specialized care.
        </p>
      </div>

      {error && (
        <div className="mb-6 rounded-xl border border-rose-100 bg-rose-50 px-4 py-3 text-sm font-medium text-rose-600">
          {error}
        </div>
      )}

      <div className="space-y-5">
        <div>
          <label className="mb-1.5 block text-[13px] font-semibold text-[#334752]">
            Patient Full Name
          </label>
          <input
            type="text"
            required
            placeholder="e.g. Jane Doe"
            value={formData.patientName}
            onChange={(e) => setFormData({ ...formData, patientName: e.target.value })}
            className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-[#1b2a32] placeholder-[#8fa0aa] outline-none transition focus:border-[#86b3b5] focus:ring-4 focus:ring-[#86b3b5]/15"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div>
            <label className="mb-1.5 block text-[13px] font-semibold text-[#334752]">
              Patient Age
            </label>
            <input
              type="number"
              required
              min="10"
              max="60"
              placeholder="e.g. 28"
              value={formData.patientAge || ''}
              onChange={(e) => setFormData({ ...formData, patientAge: parseInt(e.target.value) || 0 })}
              className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-[#1b2a32] outline-none transition focus:border-[#86b3b5] focus:ring-4 focus:ring-[#86b3b5]/15"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-[13px] font-semibold text-[#334752]">
              Gestational Weeks <span className="text-[#8fa0aa] font-normal">(Optional)</span>
            </label>
            <input
              type="number"
              min="0"
              max="45"
              placeholder="e.g. 32"
              value={formData.gestationalWeeks || ''}
              onChange={(e) => setFormData({ ...formData, gestationalWeeks: parseInt(e.target.value) || 0 })}
              className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-[#1b2a32] outline-none transition focus:border-[#86b3b5] focus:ring-4 focus:ring-[#86b3b5]/15"
            />
          </div>
        </div>

        <div>
          <label className="mb-1.5 block text-[13px] font-semibold text-[#334752]">Urgency</label>
          <div className="relative">
            <select
              value={formData.urgency}
              onChange={(e) => setFormData({ ...formData, urgency: e.target.value as ReferralUrgency })}
              className="w-full cursor-pointer appearance-none rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 pr-10 text-sm text-[#1b2a32] outline-none transition focus:border-[#86b3b5] focus:ring-4 focus:ring-[#86b3b5]/15"
            >
              <option value="ROUTINE">Routine - Non-emergency</option>
              <option value="URGENT">Urgent - Needs attention soon</option>
              <option value="EMERGENCY">Emergency - Immediate life-threatening</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3.5 text-[#334752]">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
            </div>
          </div>
        </div>

        <div>
          <label className="mb-1.5 block text-[13px] font-semibold text-[#334752]">
            Reason for Referral
          </label>
          <textarea
            required
            rows={4}
            placeholder="Describe the complications, current vitals, and reasons for transfer..."
            value={formData.reason}
            onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
            className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-3 text-sm text-[#1b2a32] placeholder-[#8fa0aa] outline-none transition focus:border-[#86b3b5] focus:ring-4 focus:ring-[#86b3b5]/15 resize-y"
          />
        </div>

        <div>
          <label className="mb-1.5 block text-[13px] font-semibold text-[#334752]">
            Receiving Facility
          </label>
          <div className="relative">
            <select
              required
              value={formData.receivingFacilityId}
              onChange={(e) => setFormData({ ...formData, receivingFacilityId: e.target.value })}
              disabled={facilitiesLoading}
              className={`w-full cursor-pointer appearance-none rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 pr-10 text-sm outline-none transition focus:border-[#86b3b5] focus:ring-4 focus:ring-[#86b3b5]/15 ${!formData.receivingFacilityId ? 'text-[#8fa0aa]' : 'text-[#1b2a32]'} ${facilitiesLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              <option value="" disabled>
                {facilitiesLoading ? 'Loading facilities...' : 'Select destination facility...'}
              </option>
              {facilities?.map((f) => (
                <option key={f.id} value={f.id} className="text-[#1b2a32]">
                  {f.name} ({f.type.replace('_', ' ')})
                </option>
              ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3.5 text-[#334752]">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-8 flex items-center justify-end gap-3 border-t border-slate-100 pt-5">
        <button
          type="button"
          onClick={() => navigate(ROUTES.REFERRALS)}
          disabled={isSubmitting}
          className="cursor-pointer rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-medium text-[#334752] transition hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="inline-flex cursor-pointer items-center justify-center rounded-xl bg-[#86b3b5] px-5 py-2.5 text-sm font-medium text-white shadow-xs transition hover:bg-[#729fa1] active:bg-[#638e90] disabled:cursor-not-allowed disabled:opacity-50 min-w-[140px]"
        >
          {isSubmitting ? 'Submitting...' : 'Submit Referral'}
        </button>
      </div>
    </form>
  );
}
