
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowUpRight, BarChart3, Clock3, GraduationCap, Receipt, Wallet } from 'lucide-react';
import { ThemeToggle } from '@/components/ThemeToggle';

interface LandingPageProps {
  onGetStarted: () => void;
}

const LandingPage = ({ onGetStarted }: LandingPageProps) => {
  const features = [
    {
      icon: Wallet,
      title: 'Tips vs bank pools',
      description: 'Know what is left in tip cash versus paycheque money after each purchase.',
    },
    {
      icon: Receipt,
      title: 'Expense tracker',
      description: 'Name every purchase, search instantly, and tag rent, transit, textbooks, and more.',
    },
    {
      icon: GraduationCap,
      title: 'Student work-hour guard',
      description: 'Stay under Canada/US international student weekly hour caps while you study.',
    },
    {
      icon: Clock3,
      title: 'Shift & deposit tools',
      description: 'Log daily hours and estimate hours from bi-weekly bank deposits.',
    },
    {
      icon: BarChart3,
      title: 'Clear money insights',
      description: 'See income, spending, and net balance without clutter or fake “enterprise” noise.',
    },
    {
      icon: ArrowUpRight,
      title: 'Built for campus life',
      description: 'CAD/USD ready categories for rent, transit passes, groceries, and tuition fees.',
    },
  ];

  return (
    <div className="min-h-screen bg-app-canvas">
      <header className="sticky top-0 z-50 border-b border-border/60 bg-background/80 backdrop-blur-md">
        <div className="container mx-auto flex items-center justify-between px-4 py-4">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-primary/15 p-2">
              <Wallet className="h-6 w-6 text-primary" />
            </div>
            <span className="font-display text-2xl font-bold tracking-tight">Salary Tracker</span>
          </div>
          <div className="flex items-center gap-3">
            <ThemeToggle />
            <Button onClick={onGetStarted}>Get started</Button>
          </div>
        </div>
      </header>

      <section className="relative overflow-hidden px-4 pb-16 pt-16 sm:pt-24">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,_hsla(173,60%,45%,0.18),_transparent_55%)]" />
        <div className="pointer-events-none absolute -right-20 top-20 h-72 w-72 rounded-full bg-emerald-400/10 blur-3xl" />
        <div className="container relative mx-auto max-w-4xl text-center">
          <p className="mb-4 text-sm font-medium uppercase tracking-[0.2em] text-primary">
            For students in Canada & the US
          </p>
          <h1 className="font-display text-5xl font-bold leading-[1.05] tracking-tight sm:text-6xl md:text-7xl animate-fade-up">
            Salary Tracker
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground sm:text-xl animate-fade-up" style={{ animationDelay: '80ms' }}>
            Track paycheques, tips, and campus expenses in one calm dashboard — and always know
            whether you spent from tips or bank income.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row animate-fade-up" style={{ animationDelay: '140ms' }}>
            <Button size="lg" onClick={onGetStarted} className="min-w-44">
              Start free
            </Button>
            <Button size="lg" variant="outline" onClick={onGetStarted} className="min-w-44">
              Sign in
            </Button>
          </div>
        </div>
      </section>

      <section className="px-4 py-16">
        <div className="container mx-auto">
          <div className="mb-10 max-w-2xl">
            <h2 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">
              Money tools that match student life
            </h2>
            <p className="mt-3 text-muted-foreground">
              Less clutter. More clarity on hours, tips, rent, and what you can still spend.
            </p>
          </div>
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {features.map((feature, index) => (
              <Card
                key={feature.title}
                className="border-border/60 bg-card/70 backdrop-blur-sm transition-transform duration-300 hover:-translate-y-1 animate-fade-up"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <CardHeader>
                  <div className="mb-2 flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10">
                    <feature.icon className="h-5 w-5 text-primary" />
                  </div>
                  <CardTitle className="font-display text-xl">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base leading-relaxed">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="px-4 pb-20">
        <div className="container mx-auto">
          <div className="overflow-hidden rounded-3xl border border-border/60 bg-gradient-to-br from-teal-600 to-emerald-700 p-8 text-white sm:p-12">
            <h2 className="font-display text-3xl font-bold sm:text-4xl">Ready to take control of campus cash?</h2>
            <p className="mt-3 max-w-2xl text-white/85">
              Create an account, log a shift, add an expense, and see your tips vs bank balance update instantly.
            </p>
            <Button
              size="lg"
              onClick={onGetStarted}
              className="mt-6 bg-white text-teal-900 hover:bg-white/90"
            >
              Open your dashboard
            </Button>
          </div>
        </div>
      </section>

      <footer className="border-t border-border/60 px-4 py-10">
        <div className="container mx-auto flex flex-col items-center justify-between gap-3 text-center sm:flex-row sm:text-left">
          <div className="flex items-center gap-2">
            <Wallet className="h-5 w-5 text-primary" />
            <span className="font-display font-semibold">Salary Tracker</span>
          </div>
          <p className="text-sm text-muted-foreground">
            Built for students working tip and campus jobs in Canada & the US.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
