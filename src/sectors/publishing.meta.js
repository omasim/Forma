import { ic } from './_helpers.js';
export default [
  { id: 'manuscript', name: 'Manuscript', category: 'Sector · Publishing', sector: 'publishing', description: 'Book-page layout with chapter label and indented paragraphs.',
    classes: { base: 'manuscript', parts: ['manuscript-chapter', 'manuscript-title'] },
    examples: [{ title: 'Manuscript', html: `<article class="manuscript"><p class="manuscript-chapter">Chapter III</p><h2 class="manuscript-title">Nun and Vav</h2><p>The ink had dried long before the letter reached him.<a class="fn-ref" href="#fn1" id="r1">1</a> He read it twice, the second time aloud.</p><p>Outside, the Bosphorus carried the evening in slow, deliberate strokes.</p><aside class="footnotes"><ol><li id="fn1">The letter is dated 1923. <a href="#r1" aria-label="Back to text">↩</a></li></ol></aside></article>` }] },
  { id: 'editor-toolbar', name: 'Editor Toolbar', category: 'Sector · Publishing', sector: 'publishing', description: 'Formatting toolbar with pressed states (role="toolbar", arrow-key navigation).',
    classes: { base: 'toolbar', parts: ['toolbar-btn', 'toolbar-sep'] },
    examples: [{ title: 'Toolbar', html: `<div class="toolbar" role="toolbar" aria-label="Formatting" data-forma="toolbar"><button class="toolbar-btn" aria-pressed="true" aria-label="Bold">${ic('bold')}</button><button class="toolbar-btn" aria-pressed="false" aria-label="Italic">${ic('italic')}</button><button class="toolbar-btn" aria-pressed="false" aria-label="Underline">${ic('underline')}</button><span class="toolbar-sep" role="separator"></span><button class="toolbar-btn" aria-label="Heading">H2</button><button class="toolbar-btn" aria-label="Quote">${ic('quote')}</button><button class="toolbar-btn" aria-label="Link">${ic('link')}</button></div>` }] },
  { id: 'revisions', name: 'Revision Marks', category: 'Sector · Publishing', sector: 'publishing', description: 'Insertions, deletions and comments — semantic <ins>/<del>.',
    classes: { base: 'rev', parts: ['rev-add', 'rev-del', 'rev-comment'] },
    examples: [{ title: 'Track changes', html: `<p class="t-body">The system <del class="rev">uses</del> <ins class="rev">proves</ins> contrast for <span class="rev-comment" title="Elena: say how many">every theme</span> at build time.</p>` }] },
  { id: 'footnotes', name: 'Footnotes', category: 'Sector · Publishing', sector: 'publishing', description: 'Linked footnote references and a back-linked list.',
    classes: { base: 'footnotes', parts: ['fn-ref'] },
    examples: [{ title: 'Footnotes', html: `<p class="t-body">Every token is checked.<a class="fn-ref" href="#fn-a" id="fr-a">1</a></p><aside class="footnotes"><ol><li id="fn-a">Against WCAG 2.2 AA. <a href="#fr-a" aria-label="Back to text">↩</a></li></ol></aside>` }] },
];
