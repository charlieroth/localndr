import { LoaderCircle } from "lucide-react"

export function LoadingScreen({ children }: { children: React.ReactNode }) {
  return (
    <div className="h-screen w-screen flex flex-col items-center justify-center gap-4">
      <LoaderCircle className="size-10 animate-spin" />
      <div className="text-gray-600 text-center min-h-[100px]">
        {children}
      </div>
    </div>
  )
}