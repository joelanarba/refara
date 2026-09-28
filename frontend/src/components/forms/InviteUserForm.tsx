import { FormEvent, useState } from 'react';
import { ROLE_LABELS, ROLES } from '../../constants/roles';
import type { UserRole } from '../../types';

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
      await new Promise((resolve) => setTimeout(resolve, 500));
      onSuccess?.();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form className="form-panel" onSubmit={handleSubmit}>
      <div className="form-header">
        <div>
          <h2>Invite user</h2>
          <p>Send a workspace invitation to a new team member.</p>
        </div>

        {onCancel && (
          <button type="button" className="ghost-button" onClick={onCancel}>
            Close
          </button>
        )}
      </div>

      {error && <p className="form-error">{error}</p>}

      <div className="form-fields">
        <label className="full-field">
          Full name
          <input
            type="text"
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder="Full name"
          />
        </label>

        <label className="full-field">
          Email address
          <input
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="name@healthnetwork.org"
          />
        </label>

        <label>
          Role
          <select value={role} onChange={(event) => setRole(event.target.value as UserRole)}>
            <option value="">Select a role</option>
            {Object.values(ROLES).map((value) => (
              <option key={value} value={value}>
                {ROLE_LABELS[value]}
              </option>
            ))}
          </select>
        </label>

        <label>
          Facility
          <select value={facilityId} onChange={(event) => setFacilityId(event.target.value)}>
            <option value="">Select a facility</option>
            <option value="pending">Facility selection coming soon</option>
          </select>
        </label>
      </div>

      <div className="form-footer">
        {onCancel && (
          <button type="button" className="secondary-button" onClick={onCancel}>
            Cancel
          </button>
        )}

        <button type="submit" className="primary-button" disabled={isSubmitting}>
          {isSubmitting ? 'Sending...' : 'Send invitation'}
        </button>
      </div>
    </form>
  );
}
