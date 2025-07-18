
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowUp, BarChart, TrendingUp, DollarSign, Users, Calendar, Star } from 'lucide-react';
import { ThemeToggle } from '@/components/ThemeToggle';

interface LandingPageProps {
  onGetStarted: () => void;
}

const LandingPage = ({ onGetStarted }: LandingPageProps) => {
  const features = [
    {
      icon: DollarSign,
      title: "Track Your Earnings",
      description: "Monitor your salary, tips, and total income with precision and ease."
    },
    {
      icon: BarChart,
      title: "Detailed Analytics",
      description: "Get comprehensive insights into your earning patterns and trends."
    },
    {
      icon: TrendingUp,
      title: "Growth Tracking",
      description: "Watch your income grow over time with weekly and monthly summaries."
    },
    {
      icon: Calendar,
      title: "Time Management",
      description: "Track hours worked and calculate your effective hourly rate."
    },
    {
      icon: Users,
      title: "Secure & Private",
      description: "Your financial data is encrypted and stored securely with Supabase."
    },
    {
      icon: Star,
      title: "Real-time Updates",
      description: "See your data update instantly across all your devices."
    }
  ];

  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "Freelance Designer",
      content: "This app has completely transformed how I track my income. The insights are invaluable!"
    },
    {
      name: "Mike Chen",
      role: "Restaurant Server",
      content: "Perfect for tracking tips and hours. I can finally see my earning patterns clearly."
    },
    {
      name: "Emma Davis",
      role: "Consultant",
      content: "The analytics feature helps me make better decisions about my rates and time."
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-card to-muted">
      {/* Header */}
      <header className="border-b bg-card/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <DollarSign className="h-6 w-6 text-primary" />
            </div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
              Salary Tracker
            </h1>
          </div>
          <div className="flex items-center space-x-4">
            <ThemeToggle />
            <Button onClick={onGetStarted} className="financial-gradient text-white hover:opacity-90 shadow-lg">
              Get Started
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary via-accent to-primary/70 bg-clip-text text-transparent leading-tight">
              Professional Financial Management
            </h2>
            <p className="text-xl md:text-2xl text-muted-foreground mb-8 leading-relaxed">
              Enterprise-grade salary tracking with advanced analytics, real-time insights, 
              and intelligent reporting for modern professionals.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                onClick={onGetStarted}
                className="financial-gradient text-white px-8 py-4 text-lg shadow-xl hover:shadow-2xl transition-all duration-300"
              >
                Start Tracking Now
                <ArrowUp className="ml-2 h-5 w-5" />
              </Button>
              <Button size="lg" variant="outline" className="px-8 py-4 text-lg border-2 border-primary/20 hover:border-primary/40">
                View Demo
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 bg-card/30">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h3 className="text-4xl font-bold mb-4 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Professional Features
            </h3>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Enterprise-grade tools designed for financial professionals and individuals who demand excellence
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="financial-card hover:shadow-xl transition-all duration-300 group">
                <CardHeader>
                  <div className="flex items-center space-x-3">
                    <div className="p-3 financial-gradient rounded-xl group-hover:scale-110 transition-transform duration-300">
                      <feature.icon className="h-6 w-6 text-white" />
                    </div>
                    <CardTitle className="text-xl font-semibold">{feature.title}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base leading-relaxed">{feature.description}</CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div className="metric-card text-center">
              <div className="currency-display bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                25,000+
              </div>
              <p className="text-muted-foreground font-medium">Professionals Trust Us</p>
            </div>
            <div className="metric-card text-center">
              <div className="currency-display bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                $50M+
              </div>
              <p className="text-muted-foreground font-medium">Income Tracked</p>
            </div>
            <div className="metric-card text-center">
              <div className="currency-display bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                99.9%
              </div>
              <p className="text-muted-foreground font-medium">Uptime SLA</p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 px-4 bg-card/30">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h3 className="text-4xl font-bold mb-4 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Trusted by Professionals
            </h3>
            <p className="text-xl text-muted-foreground">Real feedback from financial professionals worldwide</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="financial-card hover:shadow-xl transition-all duration-300">
                <CardContent className="pt-6">
                  <div className="space-y-4">
                    <p className="text-muted-foreground italic text-lg leading-relaxed">"{testimonial.content}"</p>
                    <div className="pt-4 border-t border-border">
                      <p className="font-semibold text-foreground">{testimonial.name}</p>
                      <p className="text-sm text-primary font-medium">{testimonial.role}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center">
          <div className="max-w-3xl mx-auto space-y-8 metric-card">
            <h3 className="text-4xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Ready to Transform Your Financial Management?
            </h3>
            <p className="text-xl text-muted-foreground leading-relaxed">
              Join over 25,000 professionals who trust Salary Tracker for their income management. 
              Start your financial journey today with our comprehensive analytics platform.
            </p>
            <Button 
              size="lg" 
              onClick={onGetStarted}
              className="financial-gradient text-white px-12 py-4 text-lg shadow-xl hover:shadow-2xl transition-all duration-300"
            >
              Start Your Free Trial
            </Button>
            <p className="text-sm text-muted-foreground">No credit card required • Full access to all features</p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-card border-t py-12 px-4">
        <div className="container mx-auto text-center">
          <div className="flex items-center justify-center space-x-3 mb-6">
            <div className="p-2 bg-primary/10 rounded-lg">
              <DollarSign className="h-6 w-6 text-primary" />
            </div>
            <span className="text-xl font-bold text-foreground">Salary Tracker</span>
          </div>
          <p className="text-muted-foreground">© 2024 Salary Tracker. Professional Financial Management Platform.</p>
          <p className="text-sm text-muted-foreground mt-2">Secure • Reliable • Professional</p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
