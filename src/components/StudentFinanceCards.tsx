import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { useSalaryEntries } from '@/hooks/useSalaryEntries';
import { useDailyHours } from '@/hooks/useDailyHours';
import { useExpenses } from '@/hooks/useExpenses';
import { useStudentPrefs } from '@/hooks/useStudentPrefs';
import { formatCurrency, getWeekBounds } from '@/lib/utils';
import { AlertTriangle, Banknote, Clock3, GraduationCap, Wallet } from 'lucide-react';

export const MoneyPoolsCard = () => {
  const { entries } = useSalaryEntries();
  const { totals } = useExpenses();
  const { prefs } = useStudentPrefs();

  const bankIncome = entries.reduce((sum, e) => sum + Number(e.base_salary || 0), 0);
  const tipsIncome = entries.reduce((sum, e) => sum + Number(e.tips || 0), 0);
  const bankLeft = Math.max(0, bankIncome - totals.fromBank);
  const tipsLeft = Math.max(0, tipsIncome - totals.fromTips);
  const net = bankIncome + tipsIncome - totals.total;

  return (
    <Card className="overflow-hidden border-border/60">
      <CardHeader className="bg-gradient-to-r from-teal-500/10 via-transparent to-emerald-500/10">
        <CardTitle className="font-display text-xl">Money Pools</CardTitle>
        <CardDescription>
          See what is left in tips vs bank after expenses — built for tip-heavy student jobs
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4 pt-6 sm:grid-cols-3">
        <div className="rounded-2xl border bg-amber-50/70 p-4 dark:bg-amber-950/20">
          <div className="mb-2 flex items-center gap-2 text-sm text-amber-800 dark:text-amber-300">
            <Wallet className="h-4 w-4" /> Tips remaining
          </div>
          <div className="font-display text-2xl font-semibold">
            {formatCurrency(tipsLeft, prefs.preferred_currency)}
          </div>
          <p className="mt-1 text-xs text-muted-foreground">
            Earned {formatCurrency(tipsIncome, prefs.preferred_currency)} · spent{' '}
            {formatCurrency(totals.fromTips, prefs.preferred_currency)}
          </p>
        </div>
        <div className="rounded-2xl border bg-emerald-50/70 p-4 dark:bg-emerald-950/20">
          <div className="mb-2 flex items-center gap-2 text-sm text-emerald-800 dark:text-emerald-300">
            <Banknote className="h-4 w-4" /> Bank remaining
          </div>
          <div className="font-display text-2xl font-semibold">
            {formatCurrency(bankLeft, prefs.preferred_currency)}
          </div>
          <p className="mt-1 text-xs text-muted-foreground">
            Earned {formatCurrency(bankIncome, prefs.preferred_currency)} · spent{' '}
            {formatCurrency(totals.fromBank, prefs.preferred_currency)}
          </p>
        </div>
        <div className="rounded-2xl border bg-background p-4">
          <div className="mb-2 text-sm text-muted-foreground">Net after expenses</div>
          <div
            className={`font-display text-2xl font-semibold ${
              net >= 0 ? 'text-emerald-600' : 'text-destructive'
            }`}
          >
            {formatCurrency(net, prefs.preferred_currency)}
          </div>
          <p className="mt-1 text-xs text-muted-foreground">Income minus all tracked spending</p>
        </div>
      </CardContent>
    </Card>
  );
};

export const WorkHourGuard = () => {
  const { entries } = useSalaryEntries();
  const { dailyHours } = useDailyHours();
  const { prefs } = useStudentPrefs();
  const { start, end } = getWeekBounds();

  const salaryWeekHours = entries
    .filter((e) => {
      const d = new Date(e.start_date);
      return d >= start && d <= end;
    })
    .reduce((sum, e) => sum + Number(e.hours_worked || 0) + Number(e.extra_hours || 0), 0);

  const dailyWeekHours = dailyHours
    .filter((e) => {
      const d = new Date(e.date);
      return d >= start && d <= end;
    })
    .reduce((sum, e) => sum + Number(e.hours_worked || 0), 0);

  // Prefer detailed daily logs when present for this week
  const weekHours = dailyWeekHours > 0 ? dailyWeekHours : salaryWeekHours;
  const cap =
    prefs.student_status === 'international'
      ? prefs.weekly_hour_cap || 20
      : prefs.weekly_hour_cap || 40;
  const pct = Math.min(100, (weekHours / cap) * 100);
  const over = weekHours > cap;

  const regionLabel = prefs.region === 'CA' ? 'Canada' : 'United States';
  const tip =
    prefs.student_status === 'international'
      ? prefs.region === 'CA'
        ? 'Intl. students in Canada are generally capped near 20 hrs/week off-campus during studies (rules can change — verify with IRCC).'
        : 'F-1 students in the US are typically limited to 20 hrs/week on-campus during the semester (check your DSO / CPT rules).'
      : 'Set your own weekly hour goal to protect study time.';

  return (
    <Card className="border-border/60">
      <CardHeader>
        <div className="flex items-start justify-between gap-3">
          <div>
            <CardTitle className="flex items-center gap-2 font-display text-xl">
              <GraduationCap className="h-5 w-5 text-primary" />
              Student Work Cap
            </CardTitle>
            <CardDescription className="mt-1">{tip}</CardDescription>
          </div>
          <Badge variant="secondary">
            {regionLabel} · {prefs.student_status}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-end justify-between">
          <div>
            <p className="text-sm text-muted-foreground">This week</p>
            <p className="font-display text-3xl font-semibold">
              {weekHours.toFixed(1)}
              <span className="text-lg text-muted-foreground"> / {cap}h</span>
            </p>
          </div>
          {over ? (
            <div className="flex items-center gap-1 text-sm font-medium text-destructive">
              <AlertTriangle className="h-4 w-4" /> Over cap
            </div>
          ) : (
            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              <Clock3 className="h-4 w-4" /> {(cap - weekHours).toFixed(1)}h left
            </div>
          )}
        </div>
        <Progress value={pct} className={over ? '[&>div]:bg-destructive' : ''} />
      </CardContent>
    </Card>
  );
};
