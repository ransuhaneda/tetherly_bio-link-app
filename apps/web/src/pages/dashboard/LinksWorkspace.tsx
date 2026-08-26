import sty from './WorkspacePage.module.scss';

import { useCreatorWorkspace } from '@/features/creator-workspace/useCreatorWorkspace';

export function LinksWorkspace() {
  const { links } = useCreatorWorkspace();

  return (
    <article className={sty.card}>
      <h2>Your destinations</h2>
      {links.length === 0 ? (
        <p className={sty.empty}>No links have been added yet.</p>
      ) : (
        <ul className={sty.list}>
          {links.map(link => (
            <li key={link.id}>
              <strong>{link.label}</strong>
              <span>{link.url}</span>
            </li>
          ))}
        </ul>
      )}
      <p className={sty.note}>
        Link editing and ordering will connect here in the next workspace step.
      </p>
    </article>
  );
}
