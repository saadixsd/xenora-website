import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { 
  Bot, 
  Building, 
  CheckCircle, 
  ArrowRight,
  Sparkles,
  Users,
  Mail,
  Crown,
  Zap
} from "lucide-react";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import ScheduleDemoButton from "@/components/ScheduleDemoButton";
import { useTranslation } from 'react-i18next';

const Pricing = () => {
  const heroRef = useScrollAnimation();
  const featuresRef = useScrollAnimation();
  const plansRef = useScrollAnimation();
  const { t } = useTranslation();
  const faqRef = useScrollAnimation();
  const userTypes = [
    {
      name: "Lawyers",
      description: "Licensed legal professionals and law firms",
      plans: [
        {
          name: "Nora AI",
          price: "$150",
          period: "/month",
          description: "AI Legal Assistant for licensed lawyers",
          features: [
            "Unlimited legal queries",
            "Document analysis and parsing", 
            "Canadian case law citations",
            "Contract summarization",
            "Meeting notes automation",
            "1 free sub-user included",
            "Priority support"
          ],
          cta: "Start with Nora"
        },
        {
          name: "Halo Suite",
          price: "$120", 
          period: "/month",
          description: "Complete legal practice management",
          features: [
            "Case management system",
            "Client portal access", 
            "Document vault",
            "Smart calendar & scheduling",
            "Billing & invoicing",
            "1 free sub-user included",
            "Priority support"
          ],
          cta: "Choose Halo"
        },
        {
          name: "Bundle Package",
          price: "$230",
          period: "/month", 
          description: "Complete AI-powered legal solution",
          features: [
            "Everything in Nora AI",
            "Everything in Halo Suite",
            "Unified dashboard access",
            "2 free sub-users included",
            "Premium support",
            "Custom integrations",
            "Advanced analytics"
          ],
          popular: true,
          cta: "Get Bundle",
          highlight: "Best Value"
        }
      ]
    },
    {
      name: "Non-Lawyer Professionals",
      description: "Paralegals, legal assistants, and other professionals",
      plans: [
        {
          name: "Free Plan",
          price: "$0",
          period: "/month",
          description: "Get started with basic legal AI", 
          features: [
            "Basic legal research access",
            "Document analysis for up to 10 documents",
            "Educational case law access",
            "Standard support",
            "Non-commercial use only"
          ],
          cta: "Start Free"
        },
        {
          name: "Nora AI Pro",
          price: "$60",
          period: "/month",
          description: "AI Legal Assistant for professionals", 
          features: [
            "Legal research queries",
            "Document analysis",
            "Basic case law access",
            "Contract review assistance", 
            "Standard support",
            "Professional templates",
            "Collaboration tools"
          ],
          cta: "Start Pro Plan"
        },
        {
          name: "Nora Student",
          price: "$8.99", 
          period: "/month",
          description: "Limited access for educational use only",
          features: [
            "Unlimited searches",
            "Premium Document Analysis",
            "Educational case law access",
            "Study templates",
            "Email support",
            "Non-commercial use only"
          ],
          cta: "Student Plan"
        }
      ]
    }
  ];

  return (
    <div className="min-h-screen page-fade-in">
      {/* Visual Hero Intro Section */}
      <section className="relative overflow-hidden bg-hero-gradient py-16 sm:py-20 shadow-elegant">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-accent/5 to-transparent animate-pulse" />
        <div 
          ref={heroRef.ref}
          className={`relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center scroll-animate ${heroRef.isVisible ? 'visible' : ''}`}
        >
          <Badge variant="outline" className="mb-6 hover-scale border-primary/30 bg-primary/5">
            <Sparkles className="h-4 w-4 mr-2" />
            <span className="text-base sm:text-lg font-medium">Flexible Pricing Plans</span>
          </Badge>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground mb-12 animate-fade-in-up">
            Choose Your
            <br />
            <span className="bg-primary-gradient bg-clip-text text-transparent">
              XenoraAI Plan
            </span>
          </h1>
        </div>
      </section>

      {/* Pricing by User Type */}
      <section className="section-swoosh py-12 sm:py-16 bg-background">
        <div 
          ref={plansRef.ref}
          className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-20 scroll-animate ${plansRef.isVisible ? 'visible' : ''}`}
        >
          {userTypes.map((userType, typeIndex) => (
            <div key={typeIndex} className="space-y-12">
              <div className="text-center">
                <h2 className="text-5xl font-bold text-foreground mb-6">{userType.name}</h2>
                <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
                  {userType.description}
                </p>
              </div>
              
              <div className={`grid gap-8 ${
                userType.plans.length === 1 ? 'max-w-md mx-auto' :
                userType.plans.length === 2 ? 'grid-cols-1 lg:grid-cols-2 max-w-5xl mx-auto' :
                'grid-cols-1 lg:grid-cols-3'
              }`}>
                {userType.plans.map((plan, planIndex) => (
                  <Card 
                    key={planIndex} 
                    className={`relative bg-card-gradient border-primary/10 hover-lift hover:shadow-elegant transition-all duration-500 group flex flex-col ${
                      plan.popular ? 'border-primary/30 shadow-primary/20 scale-105' : ''
                    }`}
                  >
                    {plan.popular && (
                      <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                        <Badge className="bg-primary-gradient text-white px-6 py-2 text-sm font-semibold">
                          <Crown className="h-4 w-4 mr-1" />
                          {plan.highlight}
                        </Badge>
                      </div>
                    )}
                    {plan.highlight && !plan.popular && (
                      <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                        <Badge variant="outline" className="bg-background px-4 py-1 text-sm">
                          {plan.highlight}
                        </Badge>
                      </div>
                    )}
                    
                    <CardHeader className="text-center pb-8">
                      <div className="space-y-4">
                        <CardTitle className="text-3xl font-bold text-foreground">{plan.name}</CardTitle>
                        <div className="space-y-2">
                          <div className="flex items-baseline justify-center space-x-2">
                            <span className="text-6xl font-bold text-primary">{plan.price}</span>
                            <span className="text-xl text-muted-foreground">{plan.period}</span>
                          </div>
                          {plan.name !== "Free Plan" && (
                            <p className="text-sm text-muted-foreground font-medium">(7 days Free)</p>
                          )}
                        </div>
                        <CardDescription className="text-lg text-muted-foreground leading-relaxed">
                          {plan.description}
                        </CardDescription>
                      </div>
                    </CardHeader>
                    
                    <CardContent className="flex-1 flex flex-col space-y-8 px-8 pb-8">
                      <ul className="space-y-4 flex-1">
                        {plan.features.map((feature, featureIndex) => (
                          <li key={featureIndex} className="flex items-start space-x-4">
                            <CheckCircle className="h-6 w-6 text-primary mt-0.5 flex-shrink-0" />
                            <span className="text-muted-foreground leading-relaxed">{feature}</span>
                          </li>
                        ))}
                      </ul>
                      
                      <Button 
                        asChild 
                        className="w-full bg-primary-gradient hover:shadow-glow transition-all duration-300 mt-auto text-lg py-4"
                      >
                        <Link to="/login">
                          {plan.cta}
                          <ArrowRight className="ml-2 h-5 w-5" />
                        </Link>
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>


      {/* FAQ Section */}
      <section className="section-swoosh section-padding bg-accent/5">
        <div 
          ref={faqRef.ref}
          className={`max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 scroll-animate ${faqRef.isVisible ? 'visible' : ''}`}
        >
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">
              Frequently Asked Questions
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div>
                <h3 className="font-semibold text-foreground mb-2">Can I switch plans anytime?</h3>
                <p className="text-muted-foreground text-sm">Yes, you can upgrade or downgrade your plan at any time. Changes take effect immediately.</p>
              </div>
              <div>
                <h3 className="font-semibold text-foreground mb-2">Is there a free trial?</h3>
                <p className="text-muted-foreground text-sm">Yes, we offer a 7-day free trial for all plans so you can experience XenoraAI risk-free.</p>
              </div>
              <div>
                <h3 className="font-semibold text-foreground mb-2">What about data security?</h3>
                <p className="text-muted-foreground text-sm">We're PIPEDA and SOC2 compliant, ensuring the highest standards of data protection and privacy.</p>
              </div>
            </div>
            <div className="space-y-6">
              <div>
                <h3 className="font-semibold text-foreground mb-2">Do you offer discounts for law firms?</h3>
                <p className="text-muted-foreground text-sm">Yes, we offer special pricing for law firms and enterprises. Contact our sales team for custom quotes.</p>
              </div>
              <div>
                <h3 className="font-semibold text-foreground mb-2">What payment methods do you accept?</h3>
                <p className="text-muted-foreground text-sm">We accept all major credit cards and provide invoicing for enterprise customers.</p>
              </div>
              <div>
                <h3 className="font-semibold text-foreground mb-2">Can I cancel anytime?</h3>
                <p className="text-muted-foreground text-sm">Absolutely. You can cancel your subscription at any time with no long-term commitments.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Enterprise CTA */}
      <section className="section-padding bg-primary-gradient shadow-elegant">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="space-y-8 animate-scale-in">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <Building className="h-8 w-8 text-white" />
              <span className="text-2xl font-bold text-white">Enterprise Solutions</span>
            </div>
            
            <h2 className="text-4xl font-bold text-white mb-4">
              Need a Custom Solution?
            </h2>
            <p className="text-xl text-white/90 max-w-3xl mx-auto">
              Large law firms and organizations get custom pricing, dedicated support, 
              and tailored integrations. Let's discuss your specific needs.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-white/20 backdrop-blur-sm border-white/30 text-white hover:bg-white/30 hover-scale" asChild>
                <Link to="/contact" className="text-foreground">
                  <Mail className="mr-2 h-4 w-4" />
                  Contact Sales Team
                </Link>
              </Button>
              <ScheduleDemoButton size="lg" className="hover-scale" />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Pricing;