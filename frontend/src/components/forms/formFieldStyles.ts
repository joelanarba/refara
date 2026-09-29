import { CSSProperties } from 'react';

// Shared across modal forms (Add facility, Invite user, etc.) so field
// sizing/spacing stays consistent without relying on the dense
// .form-fields rules in index.css (tuned for 11px dashboard tables).
export const labelStyle: CSSProperties = {
  display: 'block',
  fontSize: 13,
  fontWeight: 600,
  color: '#4a6266',
  marginBottom: 8,
};

export const inputStyle: CSSProperties = {
  width: '100%',
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

export const fieldGroupStyle: CSSProperties = {
  marginBottom: 20,
};
