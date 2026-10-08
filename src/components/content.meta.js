import { ic } from './_helpers.js';

export default [
  {
    id: 'prose', name: 'Prose', category: 'Content',
    description: 'Long-form typography for articles and docs: display headings, measured line length, lead paragraph, drop cap.',
    classes: { base: 'prose', parts: ['lead', 'dropcap'] },
    examples: [{ title: 'Article body', html: `<div class="prose">
  <p class="lead">Typography is the craft of making written language legible, readable and appealing.</p>
  <p class="dropcap">It is not only a choice of typeface. It is hierarchy, rhythm, and the management of space — the interval between letters, lines and ideas. <a href="#">Read more about rhythm</a>.</p>
  <h2>A system, not a style</h2>
  <p>Cormorant carries the display voice; Syne handles the interface; JetBrains Mono marks metadata. <strong>Each has one job.</strong></p>
  <ul><li>Measure stays near 68 characters.</li><li>Headings balance their lines.</li><li>Paragraphs avoid orphans.</li></ul>
</div>` }],
    v5: { 'article-body': 'prose' },
  },
  {
    id: 'article-header', name: 'Article Header', category: 'Content',
    description: 'Kicker, headline, dek and byline for editorial pages.',
    classes: { base: 'article-header', parts: ['article-kicker', 'article-title', 'article-dek', 'byline', 'byline-name', 'byline-sep'] },
    examples: [{ title: 'Header', html: `<header class="article-header"><p class="article-kicker">Essay · Cognition</p><h1 class="article-title">The Architecture of Silence</h1><p class="article-dek">On the space between signals, and why good interfaces leave room for thought.</p>
  <div class="byline"><span class="avatar avatar-sm avatar-accent">ÖA</span><span class="byline-name">Ömer Asım</span><span class="byline-sep">·</span><time datetime="2026-10-08">8 October 2026</time><span class="byline-sep">·</span><span>8 min read</span></div></header>` }],
    v5: { 'article-hero / article-meta / article-author': 'article-header / byline' },
  },
  {
    id: 'post', name: 'Blog Card', category: 'Content',
    description: 'Post tiles and a featured post, whole-card clickable.',
    classes: { base: 'post', modifiers: ['post-featured'], parts: ['post-grid', 'post-media', 'post-category', 'post-title', 'post-excerpt', 'post-meta'] },
    examples: [{ title: 'Posts', html: `<div class="post-grid">
  <article class="post"><div class="post-media">${ic('image', 'fi-2xl fi-tertiary')}</div><p class="post-category">Design</p><h3 class="post-title"><a href="#">Why design systems matter</a></h3><p class="post-excerpt">Consistency at scale is not a style — it is an agreement.</p><p class="post-meta"><span>Elena V.</span>·<time>18 Mar 2026</time></p></article>
  <article class="post"><div class="post-media">${ic('image', 'fi-2xl fi-tertiary')}</div><p class="post-category">Engineering</p><h3 class="post-title"><a href="#">Proving contrast at build time</a></h3><p class="post-excerpt">How FORMA computes and checks every token in 55 themes.</p><p class="post-meta"><span>Chris K.</span>·<time>12 Mar 2026</time></p></article>
</div>` }],
    v5: { 'blog-grid / blog-card / blog-featured': 'post-grid / post / post-featured' },
  },
  {
    id: 'hero', name: 'Hero', category: 'Content',
    description: 'Opening sections: eyebrow, display headline, text, actions, meta numbers. Left, centered or split.',
    classes: { base: 'hero', modifiers: ['hero-center', 'hero-split'], parts: ['hero-eyebrow', 'hero-title', 'hero-text', 'hero-actions', 'hero-meta', 'hero-meta-value', 'hero-meta-label', 'hero-visual'] },
    examples: [{ title: 'Hero', html: `<section class="hero">
  <p class="hero-eyebrow">Design system · v6</p>
  <h1 class="hero-title">Every measurement follows a <em>rule</em>.</h1>
  <p class="hero-text">One stylesheet. 55 themes, each proven against WCAG. Components that speak HTML, ARIA and AI.</p>
  <div class="hero-actions"><a class="btn btn-lg btn-primary" href="#">Get started</a><a class="btn btn-lg btn-ghost" href="#">Browse themes ${ic('arrow-right')}</a></div>
  <div class="hero-meta"><div><span class="hero-meta-value">90+</span><span class="hero-meta-label">components</span></div><div><span class="hero-meta-value">55</span><span class="hero-meta-label">themes</span></div><div><span class="hero-meta-value">0</span><span class="hero-meta-label">runtime deps</span></div></div>
</section>` }],
    v5: { 'hero-headline / hero-sub': 'hero-title / hero-text', 'hero-centered': 'hero-center' },
  },
  {
    id: 'props', name: 'Proposition Strip', category: 'Content',
    description: 'The FORMA signature: four words with definitions, ruled like a gallery wall.',
    classes: { base: 'props', parts: ['prop', 'prop-word', 'prop-def'] },
    examples: [{ title: 'Propositions', html: `<div class="props">
  <div class="prop"><p class="prop-word"><em>Rhythm</em></p><p class="prop-def">A 4px grid governs every interval.</p></div>
  <div class="prop"><p class="prop-word">Restraint</p><p class="prop-def">Hierarchy through tone, never decoration.</p></div>
  <div class="prop"><p class="prop-word">Proof</p><p class="prop-def">Every color token is contrast-checked.</p></div>
  <div class="prop"><p class="prop-word">Intent</p><p class="prop-def">Each typeface has one job.</p></div>
</div>` }],
    v5: { 'prop-strip / prop-item / prop-item-word': 'props / prop / prop-word' },
  },
  {
    id: 'section-head', name: 'Section Heading', category: 'Content',
    description: 'Numbered section opener with accent rule.',
    classes: { base: 'section-head', parts: ['section-number', 'section-title', 'section-desc'] },
    examples: [{ title: 'Section heading', html: `<header class="section-head"><p class="section-number">03 · Spacing</p><h2 class="section-title">A four-pixel rhythm</h2><p class="section-desc">Ten steps, from 4 to 128 pixels, used for every gap, pad and margin.</p></header>` }],
  },
  {
    id: 'toc', name: 'Table of Contents', category: 'Content',
    description: 'Sticky in-page navigation with scroll-spy and reading progress.',
    classes: { base: 'toc', parts: ['toc-title', 'toc-progress'] },
    examples: [{ title: 'TOC', html: `<nav class="toc" aria-labelledby="toc-t" data-forma="toc" style="position:static;max-inline-size:240px"><p class="toc-title" id="toc-t">On this page</p>
  <ol><li><a href="#" aria-current="true">Introduction</a></li><li><a href="#">Tokens</a><ol><li><a href="#">Color</a></li><li><a href="#">Spacing</a></li></ol></li><li><a href="#">Components</a></li></ol>
  <div class="toc-progress"><span style="--progress:35%"></span></div></nav>` }],
    js: { auto: 'data-forma="toc"', api: 'Forma.toc(nav, { headings: "h2, h3" })' },
  },
  {
    id: 'quote', name: 'Quotes', category: 'Content',
    description: 'Blockquote, pull quote and testimonial.',
    classes: { base: 'blockquote', parts: ['pullquote', 'quote-cite', 'testimonial', 'testimonial-text'] },
    examples: [{ title: 'Quotes', html: `<div class="stack gap-6">
  <blockquote class="blockquote"><p>Design is not just what it looks like and feels like. Design is how it works.</p><footer>— Steve Jobs, 2003</footer></blockquote>
  <figure class="pullquote"><p>Hierarchy through tone, never through decoration.</p><figcaption class="quote-cite">FORMA principle no. 2</figcaption></figure>
</div>` }],
  },
  {
    id: 'gallery', name: 'Gallery', category: 'Content',
    description: 'Image grid with captions and a dialog lightbox with arrow-key navigation.',
    classes: { base: 'gallery', parts: ['gallery-item', 'gallery-caption', 'gallery-wide', 'lightbox', 'lightbox-caption', 'lightbox-nav', 'lightbox-prev', 'lightbox-next'] },
    examples: [{ title: 'Gallery', html: `<ul class="gallery" data-forma="gallery">
  <li><a class="gallery-item gallery-wide" href="#" aria-label="Hall A, view 1"><span class="gallery-caption">Hall A — north light</span></a></li>
  <li><a class="gallery-item" href="#" aria-label="Object 47"><span class="gallery-caption">Object no. 47</span></a></li>
  <li><a class="gallery-item" href="#" aria-label="Study in grey"><span class="gallery-caption">Study in grey</span></a></li>
  <li><a class="gallery-item" href="#" aria-label="Archive"><span class="gallery-caption">The archive</span></a></li>
</ul>` }],
    js: { auto: 'data-forma="gallery"' },
  },
  {
    id: 'comments', name: 'Comments', category: 'Content',
    description: 'Threaded comments with actions and a reply form.',
    classes: { base: 'comments', parts: ['comment', 'comment-head', 'comment-author', 'comment-time', 'comment-text', 'comment-actions', 'comment-form'] },
    examples: [{ title: 'Thread', html: `<ul class="comments">
  <li class="comment"><span class="avatar avatar-sm avatar-accent">EV</span><div><div class="comment-head"><span class="comment-author">Elena V.</span><span class="badge badge-accent">Author</span><time class="comment-time">2h</time></div><p class="comment-text">The chart component needs a table fallback — screen readers can't read the SVG.</p>
    <div class="comment-actions"><button class="btn btn-ghost btn-sm">${ic('thumbs-up')} 4</button><button class="btn btn-ghost btn-sm">Reply</button></div>
    <ul class="comments"><li class="comment"><span class="avatar avatar-sm avatar-info">CK</span><div><div class="comment-head"><span class="comment-author">Chris K.</span><time class="comment-time">1h</time></div><p class="comment-text">Added in 6.0: every chart renders a hidden data table.</p></div></li></ul></div></li>
</ul>` }],
  },
];
