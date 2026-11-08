import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Crochet Chaos | The Ultimate Crochet Bible',
  description: 'Crochet patterns, project tracking, calculators, and an evolving crochet encyclopedia.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    html lang="en">
      {children}
    /html
  );
}
