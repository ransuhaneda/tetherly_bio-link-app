import { useState } from 'react';
import { Link } from 'react-router-dom';

import { publicationApi } from '@/features/creator-workspace/publicationApi';
import { useCreatorWorkspace } from '@/features/creator-workspace/useCreatorWorkspace';

import sty from './PublicationControls.module.scss';

type PublicationControlsProps = { compact?: boolean };

function initials(displayName: string | null, username: string) {
  const source = displayName?.trim() || username;
  const parts = source.split(/\s+/).filter(Boolean);
  return parts.length > 1
    ? `${parts[0]?.[0] ?? ''}${parts[1]?.[0] ?? ''}`.toUpperCase()
    : source.slice(0, 2).toUpperCase();
}

export function PublicationControls({
  compact = false,
}: PublicationControlsProps) {
  const { profile, links, runMutation } = useCreatorWorkspace();
  const [modal, setModal] = useState<'publish' | 'unpublish' | null>(null);
  const [error, setError] = useState('');
  if (!profile) return null;
  const status =
    profile.publication_status ??
    (profile.publication_state === 'published' ? 'published' : 'draft');
  const readyName = Boolean(profile.display_name?.trim());
  const readyLink = links.some(link => {
    try {
      const url = new URL(link.url);
      return link.enabled && ['http:', 'https:'].includes(url.protocol);
    } catch {
      return false;
    }
  });
  const ready = readyName && readyLink;
  const publicUrl = `${window.location.origin}/@${profile.username}`;
  const publish = async () => {
    setError('');
    try {
      await runMutation(() => publicationApi.publish());
      setModal(null);
    } catch {
      setError('Publishing could not be completed. Your draft is safe.');
    }
  };
  const unpublish = async () => {
    setError('');
    try {
      await runMutation(() => publicationApi.unpublish());
      setModal(null);
    } catch {
      setError('Unpublishing could not be completed.');
    }
  };
  return (
    <>
      <div className={compact ? sty.compact : sty.panel}>
        {!compact && (
          <div className={sty.previewCard}>
            <div className={sty.avatar}>
              {profile.avatar_url ? (
                <img src={profile.avatar_url} alt="" />
              ) : (
                initials(profile.display_name, profile.username)
              )}
            </div>
            <strong>{profile.display_name || 'Your display name'}</strong>
            <span>@{profile.username}</span>
            {profile.bio && <p>{profile.bio}</p>}
            <div className={sty.previewLinks}>
              {links
                .filter(link => link.enabled)
                .slice(0, 3)
                .map(link => (
                  <span key={link.id}>{link.label}</span>
                ))}
            </div>
          </div>
        )}
        {!compact && (
          <div className={sty.requirements}>
            <p className={sty.utility}>Before you publish</p>
            <h3>
              {ready
                ? 'Your Tether is ready.'
                : 'A couple of things are needed.'}
            </h3>
            <ul>
              <li className={readyName ? sty.met : ''}>
                {readyName ? 'Display name added' : 'Add a display name'}{' '}
                {!readyName && (
                  <Link to="/dashboard/profile">Go to Profile</Link>
                )}
              </li>
              <li className={readyLink ? sty.met : ''}>
                {readyLink
                  ? 'Enabled HTTP(S) destination added'
                  : 'Add an enabled HTTP(S) destination'}{' '}
                {!readyLink && <Link to="/dashboard/links">Go to Links</Link>}
              </li>
            </ul>
          </div>
        )}
        <div className={sty.actions}>
          <span
            className={`${sty.status} ${status === 'published' ? sty.live : ''}`}
          >
            <span aria-hidden="true">●</span>{' '}
            {status === 'published'
              ? 'Published'
              : status === 'changes_not_published'
                ? 'Changes not published'
                : 'Draft'}
          </span>
          {status !== 'published' && (
            <button
              className={sty.primary}
              type="button"
              disabled={!ready}
              onClick={() =>
                profile.published_version ? void publish() : setModal('publish')
              }
            >
              {profile.published_version ? 'Publish' : 'Publish your Tether'}
            </button>
          )}
          {status === 'published' && (
            <button type="button" onClick={() => setModal('unpublish')}>
              Unpublish
            </button>
          )}
        </div>
        {error && (
          <p className={sty.error} role="alert">
            {error}
          </p>
        )}
      </div>
      {modal && (
        <div className={sty.modalBackdrop} role="presentation">
          <section
            className={sty.modal}
            role="dialog"
            aria-modal="true"
            aria-labelledby="publication-title"
          >
            <p className={sty.utility}>
              {modal === 'publish' ? 'Make it public' : 'Publication controls'}
            </p>
            <h2 id="publication-title">
              {modal === 'publish'
                ? 'Publish your Tether?'
                : 'Unpublish your Tether?'}
            </h2>
            {modal === 'publish' ? (
              <>
                <p>
                  Your profile will be available at <strong>{publicUrl}</strong>
                  .
                </p>
                <p>
                  Only enabled links will be visible. Later edits stay private
                  until you publish again.
                </p>
              </>
            ) : (
              <p>
                Your public profile will become unavailable. Your draft and
                publication history will stay safe.
              </p>
            )}
            <div className={sty.modalActions}>
              <button type="button" onClick={() => setModal(null)}>
                Cancel
              </button>
              <button
                className={sty.primary}
                type="button"
                onClick={() =>
                  void (modal === 'publish' ? publish() : unpublish())
                }
              >
                {modal === 'publish' ? 'Publish' : 'Unpublish'}
              </button>
            </div>
          </section>
        </div>
      )}
    </>
  );
}
