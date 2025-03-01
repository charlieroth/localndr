import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { TimeFormat } from '@/types'

type SettingsDialogProps = {
  isSettingsOpen: boolean
  setIsSettingsOpen: (isSettingsOpen: boolean) => void
  timeFormat: TimeFormat
  setTimeFormat: (timeFormat: TimeFormat) => void
}

export default function SettingsDialog({
  isSettingsOpen,
  setIsSettingsOpen,
  timeFormat,
  setTimeFormat,
}: SettingsDialogProps) {
  return (
    <Dialog open={isSettingsOpen} onOpenChange={setIsSettingsOpen}>
      <DialogContent className="border-border bg-background text-foreground sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Settings</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label>Time Format</Label>
            <RadioGroup
              value={timeFormat}
              onValueChange={(value) => setTimeFormat(value as TimeFormat)}
              className="flex gap-4"
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
      </DialogContent>
    </Dialog>
  )
}