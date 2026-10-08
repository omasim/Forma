# FORMA v6.0.0 — rules for writing markup

FORMA is a CSS design system with an optional JS behaviour layer. Follow these rules when generating UI.

1. **Use only FORMA classes that exist.** Look them up (llms-full.txt, forma-spec.json, or the MCP tool `get_component`). Never invent classes such as `btn-blue` or `card-shadow`.
2. **Never hard-code colors, fonts, radii or spacing.** Use tokens: `var(--accent)`, `var(--text-secondary)`, `var(--space-4)`, `var(--radius-lg)`.
3. **Native elements first.** Modals are `<dialog class="dialog">` opened with `data-forma-open="id"`; menus and popovers use the `popover` attribute + `popovertarget`; accordions are `<details class="disclosure">`; checkboxes are `<input type="checkbox" class="checkbox">`.
4. **State lives in ARIA attributes, not classes:** `aria-selected`, `aria-pressed`, `aria-current="page"`, `aria-invalid="true"`, `aria-expanded`. Tabs need `role="tablist"/"tab"/"tabpanel"` and `data-forma="tabs"` on the wrapper.
5. **Every control needs a name:** `<label for>` for inputs; `aria-label` for icon-only buttons; `alt` for images.
6. **Icons:** `<svg class="fi" aria-hidden="true"><use href="forma-icons.svg#fi-NAME"/></svg>`.
7. **Modes and themes:** `data-mode="light|dark"` (omit to follow the OS) and `data-theme="<id>"` after loading `themes/<id>.css`. Never use `data-theme="dark"` — that was v5.
8. **Layout:** `.container`, `.stack`, `.cluster`, `.split`, `.grid` (`--min`), `.grid-2/3/4`, `.dash` + `.span-N`; gaps via `.gap-N` or `--gap`.
9. **Charts:** `<figure class="chart" data-forma="chart" data-type="line|area|bar|donut" data-labels="…" data-series='[{"name":"A","values":[…]}]'>` with a `.chart-canvas` child. Never two y-axes.
10. **Validate before you finish:** run `npx @nage/forma lint file.html` or the MCP tool `validate_html`.

Components: 126 · Themes: 59 · Docs: https://forma-design-five.vercel.app/llms-full.txt
