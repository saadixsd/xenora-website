import React, { useState, useCallback } from 'react';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, Send, Scale, BookOpen, RefreshCw, User, GraduationCap, Briefcase, Gavel } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

interface DemoResponse {
  response: string;
  timestamp: string;
}

const NoraDemo = () => {
  const [query, setQuery] = useState('');
  const [response, setResponse] = useState<DemoResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [userRole, setUserRole] = useState<string>('individual');
  const { toast } = useToast();

  const userRoles = [
    { value: 'individual', label: 'Individual', icon: User, description: 'Personal legal questions' },
    { value: 'student', label: 'Student', icon: GraduationCap, description: 'Legal education and learning' },
    { value: 'professional', label: 'Professional', icon: Briefcase, description: 'Business and professional use' },
    { value: 'lawyer', label: 'Lawyer', icon: Gavel, description: 'Legal practice and research' }
  ];

  const allExampleQueries = [
    "What are the elements of negligence under Canadian tort law?",
    "Explain the Charter right to freedom of expression in section 2(b)",
    "What is the difference between federal and provincial jurisdiction in Canada?",
    "How does Quebec's Civil Code differ from common law provinces?",
    "What is the reasonable person standard in Canadian negligence law?",
    "Explain the notwithstanding clause in the Canadian Charter",
    "What are the requirements for a valid contract in Ontario?",
    "How does criminal liability differ from civil liability in Canada?",
    "What is the role of the Supreme Court of Canada?",
    "Explain the division of powers between federal and provincial governments",
    "What constitutes assault under Canadian criminal law?",
    "How do employment standards vary across Canadian provinces?",
  ];

  const [currentExamples, setCurrentExamples] = useState(() => 
    allExampleQueries.slice(0, 4)
  );

  const refreshExamples = useCallback(() => {
    const shuffled = [...allExampleQueries].sort(() => 0.5 - Math.random());
    setCurrentExamples(shuffled.slice(0, 4));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('canadian-law-ai', {
        body: { query, userRole }
      });

      if (error) throw error;

      setResponse(data);
      toast({
        title: "Query processed",
        description: "Nora has analyzed your legal question.",
      });
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: "API Quota Exceeded",
        description: "OpenAI API quota has been exceeded. Please check your billing settings.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleExampleClick = (example: string) => {
    setQuery(example);
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-4">
      <Card className="bg-card-gradient border-primary/20 shadow-elegant">
        <CardHeader className="text-center pb-4">
          <div className="flex items-center justify-center space-x-2 mb-2">
            <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
              <Scale className="h-5 w-5 text-primary" />
            </div>
            <CardTitle className="text-xl font-bold">Try Nora</CardTitle>
          </div>
          <CardDescription className="text-sm text-muted-foreground">
            Experience Canada's most advanced legal assistant
          </CardDescription>
          <div className="flex items-center justify-center gap-2 mt-2">
            <Badge variant="outline" className="text-xs">
              <BookOpen className="h-3 w-3 mr-1" />
              Live Demo
            </Badge>
            <Badge variant="secondary" className="text-xs bg-primary/10 text-primary border-primary/30">
              Beta Version
            </Badge>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Example queries */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-muted-foreground">Try these example queries:</p>
              <Button
                variant="ghost"
                size="sm"
                onClick={refreshExamples}
                className="h-8 w-8 p-0 hover:bg-primary/10"
                title="Refresh examples"
              >
                <RefreshCw className="h-4 w-4" />
              </Button>
            </div>
            <div className="grid grid-cols-1 gap-2">
              {currentExamples.map((example, index) => (
                <Button
                  key={`${example}-${index}`}
                  variant="outline"
                  size="sm"
                  className="text-left h-auto p-3 justify-start hover:bg-primary/5 hover:border-primary/30 text-xs sm:text-sm whitespace-normal leading-relaxed"
                  onClick={() => handleExampleClick(example)}
                >
                  <span className="truncate block w-full text-left">"{example}"</span>
                </Button>
              ))}
            </div>
          </div>

          {/* Query form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Textarea
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Type Your Message"
                className="min-h-[120px] resize-none border-primary/20 focus:border-primary/40 text-sm leading-relaxed"
                disabled={loading}
              />
            </div>
            
            {/* Role Selection */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground">I am asking as a:</label>
              <Select value={userRole} onValueChange={setUserRole}>
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {userRoles.map((role) => {
                    const IconComponent = role.icon;
                    return (
                      <SelectItem key={role.value} value={role.value}>
                        <div className="flex items-center space-x-2">
                          <IconComponent className="h-4 w-4" />
                          <div className="flex flex-col">
                            <span>{role.label}</span>
                            <span className="text-xs text-muted-foreground">{role.description}</span>
                          </div>
                        </div>
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
            </div>

            <div className="flex gap-2">
              <Button 
                type="submit" 
                disabled={!query.trim() || loading}
                className="flex-1 bg-primary-gradient hover:shadow-glow transition-all duration-300"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4 mr-2" />
                    Ask Nora
                  </>
                )}
              </Button>
            </div>
          </form>

          {/* Response */}
          {response && (
            <Card className="bg-primary/5 border-primary/20">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base flex items-center">
                    <Scale className="h-4 w-4 mr-2 text-primary" />
                    Nora's Response
                  </CardTitle>
                  <Badge variant="outline" className="text-xs">
                    {new Date(response.timestamp).toLocaleTimeString()}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="prose prose-sm max-w-none">
                  <div className="whitespace-pre-wrap text-foreground leading-relaxed text-sm">
                    {response.response}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Disclaimer */}
          <div className="bg-accent/10 rounded-lg p-3 border border-accent/20">
            <p className="text-xs text-muted-foreground text-center leading-relaxed">
              <strong>Disclaimer:</strong> This demo provides general legal information for educational purposes only. 
              It does not constitute legal advice. For specific legal matters, please consult with a qualified Canadian lawyer.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default NoraDemo;