import type {Metadata, Viewport} from 'next';
import './globals.css'; // Global styles

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: '#04091A',
};

export const metadata: Metadata = {
  title: 'AI Study Buddy — Learn Smarter, Not Harder',
  description: 'AI Study Buddy helps students learn smarter with personalized learning, smart quizzes, planning, notes, and AI tutoring.',
  openGraph: {
    title: 'AI Study Buddy — Student Dashboard',
    description: 'Premium dark-themed AI-powered study dashboard and productivity companion for school students.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AI Study Buddy — Student Dashboard',
    description: 'Premium dark-themed AI-powered study dashboard and productivity companion for school students.',
  },
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="en">
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}
