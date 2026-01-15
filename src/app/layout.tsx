import { AuthProvider } from "@/context/AuthContext";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="light">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>CrewManning Platform - Maritime Staffing Solutions</title>
        {/* Google Fonts and Material Symbols */}
        <link href="https://fonts.googleapis.com" rel="preconnect" />
        <link
          href="https://fonts.gstatic.com"
          rel="preconnect"
          crossOrigin=""
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Public+Sans:wght@400;500;700;800&display=swap"
          rel="stylesheet"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Noto+Sans:wght@400;500;700&display=swap"
          rel="stylesheet"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
          rel="stylesheet"
        />
        {/* Tailwind CDN with plugins */}
        <script src="https://cdn.tailwindcss.com?plugins=forms,container-queries"></script>
        {/* Tailwind custom config */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
          tailwind.config = {
            darkMode: 'class',
            theme: {
              extend: {
                colors: {
                  primary: '#701012',
                  'primary-light': '#efe4e4',
                  'primary-dark': '#4a0b0c',
                  'background-light': '#f8f9fb',
                  'background-dark': '#111621',
                  'surface-light': '#ffffff',
                  'surface-dark': '#1a202c',
                },
                fontFamily: {
                  display: ['Public Sans', 'sans-serif'],
                  body: ['Public Sans', 'sans-serif'],
                },
                borderRadius: {
                  DEFAULT: '0.375rem',
                  lg: '0.5rem',
                  xl: '0.75rem',
                  full: '9999px',
                },
              },
            },
          }
        `,
          }}
        />
        <style>{`.material-symbols-outlined { font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24; }`}</style>
      </head>
      <body className="bg-background-light dark:bg-background-dark text-[#1b0e0e] dark:text-gray-100 font-display transition-colors duration-200">
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
