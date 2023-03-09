import './globals.css';

export const metadata = {
  title: 'Accessibili-TOE',
  description: 'Tic-Tac-Toe for ALL',
}

export default function RootLayout({
  children
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
