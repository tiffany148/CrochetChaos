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
