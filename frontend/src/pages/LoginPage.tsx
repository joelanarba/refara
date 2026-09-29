import { useAuth } from '@/features/auth/useAuth';
import { useState, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';

const DEMO_ACCOUNTS = [
  {
    label: 'Referring Worker',
    email: 'referrer@demo.maternalink.org',
    role: 'REFERRING_WORKER',
  },
  {
    label: 'Receiving Worker',
    email: 'receiver@demo.maternalink.org',
    role: 'RECEIVING_WORKER',
  },
  {
    label: 'Administrator',
    email: 'admin@demo.maternalink.org',
    role: 'ADMIN',
  },
];

export default function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showDemoMenu, setShowDemoMenu] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (_err) {
      setError('Invalid email or password.');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoSelect = async (demoEmail: string) => {
    setShowDemoMenu(false);
    setLoading(true);
    setError(null);

    try {
      await login(demoEmail, 'demo');
      navigate('/dashboard');
    } catch (_err) {
      setError('Demo login failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      {/* Left panel — brand art */}
      <div className="login-art">
        <div className="art-glow" />

        <div className="brand-mark brand-light">
          <span className="brand-icon">
            <HeartIcon />
          </span>

          <span>
            Materna<span>Link</span>
          </span>
        </div>

        <div className="art-content">
          <div className="art-copy">
            <p className="eyebrow">
              <span />
              MATERNAL CARE COORDINATION
            </p>

            <h1>
              Every referral.
              <br />
              <em>One connected</em>
              <br />
              journey.
            </h1>

            <p>
              Helping care teams move mothers safely through the referral pathway — with clarity,
              speed, and compassion.
            </p>
          </div>

          <div className="art-stat">
            <div className="stat-avatars">
              <span>AM</span>
              <span>KA</span>
              <span>NO</span>
              <b>+12</b>
            </div>

            <div>
              <strong>Trusted by care teams</strong>
              <small>Across the Central Health Network</small>
            </div>
          </div>
        </div>

        <div className="art-footer">
          <span>Built for better maternal outcomes</span>
          <span>•</span>
          <span>Ghana Health Service</span>
        </div>
      </div>

      {/* Right panel — form */}
      <div className="login-panel">
        <div className="login-inner">
          <div className="mobile-brand brand-mark">
            <span className="brand-icon">
              <HeartIcon />
            </span>

            <span>
              Materna<span>Link</span>
            </span>
          </div>

          <div className="login-heading">
            <p className="eyebrow">WELCOME BACK</p>

            <h2>Sign in to your workspace</h2>

            <p>Use your authorized account to manage and track maternal referrals.</p>
          </div>

          <form onSubmit={handleSubmit}>
            {/* Email */}
            <div>
              <label htmlFor="email">Work email</label>

              <input
                id="email"
                type="email"
                placeholder="you@healthnetwork.org"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            {/* Password */}
            <div>
              <div className="password-label">
                <label htmlFor="password">Password</label>

                <button type="button" onClick={() => navigate('/forgot-password')}>
                  Forgot password?
                </button>
              </div>

              <div className="password-input-wrap">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />

                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowPassword((prev) => !prev)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  aria-pressed={showPassword}
                >
                  <EyeIcon open={showPassword} />
                </button>
              </div>
            </div>

            {/* Error */}
            {error && (
              <p
                style={{
                  color: '#bd6255',
                  fontSize: 11,
                  margin: 0,
                }}
                role="alert"
              >
                {error}
              </p>
            )}

            {/* Submit */}
            <button type="submit" className="primary-button login-button" disabled={loading}>
              {loading ? 'Signing in…' : 'Sign in'}
              <ArrowIcon />
            </button>
          </form>

          <div className="or-divider">or continue with a demo account</div>

          {/* Demo account section currently disabled */}

          <div className="login-security">
            <ShieldIcon />
            Your information is protected with role-based access
          </div>
        </div>

        <div className="login-bottom">
          <span>© 2026 MaternaLink</span>
          <span>Privacy</span>
          <span>Help centre</span>
        </div>
      </div>
    </div>
  );
}

function HeartIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 21s-6.7-4.35-9.3-8.28C.86 9.94 1.6 6.4 4.6 5.1c2.1-.9 4.3-.1 5.6 1.6.4.5.7 1 .8 1.3.1-.3.4-.8.8-1.3 1.3-1.7 3.5-2.5 5.6-1.6 3 1.3 3.74 4.84 1.9 7.62C18.7 16.65 12 21 12 21z" />
    </svg>
  );
}

function ArrowIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      aria-hidden="true"
    >
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  );
}

function ChevronIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      aria-hidden="true"
    >
      <path d="M6 9l6 6 6-6" />
    </svg>
  );
}

function PulseIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      aria-hidden="true"
    >
      <path d="M3 12h4l2 8 4-16 2 8h6" />
    </svg>
  );
}

function ShieldIcon() {
  return (
    <svg
      width="12"
      height="12"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      aria-hidden="true"
    >
      <path d="M12 2l8 4v6c0 5-3.5 8.5-8 10-4.5-1.5-8-5-8-10V6l8-4z" />
    </svg>
  );
}

function EyeIcon({ open }: { open: boolean }) {
  if (open) {
    return (
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
        <path d="M2.06 12.35a1 1 0 0 1 0-.7C3.6 7.8 7.5 5 12 5c4.5 0 8.4 2.8 9.94 6.65a1 1 0 0 1 0 .7C20.4 16.2 16.5 19 12 19c-4.5 0-8.4-2.8-9.94-6.65Z" />
        <circle cx="12" cy="12" r="3" />
      </svg>
    );
  }

  return (
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
      <path d="M3 3l18 18" />
      <path d="M10.58 10.58a2 2 0 0 0 2.83 2.83" />
      <path d="M9.88 4.24A9.77 9.77 0 0 1 12 4c4.5 0 8.4 2.8 9.94 6.65a1 1 0 0 1 0 .7 10.3 10.3 0 0 1-4.12 4.73" />
      <path d="M6.61 6.61A10.3 10.3 0 0 0 2.06 11.3a1 1 0 0 0 0 .7C3.6 16.2 7.5 19 12 19a9.77 9.77 0 0 0 2.12-.24" />
    </svg>
  );
}
