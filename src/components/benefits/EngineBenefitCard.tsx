
import { ReactNode } from "react";

type EngineBenefitCardProps = {
  icon: ReactNode;
  title: string;
  subtitle: string;
  bullets: string[];
  className?: string;
};

const EngineBenefitCard = ({
  icon,
  title,
  subtitle,
  bullets,
  className = "",
}: EngineBenefitCardProps) => (
  <div
    className={
      "group relative flex flex-col items-center text-center p-8 rounded-2xl backdrop-blur-xl bg-white/40 border border-white/50 shadow-xl transition-all duration-500 hover:shadow-australis-aqua/30 hover:scale-105 hover:bg-white/70 focus-within:scale-105 focus-within:shadow-australis-aqua/40 " +
      className
    }
    tabIndex={0}
    aria-label={title}
  >
    <div className="relative p-6 bg-gradient-to-br from-white/90 to-white/60 backdrop-blur-md rounded-2xl shadow-lg mb-6 border border-white/60 group-hover:shadow-australis-aqua/20">
      <div className="relative z-10">{icon}</div>
      <span className="absolute -inset-2 rounded-2xl bg-australis-aqua/15 opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-opacity duration-500"></span>
    </div>
    <h3 className="text-xl font-bold mb-2 text-australis-navy">{title}</h3>
    <p className="text-australis-indigo/80 text-base mb-5">{subtitle}</p>
    <ul className="list-disc list-inside space-y-2 text-left mx-auto text-australis-navy/80">
      {bullets.map((b, i) => (
        <li key={i} className="">{b}</li>
      ))}
    </ul>
    {/* Subtle colored accent dots */}
    <div className="absolute top-4 right-4 w-2 h-2 bg-gradient-to-br from-australis-aqua/30 to-australis-indigo/30 rounded-full blur-sm"></div>
    <div className="absolute bottom-4 left-4 w-1 h-1 bg-gradient-to-tr from-australis-indigo/20 to-australis-aqua/30 rounded-full blur-sm"></div>
  </div>
);

export default EngineBenefitCard;
