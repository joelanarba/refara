import { FormEvent, useState, useEffect } from 'react';
import { ROLE_LABELS, ROLES } from '../../constants/roles';
import type { UserRole } from '../../types';

import { createUser } from '../../features/users/userService';
import { getFacilities } from '../../features/facilities/facilityService';
import type { FacilitySummary } from '../../features/facilities/types';
import { labelStyle, inputStyle, fieldGroupStyle } from './formFieldStyles';

interface InviteUserFormProps {
  onCancel?: () => void;
  onSuccess?: () => void;
}

export default function InviteUserForm({ onCancel, onSuccess }: InviteUserFormProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<UserRole | ''>('');
  const [facilityId, setFacilityId] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [facilities, setFacilities] = useState<FacilitySummary[]>([]);
  const [isLoadingFacilities, setIsLoadingFacilities] = useState(true);

  useEffect(() => {
    getFacilities()
      .then((data) => {
        setFacilities(data);
      })
      .catch(() => {
        setError('Failed to load facilities.');
      })
      .finally(() => {
        setIsLoadingFacilities(false);
      });
  }, []);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');

    if (!name.trim()) {
      setError('Full name is required.');
      return;
    }

    if (!email.trim()) {
      setError('Email address is required.');
      return;
    }

    if (!role) {
      setError('Please select a role.');
      return;
    }

    if (!facilityId) {
      setError('Please select a facility.');
      return;
    }

    setIsSubmitting(true);

    try {
      await createUser({ name, email, role, facilityId });
      onSuccess?.();
    } catch (err: any) {
      setError(err.message || 'Failed to create user. Please try again.');
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
          <UserPlusIcon />
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
            Invite user
          </h2>
          <p style={{ margin: '4px 0 0', color: '#87979a', fontSize: 12.5, lineHeight: 1.4 }}>
            Send a workspace invitation to a new team member.
          </p>
        </div>

        {onCancel && (
          <button
            type="button"
            className="icon-button"
            onClick={onCancel}
            aria-label="Close"
            style={{ marginTop: -4, marginRight: -4 }}
          >
            <CloseIcon />
          </button>
        )}
      </div>

      {error && (
        <p style={{ color: '#bd6255', fontSize: 13, margin: '0 0 16px', fontWeight: 500 }}>
          {error}
        </p>
      )}

      <div style={fieldGroupStyle}>
        <label style={labelStyle} htmlFor="inviteName">
          Full name
        </label>
        <input
          id="inviteName"
          type="text"
          placeholder="e.g. Abena Sarkodie"
          value={name}
          onChange={(event) => setName(event.target.value)}
          style={inputStyle}
        />
      </div>

      <div style={fieldGroupStyle}>
        <label style={labelStyle} htmlFor="inviteEmail">
          Email address
        </label>
        <div style={{ position: 'relative' }}>
          <span
            style={{
              position: 'absolute',
              left: 14,
              top: '50%',
              transform: 'translateY(-50%)',
              color: '#a6b2b3',
              display: 'flex',
              pointerEvents: 'none',
            }}
          >
            <MailIcon />
          </span>
          <input
            id="inviteEmail"
            type="email"
            placeholder="name@healthnetwork.org"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            style={{ ...inputStyle, paddingLeft: 40 }}
          />
        </div>
      </div>

      <div style={fieldGroupStyle}>
        <label style={labelStyle} htmlFor="inviteRole">
          Role
        </label>
        <select
          id="inviteRole"
          value={role}
          onChange={(event) => setRole(event.target.value as UserRole)}
          style={{ ...inputStyle, color: role ? '#2a4148' : '#a6b2b3' }}
        >
          <option value="" disabled>
            Select a role
          </option>
          {Object.values(ROLES).map((value) => (
            <option key={value} value={value}>
              {ROLE_LABELS[value]}
            </option>
          ))}
        </select>
      </div>

      <div style={{ ...fieldGroupStyle, marginBottom: 8 }}>
        <label style={labelStyle} htmlFor="inviteFacility">
          Facility
        </label>
        <select
          id="inviteFacility"
          value={facilityId}
          onChange={(event) => setFacilityId(event.target.value)}
          disabled={isLoadingFacilities}
          style={{ ...inputStyle, color: facilityId ? '#2a4148' : '#a6b2b3' }}
        >
          <option value="" disabled>
            {isLoadingFacilities ? 'Loading facilities...' : 'Select a facility'}
          </option>
          {facilities.map((fac) => (
            <option key={fac.id} value={fac.id}>
              {fac.name}
            </option>
          ))}
        </select>
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
        {onCancel && (
          <button
            type="button"
            className="secondary-button"
            onClick={onCancel}
            disabled={isSubmitting}
            style={{ fontSize: 13, padding: '11px 18px' }}
          >
            Cancel
          </button>
        )}

        <button
          type="submit"
          className="primary-button"
          disabled={isSubmitting}
          style={{ fontSize: 13, padding: '11px 18px' }}
        >
          <MailIcon />
          {isSubmitting ? 'Sending...' : 'Send invitation'}
        </button>
      </div>
    </form>
  );
}

function UserPlusIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM19 8v6M22 11h-6" />
    </svg>
  );
}
function MailIcon() {
  return (
    <svg
      width="15"
      height="15"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <rect x="2" y="4" width="20" height="16" rx="2" />
      <path d="M2 7l10 6 10-6" />
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
