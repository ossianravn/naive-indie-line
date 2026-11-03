import "@/site/maaltid/drawings"
import { Drawing } from "@/fineliner/drawing/drawing"
import { HandNote } from "@/fineliner/extras/hand-note"
import { Badge } from "@/fineliner/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/fineliner/ui/dialog"
import { MENU, kr, type Allergen, type Course, type Dish } from "./data"

// The evening's menu as a printed card: each course's name in the label voice with a small drawing, then its dishes,
// the price set right after the dish's name on the typewriter, so the eye never travels to a far margin for it. A few
// dishes carry a word in the hand, and a badge marks the vegan ones (nearly everything else is vegetarian, which the
// page says once rather than on every dish). On the menu page each dish opens to what the waiter would tell you, with
// its drawing large; the home page's brief card (the first dish of each course) is print only. Dishes holding
// something a guest leaves out are taken off, and a course left empty says so.

interface MenuCardProps {
  courses?: Course[]
  /** Only the first dish of each course, as print: no dialogs, no asides. */
  brief?: boolean
  /** Take off dishes that hold any of these. */
  leaveOut?: Allergen[]
}

const DIET = { vegetarian: "Vegetarian", vegan: "Vegan" } as const

export function MenuCard({
  courses = MENU,
  brief = false,
  leaveOut = [],
}: MenuCardProps) {
  return (
    <div className="grid gap-y-section">
      {courses.map((course) => {
        const all = brief ? course.dishes.slice(0, 1) : course.dishes
        const dishes = all.filter(
          (dish) => !dish.contains.some((a) => leaveOut.includes(a)),
        )
        return (
          <section
            key={course.title}
            className="grid gap-x-line gap-y-snug sm:grid-cols-[9rem_minmax(0,34rem)]"
            aria-label={course.title}
          >
            <div className="flex items-center gap-snug sm:flex-col sm:items-start">
              <h3 className="label m-0 text-pen-quiet">{course.title}</h3>
              <Drawing
                object={course.object}
                seed={`maaltid-${course.object}`}
                title=""
                className="w-16 sm:w-24"
              />
            </div>
            <ul className="m-0 grid list-none content-start gap-y-snug p-0">
              {dishes.map((dish) => (
                <li key={dish.name}>
                  <DishLine dish={dish} course={course} brief={brief} />
                </li>
              ))}
              {dishes.length === 0 && (
                <li className="max-w-measure text-pen-quiet">
                  Nothing here tonight without{" "}
                  {leaveOut
                    .filter((a) => all.some((d) => d.contains.includes(a)))
                    .join(" or ")}
                  . Ask when you book: the kitchen can often make one.
                </li>
              )}
            </ul>
          </section>
        )
      })}
    </div>
  )
}

function DishLine({
  dish,
  course,
  brief,
}: {
  dish: Dish
  course: Course
  brief: boolean
}) {
  const name = "font-read text-lead leading-subhead"
  return (
    <>
      <p className="m-0">
        {brief ? (
          <span className={name}>{dish.name}</span>
        ) : (
          <DishDialog dish={dish} course={course} className={name} />
        )}{" "}
        <span className="font-type text-small whitespace-nowrap text-pen-quiet">
          {dish.price}
        </span>
        {dish.diet === "vegan" && (
          <Badge variant="outline" className="ms-tight align-[0.15em]">
            {DIET[dish.diet]}
          </Badge>
        )}
      </p>
      <p className="m-0 text-pen-quiet">{dish.with}</p>
      {!brief && dish.aside && (
        <HandNote point="up" seed={`maaltid-${dish.name}`}>
          {dish.aside}
        </HandNote>
      )}
    </>
  )
}

function DishDialog({
  dish,
  course,
  className,
}: {
  dish: Dish
  course: Course
  className: string
}) {
  const object = dish.object ?? course.object
  return (
    <Dialog>
      <DialogTrigger
        className={`${className} cursor-pointer border-0 bg-transparent p-0 text-left text-pen underline decoration-pen/45 decoration-1 underline-offset-[0.2em] hover:decoration-pen`}
      >
        {dish.name}
      </DialogTrigger>
      <DialogContent>
        <Drawing
          object={object}
          seed={`maaltid-dish-${dish.name}`}
          title=""
          className="mx-auto w-48"
        />
        <DialogHeader>
          <p className="label m-0 text-pen-quiet">{course.title}</p>
          <DialogTitle>
            {dish.name}{" "}
            <span className="font-type text-small whitespace-nowrap text-pen-quiet">
              {kr(dish.price)}
            </span>
          </DialogTitle>
          <DialogDescription>{dish.with}</DialogDescription>
        </DialogHeader>
        <p className="m-0">{dish.story}</p>
        <p className="m-0 text-pen-quiet">
          {dish.contains.length
            ? `Has ${dish.contains.join(" and ")} in it.`
            : "No gluten, dairy, fish or nuts."}
          {dish.diet && ` ${DIET[dish.diet]}.`}
        </p>
      </DialogContent>
    </Dialog>
  )
}
