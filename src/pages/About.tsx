import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
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

const About = () => {
  const heroRef = useScrollAnimation();
  const missionRef = useScrollAnimation();
  const valuesRef = useScrollAnimation();
  const teamRef = useScrollAnimation();
  const values = [
    {
      icon: Sparkles,
      title: "Innovation",
      description: "Constantly pushing boundaries to develop novel AI solutions that address real-world legal problems."
    },
    {
      icon: Shield,
      title: "Integrity",
      description: "Maintaining the highest ethical standards in AI development, ensuring transparency and accountability."
    },
    {
      icon: Target,
      title: "Impact",
      description: "Every solution we create is designed to deliver measurable value and positive transformation."
    }
  ];

  const teamLines = [
    [
      {
        name: "Saad",
        role: "Founder & CEO",
        description: "Leading XenoraAI's vision and strategy while enhancing AI research in Machine Learning and Neural Network Applications.",
        linkedin: "https://www.linkedin.com/in/saad-kashif/"
      },
      {
        name: "Gavin",
        role: "Founder & COO/CMO",
        description: "Overseeing operational excellence and growth while driving marketing initiatives for Xenora's AI solutions.",
        linkedin: "https://www.linkedin.com/in/gavin-m-4a8718274/"
      }
    ],
    [
      {
        name: "Yacine",
        role: "CTO / DevOps Engineer",
        description: "Architecting XenoraAI's technical infrastructure while tackling breakthroughs in NLP, Computer Vision, and AI systems deployment.",
        linkedin: "https://www.linkedin.com/in/yacine-eldjidel-b1838a32a/"
      },
      {
        name: "Sila",
        role: "Chief Information Officer",
        description: "Orchestrating XenoraAI's digital transformation through strategic IT leadership, secure data ecosystems, and technology roadmap alignment.",
        linkedin: "https://www.linkedin.com/in/sila-bk-8553692b2/"
      },
      {
        name: "Yassen",
        role: "AI Director",
        description: "Leading AI strategy and research with specialized expertise in advanced machine learning methodologies.",
        linkedin: "#"
      }
    ],
    [
      {
        name: "Ali",
        role: "Software Development Engineer",
        description: "Building scalable software solutions and integrations for XenoraAI's platform infrastructure and user experience.",
        linkedin: "#"
      },
      {
        name: "Jayden Nkeuze",
        role: "AI Research Engineer",
        description: "Developing and optimizing AI models for legal applications with focus on natural language processing and machine learning.",
        linkedin: "#"
      }
    ]
  ];

  const missions = [
    {
      icon: Users,
      title: "Access to Justice",
      description: "Making legal information and assistance accessible to everyone, regardless of their background or resources."
    },
    {
      icon: Bot,
      title: "AI-Powered Innovation",
      description: "Leveraging cutting-edge artificial intelligence to enhance legal research, document analysis, and case preparation."
    },
    {
      icon: Shield,
      title: "Canadian Focus",
      description: "Specialized in Canadian law with deep understanding of provincial differences and bilingual support."
    }
  ];

  return (
    <div className="min-h-screen pt-20 page-fade-in">
      {/* Header */}
      <section className="section-padding bg-hero-gradient shadow-elegant">
        <div 
          ref={heroRef.ref}
          className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center transition-all duration-700 ${
            heroRef.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          <Badge variant="outline" className="mb-8 border-primary/30 bg-primary/5">
            <Users className="h-4 w-4 mr-2" />
            <span className="text-lg font-medium">About XenoraAI</span>
          </Badge>
          <h1 className="text-7xl font-bold text-foreground mb-8 animate-fade-in-up">
            About <span className="bg-primary-gradient bg-clip-text text-transparent">XenoraAI</span>
          </h1>
          <p className="text-2xl text-muted-foreground max-w-4xl mx-auto leading-relaxed">
            We're building the future of legal technology, democratizing access to sophisticated 
            AI tools for legal professionals across Canada.
          </p>
        </div>
      </section>

      {/* Mission Section */}
      <section className="section-padding section-swoosh bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div 
            ref={missionRef.ref}
            className={`text-center mb-16 transition-all duration-700 ${
              missionRef.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
          >
            <h2 className="text-4xl font-bold text-foreground mb-4">Our Mission</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Transforming the legal landscape through accessible AI technology and ethical innovation.
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
      <section className="section-padding section-swoosh bg-accent/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div 
            ref={valuesRef.ref}
            className={`text-center mb-16 transition-all duration-700 ${
              valuesRef.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
          >
            <h2 className="text-4xl font-bold text-foreground mb-4">What Drives Us Forward</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Our core values guide every decision we make and every solution we create.
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
      <section className="section-padding section-swoosh bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div 
            ref={teamRef.ref}
            className={`text-center mb-16 transition-all duration-700 ${
              teamRef.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
          >
            <h2 className="text-4xl font-bold text-foreground mb-4">Meet Our Team</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              The brilliant minds driving XenoraAI's vision forward
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
                  <Card key={memberIndex} className="bg-card-gradient border-primary/10 hover:shadow-elegant hover-lift transition-all duration-300 w-full sm:w-80">
                    <CardContent className="p-8 text-center">
                      <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                        <Users className="h-10 w-10 text-primary" />
                      </div>
                      <h3 className="text-xl font-semibold text-foreground mb-2">{member.name}</h3>
                      <p className="text-sm text-primary font-medium mb-4">{member.role}</p>
                      <p className="text-muted-foreground text-sm mb-6">{member.description}</p>
                      {member.linkedin !== "#" && (
                        <Button variant="outline" size="sm" asChild>
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
              Join Our Vision
            </h2>
            <p className="text-xl text-white/90 max-w-3xl mx-auto">
              Be part of the legal AI revolution. Experience the future of legal technology with XenoraAI.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" variant="secondary" asChild>
                <Link to="/login">
                  Get Started Today
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