import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/fineliner/ui/table"
import { kroner } from "@/site/listening-room/data"
import { STOCK_ROWS } from "./stock-rows"

// The whole stock book in a fixed-height container: the heading row sticks and takes its paper while 200 rows scroll
// under it. Every row rule is one of five drawn masks, so nothing is drawn or filtered per row.
export function LongTable() {
  return (
    <div className="w-full max-w-[52rem] *:data-[slot=table-container]:h-[26rem]">
      <Table aria-label="Stock book, 200 records">
        <TableHeader>
          <TableRow>
            <TableHead className="w-24">No.</TableHead>
            <TableHead>Title</TableHead>
            <TableHead>Artist</TableHead>
            <TableHead className="text-right">Year</TableHead>
            <TableHead>Format</TableHead>
            <TableHead className="text-right">Price</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {STOCK_ROWS.map((row) => (
            <TableRow key={row.no}>
              <TableCell className="font-type text-small text-pen-quiet">
                {row.no}
              </TableCell>
              <TableCell className="font-medium">{row.title}</TableCell>
              <TableCell className="text-pen-quiet">{row.artist}</TableCell>
              <TableCell className="text-right font-type text-small">
                {row.year}
              </TableCell>
              <TableCell>{row.format}</TableCell>
              <TableCell className="text-right font-type text-small">
                {kroner(row.price)}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
