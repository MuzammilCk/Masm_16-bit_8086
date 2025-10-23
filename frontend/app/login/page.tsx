"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Code, AlertCircle, Loader2 } from "lucide-react";
import { apiUrl } from "@/lib/api-config";

export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [apiKey, setApiKey] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState("Signing In...");
  const [error, setError] = useState("");
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  // Check if student is already logged in
  useEffect(() => {
    const savedToken = localStorage.getItem("studentToken");
    const savedUsername = localStorage.getItem("studentUsername");
    
    if (savedToken && savedUsername) {
      // Auto redirect to editor if already logged in
      setLoadingMessage("Already signed in. Redirecting...");
      router.push("/editor");
    } else {
      setIsCheckingAuth(false);
    }
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!username.trim() || !password.trim()) {
      setError("Please enter username and password");
      return;
    }

    if (!apiKey.trim()) {
      setError("Please enter your Gemini API key");
      return;
    }

    setLoading(true);
    setLoadingMessage("Validating API key...");

    try {
      // Try login first
      let response = await fetch(apiUrl("/api/auth/login"), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: username.trim(),
          password: password.trim(),
          geminiApiKey: apiKey.trim(),
        }),
      });

      // If login fails (user doesn't exist), auto-register them
      if (!response.ok) {
        response = await fetch(apiUrl("/api/auth/register"), {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            username: username.trim(),
            password: password.trim(),
            geminiApiKey: apiKey.trim(),
          }),
        });
      }

      const data = await response.json();

      if (!response.ok) {
        // Show detailed error message with additional context if available
        const errorMessage = data.error || "Authentication failed";
        const errorDetails = data.details ? `\n\n${data.details}` : "";
        throw new Error(errorMessage + errorDetails);
      }

      // Store student info in localStorage (remember them)
      localStorage.setItem("studentUsername", username);
      localStorage.setItem("studentToken", data.token);
      localStorage.setItem("geminiApiKey", apiKey.trim());

      // Redirect to editor
      router.push("/editor");
    } catch (err: any) {
      console.error('Login error:', err);
      setError(err.message || "Failed to authenticate");
    } finally {
      setLoading(false);
    }
  };

  // Show loading screen while checking if already signed in
  if (isCheckingAuth) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-900 via-slate-900 to-slate-800 flex items-center justify-center p-4">
        <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl shadow-2xl p-8 w-full max-w-md border border-slate-700 text-center">
          <div className="flex items-center justify-center mb-4">
            <Code className="h-12 w-12 text-blue-500 animate-pulse" />
          </div>
          <p className="text-white text-lg">Checking authentication...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-slate-900 to-slate-800 flex items-center justify-center p-4">
      <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl shadow-2xl p-8 w-full max-w-md border border-slate-700">
        {/* Header */}
        <div className="flex items-center justify-center mb-6">
          <Code className="h-12 w-12 text-blue-500" />
        </div>
        <h1 className="text-3xl font-bold text-center mb-2 text-white">
          MASM Studio
        </h1>
        <p className="text-center text-slate-400 mb-8">
          Enter your credentials to start coding
        </p>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Username
            </label>
            <Input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter your username"
              className="w-full bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-500"
              disabled={loading}
              autoFocus
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Password
            </label>
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              className="w-full bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-500"
              disabled={loading}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Gemini API Key
            </label>
            <Input
              type="password"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="Paste your Gemini API key"
              className="w-full bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-500"
              disabled={loading}
            />
            <p className="text-xs text-slate-400 mt-1">
              Get your free API key from{" "}
              <a
                href="https://aistudio.google.com/app/apikey"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-400 hover:underline"
              >
                Google AI Studio
              </a>
            </p>
          </div>

          {error && (
            <div className="bg-red-500/10 border border-red-500/50 rounded-md p-3 flex items-start gap-2">
              <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-red-400 whitespace-pre-line">
                {error}
                {error.toLowerCase().includes('api key') && (
                  <div className="mt-2">
                    <a
                      href="https://aistudio.google.com/app/apikey"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-400 hover:underline inline-flex items-center gap-1"
                    >
                      Get a new API key →
                    </a>
                  </div>
                )}
              </div>
            </div>
          )}

          <Button
            type="submit"
            className="w-full"
            disabled={loading || !username.trim() || !password.trim() || !apiKey.trim()}
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                {loadingMessage}
              </>
            ) : (
              <>Sign In</>
            )}
          </Button>
        </form>
      </div>
    </div>
  );
}
