import { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { 
  Upload,
  FileText,
  AlertCircle,
  CheckCircle,
  Clock,
  Shield,
  ArrowRight,
  Download,
  Eye,
  Lightbulb,
  Scale,
  ExternalLink
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const DocumentExplainer = () => {
  const [file, setFile] = useState<File | null>(null);
  const [analysis, setAnalysis] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [textInput, setTextInput] = useState("");
  const { toast } = useToast();

  const handleFileUpload = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const uploadedFile = event.target.files?.[0];
    if (uploadedFile) {
      if (uploadedFile.size > 10 * 1024 * 1024) { // 10MB limit
        toast({
          title: "File too large",
          description: "Please upload a file smaller than 10MB",
          variant: "destructive"
        });
        return;
      }
      setFile(uploadedFile);
      setAnalysis(null);
    }
  }, [toast]);

  const handleAnalyze = async () => {
    if (!file && !textInput.trim()) {
      toast({
        title: "No content to analyze",
        description: "Please upload a file or paste text to analyze",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    
    // Simulate analysis process
    setTimeout(() => {
      const mockAnalysis = {
        documentType: "Residential Lease Agreement",
        complexity: "Medium",
        riskLevel: "Low",
        keyPoints: [
          {
            title: "Rent and Payment Terms",
            content: "Monthly rent of $2,400 due on the 1st of each month. Late fees of $50 apply after 5 days.",
            importance: "high",
            explanation: "Standard rental terms. The late fee amount is reasonable and within typical ranges."
          },
          {
            title: "Security Deposit",
            content: "One month's rent ($2,400) required as security deposit.",
            importance: "high",
            explanation: "In Ontario, landlords can only charge first and last month's rent upfront. No additional security deposits are allowed."
          },
          {
            title: "Tenant Responsibilities",
            content: "Tenant must maintain the property and report damages within 24 hours.",
            importance: "medium",
            explanation: "Standard maintenance clause. The 24-hour reporting requirement is reasonable."
          },
          {
            title: "Early Termination",
            content: "60 days notice required for early termination. Tenant may be responsible for re-rental costs.",
            importance: "high",
            explanation: "In Ontario, standard notice is 60 days for most situations. However, you cannot be charged re-rental costs in most cases."
          }
        ],
        warnings: [
          {
            title: "Potential Issue: Security Deposit",
            description: "This lease requests a security deposit which may not be legal in Ontario",
            severity: "high"
          }
        ],
        recommendations: [
          "Verify the security deposit requirement with Ontario tenant rights",
          "Consider asking for clarification on the early termination costs",
          "Keep records of the property's condition before moving in"
        ],
        governmentResources: [
          {
            title: "Ontario Landlord and Tenant Board",
            url: "https://tribunalsontario.ca/ltb/",
            description: "Official resource for tenant rights and dispute resolution"
          },
          {
            title: "Tenant Rights in Ontario",
            url: "https://www.ontario.ca/page/renting-ontario-your-rights",
            description: "Government guide to tenant rights and responsibilities"
          }
        ]
      };
      
      setAnalysis(mockAnalysis);
      setLoading(false);
      
      toast({
        title: "Analysis complete!",
        description: "Your document has been analyzed successfully",
      });
    }, 3000);
  };

  const exampleDocuments = [
    {
      title: "Rental/Lease Agreement",
      description: "Understand your rights and obligations as a tenant",
      icon: "🏠"
    },
    {
      title: "Employment Contract",
      description: "Review job terms, benefits, and termination clauses",
      icon: "💼"
    },
    {
      title: "Terms of Service",
      description: "Know what you're agreeing to with apps and services",
      icon: "📱"
    },
    {
      title: "Purchase Agreement",
      description: "Car, home, or major purchase contracts explained",
      icon: "🚗"
    },
    {
      title: "Insurance Policy",
      description: "Understand your coverage and claim procedures",
      icon: "🛡️"
    },
    {
      title: "Loan Agreement",
      description: "Review interest rates, payment terms, and penalties",
      icon: "💰"
    }
  ];

  return (
    <div className="min-h-screen pt-20">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-hero-gradient section-padding">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-8">
            <Badge variant="outline" className="w-fit border-primary/20 text-primary hover-scale">
              <FileText className="h-4 w-4 mr-2" />
              <span className="text-lg font-medium">Document AI Explainer</span>
            </Badge>
            
            <div className="space-y-4">
              <h1 className="text-5xl lg:text-6xl font-bold text-foreground leading-tight">
                Never Sign Without
                <br />
                <span className="bg-primary-gradient bg-clip-text text-transparent">
                  Understanding Again
                </span>
              </h1>
              <p className="text-2xl text-muted-foreground max-w-4xl mx-auto">
                Upload any legal document and get a plain-English explanation of what you're actually agreeing to
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Upload Section */}
      <section className="section-padding bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Upload Area */}
            <div className="space-y-6">
              <div>
                <h2 className="text-3xl font-bold text-foreground mb-4">Upload Your Document</h2>
                <p className="text-muted-foreground">
                  Supports PDF, Word documents, images, and text. Maximum 10MB file size.
                </p>
              </div>

              {/* File Upload */}
              <Card className="border-2 border-dashed border-muted hover:border-primary/50 transition-colors">
                <CardContent className="p-8">
                  <div className="text-center space-y-4">
                    <div className="w-16 h-16 bg-primary/10 rounded-xl flex items-center justify-center mx-auto">
                      <Upload className="h-8 w-8 text-primary" />
                    </div>
                    <div>
                      <p className="text-lg font-medium text-foreground">Drop your file here or click to browse</p>
                      <p className="text-sm text-muted-foreground">PDF, DOC, DOCX, JPG, PNG up to 10MB</p>
                    </div>
                    <input
                      type="file"
                      onChange={handleFileUpload}
                      accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.txt"
                      className="hidden"
                      id="file-upload"
                    />
                    <Button asChild variant="outline" className="cursor-pointer">
                      <label htmlFor="file-upload">Choose File</label>
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {file && (
                <Card className="bg-accent/5">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <FileText className="h-8 w-8 text-primary" />
                      <div className="flex-1">
                        <p className="font-medium text-foreground">{file.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {(file.size / 1024 / 1024).toFixed(2)} MB
                        </p>
                      </div>
                      <Button
                        onClick={() => setFile(null)}
                        variant="ghost"
                        size="sm"
                      >
                        Remove
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Text Input Alternative */}
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <div className="h-px bg-border flex-1" />
                  <span className="text-sm text-muted-foreground bg-background px-2">Or paste text</span>
                  <div className="h-px bg-border flex-1" />
                </div>
                
                <Textarea
                  placeholder="Paste your document text here..."
                  value={textInput}
                  onChange={(e) => setTextInput(e.target.value)}
                  className="min-h-32"
                />
              </div>

              <Button
                onClick={handleAnalyze}
                disabled={(!file && !textInput.trim()) || loading}
                className="w-full bg-primary-gradient hover:shadow-glow transition-all duration-300 text-white font-semibold border-0"
                size="lg"
              >
                {loading ? (
                  <>
                    <Clock className="h-4 w-4 mr-2 animate-spin" />
                    Analyzing Document...
                  </>
                ) : (
                  <>
                    <FileText className="h-4 w-4 mr-2" />
                    Analyze Document
                  </>
                )}
              </Button>
            </div>

            {/* Example Documents */}
            <div className="space-y-6">
              <div>
                <h3 className="text-2xl font-bold text-foreground mb-4">What We Can Explain</h3>
                <p className="text-muted-foreground mb-6">
                  Our AI understands these common document types and more:
                </p>
              </div>

              <div className="grid grid-cols-1 gap-4">
                {exampleDocuments.map((doc, index) => (
                  <Card key={index} className="hover:shadow-md transition-shadow cursor-pointer">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{doc.icon}</span>
                        <div>
                          <h4 className="font-semibold text-foreground">{doc.title}</h4>
                          <p className="text-sm text-muted-foreground">{doc.description}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <div className="p-4 bg-primary/5 rounded-lg border border-primary/20">
                <div className="flex items-start gap-3">
                  <Shield className="h-5 w-5 text-primary mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-foreground text-sm">Privacy Guaranteed</h4>
                    <p className="text-xs text-muted-foreground">
                      Your documents are processed securely and never stored. Analysis happens in real-time and data is immediately discarded.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Loading State */}
      {loading && (
        <section className="section-padding bg-accent/5">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <Card>
              <CardContent className="p-8">
                <div className="text-center space-y-6">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                    <Clock className="h-8 w-8 text-primary animate-spin" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-foreground mb-2">Analyzing Your Document</h3>
                    <p className="text-muted-foreground">Our AI is reading through your document and identifying key legal terms...</p>
                  </div>
                  <Progress value={66} className="w-full max-w-md mx-auto" />
                  <p className="text-sm text-muted-foreground">This usually takes 30-60 seconds</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>
      )}

      {/* Analysis Results */}
      {analysis && !loading && (
        <section className="section-padding bg-accent/5">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
            {/* Overview */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-2xl flex items-center gap-2">
                      <CheckCircle className="h-6 w-6 text-green-600" />
                      Analysis Complete
                    </CardTitle>
                    <p className="text-muted-foreground mt-2">
                      Document Type: <span className="font-medium">{analysis.documentType}</span>
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Badge variant={analysis.riskLevel === 'Low' ? 'secondary' : 'destructive'}>
                      {analysis.riskLevel} Risk
                    </Badge>
                    <Badge variant="outline">{analysis.complexity} Complexity</Badge>
                  </div>
                </div>
              </CardHeader>
            </Card>

            {/* Warnings */}
            {analysis.warnings.length > 0 && (
              <Card className="border-orange-200 bg-orange-50">
                <CardHeader>
                  <CardTitle className="text-xl flex items-center gap-2 text-orange-800">
                    <AlertCircle className="h-5 w-5" />
                    Important Warnings
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {analysis.warnings.map((warning: any, index: number) => (
                    <div key={index} className="p-4 bg-orange-100 rounded-lg">
                      <h4 className="font-semibold text-orange-800 mb-2">{warning.title}</h4>
                      <p className="text-orange-700">{warning.description}</p>
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}

            {/* Key Points */}
            <Card>
              <CardHeader>
                <CardTitle className="text-xl flex items-center gap-2">
                  <Eye className="h-5 w-5 text-primary" />
                  Key Points Explained
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {analysis.keyPoints.map((point: any, index: number) => (
                  <div key={index} className="border-l-4 border-primary/20 pl-4 space-y-2">
                    <div className="flex items-center gap-2">
                      <h4 className="font-semibold text-foreground">{point.title}</h4>
                      <Badge 
                        variant={point.importance === 'high' ? 'destructive' : point.importance === 'medium' ? 'default' : 'secondary'}
                        className="text-xs"
                      >
                        {point.importance} priority
                      </Badge>
                    </div>
                    <p className="text-muted-foreground">{point.content}</p>
                    <div className="p-3 bg-primary/5 rounded-lg">
                      <p className="text-sm text-foreground">
                        <Lightbulb className="h-4 w-4 inline mr-1" />
                        <strong>What this means:</strong> {point.explanation}
                      </p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Recommendations */}
            <Card>
              <CardHeader>
                <CardTitle className="text-xl flex items-center gap-2">
                  <Lightbulb className="h-5 w-5 text-primary" />
                  Our Recommendations
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {analysis.recommendations.map((rec: string, index: number) => (
                    <div key={index} className="flex items-start gap-3">
                      <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                      <p className="text-foreground">{rec}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Government Resources */}
            <Card>
              <CardHeader>
                <CardTitle className="text-xl flex items-center gap-2">
                  <Scale className="h-5 w-5 text-primary" />
                  Official Resources
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {analysis.governmentResources.map((resource: any, index: number) => (
                    <div key={index} className="p-4 border border-border rounded-lg hover:shadow-sm transition-shadow">
                      <div className="flex items-start justify-between">
                        <div>
                          <h4 className="font-semibold text-foreground mb-1">{resource.title}</h4>
                          <p className="text-sm text-muted-foreground mb-2">{resource.description}</p>
                          <Button variant="link" className="p-0 h-auto text-primary" asChild>
                            <a href={resource.url} target="_blank" rel="noopener noreferrer">
                              Visit Official Site
                              <ExternalLink className="h-3 w-3 ml-1" />
                            </a>
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" variant="outline">
                <Download className="h-4 w-4 mr-2" />
                Download Analysis Report
              </Button>
              <Button size="lg" className="bg-primary-gradient hover:shadow-glow transition-all duration-300 text-white font-semibold border-0">
                Need Legal Advice? Contact a Professional
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </div>
          </div>
        </section>
      )}

      {/* How It Works */}
      {!analysis && !loading && (
        <section className="section-padding bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-foreground mb-4">
                How Document Explainer Works
              </h2>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                Our AI reads your document like a lawyer would, identifying key terms and potential issues
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center space-y-4">
                <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center mx-auto">
                  <Upload className="h-8 w-8" />
                </div>
                <h3 className="text-xl font-semibold text-foreground">1. Upload & Scan</h3>
                <p className="text-muted-foreground">
                  Upload your document or paste text. Our AI extracts and analyzes every clause and term.
                </p>
              </div>

              <div className="text-center space-y-4">
                <div className="w-16 h-16 bg-green-100 text-green-600 rounded-xl flex items-center justify-center mx-auto">
                  <FileText className="h-8 w-8" />
                </div>
                <h3 className="text-xl font-semibold text-foreground">2. Analyze & Explain</h3>
                <p className="text-muted-foreground">
                  We identify key points, potential risks, and translate legal jargon into plain English.
                </p>
              </div>

              <div className="text-center space-y-4">
                <div className="w-16 h-16 bg-purple-100 text-purple-600 rounded-xl flex items-center justify-center mx-auto">
                  <CheckCircle className="h-8 w-8" />
                </div>
                <h3 className="text-xl font-semibold text-foreground">3. Get Insights</h3>
                <p className="text-muted-foreground">
                  Receive a comprehensive report with recommendations and links to official resources.
                </p>
              </div>
            </div>
          </div>
        </section>
      )}
    </div>
  );
};

export default DocumentExplainer;