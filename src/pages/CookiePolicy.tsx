import { useState } from "react";
import { ChevronRight, ChevronDown } from "lucide-react";

const CookiePolicy = () => {
  const [expandedSections, setExpandedSections] = useState<string[]>([]);

  const toggleSection = (sectionId: string) => {
    setExpandedSections(prev => 
      prev.includes(sectionId) 
        ? prev.filter(id => id !== sectionId)
        : [...prev, sectionId]
    );
  };

  const sections = [
    {
      id: "essential-cookies",
      title: "Essential Cookies",
      content: `These cookies are necessary for our website to function properly and cannot be switched off in our systems. They are usually only set in response to actions made by you which amount to a request for services.

Essential cookies enable core functionality such as:
• User authentication and login sessions
• Security features and fraud prevention
• Load balancing and performance optimization
• Shopping cart and payment processing
• Language and accessibility preferences
• CSRF protection and form submissions

These cookies do not store any personally identifiable information, but without them, some parts of our service may not function properly. You can set your browser to block or alert you about these cookies, but this may cause some parts of the site to not work.`
    },
    {
      id: "analytics-performance",
      title: "Analytics and Performance Cookies",
      content: `We use analytics cookies to understand how visitors interact with our website. These cookies help us improve our services by providing information about which pages are visited most often and if users get error messages from web pages.

Analytics cookies collect information about:
• Page views and navigation patterns
• Feature usage and user engagement
• Error tracking and performance monitoring
• Time spent on different pages
• Traffic sources and referral information
• Device and browser information

All information these cookies collect is aggregated and anonymous. If you do not allow these cookies, we will not know when you have visited our site and will not be able to monitor its performance or make improvements based on user behavior.`
    },
    {
      id: "functional-preference",
      title: "Functional and Preference Cookies",
      content: `These cookies enable the website to provide enhanced functionality and personalization. They may be set by us or by third-party providers whose services we have added to our pages.

Functional cookies remember:
• Your preferred language and region settings
• Dark mode or light mode theme preferences
• Font size and accessibility settings
• Recently viewed content and search history
• Customized dashboard layouts and tool preferences
• Professional practice area selections
• Notification and communication preferences

If you do not allow these cookies, then some or all of these services may not function properly. These cookies may store personally identifiable information to provide you with a personalized experience.`
    },
    {
      id: "targeting-advertising",
      title: "Targeting and Advertising Cookies",
      content: `These cookies may be set through our site by our advertising partners to build a profile of your interests and show you relevant adverts on other sites. They work by uniquely identifying your browser and internet device.

Advertising cookies are used for:
• Delivering advertisements relevant to you and your interests
• Limiting the number of times you see an advertisement
• Measuring the effectiveness of advertising campaigns
• Understanding user behavior across websites
• Providing reports to advertisers about ad performance

If you do not allow these cookies, you will experience less targeted advertising. These cookies may store personally identifiable information and track your browsing habits across multiple websites.`
    },
    {
      id: "cookie-management",
      title: "Cookie Management and Control",
      content: `You have several options to control and manage cookies on our website and in your browser.

Browser Controls:
• Most browsers allow you to view, manage, and delete cookies
• You can set your browser to notify you when cookies are being used
• Browser settings can block all cookies or only third-party cookies
• Private/incognito browsing modes limit cookie storage

XenoraAI Cookie Controls:
• Cookie preference center (available in site footer)
• Account settings for logged-in users
• Email preferences for marketing communications
• Do Not Track signal support where technically feasible

Managing cookies may affect your experience on our website. Essential cookies cannot be disabled without impacting core functionality, but you can control analytics, functional, and advertising cookies through your browser settings or our preference center.

For more information about managing cookies, visit your browser's help section or www.allaboutcookies.org for guidance.`
    }
  ];

  const sidebarItems = [
    { id: "essential-cookies", title: "Essential Cookies" },
    { id: "analytics-performance", title: "Analytics and Performance Cookies" },
    { id: "functional-preference", title: "Functional and Preference Cookies" },
    { id: "targeting-advertising", title: "Targeting and Advertising Cookies" },
    { id: "cookie-management", title: "Cookie Management and Control" }
  ];

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      // Auto-expand the section when navigating to it
      if (!expandedSections.includes(sectionId)) {
        setExpandedSections(prev => [...prev, sectionId]);
      }
    }
  };

  return (
    <div className="min-h-screen pt-16 bg-background">
      {/* Header */}
      <div className="bg-white border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-4xl font-bold text-foreground mb-4">
            XenoraAI Cookie Policy
          </h1>
          <p className="text-muted-foreground mb-2">
            Last Updated: January 2025
          </p>
          <button className="text-primary hover:underline text-sm">
            What's new?
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-8">
          {/* Sidebar */}
          <div className="w-80 flex-shrink-0">
            <div className="sticky top-24">
              <h2 className="font-semibold text-foreground mb-4">XenoraAI Cookie Policy</h2>
              <nav className="space-y-1">
                {sidebarItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => scrollToSection(item.id)}
                    className="block w-full text-left py-2 px-3 text-sm text-muted-foreground hover:text-primary hover:bg-accent rounded-md transition-colors"
                  >
                    {item.title}
                  </button>
                ))}
              </nav>
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 max-w-4xl">
            <div className="prose prose-slate max-w-none">
              <p className="text-lg text-muted-foreground mb-8">
                This Cookie Policy explains how XenoraAI uses cookies and similar technologies to recognize you when you visit our website. It explains what these technologies are and why we use them, as well as your rights to control our use of them.
              </p>

              <div className="space-y-8">
                {sections.map((section) => (
                  <div key={section.id} id={section.id} className="border-t border-border pt-8">
                    <button
                      onClick={() => toggleSection(section.id)}
                      className="flex items-center justify-between w-full text-left group"
                    >
                      <h2 className="text-2xl font-semibold text-foreground group-hover:text-primary transition-colors">
                        {section.title}
                      </h2>
                      {expandedSections.includes(section.id) ? (
                        <ChevronDown className="h-5 w-5 text-muted-foreground" />
                      ) : (
                        <ChevronRight className="h-5 w-5 text-muted-foreground" />
                      )}
                    </button>
                    
                    {expandedSections.includes(section.id) && (
                      <div className="mt-4 text-muted-foreground leading-relaxed space-y-4">
                        {section.content.split('\n\n').map((paragraph, index) => (
                          <p key={index}>{paragraph}</p>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Contact Section */}
              <div className="mt-16 p-6 bg-accent/50 rounded-lg border border-border">
                <h3 className="text-lg font-semibold text-foreground mb-2">Cookie Preferences</h3>
                <p className="text-muted-foreground mb-4">
                  You can manage your cookie preferences through your browser settings or contact us for assistance with cookie-related questions.
                </p>
                <p className="text-muted-foreground">
                  Email: <span className="font-medium text-foreground">xenoraai@gmail.com</span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CookiePolicy;