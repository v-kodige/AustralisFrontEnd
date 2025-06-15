
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";

type Mode = "login" | "signup" | "reset";

const AuthPage = () => {
  const [mode, setMode] = useState<Mode>("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [resetSent, setResetSent] = useState(false);
  const navigate = useNavigate();

  // Auth state
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_, session) => {
      setUser(session?.user || null);
      if (session?.user) {
        toast({ title: "Welcome!", description: "You’re signed in." });
        navigate("/", { replace: true });
      }
    });
    supabase.auth.getUser().then(({ data, error }) => {
      setUser(data?.user ?? null);
    });
    return () => subscription.unsubscribe();
  }, [navigate]);

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
        options: { emailRedirectTo: window.location.origin },
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
    <div className="flex flex-col items-center py-20 w-full">
      <div className="bg-white px-6 py-8 rounded-xl shadow-md w-full max-w-md">
        <h2 className="font-bold text-xl mb-2 text-center">
          {mode === "login" && "Sign In"}
          {mode === "signup" && "Sign Up"}
          {mode === "reset" && "Reset Password"}
        </h2>
        <form className="space-y-4" onSubmit={handleAuth}>
          <Input
            autoFocus
            type="email"
            placeholder="Email"
            value={email}
            disabled={loading}
            onChange={e => setEmail(e.target.value)}
          />
          {(mode === "login" || mode === "signup") && (
            <Input
              type="password"
              placeholder="Password"
              value={password}
              disabled={loading}
              onChange={e => setPassword(e.target.value)}
              autoComplete="current-password"
            />
          )}
          {mode === "reset" && resetSent && (
            <div className="text-green-700 text-sm">Reset link sent to your email.</div>
          )}
          <Button type="submit" className="w-full" disabled={loading}>
            {mode === "login" && "Sign In"}
            {mode === "signup" && "Create Account"}
            {mode === "reset" && "Send Reset Link"}
          </Button>
        </form>
        <div className="text-center mt-6 space-y-1">
          {mode !== "login" && (
            <button className="text-xs text-gray-600 hover:underline" onClick={() => setMode("login")}>
              Back to Sign In
            </button>
          )}
          {mode === "login" && (
            <>
              <button className="text-xs text-gray-600 mr-3 hover:underline" onClick={() => setMode("signup")}>
                New here? Create account
              </button>
              <button className="text-xs text-gray-600 hover:underline" onClick={() => setMode("reset")}>
                Forgot password?
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
