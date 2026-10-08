import { ic } from './_helpers.js';

export default [
  {
    id: 'product', name: 'Product Card', category: 'Commerce',
    description: 'Product tile: media, flag, favourite, name (whole card clickable), price, swatches, add-to-cart.',
    classes: { base: 'product', parts: ['product-grid', 'product-media', 'product-flag', 'product-fav', 'product-body', 'product-name', 'product-desc', 'product-foot', 'swatches', 'swatch', 'price', 'price-current', 'price-old', 'price-period'] },
    examples: [{ title: 'Products', html: `<div class="product-grid">
  <article class="product"><div class="product-media">${ic('briefcase', 'fi-2xl fi-tertiary')}<span class="badge badge-accent product-flag">New</span><button class="btn btn-icon btn-sm btn-ghost product-fav" aria-label="Save Leather bag" aria-pressed="false">${ic('heart')}</button></div>
    <div class="product-body"><a class="product-name" href="#">Minimal leather bag</a><p class="product-desc">Hand-stitched natural leather, fits 15″.</p><div class="rating"><span class="rating-stars" style="--rating:4.5" role="img" aria-label="4.5 out of 5"></span>(48)</div>
      <div class="swatches" role="group" aria-label="Colour"><button class="swatch" style="--_c:#2b2118" aria-label="Espresso" aria-pressed="true"></button><button class="swatch" style="--_c:#a8784f" aria-label="Tan" aria-pressed="false"></button></div>
      <div class="product-foot"><span class="price"><span class="price-current">$129</span></span><button class="btn btn-sm btn-primary">Add to cart</button></div></div></article>
  <article class="product"><div class="product-media">${ic('headphones', 'fi-2xl fi-tertiary')}<span class="badge badge-error product-flag">−30%</span></div>
    <div class="product-body"><a class="product-name" href="#">Wireless headphones Pro</a><p class="product-desc">ANC, 40-hour battery.</p><div class="rating"><span class="rating-stars" style="--rating:4" role="img" aria-label="4 out of 5"></span>(124)</div>
      <div class="product-foot"><span class="price"><span class="price-current">$245</span><span class="price-old">$350</span></span><button class="btn btn-sm btn-primary">Add to cart</button></div></div></article>
</div>` }],
    a11y: ['The name link stretches over the card; inner buttons stay independently clickable.', 'Swatches are toggle buttons named by colour.'],
    v5: { 'product-card / product-image / product-price-current': 'product / product-media / price-current' },
  },
  {
    id: 'rating', name: 'Rating', category: 'Commerce',
    description: 'Fractional star display, an accessible radio-based input, and a review summary.',
    classes: { base: 'rating', parts: ['rating-stars', 'rating-input', 'rating-summary', 'rating-score', 'rating-bars', 'rating-bar'], attributes: ['--rating'] },
    examples: [{ title: 'Rating', html: `<div class="grid-2">
  <div class="rating-summary"><div><p class="rating-score">4.3</p><span class="rating-stars" style="--rating:4.3" role="img" aria-label="4.3 out of 5"></span><p class="t-caption t-tertiary">191 reviews</p></div>
    <div class="rating-bars"><div class="rating-bar"><span>5</span><span style="--value:55%"></span><span>105</span></div><div class="rating-bar"><span>4</span><span style="--value:25%"></span><span>48</span></div><div class="rating-bar"><span>3</span><span style="--value:12%"></span><span>23</span></div><div class="rating-bar"><span>2</span><span style="--value:5%"></span><span>10</span></div><div class="rating-bar"><span>1</span><span style="--value:3%"></span><span>5</span></div></div></div>
  <fieldset class="field"><legend class="field-label">Your rating</legend><div class="rating-input">
    <input type="radio" id="rt5" name="rt" value="5"><label for="rt5" title="5 stars">★<span class="sr-only">5 stars</span></label>
    <input type="radio" id="rt4" name="rt" value="4" checked><label for="rt4" title="4 stars">★<span class="sr-only">4 stars</span></label>
    <input type="radio" id="rt3" name="rt" value="3"><label for="rt3">★<span class="sr-only">3 stars</span></label>
    <input type="radio" id="rt2" name="rt" value="2"><label for="rt2">★<span class="sr-only">2 stars</span></label>
    <input type="radio" id="rt1" name="rt" value="1"><label for="rt1">★<span class="sr-only">1 star</span></label>
  </div></fieldset>
</div>` }],
  },
  {
    id: 'cart', name: 'Cart & Summary', category: 'Commerce',
    description: 'Cart lines with steppers, and an order summary block.',
    classes: { base: 'cart', parts: ['cart-line', 'cart-thumb', 'cart-name', 'cart-meta', 'cart-line-end', 'cart-line-price', 'summary', 'summary-row', 'summary-total'] },
    examples: [{ title: 'Cart', html: `<div class="grid-2">
  <div class="cart">
    <div class="cart-line"><span class="cart-thumb">${ic('briefcase', 'fi-lg fi-tertiary')}</span><div><p class="cart-name">Minimal leather bag</p><p class="cart-meta">Espresso · Standard</p></div><div class="cart-line-end"><span class="cart-line-price">$129.00</span><div class="stepper stepper-sm" data-forma="stepper"><button type="button" aria-label="Decrease" data-step="-1">−</button><input type="number" value="1" min="0" aria-label="Quantity"><button type="button" aria-label="Increase" data-step="1">+</button></div></div></div>
    <div class="cart-line"><span class="cart-thumb">${ic('coffee', 'fi-lg fi-tertiary')}</span><div><p class="cart-name">Ceramic cup set</p><p class="cart-meta">Set of 6</p></div><div class="cart-line-end"><span class="cart-line-price">$136.00</span><div class="stepper stepper-sm" data-forma="stepper"><button type="button" aria-label="Decrease" data-step="-1">−</button><input type="number" value="2" min="0" aria-label="Quantity"><button type="button" aria-label="Increase" data-step="1">+</button></div></div></div>
  </div>
  <div class="card card-subtle summary"><div class="summary-row"><span>Subtotal</span><span>$265.00</span></div><div class="summary-row"><span>Shipping</span><span>Free</span></div><div class="summary-row"><span>Tax</span><span>$53.00</span></div><div class="summary-row summary-total"><span>Total</span><span>$318.00</span></div><button class="btn btn-primary btn-block btn-lg">Checkout</button></div>
</div>` }],
    v5: { 'cart-flyout / cart-item / cart-qty': 'dialog.drawer + cart / cart-line / stepper' },
  },
  {
    id: 'checkout', name: 'Checkout', category: 'Commerce',
    description: 'Two-column checkout: numbered sections and a sticky order summary.',
    classes: { base: 'checkout', parts: ['checkout-aside', 'checkout-section', 'checkout-section-title'] },
    examples: [{ title: 'Checkout layout', html: `<div class="checkout">
  <form><section class="checkout-section"><h3 class="checkout-section-title" data-step="1">Contact</h3><div class="field"><label class="field-label" for="co-mail">E-mail</label><input class="input" id="co-mail" type="email" autocomplete="email"></div></section>
    <section class="checkout-section"><h3 class="checkout-section-title" data-step="2">Shipping</h3><div class="form-grid"><div class="field"><label class="field-label" for="co-city">City</label><input class="input" id="co-city" autocomplete="address-level2"></div><div class="field"><label class="field-label" for="co-zip">Postal code</label><input class="input" id="co-zip" autocomplete="postal-code"></div></div></section></form>
  <aside class="checkout-aside card summary"><p class="card-title">Order</p><div class="summary-row"><span>2 items</span><span>$265.00</span></div><div class="summary-row summary-total"><span>Total</span><span>$318.00</span></div><button class="btn btn-accent btn-block">Pay $318.00</button></aside>
</div>` }],
  },
  {
    id: 'invoice', name: 'Invoice', category: 'Commerce',
    description: 'Printable invoice: header, meta, line items, totals, note. Print styles included.',
    classes: { base: 'invoice', parts: ['invoice-head', 'invoice-brand', 'invoice-from', 'invoice-title', 'invoice-meta', 'invoice-totals', 'invoice-note'] },
    examples: [{ title: 'Invoice', html: `<article class="invoice">
  <header class="invoice-head"><div><p class="invoice-brand">Forma Studio</p><p class="invoice-from">Üsküdar, Istanbul<br>hello@forma.studio</p></div><div><p class="invoice-title">Invoice</p><p class="t-mono t-tertiary">#INV-2026-0042</p></div></header>
  <dl class="invoice-meta"><div><dt>Issued</dt><dd>8 Oct 2026</dd></div><div><dt>Due</dt><dd>7 Nov 2026</dd></div><div><dt>Client</dt><dd>Acme Ltd.</dd></div><div><dt>Status</dt><dd><span class="badge badge-warning">Unpaid</span></dd></div></dl>
  <table class="table"><thead><tr><th scope="col">Description</th><th scope="col" class="num">Qty</th><th scope="col" class="num">Rate</th><th scope="col" class="num">Amount</th></tr></thead>
    <tbody><tr><td>Design system workshop<br><span class="muted t-caption">2 days, on-site</span></td><td class="num">2</td><td class="num">$1,200</td><td class="num">$2,400</td></tr><tr><td>Custom dashboard widgets</td><td class="num">40</td><td class="num">$90</td><td class="num">$3,600</td></tr></tbody></table>
  <div class="invoice-totals summary"><div class="summary-row"><span>Subtotal</span><span>$6,000</span></div><div class="summary-row"><span>VAT 20%</span><span>$1,200</span></div><div class="summary-row summary-total"><span>Total</span><span>$7,200</span></div></div>
  <p class="invoice-note">Thank you. Payment by bank transfer within 30 days.</p>
</article>` }],
  },
  {
    id: 'pricing', name: 'Pricing', category: 'Commerce',
    description: 'Plan cards with a featured plan, billing toggle and feature lists.',
    classes: { base: 'pricing', parts: ['plan', 'plan-featured', 'plan-name', 'plan-tagline', 'plan-price', 'plan-amount', 'plan-period', 'plan-note', 'plan-features', 'plan-features-head'], attributes: ['data-off'] },
    examples: [{ title: 'Plans', html: `<div class="stack gap-5"><div class="segmented" role="radiogroup" aria-label="Billing" style="align-self:center"><label><input type="radio" name="pp" checked> Monthly</label><label><input type="radio" name="pp"> Annual <span class="segmented-badge">−20%</span></label></div>
<div class="pricing">
  <section class="plan"><div><h3 class="plan-name">Free</h3><p class="plan-tagline">For trying things out.</p></div><div><p class="plan-price"><span class="plan-amount">$0</span></p><p class="plan-note">Always free</p></div><ul class="plan-features"><li>Core components</li><li>Museum theme</li><li data-off>All 55 themes</li><li data-off>Priority support</li></ul><button class="btn btn-block">Start</button></section>
  <section class="plan plan-featured"><div><h3 class="plan-name">Pro</h3><p class="plan-tagline">For professionals.</p></div><div><p class="plan-price"><span class="plan-amount">$20</span><span class="plan-period">/ month</span></p><p class="plan-note">Billed monthly</p></div><ul class="plan-features"><li class="plan-features-head">Everything in Free, plus</li><li>All 55 themes</li><li>Figma variables</li><li>Priority support</li></ul><button class="btn btn-accent btn-block">Upgrade to Pro</button></section>
  <section class="plan"><div><h3 class="plan-name">Team</h3><p class="plan-tagline">For organisations.</p></div><div><p class="plan-price"><span class="plan-amount">$49</span><span class="plan-period">/ seat</span></p><p class="plan-note">Min. 5 seats</p></div><ul class="plan-features"><li class="plan-features-head">Everything in Pro, plus</li><li>Custom theme build</li><li>SSO</li><li>SLA</li></ul><button class="btn btn-block">Contact sales</button></section>
</div></div>` }],
    v5: { 'pricing-wrap / pc / pc-featured / pc-amount': 'pricing / plan / plan-featured / plan-amount', 'pc-feat-off': 'li[data-off]' },
  },
  {
    id: 'compare', name: 'Feature Comparison', category: 'Commerce',
    description: 'A comparison table by plan, with a featured column and section rows.',
    classes: { base: 'compare', parts: ['compare-section', 'compare-yes', 'compare-no', 'is-featured'] },
    examples: [{ title: 'Compare plans', html: `<div class="table-wrap"><table class="table compare">
  <thead><tr><td></td><th scope="col">Free</th><th scope="col" class="is-featured">Pro</th><th scope="col">Team</th></tr></thead>
  <tbody>
    <tr class="compare-section"><th colspan="4" scope="colgroup">Usage</th></tr>
    <tr><th scope="row">Themes</th><td>1</td><td class="is-featured">55</td><td>55 + custom</td></tr>
    <tr><th scope="row">Seats</th><td>1</td><td class="is-featured">1</td><td>5+</td></tr>
    <tr class="compare-section"><th colspan="4" scope="colgroup">Support</th></tr>
    <tr><th scope="row">Priority support</th><td><span class="compare-no" aria-label="Not included">—</span></td><td class="is-featured"><span class="compare-yes" aria-label="Included">✓</span></td><td><span class="compare-yes" aria-label="Included">✓</span></td></tr>
    <tr><th scope="row">SLA</th><td><span class="compare-no" aria-label="Not included">—</span></td><td class="is-featured"><span class="compare-no" aria-label="Not included">—</span></td><td><span class="badge badge-warning">Soon</span></td></tr>
  </tbody></table></div>` }],
    v5: { 'fct / fct-col-accent / fct-check': 'table compare / is-featured / compare-yes' },
  },
  {
    id: 'facets', name: 'Filter Facets', category: 'Commerce',
    description: 'Collapsible filter groups with counts and active-filter chips.',
    classes: { base: 'facets', parts: ['facet-count', 'active-filters'] },
    examples: [{ title: 'Facets', html: `<div class="stack gap-4" style="max-inline-size:280px">
  <div class="active-filters"><span class="chip">Under $200 <button class="chip-remove" aria-label="Remove Under $200">×</button></span><button class="btn btn-link btn-sm">Clear all</button></div>
  <div class="facets">
    <details class="disclosure" open><summary>Category</summary><div class="disclosure-body"><label class="check"><input type="checkbox" class="checkbox" checked> Bags <span class="facet-count">24</span></label><label class="check"><input type="checkbox" class="checkbox"> Audio <span class="facet-count">12</span></label><label class="check"><input type="checkbox" class="checkbox"> Home <span class="facet-count">31</span></label></div></details>
    <details class="disclosure"><summary>Price</summary><div class="disclosure-body"><div class="range-dual" data-forma="range-dual"><input type="range" class="range" min="0" max="500" value="0" aria-label="Minimum price"><input type="range" class="range" min="0" max="500" value="200" aria-label="Maximum price"></div></div></details>
  </div>
</div>` }],
    v5: { 'filter-sidebar / filter-group / filter-pill': 'facets / disclosure / chip' },
  },
];
