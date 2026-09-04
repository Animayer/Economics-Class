# Constitution Board

Projector-ready classroom simulation for **Battery Creek High School** (South Carolina) U.S. History / Government: the three branches, checks and balances, and Amendments I–X.

No login. No backend. Teacher drives it with a mouse, touch, or keyboard; students read it from the back row.

## Run locally

```bash
cd constitution-sim
npm install
npm run dev
```

Open the printed `http://localhost:5173` URL. Full-screen the browser on the board (`F11`).

Production-style static build:

```bash
npm run build
npm run preview
```

`npm run build` writes a static site to `dist/`. Paths are relative (`base: './'`), so the folder can live in a subpath.

```bash
npm test
```

## How GitHub Pages serves it

This repo already publishes **inflation-sim at the Pages root**:

`https://animayer.github.io/Economics-Class/`

This app is a **sibling folder on the same site**, so the inflation URL does not move:

`https://animayer.github.io/Economics-Class/constitution-sim/`

The workflow [`.github/workflows/pages.yml`](../.github/workflows/pages.yml) builds both apps, copies `inflation-sim/dist` to the site root, copies `constitution-sim/dist` to `constitution-sim/`, and publishes the assembled folder to the `gh-pages` branch (the current Pages source).

Locally you can still share `constitution-sim/dist` on a thumb drive or classroom folder; relative paths keep assets working.

## On the board (teacher)

1. Open the class URL full-screen.
2. Stay on **Branches** to walk Legislative / Executive / Judicial. Tap a branch for who they are, main powers, and how they check the others. Tap a **check** (veto, 2/3 override, advise & consent, judicial review, impeachment, purse, war powers, treaties) to light the connection.
3. Switch to **Bill of Rights** for a 10-card grid. Tap a card — or press `1`–`9` and `0` for X — for plain-English gist, classroom examples, and why it mattered. Amendment I lists speech, press, religion, assembly, and petition.
4. Use **Scenarios** as a live quiz (12 items). Space advances. Score is for energy, not a grade.
5. Deep links if you want a cold open:
   - `?mode=branches`
   - `?mode=rights`
   - `?mode=rights&amendment=1`
   - `?mode=scenarios`
   - `?mode=scenarios&scenario=4`
   - `?mode=branches&check=veto`

Keyboard: **B** branches, **R** rights, **S** scenarios, **Space** next scenario, **Esc** close a panel.

This is a civics teaching board, not legal advice. School-speech items use a Tinker-level frame (students do not shed rights at the schoolhouse gate; schools may limit substantial disruption).

## What’s on the screen

- **Branches:** Article I Congress (House + Senate), Article II President + Cabinet, Article III Supreme Court and federal courts; major checks at high-school depth
- **Bill of Rights:** Amendments I–X only
- **Scenarios:** mix of rights (speech at school, search, due process, counsel, cruel punishment, quartering, reserved powers) and checks (override, judicial review, impeachment, declare war)

## Project layout

```
constitution-sim/
  src/lib/content.ts   # branches, checks, amendments, scenarios
  src/lib/routing.ts   # query-string deep links
  src/components/      # board views
  src/test/            # content + URL tests
```
