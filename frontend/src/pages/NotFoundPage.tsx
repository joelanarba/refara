import { Link } from 'react-router-dom';
import { ROUTES } from '../constants/routes';

export default function NotFoundPage() {
  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'grid',
        placeItems: 'center',
        padding: 24,
        textAlign: 'center',
      }}
    >
      <div>
        <p className="eyebrow">ERROR 404</p>
        <h1
          style={{
            fontFamily: "'Manrope', sans-serif",
            fontSize: 32,
            letterSpacing: -1,
            color: '#253b42',
            margin: '12px 0 8px',
          }}
        >
          Page not found
        </h1>
        <p className="subheading" style={{ marginBottom: 24 }}>
          The page you're looking for doesn't exist or has been moved.
        </p>
        <Link to={ROUTES.DASHBOARD} className="primary-button">
          Back to dashboard
        </Link>
      </div>
    </div>
  );
}
