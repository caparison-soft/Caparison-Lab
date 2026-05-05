import './globals.css';

export const metadata = {
  title: 'Caparison Lab | AI App Marketplace',
  description: 'Your premier destination for AI-powered generation tools and utilities.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="antialiased">
        <main className="min-h-screen">
          {children}
        </main>
      </body>
    </html>
  );
}
