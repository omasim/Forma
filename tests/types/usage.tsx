// Compile-only check that the public typings describe real usage. `npm run test:types`
import * as Forma from '../../types/forma';
import { FormaProvider, Chart, Icon, useFormaEvent, useDialog } from '../../react/index.js';
import * as React from 'react';

Forma.toast.success('Saved', 'All changes stored');
const c = Forma.chart(document.body, { type: 'line', labels: ['a', 'b'], series: [{ name: 'Loss', values: [1, 2] }], format: "0.0'%'" });
c?.update({ labels: ['x', 'y'] });
Forma.mode.set('dark');
void Forma.theme.set('swiss');
Forma.validate.locale = 'tr';
document.body.addEventListener('forma:tab', (e) => e.detail.index.toFixed());
void Forma.confirm({ title: 'Delete?', danger: true }).then((yes: boolean) => yes);

export function App() {
  const ref = React.useRef<HTMLDivElement>(null);
  useFormaEvent(ref, 'move', (e) => e.detail.to.id);
  const open = useDialog('settings');
  return (
    <FormaProvider theme="swiss" mode="dark">
      <div ref={ref} data-forma="kanban" onClick={open} />
      <Chart type="bar" labels={['a']} series={[{ name: 'A', values: [1] }]} title="Runs" />
      <Icon name="search" label="Search" />
    </FormaProvider>
  );
}
