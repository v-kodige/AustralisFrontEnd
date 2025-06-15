
import { Button } from "@/components/ui/button";

type PricingCardProps = {
  name: string;
  price: string;
  description: string;
  features: string[];
  accent?: string;
  recommended?: boolean;
  onContact?: () => void;
  ctaText?: string;
};

const accentClassMap: Record<string, string> = {
  "from-aquamarine to-neon_blue": "bg-gradient-to-br from-aquamarine to-neon_blue",
  "from-neon_blue to-aquamarine": "bg-gradient-to-br from-neon_blue to-aquamarine",
  "from-delft_blue to-neon_blue": "bg-gradient-to-br from-delft_blue to-neon_blue",
  "from-neon_blue to-delft_blue": "bg-gradient-to-br from-neon_blue to-delft_blue",
};

const PricingCard = ({
  name,
  price,
  description,
  features,
  accent = "from-neon_blue to-aquamarine",
  recommended,
  onContact,
  ctaText = "Get Started"
}: PricingCardProps) => {
  return (
    <div
      className={
        `relative flex flex-col justify-between h-full p-8 rounded-3xl border border-anti-flash_white/80 bg-white/80 ` +
        `shadow-2xl shadow-delft_blue/5 backdrop-blur-xl transition-all duration-300` +
        (recommended ? " ring-2 ring-neon_blue/50 scale-105 z-10" : "")
      }
    >
      <div className={`absolute -top-10 -right-10 w-40 h-40 rounded-full blur-3xl z-0 ${accentClassMap[accent] || ""} opacity-30`}></div>
      <div className="relative z-10">
        <h3 className="text-2xl font-bold mb-2 text-delft_blue">{name}</h3>
        <div className="flex items-baseline gap-2 mb-4">
          <span className="text-4xl font-extrabold text-neon_blue">{price}</span>
          <span className="text-base text-delft_blue/70">{name !== "Enterprise Plus" ? "/mo" : "Custom"}</span>
        </div>
        <p className="text-delft_blue/80 mb-6">{description}</p>
        <ul className="space-y-2 mb-8 text-base">
          {features.map((f, i) => (
            <li key={i} className="flex items-center gap-2 text-delft_blue">
              <span className="inline-block w-2 h-2 rounded-full bg-gradient-to-tr from-neon_blue to-aquamarine shadow" />
              {f}
            </li>
          ))}
        </ul>
        <Button
          size="lg"
          className={
            "w-full mt-2 bg-gradient-to-r from-neon_blue to-aquamarine border border-anti-flash_white/80 backdrop-blur-md " +
            "hover:from-neon_blue/80 hover:to-aquamarine/80 shadow-lg shadow-neon_blue/10"
          }
          onClick={onContact}
        >
          {ctaText}
        </Button>
        {recommended && (
          <span className="absolute top-6 right-6 px-3 py-1 text-xs font-semibold bg-neon_blue/90 text-white rounded-full shadow">Most Popular</span>
        )}
      </div>
    </div>
  );
};

export default PricingCard;
