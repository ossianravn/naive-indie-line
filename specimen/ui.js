// The interface sampler: a booking form, states, records, a ledger, a dialog and an empty shelf, in the proposed
// treatment. Elements marked data-mark get their pen strokes from specimen.js.
;(function (NIL) {
  "use strict"

  const radio = (name, value, label, checked = false) =>
    `<label class="radio"><input type="radio" name="${name}" value="${value}"${checked ? " checked" : ""}><span class="disc"><span data-mark="ring-sm"></span><span class="dot" data-mark="dot"></span></span>${label}</label>`

  const option = (name, label, checked = false) =>
    `<label><input class="visually-hidden" type="radio" name="${name}"${checked ? " checked" : ""}><i class="ink-fill"></i>${label}</label>`

  const booking = `
  <article class="card frame span-2" data-seed="booking">
    <h3>Book a listening session</h3>
    <div class="form-grid">
      <div class="form-row"><label class="label" for="f-name">Your name</label>
        <span class="field frame w-name"><input id="f-name" autocomplete="off" placeholder="e.g. Maya Singh"></span></div>
      <div class="form-row"><label class="label" for="f-date">Date</label>
        <span class="field frame w-date"><select id="f-date"><option>Thu 6 Nov</option><option>Thu 13 Nov</option><option>Thu 20 Nov</option></select><span class="chev" data-mark="chevron"></span></span></div>
      <div class="form-row"><span class="label" id="f-size">Group size</span>
        <div class="segmented frame" role="radiogroup" aria-labelledby="f-size">${option("size", "1–2", true)}${option("size", "3–4")}${option("size", "5+")}</div></div>
    </div>
    <div class="toggles">
      <label class="check"><input type="checkbox" checked><span class="box frame"><span class="tick" data-mark="tick"></span></span>I’m visiting the shop</label>
      <label class="switch"><input type="checkbox" role="switch" checked><span class="track"><span data-mark="pill"></span><span class="knob"><span data-mark="ring-sm"></span><span class="dot" data-mark="dot"></span></span></span>Bring your own records</label>
    </div>
    <div class="actions">
      <button class="btn solid" type="button"><i class="ink-fill"></i>Book session</button>
      <button class="btn frame" type="button">See availability</button>
    </div>
    <p class="hand aside"><span class="arrow" data-mark="arrow"></span>only one button gets the ink</p>
  </article>`

  const states = `
  <article class="card frame" data-seed="states">
    <h3>States</h3>
    <div class="form-row"><label class="label" for="f-email">Email</label>
      <span class="field frame invalid w-name"><input id="f-email" value="maya@" aria-invalid="true" aria-describedby="e-email"></span>
      <p class="error" id="e-email">That address is missing the part after the @.</p></div>
    <div class="form-row"><span class="label" id="f-side">Play</span>
      <div class="radios" role="radiogroup" aria-labelledby="f-side">${radio("side", "a", "Side A", true)}${radio("side", "b", "Side B")}</div></div>
    <div class="form-row"><label class="label" for="f-vol">Volume</label>
      <span class="slider"><span class="track" data-mark="underline"></span><input id="f-vol" type="range" value="60"></span></div>
    <div class="actions"><button class="btn frame sm" type="button" disabled>Sold out</button><button class="btn frame sm correction" type="button" data-open="remove-dialog">Remove</button></div>
    <dialog class="sheet-dialog dialog frame lifted" id="remove-dialog" aria-labelledby="rd-title" data-seed="remove-dialog">
      <h3 id="rd-title">Take it off the shelf?</h3>
      <p>Pétillant Naturel leaves the shop's list. Anyone who booked a listening of it keeps their seat.</p>
      <div class="actions"><button class="btn frame sm" type="button" data-close autofocus>Keep it</button><button class="btn frame sm correction" type="button" data-close>Remove</button></div>
    </dialog>
  </article>`

  const records = `
  <article class="card frame" data-seed="records">
    <div class="tabs" role="tablist" aria-label="Shop">
      <button class="tab" role="tab" aria-selected="true">Records<span class="uline" data-mark="underline"></span></button>
      <button class="tab" role="tab" aria-selected="false">Bookings<span class="uline" data-mark="underline"></span></button>
      <button class="tab" role="tab" aria-selected="false">Notes<span class="uline" data-mark="underline"></span></button>
    </div>
    <ul class="records">
      <li><span>Pétillant Naturel</span><span class="circled">New<span data-mark="ring"></span></span></li>
      <li><span>Side Streets, Vol. 2</span><span class="badge"><i class="ink-fill"></i>Sold out</span></li>
      <li><span>Quiet Hours</span><span class="meta">33⅓ · 1979</span></li>
    </ul>
    <div class="avatars" aria-label="Regulars">
      <span class="avatar" title="Maya Singh"><span data-mark="ring-avatar"></span>MS</span>
      <span class="avatar" title="Jordan Lee"><span class="face" data-mark="avatar-portrait"></span><span data-mark="ring-avatar"></span></span>
      <span class="avatar" title="Sam Rivera"><span class="face" data-mark="avatar-portrait"></span><span data-mark="ring-avatar"></span></span>
    </div>
  </article>`

  const ledger = `
  <article class="card frame" data-seed="ledger">
    <h3>Upcoming sessions</h3>
    <table class="ledger">
      <thead><tr><th>Date</th><th>Name</th><th class="num">Group</th></tr></thead>
      <tbody>
        <tr><td>Thu 6 Nov, 19:00</td><td>Maya Singh</td><td class="num">2</td></tr>
        <tr><td>Thu 6 Nov, 20:30</td><td>Jordan Lee</td><td class="num">4</td></tr>
        <tr><td>Thu 13 Nov, 19:00</td><td>Sam Rivera</td><td class="num">1</td></tr>
      </tbody>
    </table>
  </article>`

  const dialog = `
  <article class="card plain" data-seed="dialog-demo">
    <div class="dialog frame lifted" role="group" aria-labelledby="d-title" data-seed="dialog">
      <h3 id="d-title">Cancel this booking?</h3>
      <p>Maya’s seat on Thursday goes back on the list, and we’ll let her know.</p>
      <div class="actions"><button class="btn frame sm" type="button">Keep it</button><button class="btn frame sm correction" type="button">Cancel booking</button></div>
    </div>
  </article>`

  const empty = `
  <article class="card frame empty" data-seed="empty">
    <span class="empty-art" data-mark="empty-crate"></span>
    <h3>No records on the shelf yet</h3>
    <p>Add the first one and it will show up here, spine out.</p>
    <button class="btn frame" type="button">Add a record</button>
  </article>`

  NIL.ui = { html: () => booking + states + records + ledger + dialog + empty }
})((window.NIL = window.NIL || {}))
