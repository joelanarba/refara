import { useAuth } from '@/features/auth/useAuth';
import { useState, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';

const DEMO_ACCOUNTS = [
  { label: 'Referring Worker', email: 'referrer@demo.maternalink.org', role: 'REFERRING_WORKER' },
  { label: 'Receiving Worker', email: 'receiver@demo.maternalink.org', role: 'RECEIVING_WORKER' },
  { label: 'Administrator', email: 'admin@demo.maternalink.org', role: 'ADMIN' },
];

export default function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
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

          <button type="button" className="back-link" onClick={() => navigate('/')}>
            <span className="back-arrow">→</span>
            Back to website
          </button>

          <div className="login-heading">
            <p className="eyebrow">WELCOME BACK</p>
            <h2>Sign in to your workspace</h2>
            <p>Use your authorized account to manage and track maternal referrals.</p>
          </div>

          <form onSubmit={handleSubmit}>
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

            <div>
              <div className="password-label">
                <label htmlFor="password">Password</label>
                <button type="button" onClick={() => navigate('/forgot-password')}>
                  Forgot password?
                </button>
              </div>
              <input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            {error && <p style={{ color: '#bd6255', fontSize: 11, margin: 0 }}>{error}</p>}

            <button type="submit" className="primary-button login-button" disabled={loading}>
              {loading ? 'Signing in…' : 'Sign in'}
              <ArrowIcon />
            </button>
          </form>

          <div className="or-divider">or continue with a demo account</div>

          <div className="demo-wrap">
            <button
              type="button"
              className="demo-button"
              onClick={() => setShowDemoMenu((v) => !v)}
            >
              <span className="demo-button-icon">
                <PulseIcon />
              </span>
              <span>
                <strong>Explore demo workspace</strong>
                <small>No password required</small>
              </span>
              <ChevronIcon />
            </button>

            {showDemoMenu && (
              <div className="demo-menu">
                {DEMO_ACCOUNTS.map((acc) => (
                  <button key={acc.email} type="button" onClick={() => handleDemoSelect(acc.email)}>
                    <span className="demo-button-icon">
                      <PulseIcon />
                    </span>
                    <span>
                      <strong>{acc.label}</strong>
                      <small>{acc.email}</small>
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>

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

/* --- inline icons (swap for lucide-react if you install it) --- */
function HeartIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
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
    >
      <path d="M12 2l8 4v6c0 5-3.5 8.5-8 10-4.5-1.5-8-5-8-10V6l8-4z" />
    </svg>
  );
}
