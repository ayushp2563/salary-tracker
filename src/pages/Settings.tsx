import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAuth } from '@/contexts/AuthContext';
import { ColorPicker } from '@/components/ColorPicker';
import { ThemeToggle } from '@/components/ThemeToggle';
import Footer from '@/components/Footer';
import { useStudentPrefs } from '@/hooks/useStudentPrefs';
import { ArrowLeft, User, Palette, Moon, Sun, Download, Shield, Mail, Calendar, GraduationCap } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from '@/hooks/use-toast';
import type { StudentRegion, StudentStatus } from '@/types/expense';

const Settings = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const { prefs, savePrefs } = useStudentPrefs();

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  const handleInstallPWA = () => {
    window.alert('To install this app, look for the "Install" or "Add to Home Screen" option in your browser menu.');
  };

  const handlePrefChange = async (updates: Partial<typeof prefs>) => {
    const next = { ...prefs, ...updates };
    if (updates.student_status === 'international' && updates.weekly_hour_cap === undefined) {
      next.weekly_hour_cap = 20;
    }
    if (updates.student_status === 'domestic' && prefs.student_status === 'international') {
      next.weekly_hour_cap = 40;
    }
    await savePrefs(next);
    toast({ title: 'Preferences saved' });
  };

  return (
    <div className="flex min-h-screen flex-col bg-app-canvas">
      <header className="sticky top-0 z-50 border-b bg-card/50 backdrop-blur-sm">
        <div className="container mx-auto flex items-center justify-between px-4 py-4">
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="sm" onClick={() => navigate('/')}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back
            </Button>
            <h1 className="font-display text-2xl font-bold text-foreground">Settings</h1>
          </div>
        </div>
      </header>

      <div className="container mx-auto max-w-4xl flex-1 px-4 py-8">
        <div className="space-y-8">
          <Card className="border-border/60">
            <CardHeader>
              <div className="flex items-center space-x-3">
                <div className="rounded-lg bg-primary/10 p-2">
                  <User className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <CardTitle className="font-display text-xl">Profile</CardTitle>
                  <CardDescription>Your account details</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-medium">Email</span>
                  </div>
                  <p className="rounded-md bg-muted/50 px-3 py-2 font-mono text-foreground">
                    {user?.email}
                  </p>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-medium">Member Since</span>
                  </div>
                  <p className="rounded-md bg-muted/50 px-3 py-2 text-foreground">
                    {user?.created_at ? new Date(user.created_at).toLocaleDateString() : 'N/A'}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Shield className="h-4 w-4 text-emerald-600" />
                <Badge variant="secondary" className="bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200">
                  Verified Account
                </Badge>
              </div>
            </CardContent>
          </Card>

          <Card className="border-border/60">
            <CardHeader>
              <div className="flex items-center space-x-3">
                <div className="rounded-lg bg-primary/10 p-2">
                  <GraduationCap className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <CardTitle className="font-display text-xl">Student preferences</CardTitle>
                  <CardDescription>
                    Currency, region, and weekly work-hour caps for Canada / US students
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="grid gap-5 sm:grid-cols-2">
              <div className="space-y-2">
                <Label>Preferred currency</Label>
                <Select
                  value={prefs.preferred_currency}
                  onValueChange={(value) => handlePrefChange({ preferred_currency: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="CAD">CAD ($)</SelectItem>
                    <SelectItem value="USD">USD ($)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Region</Label>
                <Select
                  value={prefs.region}
                  onValueChange={(value) =>
                    handlePrefChange({
                      region: value as StudentRegion,
                      preferred_currency: value === 'CA' ? 'CAD' : prefs.preferred_currency,
                    })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="CA">Canada</SelectItem>
                    <SelectItem value="US">United States</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Student status</Label>
                <Select
                  value={prefs.student_status}
                  onValueChange={(value) =>
                    handlePrefChange({ student_status: value as StudentStatus })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="domestic">Domestic / PR</SelectItem>
                    <SelectItem value="international">International student</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Weekly hour cap</Label>
                <Select
                  value={String(prefs.weekly_hour_cap)}
                  onValueChange={(value) => handlePrefChange({ weekly_hour_cap: Number(value) })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="20">20 hours (typical intl. limit)</SelectItem>
                    <SelectItem value="24">24 hours</SelectItem>
                    <SelectItem value="30">30 hours</SelectItem>
                    <SelectItem value="40">40 hours</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          <Card className="border-border/60">
            <CardHeader>
              <div className="flex items-center space-x-3">
                <div className="rounded-lg bg-primary/10 p-2">
                  <Palette className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <CardTitle className="font-display text-xl">Appearance</CardTitle>
                  <CardDescription>Customize the look and feel of your app</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <ColorPicker />
              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <h4 className="text-sm font-medium">Theme Mode</h4>
                  <p className="text-sm text-muted-foreground">
                    Switch between light and dark mode
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  <Sun className="h-4 w-4" />
                  <ThemeToggle />
                  <Moon className="h-4 w-4" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-border/60">
            <CardHeader>
              <div className="flex items-center space-x-3">
                <div className="rounded-lg bg-primary/10 p-2">
                  <Download className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <CardTitle className="font-display text-xl">App Installation</CardTitle>
                  <CardDescription>Install the app on your device for better experience</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between gap-4">
                <div className="space-y-1">
                  <h4 className="text-sm font-medium">Progressive Web App</h4>
                  <p className="text-sm text-muted-foreground">
                    Install this app on your device to use it like a native app
                  </p>
                </div>
                <Button onClick={handleInstallPWA} className="gap-2">
                  <Download className="h-4 w-4" />
                  Install App
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="border-destructive/20">
            <CardHeader>
              <CardTitle className="font-display text-xl text-destructive">Account Actions</CardTitle>
              <CardDescription>Manage your account settings</CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="destructive" onClick={handleSignOut} className="w-full sm:w-auto">
                Sign Out
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Settings;
