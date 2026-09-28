import { ReactNode } from 'react';
import { formatDate } from '../../../utils';

interface DashboardHeaderProps {
  eyebrow: string;
  title: ReactNode;
  subtitle: string;
  action?: ReactNode;
}

export default function DashboardHeader({
  eyebrow,
  title,
  subtitle,
  action,
}: DashboardHeaderProps) {
  return (
    <div className="page-heading">
      <div>
        <p className="eyebrow">{eyebrow}</p>
        <h1>{title}</h1>
        <p className="subheading">{subtitle}</p>
      </div>
      <div className="heading-actions">
        <span className="date-pill">
          <CalendarIcon />
          {formatDate()}
        </span>
        {action}
      </div>
    </div>
  );
}

function CalendarIcon() {
  return (
    <svg
      width="13"
      height="13"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 3" />
    </svg>
  );
}
