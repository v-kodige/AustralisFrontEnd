
import { ReactNode } from "react";
import { Cpu, Map, FileCheck2 } from 'lucide-react';

type EngineBenefitCardProps = {
  iconAccent: "australis-indigo" | "australis-aqua";
  title: string;
  subtitle: string;
  bullets: string[];
  className?: string;
};

const icons = {
  "australis-indigo": <Cpu className="h-8 w-8 text-australis-indigo" />,
  "australis-aqua": <Map className="h-8 w-8 text-australis-aqua" />,
};

const EngineBenefitCard = ({
  iconAccent,
  title,
  subtitle,
  bullets,
  className = "",
}: EngineBenefitCardProps) => (
  <div
    className={
      "group relative flex flex-col items-center text-center p-8 rounded-2xl backdrop-blur-xl bg-white/40 border border-white/50 shadow-xl transition-all duration-300 " +
      "hover:shadow-australis-aqua/50 hover:scale-105 hover:bg-white/80 focus-within:scale-105 focus-within:shadow-australis-aqua/60 " +
      className
    }
    tabIndex={0}
    aria-label={title}
  >
    <div className="relative p-4 bg-gradient-to-br from-white/90 to-white/60 rounded-2xl shadow-lg mb-4 border border-white/60 group-hover:shadow-australis-aqua/20 transition">
      <span className="inline-block">{icons[iconAccent]}</span>
      <span className="absolute -inset-2 rounded-2xl bg-australis-aqua/10 opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-opacity duration-300"></span>
    </div>
    <h3 className="text-xl font-bold mb-1 text-australis-navy">{title}</h3>
    <p className="text-australis-indigo/80 text-base mb-3">{subtitle}</p>
    <ul className="list-disc list-inside space-y-2 text-left mx-auto text-australis-navy/80">
      {bullets.map((b, i) => (
        <li key={i}>{b}</li>
      ))}
    </ul>
    {/* Decorative accent dots */}
    <div className="absolute top-4 right-4 w-2 h-2 bg-gradient-to-br from-australis-aqua/20 to-australis-indigo/20 rounded-full blur-sm"></div>
    <div className="absolute bottom-4 left-4 w-1 h-1 bg-gradient-to-tr from-australis-indigo/15 to-australis-aqua/20 rounded-full blur-sm"></div>
  </div>
);

export default EngineBenefitCard;
