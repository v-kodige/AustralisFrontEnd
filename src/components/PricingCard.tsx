
import { Button } from "@/components/ui/button";
import { ReactNode } from "react";

type PricingCardProps = {
  name: string;
  price: string;
  description: string;
  features: string[];
  accent?: string; // e.g. "from-australis-indigo to-australis-aqua"
  recommended?: boolean;
  onContact?: () => void;
  ctaText?: string;
  children?: ReactNode;
};

const PricingCard = ({
  name,
  price,
  description,
  features,
  accent = "from-australis-indigo to-australis-aqua",
  recommended,
  onContact,
  ctaText = "Get Started",
  children,
}: PricingCardProps) => {
  return (
    <div
      className={
        `relative flex flex-col justify-between h-full p-8 rounded-3xl border border-white/30 bg-white/30 ` +
        `shadow-2xl shadow-australis-navy/5 backdrop-blur-xl transition-all duration-300` +
        (recommended ? " ring-2 ring-australis-indigo/50 scale-105 z-10" : "")
      }
    >
      {/* Layered background accent */}
      <div className={`absolute -top-10 -right-10 w-40 h-40 rounded-full blur-3xl z-0 bg-gradient-to-br ${accent} opacity-30`}></div>
      <div className="relative z-10">
        <h3 className="text-2xl font-bold mb-2 text-australis-navy">{name}</h3>
        <div className="flex items-baseline gap-2 mb-4">
          <span className="text-4xl font-extrabold text-australis-indigo">{price}</span>
          <span className="text-base text-australis-navy/70">{name !== "Enterprise Plus" ? "/mo" : "Custom"}</span>
        </div>
        <p className="text-gray-700 mb-6">{description}</p>
        <ul className="space-y-2 mb-8 text-base">
          {features.map((f, i) => (
            <li key={i} className="flex items-center gap-2 text-australis-navy">
              <span className="inline-block w-2 h-2 rounded-full bg-gradient-to-tr from-australis-indigo to-australis-aqua shadow" />
              {f}
            </li>
          ))}
        </ul>
        {children}
        <Button
          size="lg"
          className={
            "w-full mt-2 bg-gradient-to-r from-australis-indigo to-australis-aqua border border-white/30 backdrop-blur-md " +
            "hover:from-australis-indigo/80 hover:to-australis-aqua/80 shadow-lg shadow-australis-indigo/10"
          }
          onClick={onContact}
        >
          {ctaText}
        </Button>
        {recommended && (
          <span className="absolute top-6 right-6 px-3 py-1 text-xs font-semibold bg-australis-indigo/90 text-white rounded-full shadow">Most Popular</span>
        )}
      </div>
    </div>
  );
};

export default PricingCard;
