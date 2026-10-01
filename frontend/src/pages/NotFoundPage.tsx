import { Link } from 'react-router-dom';
import { ROUTES } from '../constants/routes';

export default function NotFoundPage() {
  return (
    <div className="grid min-h-screen place-items-center p-6 text-center">
      <div>
        <p className="text-[11px] font-bold tracking-[0.14em] text-[#8c9d9f] uppercase">
          Error 404
        </p>

        <h1 className="mt-3 mb-2 font-display text-[32px] font-bold tracking-tight text-[#253b42]">
          Page not found
        </h1>

        <p className="mb-6 text-[15px] text-[#6b7d87]">
          The page you're looking for doesn't exist or has been moved.
        </p>

        <Link
          to={ROUTES.DASHBOARD}
          className="inline-flex items-center justify-center rounded-xl bg-[#3e8995] px-5 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-[#327581] active:bg-[#2d6d78] focus:outline-none focus:ring-4 focus:ring-[#3e8995]/20"
        >
          Back to dashboard
        </Link>
      </div>
    </div>
  );
}
