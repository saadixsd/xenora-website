import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2, Send, Scale, BookOpen } from "lucide-react";
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
  const { toast } = useToast();

  const exampleQueries = [
    "What are the elements of negligence under Canadian tort law?",
    "Explain the Charter right to freedom of expression in section 2(b)",
    "What is the difference between federal and provincial jurisdiction in Canada?",
    "How does Quebec's Civil Code differ from common law provinces?"
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('canadian-law-ai', {
        body: { query }
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
        title: "Error",
        description: "Failed to process your query. Please try again.",
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
    <div className="w-full max-w-4xl mx-auto space-y-6">
      <Card className="bg-card-gradient border-primary/20 shadow-elegant">
        <CardHeader className="text-center">
          <div className="flex items-center justify-center space-x-2 mb-2">
            <Scale className="h-6 w-6 text-primary" />
            <CardTitle className="text-2xl font-bold">Try Nora AI</CardTitle>
          </div>
          <CardDescription className="text-base">
            Experience Canada's most advanced legal AI assistant. Ask any question about Canadian federal or provincial law.
          </CardDescription>
          <Badge variant="outline" className="w-fit mx-auto mt-2">
            <BookOpen className="h-3 w-3 mr-1" />
            Live Demo
          </Badge>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Example queries */}
          <div>
            <p className="text-sm font-medium text-muted-foreground mb-3">Try these example queries:</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {exampleQueries.map((example, index) => (
                <Button
                  key={index}
                  variant="outline"
                  size="sm"
                  className="text-left h-auto p-3 justify-start hover:bg-primary/5 hover:border-primary/30"
                  onClick={() => handleExampleClick(example)}
                >
                  "{example}"
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
                placeholder="Ask Nora about Canadian law... (e.g., 'What are the requirements for a valid contract in Ontario?')"
                className="min-h-[100px] resize-none border-primary/20 focus:border-primary/40"
                disabled={loading}
              />
            </div>
            <Button 
              type="submit" 
              disabled={!query.trim() || loading}
              className="w-full bg-primary-gradient hover:shadow-glow transition-all duration-300"
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
          </form>

          {/* Response */}
          {response && (
            <Card className="bg-primary/5 border-primary/20">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg flex items-center">
                    <Scale className="h-5 w-5 mr-2 text-primary" />
                    Nora's Response
                  </CardTitle>
                  <Badge variant="outline" className="text-xs">
                    {new Date(response.timestamp).toLocaleTimeString()}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="prose prose-sm max-w-none">
                  <div className="whitespace-pre-wrap text-foreground leading-relaxed">
                    {response.response}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Disclaimer */}
          <div className="bg-accent/20 rounded-lg p-4 border border-accent/30">
            <p className="text-xs text-muted-foreground text-center">
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