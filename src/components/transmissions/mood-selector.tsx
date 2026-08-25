// Sélecteur visuel d'humeur : 4 boutons radio (phase 3C).
import { cn } from "@/lib/utils";
import { MOOD_LABELS } from "@/lib/models/daily-transmission";
import type { Mood } from "@/lib/models/daily-transmission";

const MOOD_OPTIONS: Array<{ value: Mood; emoji: string }> = [
  { value: "excellent", emoji: "😄" },
  { value: "bon", emoji: "🙂" },
  { value: "moyen", emoji: "😐" },
  { value: "difficile", emoji: "😣" },
];

export function MoodSelector({
  value,
  onChange,
  disabled,
}: {
  value?: Mood | undefined;
  onChange: (mood: Mood) => void;
  disabled?: boolean;
}) {
  return (
    <div role="radiogroup" aria-label="Humeur du jour" className="flex flex-wrap gap-2">
      {MOOD_OPTIONS.map((option) => {
        const selected = value === option.value;
        return (
          <button
            key={option.value}
            type="button"
            role="radio"
            aria-checked={selected}
            disabled={disabled}
            onClick={() => onChange(option.value)}
            data-testid={`mood-${option.value}`}
            className={cn(
              "flex min-w-[86px] flex-col items-center gap-1 rounded-xl border px-3 py-2.5 text-xs font-medium transition-colors",
              "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary",
              selected
                ? "border-primary bg-primary/10 text-primary"
                : "bg-card text-muted-foreground hover:bg-muted/50",
              disabled && "cursor-not-allowed opacity-60",
            )}
          >
            <span className="text-xl leading-none" aria-hidden="true">
              {option.emoji}
            </span>
            {MOOD_LABELS[option.value]}
          </button>
        );
      })}
    </div>
  );
}
