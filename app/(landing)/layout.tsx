import { ThemeProvider } from "@/components/providers/theme-provider";

export default function LandingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <div className="min-h-screen bg-background">
        {children}
      </div>
    </ThemeProvider>
  );
}
