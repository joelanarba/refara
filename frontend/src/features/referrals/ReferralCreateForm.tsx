import { FormEvent, useState, CSSProperties } from 'react';
import { useNavigate } from 'react-router-dom';
import { useFacilities } from '@/hooks/useFacilities';
import { createReferral } from './referralService';
import { CreateReferralPayload } from './types';
import { ReferralUrgency } from '@/types';
import { ROUTES } from '@/constants/routes';

// The base stylesheet's .form-fields rules are tuned for dense dashboard
// tables (11px). That's too small for a form people actually type into,
// so every field here gets its size set explicitly instead of inheriting it.
const labelStyle: CSSProperties = {
  display: 'block',
  fontSize: 13,
  fontWeight: 600,
  color: '#4a6266',
};

const inputStyle: CSSProperties = {
  width: '100%',
  marginTop: 8,
  height: 46,
  padding: '0 14px',
  border: '1px solid #dce6e6',
  borderRadius: 8,
  background: '#fbfdfd',
  color: '#2a4148',
  outline: 'none',
  fontSize: 14,
  fontFamily: 'inherit',
};

const textareaStyle: CSSProperties = {
  ...inputStyle,
  height: 'auto',
  padding: '12px 14px',
  lineHeight: 1.6,
  resize: 'vertical',
};

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
    if (!formData.patientAge || formData.patientAge < 10)
      return setError('Please provide a valid patient age.');
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
    <form
      className="panel form-panel"
      onSubmit={handleSubmit}
      style={{ maxWidth: 640, margin: '0 auto' }}
    >
      <div style={{ marginBottom: 28 }}>
        <h2
          style={{
            margin: 0,
            fontFamily: "'Manrope', sans-serif",
            fontSize: 22,
            color: '#2d444a',
          }}
        >
          Create Referral
        </h2>
        <p style={{ margin: '8px 0 0', color: '#7a8e91', fontSize: 14, lineHeight: 1.5 }}>
          Transfer a maternal patient to another facility for specialized care.
        </p>
      </div>

      {error && (
        <p style={{ color: '#bd6255', fontSize: 13, margin: '0 0 18px', fontWeight: 500 }}>
          {error}
        </p>
      )}

      <div style={{ display: 'grid', gap: 20 }}>
        <label style={labelStyle}>
          Patient Full Name
          <input
            type="text"
            required
            placeholder="Jane Doe"
            value={formData.patientName}
            onChange={(e) => setFormData({ ...formData, patientName: e.target.value })}
            style={inputStyle}
          />
        </label>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <label style={labelStyle}>
            Patient Age
            <input
              type="number"
              required
              min="10"
              max="60"
              value={formData.patientAge || ''}
              onChange={(e) =>
                setFormData({ ...formData, patientAge: parseInt(e.target.value) || 0 })
              }
              style={inputStyle}
            />
          </label>

          <label style={labelStyle}>
            Gestational Weeks (Optional)
            <input
              type="number"
              min="0"
              max="45"
              value={formData.gestationalWeeks || ''}
              onChange={(e) =>
                setFormData({ ...formData, gestationalWeeks: parseInt(e.target.value) || 0 })
              }
              style={inputStyle}
            />
          </label>
        </div>

        <label style={labelStyle}>
          Urgency
          <select
            value={formData.urgency}
            onChange={(e) =>
              setFormData({ ...formData, urgency: e.target.value as ReferralUrgency })
            }
            style={inputStyle}
          >
            <option value="ROUTINE">Routine - Non-emergency</option>
            <option value="URGENT">Urgent - Needs attention soon</option>
            <option value="EMERGENCY">Emergency - Immediate life-threatening</option>
          </select>
        </label>

        <label style={labelStyle}>
          Reason for Referral
          <textarea
            required
            rows={4}
            placeholder="Describe the complications, current vitals, and reasons for transfer..."
            value={formData.reason}
            onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
            style={textareaStyle}
          />
        </label>

        <label style={labelStyle}>
          Receiving Facility
          <select
            required
            value={formData.receivingFacilityId}
            onChange={(e) => setFormData({ ...formData, receivingFacilityId: e.target.value })}
            disabled={facilitiesLoading}
            style={inputStyle}
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

      <div className="form-footer" style={{ marginTop: 32 }}>
        <button
          type="button"
          className="secondary-button"
          onClick={() => navigate(ROUTES.REFERRALS)}
          disabled={isSubmitting}
          style={{ fontSize: 13, padding: '12px 18px' }}
        >
          Cancel
        </button>
        <button
          type="submit"
          className="primary-button"
          disabled={isSubmitting}
          style={{ fontSize: 13, padding: '12px 20px' }}
        >
          {isSubmitting ? 'Submitting...' : 'Submit Referral'}
        </button>
      </div>
    </form>
  );
}
