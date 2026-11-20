import './globals.css';
import { ThemeProvider } from '@/components/ui/ThemeProvider';

export const metadata = {
  title: 'ClientHub — Manage Clients Like a Pro',
  description: 'A premium client management system to streamline your workflow, manage projects, and track tasks.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
      </head>
      <body className="min-h-screen bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-100 antialiased">
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
