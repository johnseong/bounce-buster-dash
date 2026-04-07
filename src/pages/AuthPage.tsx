/**
 * AuthPage — Login / Sign-up screen with email+password and Google sign-in.
 */

import { useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { BarChart3, ShieldAlert } from "lucide-react";

export default function AuthPage() {
  const location = useLocation();
  const redirectedFrom = (location.state as { from?: string })?.from;
  const { user, loading, signIn, signUp, signInWithGoogle } = useAuth();
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [signUpSuccess, setSignUpSuccess] = useState(false);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center animate-pulse">
          <BarChart3 className="h-4 w-4 text-primary-foreground" />
        </div>
      </div>
    );
  }

  if (user) return <Navigate to="/" replace />;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    const { error } = isSignUp ? await signUp(email, password) : await signIn(email, password);

    if (error) {
      setError(error.message);
    } else if (isSignUp) {
      setSignUpSuccess(true);
    }
    setSubmitting(false);
  };

  const handleGoogle = async () => {
    setError(null);
    const { error } = await signInWithGoogle();
    if (error) setError(error.message);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-sm space-y-6">
        {/* Login required banner */}
        {redirectedFrom && (
          <div className="flex items-center gap-2 rounded-lg border border-border bg-muted/50 px-4 py-3">
            <ShieldAlert className="h-4 w-4 text-muted-foreground shrink-0" />
            <p className="text-[13px] text-muted-foreground">Please sign in to access the dashboard.</p>
          </div>
        )}

        {/* Brand */}
        <div className="flex flex-col items-center gap-3">
          <div className="h-12 w-12 rounded-xl bg-primary flex items-center justify-center">
            <BarChart3 className="h-6 w-6 text-primary-foreground" />
          </div>
          <h1 className="text-[22px] font-bold text-foreground tracking-tight">Bounce</h1>
          <p className="text-[14px] text-muted-foreground text-center">
            {isSignUp ? "Create your account to get started" : "Sign in to your analytics dashboard"}
          </p>
        </div>

        {signUpSuccess ? (
          <div className="asana-card p-6 text-center space-y-3">
            <p className="text-[14px] font-medium text-foreground">Check your email</p>
            <p className="text-[13px] text-muted-foreground">We've sent a confirmation link to <strong>{email}</strong></p>
            <Button variant="outline" size="sm" className="rounded-lg" onClick={() => { setSignUpSuccess(false); setIsSignUp(false); }}>
              Back to sign in
            </Button>
          </div>
        ) : (
          <div className="asana-card p-6 space-y-5">
            {/* Google */}
            <Button variant="outline" className="w-full rounded-lg h-10 text-[13px]" onClick={handleGoogle}>
              <svg className="h-4 w-4 mr-2" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              Continue with Google
            </Button>

            <div className="relative">
              <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-border" /></div>
              <div className="relative flex justify-center text-[12px]">
                <span className="bg-card px-2 text-muted-foreground">or</span>
              </div>
            </div>

            {/* Email form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label className="text-[13px]">Email</Label>
                <Input type="email" placeholder="you@example.com" className="rounded-lg" value={email} onChange={(e) => setEmail(e.target.value)} required />
              </div>
              <div className="space-y-2">
                <Label className="text-[13px]">Password</Label>
                <Input type="password" placeholder="••••••••" className="rounded-lg" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={6} />
              </div>

              {error && <p className="text-[13px] text-destructive">{error}</p>}

              <Button type="submit" className="w-full rounded-lg h-10 text-[13px]" disabled={submitting}>
                {submitting ? "Please wait…" : isSignUp ? "Create account" : "Sign in"}
              </Button>
            </form>

            <p className="text-[13px] text-muted-foreground text-center">
              {isSignUp ? "Already have an account?" : "Don't have an account?"}{" "}
              <button className="text-primary font-medium hover:underline" onClick={() => { setIsSignUp(!isSignUp); setError(null); }}>
                {isSignUp ? "Sign in" : "Sign up"}
              </button>
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
