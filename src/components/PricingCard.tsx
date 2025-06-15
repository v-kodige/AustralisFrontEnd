
import { Button } from "@/components/ui/button";
import { ReactNode, useState } from "react";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import { ChevronDown } from "lucide-react";

type FeatureGroup = {
  title: string;
  items: string[];
};

type PricingCardProps = {
  name: string;
  price: string;
  description: string;
  features: string[];
  accent?: string;
  recommended?: boolean;
  onContact?: () => void;
  ctaText?: string;
  buttonClass?: string;
  children?: ReactNode;
  detailedFeatures?: FeatureGroup[];
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
  buttonClass,
  children,
  detailedFeatures = [],
}: PricingCardProps) => {
  // INDIVIDUAL expanded state per card (hidden by default)
  const [expanded, setExpanded] = useState(false);

  return (
    <div
      className={
        `relative flex flex-col justify-between h-full p-8 rounded-3xl border border-white/30 bg-white/30 ` +
        `shadow-2xl shadow-australis-navy/5 backdrop-blur-xl transition-all duration-300 ` +
        (expanded ? "scale-105 ring-2 ring-australis-aqua/40 z-10" : "") +
        (recommended ? " ring-2 ring-[#3bf5b7]/50 scale-105 z-10" : "")
      }
    >
      <div className={`absolute -top-10 -right-10 w-40 h-40 rounded-full blur-3xl z-0 bg-gradient-to-br ${accent} opacity-30`}></div>
      <div className="relative z-10 flex flex-col h-full">
        {recommended && (
          <div className="absolute top-6 right-6 px-3 py-1 text-xs font-semibold bg-[#3bf5b7] text-[#3a3d5d] rounded-full shadow">
            MOST POPULAR
          </div>
        )}
        <h3 className="text-2xl font-bold mb-2 text-australis-navy">{name}</h3>
        <div className="flex items-baseline gap-2 mb-1">
          <span className={`text-4xl font-extrabold ${name === "Enterprise" ? "text-black" : name === "Developer" ? "text-australis-indigo" : "text-australis-navy"}`}>{price}</span>
          <span className="text-base text-australis-navy/70">{name !== "Enterprise" ? "/month (ann.)" : ""}</span>
        </div>
        <p className="text-gray-700 mb-4">{description}</p>
        {/* Uniform bullet points */}
        <ul className="mb-6 text-base list-disc list-inside text-australis-navy space-y-2 pl-2">
          {features.map((f, i) => (
            <li key={i} className="">{f}</li>
          ))}
        </ul>
        {children}
        {/* "Choose"/CTA button always at the bottom */}
        <div className="flex w-full justify-center mt-auto pt-2">
          <Button
            size="lg"
            className={(buttonClass || "") + " w-64 text-base font-semibold py-3"}
            onClick={onContact}
          >
            {ctaText}
          </Button>
        </div>
        {/* Accordion Trigger and Content */}
        {detailedFeatures.length > 0 && (
          <>
            <button
              type="button"
              className="group flex items-center justify-center mt-6 cursor-pointer bg-transparent border-none ring-0 outline-none px-0 hover:underline focus:outline-none font-semibold text-australis-indigo transition-colors"
              onClick={() => setExpanded((v) => !v)}
              aria-expanded={expanded}
            >
              <span>{expanded ? "Hide Details" : "See Details"}</span>
              <ChevronDown
                className={`ml-2 inline-block transition-transform duration-300 ${expanded ? "rotate-180" : ""}`}
                size={18}
              />
            </button>
            {/* Expandable Features */}
            {expanded && (
              <div className="w-full px-1">
                <div className="py-3">
                  <div className="space-y-3">
                    {detailedFeatures.map((group, idx) => (
                      <div key={idx}>
                        <div className="font-semibold text-australis-navy/90 pb-1">{group.title}</div>
                        <ul className="pl-5 list-disc text-australis-navy/80 text-sm space-y-1">
                          {group.items.map((item, i) => <li key={i}>{item}</li>)}
                        </ul>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default PricingCard;

