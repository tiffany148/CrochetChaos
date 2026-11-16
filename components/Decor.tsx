const STARS: { top: string; left: string; delay: string; size: number; dot?: boolean; steady?: boolean }[] = [
  { top: "3%", left: "2%", delay: "0s", size: 16, steady: true },
  { top: "2%", left: "97%", delay: "0.2s", size: 18, steady: true },
  { top: "8%", left: "1%", delay: "0.5s", size: 9 },
  { top: "9%", left: "98%", delay: "1.1s", size: 8, dot: true },
  { top: "14%", left: "3%", delay: "1.6s", size: 12, steady: true },
  { top: "16%", left: "96%", delay: "0.7s", size: 11 },
  { top: "22%", left: "1%", delay: "0.3s", size: 8, dot: true },
  { top: "24%", left: "98%", delay: "1.4s", size: 14 },
  { top: "31%", left: "2%", delay: "0.9s", size: 15, steady: true },
  { top: "34%", left: "97%", delay: "1.8s", size: 7, dot: true },
  { top: "41%", left: "1%", delay: "0.4s", size: 10 },
  { top: "44%", left: "99%", delay: "1.2s", size: 16, steady: true },
  { top: "51%", left: "3%", delay: "0.6s", size: 8 },
  { top: "54%", left: "96%", delay: "1.5s", size: 12 },
  { top: "61%", left: "1%", delay: "0.2s", size: 14, steady: true },
  { top: "63%", left: "98%", delay: "1.0s", size: 7, dot: true },
  { top: "70%", left: "2%", delay: "1.7s", size: 9 },
  { top: "73%", left: "97%", delay: "0.8s", size: 17, steady: true },
  { top: "80%", left: "1%", delay: "1.3s", size: 8, dot: true },
  { top: "82%", left: "98%", delay: "0.5s", size: 11 },
  { top: "88%", left: "3%", delay: "0.1s", size: 16, steady: true },
  { top: "91%", left: "96%", delay: "1.6s", size: 9 },
  { top: "96%", left: "2%", delay: "0.9s", size: 13, steady: true },
  { top: "97%", left: "98%", delay: "0.4s", size: 8, dot: true },
  { top: "6%", left: "8%", delay: "1.2s", size: 7 },
  { top: "5%", left: "91%", delay: "0.6s", size: 8, dot: true },
  { top: "95%", left: "10%", delay: "1.4s", size: 7, dot: true },
  { top: "94%", left: "90%", delay: "0.3s", size: 10 },
];

export function SparkleField() {
  return (
    <div className="sparkle-field" aria-hidden="true">
      {STARS.map((star) => (
        <span
          key={`${star.top}-${star.left}`}
          className={star.steady ? "sparkle sparkle-steady" : star.dot ? "sparkle sparkle-dot" : "sparkle"}
          style={{ top: star.top, left: star.left, animationDelay: star.delay, width: star.size, height: star.size }}
        />
      ))}
    </div>
  );
}
