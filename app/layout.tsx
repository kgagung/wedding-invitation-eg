import './globals.css';

export const metadata = {
  title: 'Undangan Pernikahan Adat Jawa',
  description: 'Undangan pernikahan dengan tema adat Jawa',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id">
      <body>
        {children}
      </body>
    </html>
  );
}