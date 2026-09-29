import { FormEvent, useState } from 'react';
import { FacilityType } from '@/types';
import { createFacility } from './facilityService';
import { FACILITY_TYPE_OPTIONS } from './facilityService';
import { labelStyle, inputStyle, fieldGroupStyle } from '@/components/forms/formFieldStyles';

interface AddFacilityFormProps {
  onCancel: () => void;
  onSuccess: () => void;
}

export default function AddFacilityForm({ onCancel, onSuccess }: AddFacilityFormProps) {
  const [name, setName] = useState('');
  const [type, setType] = useState<FacilityType | ''>('');
  const [location, setLocation] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setError('');

    if (!name.trim()) return setError('Facility name is required.');
    if (!type) return setError('Select a facility type.');
    if (!location.trim()) return setError('Location is required.');

    setIsSubmitting(true);
    try {
      await createFacility({ name, type, location });
      onSuccess();
    } catch (err: any) {
      setError(err.message || 'Failed to add facility.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      style={{
        background: '#fff',
        borderRadius: 16,
        padding: 28,
        width: '100%',
        maxWidth: 420,
        boxShadow: '0 24px 60px rgba(20,40,44,.22)',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14, marginBottom: 24 }}>
        <span
          style={{
            width: 44,
            height: 44,
            flexShrink: 0,
            borderRadius: 12,
            display: 'grid',
            placeItems: 'center',
            color: '#498d96',
            background: '#e7f3f3',
          }}
        >
          <BuildingIcon />
        </span>

        <div style={{ flex: 1, minWidth: 0 }}>
          <h2
            style={{
              margin: 0,
              fontFamily: "'Manrope', sans-serif",
              fontSize: 17,
              color: '#253b42',
            }}
          >
            Add facility
          </h2>
          <p style={{ margin: '4px 0 0', color: '#87979a', fontSize: 12.5, lineHeight: 1.4 }}>
            Connect a new care facility to the network.
          </p>
        </div>

        <button
          type="button"
          className="icon-button"
          onClick={onCancel}
          aria-label="Close"
          style={{ marginTop: -4, marginRight: -4 }}
        >
          <CloseIcon />
        </button>
      </div>

      {error && (
        <p style={{ color: '#bd6255', fontSize: 13, margin: '0 0 16px', fontWeight: 500 }}>
          {error}
        </p>
      )}

      <div style={fieldGroupStyle}>
        <label style={labelStyle} htmlFor="facilityName">
          Facility name
        </label>
        <input
          id="facilityName"
          type="text"
          placeholder="e.g. Tema General Hospital"
          value={name}
          onChange={(e) => setName(e.target.value)}
          style={inputStyle}
        />
      </div>

      <div style={fieldGroupStyle}>
        <label style={labelStyle} htmlFor="facilityType">
          Facility type
        </label>
        <select
          id="facilityType"
          value={type}
          onChange={(e) => setType(e.target.value as FacilityType)}
          style={{ ...inputStyle, color: type ? '#2a4148' : '#a6b2b3' }}
        >
          <option value="" disabled>
            Select a type
          </option>
          {FACILITY_TYPE_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>

      <div style={{ ...fieldGroupStyle, marginBottom: 8 }}>
        <label style={labelStyle} htmlFor="facilityLocation">
          Location
        </label>
        <input
          id="facilityLocation"
          type="text"
          placeholder="e.g. Tema"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          style={inputStyle}
        />
      </div>

      <div
        style={{
          display: 'flex',
          justifyContent: 'flex-end',
          gap: 10,
          borderTop: '1px solid #edf2f2',
          marginTop: 20,
          paddingTop: 20,
        }}
      >
        <button
          type="button"
          className="secondary-button"
          onClick={onCancel}
          disabled={isSubmitting}
          style={{ fontSize: 13, padding: '11px 18px' }}
        >
          Cancel
        </button>
        <button
          type="submit"
          className="primary-button"
          disabled={isSubmitting}
          style={{ fontSize: 13, padding: '11px 18px' }}
        >
          <CheckIcon />
          {isSubmitting ? 'Adding…' : 'Add facility'}
        </button>
      </div>
    </form>
  );
}

function BuildingIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="M3 21h18M6 21V7l6-4 6 4v14M9 9h1M9 13h1M14 9h1M14 13h1M10 21v-4h4v4" />
    </svg>
  );
}
function CloseIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="M18 6L6 18M6 6l12 12" />
    </svg>
  );
}
function CheckIcon() {
  return (
    <svg
      width="13"
      height="13"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
    >
      <path d="M5 13l4 4L19 7" />
    </svg>
  );
}
