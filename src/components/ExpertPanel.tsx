
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import { BrainCircuit, Sparkles, Users } from "lucide-react";

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
    <section id="expert-panel" className="py-24 bg-gradient-to-br from-australis-lightGray via-australis-offWhite to-white relative overflow-hidden">
      {/* Enhanced layered background effects */}
      <div className="absolute -top-20 -right-20 w-96 h-96 bg-gradient-to-br from-australis-aqua/25 to-australis-aqua/5 rounded-full blur-3xl animate-pulse-slow"></div>
      <div className="absolute -bottom-20 -left-20 w-96 h-96 bg-gradient-to-tr from-australis-indigo/25 to-australis-indigo/5 rounded-full blur-3xl animate-pulse-slow"></div>
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-radial from-white/30 to-transparent rounded-full blur-2xl"></div>
      
      <div className="container-custom relative z-10">
        {/* Elevated header section */}
        <div className="max-w-4xl mx-auto text-center mb-12">
          <div className="backdrop-blur-xl bg-white/30 border border-white/40 rounded-3xl p-8 shadow-2xl shadow-australis-navy/5">
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-australis-navy drop-shadow-sm">
              Join Our Expert Panel
            </h2>
            <div className="h-1 w-40 mx-auto bg-gradient-to-r from-australis-indigo to-australis-aqua rounded-full mb-6 shadow-lg"></div>
            <p className="text-lg text-gray-600 mb-8">
              Help shape the future of renewable energy site selection. We're assembling a panel of industry leaders to collaborate on developing Australis alongside their specific needs and requirements.
            </p>
          </div>
        </div>

        {/* Enhanced benefit cards */}
        <div className="grid md:grid-cols-3 gap-8 mb-12">
          {[
            {
              icon: <BrainCircuit className="h-8 w-8 text-australis-indigo drop-shadow-sm" />,
              title: "Direct Input",
              description: "Shape product development priorities and feature roadmap"
            },
            {
              icon: <Sparkles className="h-8 w-8 text-australis-aqua drop-shadow-sm" />,
              title: "Early Access",
              description: "Get priority access to new features and capabilities"
            },
            {
              icon: <Users className="h-8 w-8 text-australis-indigo drop-shadow-sm" />,
              title: "Network Effect",
              description: "Connect with other industry leaders and innovators"
            }
          ].map((benefit, index) => (
            <div 
              key={index}
              className="group relative p-8 rounded-2xl backdrop-blur-xl bg-white/40 border border-white/50 hover:border-australis-aqua/30 hover:bg-white/60 transition-all duration-500 shadow-xl shadow-australis-navy/5 hover:shadow-2xl hover:shadow-australis-aqua/10 transform hover:-translate-y-2"
            >
              {/* Floating icon with enhanced effects */}
              <div className="relative p-6 bg-gradient-to-br from-white/90 to-white/60 backdrop-blur-md rounded-2xl shadow-lg shadow-australis-navy/10 mb-6 inline-block border border-white/60 group-hover:shadow-xl group-hover:shadow-australis-aqua/20 transition-all duration-500">
                <div className="absolute inset-0 bg-gradient-to-br from-australis-aqua/10 to-australis-indigo/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="relative z-10">
                  {benefit.icon}
                </div>
              </div>
              
              <h3 className="text-xl font-semibold mb-3 text-australis-navy drop-shadow-sm">{benefit.title}</h3>
              <p className="text-gray-600 leading-relaxed">{benefit.description}</p>
              
              {/* Refined accent elements */}
              <div className="absolute top-4 right-4 w-2 h-2 bg-gradient-to-br from-australis-aqua/40 to-australis-indigo/40 rounded-full blur-sm opacity-60 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="absolute bottom-4 left-4 w-1 h-1 bg-gradient-to-tr from-australis-indigo/40 to-australis-aqua/40 rounded-full blur-sm opacity-60 group-hover:opacity-100 transition-opacity duration-500"></div>
            </div>
          ))}
        </div>

        {/* Enhanced form section */}
        <div className="max-w-md mx-auto">
          <div className="backdrop-blur-xl bg-white/30 border border-white/40 rounded-2xl p-6 shadow-xl shadow-australis-navy/5">
            <form onSubmit={handleSubmit} className="flex gap-4">
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1 px-4 py-3 rounded-xl border border-white/30 focus:outline-none focus:ring-2 focus:ring-australis-aqua/50 backdrop-blur-sm bg-white/40 shadow-inner text-australis-navy placeholder:text-australis-navy/60"
                required
              />
              <Button 
                type="submit" 
                className="bg-gradient-to-r from-australis-indigo to-australis-indigo/90 hover:from-australis-indigo/90 hover:to-australis-indigo/80 shadow-lg shadow-australis-indigo/20 backdrop-blur-sm border border-white/20"
              >
                Join Panel
              </Button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ExpertPanel;
