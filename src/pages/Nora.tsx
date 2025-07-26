import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Link } from "react-router-dom";
import { 
  Bot, 
  Shield, 
  Clock, 
  FileText, 
  Scale, 
  Search, 
  Languages,
  CheckCircle, 
  ArrowRight,
  Sparkles,
  Zap,
  Globe,
  Users,
  Database
} from "lucide-react";

const Nora = () => {
  const features = [
    "Legal Q&A with citations from Canadian federal and provincial case law",
    "Document upload and parsing (PDF, DOCX, TXT) with clause extraction",
    "Contract summarization with key terms and obligations highlighted",
    "Context-aware prompting for lawyers, judges, or clients",
    "Meeting notes summarization and smart task reminders",
    "Real-time Retrieval-Augmented Generation (RAG) for legal knowledge search",
    "Personalized responses with long-term user memory",
    "Multilingual support for English and French legal documents",
    "Compliance with PIPEDA and SOC2 for data security"
  ];

  const useCases = [
    {
      icon: Search,
      title: "Legal Research",
      description: "Nora delivers precise answers to complex legal queries with citations from Canadian case law, saving hours of manual research.",
      highlight: "Save 80% research time"
    },
    {
      icon: FileText,
      title: "Document Analysis",
      description: "Nora parses contracts and legal documents, extracting key clauses and summarizing content for quick review.",
      highlight: "Instant clause extraction"
    },
    {
      icon: Zap,
      title: "Task Automation",
      description: "Nora automates repetitive tasks like meeting note summarization and deadline reminders, boosting efficiency.",
      highlight: "Boost productivity 3x"
    },
    {
      icon: Users,
      title: "Client Communication",
      description: "Generate clear, accessible explanations of legal concepts for clients, improving understanding and satisfaction.",
      highlight: "Enhanced client experience"
    }
  ];

  const specifications = [
    {
      icon: Database,
      title: "Canadian Legal Database",
      description: "Trained on comprehensive Canadian and provincial legal data with RAG-enabled search.",
      metric: "10M+ Cases"
    },
    {
      icon: Clock,
      title: "Response Time",
      description: "Optimized for speed and accuracy in a high-performance environment.",
      metric: "< 5 seconds"
    },
    {
      icon: Languages,
      title: "Legal Intelligence",
      description: "Specialized in legal Q&A, document analysis, and task automation for Canadian law.",
      metric: "EN/FR Support"
    },
    {
      icon: Shield,
      title: "Compliance",
      description: "Adheres to Canadian data protection and security standards.",
      metric: "PIPEDA, SOC2"
    },
    {
      icon: Globe,
      title: "Integration",
      description: "Integrates with legal management software and APIs for streamlined workflows.",
      metric: "Seamless API"
    },
    {
      icon: Scale,
      title: "Scalability",
      description: "Supports firms of all sizes with scalable, cloud-based infrastructure.",
      metric: "Cloud-Based"
    }
  ];

  return (
    <div className="min-h-screen pt-20">
      {/* Header */}
      <section className="py-16 bg-hero-gradient">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <Badge variant="outline" className="w-fit">
                <Bot className="h-3 w-3 mr-1" />
                AI Legal Assistant
              </Badge>
              
              <div className="space-y-4">
                <h1 className="text-5xl lg:text-6xl font-bold text-foreground leading-tight">
                  Meet
                  <br />
                  <span className="bg-primary-gradient bg-clip-text text-transparent">
                    Nora
                  </span>
                </h1>
                <p className="text-xl text-muted-foreground">
                  Canada's smartest legal AI assistant, powering intelligent legal research, 
                  document analysis, and task automation for legal professionals.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" asChild className="bg-primary-gradient hover:shadow-glow transition-all duration-300">
                  <Link to="/login">
                    Try Nora Now
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <Button size="lg" variant="outline" asChild>
                  <Link to="/contact">Schedule Demo</Link>
                </Button>
              </div>
            </div>

            {/* Feature Preview */}
            <Card className="bg-card-gradient border-primary/10 shadow-primary">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Bot className="h-5 w-5 text-primary" />
                  <span>Nora AI Assistant</span>
                </CardTitle>
                <CardDescription>Demo Coming Soon</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-accent/50 rounded-lg p-4">
                  <p className="text-sm text-muted-foreground mb-2">Query:</p>
                  <p className="font-medium">"What are the key elements of a valid contract in Ontario?"</p>
                </div>
                <div className="bg-primary/5 rounded-lg p-4">
                  <p className="text-sm text-muted-foreground mb-2">Nora's Response:</p>
                  <p className="text-sm">In Ontario, a valid contract requires: 1) Offer and acceptance, 2) Consideration, 3) Intention to create legal relations, 4) Capacity to contract...</p>
                  <p className="text-xs text-primary mt-2">Source: Ontario Contract Law, R.S.O. 1990</p>
                </div>
                <Progress value={85} className="h-2" />
                <p className="text-xs text-muted-foreground">Response generated in 3.2 seconds</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-foreground mb-4">
              Nora Showcase
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Discover Nora's comprehensive capabilities designed specifically for Canadian legal professionals.
            </p>
          </div>

          <Card className="bg-card-gradient border-primary/10">
            <CardHeader>
              <CardTitle>Key Features</CardTitle>
              <CardDescription>Everything you need for intelligent legal assistance</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {features.map((feature, index) => (
                  <div key={index} className="flex items-start space-x-3 p-3 rounded-lg hover:bg-accent/50 transition-colors">
                    <CheckCircle className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-foreground">{feature}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Use Cases */}
      <section className="py-20 bg-accent/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-foreground mb-4">
              Nora Use Cases
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Explore how Nora transforms legal workflows for various professionals in Canadian law firms.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {useCases.map((useCase, index) => (
              <Card key={index} className="bg-card-gradient border-primary/10 hover:shadow-elegant transition-all duration-300">
                <CardContent className="p-8">
                  <div className="flex items-center space-x-4 mb-6">
                    <div className="w-14 h-14 bg-primary/10 rounded-xl flex items-center justify-center">
                      <useCase.icon className="h-7 w-7 text-primary" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-foreground">{useCase.title}</h3>
                      <Badge variant="outline" className="mt-1">{useCase.highlight}</Badge>
                    </div>
                  </div>
                  <p className="text-muted-foreground">{useCase.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Technical Specifications */}
      <section className="py-20 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-foreground mb-4">
              Nora Technical Specifications
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Discover the robust architecture powering Nora's intelligent legal solutions.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {specifications.map((spec, index) => (
              <Card key={index} className="bg-card-gradient border-primary/10 hover:shadow-elegant transition-all duration-300 text-center">
                <CardContent className="p-8">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                    <spec.icon className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">{spec.title}</h3>
                  <Badge variant="outline" className="mb-4">{spec.metric}</Badge>
                  <p className="text-muted-foreground text-sm">{spec.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Preview */}
      <section className="py-20 bg-accent/30">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-foreground mb-8">Ready to Experience Nora?</h2>
          <Card className="bg-card-gradient border-primary/10 shadow-elegant">
            <CardContent className="p-12">
              <div className="space-y-6">
                <div className="flex items-center justify-center space-x-2">
                  <Bot className="h-8 w-8 text-primary" />
                  <span className="text-2xl font-bold text-foreground">Nora AI Assistant</span>
                </div>
                
                <div className="space-y-4">
                  <div className="text-4xl font-bold text-primary">Starting at $49/month</div>
                  <p className="text-muted-foreground">
                    Access Nora's full capabilities with our flexible subscription plans
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button size="lg" asChild className="bg-primary-gradient hover:shadow-glow transition-all duration-300">
                    <Link to="/login">
                      Start Free Trial
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                  <Button size="lg" variant="outline" asChild>
                    <Link to="/contact">Schedule Demo</Link>
                  </Button>
                </div>

                <Badge variant="secondary" className="mt-4">
                  <Sparkles className="h-3 w-3 mr-1" />
                  Demo Available Soon
                </Badge>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
};

export default Nora;