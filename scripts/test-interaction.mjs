// Behaviour tests that axe cannot do: keyboard patterns, RTL, forced colors and the
// light-dark() fallback. Called from scripts/test.mjs with a running browser + server.

const P = '.preview ';

export async function runInteractionTests({ browser, base, ok }) {
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 900 }, reducedMotion: 'reduce' });
  const page = await ctx.newPage();
  const go = async (p, { dir } = {}) => {
    await page.goto(base + p, { waitUntil: 'load' });
    if (dir) await page.evaluate((d) => { document.documentElement.dir = d; }, dir);
  };
  const active = () => page.evaluate(() => {
    const a = document.activeElement;
    return { text: a?.textContent.trim().slice(0, 40), role: a?.getAttribute('role'), id: a?.id, tag: a?.tagName };
  });
  const attempt = async (name, fn) => {
    try { await fn(); } catch (e) { ok(name, false, e.message.split('\n')[0]); }
  };

  /* ── Tabs: arrows, Home/End, wrap, panels follow ─────────────────────── */
  await attempt('keyboard: tabs', async () => {
    await go('components/tabs.html');
    const tabs = page.locator(`${P}[data-forma~="tabs"]`).first().locator('[role="tab"]');
    const n = await tabs.count();
    await tabs.first().focus();
    await page.keyboard.press('ArrowRight');
    const second = await tabs.nth(1).getAttribute('aria-selected');
    await page.keyboard.press('End');
    const last = await tabs.nth(n - 1).getAttribute('aria-selected');
    await page.keyboard.press('ArrowRight');
    const wrapped = await tabs.first().getAttribute('aria-selected');
    const panelsOk = await page.locator(`${P}[data-forma~="tabs"]`).first().evaluate((root) =>
      [...root.querySelectorAll(':scope > [role="tabpanel"]')].filter((p) => !p.hidden).length === 1);
    ok('keyboard: tabs (→, End, wrap, one panel visible)', second === 'true' && last === 'true' && wrapped === 'true' && panelsOk, `${second}/${last}/${wrapped}/${panelsOk}`);

    await go('components/tabs.html', { dir: 'rtl' });
    await tabs.first().focus();
    await page.keyboard.press('ArrowLeft');
    ok('keyboard: tabs in RTL (← moves forward)', (await tabs.nth(1).getAttribute('aria-selected')) === 'true');
  });

  /* ── Menu: opens on invoker, focuses first item, arrows, Escape returns focus ─ */
  await attempt('keyboard: menu', async () => {
    await go('components/menu.html');
    const inv = page.locator(`${P}[popovertarget]`).first();
    await inv.focus(); await page.keyboard.press('Enter'); await page.waitForTimeout(100);
    const a1 = await active();
    await page.keyboard.press('ArrowDown');
    const a2 = await active();
    await page.keyboard.press('Escape'); await page.waitForTimeout(100);
    const back = await page.evaluate(() => document.activeElement?.hasAttribute('popovertarget'));
    ok('keyboard: menu (opens to first item, ↓ moves, Esc returns focus)', /^menuitem/.test(a1.role || '') && a2.text !== a1.text && back, `${a1.text} → ${a2.text}, back=${back}`);
  });

  /* ── Combobox: typing filters, ↓ highlights, Enter commits ───────────── */
  await attempt('keyboard: combobox', async () => {
    await go('components/combobox.html');
    const input = page.locator(`${P}[role="combobox"]`).first();
    await input.click();
    await input.fill('');
    await page.keyboard.press('ArrowDown');
    const expanded = await input.getAttribute('aria-expanded');
    const activeId = await input.getAttribute('aria-activedescendant');
    const before = await page.locator(`#${activeId}`).getAttribute('aria-selected');
    await page.keyboard.press('Enter');
    const after = await page.locator(`#${activeId}`).getAttribute('aria-selected');
    ok('keyboard: combobox (↓ opens + highlights, Enter toggles selection)', expanded === 'true' && !!activeId && before !== after, `expanded=${expanded} active=${activeId} ${before}→${after}`);
  });

  /* ── Tree: → expands, ↓ moves, ← collapses ───────────────────────────── */
  await attempt('keyboard: tree', async () => {
    await go('components/tree.html');
    const item = page.locator(`${P}[role="treeitem"][aria-expanded]`).first();
    await item.evaluate((i) => i.setAttribute('aria-expanded', 'false'));
    await item.focus();
    await page.keyboard.press('ArrowRight');
    const opened = await item.getAttribute('aria-expanded');
    await page.keyboard.press('ArrowLeft');
    const closed = await item.getAttribute('aria-expanded');
    await page.keyboard.press('ArrowDown');
    const moved = await page.evaluate(() => document.activeElement?.getAttribute('role'));
    ok('keyboard: tree (→ expands, ← collapses, ↓ moves)', opened === 'true' && closed === 'false' && moved === 'treeitem', `${opened}/${closed}/${moved}`);
  });

  /* ── Date picker grid: arrows move by day/week ───────────────────────── */
  await attempt('keyboard: datepicker', async () => {
    await go('components/datepicker.html');
    const grid = page.locator(`${P}[role="grid"]`).first();
    const cell = grid.locator('button[tabindex="0"]').first();
    await cell.focus();
    const d0 = await page.evaluate(() => document.activeElement?.dataset.date);
    await page.keyboard.press('ArrowRight');
    const d1 = await page.evaluate(() => document.activeElement?.dataset.date);
    await page.keyboard.press('ArrowDown');
    const d2 = await page.evaluate(() => document.activeElement?.dataset.date);
    const day = (s) => new Date(s + 'T00:00:00').getTime() / 864e5;
    ok('keyboard: date picker (→ +1 day, ↓ +7 days)', d0 && day(d1) - day(d0) === 1 && day(d2) - day(d1) === 7, `${d0} → ${d1} → ${d2}`);
  });

  /* ── Kanban: Space lifts, → moves column, Space drops ────────────────── */
  await attempt('keyboard: kanban', async () => {
    await go('components/kanban.html');
    const card = page.locator(`${P}.kanban-card`).first();
    const from = await card.evaluate((c) => c.closest('.kanban-col').getAttribute('aria-label'));
    const title = await card.locator('.kanban-card-title').textContent();
    await card.focus();
    await page.keyboard.press('Space'); await page.keyboard.press('ArrowRight'); await page.keyboard.press('Space');
    const to = await page.locator(`${P}.kanban-card`, { hasText: title }).first().evaluate((c) => c.closest('.kanban-col').getAttribute('aria-label'));
    ok('keyboard: kanban (Space, →, Space moves a card)', from !== to, `${from} → ${to}`);
  });

  /* ── Dialog: opens, traps (native), Esc closes, focus returns ────────── */
  await attempt('keyboard: dialog', async () => {
    await go('components/dialog.html');
    const opener = page.locator(`${P}[data-forma-open]`).first();
    await opener.focus(); await page.keyboard.press('Enter'); await page.waitForTimeout(100);
    const open = await page.evaluate(() => !!document.querySelector('.preview dialog[open]'));
    await page.keyboard.press('Escape'); await page.waitForTimeout(100);
    const back = await page.evaluate(() => document.activeElement?.hasAttribute('data-forma-open'));
    ok('keyboard: dialog (opens, Esc closes, focus returns)', open && back, `open=${open} back=${back}`);
  });

  /* ── RTL: code stays LTR, menu aligns to the invoker's inline-start ──── */
  await attempt('rtl', async () => {
    await go('components/menu.html', { dir: 'rtl' });
    const dirs = await page.evaluate(() => [...document.querySelectorAll('code, kbd, .menu-shortcut')].slice(0, 20).map((e) => getComputedStyle(e).direction));
    ok('rtl: code, kbd and shortcuts stay left-to-right', dirs.length > 0 && dirs.every((d) => d === 'ltr'), dirs.join(','));
    const inv = page.locator(`${P}[popovertarget]`).first();
    await inv.focus(); await page.keyboard.press('Enter'); await page.waitForTimeout(150);
    const edge = await inv.evaluate((b) => {
      const m = document.getElementById(b.getAttribute('popovertarget'));
      const a = b.getBoundingClientRect(), r = m.getBoundingClientRect();
      return Math.abs(a.right - r.right);
    });
    ok('rtl: menu opens aligned to the invoker’s right edge', edge <= 1, `${edge}px off`);
    await page.keyboard.press('Escape');
    await go('components/switch.html', { dir: 'rtl' });
    await page.waitForFunction(() => getComputedStyle(document.querySelector('.preview .switch:checked'), '::before').translate.startsWith('-'), null, { timeout: 1500 }).catch(() => {});
    const thumb = await page.locator(`${P}.switch:checked`).first().evaluate((s) => ({ translate: getComputedStyle(s, '::before').translate }));
    ok('rtl: checked switch thumb moves to the left', thumb.translate.startsWith('-'), thumb.translate);
  });

  await ctx.close();

  /* ── Forced colors: state stays visible ──────────────────────────────── */
  await attempt('forced-colors', async () => {
    const fc = await browser.newContext({ viewport: { width: 1280, height: 900 }, forcedColors: 'active' });
    const pg = await fc.newPage();
    await pg.goto(base + 'components/switch.html', { waitUntil: 'load' });
    const sw = await pg.evaluate(() => {
      const on = document.querySelector('.preview .switch:checked'), off = document.querySelector('.preview .switch:not(:checked)');
      const bg = (el, pseudo) => getComputedStyle(el, pseudo).backgroundColor;
      return { onTrack: bg(on), onThumb: bg(on, '::before'), offTrack: bg(off), offThumb: bg(off, '::before') };
    });
    ok('forced colors: switch thumb differs from its track (on and off)', sw.onTrack !== sw.onThumb && sw.offTrack !== sw.offThumb && sw.onTrack !== sw.offTrack, JSON.stringify(sw));
    await pg.goto(base + 'components/checkbox.html', { waitUntil: 'load' });
    const cb = await pg.evaluate(() => {
      const on = document.querySelector('.preview .checkbox:checked');
      return { box: getComputedStyle(on).backgroundColor, mark: getComputedStyle(on, '::before').backgroundColor };
    });
    ok('forced colors: checkmark visible on its box', cb.box !== cb.mark, JSON.stringify(cb));
    await pg.goto(base + 'components/tabs.html', { waitUntil: 'load' });
    const sel = await pg.locator(`${P}[role="tab"][aria-selected="true"]`).first().evaluate((t) => getComputedStyle(t).outlineStyle);
    ok('forced colors: selected tab is outlined', sel === 'solid', sel);
    await fc.close();
  });

  /* ── light-dark() fallback for older browsers ────────────────────────── */
  await attempt('legacy', async () => {
    const lc = await browser.newContext({ viewport: { width: 1000, height: 700 } });
    const pg = await lc.newPage();
    await pg.goto(base + 'components/card.html', { waitUntil: 'load' });
    // Simulate a browser without light-dark(): drop those values, enable the @supports-not block.
    await pg.evaluate(async () => {
      for (const l of [...document.querySelectorAll('link[rel=stylesheet]')]) {
        const css = await (await fetch(l.href)).text();
        const s = document.createElement('style');
        s.textContent = css.replace(/@supports not \(color: ?light-dark\(#000, ?#fff\)\)/g, '@supports (display: block)').replace(/light-dark\(/g, 'unsupported(');
        l.replaceWith(s);
      }
    });
    const read = () => pg.evaluate(() => ({ bg: getComputedStyle(document.body).backgroundColor, fg: getComputedStyle(document.body).color }));
    const light = await read();
    await pg.evaluate(() => { document.documentElement.dataset.mode = 'dark'; });
    const dark = await read();
    const lum = (c) => { const [r, g, b] = c.match(/\d+/g).map(Number); return 0.2126 * r + 0.7152 * g + 0.0722 * b; };
    ok('legacy browsers: tokens resolve without light-dark() (light + dark)', lum(light.bg) > 200 && lum(light.fg) < 80 && lum(dark.bg) < 40 && lum(dark.fg) > 180, `${JSON.stringify(light)} ${JSON.stringify(dark)}`);
    await lc.close();
  });
}
