import Header from "@/components/header";
import { RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { RadioGroup } from "@/components/ui/radio-group";
import { TimeFormat } from "@/types";
import useCalendarStore from "@/stores/calendarStore";

export default function Settings() {
  const { timeFormat, setTimeFormat } = useCalendarStore()

  return (
    <div className="flex flex-col h-screen bg-background text-foreground">
      <Header showFiltering={false} />
      <main className="flex-1">
        <div className="flex flex-col items-center justify-center pt-10">
          <div className="flex flex-col gap-4">
            <Label className="text-lg font-medium">Time Format</Label>
            <RadioGroup
              value={timeFormat}
              onValueChange={(value) => setTimeFormat(value as TimeFormat)}
              className="flex flex-col gap-4"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="12h" id="12h" />
                <Label htmlFor="12h">12-hour (1:00 PM)</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="24h" id="24h" />
                <Label htmlFor="24h">24-hour (13:00)</Label>
              </div>
            </RadioGroup>
          </div>
        </div>
      </main>
    </div>
  )
}