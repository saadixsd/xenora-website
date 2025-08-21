import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Link } from "react-router-dom";
import { 
  Bot, 
  Shield, 
  Target, 
  Users, 
  Sparkles, 
  Linkedin,
  ArrowRight
} from "lucide-react";
import XenoraLogo from "@/components/XenoraLogo";
import ScheduleDemoButton from "@/components/ScheduleDemoButton";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { useTranslation } from 'react-i18next';

const About = () => {
  const heroRef = useScrollAnimation();
  const missionRef = useScrollAnimation();
  const valuesRef = useScrollAnimation();
  const teamRef = useScrollAnimation();
  const { t } = useTranslation();

  // Helper function to get avatar URL from LinkedIn  
  const getAvatarUrl = (linkedinUrl: string, name: string) => {
    const username = linkedinUrl.split('/in/')[1]?.replace('/', '');
    // Use multiple services with fallback to a name-based avatar
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&size=128&background=f97316&color=ffffff&bold=true&format=png`;
  };

  // Helper function to get initials
  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };
  
  const values = [
    {
      icon: Sparkles,
      title: t('about.values.innovation.title'),
      description: t('about.values.innovation.description')
    },
    {
      icon: Shield,
      title: t('about.values.integrity.title'),
      description: t('about.values.integrity.description')
    },
    {
      icon: Target,
      title: t('about.values.impact.title'),
      description: t('about.values.impact.description')
    }
  ];

  const teamLines = [
    // Executive Leadership Row 1: CEO
    [
      {
        name: "Saad Kashif",
        role: "Founder & CEO",
        description: "Leading XenoraAI's vision and strategy while enhancing AI research in Machine Learning and Neural Network Applications.",
        linkedin: "https://www.linkedin.com/in/saad-kashif/"
      }
    ],
    // Executive Leadership Row 2: COO/CMO
    [
      {
        name: "Gavin Martin",
        role: "Founder & COO/CMO",
        description: "Overseeing operational excellence and growth while driving marketing initiatives for Xenora's AI solutions.",
        linkedin: "https://www.linkedin.com/in/gavin-m-4a8718274/"
      }
    ],
    // C-Suite Row: CTO and CFO
    [
      {
        name: "Yacine Eldjidel",
        role: "CTO / DevOps Engineer",
        description: "Architecting XenoraAI's technical infrastructure while tackling breakthroughs in NLP, Computer Vision, and AI systems deployment.",
        linkedin: "https://www.linkedin.com/in/yacine-eldjidel-b1838a32a/"
      },
      {
        name: "Luna",
        role: "CFO",
        description: "Managing XenoraAI's financial strategy, investor relations, and business development to drive sustainable growth and market expansion.",
        linkedin: "#"
      }
    ],
    // Senior Team
    [
      {
        name: "Sila Ben Khelifa",
        role: "Chief Software Architect",
        description: "Orchestrating XenoraAI's digital transformation through strategic IT leadership, secure data ecosystems, and technology roadmap alignment.",
        linkedin: "https://www.linkedin.com/in/sila-bk-8553692b2/"
      },
      {
        name: "Yassen Hegazy",
        role: "AI Director",
        description: "Developing and optimizing AI models for legal applications with focus on natural language processing and machine learning.",
        linkedin: "https://www.linkedin.com/in/yassen-hegazy-33aa28330/"
      },
      {
        name: "Ali Al-Dhaher",
        role: "Chief Security Officer (CSO)",
        description: "Leading XenoraAI's security strategy and ensuring comprehensive protection of client data, platform integrity, and regulatory compliance.",
        linkedin: "https://www.linkedin.com/in/alialdhaher/"
      }
    ],
    // Core Team
    [
      {
        name: "Jayden Nkeuze",
        role: "AI Research Engineer",
        description: "Conducting advanced AI research and developing cutting-edge machine learning algorithms to push the boundaries of artificial intelligence in legal technology.",
        linkedin: "https://www.linkedin.com/in/jayden-nkueze/"
      }
    ]
  ];

  const missions = [
    {
      icon: Users,
      title: t('about.mission.access.title'),
      description: t('about.mission.access.description')
    },
    {
      icon: Bot,
      title: t('about.mission.innovation.title'),
      description: t('about.mission.innovation.description')
    },
    {
      icon: Shield,
      title: t('about.mission.canadian.title'),
      description: t('about.mission.canadian.description')
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
          <Badge variant="outline" className="mb-8 border-primary/30 bg-primary/5">
            <Users className="h-4 w-4 mr-2" />
            <span className="text-lg font-medium">{t('about.hero.badge')}</span>
          </Badge>
          <h1 className="text-7xl font-bold text-foreground mb-8 animate-fade-in-up">
            About <span className="bg-primary-gradient bg-clip-text text-transparent">XenoraAI</span>
          </h1>
          <p className="text-2xl text-muted-foreground max-w-4xl mx-auto leading-relaxed mb-8">
            {t('about.hero.description')}
          </p>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto opacity-80">
            Founded in Canada with a vision to democratize legal technology, we're building AI solutions that understand the complexities of Canadian law and make legal expertise accessible to everyone.
          </p>
        </div>
      </section>

      {/* Our Story Section */}
      <section className="section-padding bg-background">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h2 className="text-4xl font-bold text-foreground">Our Story</h2>
              <p className="text-lg text-muted-foreground leading-relaxed">
                XenoraAI was born from a simple observation: the legal industry was ripe for transformation. 
                Our founders, with backgrounds in AI research and legal technology, recognized that Canadian 
                law firms needed intelligent solutions designed specifically for their unique needs.
              </p>
              <p className="text-lg text-muted-foreground leading-relaxed">
                What started as late-night conversations about the intersection of artificial intelligence 
                and legal practice has evolved into a comprehensive platform that's reshaping how legal 
                professionals work across Canada.
              </p>
              <div className="flex items-center space-x-4 pt-4">
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary">2025</div>
                  <div className="text-sm text-muted-foreground">Founded</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary">7+</div>
                  <div className="text-sm text-muted-foreground">Team Members</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary">∞</div>
                  <div className="text-sm text-muted-foreground">Possibilities</div>
                </div>
              </div>
            </div>
            <div className="relative">
              <Card className="bg-card-gradient border-primary/10 shadow-elegant">
                <CardContent className="p-8">
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                      <span className="text-sm font-medium">Founded with Canadian legal focus</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                      <span className="text-sm font-medium">AI-first approach to legal technology</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                      <span className="text-sm font-medium">Building for accessibility and innovation</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                      <span className="text-sm font-medium">Commitment to data security and compliance</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="section-padding section-swoosh bg-accent/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div 
            ref={missionRef.ref}
            className={`text-center mb-16 transition-all duration-700 ${
              missionRef.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
          >
            <h2 className="text-4xl font-bold text-foreground mb-4">{t('about.mission.title')}</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              {t('about.mission.description')}
            </p>
          </div>

          <div 
            className={`grid grid-cols-1 md:grid-cols-3 gap-8 transition-all duration-700 delay-200 ${
              missionRef.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
          >
            {missions.map((mission, index) => (
              <Card key={index} className="bg-card-gradient border-primary/10 hover:shadow-elegant hover-lift transition-all duration-300 text-center">
                <CardContent className="p-8">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                    <mission.icon className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold text-foreground mb-4">{mission.title}</h3>
                  <p className="text-muted-foreground">{mission.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="section-padding section-swoosh bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div 
            ref={valuesRef.ref}
            className={`text-center mb-16 transition-all duration-700 ${
              valuesRef.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
          >
            <h2 className="text-4xl font-bold text-foreground mb-4">{t('about.values.title')}</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              {t('about.values.description')}
            </p>
          </div>

          <div 
            className={`grid grid-cols-1 md:grid-cols-3 gap-8 transition-all duration-700 delay-200 ${
              valuesRef.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
          >
            {values.map((value, index) => (
              <div key={index} className="text-center space-y-6 hover-scale">
                <div className="w-20 h-20 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto">
                  <value.icon className="h-10 w-10 text-primary" />
                </div>
                <h3 className="text-2xl font-semibold text-foreground">{value.title}</h3>
                <p className="text-muted-foreground text-lg">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="relative section-padding section-swoosh bg-accent/5">
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div 
            ref={teamRef.ref}
            className={`text-center mb-16 transition-all duration-700 ${
              teamRef.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
          >
            <div className="flex items-center justify-center mb-6">
              <div className="h-px bg-gradient-to-r from-transparent via-orange-400 to-transparent w-32"></div>
              <div className="mx-4 w-3 h-3 bg-orange-400 rounded-full animate-pulse"></div>
              <div className="h-px bg-gradient-to-r from-transparent via-orange-400 to-transparent w-32"></div>
            </div>
            <h2 className="text-4xl font-bold text-foreground mb-4">{t('about.team.title')}</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              {t('about.team.description')}
            </p>
          </div>

          <div 
            className={`space-y-12 transition-all duration-700 delay-200 ${
              teamRef.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
          >
            {teamLines.map((line, lineIndex) => (
              <div key={lineIndex} className={`flex justify-center ${
                line.length === 2 ? 'gap-8' : 'gap-6'
              } flex-wrap`}>
                {line.map((member, memberIndex) => (
                <Card key={memberIndex} className="relative bg-card-gradient border-primary/10 hover:shadow-elegant hover-lift transition-all duration-300 w-full sm:w-80 group">
                  {/* Orange accent border on hover */}
                  <div className="absolute inset-0 bg-gradient-to-r from-orange-400 via-accent to-primary opacity-0 group-hover:opacity-20 rounded-lg transition-opacity duration-300"></div>
                  <CardContent className="relative p-8 text-center">
                    <Avatar className="w-20 h-20 mx-auto mb-6 ring-2 ring-primary/20 group-hover:ring-orange-400/40 transition-all duration-300">
                      <AvatarImage 
                        src={getAvatarUrl(member.linkedin, member.name)}
                        alt={`${member.name} profile picture`}
                        className="object-cover"
                      />
                      <AvatarFallback className="bg-gradient-to-br from-orange-100 to-primary/10 text-primary font-semibold text-lg group-hover:from-orange-200 group-hover:to-orange-100 group-hover:text-orange-500 transition-colors duration-300">
                        {getInitials(member.name)}
                      </AvatarFallback>
                    </Avatar>
                    <h3 className="text-xl font-semibold text-foreground mb-2">{member.name}</h3>
                    <p className="text-sm text-primary font-medium mb-4">{member.role}</p>
                    <p className="text-muted-foreground text-sm mb-6">{member.description}</p>
                    {member.linkedin !== "#" && (
                      <Button variant="outline" size="sm" className="border-orange-300 text-orange-600 hover:bg-orange-50 hover:border-orange-400 hover:text-orange-700 transition-all duration-300" asChild>
                        <a href={member.linkedin} target="_blank" rel="noopener noreferrer">
                          <Linkedin className="h-4 w-4 mr-2" />
                          LinkedIn
                        </a>
                      </Button>
                    )}
                  </CardContent>
                </Card>
                ))}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary-gradient">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="space-y-8">
            <h2 className="text-4xl font-bold text-white mb-4">
              {t('about.cta.title')}
            </h2>
            <p className="text-xl text-white/90 max-w-3xl mx-auto">
              {t('about.cta.description')}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-white/20 backdrop-blur-sm border-white/30 text-white hover:bg-white/30" asChild>
                <Link to="/login">
                  {t('about.cta.button')}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <ScheduleDemoButton size="lg" className="border-white/20 text-white hover:bg-white/10" />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;