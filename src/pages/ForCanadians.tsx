import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Link } from "react-router-dom";
import { 
  MapPin,
  ArrowRight,
  Home as HomeIcon,
  Briefcase,
  Car,
  Heart,
  GraduationCap,
  AlertTriangle,
  Users,
  FileText,
  ExternalLink,
  Shield,
  Building,
  DollarSign
} from "lucide-react";

const ForCanadians = () => {
  const [selectedProvince, setSelectedProvince] = useState("");
  const [selectedCategoryId, setSelectedCategoryId] = useState("");

  const provinces = [
    { code: "AB", name: "Alberta" },
    { code: "BC", name: "British Columbia" },
    { code: "MB", name: "Manitoba" },
    { code: "NB", name: "New Brunswick" },
    { code: "NL", name: "Newfoundland and Labrador" },
    { code: "NS", name: "Nova Scotia" },
    { code: "ON", name: "Ontario" },
    { code: "PE", name: "Prince Edward Island" },
    { code: "QC", name: "Quebec" },
    { code: "SK", name: "Saskatchewan" },
    { code: "NT", name: "Northwest Territories" },
    { code: "NU", name: "Nunavut" },
    { code: "YT", name: "Yukon" }
  ];

  const lifeEvents = [
    {
      id: "housing",
      icon: HomeIcon,
      title: "Housing & Tenant Rights",
      description: "Renting, buying, landlord disputes, evictions",
      color: "bg-blue-50 text-blue-600",
      scenarios: [
        "My landlord won't fix the heating",
        "I'm being evicted - what are my rights?",
        "Security deposit not returned",
        "Rent increase seems too high",
        "Buying my first home"
      ]
    },
    {
      id: "employment",
      icon: Briefcase,
      title: "Employment & Workplace",
      description: "Job contracts, harassment, wrongful dismissal",
      color: "bg-green-50 text-green-600",
      scenarios: [
        "Fired without cause or notice",
        "Workplace harassment or discrimination",
        "Overtime pay disputes",
        "Contract terms seem unfair",
        "Maternity/paternity leave rights"
      ]
    },
    {
      id: "consumer",
      icon: Car,
      title: "Consumer Rights",
      description: "Purchases, warranties, scams, contracts",
      color: "bg-purple-50 text-purple-600",
      scenarios: [
        "Car dealership won't honor warranty",
        "Defective product won't be refunded",
        "Subscription I can't cancel",
        "Credit card fraud",
        "Door-to-door sales pressure"
      ]
    },
    {
      id: "family",
      icon: Heart,
      title: "Family & Personal",
      description: "Divorce, custody, wills, healthcare",
      color: "bg-pink-50 text-pink-600",
      scenarios: [
        "Going through a separation",
        "Child custody arrangements",
        "Need to write a will",
        "Power of attorney questions",
        "Medical consent issues"
      ]
    },
    {
      id: "education",
      icon: GraduationCap,
      title: "Education & Students",
      description: "Student loans, appeals, discrimination",
      color: "bg-orange-50 text-orange-600",
      scenarios: [
        "Student loan repayment problems",
        "Academic appeal process",
        "Campus harassment issues",
        "International student rights",
        "Education funding disputes"
      ]
    },
    {
      id: "disputes",
      icon: AlertTriangle,
      title: "Disputes & Conflicts",
      description: "Small claims, neighbours, civil matters",
      color: "bg-red-50 text-red-600",
      scenarios: [
        "Neighbour property line dispute",
        "Small claims court process",
        "Contract breach by business",
        "Personal injury claim",
        "Debt collection harassment"
      ]
    }
  ];

  const quickTools = [
    {
      icon: FileText,
      title: "Document Explainer",
      description: "Upload any legal document for plain-English explanation",
      link: "/document-explainer"
    },
    {
      icon: Users,
      title: "Talk to a Human",
      description: "Schedule a consultation with a legal professional",
      link: "/contact"
    },
    {
      icon: ExternalLink,
      title: "Government Resources",
      description: "Direct links to official Canadian legal resources",
      link: "/resources"
    }
  ];

  const selectedCategory = lifeEvents.find(event => event.id === selectedCategoryId);

  return (
    <div className="min-h-screen pt-20">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-hero-gradient section-padding">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-8">
            <Badge variant="outline" className="w-fit border-primary/20 text-primary hover-scale">
              <MapPin className="h-4 w-4 mr-2" />
              <span className="text-lg font-medium">Your Rights, Your Province</span>
            </Badge>
            
            <div className="space-y-4">
              <h1 className="text-5xl lg:text-6xl font-bold text-foreground leading-tight">
                Know Your Rights
                <br />
                <span className="bg-primary-gradient bg-clip-text text-transparent">
                  Right Where You Live
                </span>
              </h1>
              <p className="text-2xl text-muted-foreground max-w-4xl mx-auto">
                Select your province and life situation to get personalized legal guidance that actually applies to you
              </p>
            </div>

            {/* Province & Category Selector */}
            <div className="max-w-2xl mx-auto space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Select value={selectedProvince} onValueChange={setSelectedProvince}>
                  <SelectTrigger className="h-12 text-lg">
                    <SelectValue placeholder="Select your province" />
                  </SelectTrigger>
                  <SelectContent>
                    {provinces.map((province) => (
                      <SelectItem key={province.code} value={province.code}>
                        {province.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={selectedCategoryId} onValueChange={setSelectedCategoryId}>
                  <SelectTrigger className="h-12 text-lg">
                    <SelectValue placeholder="What do you need help with?" />
                  </SelectTrigger>
                  <SelectContent>
                    {lifeEvents.map((event) => (
                      <SelectItem key={event.id} value={event.id}>
                        {event.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {selectedProvince && selectedCategoryId && (
                <Button size="lg" className="bg-primary-gradient hover:shadow-glow transition-all duration-300 text-white font-semibold border-0">
                  Get My Rights Information
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Life Situations Grid */}
      <section className="section-padding bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-foreground mb-4">
              What Legal Situation Are You Facing?
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Click on your situation to see common scenarios and get specific guidance
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {lifeEvents.map((event) => (
              <Card 
                key={event.id} 
                className={`cursor-pointer transition-all duration-300 hover:shadow-lg hover:scale-102 ${
                  selectedCategoryId === event.id ? 'ring-2 ring-primary' : ''
                }`}
                onClick={() => setSelectedCategoryId(event.id)}
              >
                <CardHeader>
                  <div className={`w-12 h-12 ${event.color} rounded-xl flex items-center justify-center mb-4`}>
                    <event.icon className="h-6 w-6" />
                  </div>
                  <CardTitle className="text-xl">{event.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">{event.description}</p>
                  <div className="flex items-center text-primary">
                    <ArrowRight className="h-4 w-4 mr-2" />
                    <span className="text-sm font-medium">Explore Scenarios</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Selected Category Details */}
          {selectedCategory && (
            <div className="mt-16 p-8 bg-accent/5 rounded-2xl border border-accent/20">
              <div className="flex items-center gap-4 mb-6">
                <div className={`w-16 h-16 ${selectedCategory.color} rounded-xl flex items-center justify-center`}>
                  <selectedCategory.icon className="h-8 w-8" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-foreground">{selectedCategory.title}</h3>
                  <p className="text-muted-foreground">{selectedCategory.description}</p>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="text-lg font-semibold text-foreground mb-3">Common scenarios in this area:</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {selectedCategory.scenarios.map((scenario, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      className="justify-start h-auto p-4 text-left hover:bg-primary/5"
                      asChild
                    >
                      <Link to={`/help?category=${selectedCategory.id}&scenario=${index}&province=${selectedProvince}`}>
                        <div>
                          <p className="font-medium">{scenario}</p>
                          <p className="text-sm text-muted-foreground">Get specific guidance →</p>
                        </div>
                      </Link>
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Quick Tools */}
      <section className="section-padding bg-gradient-to-br from-background via-accent/5 to-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-foreground mb-4">
              Need Help Right Now?
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Use these tools to get immediate assistance with your legal questions
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {quickTools.map((tool, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-all duration-300 group">
                <CardContent className="p-8">
                  <div className="w-16 h-16 bg-primary/10 rounded-xl flex items-center justify-center mx-auto mb-6 group-hover:scale-105 transition-all duration-300">
                    <tool.icon className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold text-foreground mb-3">{tool.title}</h3>
                  <p className="text-muted-foreground mb-6">{tool.description}</p>
                  <Button asChild className="bg-primary-gradient hover:shadow-glow transition-all duration-300 text-white font-semibold border-0">
                    <Link to={tool.link}>
                      Try Now
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Features Preview */}
      <section className="section-padding bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-8">
              <div className="space-y-4">
                <Badge variant="outline" className="w-fit">Why Choose XenoraAI</Badge>
                <h2 className="text-4xl font-bold text-foreground">
                  Legal Knowledge That
                  <span className="bg-primary-gradient bg-clip-text text-transparent"> Understands Canada</span>
                </h2>
                <p className="text-xl text-muted-foreground">
                  Unlike generic legal AI, we're built specifically for Canadian law, provincial differences, and the real situations you face.
                </p>
              </div>

              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 bg-green-100 text-green-600 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Shield className="h-4 w-4" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">Province-Specific Guidance</h3>
                    <p className="text-muted-foreground">Quebec's Civil Code, Ontario's Residential Tenancies Act, BC's strata laws - we know them all.</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Building className="h-4 w-4" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">Government Integration</h3>
                    <p className="text-muted-foreground">Direct links to official forms, resources, and contact information for your situation.</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 bg-purple-100 text-purple-600 rounded-lg flex items-center justify-center flex-shrink-0">
                    <DollarSign className="h-4 w-4" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">Free to Start</h3>
                    <p className="text-muted-foreground">Basic legal guidance is always free. Pay only when you need advanced features or consultations.</p>
                  </div>
                </div>
              </div>

              <Button size="lg" asChild className="bg-primary-gradient hover:shadow-glow transition-all duration-300 text-white font-semibold border-0">
                <Link to="/about">
                  Learn More About Us
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>

            <div className="relative">
              {/* Visual representation of Canada */}
              <div className="relative bg-gradient-to-br from-primary/10 to-accent/10 rounded-2xl p-8 h-96 flex items-center justify-center">
                <div className="text-center space-y-4">
                  <div className="text-6xl mb-4">🍁</div>
                  <h3 className="text-2xl font-bold text-foreground">Built for Canada</h3>
                  <p className="text-muted-foreground">From coast to coast to coast</p>
                  <div className="flex flex-wrap justify-center gap-2 mt-6">
                    {provinces.slice(0, 6).map((province) => (
                      <Badge key={province.code} variant="secondary" className="text-xs">
                        {province.code}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ForCanadians;