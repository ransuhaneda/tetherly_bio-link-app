import sty from './WorkspacePage.module.scss';

import { useCreatorWorkspace } from '@/features/creator-workspace/useCreatorWorkspace';

export function ProfileWorkspace() {
  const { profile } = useCreatorWorkspace();

  if (!profile) {
    return <p className={sty.empty}>Your profile has no saved data yet.</p>;
  }

  return (
    <article className={sty.card}>
      <h2>{profile.display_name || `@${profile.username}`}</h2>
      <dl className={sty.details}>
        <div>
          <dt>Username</dt>
          <dd>@{profile.username}</dd>
        </div>
        <div>
          <dt>Publication</dt>
          <dd>
            {profile.publication_state === 'published' ? 'Published' : 'Draft'}
          </dd>
        </div>
      </dl>
      <p className={sty.note}>
        Profile editing will connect here once the workspace editor is added.
      </p>
    </article>
  );
}
