import { Receipt, ReceiptLine, ReceiptTotal } from "@/fineliner/extras/receipt"
import { Stamp } from "@/fineliner/extras/stamp"
import { DemoSection, StateRow, type DemoMeta } from "../demo-kit"

export const meta: DemoMeta = {
  title: "Receipt",
  description:
    "A till receipt for estimates and orders: lines in the typewriter with dotted leaders, the total under a doubled rule, a torn edge.",
  item: "receipt",
  group: "Fineliner extras",
}

export default function ReceiptDemo() {
  return (
    <>
      <DemoSection title="Receipts">
        <StateRow label="An estimate">
          <Receipt seed="estimate">
            <ReceiptLine amount="60.000 kr.">Identity</ReceiptLine>
            <ReceiptLine amount="× 1.5">Size: medium</ReceiptLine>
            <ReceiptLine amount="18.000 kr.">Drawings</ReceiptLine>
            <ReceiptLine amount="12.000 kr.">We write the words</ReceiptLine>
            <ReceiptTotal amount="120.000 kr.">Total excl. moms</ReceiptTotal>
            <p className="m-0 pt-tight text-end">
              <Stamp>Estimate</Stamp>
            </p>
          </Receipt>
        </StateRow>
        <StateRow label="Long lines">
          <Receipt seed="long">
            <ReceiptLine amount="25.000 kr.">
              Printed thing: a forty-page yearbook in two colours with a
              hand-drawn cover
            </ReceiptLine>
            <ReceiptLine amount="+20 %">Needed within five weeks</ReceiptLine>
            <ReceiptTotal amount="30.000 kr." />
          </Receipt>
        </StateRow>
        <StateRow label="One line">
          <Receipt seed="one">
            <ReceiptLine amount="90.000 kr.">Website</ReceiptLine>
            <ReceiptTotal amount="90.000 kr." />
          </Receipt>
        </StateRow>
      </DemoSection>
    </>
  )
}
