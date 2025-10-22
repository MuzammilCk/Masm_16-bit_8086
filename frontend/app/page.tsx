import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary flex items-center justify-center">
      {/* Hero Section */}
      <div className="container mx-auto px-4">
        <div className="text-center space-y-8 max-w-4xl mx-auto">
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
          
          {/* CTA Button */}
          <div className="flex items-center justify-center">
            <Link href="/editor">
              <Button size="lg" className="button-hover">
                Start Coding
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
