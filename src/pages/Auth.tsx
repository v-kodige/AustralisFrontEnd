import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/use-toast";

const tabOptions = ["Login", "Signup", "Reset"];

const Auth = () => {
  const [tab, setTab] = useState<"Login" | "Signup" | "Reset">("Login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [processing, setProcessing] = useState(false);
  const navigate = useNavigate();

  const handleSwitch = (t: "Login" | "Signup" | "Reset") => {
    setTab(t);
    setEmail(""); setPassword("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setProcessing(true);

    if (tab === "Login") {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) toast({ title: "Login failed", description: error.message, variant: "destructive" });
      else {
        toast({ title: "Welcome back!" });
        navigate("/");
      }
    } else if (tab === "Signup") {
      const redirectUrl = `${window.location.origin}/`; // must use this for confirmation
      const { error } = await supabase.auth.signUp({
        email, password,
        options: { emailRedirectTo: redirectUrl }
      });
      if (error) toast({ title: "Signup error", description: error.message, variant: "destructive" });
      else toast({ title: "Confirm your email", description: "Check your inbox to complete signup." });
    } else if (tab === "Reset") {
      const redirectUrl = `${window.location.origin}/auth`;
      const { error } = await supabase.auth.resetPasswordForEmail(email, { redirectTo: redirectUrl });
      if (error) toast({ title: "Reset failed", description: error.message, variant: "destructive" });
      else toast({ title: "Reset email sent", description: "Check your inbox to reset your password." });
    }
    setProcessing(false);
  };

  return (
    <section className="py-16 flex justify-center items-center min-h-screen bg-gradient-to-br from-australis-offWhite via-white to-australis-lightGray">
      <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-lg border border-[#eceafb] flex flex-col gap-4">
        <div className="flex justify-center mb-4 gap-2">
          {tabOptions.map((opt) => (
            <Button
              key={opt}
              variant={tab === opt ? "default" : "secondary"}
              className="flex-1 text-base rounded-full"
              onClick={() => handleSwitch(opt as any)}
              disabled={processing}
            >{opt}</Button>
          ))}
        </div>
        <form className="flex flex-col gap-3" onSubmit={handleSubmit}>
          <Input
            type="email"
            placeholder="Email"
            required
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={processing}
          />
          {(tab === "Login" || tab === "Signup") && (
            <Input
              type="password"
              placeholder="Password"
              required
              autoComplete={tab === "Signup" ? "new-password" : "current-password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={processing}
            />
          )}
          <Button
            type="submit"
            className="w-full mt-3"
            disabled={processing}
          >
            {tab === "Login" ? "Sign In" : tab === "Signup" ? "Sign Up" : "Send Reset Email"}
          </Button>
        </form>
        <div className="mt-2 text-center text-sm text-gray-500 space-x-2">
          {tab === "Login" && (
            <>
              <span>Don&apos;t have an account?</span>
              <button className="underline text-australis-indigo" onClick={() => handleSwitch("Signup")}>Sign up</button>
              <span>·</span>
              <button className="underline text-australis-indigo" onClick={() => handleSwitch("Reset")}>Forgot password?</button>
            </>
          )}
          {tab === "Signup" && (
            <>
              <span>Already have an account?</span>
              <button className="underline text-australis-indigo" onClick={() => handleSwitch("Login")}>Sign in</button>
            </>
          )}
          {tab === "Reset" && (
            <>
              <span>Remember your password?</span>
              <button className="underline text-australis-indigo" onClick={() => handleSwitch("Login")}>Sign in</button>
            </>
          )}
        </div>
      </div>
    </section>
  );
};

export default Auth;
