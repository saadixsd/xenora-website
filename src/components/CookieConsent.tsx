import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { X, Cookie } from "lucide-react";

const CookieConsent = () => {
  const [showConsent, setShowConsent] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem('xenora-cookie-consent');
    if (!consent) {
      // Show after a short delay
      const timer = setTimeout(() => {
        setShowConsent(true);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, []);

  const acceptCookies = () => {
    localStorage.setItem('xenora-cookie-consent', 'accepted');
    setShowConsent(false);
  };

  const declineCookies = () => {
    localStorage.setItem('xenora-cookie-consent', 'declined');
    setShowConsent(false);
  };

  if (!showConsent) return null;

  return (
    <div className="fixed bottom-6 left-6 right-6 z-50 max-w-md mx-auto">
      <Card className="bg-card border border-border shadow-elegant p-6">
        <div className="flex items-start space-x-4">
          <Cookie className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
          <div className="flex-1">
            <h3 className="font-semibold text-foreground mb-2">
              We use cookies
            </h3>
            <p className="text-sm text-muted-foreground mb-4">
              We use cookies to enhance your experience on our website. By continuing to browse, 
              you agree to our use of cookies as described in our privacy policy.
            </p>
            <div className="flex flex-col sm:flex-row gap-2">
              <Button size="sm" onClick={acceptCookies} className="bg-primary-gradient">
                Accept All
              </Button>
              <Button size="sm" variant="outline" onClick={declineCookies}>
                Decline
              </Button>
            </div>
          </div>
          <Button
            size="icon"
            variant="ghost"
            onClick={declineCookies}
            className="h-8 w-8"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default CookieConsent;