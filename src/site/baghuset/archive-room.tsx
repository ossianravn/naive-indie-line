"use client"

// The top floor's room: its wall (passed in from the page) above the strip, and the plan chest as a spot labelled
// "Archive" that opens a drawer of twelve older jobs. The work wall's "Older work" link (#archive) opens it too.
import { useEffect, useState, type ReactNode } from "react"
import { RoomSection } from "@/fineliner/extras/room-section"
import { SceneSpot, type SceneRegions } from "@/fineliner/extras/scene-spots"
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
} from "@/fineliner/ui/drawer"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/fineliner/ui/table"
import { ARCHIVE } from "./data"

export function ArchiveRoom({
  regions,
  children,
}: {
  regions: SceneRegions
  children?: ReactNode
}) {
  const [open, setOpen] = useState(false)
  useEffect(() => {
    const check = () => {
      if (location.hash === "#archive") setOpen(true)
    }
    check()
    addEventListener("hashchange", check)
    return () => removeEventListener("hashchange", check)
  }, [])
  const change = (next: boolean) => {
    setOpen(next)
    if (!next && location.hash === "#archive")
      history.replaceState(null, "", location.pathname + location.search)
  }
  return (
    <>
      <RoomSection
        id="work"
        aria-labelledby="work-title"
        scene="baghuset-top"
        format="strip"
        seed="baghuset"
        side="both"
        regions={regions}
        spots={
          <SceneSpot
            region="chest"
            label="Archive"
            aria-haspopup="dialog"
            onClick={() => change(true)}
          />
        }
      >
        {children}
      </RoomSection>
      <Drawer open={open} onOpenChange={change}>
        <DrawerContent className="max-h-[85dvh] overflow-y-auto px-snug pb-line">
          <div className="mx-auto grid w-full max-w-[40rem] gap-y-snug">
            <DrawerHeader className="px-0">
              <DrawerTitle className="text-h2 leading-heading">
                The archive
              </DrawerTitle>
              <DrawerDescription>
                Twelve older jobs from the plan chest.
              </DrawerDescription>
            </DrawerHeader>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-16">Year</TableHead>
                  <TableHead>Client</TableHead>
                  <TableHead>What</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {ARCHIVE.map(([year, client, what]) => (
                  <TableRow key={`${year}${client}${what}`}>
                    <TableCell className="font-type tabular-nums">
                      {year}
                    </TableCell>
                    <TableCell>{client}</TableCell>
                    <TableCell>{what}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </DrawerContent>
      </Drawer>
    </>
  )
}
