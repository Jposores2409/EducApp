import type { Metadata } from 'next';
import './globals.css'; // <-- DEBE ESTAR AQUÍ

export const metadata: Metadata = {
  title: 'Plataforma Virtual Educativa',
  description: 'Sistema de Gestión Educativa',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body className="bg-slate-100 text-slate-900 antialiased">
        {children}
      </body>
    </html>
  );
}