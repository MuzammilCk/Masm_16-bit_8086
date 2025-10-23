"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, Code } from "lucide-react";

export default function HomePage() {
  const router = useRouter();
  const [isChecking, setIsChecking] = useState(true);
  const [isSignedIn, setIsSignedIn] = useState(false);

  // Check if student is already logged in
  useEffect(() => {
    const savedToken = localStorage.getItem("studentToken");
    const savedUsername = localStorage.getItem("studentUsername");
    
    if (savedToken && savedUsername) {
      // Student already signed in
      setIsSignedIn(true);
      setIsChecking(false);
    } else {
      setIsChecking(false);
    }
  }, [router]);

  const handleGoToEditor = () => {
    router.push("/editor");
  };

  // Show loading or blank screen while checking auth
  if (isChecking) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-background to-secondary flex items-center justify-center">
        <div className="animate-pulse text-muted-foreground">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary flex items-center justify-center p-4">
      {/* Hero Section */}
      <div className="container mx-auto px-4">
        <div className="text-center space-y-6 md:space-y-8 max-w-4xl mx-auto">
          {/* Headline */}
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight">
            The Modern IDE for
            <br />
            <span className="text-primary">Assembly Language</span>
          </h1>
          
          {/* Subheadline */}
          <p className="text-base md:text-lg lg:text-xl text-muted-foreground max-w-2xl mx-auto px-4">
            Zero setup. Visual debugging. AI-powered. Built for education.
            Learn 8086 assembly with the IDE that makes it actually enjoyable.
          </p>
          
          {/* CTA Buttons */}
          <div className="flex items-center justify-center gap-4">
            {isSignedIn ? (
              <Button size="lg" className="button-hover w-full md:w-auto" onClick={handleGoToEditor}>
                <Code className="mr-2 h-5 w-5" />
                Go to Editor
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            ) : (
              <Link href="/login" className="w-full md:w-auto">
                <Button size="lg" className="button-hover w-full">
                  Start Coding
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            )}
          </div>
          
          {isSignedIn && (
            <p className="text-sm text-muted-foreground">
              Welcome back! Click above to continue coding.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
