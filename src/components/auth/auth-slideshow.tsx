import { useEffect, useState } from "react";

/**
 * Diaporama d'accueil KAKO Manager.
 * Les visuels sont générés spécifiquement pour le projet (src/assets/login),
 * libres de droit et utilisables commercialement — aucune image tierce.
 */
export interface Slide {
  src: string;
  alt: string;
}

export function AuthSlideshow({
  slides,
  interval = 5000,
  children,
}: {
  slides: Slide[];
  interval?: number;
  children?: React.ReactNode;
}) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (slides.length < 2) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return;
    const id = setInterval(() => setIndex((i) => (i + 1) % slides.length), interval);
    return () => clearInterval(id);
  }, [slides.length, interval]);

  return (
    <div className="relative isolate h-full w-full overflow-hidden">
      {slides.map((slide, i) => (
        <img
          key={slide.src}
          src={slide.src}
          alt={slide.alt}
          width={1200}
          height={1600}
          loading={i === 0 ? "eager" : "lazy"}
          className={`absolute inset-0 size-full object-cover transition-all duration-[1600ms] ease-out ${
            i === index ? "scale-105 opacity-100" : "scale-100 opacity-0"
          }`}
          style={{ transitionProperty: "opacity, transform" }}
        />
      ))}

      {/* Voiles de lecture */}
      <div className="absolute inset-0 bg-gradient-to-t from-sidebar/95 via-sidebar/55 to-sidebar/35" />
      <div className="absolute inset-0 bg-[radial-gradient(120%_80%_at_20%_10%,transparent_35%,var(--sidebar)_120%)] opacity-70" />

      <div className="relative flex h-full flex-col justify-between p-8 xl:p-12">{children}</div>

      {slides.length > 1 && (
        <div className="absolute bottom-6 left-8 flex gap-2 xl:left-12">
          {slides.map((s, i) => (
            <button
              key={s.src}
              type="button"
              onClick={() => setIndex(i)}
              aria-label={`Image ${i + 1}`}
              aria-current={i === index}
              className={`h-1.5 rounded-full transition-all duration-500 ${
                i === index
                  ? "w-8 bg-sidebar-primary"
                  : "w-3 bg-sidebar-foreground/40 hover:bg-sidebar-foreground/70"
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
