// The messages behind a record on hold: the customer asks, the shop answers. Keyed by catalogue number; records
// without a thread show none. Made up, and static; times are local, on the days before the demo clock.

export interface Note {
  id: string
  from: "customer" | "shop"
  author: string
  /** Local time, ISO 8601. */
  at: string
  body: string
}

export const THREADS: Record<string, Note[]> = {
  "LR-0429": [
    {
      id: "n1",
      from: "customer",
      author: "Jonas Berg",
      at: "2026-10-30T17:42",
      body: "Is Paper Moons still in the racks? I heard it in the room last week and can't stop humming side one.",
    },
    {
      id: "n2",
      from: "shop",
      author: "Listening Room",
      at: "2026-10-30T18:05",
      body: "It is. Very good copy, a little ring wear on the sleeve. Shall we hold it for you?",
    },
    {
      id: "n3",
      from: "customer",
      author: "Jonas Berg",
      at: "2026-10-30T18:11",
      body: "Please. I can come in on Thursday after the Blue Note night.",
    },
    {
      id: "n4",
      from: "shop",
      author: "Listening Room",
      at: "2026-10-30T18:14",
      body: "Held for you until Thursday 5 November. We'll put it behind the counter.",
    },
  ],
  "LR-0414": [
    {
      id: "n1",
      from: "customer",
      author: "Maya Singh",
      at: "2026-11-01T10:20",
      body: "Neon Orchard! Could I play it in the room before I decide? It's a lot of money for one record.",
    },
    {
      id: "n2",
      from: "shop",
      author: "Listening Room",
      at: "2026-11-01T10:48",
      body: "Of course. It's on hold for you, and it's on the list for your session on Thursday at two.",
    },
  ],
  "LR-0423": [
    {
      id: "n1",
      from: "customer",
      author: "Ama Owusu",
      at: "2026-10-31T15:03",
      body: "Rain on Tin is the one my mother played every Sunday. Please don't sell it before Saturday.",
    },
    {
      id: "n2",
      from: "shop",
      author: "Listening Room",
      at: "2026-10-31T15:30",
      body: "It's yours until Saturday 7 November. See you then.",
    },
  ],
}

const TIME = new Intl.DateTimeFormat("en-GB", {
  weekday: "short",
  day: "numeric",
  month: "short",
  hour: "2-digit",
  minute: "2-digit",
  timeZone: "UTC",
})

/** "Fri 30 Oct, 17:42", from a local ISO time (formatted as written, whatever the reader's time zone). */
export const noteTime = (at: string) => TIME.format(new Date(`${at}:00Z`))
