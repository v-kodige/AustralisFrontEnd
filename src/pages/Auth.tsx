
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { LogIn, Mail, Lock } from "lucide-react";

type Mode = "login" | "signup" | "reset";

const AuthPage = () => {
  const [mode, setMode] = useState<Mode>("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [resetSent, setResetSent] = useState(false);
  const navigate = useNavigate();

  // Listen for auth state changes for redirect
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_, session) => {
      setUser(session?.user || null);
      if (session?.user) {
        toast({ title: "Welcome!", description: "You're signed in." });
        navigate("/dashboard", { replace: true });
      }
    });
    supabase.auth.getUser().then(({ data }) => {
      setUser(data?.user ?? null);
    });
    return () => subscription.unsubscribe();
  }, [navigate]);

  // Google sign-in handler
  const handleGoogleLogin = async () => {
    setLoading(true);
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: window.location.origin + "/dashboard",
      },
    });
    if (error) {
      toast({ title: "Google sign-in failed", description: error.message, variant: "destructive" });
    }
    setLoading(false);
  };

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    if (!email) {
      toast({ title: "Please enter your email.", variant: "destructive" });
      setLoading(false);
      return;
    }
    if (mode === "login") {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        toast({ title: "Login failed", description: error.message, variant: "destructive" });
      }
    } else if (mode === "signup") {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: { emailRedirectTo: window.location.origin + "/dashboard" },
      });
      if (error) {
        toast({ title: "Signup failed", description: error.message, variant: "destructive" });
      } else {
        toast({ title: "Check your inbox!", description: "We sent you a confirmation email." });
      }
    } else if (mode === "reset") {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: window.location.origin + "/auth",
      });
      if (error) {
        toast({ title: "Could not send reset", description: error.message, variant: "destructive" });
      } else {
        setResetSent(true);
        toast({ title: "Email sent", description: "Check your inbox to reset your password." });
      }
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-australis-background via-white to-australis-lightBlue/20 flex items-center justify-center px-4">
      <div className="glass-card backdrop-blur-xl px-8 py-12 rounded-3xl shadow-2xl w-full max-w-md border border-white/30">
        <h2 className="text-4xl font-bold mb-6 text-center flex items-center justify-center gap-3 text-australis-blue">
          {mode === "login" && <LogIn className="w-8 h-8 text-australis-blue" />}
          {mode === "signup" && <Mail className="w-8 h-8 text-australis-teal" />}
          {mode === "reset" && <Lock className="w-8 h-8 text-australis-gray" />}
          {mode === "login" && "Sign In"}
          {mode === "signup" && "Sign Up"}
          {mode === "reset" && "Reset Password"}
        </h2>
        <form className="space-y-6 mt-6" onSubmit={handleAuth}>
          <div className="relative">
            <span className="absolute left-4 top-3.5 text-australis-gray">
              <Mail className="w-5 h-5" />
            </span>
            <Input
              autoFocus
              type="email"
              placeholder="Email"
              value={email}
              disabled={loading}
              onChange={e => setEmail(e.target.value)}
              className="pl-12 h-12 text-lg border-australis-blue/20 focus:border-australis-teal focus:ring-australis-teal/20"
            />
          </div>
          {(mode === "login" || mode === "signup") && (
            <div className="relative">
              <span className="absolute left-4 top-3.5 text-australis-gray">
                <Lock className="w-5 h-5" />
              </span>
              <Input
                type="password"
                placeholder="Password"
                value={password}
                disabled={loading}
                onChange={e => setPassword(e.target.value)}
                autoComplete="current-password"
                className="pl-12 h-12 text-lg border-australis-blue/20 focus:border-australis-teal focus:ring-australis-teal/20"
              />
            </div>
          )}
          {mode === "reset" && resetSent && (
            <div className="text-australis-teal text-sm font-medium">Reset link sent to your email.</div>
          )}

          <Button type="submit" className="w-full text-lg py-3 h-12 bg-australis-blue hover:bg-australis-blue/90 text-white font-semibold rounded-xl transition-all duration-200" disabled={loading}>
            {mode === "login" && "Sign In"}
            {mode === "signup" && "Create Account"}
            {mode === "reset" && "Send Reset Link"}
          </Button>
        </form>

        {mode !== "reset" && (
          <>
            <div className="flex items-center my-8">
              <div className="flex-1 h-px bg-australis-gray/20" />
              <div className="mx-4 text-australis-gray text-sm font-medium">OR</div>
              <div className="flex-1 h-px bg-australis-gray/20" />
            </div>
            <Button
              variant="outline"
              className="w-full flex items-center justify-center gap-3 font-semibold py-3 h-12 border-2 border-australis-blue/20 hover:bg-australis-lightBlue/10 hover:border-australis-teal text-australis-blue rounded-xl transition-all duration-200"
              onClick={handleGoogleLogin}
              disabled={loading}
              type="button"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Continue with Google
            </Button>
          </>
        )}

        <div className="text-center mt-10 space-y-2">
          {mode !== "login" && (
            <button className="text-sm text-australis-gray hover:text-australis-teal underline underline-offset-2 transition-colors duration-200" onClick={() => setMode("login")}>
              Back to Sign In
            </button>
          )}
          {mode === "login" && (
            <div className="flex flex-wrap justify-center gap-4">
              <button className="text-sm text-australis-gray hover:text-australis-teal hover:underline transition-colors duration-200" onClick={() => setMode("signup")}>
                New here? Create account
              </button>
              <span className="text-australis-gray/30">|</span>
              <button className="text-sm text-australis-gray hover:text-australis-teal hover:underline transition-colors duration-200" onClick={() => setMode("reset")}>
                Forgot password?
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
