import { PublicationControls } from './PublicationControls';
import sty from './WorkspacePage.module.scss';

export function PreviewWorkspace() {
  return (
    <article className={sty.card}>
      <p className={sty.utility}>Publication</p>
      <h2>Preview your Tether</h2>
      <PublicationControls />
    </article>
  );
}
