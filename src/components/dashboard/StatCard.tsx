import { TrendingUp, TrendingDown } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface StatCardProps {
  title: string;
  value: string | number;
  unit?: string;
  trend?: number;
  trendLabel?: string;
  icon: LucideIcon;
  iconColor?: string;
  iconBgColor?: string;
}

export function StatCard({
  title,
  value,
  unit,
  trend,
  trendLabel,
  icon: Icon,
  iconColor = 'text-cyan-500',
  iconBgColor = 'bg-cyan-500/10',
}: StatCardProps) {
  const isPositive = trend && trend > 0;
  const isNegative = trend && trend < 0;

  return (
    <Card className="border-slate-200 dark:border-slate-700">
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
              {title}
            </p>
            <div className="mt-2 flex items-baseline gap-1">
              <span className="text-3xl font-bold text-slate-900 dark:text-white">
                {value}
              </span>
              {unit && (
                <span className="text-sm text-slate-500 dark:text-slate-400">
                  {unit}
                </span>
              )}
            </div>
            {trend !== undefined && (
              <div className="mt-2 flex items-center gap-1">
                {isPositive ? (
                  <TrendingUp className="h-4 w-4 text-emerald-500" />
                ) : isNegative ? (
                  <TrendingDown className="h-4 w-4 text-emerald-500" />
                ) : null}
                <span
                  className={cn(
                    'text-sm font-medium',
                    isPositive
                      ? 'text-red-500'
                      : isNegative
                      ? 'text-emerald-500'
                      : 'text-slate-500'
                  )}
                >
                  {isPositive ? '+' : ''}
                  {trend}
                </span>
                {trendLabel && (
                  <span className="text-sm text-slate-500 dark:text-slate-400">
                    {trendLabel}
                  </span>
                )}
              </div>
            )}
          </div>
          <div
            className={cn(
              'flex h-12 w-12 items-center justify-center rounded-xl',
              iconBgColor
            )}
          >
            <Icon className={cn('h-6 w-6', iconColor)} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
