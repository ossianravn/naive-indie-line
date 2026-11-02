import { useState } from "react"
import {
  Menubar,
  MenubarCheckboxItem,
  MenubarContent,
  MenubarGroup,
  MenubarItem,
  MenubarLabel,
  MenubarMenu,
  MenubarRadioGroup,
  MenubarRadioItem,
  MenubarSeparator,
  MenubarShortcut,
  MenubarSub,
  MenubarSubContent,
  MenubarSubTrigger,
  MenubarTrigger,
} from "@/fineliner/ui/menubar"
import { DemoSection, StateRow, type DemoMeta } from "../demo-kit"

export const meta: DemoMeta = {
  title: "Menubar",
  description:
    "A desktop app's row of menus, each holding the commands for one area, moved through with the arrow keys.",
  item: "menubar",
  group: "Navigation",
}

const REGULARS = ["Maya Singh", "Jonas Berg", "Ama Owusu"]

/** The shop's till: selling, the catalogue, the view and help. */
export default function MenubarDemo() {
  const [sleeves, setSleeves] = useState(true)
  const [prices, setPrices] = useState(true)
  const [sold, setSold] = useState(false)
  const [sort, setSort] = useState("artist")
  return (
    <DemoSection title="The till">
      <StateRow label="Menus">
        <Menubar aria-label="Till">
          <MenubarMenu>
            <MenubarTrigger>Sale</MenubarTrigger>
            <MenubarContent>
              <MenubarItem>
                New sale <MenubarShortcut>Ctrl N</MenubarShortcut>
              </MenubarItem>
              <MenubarSub>
                <MenubarSubTrigger>Sell to a regular</MenubarSubTrigger>
                <MenubarSubContent>
                  {REGULARS.map((name) => (
                    <MenubarItem key={name}>{name}</MenubarItem>
                  ))}
                </MenubarSubContent>
              </MenubarSub>
              <MenubarItem>Open the drawer</MenubarItem>
              <MenubarSeparator />
              <MenubarItem>
                Print receipt <MenubarShortcut>Ctrl P</MenubarShortcut>
              </MenubarItem>
              <MenubarSeparator />
              <MenubarItem variant="destructive">Void the sale</MenubarItem>
            </MenubarContent>
          </MenubarMenu>
          <MenubarMenu>
            <MenubarTrigger>Records</MenubarTrigger>
            <MenubarContent>
              <MenubarItem>
                Add a record <MenubarShortcut>Ctrl R</MenubarShortcut>
              </MenubarItem>
              <MenubarItem>
                Find a record… <MenubarShortcut>Ctrl F</MenubarShortcut>
              </MenubarItem>
              <MenubarSeparator />
              <MenubarItem>Put on hold</MenubarItem>
              <MenubarItem disabled>
                Undo the last price <MenubarShortcut>Ctrl Z</MenubarShortcut>
              </MenubarItem>
              <MenubarSeparator />
              <MenubarItem>Print price labels</MenubarItem>
            </MenubarContent>
          </MenubarMenu>
          <MenubarMenu>
            <MenubarTrigger>View</MenubarTrigger>
            <MenubarContent>
              <MenubarGroup>
                <MenubarLabel>Show</MenubarLabel>
                <MenubarCheckboxItem
                  checked={sleeves}
                  onCheckedChange={setSleeves}
                >
                  Sleeves
                </MenubarCheckboxItem>
                <MenubarCheckboxItem
                  checked={prices}
                  onCheckedChange={setPrices}
                >
                  Prices
                </MenubarCheckboxItem>
                <MenubarCheckboxItem checked={sold} onCheckedChange={setSold}>
                  Sold records
                </MenubarCheckboxItem>
                <MenubarCheckboxItem disabled>
                  Signed copies (none yet)
                </MenubarCheckboxItem>
              </MenubarGroup>
              <MenubarSeparator />
              <MenubarGroup>
                <MenubarLabel>Sort the crate</MenubarLabel>
                <MenubarRadioGroup value={sort} onValueChange={setSort}>
                  <MenubarRadioItem value="artist">By artist</MenubarRadioItem>
                  <MenubarRadioItem value="year">By year</MenubarRadioItem>
                  <MenubarRadioItem value="added">Newest in</MenubarRadioItem>
                </MenubarRadioGroup>
              </MenubarGroup>
            </MenubarContent>
          </MenubarMenu>
          <MenubarMenu>
            <MenubarTrigger>Help</MenubarTrigger>
            <MenubarContent>
              <MenubarItem>The shop handbook</MenubarItem>
              <MenubarItem>
                Keyboard shortcuts <MenubarShortcut>?</MenubarShortcut>
              </MenubarItem>
              <MenubarSeparator />
              <MenubarItem>About the till</MenubarItem>
            </MenubarContent>
          </MenubarMenu>
        </Menubar>
      </StateRow>
      <StateRow label="A menu switched off">
        <Menubar aria-label="Till, after closing">
          <MenubarMenu>
            <MenubarTrigger>Sale</MenubarTrigger>
            <MenubarContent>
              <MenubarItem>Count the drawer</MenubarItem>
              <MenubarItem>Print the day’s takings</MenubarItem>
            </MenubarContent>
          </MenubarMenu>
          <MenubarMenu disabled>
            <MenubarTrigger>Records</MenubarTrigger>
          </MenubarMenu>
          <MenubarMenu>
            <MenubarTrigger>Help</MenubarTrigger>
            <MenubarContent>
              <MenubarItem>The shop handbook</MenubarItem>
            </MenubarContent>
          </MenubarMenu>
        </Menubar>
      </StateRow>
    </DemoSection>
  )
}
