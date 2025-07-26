import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Link } from "react-router-dom";
import { 
  Bot, 
  Building, 
  Crown, 
  Settings, 
  LogOut, 
  User, 
  Calendar,
  FileText,
  BarChart3,
  Users,
  ArrowRight,
  Sparkles,
  Clock,
  CheckCircle
} from "lucide-react";

const Dashboard = () => {
  const [activeSubscription] = useState("Premium");
  const [usageData] = useState({
    nora: { used: 485, limit: 1000 },
    halo: { cases: 12, documents: 247 }
  });

  const recentActivity = [
    { type: "query", title: "Contract Analysis Request", time: "2 minutes ago", status: "completed" },
    { type: "document", title: "Lease Agreement Review", time: "1 hour ago", status: "completed" },
    { type: "case", title: "New Client Case Created", time: "3 hours ago", status: "active" },
    { type: "meeting", title: "Client Consultation Notes", time: "1 day ago", status: "completed" }
  ];

  const subscriptionPlans = [
    {
      name: "Basic",
      price: "$49/month",
      features: ["500 Nora queries", "Basic Halo features", "Email support"],
      current: activeSubscription === "Basic"
    },
    {
      name: "Premium",
      price: "$99/month",
      features: ["1000 Nora queries", "Full Halo suite", "Priority support", "Advanced analytics"],
      current: activeSubscription === "Premium"
    },
    {
      name: "Enterprise",
      price: "$199/month",
      features: ["Unlimited queries", "Team collaboration", "Custom integrations", "Dedicated support"],
      current: activeSubscription === "Enterprise"
    }
  ];

  return (
    <div className="min-h-screen pt-20 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">Welcome back, John</h1>
            <p className="text-muted-foreground">Access your Nora AI and Halo Legal Suite</p>
          </div>
          <div className="flex items-center space-x-4 mt-4 sm:mt-0">
            <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
              <Crown className="h-3 w-3 mr-1" />
              {activeSubscription} Plan
            </Badge>
            <Button variant="outline" size="icon">
              <Settings className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon">
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="nora">Nora AI</TabsTrigger>
            <TabsTrigger value="halo">Halo Suite</TabsTrigger>
            <TabsTrigger value="subscription">Subscription</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Quick Access */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="bg-card-gradient border-primary/10 hover:shadow-elegant transition-all duration-300">
                <CardHeader>
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                      <Bot className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <CardTitle>Nora AI Assistant</CardTitle>
                      <CardDescription>Legal research and document analysis</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Monthly Usage</span>
                    <span className="text-sm font-medium">{usageData.nora.used}/{usageData.nora.limit}</span>
                  </div>
                  <Progress value={(usageData.nora.used / usageData.nora.limit) * 100} className="h-2" />
                  <Button asChild className="w-full bg-primary-gradient hover:shadow-glow transition-all duration-300">
                    <Link to="/nora">
                      Launch Nora
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>

              <Card className="bg-card-gradient border-primary/10 hover:shadow-elegant transition-all duration-300">
                <CardHeader>
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                      <Building className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <CardTitle>Halo Legal Suite</CardTitle>
                      <CardDescription>Case management and practice automation</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-primary">{usageData.halo.cases}</div>
                      <div className="text-xs text-muted-foreground">Active Cases</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-primary">{usageData.halo.documents}</div>
                      <div className="text-xs text-muted-foreground">Documents</div>
                    </div>
                  </div>
                  <Button asChild className="w-full bg-primary-gradient hover:shadow-glow transition-all duration-300">
                    <Link to="/halo">
                      Launch Halo
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>Your latest interactions with Nora and Halo</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentActivity.map((activity, index) => (
                    <div key={index} className="flex items-center space-x-4 p-3 rounded-lg bg-accent/50">
                      <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                        {activity.type === "query" && <Bot className="h-4 w-4 text-primary" />}
                        {activity.type === "document" && <FileText className="h-4 w-4 text-primary" />}
                        {activity.type === "case" && <Building className="h-4 w-4 text-primary" />}
                        {activity.type === "meeting" && <Calendar className="h-4 w-4 text-primary" />}
                      </div>
                      <div className="flex-1">
                        <h4 className="text-sm font-medium text-foreground">{activity.title}</h4>
                        <p className="text-xs text-muted-foreground">{activity.time}</p>
                      </div>
                      <Badge variant={activity.status === "completed" ? "default" : "secondary"}>
                        {activity.status === "completed" ? <CheckCircle className="h-3 w-3 mr-1" /> : <Clock className="h-3 w-3 mr-1" />}
                        {activity.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="nora" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Bot className="h-5 w-5 text-primary" />
                  <span>Nora AI Assistant</span>
                </CardTitle>
                <CardDescription>
                  Your intelligent legal research companion powered by Canadian case law
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center p-4 bg-accent/50 rounded-lg">
                    <div className="text-2xl font-bold text-primary mb-1">{usageData.nora.used}</div>
                    <div className="text-sm text-muted-foreground">Queries This Month</div>
                  </div>
                  <div className="text-center p-4 bg-accent/50 rounded-lg">
                    <div className="text-2xl font-bold text-primary mb-1">24</div>
                    <div className="text-sm text-muted-foreground">Documents Analyzed</div>
                  </div>
                  <div className="text-center p-4 bg-accent/50 rounded-lg">
                    <div className="text-2xl font-bold text-primary mb-1">4.8s</div>
                    <div className="text-sm text-muted-foreground">Avg Response Time</div>
                  </div>
                </div>
                
                <Button size="lg" asChild className="w-full bg-primary-gradient hover:shadow-glow transition-all duration-300">
                  <Link to="/nora">
                    <Bot className="mr-2 h-5 w-5" />
                    Launch Nora AI Assistant
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="halo" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Building className="h-5 w-5 text-primary" />
                  <span>Halo Legal Suite</span>
                </CardTitle>
                <CardDescription>
                  Complete practice management powered by Nora's intelligence
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center p-4 bg-accent/50 rounded-lg">
                    <div className="text-2xl font-bold text-primary mb-1">{usageData.halo.cases}</div>
                    <div className="text-sm text-muted-foreground">Active Cases</div>
                  </div>
                  <div className="text-center p-4 bg-accent/50 rounded-lg">
                    <div className="text-2xl font-bold text-primary mb-1">35</div>
                    <div className="text-sm text-muted-foreground">Clients</div>
                  </div>
                  <div className="text-center p-4 bg-accent/50 rounded-lg">
                    <div className="text-2xl font-bold text-primary mb-1">{usageData.halo.documents}</div>
                    <div className="text-sm text-muted-foreground">Documents</div>
                  </div>
                  <div className="text-center p-4 bg-accent/50 rounded-lg">
                    <div className="text-2xl font-bold text-primary mb-1">$32K</div>
                    <div className="text-sm text-muted-foreground">This Month</div>
                  </div>
                </div>
                
                <Badge variant="secondary" className="w-full justify-center py-3 text-base">
                  <Clock className="mr-2 h-4 w-4" />
                  Launching August 2025
                </Badge>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="subscription" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Subscription Management</CardTitle>
                <CardDescription>Manage your XenoraAI subscription and billing</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {subscriptionPlans.map((plan, index) => (
                    <Card key={index} className={`relative ${plan.current ? 'border-primary bg-primary/5' : 'border-border'}`}>
                      {plan.current && (
                        <Badge className="absolute -top-2 left-1/2 transform -translate-x-1/2 bg-primary">
                          Current Plan
                        </Badge>
                      )}
                      <CardHeader className="text-center">
                        <CardTitle className="text-xl">{plan.name}</CardTitle>
                        <div className="text-2xl font-bold text-primary">{plan.price}</div>
                      </CardHeader>
                      <CardContent>
                        <ul className="space-y-2 mb-6">
                          {plan.features.map((feature, featureIndex) => (
                            <li key={featureIndex} className="flex items-center space-x-2 text-sm">
                              <CheckCircle className="h-4 w-4 text-primary flex-shrink-0" />
                              <span>{feature}</span>
                            </li>
                          ))}
                        </ul>
                        <Button 
                          variant={plan.current ? "outline" : "default"} 
                          className="w-full"
                          disabled={plan.current}
                        >
                          {plan.current ? "Current Plan" : "Upgrade"}
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Dashboard;