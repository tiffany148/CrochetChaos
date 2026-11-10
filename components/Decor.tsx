const STARS = [
  { top: "6%", left: "8%", delay: "0s", size: 10 },
  { top: "14%", left: "22%", delay: "0.4s", size: 6 },
  { top: "9%", left: "78%", delay: "1.1s", size: 12 },
  { top: "22%", left: "92%", delay: "0.2s", size: 7 },
  { top: "31%", left: "4%", delay: "1.6s", size: 8 },
  { top: "40%", left: "88%", delay: "0.8s", size: 11 },
  { top: "52%", left: "14%", delay: "1.3s", size: 6 },
  { top: "58%", left: "70%", delay: "0.5s", size: 9 },
  { top: "67%", left: "96%", delay: "1.8s", size: 7 },
  { top: "73%", left: "28%", delay: "0.9s", size: 10 },
  { top: "81%", left: "8%", delay: "1.4s", size: 6 },
  { top: "86%", left: "84%", delay: "0.3s", size: 12 },
  { top: "18%", left: "48%", delay: "1.9s", size: 5 },
  { top: "46%", left: "54%", delay: "0.7s", size: 6 },
  { top: "93%", left: "46%", delay: "1.2s", size: 8 },
];

export function SparkleField() {
  return (
    <div className="sparkle-field" aria-hidden="true">
      {STARS.map((star) => (
        <span
          key={`${star.top}-${star.left}`}
          className="sparkle"
          style={{ top: star.top, left: star.left, animationDelay: star.delay, width: star.size, height: star.size }}
        />
      ))}
    </div>
  );
}

export function YarnBall() {
  return (
    <svg className="motif" viewBox="0 0 80 80" aria-hidden="true">
      <circle cx="40" cy="44" r="24" fill="#ff2d8a" />
      <path d="M22 40c8-10 20-8 28 2 6 8 4 16-4 18" fill="none" stroke="#d6f25c" strokeWidth="3" strokeLinecap="round" />
      <path d="M26 52c10 6 22 2 26-8" fill="none" stroke="#3ef0df" strokeWidth="3" strokeLinecap="round" />
      <path d="M48 28c6 4 10 2 16-4" fill="none" stroke="#fff8ef" strokeWidth="3" strokeLinecap="round" />
      <circle cx="32" cy="36" r="3" fill="#fff8ef" />
    </svg>
  );
}

export function CrochetHook() {
  return (
    <svg className="motif" viewBox="0 0 80 80" aria-hidden="true">
      <path d="M18 58c8-2 18-8 24-20 4-8 8-12 16-14 4 6 2 12-2 16-6 6-14 8-18 16" fill="none" stroke="#3ef0df" strokeWidth="5" strokeLinecap="round" />
      <path d="M52 22c6 2 10 8 8 12" fill="none" stroke="#ff2d8a" strokeWidth="4" strokeLinecap="round" />
      <circle cx="22" cy="60" r="5" fill="#d6f25c" />
    </svg>
  );
}

export function StitchMarker() {
  return (
    <svg className="motif" viewBox="0 0 80 80" aria-hidden="true">
      <circle cx="38" cy="42" r="16" fill="none" stroke="#d6f25c" strokeWidth="6" />
      <path d="M50 30h10v14H50" fill="none" stroke="#ff2d8a" strokeWidth="6" strokeLinejoin="round" />
      <circle cx="58" cy="28" r="4" fill="#7c3aed" />
    </svg>
  );
}

export function MotifRow() {
  return (
    <div className="motif-row" aria-hidden="true">
      <YarnBall />
      <CrochetHook />
      <StitchMarker />
      <YarnBall />
      <CrochetHook />
    </div>
  );
}
