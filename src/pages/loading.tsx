import LoadingHeader from "@/components/loading-header";
import { ThemeProvider } from "@/components/theme-provider";
import { LoaderCircle } from "lucide-react";

export default function Loading({ message }: { message: string }) {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <div className="flex flex-col h-screen bg-background text-foreground">
        <LoadingHeader />
        <main className="flex-1 flex flex-col items-center justify-center">
          <LoaderCircle className="size-10 animate-spin" />
          <div className="text-gray-600 text-center min-h-[100px]">
            {message}
          </div>
        </main>
      </div>
    </ThemeProvider>
  )
}