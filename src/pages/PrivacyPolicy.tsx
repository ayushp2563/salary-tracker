import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

const PrivacyPolicy = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 items-center">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate("/")}
            className="mr-4"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-lg font-semibold">Privacy Policy</h1>
        </div>
      </header>

      <main className="container max-w-4xl py-8 space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Privacy Policy</CardTitle>
            <p className="text-sm text-muted-foreground">
              Last updated: {new Date().toLocaleDateString()}
            </p>
          </CardHeader>
          <CardContent className="space-y-6 text-sm">
            <section>
              <h2 className="text-lg font-semibold mb-2">1. Introduction</h2>
              <p className="text-muted-foreground">
                Welcome to our Salary Tracker application. We respect your privacy and are committed to protecting your personal data. This privacy policy explains how we collect, use, and safeguard your information when you use our service.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold mb-2">2. Information We Collect</h2>
              <p className="text-muted-foreground mb-2">We collect the following types of information:</p>
              <ul className="list-disc list-inside space-y-1 text-muted-foreground ml-4">
                <li><strong>Account Information:</strong> Email address, name, and profile picture when you sign up using Google OAuth or email/password authentication</li>
                <li><strong>Salary Data:</strong> Salary entries, hours worked, tips, and extra hours that you voluntarily input into the application</li>
                <li><strong>Usage Data:</strong> Information about how you interact with our service, including access times and app features used</li>
                <li><strong>Device Information:</strong> Browser type, operating system, and device identifiers</li>
              </ul>
            </section>

            <section>
              <h2 className="text-lg font-semibold mb-2">3. How We Use Your Information</h2>
              <p className="text-muted-foreground mb-2">We use your information to:</p>
              <ul className="list-disc list-inside space-y-1 text-muted-foreground ml-4">
                <li>Provide and maintain our salary tracking service</li>
                <li>Authenticate your identity and manage your account</li>
                <li>Store and display your salary entries and calculations</li>
                <li>Improve our application and user experience</li>
                <li>Send important service-related notifications</li>
                <li>Ensure security and prevent fraud</li>
              </ul>
            </section>

            <section>
              <h2 className="text-lg font-semibold mb-2">4. Google OAuth Integration</h2>
              <p className="text-muted-foreground">
                When you sign in with Google, we receive basic profile information (name, email, and profile picture) from Google. We use this information solely for authentication purposes. We do not access any other Google services or data. Your use of Google sign-in is also subject to Google's Privacy Policy and Terms of Service.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold mb-2">5. Data Storage and Security</h2>
              <p className="text-muted-foreground">
                Your data is securely stored using Supabase, a secure cloud database platform. We implement industry-standard security measures including encryption, secure authentication, and access controls to protect your information. However, no method of transmission over the internet is 100% secure, and we cannot guarantee absolute security.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold mb-2">6. Data Sharing and Disclosure</h2>
              <p className="text-muted-foreground mb-2">
                We do not sell, trade, or rent your personal information to third parties. We may share your information only in the following circumstances:
              </p>
              <ul className="list-disc list-inside space-y-1 text-muted-foreground ml-4">
                <li>With your explicit consent</li>
                <li>To comply with legal obligations or valid legal requests</li>
                <li>To protect our rights, privacy, safety, or property</li>
                <li>With service providers who assist in operating our application (e.g., Supabase for hosting)</li>
              </ul>
            </section>

            <section>
              <h2 className="text-lg font-semibold mb-2">7. Your Rights and Choices</h2>
              <p className="text-muted-foreground mb-2">You have the right to:</p>
              <ul className="list-disc list-inside space-y-1 text-muted-foreground ml-4">
                <li>Access, update, or delete your personal information</li>
                <li>Export your salary data</li>
                <li>Delete your account at any time</li>
                <li>Opt out of non-essential communications</li>
                <li>Withdraw consent for data processing</li>
              </ul>
            </section>

            <section>
              <h2 className="text-lg font-semibold mb-2">8. Data Retention</h2>
              <p className="text-muted-foreground">
                We retain your personal information for as long as your account is active or as needed to provide you services. If you delete your account, we will delete your personal data within 30 days, except where we are required to retain it for legal purposes.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold mb-2">9. Cookies and Tracking</h2>
              <p className="text-muted-foreground">
                We use essential cookies and local storage to maintain your session and remember your preferences (such as theme settings). We do not use third-party advertising or tracking cookies.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold mb-2">10. Children's Privacy</h2>
              <p className="text-muted-foreground">
                Our service is not intended for users under the age of 13. We do not knowingly collect personal information from children under 13. If you believe we have collected information from a child under 13, please contact us immediately.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold mb-2">11. International Data Transfers</h2>
              <p className="text-muted-foreground">
                Your information may be transferred to and maintained on servers located outside of your jurisdiction. By using our service, you consent to such transfers. We ensure appropriate safeguards are in place to protect your data.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold mb-2">12. Changes to This Policy</h2>
              <p className="text-muted-foreground">
                We may update this privacy policy from time to time. We will notify you of any changes by posting the new privacy policy on this page and updating the "Last updated" date. We encourage you to review this policy periodically.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold mb-2">13. Contact Us</h2>
              <p className="text-muted-foreground">
                If you have any questions about this privacy policy or our data practices, please contact us through the app settings or at the contact information provided in your account.
              </p>
            </section>
          </CardContent>
        </Card>

        <div className="flex justify-center">
          <Button onClick={() => navigate("/")} variant="outline">
            Return to Home
          </Button>
        </div>
      </main>
    </div>
  );
};

export default PrivacyPolicy;