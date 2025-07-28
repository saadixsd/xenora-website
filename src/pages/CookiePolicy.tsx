import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Cookie, Settings, Info, Shield } from "lucide-react";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";

const CookiePolicy = () => {
  const heroRef = useScrollAnimation();
  const contentRef = useScrollAnimation();

  const sections = [
    {
      icon: Info,
      title: "1. Essential Cookies",
      content: "These cookies are necessary for our website to function properly: • Authentication and login sessions • Security and fraud prevention • Load balancing and performance optimization • Shopping cart and payment processing • Language and accessibility preferences • These cookies cannot be disabled without affecting site functionality"
    },
    {
      icon: Settings,
      title: "2. Analytics and Performance",
      content: "We use analytics cookies to understand how users interact with our services: • Page views and navigation patterns • Feature usage and engagement metrics • Error tracking and performance monitoring • A/B testing for service improvements • Aggregate user behavior analysis • All data is anonymized and used solely for improvement purposes"
    },
    {
      icon: Cookie,
      title: "3. Functional and Preference",
      content: "These cookies enhance your experience by remembering: • Your preferred language and region settings • Dark/light theme preferences • Notification and communication preferences • Recently viewed content and searches • Customized dashboard layouts • Professional practice area selections"
    },
    {
      icon: Shield,
      title: "4. Cookie Management and Control",
      content: "You have full control over cookie preferences: • Browser settings allow blocking or deleting cookies • Most browsers provide cookie management tools • You can opt-out of analytics tracking • Essential cookies are required for basic functionality • Cookie preferences can be updated anytime • We respect Do Not Track browser signals where technically feasible"
    }
  ];

  return (
    <div className="min-h-screen pt-16 page-fade-in">
      {/* Header */}
      <section className="relative overflow-hidden bg-hero-gradient section-padding shadow-elegant">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-accent/5 to-transparent animate-pulse" />
        <div 
          ref={heroRef.ref}
          className={`relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center transition-all duration-700 ${
            heroRef.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          <Badge variant="outline" className="mb-8 hover-scale border-primary/30 bg-primary/5">
            <Cookie className="h-4 w-4 mr-2" />
            <span className="text-lg font-medium">Cookie Policy</span>
          </Badge>
          <h1 className="text-7xl font-bold text-foreground mb-8 animate-fade-in-up">
            Understanding Our <span className="bg-primary-gradient bg-clip-text text-transparent">Cookies</span>
          </h1>
          <p className="text-2xl text-muted-foreground max-w-4xl mx-auto leading-relaxed mb-4">
            Learn how XenoraAI uses cookies to enhance your browsing experience and improve our services.
          </p>
          <p className="text-lg text-muted-foreground opacity-80">
            Last updated: January 2024
          </p>
        </div>
      </section>

      {/* Cookie Content */}
      <section className="section-padding section-swoosh bg-accent/5">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div 
            ref={contentRef.ref}
            className={`space-y-8 transition-all duration-700 ${
              contentRef.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
          >
            {sections.map((section, index) => (
              <Card key={index} className="bg-card-gradient border-primary/10 hover:shadow-elegant hover-lift transition-all duration-300">
                <CardContent className="p-8">
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                      <section.icon className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-semibold text-foreground mb-4">{section.title}</h2>
                      <p className="text-muted-foreground leading-relaxed">{section.content}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}

            {/* Cookie Settings */}
            <Card className="bg-primary-gradient border-0 shadow-elegant hover-lift">
              <CardContent className="p-8 text-center text-white">
                <h3 className="text-xl font-semibold mb-4">Cookie Preferences</h3>
                <p className="mb-6 text-white/90">
                  You can manage your cookie preferences through your browser settings or contact us for assistance.
                </p>
                <p className="text-white/90">
                  Email: <span className="font-semibold">cookies@xenoraai.com</span>
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
};

export default CookiePolicy;