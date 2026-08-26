import sty from './WorkspacePage.module.scss';

import { useCreatorWorkspace } from '@/features/creator-workspace/useCreatorWorkspace';

export function PreviewWorkspace() {
  const { profile, links } = useCreatorWorkspace();
  const enabledLinks = links.filter(link => link.enabled).length;

  return (
    <article className={sty.card}>
      <h2>Draft readiness</h2>
      <ul className={sty.checklist}>
        <li>
          {profile?.display_name
            ? 'Profile identity ready'
            : 'Profile identity needs a display name'}
        </li>
        <li>
          {enabledLinks > 0
            ? `${enabledLinks} enabled link${enabledLinks === 1 ? '' : 's'} ready`
            : 'Add an enabled link to continue'}
        </li>
        <li>
          {profile?.publication_state === 'published'
            ? 'A published snapshot exists'
            : 'This profile is still a draft'}
        </li>
      </ul>
      <p className={sty.note}>
        The final profile renderer and publishing controls will be added after
        this data boundary.
      </p>
    </article>
  );
}
