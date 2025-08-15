import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from "@/components/ui/dialog";
import { Link, useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { 
  Bot, 
  Building, 
  Crown, 
  Settings, 
  LogOut, 
  FileText,
  BarChart3,
  ArrowRight,
  Activity,
  Zap,
  User,
  Mail,
  Moon,
  Sun,
  CheckCircle,
  CreditCard
} from "lucide-react";

const Dashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // State management
  const [activeSubscription] = useState("Premium");
  const [userName, setUserName] = useState("John");
  const [userEmail, setUserEmail] = useState("john@example.com");
  const [isDarkMode, setIsDarkMode] = useState(
    localStorage.getItem('darkMode') === 'true'
  );
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [subscriptionOpen, setSubscriptionOpen] = useState(false);
  
  // Subscription plans data
  const subscriptionPlans = [
    {
      name: "Basic",
      price: "$49",
      period: "/month",
      features: ["500 Nora queries", "Basic Halo features", "Email support"],
      current: activeSubscription === "Basic"
    },
    {
      name: "Premium",
      price: "$99",
      period: "/month",
      features: ["1000 Nora queries", "Full Halo suite", "Priority support", "Advanced analytics"],
      current: activeSubscription === "Premium"
    },
    {
      name: "Enterprise",
      price: "$199",
      period: "/month",
      features: ["Unlimited queries", "Team collaboration", "Custom integrations", "Dedicated support"],
      current: activeSubscription === "Enterprise"
    }
  ];
  
  const recentActivity = [
    { type: "query", title: "Contract Analysis Request", time: "2 minutes ago" },
    { type: "document", title: "Lease Agreement Review", time: "1 hour ago" },
    { type: "case", title: "New Client Case Created", time: "3 hours ago" },
    { type: "meeting", title: "Client Consultation Notes", time: "1 day ago" }
  ];

  // Event handlers
  const handleLogout = () => {
    localStorage.removeItem('userToken');
    toast({
      title: "Logged out successfully",
      description: "You have been logged out of your account.",
    });
    navigate('/login');
  };

  const handleSaveSettings = () => {
    localStorage.setItem('userName', userName);
    localStorage.setItem('userEmail', userEmail);
    localStorage.setItem('darkMode', isDarkMode.toString());
    
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    
    toast({
      title: "Settings saved",
      description: "Your preferences have been updated successfully.",
    });
    setSettingsOpen(false);
  };

  return (
    <div className="min-h-screen pt-20 bg-gradient-to-br from-background via-background to-muted/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-12">
          <div className="space-y-2">
            <h1 className="text-4xl font-bold text-foreground">Welcome back, {userName}</h1>
            <p className="text-lg text-muted-foreground">Your AI-powered legal workspace</p>
          </div>
          <div className="flex items-center space-x-3 mt-6 sm:mt-0">
            <Badge variant="outline" className="bg-primary/5 text-primary border-primary/20 px-3 py-1">
              <Crown className="h-4 w-4 mr-2" />
              {activeSubscription}
            </Badge>
            <Dialog open={settingsOpen} onOpenChange={setSettingsOpen}>
              <DialogTrigger asChild>
                <Button variant="ghost" size="icon" className="h-9 w-9">
                  <Settings className="h-4 w-4" />
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>Settings</DialogTitle>
                  <DialogDescription>
                    Manage your account preferences and settings.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-6 py-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Name</label>
                    <Input
                      value={userName}
                      onChange={(e) => setUserName(e.target.value)}
                      placeholder="Enter your name"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Email</label>
                    <Input
                      type="email"
                      value={userEmail}
                      onChange={(e) => setUserEmail(e.target.value)}
                      placeholder="Enter your email"
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <label className="text-sm font-medium">Dark Mode</label>
                      <p className="text-xs text-muted-foreground">Toggle dark/light theme</p>
                    </div>
                    <Switch
                      checked={isDarkMode}
                      onCheckedChange={setIsDarkMode}
                    />
                  </div>
                </div>
                <div className="flex justify-end space-x-2">
                  <Button variant="outline" onClick={() => setSettingsOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleSaveSettings}>
                    Save Changes
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
            <Button variant="ghost" size="icon" className="h-9 w-9" onClick={handleLogout}>
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Main Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Main Tools */}
          <div className="lg:col-span-2 space-y-6">
            {/* AI Tools */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Nora AI Card */}
              <Card className="group border-border/50 bg-card/50 backdrop-blur-sm hover:shadow-lg hover:border-primary/20 transition-all duration-300">
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-gradient-to-br from-primary/20 to-primary/10 rounded-xl flex items-center justify-center">
                        <Bot className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <CardTitle className="text-xl">Nora AI</CardTitle>
                        <CardDescription className="text-sm">Legal research assistant</CardDescription>
                      </div>
                    </div>
                    <Zap className="h-5 w-5 text-primary/60" />
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Ready to assist</span>
                    <Badge variant="secondary" className="bg-green-500/10 text-green-600 border-green-500/20">
                      Online
                    </Badge>
                  </div>
                  <Button asChild className="w-full bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary group-hover:shadow-md transition-all duration-300">
                    <Link to="/nora">
                      Launch Assistant
                      <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>

              {/* Halo Suite Card */}
              <Card className="group border-border/50 bg-card/50 backdrop-blur-sm hover:shadow-lg hover:border-primary/20 transition-all duration-300">
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-gradient-to-br from-secondary/20 to-secondary/10 rounded-xl flex items-center justify-center">
                        <Building className="h-6 w-6 text-secondary" />
                      </div>
                      <div>
                        <CardTitle className="text-xl">Halo Suite</CardTitle>
                        <CardDescription className="text-sm">Practice management</CardDescription>
                      </div>
                    </div>
                    <BarChart3 className="h-5 w-5 text-secondary/60" />
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Coming soon</span>
                    <Badge variant="outline" className="bg-orange-500/10 text-orange-600 border-orange-500/20">
                      Aug 2025
                    </Badge>
                  </div>
                  <Button variant="outline" className="w-full" disabled>
                    Coming Soon
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Quick Stats */}
            <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Activity className="h-5 w-5 text-primary" />
                  <span>Usage Overview</span>
                </CardTitle>
                <CardDescription>Your activity this month</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                  <div className="text-center space-y-2">
                    <div className="text-3xl font-bold text-primary">24</div>
                    <div className="text-sm text-muted-foreground">Documents Analyzed</div>
                  </div>
                  <div className="text-center space-y-2">
                    <div className="text-3xl font-bold text-primary">485</div>
                    <div className="text-sm text-muted-foreground">Research Queries</div>
                  </div>
                  <div className="text-center space-y-2">
                    <div className="text-3xl font-bold text-primary">4.2s</div>
                    <div className="text-sm text-muted-foreground">Avg Response Time</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Recent Activity */}
          <div className="space-y-6">
            <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-lg">Recent Activity</CardTitle>
                <CardDescription>Your latest interactions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentActivity.map((activity, index) => (
                    <div key={index} className="flex items-start space-x-3 p-3 rounded-lg bg-muted/30 border border-border/30">
                      <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                        {activity.type === "query" && <Bot className="h-4 w-4 text-primary" />}
                        {activity.type === "document" && <FileText className="h-4 w-4 text-primary" />}
                        {activity.type === "case" && <Building className="h-4 w-4 text-primary" />}
                        {activity.type === "meeting" && <Activity className="h-4 w-4 text-primary" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-medium text-foreground leading-tight">{activity.title}</h4>
                        <p className="text-xs text-muted-foreground mt-1">{activity.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Account Info */}
            <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-lg">Account</CardTitle>
                <CardDescription>Subscription & billing</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Current Plan</span>
                  <Badge className="bg-primary/10 text-primary border-primary/20">
                    {activeSubscription}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Next Billing</span>
                  <span className="text-sm font-medium">Jan 15, 2025</span>
                </div>
                <Dialog open={subscriptionOpen} onOpenChange={setSubscriptionOpen}>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="sm" className="w-full">
                      Manage Subscription
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-4xl">
                    <DialogHeader>
                      <DialogTitle>Subscription Management</DialogTitle>
                      <DialogDescription>
                        Choose the plan that best fits your needs or manage your current subscription.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 py-6">
                      {subscriptionPlans.map((plan, index) => (
                        <Card key={index} className={`relative ${plan.current ? 'border-primary bg-primary/5 ring-2 ring-primary/20' : 'border-border'}`}>
                          {plan.current && (
                            <Badge className="absolute -top-2 left-1/2 transform -translate-x-1/2 bg-primary">
                              Current Plan
                            </Badge>
                          )}
                          <CardHeader className="text-center pb-4">
                            <CardTitle className="text-xl">{plan.name}</CardTitle>
                            <div className="flex items-baseline justify-center">
                              <span className="text-3xl font-bold text-primary">{plan.price}</span>
                              <span className="text-muted-foreground ml-1">{plan.period}</span>
                            </div>
                          </CardHeader>
                          <CardContent>
                            <ul className="space-y-3 mb-6">
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
                    <div className="border-t pt-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <CreditCard className="h-5 w-5 text-muted-foreground" />
                          <span className="text-sm text-muted-foreground">Next billing: Jan 15, 2025</span>
                        </div>
                        <div className="flex space-x-2">
                          <Button variant="outline" size="sm">
                            Update Payment Method
                          </Button>
                          <Button variant="outline" size="sm">
                            Cancel Subscription
                          </Button>
                        </div>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;