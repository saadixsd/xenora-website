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
  const heroRef = useScrollAnimation({ threshold: 0.1 });
  const featuresRef = useScrollAnimation({ threshold: 0.3 });
  const benefitsRef = useScrollAnimation({ threshold: 0.2 });
  const ctaRef = useScrollAnimation({ threshold: 0.5 });
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

            {/* Logo/Visual Element */}
            <div className="relative flex justify-center items-center animate-slide-up">
              {/* Floating background elements */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="absolute w-64 h-64 bg-primary/5 rounded-full blur-3xl animate-pulse" />
                <div className="absolute w-48 h-48 bg-accent/10 rounded-full blur-2xl animate-pulse delay-1000" />
                <div className="absolute w-32 h-32 bg-primary/10 rounded-full blur-xl animate-pulse delay-500" />
              </div>
              
              {/* Main logo container */}
              <div className="relative group">
                <div className="absolute -inset-1 bg-primary-gradient rounded-full blur opacity-30 group-hover:opacity-50 transition duration-1000 group-hover:duration-200" />
                <div className="relative bg-background/80 backdrop-blur-xl rounded-full p-8 border border-primary/20 shadow-2xl group-hover:shadow-glow transition-all duration-500">
                  <XenoraLogo className="w-40 h-40 mx-auto transform group-hover:scale-110 transition-transform duration-500" />
                </div>
                
                {/* Orbiting elements */}
                <div className="absolute top-4 right-4 w-3 h-3 bg-primary rounded-full animate-pulse" />
                <div className="absolute bottom-8 left-2 w-2 h-2 bg-accent rounded-full animate-pulse delay-700" />
                <div className="absolute top-1/2 -right-2 w-1.5 h-1.5 bg-primary/60 rounded-full animate-pulse delay-300" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Major Features Section */}
      <section className="relative section-padding bg-gradient-to-br from-background via-accent/5 to-background overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_40%,rgba(120,119,198,0.3),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(255,77,79,0.2),transparent_50%)]" />
        
        <div 
          ref={featuresRef.ref}
          className={`relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 scroll-animate ${featuresRef.isVisible ? 'visible' : ''}`}
        >
          <div className="text-center mb-20">
            <h2 className={`text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground mb-8 leading-tight transform transition-all duration-1000 ${featuresRef.isVisible ? 'translate-y-0 opacity-100' : 'translate-y-12 opacity-0'}`}>
              Revolutionary Legal AI
              <br />
              <span className="bg-primary-gradient bg-clip-text text-transparent">
                That Actually Works
              </span>
            </h2>
            <p className={`text-2xl text-muted-foreground max-w-4xl mx-auto transform transition-all duration-1000 delay-300 ${featuresRef.isVisible ? 'translate-y-0 opacity-100' : 'translate-y-12 opacity-0'}`}>
              Experience the future of legal research with AI that understands Canadian law better than ever before
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {features.map((feature, index) => (
              <div 
                key={index}
                className={`group transform transition-all duration-1000 ${featuresRef.isVisible ? 'translate-y-0 opacity-100 scale-100' : 'translate-y-20 opacity-0 scale-95'}`}
                style={{ transitionDelay: `${(index + 1) * 200}ms` }}
              >
                <Card className="relative bg-gradient-to-br from-card via-card/90 to-card/70 border-primary/20 hover:border-primary/40 shadow-2xl hover:shadow-glow transition-all duration-700 group-hover:scale-105 overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  
                  <CardContent className="relative p-12 space-y-8">
                    <div className="relative">
                      <div className="absolute inset-0 bg-primary/20 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-500" />
                      <div className="relative w-24 h-24 bg-gradient-to-br from-primary/20 to-accent/20 backdrop-blur-sm rounded-2xl flex items-center justify-center group-hover:scale-110 group-hover:rotate-6 transition-all duration-500">
                        <feature.icon className="h-12 w-12 text-primary group-hover:text-accent transition-all duration-500" />
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <h3 className="text-3xl font-bold text-foreground group-hover:text-primary transition-colors duration-500">
                        {feature.title}
                      </h3>
                      <p className="text-lg text-muted-foreground leading-relaxed group-hover:text-foreground transition-colors duration-500">
                        {feature.description}
                      </p>
                    </div>
                    
                    <div className="flex items-center text-primary group-hover:text-accent transition-colors duration-500">
                      <ArrowRight className="h-5 w-5 transform group-hover:translate-x-2 transition-transform duration-500" />
                      <span className="ml-2 font-medium">Learn More</span>
                    </div>
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="section-swoosh section-padding bg-accent/5 shadow-elegant">
        <div 
          ref={benefitsRef.ref}
          className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 scroll-animate ${benefitsRef.isVisible ? 'visible' : ''}`}
        >
          <div className="text-center mb-20">
            <h2 className={`text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-8 leading-tight transform transition-all duration-1000 ${benefitsRef.isVisible ? 'translate-y-0 opacity-100' : 'translate-y-12 opacity-0'}`}>
              {t('home.benefits.title')}
            </h2>
            <p className={`text-xl text-muted-foreground max-w-3xl mx-auto mb-12 transform transition-all duration-1000 delay-200 ${benefitsRef.isVisible ? 'translate-y-0 opacity-100' : 'translate-y-12 opacity-0'}`}>
              {t('home.benefits.description')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {benefits.map((benefit, index) => (
              <div
                key={index}
                className={`transform transition-all duration-1000 ${benefitsRef.isVisible ? 'translate-y-0 opacity-100 scale-100' : 'translate-y-16 opacity-0 scale-90'}`}
                style={{ transitionDelay: `${(index + 3) * 150}ms` }}
              >
                <Card className="relative bg-card-gradient border-primary/10 hover:border-primary/30 hover:shadow-glow transition-all duration-500 group cursor-pointer overflow-hidden h-full">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  
                  <CardContent className="relative p-8 text-center space-y-6 h-full flex flex-col justify-between">
                    <div className="space-y-6">
                      <div className="relative">
                        <div className="absolute inset-0 bg-primary/20 rounded-2xl blur-lg group-hover:blur-xl transition-all duration-500 opacity-50" />
                        <div className="relative w-20 h-20 bg-gradient-to-br from-primary/15 to-accent/15 backdrop-blur-sm rounded-2xl flex items-center justify-center mx-auto group-hover:scale-110 group-hover:rotate-6 transition-all duration-500">
                          <benefit.icon className="h-10 w-10 text-primary group-hover:text-accent transition-all duration-500" />
                        </div>
                      </div>
                      <h3 className="text-xl font-bold text-foreground group-hover:text-primary transition-colors duration-500">{benefit.title}</h3>
                    </div>
                    <p className="text-muted-foreground leading-relaxed group-hover:text-foreground transition-colors duration-500">{benefit.description}</p>
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative section-padding bg-primary-gradient shadow-elegant overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.1),transparent_70%)]" />
        <div 
          ref={ctaRef.ref}
          className={`relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center scroll-animate ${ctaRef.isVisible ? 'visible' : ''}`}
        >
          <div className="space-y-8">
            <h2 className={`text-4xl sm:text-5xl font-bold text-white mb-4 transform transition-all duration-1000 ${ctaRef.isVisible ? 'translate-y-0 opacity-100 scale-100' : 'translate-y-12 opacity-0 scale-95'}`}>
              {t('home.cta.title')}
            </h2>
            <p className={`text-xl text-white/90 max-w-3xl mx-auto transform transition-all duration-1000 delay-200 ${ctaRef.isVisible ? 'translate-y-0 opacity-100' : 'translate-y-12 opacity-0'}`}>
              {t('home.cta.description')}
            </p>
            <div className={`flex flex-col sm:flex-row gap-4 justify-center transform transition-all duration-1000 delay-400 ${ctaRef.isVisible ? 'translate-y-0 opacity-100' : 'translate-y-12 opacity-0'}`}>
              <Button size="lg" className="bg-white/20 backdrop-blur-sm border-white/30 text-white hover:bg-white/30 hover:scale-105 transition-all duration-300" asChild>
                <Link to="/login">
                  {t('home.cta.getStarted')}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="border-white/40 bg-white/10 text-white hover:bg-white/20 hover:text-white hover:scale-105 transition-all duration-300" asChild>
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