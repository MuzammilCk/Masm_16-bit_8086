import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, Code2, Sparkles, Zap } from "lucide-react";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-20">
        <div className="text-center space-y-8 max-w-4xl mx-auto">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 border border-primary/20 rounded-full text-sm">
            <Sparkles className="h-4 w-4 text-primary" />
            <span>Powered by Gemini 2.5 Flash AI</span>
          </div>
          
          {/* Headline */}
          <h1 className="text-6xl font-bold tracking-tight">
            The Modern IDE for
            <br />
            <span className="text-primary">Assembly Language</span>
          </h1>
          
          {/* Subheadline */}
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Zero setup. Visual debugging. AI-powered. Built for education.
            Learn 8086 assembly with the IDE that makes it actually enjoyable.
          </p>
          
          {/* CTA Buttons */}
          <div className="flex items-center justify-center gap-4">
            <Link href="/editor">
              <Button size="lg" className="button-hover">
                Start Coding
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            
            <Link href="/examples">
              <Button size="lg" variant="outline" className="button-hover">
                View Examples
              </Button>
            </Link>
          </div>
          
          {/* Stats */}
          <div className="grid grid-cols-3 gap-8 pt-12 max-w-2xl mx-auto">
            <div className="space-y-2">
              <div className="text-3xl font-bold text-primary">10,000+</div>
              <div className="text-sm text-muted-foreground">Universities</div>
            </div>
            <div className="space-y-2">
              <div className="text-3xl font-bold text-primary">500K+</div>
              <div className="text-sm text-muted-foreground">Students/Year</div>
            </div>
            <div className="space-y-2">
              <div className="text-3xl font-bold text-primary">Zero</div>
              <div className="text-sm text-muted-foreground">Setup Time</div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Features Section */}
      <div className="container mx-auto px-4 py-20">
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {/* Feature 1 */}
          <div className="p-6 bg-card border border-border rounded-lg hover:border-primary smooth-transition">
            <div className="h-12 w-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
              <Zap className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Zero Setup</h3>
            <p className="text-muted-foreground">
              No DOSBox, no MASM installation, no configuration. Just open your browser and start coding.
            </p>
          </div>
          
          {/* Feature 2 */}
          <div className="p-6 bg-card border border-border rounded-lg hover:border-primary smooth-transition">
            <div className="h-12 w-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
              <Code2 className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Visual Debugging</h3>
            <p className="text-muted-foreground">
              See registers and memory change in real-time. Time-travel through execution. Understand what's happening.
            </p>
          </div>
          
          {/* Feature 3 */}
          <div className="p-6 bg-card border border-border rounded-lg hover:border-primary smooth-transition">
            <div className="h-12 w-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
              <Sparkles className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-2">AI Assistant</h3>
            <p className="text-muted-foreground">
              Ask questions, get explanations, fix errors with one click. Your personal assembly language tutor.
            </p>
          </div>
        </div>
      </div>
      
      {/* Footer */}
      <footer className="border-t border-border py-8">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>Built with ❤️ for assembly language students worldwide</p>
        </div>
      </footer>
    </div>
  );
}
