import { TastingNote } from "@/fineliner/extras/tasting-note"
import { DemoSection, StateRow, type DemoMeta } from "../demo-kit"

export const meta: DemoMeta = {
  title: "Tasting note",
  description:
    "A wine on the shop's list: name and producer, grape, region and year in the typewriter, a note in the hand, the price and a drawn bottle or glass.",
  item: "tasting-note",
  group: "Fineliner extras",
}

// The listening room's short wine list. Every wine and producer is made up.
const WINES = [
  {
    name: "Bulles de Grès",
    producer: "Clos Pied-de-Lièvre",
    grape: "Chenin blanc, pét-nat",
    region: "Anjou, Loire",
    year: "2025",
    price: "420 kr",
    glass: "95 kr",
    note: "Cloudy, with apple peel and a little bread. Open it cold, over the sink.",
  },
  {
    name: "Haut & Tief",
    producer: "Weingut Am Bach Sieben",
    grape: "Grüner Veltliner, skin contact",
    region: "Kamptal",
    year: "2022",
    price: "460 kr",
    glass: "105 kr",
    note: "Ten days on the skins: apricot, black tea and a soft grip.",
  },
  {
    name: "Ruisseau",
    producer: "Les Vignes du Mardi",
    grape: "Gamay",
    region: "Beaujolais",
    year: "2024",
    price: "380 kr",
    note: "Light enough for a Thursday night. Serve it a bit cool.",
    vessel: "carafe",
  },
] as const

export default function TastingNoteDemo() {
  const [first] = WINES
  return (
    <>
      <DemoSection title="On the list">
        <StateRow label="Bottle and glass">
          <TastingNote
            name={first.name}
            producer={first.producer}
            grape={first.grape}
            region={first.region}
            year={first.year}
            price={first.price}
            glass={first.glass}
          >
            {first.note}
          </TastingNote>
        </StateRow>
        <StateRow label="The whole list">
          <ul className="m-0 flex max-w-measure list-none flex-col gap-line p-0">
            {WINES.map(({ note, ...wine }) => (
              <li key={wine.name}>
                <TastingNote {...wine}>{note}</TastingNote>
              </li>
            ))}
          </ul>
        </StateRow>
      </DemoSection>
      <DemoSection title="Drawings">
        <StateRow label="Glass">
          <TastingNote
            name="Rosé de Saignée"
            producer="Domaine Petit Orage"
            grape="Grenache"
            region="Languedoc"
            year="2024"
            price="340 kr"
            glass="80 kr"
            vessel="glass"
          >
            Strawberry and a little salt; the colour of a late sunset.
          </TastingNote>
        </StateRow>
        <StateRow label="Carafe">
          <TastingNote
            name="House red"
            grape="Gamay"
            region="Beaujolais"
            price="240 kr"
            vessel="carafe"
          >
            Half a litre, poured from the tap.
          </TastingNote>
        </StateRow>
      </DemoSection>
      <DemoSection title="States">
        <StateRow label="Sold out">
          <TastingNote
            name="Vin de Garage Nº 3"
            producer="Domaine Petit Orage"
            grape="Cinsault, Carignan"
            region="Languedoc"
            year="2023"
            price="510 kr"
            soldOut
          >
            Gone by the second Thursday. More in spring.
          </TastingNote>
        </StateRow>
        <StateRow label="No note">
          <TastingNote
            name="Ruisseau"
            producer="Les Vignes du Mardi"
            grape="Gamay"
            region="Beaujolais"
            year="2024"
            price="380 kr"
          />
        </StateRow>
        <StateRow label="Long names">
          <TastingNote
            name="Cuvée des Vieilles Vignes du Coteau Oublié, Réserve Particulière"
            producer="Domaine de la Grange aux Hirondelles et Fils"
            grape="Chenin blanc, Grolleau gris, Pineau d’Aunis"
            region="Coteaux du Loir"
            year="2021"
            price="1,240 kr"
            glass="210 kr"
          >
            A long name for a quiet wine: pear, wet stone and a bitter almond
            finish that stays through the whole of side B.
          </TastingNote>
        </StateRow>
      </DemoSection>
    </>
  )
}
