import { useState } from "react"
import {
  AudioLinesIcon,
  FileTextIcon,
  ImageIcon,
  RotateCcwIcon,
  XIcon,
} from "lucide-react"
import { drawing } from "@/fineliner/pen"
import {
  Attachment,
  AttachmentAction,
  AttachmentActions,
  AttachmentContent,
  AttachmentDescription,
  AttachmentGroup,
  AttachmentMedia,
  AttachmentTitle,
  AttachmentTrigger,
} from "@/fineliner/ui/attachment"
import { Spinner } from "@/fineliner/ui/spinner"
import { DemoSection, StateRow, type DemoMeta } from "../demo-kit"

export const meta: DemoMeta = {
  title: "Attachment",
  description:
    "A file handed over with a message, as a small ticket: what it is, how big, and whether it has arrived.",
  item: "attachment",
  group: "Conversation",
}

// A stand-in photo of the record's sleeve, so the demo needs no network: a record inked on a coloured ground, as a
// self-contained image.
const PHOTO = `data:image/svg+xml;utf8,${encodeURIComponent(
  drawing({ object: "record", seed: "Neon Orchard sleeve" })[0]!
    .replace("<svg ", '<svg xmlns="http://www.w3.org/2000/svg" ')
    .replace(
      /(<svg[^>]*>)/,
      '$1<style>.ln{fill:none;stroke:#1d2840;stroke-width:1.5;vector-effect:non-scaling-stroke;stroke-linecap:round;stroke-linejoin:round}.ink{fill:#1d2840}.wash,.sheet-fill{fill:#e9dcc0}</style><rect x="-40" y="-40" width="200" height="200" fill="#d9b9a9"/>',
    ),
)}`

function Remove({ name, onClick }: { name: string; onClick?: () => void }) {
  return (
    <AttachmentActions>
      <AttachmentAction aria-label={`Remove ${name}`} onClick={onClick}>
        <XIcon />
      </AttachmentAction>
    </AttachmentActions>
  )
}

function VoiceNote({ onRemove }: { onRemove?: () => void }) {
  return (
    <Attachment>
      <AttachmentMedia>
        <AudioLinesIcon />
      </AttachmentMedia>
      <AttachmentContent>
        <AttachmentTitle>voice-note.m4a</AttachmentTitle>
        <AttachmentDescription>Audio · 0:14 · 220 KB</AttachmentDescription>
      </AttachmentContent>
      <Remove name="voice-note.m4a" onClick={onRemove} />
    </Attachment>
  )
}

function Photo({ onRemove }: { onRemove?: () => void }) {
  return (
    <Attachment>
      <AttachmentMedia variant="image">
        <img src={PHOTO} alt="" />
      </AttachmentMedia>
      <AttachmentContent>
        <AttachmentTitle>neon-orchard-sleeve.jpg</AttachmentTitle>
        <AttachmentDescription>Photo · 1.8 MB</AttachmentDescription>
      </AttachmentContent>
      <Remove name="neon-orchard-sleeve.jpg" onClick={onRemove} />
    </Attachment>
  )
}

const ALL = ["voice", "photo", "list"]

function Composer() {
  const [files, setFiles] = useState(ALL)
  const drop = (file: string) => () =>
    setFiles((current) => current.filter((f) => f !== file))
  return (
    <div className="max-w-[34rem]">
      <AttachmentGroup>
        {files.includes("voice") ? (
          <VoiceNote onRemove={drop("voice")} />
        ) : null}
        {files.includes("photo") ? <Photo onRemove={drop("photo")} /> : null}
        {files.includes("list") ? (
          <Attachment size="sm">
            <AttachmentMedia>
              <FileTextIcon />
            </AttachmentMedia>
            <AttachmentContent>
              <AttachmentTitle>wishlist.txt</AttachmentTitle>
              <AttachmentDescription>Text · 2 KB</AttachmentDescription>
            </AttachmentContent>
            <Remove name="wishlist.txt" onClick={drop("list")} />
          </Attachment>
        ) : null}
      </AttachmentGroup>
      {files.length === 0 ? (
        <p className="m-0 py-tight text-small leading-small text-pen-quiet">
          Nothing attached.{" "}
          <button
            type="button"
            className="cursor-pointer text-pen underline decoration-1 underline-offset-[0.2em]"
            onClick={() => setFiles(ALL)}
          >
            Put them back
          </button>
        </p>
      ) : null}
    </div>
  )
}

export default function AttachmentDemo() {
  return (
    <>
      <DemoSection title="Sound and photo">
        <StateRow label="Tickets">
          <VoiceNote />
          <Photo />
        </StateRow>
        <StateRow label="Tile">
          <Attachment orientation="vertical">
            <AttachmentMedia variant="image">
              <img src={PHOTO} alt="" />
            </AttachmentMedia>
            <AttachmentContent>
              <AttachmentTitle>neon-orchard-sleeve.jpg</AttachmentTitle>
              <AttachmentDescription>1.8 MB</AttachmentDescription>
            </AttachmentContent>
            <AttachmentTrigger aria-label="Open neon-orchard-sleeve.jpg" />
            <Remove name="neon-orchard-sleeve.jpg" />
          </Attachment>
          <Attachment orientation="vertical">
            <AttachmentMedia variant="image">
              <img src={PHOTO} alt="The sleeve of Neon Orchard" />
            </AttachmentMedia>
          </Attachment>
        </StateRow>
      </DemoSection>
      <DemoSection title="States">
        <StateRow label="Idle">
          <Attachment state="idle">
            <AttachmentMedia>
              <ImageIcon />
            </AttachmentMedia>
            <AttachmentContent>
              <AttachmentTitle>rain-on-tin-sleeve.jpg</AttachmentTitle>
              <AttachmentDescription>Waiting · 1.6 MB</AttachmentDescription>
            </AttachmentContent>
            <Remove name="rain-on-tin-sleeve.jpg" />
          </Attachment>
        </StateRow>
        <StateRow label="Uploading">
          <Attachment state="uploading">
            <AttachmentMedia variant="image">
              <img src={PHOTO} alt="" />
            </AttachmentMedia>
            <AttachmentContent>
              <AttachmentTitle>neon-orchard-sleeve.jpg</AttachmentTitle>
              <AttachmentDescription>Uploading · 64%</AttachmentDescription>
            </AttachmentContent>
            <Remove name="neon-orchard-sleeve.jpg" />
          </Attachment>
        </StateRow>
        <StateRow label="Processing">
          <Attachment state="processing">
            <AttachmentMedia>
              <Spinner />
            </AttachmentMedia>
            <AttachmentContent>
              <AttachmentTitle>voice-note.m4a</AttachmentTitle>
              <AttachmentDescription>Transcribing</AttachmentDescription>
            </AttachmentContent>
          </Attachment>
        </StateRow>
        <StateRow label="Error">
          <Attachment state="error">
            <AttachmentMedia>
              <AudioLinesIcon />
            </AttachmentMedia>
            <AttachmentContent>
              <AttachmentTitle>voice-note-2.m4a</AttachmentTitle>
              <AttachmentDescription>Empty file · 0 KB</AttachmentDescription>
            </AttachmentContent>
            <AttachmentActions>
              <AttachmentAction aria-label="Try voice-note-2.m4a again">
                <RotateCcwIcon />
              </AttachmentAction>
            </AttachmentActions>
          </Attachment>
        </StateRow>
        <StateRow label="Name only">
          <Attachment>
            <AttachmentContent>
              <AttachmentTitle>wine-list-november.pdf</AttachmentTitle>
              <AttachmentDescription>PDF · 88 KB</AttachmentDescription>
            </AttachmentContent>
          </Attachment>
        </StateRow>
      </DemoSection>
      <DemoSection title="Sizes">
        {(["default", "sm", "xs"] as const).map((size) => (
          <StateRow key={size} label={size}>
            <Attachment size={size}>
              <AttachmentMedia>
                <AudioLinesIcon />
              </AttachmentMedia>
              <AttachmentContent>
                <AttachmentTitle>voice-note.m4a</AttachmentTitle>
                {size === "xs" ? null : (
                  <AttachmentDescription>Audio · 220 KB</AttachmentDescription>
                )}
              </AttachmentContent>
            </Attachment>
          </StateRow>
        ))}
      </DemoSection>
      <DemoSection title="In a message">
        <Composer />
      </DemoSection>
    </>
  )
}
