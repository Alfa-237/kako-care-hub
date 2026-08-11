/** Éléments décoratifs très subtils (formes organiques, étoiles) pour les écrans d'accueil. */
export function AuthDecor() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      <div className="absolute -right-24 -top-24 size-72 rounded-full bg-accent/12 blur-3xl" />
      <div className="absolute -bottom-32 -left-20 size-80 rounded-full bg-primary/10 blur-3xl" />
      <svg
        className="absolute right-8 top-10 size-6 text-accent/40"
        viewBox="0 0 24 24"
        fill="currentColor"
      >
        <path d="M12 0l2.2 7.1L21.6 9l-6 4.4 2.2 7.1L12 16.2 6.2 20.5l2.2-7.1-6-4.4 7.4-1.9z" />
      </svg>
      <svg
        className="absolute bottom-16 right-16 size-4 text-primary/30"
        viewBox="0 0 24 24"
        fill="currentColor"
      >
        <path d="M12 0l2.2 7.1L21.6 9l-6 4.4 2.2 7.1L12 16.2 6.2 20.5l2.2-7.1-6-4.4 7.4-1.9z" />
      </svg>
      <svg
        className="absolute left-6 top-1/3 size-10 text-success/20"
        viewBox="0 0 48 48"
        fill="currentColor"
      >
        <path d="M40 8C24 8 12 18 10 34c-1 8 2 6 2 6s6-18 28-24c0 0-14 8-20 20 12 4 22-6 24-18 1-6-4-10-4-10z" />
      </svg>
    </div>
  );
}
