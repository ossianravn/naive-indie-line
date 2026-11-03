import "@/fineliner/pen/objects/indie"
import { FinelinerDefs } from "@/fineliner/defs/fineliner-defs"
import { Drawing } from "@/fineliner/drawing/drawing"
import { Lettering } from "@/fineliner/drawing/lettering"
import { Circled } from "@/fineliner/drawing/pen-mark"
import { cn } from "@/fineliner/lib/utils"
import { Avatar, AvatarFallback } from "@/fineliner/ui/avatar"
import { RecordSleeve } from "@/fineliner/extras/record-sleeve"
import { SignIn01 } from "@/fineliner/blocks/sign-in-01"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/fineliner/ui/table"
import { Booking, LightSwitch, SoldChart } from "./shop-controls"

// A record shop's opening notice, as a server component: every part without handlers renders here, so a kit file
// that needs the browser but leaves out "use client" fails the build. The handlers live in ./shop-controls.
export default function Page() {
  return (
    <>
      <FinelinerDefs />
      <main className="mx-auto grid max-w-measure gap-section p-page">
        <Lettering text="Side B" className="text-6xl" />
        <Drawing object="turntable" seed="consumer" className="w-64" />
        <p className={cn("font-read text-body")}>
          Records, coffee and a listening corner, open from{" "}
          <Circled seed="opening">Thursday</Circled>.
        </p>
        <Avatar size="lg">
          <AvatarFallback name="Maya Singh">MS</AvatarFallback>
        </Avatar>
        <LightSwitch />
        <RecordSleeve
          title="Harbour Lights"
          artist="Ellen Moe Trio"
          catalogue="LR-0431"
          size="sm"
        />
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Record</TableHead>
              <TableHead className="text-right">Price</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell>Harbour Lights</TableCell>
              <TableCell className="text-right font-type">320 kr</TableCell>
            </TableRow>
          </TableBody>
        </Table>
        <SoldChart />
        <Booking />
      </main>
      <SignIn01 product="Side B" />
    </>
  )
}
