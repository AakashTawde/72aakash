# Cafe Entry

A simple browser-based cafe entry form. Add entries, save them locally, and
export to Excel in the exact format used by the cafe register (yellow header,
red text, bordered grid).

## Files

- `index.html` — the form + entries table
- `style.css` — styling
- `app.js` — save / edit / delete / export logic (uses [SheetJS](https://sheetjs.com/) via CDN)

## How to use

1. Open `index.html` in any browser (double-click it, no server needed).
2. Fill the form and click **Save Entry**. Entries appear in the table below
   and persist in the browser (localStorage).
3. Edit/delete any row using the action buttons.
4. Click **Print / Export Excel** in the header to download an `.xlsx` file
   matching the cafe register format.

## Excel output columns

`NAME | DATE | DOB | KYC.Doc | PC/PS - 5 | PC/PS no. | TIME | IN | OUT | HOURS | CASH | GPAY | CONTACT NO.`

- `DATE` / `DOB` are written as `DD-MM-YYYY`
- `TIME` is the in–out range, e.g. `11:30AM - 12:40PM`
- `IN` is the computed duration in `HH:MM`
- `HOURS` is the plan tag you enter (e.g. `1 HOUR`, `2 HOUR`)

## Notes

- Data is stored in your browser only. Clearing browser data wipes entries.
- To start fresh, use the **Clear All** button in the header.
