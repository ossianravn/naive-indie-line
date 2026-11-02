import { Drawing } from "@/fineliner/drawing/drawing"
import { Circled } from "@/fineliner/drawing/pen-mark"
import { Badge } from "@/fineliner/ui/badge"
import { Button } from "@/fineliner/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/fineliner/ui/card"
import { Checkbox } from "@/fineliner/ui/checkbox"
import { Input } from "@/fineliner/ui/input"
import { Label } from "@/fineliner/ui/label"
import { NativeSelect, NativeSelectOption } from "@/fineliner/ui/native-select"
import { Progress, ProgressLabel, ProgressValue } from "@/fineliner/ui/progress"
import { Switch } from "@/fineliner/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/fineliner/ui/tabs"

/** Every kind of part at once, so a theme can be judged at a glance: actions, fields, choices, marks and a drawing. */
export function Specimens() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Every kind of part</CardTitle>
        <CardDescription>
          The same parts the shop uses, under the theme you are choosing.
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-line @min-[40rem]:grid-cols-[minmax(0,1fr)_14rem]">
        <div className="grid content-start gap-snug">
          <div className="flex flex-wrap items-center gap-tight">
            <Button>Book a seat</Button>
            <Button variant="outline">Hold the record</Button>
            <Button variant="ghost">Later</Button>
            <Button variant="destructive">Cancel</Button>
          </div>
          <div className="flex flex-wrap items-end gap-snug">
            <Label className="flex-col items-start gap-hair">
              <span className="label text-pen-quiet">Your name</span>
              <Input defaultValue="Maya Singh" className="w-56" />
            </Label>
            <Label className="flex-col items-start gap-hair">
              <span className="label text-pen-quiet">Format</span>
              <NativeSelect defaultValue="lp" className="w-28">
                <NativeSelectOption value="lp">LP</NativeSelectOption>
                <NativeSelectOption value="single">7″</NativeSelectOption>
                <NativeSelectOption value="twelve">12″</NativeSelectOption>
              </NativeSelect>
            </Label>
          </div>
          <div className="flex flex-wrap items-center gap-x-section gap-y-tight">
            <Label>
              <Checkbox defaultChecked /> Send the Thursday list
            </Label>
            <Label>
              <Switch defaultChecked /> Hold reminders
            </Label>
          </div>
          <div className="flex flex-wrap items-center gap-tight">
            <Badge>New in</Badge>
            <Badge variant="outline">Near mint</Badge>
            <Badge variant="secondary">On hold</Badge>
            <span className="text-small">
              Thursday is <Circled seed="studio-full">full</Circled>
            </span>
          </div>
          <Tabs defaultValue="side-a">
            <TabsList>
              <TabsTrigger value="side-a">Side A</TabsTrigger>
              <TabsTrigger value="side-b">Side B</TabsTrigger>
            </TabsList>
            <TabsContent value="side-a" className="text-small text-pen-quiet">
              Harbour Lights · Low Tide · The Long Pier
            </TabsContent>
            <TabsContent value="side-b" className="text-small text-pen-quiet">
              North Light · Ferry at Dusk · Home Port
            </TabsContent>
          </Tabs>
          <Progress value={75} className="w-[18rem] max-w-full">
            <ProgressLabel>Thursday seats</ProgressLabel>
            <ProgressValue>{() => "9 of 12"}</ProgressValue>
          </Progress>
        </div>
        <Drawing
          scene="room"
          seed="studio-specimen"
          title="The listening room"
          className="w-full max-w-[14rem]"
        />
      </CardContent>
      <CardFooter className="font-type text-small text-pen-quiet">
        LR-0431 · Harbour Lights · 320 kr
      </CardFooter>
    </Card>
  )
}
