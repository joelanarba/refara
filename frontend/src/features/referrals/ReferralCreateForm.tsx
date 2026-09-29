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
    <form className="form-panel" onSubmit={handleSubmit} style={{ maxWidth: '600px', margin: '0 auto' }}>
      <div className="form-header">
        <h2>Create Referral</h2>
        <p>Transfer a maternal patient to another facility for specialized care.</p>
      </div>

      {error && <p className="form-error">{error}</p>}

      <div className="form-fields">
        <label className="full-field">
          Patient Full Name
          <input
            type="text"
            required
            placeholder="Jane Doe"
            value={formData.patientName}
            onChange={(e) => setFormData({ ...formData, patientName: e.target.value })}
          />
        </label>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <label>
            Patient Age
            <input
              type="number"
              required
              min="10"
              max="60"
              value={formData.patientAge || ''}
              onChange={(e) => setFormData({ ...formData, patientAge: parseInt(e.target.value) || 0 })}
            />
          </label>

          <label>
            Gestational Weeks (Optional)
            <input
              type="number"
              min="0"
              max="45"
              value={formData.gestationalWeeks || ''}
              onChange={(e) => setFormData({ ...formData, gestationalWeeks: parseInt(e.target.value) || 0 })}
            />
          </label>
        </div>

        <label className="full-field">
          Urgency
          <select
            value={formData.urgency}
            onChange={(e) => setFormData({ ...formData, urgency: e.target.value as ReferralUrgency })}
          >
            <option value="ROUTINE">Routine - Non-emergency</option>
            <option value="URGENT">Urgent - Needs attention soon</option>
            <option value="EMERGENCY">Emergency - Immediate life-threatening</option>
          </select>
        </label>

        <label className="full-field">
          Reason for Referral
          <textarea
            required
            rows={4}
            placeholder="Describe the complications, current vitals, and reasons for transfer..."
            value={formData.reason}
            onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
          />
        </label>

        <label className="full-field">
          Receiving Facility
          <select
            required
            value={formData.receivingFacilityId}
            onChange={(e) => setFormData({ ...formData, receivingFacilityId: e.target.value })}
            disabled={facilitiesLoading}
          >
            <option value="">Select destination facility...</option>
            {facilities?.map((f) => (
              <option key={f.id} value={f.id}>
                {f.name} ({f.type.replace('_', ' ')})
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className="form-footer" style={{ marginTop: '2rem' }}>
        <button
          type="button"
          className="secondary-button"
          onClick={() => navigate(ROUTES.REFERRALS)}
          disabled={isSubmitting}
        >
          Cancel
        </button>
        <button type="submit" className="primary-button" disabled={isSubmitting}>
          {isSubmitting ? 'Submitting...' : 'Submit Referral'}
        </button>
      </div>
    </form>
  );
}
