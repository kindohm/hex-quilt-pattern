# Hex quilt color planner

With Node.js and npm installed, serve this directory:

```sh
npm start
```

Then visit http://127.0.0.1:5173. `npm run dev` runs the same command.

The server runs through `npx`, so no project dependencies or build step are required. The first run needs internet access to download the pinned server package into npm's cache. Browser caching is disabled; refresh the page after editing files. Stop the server with Ctrl+C.

You can also open `index.html` directly in a browser.

Choose 4–24 fabric colors, generate shades from a starting color, and edit individual swatches. Randomize balances all 24 outer pieces without equal color IDs sharing an edge. Each sector uses four distinct color IDs. Copy the assignment table and palette for your cutting plan. The six inner triangles remain gray.

The page saves its state in browser local storage when available. A different browser or origin has separate saved state. Clipboard access has a manual-copy fallback.

Run the geometry and coloring checks with:

```sh
npm test
```

See `docs/requirements.md` for the agreed rules. The initial SVG and PNG in `assets/` are reference artwork; the interactive page uses the confirmed piece IDs.
