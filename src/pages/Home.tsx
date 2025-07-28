import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { 
  Bot,
  Sparkles, 
  Shield, 
  Clock, 
  Users, 
  CheckCircle, 
  ArrowRight,
  Scale,
  FileText,
  Search,
  Zap
} from "lucide-react";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import XenoraLogo from "@/components/XenoraLogo";
import { useTranslation } from 'react-i18next';

const Home = () => {
  const heroRef = useScrollAnimation();
  const featuresRef = useScrollAnimation();
  const benefitsRef = useScrollAnimation();
  const { t } = useTranslation();
  
  const features = [
    {
      icon: Scale,
      title: "Case Law Analysis",
      description: "Access relevant Canadian case law with AI-powered insights, customized to your specific legal needs."
    },
    {
      icon: FileText,
      title: "Document Review",
      description: "Automate document analysis with instant summarization and key point extraction, saving hours of work."
    },
    {
      icon: Search,
      title: "CanLII Integration",
      description: "Seamlessly connect to Canada's leading legal database for smarter, faster research."
    },
    {
      icon: Zap,
      title: "RAG-Powered Assistant",
      description: "Our Retrieval-Augmented Generation model delivers fast, accurate answers from trusted legal sources."
    }
  ];

  const benefits = [
    {
      icon: Users,
      title: t('home.benefits.provincial.title'),
      description: t('home.benefits.provincial.description')
    },
    {
      icon: Sparkles,
      title: t('home.benefits.bilingual.title'),
      description: t('home.benefits.bilingual.description')
    },
    {
      icon: Shield,
      title: t('home.benefits.ethical.title'),
      description: t('home.benefits.ethical.description')
    },
    {
      icon: Clock,
      title: t('home.benefits.realtime.title'),
      description: t('home.benefits.realtime.description')
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-hero-gradient section-padding shadow-elegant">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/10" />
        <div 
          ref={heroRef.ref}
          className={`relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 scroll-animate ${heroRef.isVisible ? 'visible' : ''}`}
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8 animate-swoosh-in">
              <Badge variant="outline" className="w-fit border-primary/20 text-primary hover-scale mt-8 sm:mt-0">
                <Sparkles className="h-4 w-4 mr-2" />
                <span className="text-lg font-medium">{t('home.hero.badge')}</span>
              </Badge>
              
              <div className="space-y-4">
                <h1 className="text-5xl lg:text-6xl font-bold text-foreground leading-tight">
                  {t('home.hero.title1')}
                  <br />
                  {t('home.hero.title2')}
                  <br />
                  <span className="bg-primary-gradient bg-clip-text text-transparent">
                    {t('home.hero.title3')}
                  </span>
                </h1>
                <p className="text-2xl text-muted-foreground max-w-lg">
                  {t('home.hero.description')}
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" asChild className="bg-primary-gradient hover:shadow-glow transition-all duration-300">
                  <Link to="/models">
                    {t('home.hero.explore')}
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <Button size="lg" variant="outline" asChild>
                  <Link to="/about">{t('home.hero.discover')}</Link>
                </Button>
              </div>
            </div>

            {/* Feature Cards */}
            <div className="grid grid-cols-2 gap-4 animate-slide-up">
              <Card className="bg-card-gradient border-primary/10 hover-lift hover:shadow-elegant transition-all duration-300 group">
                <CardContent className="p-6">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                    <Bot className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="font-semibold text-foreground mb-2">{t('home.heroCards.caseAnalysis')}</h3>
                  <p className="text-sm text-muted-foreground">{t('home.heroCards.caseAnalysisDesc')}</p>
                </CardContent>
              </Card>

              <Card className="bg-card-gradient border-primary/10 hover-lift hover:shadow-elegant transition-all duration-300 group">
                <CardContent className="p-6">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                    <FileText className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="font-semibold text-foreground mb-2">{t('home.heroCards.documentReview')}</h3>
                  <p className="text-sm text-muted-foreground">{t('home.heroCards.documentReviewDesc')}</p>
                </CardContent>
              </Card>

              <Card className="bg-card-gradient border-primary/10 hover-lift hover:shadow-elegant transition-all duration-300 group">
                <CardContent className="p-6">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                    <Search className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="font-semibold text-foreground mb-2">{t('home.heroCards.canliiIntegration')}</h3>
                  <p className="text-sm text-muted-foreground">{t('home.heroCards.canliiIntegrationDesc')}</p>
                </CardContent>
              </Card>

              <Card className="bg-card-gradient border-primary/10 hover-lift hover:shadow-elegant transition-all duration-300 group">
                <CardContent className="p-6">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                    <Zap className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="font-semibold text-foreground mb-2">{t('home.heroCards.proceduralGuidance')}</h3>
                  <p className="text-sm text-muted-foreground">{t('home.heroCards.proceduralGuidanceDesc')}</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>


      {/* Benefits Section */}
      <section className="section-swoosh section-padding bg-accent/5 shadow-elegant">
        <div 
          ref={benefitsRef.ref}
          className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 scroll-animate ${benefitsRef.isVisible ? 'visible' : ''}`}
        >
          <div className="text-center mb-16 animate-fade-in-up">
            <h2 className="text-5xl font-bold text-foreground mb-8">
              {t('home.benefits.title')}
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-12">
              {t('home.benefits.description')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {benefits.map((benefit, index) => (
              <Card key={index} className="bg-card-gradient border-primary/10 hover-lift hover:shadow-elegant transition-all duration-500 group cursor-pointer">
                <CardContent className="p-8 text-center space-y-6">
                  <div className="w-20 h-20 bg-gradient-to-br from-primary/10 to-accent/10 rounded-2xl flex items-center justify-center mx-auto group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
                    <benefit.icon className="h-10 w-10 text-primary group-hover:text-accent transition-colors duration-300" />
                  </div>
                  <h3 className="text-xl font-bold text-foreground group-hover:text-primary transition-colors duration-300">{benefit.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{benefit.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section-padding bg-primary-gradient shadow-elegant">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="space-y-8 animate-scale-in">
            <h2 className="text-4xl font-bold text-white mb-4">
              {t('home.cta.title')}
            </h2>
            <p className="text-xl text-white/90 max-w-3xl mx-auto">
              {t('home.cta.description')}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" variant="secondary" asChild className="hover-scale">
                <Link to="/login">
                  {t('home.cta.getStarted')}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="border-white/40 bg-white/10 text-white hover:bg-white/20 hover:text-white hover-scale" asChild>
                <Link to="/contact">{t('home.cta.contactSales')}</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;