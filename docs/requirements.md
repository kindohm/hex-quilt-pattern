# Hex Quilt Pattern Requirements

## Shape structure

- The overall shape is a six-sided hexagon.
- Six major triangular sectors meet at the hexagon's center.
- Each major triangle contains five pieces: one inner triangle and four outer quadrilaterals.
- The complete pattern contains 30 pieces.
- The internal arrangement repeats around the center, forming the pinwheel shown in the reference image.

## Sector labels

The six major triangles are labeled **A through F**, starting at the 12 o'clock boundary and proceeding clockwise. Sector A is immediately clockwise of that boundary.

| Sector | Position |
| --- | --- |
| A | Upper right |
| B | Right |
| C | Lower right |
| D | Lower left |
| E | Left |
| F | Upper left |

The line from the center to the top vertex at 12 o'clock is the boundary between sectors F and A.

## Piece identifiers

- Each of the five pieces within a sector receives a number from **1 through 5**.
- A piece's unique identifier combines its sector letter and piece number, with no separator: for example, **A1**, **A2**, or **F5**.
- The complete set of identifiers is **A1–A5, B1–B5, C1–C5, D1–D5, E1–E5, and F1–F5**.
- In this numbering scheme, “pieces within a sector” includes both the inner triangle and the four outer pieces.
- Piece numbering proceeds **left to right along the sector's top long outer edge**, viewing the sector with that edge at the top and its center-pointing vertex below. Apply this local orientation consistently to all six sectors.

- The four outer pieces are numbered **1–4 from left to right** along that edge.
- The inner triangle is always **piece 5**: A5, B5, C5, D5, E5, or F5.

## Reference and initial artwork

- The supplied photograph is the visual reference for the structure.
- The initial clean reconstruction is available in `assets/hex-quilt.svg` and `assets/hex-quilt.png`.
- The reconstruction regularizes the hexagon and repeats the internal geometry symmetrically; its proportions approximate the hand drawing rather than specifying exact measurements.
- The initial SVG and geometry JSON use preliminary numeric sector and piece IDs. Those IDs do not yet implement the A–F naming convention defined here.
- Handwritten notes in the photograph are reference content, not established requirements.

## Interactive planner

- Build a standalone web page; p5.js is optional and not required.
- Display the quilt as crisp SVG geometry using the A–F and 1–5 identifiers defined above.
- All six inner triangles (piece 5) are always gray and excluded from color distribution.
- Accept a whole-number color count from 4 through 24.
- Generate lighter and darker shades from a user-selected starting color. Each numbered color has an editable swatch, used as a rough preview of already chosen fabrics.
- Generating shades replaces the palette but preserves piece assignments. Changing the color count creates a matching palette and arrangement.
- Randomize changes the placement of color IDs while preserving the current palette.
- Distribute colors across the 24 outer pieces as evenly as possible: usage counts may differ by at most one. Every requested color is used.
- Adjacent means sharing an edge of positive length, including partial shared edges across sector boundaries. Corner contact does not count.
- Adjacent outer pieces must never share a color ID. Different IDs may have visually similar or identical swatches.
- Outer-piece adjacency forms a ring: A1–A2–A3–A4–B1–…–F4–A1.
- Use randomized placement with backtracking and validate the result before displaying it; full-layout rejection sampling is not required.
- A color ID cannot appear more than once within the same sector, even on nonadjacent pieces. Each sector therefore needs four distinct colors, making 4 the minimum available count.
- When loading older saved arrangements, preserve the palette and preferences and regenerate assignments that violate the new rule. Upgrade counts below 4 to 4.
- Show piece and color IDs on the drawing, for example `A1 · C3`, with a toggle to hide labels. The legend names color IDs explicitly as “Color 3.”
- Organize the cutting table by color: one row per color with its swatch, quantity, and all matching piece IDs ordered by sector and piece. Include a Gray row for A5–F5.
- Copy Table uses the same color grouping, including color ID, hex value, quantity, and piece IDs.
- Provide a Copy Table action that includes the assignments and legend for notes or spreadsheets.
- Remember the current arrangement, palette, starting color, count, and label preference locally in the same browser.
- Make the page usable on desktop and mobile and with keyboard controls.

The planner generates labeled geometry directly; the original reference artwork retains its preliminary IDs.
