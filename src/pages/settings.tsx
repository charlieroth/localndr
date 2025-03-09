import Header from "@/components/header";
import { Label } from "@/components/ui/label";
import useCalendarStore from "@/stores/calendarStore";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useTheme } from "@/components/theme-provider";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

export default function Settings() {
  const { timeFormat, setTimeFormat } = useCalendarStore()
  const { setTheme, theme } = useTheme()

  return (
    <>
      <Header showFiltering={false} />
      <main className="flex-1">
        <div className="flex flex-col items-center justify-center pt-10">
          <Card className="shadow-md w-full max-w-md">
            <CardHeader>
              <CardTitle>Settings</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-4">
                <Label className="text-md font-medium">Time Format</Label>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="hover:cursor-pointer">
                      {timeFormat === '12h' ? '12-hour (1:00 PM)' : '24-hour (13:00)'}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start" side="right">
                    <DropdownMenuItem onClick={() => setTimeFormat('12h')}>
                      12-hour (1:00 PM)
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setTimeFormat('24h')}>
                      24-hour (13:00)
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              <div className="flex flex-col gap-4 mt-4">
                <Label className="text-md font-medium">Theme</Label>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="hover:cursor-pointer">
                      {theme === 'light' ? 'Light' : theme === 'dark' ? 'Dark' : 'System'}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start" side="right">
                    <DropdownMenuItem onClick={() => setTheme('light')}>
                      Light
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setTheme('dark')}>
                      Dark
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setTheme('system')}>
                      System
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </>
  )
}