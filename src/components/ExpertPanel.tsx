import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import { BrainCircuit, Sparkles, Users } from "lucide-react";
import { Input } from "@/components/ui/input";

const ExpertPanel = () => {
  const { toast } = useToast();
  const [email, setEmail] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Thank you for your interest!",
      description: "We'll be in touch soon about joining our expert panel.",
    });
    setEmail("");
  };

  return (
    <section id="expert-panel" className="py-24 bg-background relative overflow-hidden">
      <div className="absolute -top-20 -right-20 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-pulse-slow"></div>
      <div className="absolute -bottom-20 -left-20 w-96 h-96 bg-secondary/10 rounded-full blur-3xl animate-pulse-slow"></div>
      
      <div className="container-custom relative z-10">
        <div className="max-w-4xl mx-auto text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 text-foreground">
            Join Our Expert Panel
          </h2>
          <div className="h-1 w-40 mx-auto bg-gradient-to-r from-secondary to-primary rounded-full mb-6"></div>
          <p className="text-lg text-muted-foreground mb-8">
            Help shape the future of renewable energy site selection. We're assembling a panel of industry leaders to collaborate on developing Australis alongside their specific needs and requirements.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-12">
          {[
            {
              icon: <BrainCircuit className="h-8 w-8 text-secondary" />,
              title: "Direct Input",
              description: "Shape product development priorities and feature roadmap"
            },
            {
              icon: <Sparkles className="h-8 w-8 text-primary" />,
              title: "Early Access",
              description: "Get priority access to new features and capabilities"
            },
            {
              icon: <Users className="h-8 w-8 text-secondary" />,
              title: "Network Effect",
              description: "Connect with other industry leaders and innovators"
            }
          ].map((benefit, index) => (
            <div 
              key={index}
              className="p-6 rounded-xl bg-card/50 border hover:border-primary/20 transition-all duration-300 hover:shadow-lg transform hover:-translate-y-2"
            >
              <div className="p-4 bg-background/80 backdrop-blur-md rounded-full shadow-sm mb-4 inline-block border">
                {benefit.icon}
              </div>
              <h3 className="text-xl font-semibold mb-2 text-card-foreground">{benefit.title}</h3>
              <p className="text-muted-foreground">{benefit.description}</p>
            </div>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="max-w-md mx-auto">
          <div className="flex gap-4">
            <Input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <Button type="submit" className="bg-secondary hover:bg-secondary/90 text-secondary-foreground hover:shadow-glow-indigo transition-all">
              Join Panel
            </Button>
          </div>
        </form>
      </div>
    </section>
  );
};

export default ExpertPanel;
