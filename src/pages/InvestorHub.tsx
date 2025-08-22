import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Link } from "react-router-dom";
import { 
  TrendingUp,
  Users,
  DollarSign,
  Globe,
  Shield,
  Zap,
  Target,
  ChartBar,
  Building,
  Rocket,
  CheckCircle,
  ArrowRight,
  Download,
  Calendar,
  MapPin,
  Award,
  Briefcase
} from "lucide-react";

const InvestorHub = () => {
  const metrics = [
    {
      label: "Market Size (CAD Legal Tech)",
      value: "$2.1B",
      growth: "+23% YoY",
      icon: TrendingUp
    },
    {
      label: "Target Addressable Market",
      value: "$640M",
      growth: "By 2027",
      icon: Target
    },
    {
      label: "Active Beta Users",
      value: "2,847",
      growth: "+142% MoM",
      icon: Users
    },
    {
      label: "Revenue Pipeline",
      value: "$1.2M",
      growth: "Q1 2024",
      icon: DollarSign
    }
  ];

  const competitiveAdvantages = [
    {
      title: "Canada-First Legal AI",
      description: "Only AI specifically trained on Canadian federal and provincial law differences",
      icon: MapPin,
      strength: "Unique positioning"
    },
    {
      title: "Bilingual by Design",
      description: "Native French and English support reflecting Canadian legal reality",
      icon: Globe,
      strength: "Market requirement"
    },
    {
      title: "Human-AI Hybrid Model",
      description: "AI for speed, humans for complex matters - best of both worlds",
      icon: Users,
      strength: "Practical approach"
    },
    {
      title: "Privacy & Compliance",
      description: "PIPEDA compliant, Canadian-hosted, government-ready infrastructure",
      icon: Shield,
      strength: "Trust & security"
    }
  ];

  const milestones = [
    {
      quarter: "Q4 2023",
      achievements: [
        "Founded XenoraAI in Montreal",
        "Raised pre-seed funding",
        "Built core legal AI engine",
        "Launched closed beta"
      ],
      status: "completed"
    },
    {
      quarter: "Q1 2024",
      achievements: [
        "2,800+ beta users acquired",
        "Document explainer launched",
        "Quebec legal framework integration",
        "First revenue milestones"
      ],
      status: "completed"
    },
    {
      quarter: "Q2 2024",
      achievements: [
        "Series A funding round",
        "All-province legal coverage",
        "Enterprise pilot programs",
        "Team expansion to 15"
      ],
      status: "current"
    },
    {
      quarter: "Q3-Q4 2024",
      achievements: [
        "Public launch nationwide",
        "Government partnerships",
        "Professional tier launch",
        "5,000+ paying customers"
      ],
      status: "planned"
    }
  ];

  const teamHighlights = [
    {
      name: "Legal AI Expertise",
      description: "Former researchers from McGill, UofT, and UBC law schools",
      icon: Award
    },
    {
      name: "Tech Leadership",
      description: "Ex-Shopify, Microsoft, and IBM engineers",
      icon: Briefcase
    },
    {
      name: "Business Development",
      description: "Former McKinsey consultants and legal industry veterans",
      icon: Building
    }
  ];

  return (
    <div className="min-h-screen pt-20">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white section-padding">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_40%,rgba(120,119,198,0.3),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(255,77,79,0.2),transparent_50%)]" />
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <Badge variant="outline" className="w-fit border-white/20 text-white hover-scale">
                <Rocket className="h-4 w-4 mr-2" />
                <span className="text-lg font-medium">Investment Opportunity</span>
              </Badge>
              
              <div className="space-y-4">
                <h1 className="text-5xl lg:text-6xl font-bold leading-tight">
                  Democratizing Legal
                  <br />
                  <span className="bg-gradient-to-r from-purple-400 to-orange-400 bg-clip-text text-transparent">
                    Knowledge for Canada
                  </span>
                </h1>
                <p className="text-xl text-white/80 max-w-lg">
                  The first AI legal assistant built specifically for Canadian law. Addressing a $640M market with proven traction and unique positioning.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" className="bg-white text-slate-900 hover:bg-gray-100 font-semibold">
                  Download Pitch Deck
                  <Download className="ml-2 h-4 w-4" />
                </Button>
                <Button size="lg" variant="outline" className="border-white/20 text-white hover:bg-white/10">
                  Schedule Meeting
                  <Calendar className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Metrics Dashboard */}
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                {metrics.map((metric, index) => (
                  <Card key={index} className="bg-white/10 border-white/20 backdrop-blur-sm">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <metric.icon className="h-4 w-4 text-white" />
                        <span className="text-xs text-white/60">{metric.label}</span>
                      </div>
                      <div className="space-y-1">
                        <p className="text-2xl font-bold text-white">{metric.value}</p>
                        <p className="text-sm text-green-400">{metric.growth}</p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
              
              <Card className="bg-white/10 border-white/20 backdrop-blur-sm">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-white/80">Series A Progress</span>
                    <span className="text-sm text-white">$2.1M / $5M</span>
                  </div>
                  <Progress value={42} className="bg-white/20" />
                  <p className="text-xs text-white/60 mt-2">42% of target achieved</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Market Opportunity */}
      <section className="section-padding bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-foreground mb-4">
              Massive Market Opportunity
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Canadian legal services market valued at $16.2B with significant inefficiencies and access barriers
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
            <Card className="text-center">
              <CardContent className="p-8">
                <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center mx-auto mb-6">
                  <ChartBar className="h-8 w-8" />
                </div>
                <h3 className="text-2xl font-bold text-foreground mb-2">$16.2B</h3>
                <p className="text-muted-foreground mb-4">Canadian Legal Services Market</p>
                <Badge variant="secondary">+8.3% CAGR</Badge>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardContent className="p-8">
                <div className="w-16 h-16 bg-green-100 text-green-600 rounded-xl flex items-center justify-center mx-auto mb-6">
                  <Target className="h-8 w-8" />
                </div>
                <h3 className="text-2xl font-bold text-foreground mb-2">$640M</h3>
                <p className="text-muted-foreground mb-4">Addressable AI Legal Tech</p>
                <Badge variant="secondary">+23% YoY Growth</Badge>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardContent className="p-8">
                <div className="w-16 h-16 bg-purple-100 text-purple-600 rounded-xl flex items-center justify-center mx-auto mb-6">
                  <Users className="h-8 w-8" />
                </div>
                <h3 className="text-2xl font-bold text-foreground mb-2">29M</h3>
                <p className="text-muted-foreground mb-4">Canadian Adults (Target Users)</p>
                <Badge variant="secondary">Universal Need</Badge>
              </CardContent>
            </Card>
          </div>

          {/* Problem Statement */}
          <div className="bg-red-50 border border-red-200 rounded-2xl p-8 mb-16">
            <h3 className="text-2xl font-bold text-red-800 mb-6 text-center">The Access to Justice Crisis</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-4xl font-bold text-red-600 mb-2">67%</div>
                <p className="text-red-700">Of Canadians can't afford legal help when needed</p>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-red-600 mb-2">$450/hr</div>
                <p className="text-red-700">Average lawyer hourly rate in major cities</p>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-red-600 mb-2">3-6 months</div>
                <p className="text-red-700">Typical wait time for legal consultation</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Competitive Advantages */}
      <section className="section-padding bg-gradient-to-br from-background via-accent/5 to-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-foreground mb-4">
              Unique Competitive Advantages
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              What sets XenoraAI apart in the legal AI landscape
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {competitiveAdvantages.map((advantage, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-8">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center flex-shrink-0">
                      <advantage.icon className="h-6 w-6 text-primary" />
                    </div>
                    <div className="space-y-3">
                      <div>
                        <h3 className="text-xl font-semibold text-foreground">{advantage.title}</h3>
                        <Badge variant="outline" className="mt-1">{advantage.strength}</Badge>
                      </div>
                      <p className="text-muted-foreground">{advantage.description}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Roadmap & Milestones */}
      <section className="section-padding bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-foreground mb-4">
              Execution Roadmap
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Clear milestones with proven track record of execution
            </p>
          </div>

          <div className="space-y-8">
            {milestones.map((milestone, index) => (
              <Card key={index} className={`${
                milestone.status === 'completed' ? 'bg-green-50 border-green-200' :
                milestone.status === 'current' ? 'bg-blue-50 border-blue-200' :
                'bg-gray-50 border-gray-200'
              }`}>
                <CardContent className="p-8">
                  <div className="flex items-start gap-6">
                    <div className={`w-16 h-16 rounded-xl flex items-center justify-center flex-shrink-0 ${
                      milestone.status === 'completed' ? 'bg-green-100 text-green-600' :
                      milestone.status === 'current' ? 'bg-blue-100 text-blue-600' :
                      'bg-gray-100 text-gray-600'
                    }`}>
                      {milestone.status === 'completed' ? <CheckCircle className="h-8 w-8" /> :
                       milestone.status === 'current' ? <Zap className="h-8 w-8" /> :
                       <Target className="h-8 w-8" />}
                    </div>
                    <div className="space-y-4">
                      <div>
                        <h3 className="text-2xl font-bold text-foreground">{milestone.quarter}</h3>
                        <Badge variant={
                          milestone.status === 'completed' ? 'default' :
                          milestone.status === 'current' ? 'destructive' :
                          'secondary'
                        }>
                          {milestone.status === 'completed' ? 'Completed' :
                           milestone.status === 'current' ? 'In Progress' : 'Planned'}
                        </Badge>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {milestone.achievements.map((achievement, idx) => (
                          <div key={idx} className="flex items-center gap-2">
                            <CheckCircle className={`h-4 w-4 ${
                              milestone.status === 'completed' ? 'text-green-600' :
                              milestone.status === 'current' ? 'text-blue-600' :
                              'text-gray-400'
                            }`} />
                            <span className="text-foreground">{achievement}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="section-padding bg-gradient-to-br from-background via-accent/5 to-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-foreground mb-4">
              World-Class Team
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Combining deep legal expertise, cutting-edge AI knowledge, and proven business execution
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            {teamHighlights.map((highlight, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                <CardContent className="p-8">
                  <div className="w-16 h-16 bg-primary/10 rounded-xl flex items-center justify-center mx-auto mb-6">
                    <highlight.icon className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold text-foreground mb-3">{highlight.name}</h3>
                  <p className="text-muted-foreground">{highlight.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center">
            <Button size="lg" asChild className="bg-primary-gradient hover:shadow-glow transition-all duration-300 text-white font-semibold border-0">
              <Link to="/about">
                Meet the Full Team
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Financial Projections */}
      <section className="section-padding bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-foreground mb-4">
              Financial Projections
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Conservative estimates based on proven market traction and comparable companies
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="space-y-6">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-foreground font-medium">2024 Revenue Target</span>
                    <span className="text-2xl font-bold text-primary">$1.2M</span>
                  </div>
                  <Progress value={35} className="h-2" />
                  <p className="text-sm text-muted-foreground mt-1">35% achieved (Q1)</p>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-foreground font-medium">2025 Revenue Projection</span>
                    <span className="text-2xl font-bold text-primary">$5.8M</span>
                  </div>
                  <Progress value={100} className="h-2" />
                  <p className="text-sm text-muted-foreground mt-1">Conservative estimate</p>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-foreground font-medium">2026 Revenue Goal</span>
                    <span className="text-2xl font-bold text-primary">$15.2M</span>
                  </div>
                  <Progress value={100} className="h-2" />
                  <p className="text-sm text-muted-foreground mt-1">Market expansion</p>
                </div>
              </div>

              <div className="p-6 bg-white border border-border rounded-xl">
                <h3 className="text-lg font-semibold text-foreground mb-4">Revenue Streams</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Freemium Subscriptions</span>
                    <span className="font-medium">65%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Professional Services</span>
                    <span className="font-medium">25%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Enterprise Licensing</span>
                    <span className="font-medium">10%</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="p-6 bg-green-50 border border-green-200 rounded-xl">
                <h3 className="text-lg font-semibold text-green-800 mb-4">Key Metrics (Current)</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-2xl font-bold text-green-800">$42</p>
                    <p className="text-sm text-green-600">Monthly ARPU</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-green-800">92%</p>
                    <p className="text-sm text-green-600">User Retention</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-green-800">3.2x</p>
                    <p className="text-sm text-green-600">LTV/CAC Ratio</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-green-800">23%</p>
                    <p className="text-sm text-green-600">MoM Growth</p>
                  </div>
                </div>
              </div>

              <div className="p-6 bg-blue-50 border border-blue-200 rounded-xl">
                <h3 className="text-lg font-semibold text-blue-800 mb-4">Funding Usage</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-blue-700">Product Development</span>
                    <span className="font-medium text-blue-800">40%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-blue-700">Sales & Marketing</span>
                    <span className="font-medium text-blue-800">35%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-blue-700">Team Expansion</span>
                    <span className="font-medium text-blue-800">20%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-blue-700">Operations</span>
                    <span className="font-medium text-blue-800">5%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section-padding bg-primary-gradient">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="space-y-8">
            <div className="space-y-4">
              <h2 className="text-4xl font-bold text-white">
                Join Canada's Legal AI Revolution
              </h2>
              <p className="text-xl text-white/90 max-w-3xl mx-auto">
                Partner with us to democratize legal knowledge and capture a massive market opportunity
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
              <Button size="lg" className="bg-white text-slate-900 hover:bg-gray-100 font-semibold">
                Download Full Pitch Deck
                <Download className="ml-2 h-4 w-4" />
              </Button>
              <Button size="lg" variant="outline" className="border-white/20 text-white hover:bg-white/10">
                Schedule Investor Meeting
                <Calendar className="ml-2 h-4 w-4" />
              </Button>
            </div>

            <div className="pt-8">
              <div className="flex flex-wrap justify-center items-center gap-8 text-white/80">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5" />
                  <span>Series A: $5M target</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5" />
                  <span>$2.1M already committed</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5" />
                  <span>Due diligence ready</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default InvestorHub;