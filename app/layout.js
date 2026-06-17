import "./globals.css";
import { library } from "@fortawesome/fontawesome-svg-core";
import { fas } from "@fortawesome/free-solid-svg-icons";
import PlatformChrome from "@/Components/platform/PlatformChrome";
import { ThemeProvider, themeInitScript } from "@/Components/platform/ThemeProvider";
import AuthProvider from "@/Components/platform/AuthProvider";
library.add(fas);

export const metadata = {
  title: "CoreAcademy",
  description: "Your launchpad into tech — articles, videos, courses, and a personalized roadmap.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Sets the theme class before first paint to avoid a flash. */}
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body className="bg-white text-gray-900 dark:bg-gray-950 dark:text-white min-h-screen transition-colors">
        <AuthProvider>
          <ThemeProvider>
            <PlatformChrome>{children}</PlatformChrome>
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  );
}