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
    <div className="flex flex-col items-center min-h-[80vh] py-20 w-full bg-gradient-to-br from-blue-50 via-white to-blue-100">
      <div className="bg-white/90 px-7 py-10 rounded-2xl shadow-xl w-full max-w-md border">
        <h2 className="text-3xl font-extrabold mb-3 text-center flex items-center justify-center gap-2 text-primary">
          {mode === "login" && <LogIn className="w-7 h-7 text-blue-500" />}
          {mode === "signup" && <Mail className="w-7 h-7 text-green-600" />}
          {mode === "reset" && <Lock className="w-7 h-7 text-gray-500" />}
          {mode === "login" && "Sign In"}
          {mode === "signup" && "Sign Up"}
          {mode === "reset" && "Reset Password"}
        </h2>
        <form className="space-y-5 mt-3" onSubmit={handleAuth}>
          <div className="relative">
            <span className="absolute left-3 top-2.5 text-gray-400">
              <Mail className="w-4 h-4" />
            </span>
            <Input
              autoFocus
              type="email"
              placeholder="Email"
              value={email}
              disabled={loading}
              onChange={e => setEmail(e.target.value)}
              className="pl-10"
            />
          </div>
          {(mode === "login" || mode === "signup") && (
            <div className="relative">
              <span className="absolute left-3 top-2.5 text-gray-400">
                <Lock className="w-4 h-4" />
              </span>
              <Input
                type="password"
                placeholder="Password"
                value={password}
                disabled={loading}
                onChange={e => setPassword(e.target.value)}
                autoComplete="current-password"
                className="pl-10"
              />
            </div>
          )}
          {mode === "reset" && resetSent && (
            <div className="text-green-700 text-sm">Reset link sent to your email.</div>
          )}

          <Button type="submit" className="w-full text-lg py-2" disabled={loading}>
            {mode === "login" && "Sign In"}
            {mode === "signup" && "Create Account"}
            {mode === "reset" && "Send Reset Link"}
          </Button>
        </form>

        {mode !== "reset" && (
          <>
            <div className="flex items-center my-5">
              <div className="flex-1 h-px bg-gray-200" />
              <div className="mx-3 text-gray-400 text-xs">OR</div>
              <div className="flex-1 h-px bg-gray-200" />
            </div>
            <Button
              variant="outline"
              className="w-full flex items-center justify-center gap-2 font-semibold py-2 border-blue-200 hover:bg-blue-50"
              onClick={handleGoogleLogin}
              disabled={loading}
              type="button"
            >
              <Mail className="w-5 h-5 text-[#EA4335]" />
              Continue with Google
            </Button>
          </>
        )}

        <div className="text-center mt-8 space-y-1">
          {mode !== "login" && (
            <button className="text-xs text-gray-600 underline underline-offset-2 hover:text-primary" onClick={() => setMode("login")}>
              Back to Sign In
            </button>
          )}
          {mode === "login" && (
            <div className="flex flex-wrap justify-center gap-3">
              <button className="text-xs text-gray-600 hover:underline" onClick={() => setMode("signup")}>
                New here? Create account
              </button>
              <span className="text-gray-200">|</span>
              <button className="text-xs text-gray-600 hover:underline" onClick={() => setMode("reset")}>
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
