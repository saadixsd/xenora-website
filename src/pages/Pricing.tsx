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

const Pricing = () => {
  const heroRef = useScrollAnimation();
  const featuresRef = useScrollAnimation();
  const plansRef = useScrollAnimation();
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
            "5 searches every 10 hours",
            "Basic document analysis",
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
        }
      ]
    },
    {
      name: "Students",
      description: "Law students with valid academic credentials",
      plans: [
        {
          name: "Nora Student",
          price: "$8.99", 
          period: "/month",
          description: "Limited access for educational use only",
          features: [
            "5 searches every 10 hours",
            "Basic document analysis",
            "Educational case law access",
            "Study templates",
            "Email support",
            "Non-commercial use only"
          ],
          cta: "Student Plan",
          highlight: "Less than Netflix!"
        }
      ]
    }
  ];

  return (
    <div className="min-h-screen pt-20 page-fade-in">
      {/* Header */}
      <section 
        ref={heroRef.ref}
        className={`py-16 bg-hero-gradient transition-all duration-700 ${
          heroRef.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Badge variant="outline" className="mb-4">
            <Sparkles className="h-3 w-3 mr-1" />
            Subscription Plans
          </Badge>
          <h1 className="text-5xl font-bold text-foreground mb-6">
            Choose Your XenoraAI Plan
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            From individual lawyers to large firms, we have the perfect AI solution 
            for your legal practice needs.
          </p>
        </div>
      </section>

      {/* Pricing by User Type */}
      <section 
        ref={plansRef.ref}
        className={`py-20 bg-background transition-all duration-700 delay-200 ${
          plansRef.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
          {userTypes.map((userType, typeIndex) => (
            <div key={typeIndex} className="space-y-8">
              <div className="text-center">
                <h2 className="text-3xl font-bold text-foreground mb-4">{userType.name}</h2>
                <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                  {userType.description}
                </p>
              </div>
              
              <div className={`grid gap-8 ${
                userType.plans.length === 1 ? 'max-w-md mx-auto' :
                userType.plans.length === 2 ? 'grid-cols-1 lg:grid-cols-2 max-w-4xl mx-auto' :
                'grid-cols-1 lg:grid-cols-3'
              }`}>
                {userType.plans.map((plan, planIndex) => (
                  <Card 
                    key={planIndex} 
                    className={`relative bg-card-gradient border-primary/10 hover:shadow-elegant transition-all duration-300 ${
                      plan.popular ? 'border-primary shadow-primary scale-105' : ''
                    }`}
                  >
                    {plan.popular && (
                      <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-primary-gradient text-white">
                        <Crown className="h-3 w-3 mr-1" />
                        {plan.highlight}
                      </Badge>
                    )}
                    {plan.highlight && !plan.popular && (
                      <Badge variant="outline" className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                        {plan.highlight}
                      </Badge>
                    )}
                    
                    <CardHeader className="text-center pb-6">
                      <div className="space-y-2">
                        <CardTitle className="text-2xl font-bold">{plan.name}</CardTitle>
                        <div className="flex items-baseline justify-center space-x-1">
                          <span className="text-4xl font-bold text-primary">{plan.price}</span>
                          <span className="text-muted-foreground">{plan.period}</span>
                        </div>
                        <CardDescription className="text-base">
                          {plan.description}
                        </CardDescription>
                      </div>
                    </CardHeader>
                    
                    <CardContent className="space-y-6">
                      <ul className="space-y-3">
                        {plan.features.map((feature, featureIndex) => (
                          <li key={featureIndex} className="flex items-start space-x-3">
                            <CheckCircle className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                            <span className="text-sm text-foreground">{feature}</span>
                          </li>
                        ))}
                      </ul>
                      
                      <Button 
                        asChild 
                        className="w-full"
                        variant={plan.popular ? 'gradient' : 'outline'}
                      >
                        <Link to="/login">
                          {plan.cta}
                          <ArrowRight className="ml-2 h-4 w-4" />
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

      {/* Free Trial Info */}
      <section className="py-16 bg-accent/30">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Card className="bg-card-gradient max-w-md mx-auto">
            <CardHeader>
              <CardTitle className="text-xl flex items-center justify-center">
                <Zap className="h-5 w-5 mr-2 text-primary" />
                Free Trial
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                Start with a 7-day full trial. After trial, enjoy a free limited version of Nora 
                with 5 searches every 10 hours.
              </p>
              <div className="text-2xl font-bold text-primary">7 Days Free</div>
              <p className="text-sm text-muted-foreground">then limited free access</p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* FAQ Section */}
      <section 
        ref={faqRef.ref}
        className={`py-20 bg-accent/30 transition-all duration-700 delay-400 ${
          faqRef.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}
      >
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
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
      <section className="py-20 bg-primary-gradient">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="space-y-8">
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
              <Button size="lg" variant="secondary" asChild>
                <Link to="/contact" className="text-foreground">
                  <Mail className="mr-2 h-4 w-4" />
                  Contact Sales Team
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="border-white/20 text-white hover:bg-white/10" asChild>
                <Link to="/contact">Schedule Demo</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Pricing;