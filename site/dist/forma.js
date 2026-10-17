/*! FORMA v6.0.1 | MIT | https://forma-design-five.vercel.app */
var Forma = (() => {
  var __defProp = Object.defineProperty;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __export = (target, all) => {
    for (var name in all)
      __defProp(target, name, { get: all[name], enumerable: true });
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

  // src/js/index.js
  var index_exports = {};
  __export(index_exports, {
    announce: () => announce,
    calendar: () => calendar,
    chart: () => chart,
    chat: () => chat,
    combobox: () => combobox,
    command: () => command,
    confirm: () => confirm,
    copy: () => copy,
    datepicker: () => datepicker,
    define: () => define,
    dialog: () => dialog,
    formatBytes: () => formatBytes,
    init: () => init,
    kanban: () => kanban,
    menu: () => menu,
    mode: () => mode,
    position: () => position,
    sparkline: () => sparkline,
    table: () => table,
    tabs: () => tabs,
    theme: () => theme,
    toast: () => toast,
    toc: () => toc,
    tooltip: () => tooltip,
    tree: () => tree,
    validate: () => validate,
    version: () => version,
    wizard: () => wizard
  });

  // src/js/util.js
  var $ = (sel, root = document) => root.querySelector(sel);
  var $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));
  var n = 0;
  var uid = (p = "f") => `${p}-${(++n).toString(36)}-${Math.random().toString(36).slice(2, 6)}`;
  var ensureId = (el, p) => el.id ||= uid(p);
  var emit = (el, name, detail) => el.dispatchEvent(new CustomEvent(`forma:${name}`, { bubbles: true, detail }));
  var isRTL = (el) => getComputedStyle(el).direction === "rtl";
  var storage = {
    get(k) {
      try {
        return localStorage.getItem(k);
      } catch {
        return null;
      }
    },
    set(k, v) {
      try {
        v == null ? localStorage.removeItem(k) : localStorage.setItem(k, v);
      } catch {
      }
    }
  };
  var regions;
  function announce(text, politeness = "polite") {
    if (!regions) {
      regions = {};
      for (const p of ["polite", "assertive"]) {
        const r2 = document.createElement("div");
        r2.className = "sr-only";
        r2.setAttribute("aria-live", p);
        r2.setAttribute("aria-atomic", "true");
        document.body.append(r2);
        regions[p] = r2;
      }
    }
    const r = regions[politeness] || regions.polite;
    r.textContent = "";
    setTimeout(() => {
      r.textContent = text;
    }, 30);
  }
  function formatBytes(bytes, locale) {
    if (!Number.isFinite(bytes)) return "";
    const u = ["B", "KB", "MB", "GB", "TB"];
    let i = 0;
    let v = bytes;
    while (v >= 1024 && i < u.length - 1) {
      v /= 1024;
      i++;
    }
    return `${new Intl.NumberFormat(locale, { maximumFractionDigits: i ? 1 : 0 }).format(v)} ${u[i]}`;
  }
  function h(tag, props = {}, ...children) {
    const el = document.createElementNS(tag.startsWith("svg:") ? "http://www.w3.org/2000/svg" : "http://www.w3.org/1999/xhtml", tag.replace("svg:", ""));
    for (const [k, v] of Object.entries(props)) {
      if (v == null || v === false) continue;
      if (k === "text") el.textContent = v;
      else if (k === "class") el.setAttribute("class", v);
      else if (k === "style" && typeof v === "object") Object.assign(el.style, v);
      else if (k.startsWith("on") && typeof v === "function") el.addEventListener(k.slice(2), v);
      else el.setAttribute(k, v === true ? "" : v);
    }
    for (const c of children.flat()) if (c != null) el.append(c instanceof Node ? c : document.createTextNode(String(c)));
    return el;
  }
  function icon(name, cls = "") {
    const svg = h("svg:svg", { class: `fi ${cls}`.trim(), "aria-hidden": "true" });
    svg.append(h("svg:use", { href: `${iconBase()}#fi-${name}` }));
    return svg;
  }
  var base;
  function iconBase() {
    if (base !== void 0) return base;
    if (document.getElementById("forma-icons")) return base = "";
    const link = document.querySelector('link[href*="forma"][href$=".css"]');
    base = link ? new URL("forma-icons.svg", link.href).href : "";
    return base;
  }
  function roving(container, itemsFn, { orientation = "both", loop = true, onMove, typeahead = false } = {}) {
    let buffer = "", timer;
    container.addEventListener("keydown", (e) => {
      const items = itemsFn().filter((i) => !i.hasAttribute("disabled") && i.getAttribute("aria-disabled") !== "true");
      const idx = items.indexOf(document.activeElement);
      if (idx < 0) return;
      const rtl = isRTL(container);
      const next = {
        ArrowDown: orientation !== "horizontal" ? 1 : 0,
        ArrowUp: orientation !== "horizontal" ? -1 : 0,
        ArrowRight: orientation !== "vertical" ? rtl ? -1 : 1 : 0,
        ArrowLeft: orientation !== "vertical" ? rtl ? 1 : -1 : 0
      }[e.key];
      let target;
      if (next) {
        target = items[loop ? (idx + next + items.length) % items.length : Math.min(items.length - 1, Math.max(0, idx + next))];
      } else if (e.key === "Home") target = items[0];
      else if (e.key === "End") target = items[items.length - 1];
      else if (typeahead && e.key.length === 1 && !e.metaKey && !e.ctrlKey) {
        clearTimeout(timer);
        buffer += e.key.toLowerCase();
        timer = setTimeout(() => {
          buffer = "";
        }, 500);
        target = items.slice(idx + 1).concat(items.slice(0, idx + 1)).find((i) => i.textContent.trim().toLowerCase().startsWith(buffer));
      }
      if (target) {
        e.preventDefault();
        items.forEach((i) => i.setAttribute("tabindex", i === target ? "0" : "-1"));
        target.focus();
        onMove?.(target, e);
      }
    });
  }

  // src/js/core.js
  var registry = /* @__PURE__ */ new Map();
  var done = /* @__PURE__ */ new WeakMap();
  function define(name, init2, selector = `[data-forma~="${name}"]`) {
    registry.set(name, { init: init2, selector });
  }
  function init(root = document) {
    for (const [name, { init: fn, selector }] of registry) {
      const els = root.matches?.(selector) ? [root, ...$$(selector, root)] : $$(selector, root);
      for (const el of els) {
        let s = done.get(el);
        if (!s) done.set(el, s = /* @__PURE__ */ new Set());
        if (s.has(name)) continue;
        s.add(name);
        try {
          fn(el);
        } catch (err) {
          console.error(`[forma] ${name} failed to init`, el, err);
        }
      }
    }
  }
  var observer;
  function observe() {
    if (observer || typeof MutationObserver === "undefined") return;
    let queued = false;
    const pending = /* @__PURE__ */ new Set();
    observer = new MutationObserver((records) => {
      for (const r of records) for (const n2 of r.addedNodes) if (n2.nodeType === 1) pending.add(n2);
      if (queued) return;
      queued = true;
      requestAnimationFrame(() => {
        queued = false;
        for (const n2 of pending) if (n2.isConnected) init(n2);
        pending.clear();
      });
    });
    observer.observe(document.documentElement, { childList: true, subtree: true });
  }
  var MODE_KEY = "forma-mode";
  var mql = typeof matchMedia === "function" ? matchMedia("(prefers-color-scheme: dark)") : null;
  var mode = {
    /** 'light' | 'dark' | 'system' */
    get preference() {
      return storage.get(MODE_KEY) || "system";
    },
    /** The mode actually in effect. */
    get current() {
      const forced = document.documentElement.dataset.mode;
      if (forced === "light" || forced === "dark") return forced;
      return mql?.matches ? "dark" : "light";
    },
    set(value = "system", { persist = true } = {}) {
      const root = document.documentElement;
      if (value === "system") delete root.dataset.mode;
      else root.dataset.mode = value;
      if (persist) storage.set(MODE_KEY, value === "system" ? null : value);
      $$('[data-forma~="mode-toggle"]').forEach(syncToggle);
      emit(root, "mode", { mode: mode.current, preference: value });
      return mode.current;
    },
    toggle() {
      return mode.set(mode.current === "dark" ? "light" : "dark");
    }
  };
  function syncToggle(btn) {
    btn.setAttribute("aria-pressed", String(mode.current === "dark"));
    const label = btn.querySelector("[data-mode-label]");
    if (label) label.textContent = mode.current === "dark" ? btn.dataset.labelDark || "Dark" : btn.dataset.labelLight || "Light";
  }
  mql?.addEventListener?.("change", () => {
    if (mode.preference === "system") {
      $$('[data-forma~="mode-toggle"]').forEach(syncToggle);
      emit(document.documentElement, "mode", { mode: mode.current, preference: "system" });
    }
  });
  function restoreMode() {
    const p = storage.get(MODE_KEY);
    if (p === "light" || p === "dark") document.documentElement.dataset.mode = p;
  }
  define("mode-toggle", (btn) => {
    syncToggle(btn);
    btn.addEventListener("click", () => mode.toggle());
  });
  var THEME_KEY = "forma-theme";
  var theme = {
    get current() {
      const t = document.documentElement.dataset.theme;
      return !t || t === "light" || t === "dark" ? "museum" : t;
    },
    /**
     * Apply a theme by id. If the theme CSS is not loaded yet, a <link> is added,
     * resolved from `base` (default: the folder of the loaded forma.css + "themes/").
     */
    async set(id, { base: base2, persist = true } = {}) {
      const root = document.documentElement;
      if (!id || id === "museum") {
        delete root.dataset.theme;
        if (persist) storage.set(THEME_KEY, null);
        emit(root, "theme", { theme: "museum" });
        return;
      }
      const all = document.querySelector('link[href*="forma-themes"]');
      if (!all && !document.querySelector(`link[data-forma-theme="${id}"]`)) {
        const core = document.querySelector('link[href*="forma"][href$=".css"]');
        const href = new URL(`${id}.css`, base2 || (core ? new URL("themes/", core.href) : location.href)).href;
        const link = Object.assign(document.createElement("link"), { rel: "stylesheet", href });
        link.dataset.formaTheme = id;
        await new Promise((res) => {
          link.onload = link.onerror = res;
          document.head.append(link);
        });
      }
      root.dataset.theme = id;
      if (persist) storage.set(THEME_KEY, id);
      emit(root, "theme", { theme: id });
    },
    restore(opts) {
      const t = storage.get(THEME_KEY);
      if (t) return theme.set(t, { ...opts, persist: false });
    }
  };

  // src/js/overlays.js
  var dialog = {
    open(idOrEl) {
      const d = typeof idOrEl === "string" ? document.getElementById(idOrEl) : idOrEl;
      if (!d || d.open) return d;
      d.showModal();
      emit(d, "open");
      return d;
    },
    close(idOrEl, value) {
      const d = typeof idOrEl === "string" ? document.getElementById(idOrEl) : idOrEl;
      if (d?.open) d.close(value);
      return d;
    }
  };
  var delegated = false;
  function setupDialogs() {
    if (delegated) return;
    delegated = true;
    document.addEventListener("click", (e) => {
      const opener = e.target.closest("[data-forma-open]");
      if (opener) {
        e.preventDefault();
        const d = dialog.open(opener.dataset.formaOpen);
        if (d) opener.setAttribute("aria-expanded", "true");
        return;
      }
      const closer = e.target.closest("[data-forma-close]");
      if (closer) {
        const d = closer.closest("dialog");
        if (d) {
          e.preventDefault();
          dialog.close(d, closer.dataset.formaClose || "");
        }
        return;
      }
      if (e.target instanceof HTMLDialogElement && e.target.open && e.target.getAttribute("role") !== "alertdialog" && !e.target.hasAttribute("data-static")) {
        const r = e.target.getBoundingClientRect();
        if (e.clientX < r.left || e.clientX > r.right || e.clientY < r.top || e.clientY > r.bottom) dialog.close(e.target);
      }
    });
    document.addEventListener("close", (e) => {
      if (!(e.target instanceof HTMLDialogElement)) return;
      $$(`[data-forma-open="${e.target.id}"]`).forEach((o) => o.setAttribute("aria-expanded", "false"));
      emit(e.target, "close", { value: e.target.returnValue });
    }, true);
  }
  function confirm({ title = "Are you sure?", text = "", confirmLabel = "Confirm", cancelLabel = "Cancel", danger = false } = {}) {
    return new Promise((resolve) => {
      const tid = uid("ct"), did = uid("cd");
      const ok = h("button", { class: `btn ${danger ? "btn-danger" : "btn-primary"}`, "data-forma-close": "confirm", text: confirmLabel });
      const cancel = h("button", { class: "btn btn-ghost", "data-forma-close": "cancel", text: cancelLabel, autofocus: danger });
      const d = h(
        "dialog",
        { class: "dialog dialog-sm", role: danger ? "alertdialog" : "dialog", "aria-labelledby": tid, "aria-describedby": text ? did : null },
        h("div", { class: "dialog-header" }, h("div", {}, h("h2", { class: "dialog-title", id: tid, text: title }), text ? h("p", { class: "dialog-desc", id: did, text }) : null)),
        h("div", { class: "dialog-footer" }, cancel, ok)
      );
      document.body.append(d);
      d.addEventListener("close", () => {
        resolve(d.returnValue === "confirm");
        setTimeout(() => d.remove(), 400);
      }, { once: true });
      d.showModal();
      (danger ? cancel : ok).focus();
    });
  }
  function position(panel, anchor, { placement = "bottom-start", offset = 6, x, y } = {}) {
    Object.assign(panel.style, { position: "fixed", margin: "0", insetInline: "auto", insetBlock: "auto" });
    const pr = { width: panel.offsetWidth, height: panel.offsetHeight };
    const vw = document.documentElement.clientWidth, vh = document.documentElement.clientHeight;
    let top, left;
    if (x != null) {
      top = y;
      left = x;
    } else {
      const ar = anchor.getBoundingClientRect();
      const rtl = isRTL(anchor);
      let [side, align = "start"] = placement.split("-");
      if (rtl && align !== "center") align = align === "start" ? "end" : "start";
      if (side === "bottom" && ar.bottom + offset + pr.height > vh && ar.top - offset - pr.height > 0) side = "top";
      else if (side === "top" && ar.top - offset - pr.height < 0) side = "bottom";
      if (side === "bottom" || side === "top") {
        top = side === "bottom" ? ar.bottom + offset : ar.top - offset - pr.height;
        left = align === "start" ? ar.left : align === "end" ? ar.right - pr.width : ar.left + ar.width / 2 - pr.width / 2;
      } else {
        left = side === "right" ? ar.right + offset : ar.left - offset - pr.width;
        top = ar.top + ar.height / 2 - pr.height / 2;
      }
    }
    left = Math.max(8, Math.min(left, vw - pr.width - 8));
    top = Math.max(8, Math.min(top, vh - pr.height - 8));
    Object.assign(panel.style, { position: "fixed", top: `${Math.round(top)}px`, left: `${Math.round(left)}px`, margin: "0", insetInline: "auto", insetBlock: "auto" });
    panel.style.top = `${Math.round(top)}px`;
    panel.style.left = `${Math.round(left)}px`;
  }
  function setupPopovers() {
    document.addEventListener("toggle", (e) => {
      const p = e.target;
      if (!(p instanceof HTMLElement) || !p.hasAttribute("popover") || e.newState !== "open") return;
      if (p.classList.contains("tooltip") || p.dataset.place === "none") return;
      const invoker = p._formaInvoker || document.querySelector(`[popovertarget="${p.id}"]`);
      if (p._formaPoint) {
        position(p, null, p._formaPoint);
        p._formaPoint = null;
      } else if (invoker) position(p, invoker, { placement: p.dataset.placement || "bottom-start" });
      if (p.getAttribute("role") === "menu") focusFirstItem(p);
    }, true);
    const reflow = () => $$("[popover]").forEach((p) => {
      if (!p.matches(":popover-open") || p.classList.contains("tooltip")) return;
      const inv = p._formaInvoker || document.querySelector(`[popovertarget="${p.id}"]`);
      if (inv) position(p, inv, { placement: p.dataset.placement || "bottom-start" });
    });
    addEventListener("resize", reflow);
    addEventListener("scroll", reflow, true);
  }
  var menuItems = (m) => $$('[role^="menuitem"]', m);
  function focusFirstItem(m) {
    const first = menuItems(m).find((i) => i.getAttribute("aria-disabled") !== "true");
    first?.focus();
  }
  function menu(m) {
    menuItems(m).forEach((i, n2) => i.setAttribute("tabindex", n2 ? "-1" : "0"));
    roving(m, () => menuItems(m), { orientation: "vertical", typeahead: true });
    m.addEventListener("click", (e) => {
      const item = e.target.closest('[role^="menuitem"]');
      if (!item || item.getAttribute("aria-disabled") === "true") return;
      if (item.getAttribute("role") === "menuitemcheckbox") {
        item.setAttribute("aria-checked", String(item.getAttribute("aria-checked") !== "true"));
        return;
      }
      if (item.getAttribute("role") === "menuitemradio") {
        menuItems(m).filter((i) => i.getAttribute("role") === "menuitemradio").forEach((i) => i.setAttribute("aria-checked", String(i === item)));
      }
      emit(m, "select", { item, value: item.dataset.value ?? item.textContent.trim() });
      m.hidePopover?.();
    });
    m.addEventListener("keydown", (e) => {
      if (e.key === "Tab") m.hidePopover?.();
    });
    m.addEventListener("toggle", (e) => {
      if (e.newState === "closed") {
        const inv = m._formaInvoker || document.querySelector(`[popovertarget="${m.id}"]`);
        if (m.contains(document.activeElement) || document.activeElement === document.body) inv?.focus();
      }
    });
  }
  define("menu", menu, '[role="menu"][popover]');
  define("context-menu", (area) => {
    area.addEventListener("contextmenu", (e) => {
      const m = document.getElementById(area.dataset.menu);
      if (!m) return;
      e.preventDefault();
      m._formaPoint = { x: e.clientX, y: e.clientY };
      m._formaInvoker = area;
      m.showPopover();
    });
  });
  function tooltip(el) {
    const text = el.dataset.tooltip;
    if (!text) return;
    const tip = h("div", { class: "tooltip", role: "tooltip", id: uid("tt"), popover: "manual", text });
    document.body.append(tip);
    el.setAttribute("data-tooltip-ready", "");
    const desc = el.getAttribute("aria-describedby");
    if (!el.getAttribute("aria-label") || el.getAttribute("aria-label") !== text) el.setAttribute("aria-describedby", [desc, tip.id].filter(Boolean).join(" "));
    let t;
    const show = () => {
      clearTimeout(t);
      t = setTimeout(() => {
        if (!tip.isConnected) return;
        tip.showPopover?.();
        position(tip, el, { placement: el.dataset.tooltipPlacement || "top-center", offset: 8 });
      }, 250);
    };
    const hide = () => {
      clearTimeout(t);
      try {
        tip.hidePopover?.();
      } catch {
      }
    };
    el.addEventListener("pointerenter", show);
    el.addEventListener("pointerleave", hide);
    el.addEventListener("focus", show);
    el.addEventListener("blur", hide);
    el.addEventListener("keydown", (e) => {
      if (e.key === "Escape") hide();
    });
    tip.addEventListener("pointerenter", () => clearTimeout(t));
    tip.addEventListener("pointerleave", hide);
  }
  define("tooltip", tooltip, "[data-tooltip]");
  var ICONS = { success: "check-circle", error: "x-circle", warning: "warning", info: "info" };
  function region(position2 = "bottom-end") {
    let r = document.querySelector(`.toast-region[data-position="${position2}"]`);
    if (!r) {
      r = h("section", { class: "toast-region", "data-position": position2, "aria-label": "Notifications" });
      document.body.append(r);
    }
    return r;
  }
  function toast(opts = {}) {
    if (typeof opts === "string") opts = { title: opts };
    const { type = "info", title = "", text = opts.message || "", duration = type === "error" ? 8e3 : 5e3, action, position: pos, dismissible = true } = opts;
    const el = h(
      "div",
      { class: `toast toast-${type}`, role: type === "error" ? "alert" : "status", style: { "--duration-toast": `${duration}ms` } },
      icon(ICONS[type] || "info"),
      h(
        "div",
        { class: "toast-body" },
        title ? h("p", { class: "toast-title", text: title }) : null,
        text ? h("p", { class: "toast-text", text }) : null,
        action ? h("div", { class: "toast-action" }, h("button", { class: "btn btn-sm btn-soft", text: action.label, onclick: () => {
          action.onClick?.();
          dismiss();
        } })) : null
      ),
      dismissible ? h("button", { class: "toast-close", "aria-label": "Dismiss", onclick: () => dismiss() }, icon("x")) : null,
      duration > 0 ? h("span", { class: "toast-timer", "aria-hidden": "true" }) : null
    );
    region(pos).append(el);
    let timer, remaining = duration, started = Date.now();
    const start2 = () => {
      if (duration > 0) {
        started = Date.now();
        timer = setTimeout(dismiss, remaining);
      }
    };
    const pause = () => {
      clearTimeout(timer);
      remaining -= Date.now() - started;
    };
    el.addEventListener("pointerenter", pause);
    el.addEventListener("pointerleave", start2);
    el.addEventListener("focusin", pause);
    el.addEventListener("focusout", start2);
    function dismiss() {
      clearTimeout(timer);
      if (!el.isConnected) return;
      el.setAttribute("data-leaving", "");
      const remove = () => el.remove();
      el.addEventListener("animationend", remove, { once: true });
      setTimeout(remove, 400);
    }
    start2();
    return { el, dismiss };
  }
  for (const t of ["success", "error", "warning", "info"]) toast[t] = (title, text, opts = {}) => toast({ ...opts, type: t, title, text });
  function command(d) {
    const input = $(".command-input input", d), list = $(".command-list", d), empty = $(".command-empty", d);
    if (!input || !list) return;
    ensureId(list, "cmdl");
    input.setAttribute("role", "combobox");
    input.setAttribute("aria-controls", list.id);
    input.setAttribute("aria-expanded", "true");
    input.setAttribute("aria-autocomplete", "list");
    const items = () => $$(".command-item", list).filter((i) => !i.hidden);
    let active = 0;
    const setActive = (n2) => {
      const all = items();
      if (!all.length) {
        input.removeAttribute("aria-activedescendant");
        return;
      }
      active = (n2 + all.length) % all.length;
      all.forEach((i, k) => {
        ensureId(i, "cmdi");
        i.toggleAttribute("data-active", k === active);
        i.setAttribute("aria-selected", String(k === active));
      });
      input.setAttribute("aria-activedescendant", all[active].id);
      all[active].scrollIntoView({ block: "nearest" });
    };
    const filter = () => {
      const q = input.value.trim().toLowerCase();
      $$(".command-item", list).forEach((i) => {
        i.hidden = q && !fuzzy(i.textContent.toLowerCase(), q);
      });
      $$(".command-group", list).forEach((g) => {
        let n2 = g.nextElementSibling, any = false;
        while (n2 && !n2.classList.contains("command-group")) {
          if (n2.classList.contains("command-item") && !n2.hidden) any = true;
          n2 = n2.nextElementSibling;
        }
        g.hidden = !any;
      });
      const count = items().length;
      if (empty) empty.hidden = count > 0;
      setActive(0);
      announce(`${count} result${count === 1 ? "" : "s"}`);
    };
    input.addEventListener("input", filter);
    input.addEventListener("keydown", (e) => {
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setActive(active + 1);
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setActive(active - 1);
      } else if (e.key === "Enter") {
        e.preventDefault();
        items()[active]?.click();
      }
    });
    list.addEventListener("click", (e) => {
      const it = e.target.closest(".command-item");
      if (!it) return;
      emit(d, "command", { item: it, value: it.dataset.value ?? it.textContent.trim() });
      d.close(it.dataset.value || "");
    });
    list.addEventListener("pointermove", (e) => {
      const it = e.target.closest(".command-item");
      if (it) setActive(items().indexOf(it));
    });
    d.addEventListener("forma:open", () => {
      input.value = "";
      filter();
      input.focus();
    });
    const hk = (d.dataset.hotkey || "mod+k").toLowerCase();
    document.addEventListener("keydown", (e) => {
      const [mod, key] = hk.includes("+") ? hk.split("+") : [null, hk];
      if (e.key.toLowerCase() === key && (!mod || e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        d.open ? d.close() : dialog.open(d);
      }
    });
  }
  function fuzzy(text, q) {
    let i = 0;
    for (const c of text) if (c === q[i]) i++;
    return i === q.length;
  }
  define("command", command);

  // src/js/forms.js
  function tabs(root) {
    const list = $('[role="tablist"]', root);
    if (!list) return;
    const tabEls = $$('[role="tab"]', list).filter((t) => t.closest('[role="tablist"]') === list);
    const panels = $$(':scope > [role="tabpanel"]', root);
    if (root.classList.contains("tabs-vertical")) list.setAttribute("aria-orientation", "vertical");
    tabEls.forEach((t, i) => {
      ensureId(t, "tab");
      const p = panels[i];
      if (p) {
        ensureId(p, "tp");
        t.setAttribute("aria-controls", p.id);
        p.setAttribute("aria-labelledby", t.id);
        if (!p.querySelector("a,button,input,select,textarea,[tabindex]")) p.tabIndex = 0;
      }
    });
    const select = (i, focus = false) => {
      tabEls.forEach((t, k) => {
        const on = k === i;
        t.setAttribute("aria-selected", String(on));
        t.tabIndex = on ? 0 : -1;
        if (panels[k]) panels[k].hidden = !on;
      });
      if (focus) tabEls[i].focus();
      emit(root, "tab", { index: i, tab: tabEls[i] });
    };
    const initial = Math.max(0, tabEls.findIndex((t) => t.getAttribute("aria-selected") === "true"));
    select(initial);
    list.addEventListener("click", (e) => {
      const t = e.target.closest('[role="tab"]');
      if (t && tabEls.includes(t)) select(tabEls.indexOf(t));
    });
    roving(list, () => tabEls, { orientation: list.getAttribute("aria-orientation") === "vertical" ? "vertical" : "horizontal", onMove: (t) => select(tabEls.indexOf(t)) });
    return { select };
  }
  define("tabs", tabs);
  if (typeof document !== "undefined") document.addEventListener("click", (e) => {
    const b = e.target.closest?.('.btn-group > [aria-pressed], .segmented > button[aria-pressed], [role="group"] > .tag[aria-pressed], .swatches > [aria-pressed], .slots > [aria-pressed], .tag[aria-pressed], .toolbar-btn[aria-pressed], .product-fav[aria-pressed]');
    if (!b || b.disabled) return;
    const group = b.parentElement;
    const exclusive = group.matches(".btn-group, .segmented, .swatches, .slots, [data-exclusive]");
    if (exclusive) $$(":scope > [aria-pressed]", group).forEach((x) => x.setAttribute("aria-pressed", String(x === b)));
    else b.setAttribute("aria-pressed", String(b.getAttribute("aria-pressed") !== "true"));
    emit(b, "toggle", { pressed: b.getAttribute("aria-pressed") === "true" });
  });
  define("indeterminate", (el) => {
    el.indeterminate = true;
  }, "input[data-indeterminate]");
  define("range", (r) => {
    const out = r.closest(".field")?.querySelector("output");
    const sync = () => {
      const pct = (r.value - (r.min || 0)) / ((r.max || 100) - (r.min || 0)) * 100;
      r.style.setProperty("--_pct", `${pct}%`);
      if (out) out.value = r.value;
    };
    r.addEventListener("input", sync);
    sync();
  }, "input.range:not(.range-dual input)");
  define("range-dual", (wrap) => {
    const [lo, hi] = $$('input[type="range"]', wrap);
    if (!lo || !hi) return;
    const out = wrap.closest(".field")?.querySelector("output");
    const fmt = wrap.dataset.format || "";
    const sync = (e) => {
      if (+lo.value > +hi.value) {
        if (e?.target === lo) lo.value = hi.value;
        else hi.value = lo.value;
      }
      const span = (+lo.max || 100) - (+lo.min || 0);
      wrap.style.setProperty("--_lo", `${(lo.value - (lo.min || 0)) / span * 100}%`);
      wrap.style.setProperty("--_hi", `${(hi.value - (hi.min || 0)) / span * 100}%`);
      if (out) out.value = fmt ? `${fmt}${lo.value} \u2013 ${fmt}${hi.value}` : `${lo.value} \u2013 ${hi.value}`;
    };
    lo.addEventListener("input", sync);
    hi.addEventListener("input", sync);
    sync();
  });
  define("stepper", (s) => {
    const input = $("input", s);
    s.addEventListener("click", (e) => {
      const b = e.target.closest("[data-step]");
      if (!b) return;
      const step = Number(input.step) || 1, dir = Number(b.dataset.step);
      let v = (Number(input.value) || 0) + dir * step;
      if (input.min !== "") v = Math.max(Number(input.min), v);
      if (input.max !== "") v = Math.min(Number(input.max), v);
      input.value = v;
      input.dispatchEvent(new Event("input", { bubbles: true }));
      input.dispatchEvent(new Event("change", { bubbles: true }));
    });
  });
  define("otp", (g) => {
    const inputs = $$("input", g);
    const done2 = () => {
      const v = inputs.map((i) => i.value).join("");
      if (v.length === inputs.length) emit(g, "complete", { value: v });
    };
    inputs.forEach((inp, i) => {
      inp.addEventListener("input", () => {
        inp.value = inp.value.replace(/\s/g, "").slice(-1);
        if (inp.value && inputs[i + 1]) inputs[i + 1].focus();
        done2();
      });
      inp.addEventListener("keydown", (e) => {
        if (e.key === "Backspace" && !inp.value && inputs[i - 1]) {
          inputs[i - 1].focus();
          inputs[i - 1].value = "";
          e.preventDefault();
        }
        if (e.key === "ArrowLeft" && inputs[i - 1]) inputs[i - 1].focus();
        if (e.key === "ArrowRight" && inputs[i + 1]) inputs[i + 1].focus();
      });
      inp.addEventListener("paste", (e) => {
        const text = (e.clipboardData?.getData("text") || "").replace(/\s/g, "");
        if (!text) return;
        e.preventDefault();
        inputs.slice(i).forEach((x, k) => {
          x.value = text[k] || "";
        });
        inputs[Math.min(inputs.length - 1, i + text.length)].focus();
        done2();
      });
    });
  });
  define("counter", (c) => {
    const input = document.getElementById(c.dataset.counterFor);
    if (!input) return;
    const max = Number(input.maxLength > 0 ? input.maxLength : c.dataset.max);
    const sync = () => {
      const n2 = input.value.length;
      c.textContent = max ? `${n2} / ${max}` : String(n2);
      c.classList.toggle("is-over", max && n2 >= max);
    };
    input.addEventListener("input", sync);
    sync();
  }, "[data-counter-for]");
  define("dropzone", (z) => {
    const input = $('input[type="file"]', z);
    if (!input) return;
    const fire = (files) => emit(z, "files", { files: Array.from(files || []) });
    ["dragenter", "dragover"].forEach((t) => z.addEventListener(t, (e) => {
      e.preventDefault();
      z.setAttribute("data-dragover", "");
    }));
    ["dragleave", "dragend", "drop"].forEach((t) => z.addEventListener(t, () => z.removeAttribute("data-dragover")));
    z.addEventListener("drop", (e) => {
      e.preventDefault();
      if (e.dataTransfer?.files?.length) {
        try {
          input.files = e.dataTransfer.files;
        } catch {
        }
        fire(e.dataTransfer.files);
      }
    });
    input.addEventListener("change", () => fire(input.files));
  });
  define("copy", (b) => {
    b.addEventListener("click", async () => {
      const target = b.dataset.copyTarget ? document.querySelector(b.dataset.copyTarget) : null;
      const text = b.dataset.copyText ?? target?.innerText ?? b.closest(".message-body, .code-block, pre")?.innerText ?? "";
      try {
        await navigator.clipboard.writeText(text);
      } catch {
        return;
      }
      const label = b.getAttribute("aria-label");
      const orig = b.textContent;
      if (!b.querySelector("svg")) b.textContent = b.dataset.copiedLabel || "Copied";
      announce("Copied to clipboard");
      setTimeout(() => {
        if (!b.querySelector("svg")) b.textContent = orig;
        if (label) b.setAttribute("aria-label", label);
      }, 1600);
    });
  });
  define("reveal", (b) => {
    const holder = b.parentElement.querySelector("[data-secret]");
    if (!holder) return;
    const masked = holder.textContent;
    b.addEventListener("click", () => {
      const on = b.getAttribute("aria-pressed") !== "true";
      b.setAttribute("aria-pressed", String(on));
      holder.textContent = on ? holder.dataset.secret : masked;
      b.textContent = on ? "Hide" : "Show";
    });
  });
  define("dismiss", (b) => {
    b.addEventListener("click", () => {
      const t = b.closest(".alert, .callout, .toast, .chip, .upsell, [data-dismissible]");
      if (!t) return;
      const next = t.nextElementSibling?.querySelector?.("button, a") || null;
      t.remove();
      next?.focus();
      emit(document, "dismiss", { el: t });
    });
  });
  define("sidebar-toggle", (b) => {
    const sb = document.getElementById(b.dataset.target) || b.closest(".sidebar");
    if (!sb) return;
    const labelItems = () => $$(".sidebar-item", sb).forEach((i) => {
      const l = $(".sidebar-label", i);
      if (l && !i.dataset.tooltip) i.setAttribute("aria-label", l.textContent.trim());
    });
    b.addEventListener("click", () => {
      const c = !sb.hasAttribute("data-collapsed");
      sb.toggleAttribute("data-collapsed", c);
      b.setAttribute("aria-expanded", String(!c));
      labelItems();
    });
  });
  var MESSAGES = {
    en: { valueMissing: "This field is required", typeMismatch: { email: "Enter a valid e-mail address", url: "Enter a valid URL", _: "Invalid format" }, tooShort: (el) => `Use at least ${el.minLength} characters`, tooLong: (el) => `Use at most ${el.maxLength} characters`, rangeUnderflow: (el) => `Must be ${el.min} or more`, rangeOverflow: (el) => `Must be ${el.max} or less`, patternMismatch: (el) => el.title || "Invalid format", stepMismatch: "Invalid value", badInput: "Enter a number", mismatch: "Fields do not match", summary: (n2) => `${n2} field${n2 === 1 ? "" : "s"} need${n2 === 1 ? "s" : ""} attention`, strength: ["", "Weak", "Fair", "Good", "Strong"] },
    tr: { valueMissing: "Bu alan zorunludur", typeMismatch: { email: "Ge\xE7erli bir e-posta adresi girin", url: "Ge\xE7erli bir URL girin", _: "Ge\xE7ersiz bi\xE7im" }, tooShort: (el) => `En az ${el.minLength} karakter olmal\u0131`, tooLong: (el) => `En fazla ${el.maxLength} karakter olmal\u0131`, rangeUnderflow: (el) => `En az ${el.min} olmal\u0131`, rangeOverflow: (el) => `En fazla ${el.max} olmal\u0131`, patternMismatch: (el) => el.title || "Ge\xE7ersiz bi\xE7im", stepMismatch: "Ge\xE7ersiz de\u011Fer", badInput: "Bir say\u0131 girin", mismatch: "Alanlar e\u015Fle\u015Fmiyor", summary: (n2) => `${n2} alan d\xFCzeltilmeli`, strength: ["", "Zay\u0131f", "Orta", "\u0130yi", "G\xFC\xE7l\xFC"] }
  };
  var msgs = () => MESSAGES[validate.locale] || MESSAGES[(document.documentElement.lang || "en").slice(0, 2)] || MESSAGES.en;
  function messageFor(el) {
    const v = el.validity, m = msgs();
    if (el.dataset.match) {
      const other = document.querySelector(el.dataset.match);
      if (other && other.value !== el.value) return m.mismatch;
    }
    for (const k of ["valueMissing", "typeMismatch", "tooShort", "tooLong", "rangeUnderflow", "rangeOverflow", "patternMismatch", "stepMismatch", "badInput"]) {
      if (!v[k]) continue;
      const msg = m[k];
      if (k === "typeMismatch") return msg[el.type] || msg._;
      return typeof msg === "function" ? msg(el) : msg;
    }
    return "";
  }
  function validateField(el) {
    if (!el.willValidate) return true;
    if (el.dataset.match) {
      const other = document.querySelector(el.dataset.match);
      el.setCustomValidity(other && other.value !== el.value ? msgs().mismatch : "");
    }
    const field = el.closest(".field") || el.parentElement;
    const msg = el.checkValidity() ? "" : messageFor(el);
    let out = field.querySelector(".field-message[data-forma-msg]");
    if (msg) {
      if (!out) {
        out = h("p", { class: "field-message field-message-error", "data-forma-msg": "", id: `${ensureId(el, "fld")}-msg` });
        field.append(out);
      }
      out.textContent = msg;
      el.setAttribute("aria-invalid", "true");
      const d = new Set((el.getAttribute("aria-describedby") || "").split(" ").filter(Boolean));
      d.add(out.id);
      el.setAttribute("aria-describedby", [...d].join(" "));
    } else {
      out?.remove();
      el.removeAttribute("aria-invalid");
    }
    return !msg;
  }
  function validate(form) {
    form.noValidate = true;
    const fields = () => $$("input, select, textarea", form).filter((f) => f.willValidate);
    form.addEventListener("blur", (e) => {
      if (e.target.matches?.("input, select, textarea") && (e.target.value || e.target.hasAttribute("aria-invalid"))) validateField(e.target);
    }, true);
    form.addEventListener("input", (e) => {
      if (e.target.hasAttribute?.("aria-invalid")) validateField(e.target);
    });
    form.addEventListener("submit", (e) => {
      const bad = fields().filter((f) => !validateField(f));
      let summary = $(".form-summary[data-forma-summary]", form);
      if (bad.length) {
        e.preventDefault();
        e.stopImmediatePropagation();
        if (form.hasAttribute("data-summary") || bad.length > 2) {
          if (!summary) {
            summary = h("div", { class: "form-summary", role: "alert", tabindex: "-1", "data-forma-summary": "" });
            form.prepend(summary);
          }
          summary.replaceChildren(
            h("p", { class: "form-summary-title", text: msgs().summary(bad.length) }),
            h("ul", {}, bad.map((f) => h("li", {}, h("a", { href: `#${ensureId(f, "fld")}`, text: `${(form.querySelector(`label[for="${f.id}"]`)?.textContent || f.name || f.id).replace(/\s*\*$/, "")}: ${messageFor(f) || f.validationMessage}`, onclick: (ev) => {
              ev.preventDefault();
              f.focus();
            } }))))
          );
          summary.focus();
        } else bad[0].focus();
        emit(form, "invalid", { fields: bad });
      } else {
        summary?.remove();
        emit(form, "valid", {});
      }
    });
  }
  validate.locale = null;
  validate.messages = MESSAGES;
  validate.field = validateField;
  define("validate", validate);
  define("strength", (input) => {
    const meter = document.getElementById((input.getAttribute("aria-describedby") || "").split(" ").find((id) => document.getElementById(id)?.classList.contains("strength"))) || input.closest(".field")?.querySelector(".strength");
    if (!meter) return;
    const label = $(".strength-label", meter);
    input.addEventListener("input", () => {
      const v = input.value;
      let s = 0;
      if (v.length >= 8) s++;
      if (/[A-Z]/.test(v) && /[a-z]/.test(v)) s++;
      if (/\d/.test(v)) s++;
      if (/[^A-Za-z0-9]/.test(v) || v.length >= 14) s++;
      if (!v) s = 0;
      meter.dataset.score = String(s);
      if (label) label.textContent = msgs().strength[s];
    });
  }, "input[data-strength]");
  function wizard(root) {
    const panels = $$(".wizard-panel", root), steps = $$(".steps .step", root);
    const count = $(".wizard-count", root), next = $("[data-wizard-next]", root), prev = $("[data-wizard-prev]", root);
    let index = Math.max(0, panels.findIndex((p) => !p.hidden));
    const go = (i, focus = true) => {
      index = Math.max(0, Math.min(panels.length - 1, i));
      panels.forEach((p, k) => {
        p.hidden = k !== index;
      });
      steps.forEach((s, k) => {
        s.toggleAttribute("aria-current", k === index);
        if (k === index) s.setAttribute("aria-current", "step");
        if (k < index) s.dataset.state = "done";
        else delete s.dataset.state;
      });
      if (count) count.textContent = `${index + 1} / ${panels.length}`;
      if (prev) prev.disabled = index === 0;
      if (next) next.textContent = index === panels.length - 1 ? next.dataset.finishLabel || "Finish" : next.dataset.nextLabel || "Continue";
      if (focus) (panels[index].querySelector("input, select, textarea, button") || panels[index]).focus?.();
      emit(root, "step", { index });
    };
    const valid = () => $$("input, select, textarea", panels[index]).every((f) => validateField(f));
    next?.addEventListener("click", (e) => {
      e.preventDefault();
      if (!valid()) {
        panels[index].querySelector('[aria-invalid="true"]')?.focus();
        return;
      }
      if (index === panels.length - 1) {
        root.tagName === "FORM" ? root.requestSubmit() : emit(root, "finish", {});
      } else go(index + 1);
    });
    prev?.addEventListener("click", (e) => {
      e.preventDefault();
      go(index - 1);
    });
    go(index, false);
    return { next: () => next?.click(), prev: () => go(index - 1), go, get index() {
      return index;
    } };
  }
  define("wizard", wizard);
  function combobox(root) {
    const input = $(".combobox-input", root), lb = $('[role="listbox"]', root), control = $(".combobox-control", root);
    if (!input || !lb) return;
    const multiple = root.hasAttribute("data-multiple");
    ensureId(lb, "lb");
    input.setAttribute("role", "combobox");
    input.setAttribute("aria-controls", lb.id);
    input.setAttribute("aria-expanded", "false");
    input.setAttribute("aria-autocomplete", "list");
    input.autocomplete = "off";
    if (multiple) lb.setAttribute("aria-multiselectable", "true");
    const opts = () => $$('[role="option"]', lb);
    const visible = () => opts().filter((o) => !o.hidden && o.getAttribute("aria-disabled") !== "true");
    let active = -1;
    let empty = $(".listbox-empty", lb);
    if (!empty) {
      empty = h("p", { class: "listbox-empty", text: root.dataset.emptyText || "No matches", hidden: true });
      lb.append(empty);
    }
    const open = (v) => {
      lb.hidden = !v;
      input.setAttribute("aria-expanded", String(v));
      root.toggleAttribute("data-open", v);
      if (!v) setActive(-1);
    };
    const setActive = (i) => {
      const vis = visible();
      opts().forEach((o2) => o2.removeAttribute("data-active"));
      active = vis.length ? (i + vis.length) % vis.length : -1;
      if (i < 0 || active < 0) {
        input.removeAttribute("aria-activedescendant");
        active = -1;
        return;
      }
      const o = vis[active];
      ensureId(o, "opt");
      o.setAttribute("data-active", "");
      input.setAttribute("aria-activedescendant", o.id);
      o.scrollIntoView({ block: "nearest" });
    };
    const label = (o) => o.childNodes[0]?.textContent.trim() || o.textContent.trim();
    const renderChips = () => {
      if (!multiple) return;
      $$(".chip", control).forEach((c) => c.remove());
      opts().filter((o) => o.getAttribute("aria-selected") === "true").forEach((o) => {
        control.insertBefore(h("span", { class: "chip" }, label(o), h("button", { type: "button", class: "chip-remove", "aria-label": `Remove ${label(o)}`, text: "\xD7", onclick: (e) => {
          e.stopPropagation();
          toggle(o);
          input.focus();
        } })), input);
      });
    };
    const values = () => opts().filter((o) => o.getAttribute("aria-selected") === "true").map((o) => o.dataset.value ?? label(o));
    const toggle = (o) => {
      if (o.getAttribute("aria-disabled") === "true") return;
      if (multiple) {
        o.setAttribute("aria-selected", String(o.getAttribute("aria-selected") !== "true"));
        renderChips();
        input.value = "";
        filter();
      } else {
        opts().forEach((x) => x.setAttribute("aria-selected", String(x === o)));
        input.value = label(o);
        open(false);
      }
      announce(`${label(o)} ${o.getAttribute("aria-selected") === "true" ? "selected" : "removed"}`);
      emit(root, "change", { value: multiple ? values() : values()[0] });
    };
    const filter = () => {
      const q = input.value.trim().toLowerCase();
      const selectedLabel = !multiple && opts().find((o) => o.getAttribute("aria-selected") === "true");
      const showAll = selectedLabel && label(selectedLabel).toLowerCase() === q;
      opts().forEach((o) => {
        o.hidden = !!q && !showAll && !o.textContent.toLowerCase().includes(q);
      });
      $$(".listbox-group", lb).forEach((g) => {
        let n2 = g.nextElementSibling, any = false;
        while (n2 && !n2.classList.contains("listbox-group")) {
          if (n2.matches('[role="option"]') && !n2.hidden) any = true;
          n2 = n2.nextElementSibling;
        }
        g.hidden = !any;
      });
      empty.hidden = visible().length > 0;
    };
    input.addEventListener("input", () => {
      filter();
      open(true);
      setActive(0);
    });
    input.addEventListener("focus", () => {
      filter();
      open(true);
    });
    control.addEventListener("click", (e) => {
      if (e.target === control) input.focus();
    });
    input.addEventListener("keydown", (e) => {
      if (e.key === "ArrowDown") {
        e.preventDefault();
        if (lb.hidden) open(true);
        setActive(active + 1);
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setActive(active - 1);
      } else if (e.key === "Enter" && active >= 0) {
        e.preventDefault();
        toggle(visible()[active]);
      } else if (e.key === "Escape") {
        if (!lb.hidden) {
          e.preventDefault();
          e.stopPropagation();
          open(false);
        }
      } else if (e.key === "Backspace" && multiple && !input.value) {
        const last = opts().filter((o) => o.getAttribute("aria-selected") === "true").pop();
        if (last) toggle(last);
      } else if (e.key === "Tab") open(false);
    });
    lb.addEventListener("mousedown", (e) => e.preventDefault());
    lb.addEventListener("click", (e) => {
      const o = e.target.closest('[role="option"]');
      if (o) toggle(o);
    });
    document.addEventListener("click", (e) => {
      if (!root.contains(e.target)) open(false);
    });
    renderChips();
    if (!multiple) {
      const s = opts().find((o) => o.getAttribute("aria-selected") === "true");
      if (s) input.value = label(s);
    }
    open(false);
    return { get value() {
      return multiple ? values() : values()[0];
    } };
  }
  define("combobox", combobox);
  var iso = (d) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
  var parse = (s) => {
    if (!s) return null;
    const [y, m, d] = s.split("-").map(Number);
    return new Date(y, m - 1, d);
  };
  function datepicker(root, opts = {}) {
    const locale = opts.locale || root.dataset.locale || document.documentElement.lang || void 0;
    const weekStart = Number(opts.weekStart ?? root.dataset.weekStart ?? 1);
    const range = opts.range ?? root.hasAttribute("data-range");
    const min = parse(opts.min || root.dataset.min), max = parse(opts.max || root.dataset.max);
    let sel = parse(opts.value || root.dataset.value), sel2 = parse(root.dataset.end);
    let view = new Date((sel || /* @__PURE__ */ new Date()).getFullYear(), (sel || /* @__PURE__ */ new Date()).getMonth(), 1);
    let focus = sel || /* @__PURE__ */ new Date();
    const titleId = ensureId(root, "dp") + "-t";
    root.setAttribute("role", "application");
    root.setAttribute("aria-roledescription", "date picker");
    const render = (moveFocus) => {
      const today = iso(/* @__PURE__ */ new Date());
      const first = new Date(view);
      const offset = (first.getDay() - weekStart + 7) % 7;
      const start2 = new Date(first);
      start2.setDate(1 - offset);
      const wd = new Intl.DateTimeFormat(locale, { weekday: "narrow" }), wdl = new Intl.DateTimeFormat(locale, { weekday: "long" });
      const grid = h("div", { class: "datepicker-grid", role: "grid", "aria-labelledby": titleId });
      const head = h("div", { role: "row", class: "grid-row" });
      grid.append(head);
      for (let i = 0; i < 7; i++) {
        const d = new Date(2024, 0, 7 + weekStart + i);
        head.append(h("span", { class: "datepicker-weekday", role: "columnheader", "aria-label": wdl.format(d), text: wd.format(d) }));
      }
      let row;
      for (let i = 0; i < 42; i++) {
        if (i % 7 === 0) {
          row = h("div", { role: "row", class: "grid-row" });
          grid.append(row);
        }
        const d = new Date(start2);
        d.setDate(start2.getDate() + i);
        const id = iso(d), out = d.getMonth() !== view.getMonth();
        const disabled = min && d < min || max && d > max;
        const isSel = sel && id === iso(sel) || sel2 && id === iso(sel2);
        const inRange = range && sel && sel2 && d > sel && d < sel2;
        const cell = h("span", { role: "gridcell", class: "grid-row", "aria-selected": isSel ? "true" : "false" });
        row.append(cell);
        const b = h("button", { type: "button", class: "datepicker-day", "data-date": id, tabindex: id === iso(focus) ? "0" : "-1", "data-selected": isSel || null, "aria-pressed": null, "aria-current": id === today ? "date" : null, "data-outside": out || null, "data-in-range": inRange || null, "data-range-edge": range && isSel ? "" : null, disabled: disabled || null, "aria-label": new Intl.DateTimeFormat(locale, { dateStyle: "full" }).format(d), text: d.getDate() });
        cell.append(b);
      }
      const nav = (dir, label, glyph) => h("button", { type: "button", class: "btn btn-icon btn-ghost btn-sm", "aria-label": label, text: glyph, onclick: () => {
        view.setMonth(view.getMonth() + dir);
        focus = new Date(view);
        render();
      } });
      root.replaceChildren(
        h("div", { class: "datepicker-head" }, nav(-1, "Previous month", "\u2039"), h("p", { class: "datepicker-title", id: titleId, "aria-live": "polite", text: new Intl.DateTimeFormat(locale, { month: "long", year: "numeric" }).format(view) }), nav(1, "Next month", "\u203A")),
        grid,
        h("div", { class: "datepicker-foot" }, h("button", { type: "button", class: "btn btn-ghost btn-sm", text: root.dataset.todayLabel || "Today", onclick: () => pick(/* @__PURE__ */ new Date()) }), h("span", { class: "t-meta t-tertiary", text: sel ? sel2 ? `${iso(sel)} \u2192 ${iso(sel2)}` : iso(sel) : "" }))
      );
      if (moveFocus) root.querySelector(`[data-date="${iso(focus)}"]`)?.focus();
    };
    const pick = (d) => {
      if (range && sel && !sel2 && d >= sel) sel2 = d;
      else {
        sel = d;
        sel2 = null;
      }
      focus = d;
      view = new Date(d.getFullYear(), d.getMonth(), 1);
      render(true);
      const value = range ? { start: sel && iso(sel), end: sel2 && iso(sel2) } : iso(sel);
      const target = root.dataset.input && document.querySelector(root.dataset.input);
      if (target && !range) target.value = iso(sel);
      emit(root, "change", { value });
    };
    root.addEventListener("click", (e) => {
      const b = e.target.closest(".datepicker-day");
      if (b && !b.disabled) pick(parse(b.dataset.date));
    });
    root.addEventListener("keydown", (e) => {
      const b = e.target.closest(".datepicker-day");
      if (!b) return;
      const d = parse(b.dataset.date);
      const map = { ArrowLeft: -1, ArrowRight: 1, ArrowUp: -7, ArrowDown: 7 };
      if (getComputedStyle(root).direction === "rtl") {
        map.ArrowLeft = 1;
        map.ArrowRight = -1;
      }
      if (map[e.key] != null) d.setDate(d.getDate() + map[e.key]);
      else if (e.key === "PageUp") d.setMonth(d.getMonth() - 1);
      else if (e.key === "PageDown") d.setMonth(d.getMonth() + 1);
      else if (e.key === "Home") d.setDate(d.getDate() - (d.getDay() - weekStart + 7) % 7);
      else if (e.key === "End") d.setDate(d.getDate() + (6 - (d.getDay() - weekStart + 7) % 7));
      else return;
      e.preventDefault();
      focus = d;
      if (d.getMonth() !== view.getMonth() || d.getFullYear() !== view.getFullYear()) view = new Date(d.getFullYear(), d.getMonth(), 1);
      render(true);
    });
    render();
    return { get value() {
      return sel && iso(sel);
    }, set: pick };
  }
  define("datepicker", datepicker);

  // src/js/data.js
  function table(t) {
    const tbody = t.tBodies[0];
    if (!tbody) return;
    const wrap = t.closest(".table-wrap") || t.parentElement;
    const status = $("[data-table-status]", wrap);
    const rows = () => Array.from(tbody.rows);
    $$("th[aria-sort] .sort-btn", t).forEach((btn) => {
      const th = btn.closest("th");
      const col = th.cellIndex;
      btn.addEventListener("click", () => {
        const dir = th.getAttribute("aria-sort") === "ascending" ? "descending" : "ascending";
        $$("th[aria-sort]", t).forEach((x) => x.setAttribute("aria-sort", x === th ? dir : "none"));
        const val = (r) => {
          const c = r.cells[col];
          const v = c?.dataset.value ?? c?.textContent.trim() ?? "";
          const n2 = parseFloat(v.replace(/[^\d.-]/g, ""));
          return Number.isNaN(n2) || /[a-z]/i.test(v.replace(/[\d.,\s%$€₺hm-]/gi, "")) ? v.toLowerCase() : n2;
        };
        const sorted = rows().sort((a, b) => {
          const x = val(a), y = val(b);
          const r = typeof x === "number" && typeof y === "number" ? x - y : String(x).localeCompare(String(y), void 0, { numeric: true });
          return dir === "ascending" ? r : -r;
        });
        tbody.append(...sorted);
        announce(`Sorted by ${btn.textContent.trim()}, ${dir}`);
        emit(t, "sort", { column: col, direction: dir });
      });
    });
    const all = $("[data-select-all]", t);
    const boxes = () => $$('tbody input[type="checkbox"]', t);
    const sync = () => {
      const b = boxes();
      const n2 = b.filter((x) => x.checked).length;
      b.forEach((x) => x.closest("tr")?.setAttribute("aria-selected", String(x.checked)));
      if (all) {
        all.checked = n2 === b.length && n2 > 0;
        all.indeterminate = n2 > 0 && n2 < b.length;
      }
      if (status) status.textContent = n2 ? `${n2} of ${b.length} selected` : `${rows().filter((r) => !r.hidden).length} rows`;
      emit(t, "select", { count: n2 });
    };
    all?.addEventListener("change", () => {
      boxes().forEach((x) => {
        x.checked = all.checked;
      });
      sync();
    });
    tbody.addEventListener("change", (e) => {
      if (e.target.matches('input[type="checkbox"]')) sync();
    });
    const filter = $("[data-table-filter]", wrap);
    filter?.addEventListener("input", () => {
      const q = filter.value.trim().toLowerCase();
      rows().forEach((r) => {
        r.hidden = q && !r.textContent.toLowerCase().includes(q);
      });
      sync();
    });
    if (boxes().length) sync();
  }
  define("table", table);
  function tree(root) {
    const items = () => $$('[role="treeitem"]', root).filter((i) => !i.closest('[aria-expanded="false"] > [role="group"]'));
    const label = (i) => $(":scope > .tree-item", i) || i;
    $$('[role="treeitem"]', root).forEach((i, n2) => {
      i.tabIndex = n2 === 0 ? 0 : -1;
    });
    const focus = (i) => {
      $$('[role="treeitem"]', root).forEach((x) => {
        x.tabIndex = x === i ? 0 : -1;
      });
      i.focus();
    };
    root.addEventListener("click", (e) => {
      const i = e.target.closest('[role="treeitem"]');
      if (!i || !root.contains(i)) return;
      if (!label(i).contains(e.target)) return;
      if (i.hasAttribute("aria-expanded")) i.setAttribute("aria-expanded", String(i.getAttribute("aria-expanded") !== "true"));
      $$('[aria-selected="true"]', root).forEach((x) => x.removeAttribute("aria-selected"));
      label(i).setAttribute("aria-selected", "true");
      focus(i);
      emit(root, "select", { item: i });
    });
    root.addEventListener("keydown", (e) => {
      const i = document.activeElement.closest?.('[role="treeitem"]');
      if (!i) return;
      const vis = items(), k = vis.indexOf(i);
      const exp = i.getAttribute("aria-expanded");
      const rtl = getComputedStyle(root).direction === "rtl";
      const key = rtl ? { ArrowLeft: "ArrowRight", ArrowRight: "ArrowLeft" }[e.key] || e.key : e.key;
      if (key === "ArrowDown" && vis[k + 1]) focus(vis[k + 1]);
      else if (key === "ArrowUp" && vis[k - 1]) focus(vis[k - 1]);
      else if (key === "ArrowRight") {
        if (exp === "false") i.setAttribute("aria-expanded", "true");
        else if (exp === "true") {
          const c = $('[role="treeitem"]', i);
          if (c) focus(c);
        }
      } else if (key === "ArrowLeft") {
        if (exp === "true") i.setAttribute("aria-expanded", "false");
        else {
          const p = i.parentElement.closest('[role="treeitem"]');
          if (p) focus(p);
        }
      } else if (key === "Home") focus(vis[0]);
      else if (key === "End") focus(vis[vis.length - 1]);
      else if (key === "Enter" || key === " ") label(i).click();
      else return;
      e.preventDefault();
    });
  }
  define("tree", tree);
  function kanban(board) {
    const cols = () => $$(".kanban-col", board);
    const count = (c) => {
      const n2 = $(".kanban-count", c);
      if (n2) n2.textContent = $$(".kanban-card", c).length;
    };
    const insert = (col, card, before) => {
      const add = $(".kanban-add", col);
      col.insertBefore(card, before || add || null);
    };
    let dragging = null;
    board.addEventListener("dragstart", (e) => {
      const c = e.target.closest(".kanban-card");
      if (!c) return;
      dragging = c;
      c.setAttribute("data-dragging", "");
      e.dataTransfer.effectAllowed = "move";
    });
    board.addEventListener("dragend", () => {
      dragging?.removeAttribute("data-dragging");
      dragging = null;
      cols().forEach((c) => c.removeAttribute("data-dragover"));
    });
    board.addEventListener("dragover", (e) => {
      const col = e.target.closest(".kanban-col");
      if (!col || !dragging) return;
      e.preventDefault();
      cols().forEach((c) => c.toggleAttribute("data-dragover", c === col));
    });
    board.addEventListener("drop", (e) => {
      const col = e.target.closest(".kanban-col");
      if (!col || !dragging) return;
      e.preventDefault();
      const from = dragging.closest(".kanban-col");
      const over = e.target.closest(".kanban-card");
      insert(col, dragging, over && over !== dragging ? over : null);
      count(from);
      count(col);
      emit(board, "move", { card: dragging, from, to: col });
    });
    $$(".kanban-card", board).forEach((c) => {
      c.draggable = true;
      c.setAttribute("aria-roledescription", "draggable card");
    });
    let lifted = null;
    board.addEventListener("keydown", (e) => {
      const card = e.target.closest(".kanban-card");
      if (!card) return;
      const name = $(".kanban-card-title", card)?.textContent.trim() || "Card";
      if (e.key === " " || e.key === "Enter") {
        e.preventDefault();
        if (lifted === card) {
          card.removeAttribute("aria-grabbed");
          lifted = null;
          announce(`${name} dropped in ${card.closest(".kanban-col").getAttribute("aria-label")}`);
          emit(board, "move", { card, to: card.closest(".kanban-col") });
        } else {
          lifted?.removeAttribute("aria-grabbed");
          lifted = card;
          card.setAttribute("aria-grabbed", "true");
          announce(`${name} lifted. Use arrow keys to move, Space to drop, Escape to cancel.`);
        }
        return;
      }
      if (e.key === "Escape" && lifted) {
        lifted.removeAttribute("aria-grabbed");
        lifted = null;
        announce("Move cancelled");
        return;
      }
      if (lifted !== card) return;
      const cs = cols(), from = card.closest(".kanban-col"), ci = cs.indexOf(from);
      const rtl = getComputedStyle(board).direction === "rtl";
      const dir = { ArrowRight: rtl ? -1 : 1, ArrowLeft: rtl ? 1 : -1 }[e.key];
      if (dir) {
        const to = cs[ci + dir];
        if (!to) return;
        e.preventDefault();
        insert(to, card);
        count(from);
        count(to);
        card.focus();
        announce(`Moved to ${to.getAttribute("aria-label")}`);
      } else if (e.key === "ArrowUp" && card.previousElementSibling?.classList.contains("kanban-card")) {
        e.preventDefault();
        from.insertBefore(card, card.previousElementSibling);
        card.focus();
      } else if (e.key === "ArrowDown" && card.nextElementSibling?.classList.contains("kanban-card")) {
        e.preventDefault();
        from.insertBefore(card.nextElementSibling, card);
        card.focus();
      }
    });
  }
  define("kanban", kanban);
  function calendar(root, opts = {}) {
    const locale = opts.locale || root.dataset.locale || document.documentElement.lang || void 0;
    const weekStart = Number(opts.weekStart ?? root.dataset.weekStart ?? 1);
    let events = opts.events || JSON.parse(root.dataset.events || "[]");
    const [y, m] = (opts.month || root.dataset.month || (/* @__PURE__ */ new Date()).toISOString().slice(0, 7)).split("-").map(Number);
    let view = new Date(y, m - 1, 1);
    const iso2 = (d) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
    const render = () => {
      const offset = (view.getDay() - weekStart + 7) % 7;
      const start2 = new Date(view);
      start2.setDate(1 - offset);
      const grid = h("div", { class: "calendar-grid", role: "grid" });
      const wd = new Intl.DateTimeFormat(locale, { weekday: "short" });
      const head = h("div", { role: "row", class: "grid-row" });
      grid.append(head);
      for (let i = 0; i < 7; i++) head.append(h("div", { class: "calendar-weekday", role: "columnheader", text: wd.format(new Date(2024, 0, 7 + weekStart + i)) }));
      let row;
      const today = iso2(/* @__PURE__ */ new Date());
      for (let i = 0; i < 42; i++) {
        if (i % 7 === 0) {
          row = h("div", { role: "row", class: "grid-row" });
          grid.append(row);
        }
        const d = new Date(start2);
        d.setDate(start2.getDate() + i);
        const id = iso2(d);
        const cell = h("div", { class: "calendar-cell", role: "gridcell", "data-outside": d.getMonth() !== view.getMonth() || null, "aria-current": id === today ? "date" : null }, h("span", { class: "calendar-date", text: d.getDate() }));
        for (const ev of events.filter((x) => x.date === id)) cell.append(h(ev.href ? "a" : "span", { class: "calendar-event", "data-tone": ev.tone, href: ev.href, text: ev.title }));
        row.append(cell);
      }
      const nav = (dir, label, g) => h("button", { type: "button", class: "btn btn-icon btn-ghost btn-sm", "aria-label": label, text: g, onclick: () => {
        view.setMonth(view.getMonth() + dir);
        render();
      } });
      root.replaceChildren(h("div", { class: "calendar-head" }, h("h3", { class: "calendar-title", "aria-live": "polite", text: new Intl.DateTimeFormat(locale, { month: "long", year: "numeric" }).format(view) }), h("div", { class: "cluster gap-1" }, nav(-1, "Previous month", "\u2039"), nav(1, "Next month", "\u203A"))), grid);
    };
    render();
    return { setEvents(list) {
      events = list;
      render();
    } };
  }
  define("calendar", calendar);
  define("toolbar", (tb) => {
    const items = () => $$('button, [role="button"]', tb);
    items().forEach((b, i) => {
      b.tabIndex = i ? -1 : 0;
    });
    roving(tb, items, { orientation: tb.getAttribute("aria-orientation") === "vertical" ? "vertical" : "horizontal" });
  });
  function toc(nav, opts = {}) {
    let links = $$('a[href^="#"]', nav);
    if (nav.dataset.headings || opts.headings) {
      const scope = document.querySelector(nav.dataset.scope || "main") || document.body;
      const hs = $$(opts.headings || nav.dataset.headings, scope);
      const list = h("ol", {}, hs.map((hd) => h("li", {}, h("a", { href: `#${ensureId(hd, "sec")}`, text: hd.textContent.trim() }))));
      $("ol, ul", nav)?.replaceWith(list) || nav.append(list);
      links = $$("a", list);
    }
    const targets = links.map((a) => document.getElementById(decodeURIComponent(a.hash.slice(1)))).filter(Boolean);
    if (!targets.length) return;
    const bar = $(".toc-progress > span", nav);
    const io = new IntersectionObserver(() => {
      const y = 120;
      let current = targets[0];
      for (const t of targets) if (t.getBoundingClientRect().top - y <= 0) current = t;
      links.forEach((a) => a.removeAttribute("aria-current"));
      links.find((a) => a.hash === `#${current.id}`)?.setAttribute("aria-current", "true");
    }, { rootMargin: "0px 0px -60% 0px", threshold: [0, 1] });
    targets.forEach((t) => io.observe(t));
    if (bar) addEventListener("scroll", () => {
      const d = document.documentElement;
      bar.style.setProperty("--progress", `${Math.min(100, d.scrollTop / (d.scrollHeight - d.clientHeight) * 100)}%`);
    }, { passive: true });
  }
  define("toc", toc);
  define("gallery", (g) => {
    const items = $$(".gallery-item", g);
    let i = 0;
    const img = h("img", { alt: "" }), cap = h("p", { class: "lightbox-caption" });
    const show = (n2) => {
      i = (n2 + items.length) % items.length;
      const it = items[i];
      const src = it.dataset.full || it.querySelector("img")?.src || "";
      img.src = src;
      img.alt = it.querySelector("img")?.alt || it.getAttribute("aria-label") || "";
      img.hidden = !src;
      cap.textContent = it.querySelector(".gallery-caption")?.textContent || it.getAttribute("aria-label") || "";
    };
    const d = h(
      "dialog",
      { class: "dialog lightbox", "aria-label": g.getAttribute("aria-label") || "Image viewer" },
      h("div", { class: "dialog-body" }, img, cap),
      h("button", { class: "btn btn-icon lightbox-nav lightbox-prev", "aria-label": "Previous image", text: "\u2039", onclick: () => show(i - 1) }),
      h("button", { class: "btn btn-icon lightbox-nav lightbox-next", "aria-label": "Next image", text: "\u203A", onclick: () => show(i + 1) }),
      h("button", { class: "dialog-close", style: { position: "absolute", insetBlockStart: "8px", insetInlineEnd: "8px" }, "data-forma-close": "", "aria-label": "Close", text: "\xD7" })
    );
    document.body.append(d);
    d.addEventListener("keydown", (e) => {
      if (e.key === "ArrowRight") show(i + 1);
      if (e.key === "ArrowLeft") show(i - 1);
    });
    items.forEach((it, n2) => it.addEventListener("click", (e) => {
      e.preventDefault();
      show(n2);
      dialog.open(d);
    }));
  });
  define("scroll-region", (el) => {
    const check = () => {
      if (el.scrollWidth > el.clientWidth + 1 || el.scrollHeight > el.clientHeight + 1) {
        if (!el.hasAttribute("tabindex")) el.tabIndex = 0;
      }
    };
    check();
    if (typeof ResizeObserver !== "undefined") new ResizeObserver(check).observe(el);
  }, "pre.code-block, pre.log, .table-wrap, .kanban, .pipeline, .ticker, .tab-list, .command-list, .notification-list");

  // src/js/chart.js
  var S = (tag, attrs = {}, ...kids) => h(`svg:${tag}`, attrs, ...kids);
  function formatter(spec, locale) {
    if (typeof spec === "function") return spec;
    const m = /^0(?:\.(0+))?(?:'(.*)')?$/.exec(spec || "");
    const dec = m?.[1]?.length ?? void 0, suffix = m?.[2] ?? "";
    const nf = new Intl.NumberFormat(locale, dec != null ? { minimumFractionDigits: dec, maximumFractionDigits: dec } : { maximumFractionDigits: 2 });
    return (v) => v == null ? "\u2014" : nf.format(v) + suffix;
  }
  function niceTicks(min, max, count = 4) {
    if (min === max) {
      max = min + 1;
    }
    const span = max - min, step0 = span / count, mag = 10 ** Math.floor(Math.log10(step0));
    const step = [1, 2, 2.5, 5, 10].map((k) => k * mag).find((s) => s >= step0);
    const lo = Math.floor(min / step) * step, hi = Math.ceil(max / step) * step;
    const out = [];
    for (let v = lo; v <= hi + step / 2; v += step) out.push(+v.toFixed(10));
    return out;
  }
  var seriesClass = (i, n2) => n2 === 1 ? "s-accent" : `s-${i % 8 + 1}`;
  function dataTable(o, fmt) {
    const t = h(
      "table",
      { class: "sr-only" },
      h("caption", { text: o.title || "Chart data" }),
      h("thead", {}, h("tr", {}, h("th", { scope: "col", text: o.xLabel || "" }), o.series.map((s) => h("th", { scope: "col", text: s.name || "Value" })))),
      h("tbody", {}, o.labels.map((l, i) => h("tr", {}, h("th", { scope: "row", text: l }), o.series.map((s) => h("td", { text: fmt(s.values[i]) })))))
    );
    return t;
  }
  function legend(o) {
    if (o.series.length < 2 && o.type !== "donut") return null;
    const items = o.type === "donut" ? o.labels.map((l, i) => [l, seriesClass(i, 2), o.series[0].values[i]]) : o.series.map((s, i) => [s.name, seriesClass(i, o.series.length)]);
    const fmt = formatter(o.format, o.locale);
    return h("ul", { class: "chart-legend" }, items.map(([name, cls, v]) => h("li", { class: cls }, h("span", { class: `chart-swatch${o.type === "line" ? " chart-swatch-line" : ""}`, "aria-hidden": "true" }), v != null ? `${name} \xB7 ${fmt(v)}` : name)));
  }
  function tooltipLayer(canvas) {
    let tip = $(".chart-tooltip", canvas);
    if (!tip) {
      tip = h("div", { class: "chart-tooltip", "aria-hidden": "true" });
      canvas.append(tip);
    }
    return {
      show(x, y, title, rows) {
        tip.replaceChildren(h("strong", { text: title }), ...rows.map(([name, val, cls]) => h("div", { class: `chart-tooltip-row ${cls || ""}` }, h("span", { class: "chart-swatch", "aria-hidden": "true" }), name ? h("span", { text: name }) : null, h("b", { text: val }))));
        tip.setAttribute("data-show", "");
        const cw = canvas.clientWidth;
        const tw = tip.offsetWidth;
        tip.style.left = `${Math.max(0, Math.min(cw - tw, x + 12))}px`;
        tip.style.top = `${Math.max(0, y - tip.offsetHeight - 10)}px`;
      },
      hide() {
        tip.removeAttribute("data-show");
      }
    };
  }
  function renderXY(canvas, o) {
    const W = Math.max(280, canvas.clientWidth || 560), H = o.height || 220;
    const pad = { t: 12, r: o.type === "line" && o.series.length > 1 && o.series.length <= 4 ? 64 : 12, b: 26, l: 40 };
    const fmt = formatter(o.format, o.locale);
    const all = o.series.flatMap((s) => s.values).filter((v) => v != null);
    const ticks = niceTicks(Math.min(0, ...all), Math.max(...all));
    const y0 = ticks[0], y1 = ticks[ticks.length - 1];
    const iw = W - pad.l - pad.r, ih = H - pad.t - pad.b, n2 = o.labels.length;
    const Y = (v) => pad.t + ih - (v - y0) / (y1 - y0) * ih;
    const bar = o.type === "bar";
    const X = (i) => bar ? pad.l + iw / n2 * (i + 0.5) : pad.l + (n2 === 1 ? iw / 2 : iw / (n2 - 1) * i);
    const svg = S("svg", { viewBox: `0 0 ${W} ${H}`, role: "img", "aria-label": o.summary || `${o.title || "Chart"}: ${o.series.map((s) => `${s.name || "value"} from ${fmt(s.values[0])} to ${fmt(s.values.at(-1))}`).join("; ")}`, tabindex: "0", focusable: "true" });
    const grid = S("g", { class: "chart-grid" }), axis = S("g", { class: "chart-axis" });
    ticks.forEach((t) => {
      grid.append(S("line", { x1: pad.l, x2: W - pad.r, y1: Y(t), y2: Y(t) }));
      axis.append(S("text", { x: pad.l - 8, y: Y(t) + 3, "text-anchor": "end", text: fmt(t) }));
    });
    axis.append(S("line", { class: "chart-baseline", x1: pad.l, x2: W - pad.r, y1: Y(Math.max(0, y0)), y2: Y(Math.max(0, y0)) }));
    const step = Math.ceil(n2 / Math.max(1, Math.floor(iw / 56)));
    o.labels.forEach((l, i) => {
      if (i % step === 0 || i === n2 - 1) axis.append(S("text", { x: X(i), y: H - 8, "text-anchor": "middle", text: l }));
    });
    svg.append(grid, axis);
    const marks = S("g");
    if (bar) {
      const groupW = iw / n2 * 0.72, bw = (groupW - 2 * (o.series.length - 1)) / o.series.length;
      o.series.forEach((s, si) => s.values.forEach((v, i) => {
        if (v == null) return;
        const x = X(i) - groupW / 2 + si * (bw + 2), y = Y(Math.max(0, v)), hgt = Math.abs(Y(v) - Y(0)), r = Math.min(4, bw / 2, hgt);
        const d = `M${x},${y + hgt} V${y + r} Q${x},${y} ${x + r},${y} H${x + bw - r} Q${x + bw},${y} ${x + bw},${y + r} V${y + hgt} Z`;
        marks.append(S("path", { class: `chart-bar ${seriesClass(si, o.series.length)}`, d }));
      }));
    } else {
      o.series.forEach((s, si) => {
        const pts = s.values.map((v, i) => v == null ? null : [X(i), Y(v)]);
        const d = pts.reduce((acc, p, i) => p ? acc + `${acc && pts[i - 1] ? "L" : "M"}${p[0].toFixed(1)},${p[1].toFixed(1)}` : acc, "");
        const cls = seriesClass(si, o.series.length);
        if (o.type === "area") marks.append(S("path", { class: `chart-area ${cls}`, d: `${d}L${X(n2 - 1)},${Y(Math.max(0, y0))}L${X(0)},${Y(Math.max(0, y0))}Z` }));
        marks.append(S("path", { class: `chart-line ${cls}`, d }));
        const last = pts.findLast((p) => p);
        if (last && o.series.length > 1 && o.series.length <= 4) marks.append(S("text", { class: "chart-direct-label", x: last[0] + 8, y: last[1] + 4, text: s.name }));
      });
    }
    svg.append(marks);
    const cross = S("line", { class: "chart-crosshair", y1: pad.t, y2: pad.t + ih, opacity: 0 });
    const dots = S("g");
    svg.append(cross, dots);
    const tip = tooltipLayer(canvas);
    let idx = -1;
    const show = (i) => {
      idx = Math.max(0, Math.min(n2 - 1, i));
      const x = X(idx);
      if (!bar) {
        cross.setAttribute("x1", x);
        cross.setAttribute("x2", x);
        cross.setAttribute("opacity", 1);
      }
      dots.replaceChildren(...bar ? [] : o.series.map((s, si) => s.values[idx] == null ? null : S("circle", { class: `chart-dot ${seriesClass(si, o.series.length)}`, cx: x, cy: Y(s.values[idx]), r: 4 })).filter(Boolean));
      const scale = canvas.clientWidth / W;
      tip.show(x * scale, Math.min(...o.series.map((s) => Y(s.values[idx] ?? y0))) * scale, o.labels[idx], o.series.map((s, si) => [o.series.length > 1 ? s.name : "", fmt(s.values[idx]), seriesClass(si, o.series.length)]));
    };
    const hide = () => {
      cross.setAttribute("opacity", 0);
      dots.replaceChildren();
      tip.hide();
    };
    svg.addEventListener("pointermove", (e) => {
      const r = svg.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width * W;
      const i = bar ? Math.floor((x - pad.l) / iw * n2) : Math.round((x - pad.l) / iw * (n2 - 1));
      if (i >= 0 && i < n2) show(i);
    });
    svg.addEventListener("pointerleave", hide);
    svg.addEventListener("blur", hide);
    svg.addEventListener("keydown", (e) => {
      if (e.key === "ArrowRight") {
        e.preventDefault();
        show(idx + 1);
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        show(idx < 0 ? n2 - 1 : idx - 1);
      } else if (e.key === "Escape") hide();
    });
    svg.addEventListener("focus", () => show(idx < 0 ? n2 - 1 : idx));
    return svg;
  }
  function renderDonut(canvas, o) {
    const vals = o.series[0].values, total = vals.reduce((a, b) => a + b, 0) || 1, fmt = formatter(o.format, o.locale);
    const R = 52, C = 2 * Math.PI * R, gap = 2;
    const svg = S("svg", { viewBox: "0 0 140 140", role: "img", "aria-label": o.summary || `${o.title || "Breakdown"}: ${o.labels.map((l, i) => `${l} ${fmt(vals[i])}`).join(", ")}` });
    svg.append(S("circle", { class: "donut-track", cx: 70, cy: 70, r: R, "stroke-width": 14 }));
    let acc = 0;
    vals.forEach((v, i) => {
      const len = v / total * C;
      svg.append(S("circle", { class: `donut-seg ${seriesClass(i, 2)}`, cx: 70, cy: 70, r: R, "stroke-width": 14, "stroke-dasharray": `${Math.max(0, len - gap)} ${C}`, "stroke-dashoffset": -acc, transform: "rotate(-90 70 70)" }, S("title", { text: `${o.labels[i]}: ${fmt(v)}` })));
      acc += len;
    });
    if (o.center) {
      svg.append(S("text", { class: "donut-center", x: 70, y: 74, "text-anchor": "middle", text: o.center }));
      if (o.centerLabel) svg.append(S("text", { class: "donut-center-label", x: 70, y: 90, "text-anchor": "middle", text: o.centerLabel }));
    }
    const wrap = h("div", { class: "donut" }, svg, legend(o));
    return wrap;
  }
  function renderGauge(el, o) {
    const v = Math.max(0, Math.min(100, Number(o.value))), R = 54, len = Math.PI * R;
    const tone = o.danger != null && v >= o.danger ? "var(--error)" : o.warn != null && v >= o.warn ? "var(--warning)" : "var(--accent)";
    const svg = S(
      "svg",
      { viewBox: "0 0 140 84", role: "img", "aria-label": `${o.label || "Value"}: ${v}%` },
      S("path", { class: "gauge-track", d: "M16 76 A54 54 0 0 1 124 76", "stroke-width": 10 }),
      S("path", { class: "gauge-fill", d: "M16 76 A54 54 0 0 1 124 76", "stroke-width": 10, "stroke-dasharray": len, "stroke-dashoffset": len * (1 - v / 100), style: `--_c:${tone}` }),
      S("text", { class: "gauge-value", x: 70, y: 72, "text-anchor": "middle", text: `${v}` })
    );
    el.replaceChildren(svg, o.label ? h("span", { class: "gauge-label", text: o.label }) : "");
  }
  function sparkline(svg, values) {
    const vals = values || (svg.dataset.values || "").split(",").map(Number).filter((n2) => !Number.isNaN(n2));
    if (!vals.length) return;
    const W = 120, H = 32, min = Math.min(...vals), max = Math.max(...vals), sp = max - min || 1;
    const pts = vals.map((v, i) => [i / (vals.length - 1 || 1) * W, H - 2 - (v - min) / sp * (H - 4)]);
    const d = pts.map((p, i) => `${i ? "L" : "M"}${p[0].toFixed(1)},${p[1].toFixed(1)}`).join("");
    svg.setAttribute("viewBox", `0 0 ${W} ${H}`);
    svg.setAttribute("preserveAspectRatio", "none");
    svg.replaceChildren(S("path", { class: "chart-area s-accent", d: `${d}L${W},${H}L0,${H}Z` }), S("path", { class: "chart-line s-accent", d }));
  }
  define("sparkline", sparkline);
  function chart(el, opts = {}) {
    const ds = el.dataset;
    const o = {
      type: opts.type || ds.type || "line",
      labels: opts.labels || (ds.labels ? ds.labels.split(",") : []),
      series: opts.series || (ds.series ? JSON.parse(ds.series) : []),
      format: opts.format ?? ds.format,
      locale: opts.locale || document.documentElement.lang || void 0,
      title: opts.title || $(".chart-title", el)?.textContent,
      summary: opts.summary || ds.summary,
      center: opts.center ?? ds.center,
      centerLabel: opts.centerLabel ?? ds.centerLabel,
      value: opts.value ?? ds.value,
      label: opts.label ?? ds.label,
      warn: opts.warn ?? (ds.warn != null ? Number(ds.warn) : null),
      danger: opts.danger ?? (ds.danger != null ? Number(ds.danger) : null),
      height: opts.height || (ds.height ? Number(ds.height) : void 0)
    };
    if (o.type === "gauge") {
      renderGauge(el, o);
      return;
    }
    if (!o.labels.length && o.series[0]) o.labels = o.series[0].values.map((_, i) => String(i + 1));
    const canvas = $(".chart-canvas", el) || el;
    const fmt = formatter(o.format, o.locale);
    const draw = () => {
      const node = o.type === "donut" ? renderDonut(canvas, o) : renderXY(canvas, o);
      const tip = $(".chart-tooltip", canvas);
      canvas.replaceChildren(node, ...tip ? [tip] : [], dataTable(o, fmt));
      let lg = $(":scope > .chart-legend", el);
      lg?.remove();
      if (o.type !== "donut") {
        lg = legend(o);
        if (lg) el.append(lg);
      }
    };
    draw();
    if (o.type !== "donut" && typeof ResizeObserver !== "undefined") {
      let w = canvas.clientWidth;
      new ResizeObserver(() => {
        if (Math.abs(canvas.clientWidth - w) > 8) {
          w = canvas.clientWidth;
          draw();
        }
      }).observe(canvas);
    }
    return { update(next) {
      Object.assign(o, next);
      draw();
    } };
  }
  define("chart", chart);

  // src/js/chat.js
  function chat(root) {
    const log = $(".chat-log", root), form = $(".composer", root), input = $(".composer-input", root), send = $(".composer-send", root);
    const nearBottom = () => !log || log.scrollHeight - log.scrollTop - log.clientHeight < 80;
    const scroll = (force) => {
      if (log && (force || nearBottom())) log.scrollTop = log.scrollHeight;
    };
    const syncSend = () => {
      if (send && input) send.disabled = !input.value.trim();
    };
    input?.addEventListener("input", syncSend);
    syncSend();
    input?.addEventListener("keydown", (e) => {
      if (e.key === "Enter" && !e.shiftKey && !e.isComposing) {
        e.preventDefault();
        form?.requestSubmit();
      }
    });
    form?.addEventListener("submit", (e) => {
      e.preventDefault();
      const text = input.value.trim();
      if (!text) return;
      api.add({ role: "user", text });
      input.value = "";
      syncSend();
      emit(root, "submit", { text });
    });
    const api = {
      /** Add a message. `text` is inserted as text; `html` only for trusted, sanitised markup. */
      add({ role = "assistant", text = "", html, name } = {}) {
        $(".chat-empty", log)?.remove();
        const body = h("div", { class: "message-body" });
        if (html) body.innerHTML = html;
        else text.split(/\n{2,}/).forEach((p) => body.append(h("p", { text: p })));
        const msg = h("div", { class: `message${role === "user" ? " message-user" : ""}` }, role === "user" ? null : h("span", { class: "message-avatar", "aria-hidden": "true", text: name || "AI" }), body);
        log.append(msg);
        scroll(role === "user");
        return msg;
      },
      thinking(label = "Thinking\u2026") {
        const msg = h(
          "div",
          { class: "message", "data-thinking": "" },
          h("span", { class: "message-avatar", "aria-hidden": "true", text: "AI" }),
          h("div", { class: "message-body" }, h("span", { class: "thinking" }, h("span", { class: "thinking-dots", "aria-hidden": "true" }, h("span"), h("span"), h("span")), h("span", { class: "thinking-shimmer", text: label })))
        );
        log.append(msg);
        scroll();
        return { done: () => msg.remove() };
      },
      /** Stream text into a new assistant message. Accepts a string (typed out) or an async iterable of chunks. */
      async stream(source, { speed = 14 } = {}) {
        $("[data-thinking]", log)?.remove();
        const p = h("p", { class: "streaming" });
        const msg = api.add({ role: "assistant" });
        $(".message-body", msg).replaceChildren(p);
        log.setAttribute("aria-busy", "true");
        if (typeof source === "string") {
          for (const ch of source) {
            p.textContent += ch;
            scroll();
            await new Promise((r) => setTimeout(r, speed));
          }
        } else for await (const chunk of source) {
          p.textContent += chunk;
          scroll();
        }
        p.classList.remove("streaming");
        log.removeAttribute("aria-busy");
        $(".message-body", msg).append(h("div", { class: "message-actions" }, h("button", { class: "btn btn-icon btn-ghost btn-sm", "aria-label": "Copy", "data-forma": "copy", "data-copy-text": p.textContent }, icon("copy"))));
        return msg;
      },
      clear() {
        log.replaceChildren();
      }
    };
    root._forma = api;
    scroll(true);
    return api;
  }
  define("chat", chat);

  // src/js/index.js
  /*!
   * FORMA — tiny, dependency-free behaviour layer.
   * Everything is optional: CSS works alone; this adds keyboard support, ARIA wiring and
   * a few interactive components. Auto-initialises [data-forma] elements, including ones
   * added later (MutationObserver).
   */
  var version = true ? "6.0.1" : "dev";
  async function copy(text) {
    try {
      await navigator.clipboard.writeText(text);
      announce("Copied to clipboard");
      return true;
    } catch {
      return false;
    }
  }
  function start() {
    setupDialogs();
    setupPopovers();
    init(document);
    observe();
  }
  if (typeof document !== "undefined") {
    restoreMode();
    if (document.documentElement.hasAttribute("data-forma-restore-theme")) theme.restore();
    if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", start, { once: true });
    else start();
  }
  return __toCommonJS(index_exports);
})();
window.Forma=Forma;
