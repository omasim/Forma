import { ic } from './_helpers.js';
export default [
  { id: 'query-editor', name: 'Query Editor', category: 'Sector · Data', sector: 'data', description: 'SQL editor shell with gutter, run bar and status.',
    classes: { base: 'query', parts: ['query-bar', 'query-editor', 'query-gutter', 'query-code', 'query-status'] },
    examples: [{ title: 'Query', html: `<section class="query"><div class="query-bar"><button class="btn btn-sm btn-accent">${ic('play')} Run</button><span class="kbd">⌘↵</span><span class="ms-auto t-meta t-tertiary">nage_prod</span></div><div class="query-editor"><span class="query-gutter" aria-hidden="true">1
2
3</span><pre class="query-code" contenteditable="true" spellcheck="false" role="textbox" aria-multiline="true" aria-label="SQL"><span class="tok-k">SELECT</span> model, <span class="tok-k">avg</span>(loss)
<span class="tok-k">FROM</span> runs <span class="tok-k">WHERE</span> stage = <span class="tok-s">'DPO'</span>
<span class="tok-k">GROUP BY</span> model;</pre></div><div class="query-status"><span data-ok>✓ 3 rows</span><span>42 ms</span></div></section>` }] },
  { id: 'result-grid', name: 'Result Grid', category: 'Sector · Data', sector: 'data', description: 'Monospace result table with types and NULLs.',
    classes: { base: 'result-grid', parts: ['null', 'cell-type'] },
    examples: [{ title: 'Results', html: `<div class="table-wrap"><table class="table result-grid"><thead><tr><th scope="col">model<span class="cell-type">text</span></th><th scope="col" class="num">avg<span class="cell-type">float8</span></th></tr></thead><tbody><tr><td>forge-14b</td><td class="num">0.412</td></tr><tr><td>fehm-8b</td><td class="num">0.338</td></tr><tr><td>cortex-14b</td><td class="null">NULL</td></tr></tbody></table></div>` }] },
  { id: 'notebook-cell', name: 'Notebook Cell', category: 'Sector · Data', sector: 'data', description: 'Input/output cell with execution count.',
    classes: { base: 'notebook-cell', parts: ['notebook-count', 'notebook-input', 'notebook-output'] },
    examples: [{ title: 'Cell', html: `<div class="notebook-cell"><span class="notebook-count">[3]</span><pre class="notebook-input" tabindex="0"><span class="tok-k">import</span> forma
forma.contrast(<span class="tok-s">"#4BD7C9"</span>, <span class="tok-s">"#090806"</span>)</pre><div class="notebook-output"><code>11.42</code></div></div>` }] },
  { id: 'schema-tree', name: 'Schema Tree', category: 'Sector · Data', sector: 'data', description: 'Database schema browser — the core Tree View with types.',
    classes: { base: 'tree', parts: ['tree-item', 'tree-meta'] },
    examples: [{ title: 'Schema', html: `<ul class="tree" role="tree" aria-label="Schema" data-forma="tree"><li role="treeitem" aria-expanded="true"><span class="tree-item">${ic('table')} runs</span><ul role="group"><li role="treeitem"><span class="tree-item">id <span class="tree-meta">uuid</span></span></li><li role="treeitem"><span class="tree-item">loss <span class="tree-meta">float8</span></span></li></ul></li></ul>` }] },
];
