import { ReactNode } from 'react';

interface StatsCardProps {
  icon: ReactNode;
  iconVariant: 'blue' | 'amber' | 'green' | 'coral';
  label: string;
  value: number | string;
  trend?: { text: string; direction: 'up' | 'warn' | 'muted' };
}

export default function StatsCard({ icon, iconVariant, label, value, trend }: StatsCardProps) {
  return (
    <div className="metric-card">
      <span className={`metric-icon ${iconVariant}`}>{icon}</span>
      <p>{label}</p>
      <strong>{String(value).padStart(2, '0')}</strong>
      {trend && <span className={`trend-${trend.direction}`}>{trend.text}</span>}
    </div>
  );
}
