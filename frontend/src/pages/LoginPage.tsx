import { useAuth } from '@/features/auth/useAuth';
import { useState, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';

const DEMO_ACCOUNTS = [
  { label: 'Healthcare Worker', email: 'grace@refara.com', role: 'WORKER' },
  { label: 'Administrator', email: 'admin@refara.com', role: 'ADMIN' },
];

const eyebrow = 'text-sm font-bold leading-tight tracking-[1.5px]';
const inputCls =
  'mt-2 block h-[43px] w-full rounded-[7px] border border-[#dfe8e8] bg-[#fbfdfd] px-[13px] text-base text-[#3c5559] outline-none focus:border-[#74b6ba] focus:ring-[3px] focus:ring-[#eaf5f5]';
const avatarCls =
  'ml-[-5px] grid size-[29px] place-items-center rounded-full border-2 border-brand-deep text-[11px] first:ml-0';

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
      await login(demoEmail, 'password123');
      navigate('/dashboard');
    } catch (_err) {
      setError('Demo login failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white md:grid md:grid-cols-[46%_54%] min-[1100px]:grid-cols-[52%_48%]">
      {/* Left panel — brand art */}
      <div
        className="relative hidden flex-col overflow-hidden bg-brand-deep px-[8%] py-[42px] text-white
          before:absolute before:-top-[120px] before:-right-[270px] before:size-[560px] before:rounded-full before:border before:border-white/10 before:content-['']
          after:absolute after:-top-[205px] after:-right-[405px] after:size-[730px] after:rounded-full after:border after:border-white/10 after:content-['']
          md:flex min-[1100px]:px-[9%]"
      >
        <div className="absolute -bottom-40 -left-[220px] h-[400px] w-[600px] rounded-full bg-[#7dcdc4]/13 blur-[4px]" />

        <Brand light className="relative z-[1]" />

        <div className="relative z-[1] flex max-w-[490px] flex-1 flex-col justify-center">
          <div>
            <p className={`${eyebrow} flex items-center gap-[9px] text-[#acd9d5]`}>
              <span className="h-px w-[23px] bg-[#8acbc7]" />
              MATERNAL CARE COORDINATION
            </p>
            <h1 className="mt-[22px] mb-5 font-display text-[clamp(36px,4vw,58px)] leading-[1.1] font-bold tracking-[-2.5px]">
              Every referral.
              <br />
              <em className="not-italic text-[#9ed2cd]">One connected</em>
              <br />
              journey.
            </h1>
            <p className="max-w-[410px] text-[17px] leading-[1.7] text-[#c0e0dd]">
              Helping care teams move mothers safely through the referral pathway — with clarity,
              speed, and compassion.
            </p>
          </div>

          <div className="mt-16 flex items-center gap-[13px]">
            <div className="flex items-center">
              <span className={`${avatarCls} bg-[#d0e8e4] text-[#367681]`}>AM</span>
              <span className={`${avatarCls} bg-[#f7dcd2] text-[#a96555]`}>KA</span>
              <span className={`${avatarCls} bg-[#d8ebdb] text-[#527a65]`}>NO</span>
              <b className={`${avatarCls} bg-white/10 font-medium text-[#c3e4df]`}>+12</b>
            </div>
            <div>
              <strong className="block text-[15px]">Trusted by care teams</strong>
              <small className="mt-[3px] block text-sm text-[#9dceca]">
                Across the Central Health Network
              </small>
            </div>
          </div>
        </div>

        <div className="relative z-[1] hidden gap-3.5 text-sm text-[#9dceca] sm:flex">
          <span>Built for better maternal outcomes</span>
          <span>•</span>
          <span>Ghana Health Service</span>
        </div>
      </div>

      {/* Right panel — form */}
      <div className="flex min-h-screen flex-col">
        <div className="m-auto w-[min(390px,calc(100%-40px))] md:w-[min(390px,82%)]">
          <Brand className="mb-[54px] md:hidden" />

          <div>
            <p className={`${eyebrow} text-[#58a0a4]`}>WELCOME BACK</p>
            <h2 className="mt-[11px] mb-2 font-display text-[26px] font-bold tracking-[-1px] text-[#243f46]">
              Sign in to your workspace
            </h2>
            <p className="mb-[29px] text-base leading-[1.6] text-[#95a4a6]">
              Use your authorized account to manage and track maternal referrals.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="grid gap-[18px]">
            <div>
              <label htmlFor="email" className="text-[15px] font-bold text-[#61777b]">
                Work email
              </label>
              <input
                id="email"
                type="email"
                placeholder="you@healthnetwork.org"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className={inputCls}
              />
            </div>

            <div>
              <div className="flex justify-between">
                <label htmlFor="password" className="text-[15px] font-bold text-[#61777b]">
                  Password
                </label>
                {/* <button
                  type="button"
                  onClick={() => navigate('/forgot-password')}
                  className="text-sm text-[#438e98]"
                >
                  Forgot password?
                </button> */}
              </div>
              <input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className={inputCls}
              />
            </div>

            {error && <p className="m-0 text-sm text-[#bd6255]">{error}</p>}

            <button
              type="submit"
              disabled={loading}
              className="mt-0.5 inline-flex h-[43px] w-full items-center justify-center gap-2 rounded-lg bg-brand px-[17px] text-[15px] font-bold text-white shadow-[0_7px_14px_rgba(62,137,149,0.16)] transition hover:-translate-y-px hover:bg-brand-dark"
            >
              {loading ? 'Signing in…' : 'Sign in'}
              <ArrowIcon />
            </button>
          </form>

          {/* Demo account section */}
          <div className="mt-7 mb-4 flex items-center gap-[9px] text-sm text-[#a6b2b3] before:h-px before:flex-1 before:bg-[#edf1f1] before:content-[''] after:h-px after:flex-1 after:bg-[#edf1f1] after:content-['']">
            or continue with a demo account
          </div>

          <div className="relative">
            <button
              type="button"
              onClick={() => setShowDemoMenu((v) => !v)}
              className="flex w-full items-center gap-[11px] rounded-lg border border-[#dfe9e9] bg-white px-3 py-2.5 text-left text-[#7a8d90] hover:border-[#a8cecf] hover:bg-[#fbfefe]"
            >
              <DemoIconBox />
              <span className="flex-1">
                <strong className="block text-[15px] text-[#45666c]">Explore demo workspace</strong>
                <small className="mt-[3px] block text-xs text-[#9aa8aa]">
                  No password required
                </small>
              </span>
              <ChevronIcon />
            </button>

            {showDemoMenu && (
              <div className="absolute inset-x-0 bottom-[calc(100%+7px)] z-[3] rounded-lg border border-[#dfe9e9] bg-white p-[5px] shadow-[0_12px_25px_rgba(32,70,74,0.12)]">
                {DEMO_ACCOUNTS.map((acc) => (
                  <button
                    key={acc.email}
                    type="button"
                    onClick={() => handleDemoSelect(acc.email)}
                    className="flex w-full items-center gap-[9px] rounded-md px-[7px] py-[9px] text-left hover:bg-[#f3f8f8]"
                  >
                    <DemoIconBox />
                    <span className="min-w-0 flex-1">
                      <strong className="block truncate text-sm text-[#45636a]">{acc.label}</strong>
                      <small className="mt-[3px] block truncate text-[11px] text-[#99a8aa]">
                        {acc.email}
                      </small>
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>


          <div className="mt-[22px] flex items-center justify-center gap-1.5 text-xs text-[#9eacad]">
            <span className="text-[#63a283]">
              <ShieldIcon />
            </span>
            Your information is protected with role-based access
          </div>
        </div>

        <div className="flex justify-center gap-[19px] p-[26px] pb-[18px] text-xs text-[#a5b1b2] md:p-[26px]">
          <span>© 2026 Refera</span>
          <span className="text-[#6e989d]">Privacy</span>
          <span className="text-[#6e989d]">Help centre</span>
        </div>
      </div>
    </div>
  );
}

function Brand({ light = false, className = '' }: { light?: boolean; className?: string }) {
  return (
    <div
      className={`flex items-center gap-2.5 font-display text-[22px] font-extrabold tracking-[-0.8px] ${
        light ? 'text-white' : 'text-[#1d3d44]'
      } ${className}`}
    >
      <span className="grid size-[34px] place-items-center rounded-[11px] bg-[#3f8995] text-white shadow-[0_5px_14px_rgba(63,137,149,0.24)]">
        <HeartIcon />
      </span>
      <span>
        Refe<span className={light ? 'text-[#a3d7d1]' : 'text-[#4593a1]'}>ra</span>
      </span>
    </div>
  );
}

/* --- inline icons (swap for lucide-react if you install it) --- */
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
function DemoIconBox() {
  return (
    <span className="grid size-[29px] place-items-center rounded-[7px] bg-[#e7f4f3] text-[#4b929a]">
      <PulseIcon />
    </span>
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



