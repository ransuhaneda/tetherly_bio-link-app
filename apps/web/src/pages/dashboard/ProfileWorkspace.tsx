import { useEffect, useRef, useState } from 'react';

import { profileApi } from '@/features/creator-workspace/profileApi';
import { useCreatorWorkspace } from '@/features/creator-workspace/useCreatorWorkspace';

import sty from './WorkspacePage.module.scss';

export function ProfileWorkspace() {
  const { profile, runMutation } = useCreatorWorkspace();
  const [displayName, setDisplayName] = useState('');
  const [bio, setBio] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const fileRef = useRef<HTMLInputElement>(null);
  useEffect(() => {
    setDisplayName(profile?.display_name ?? '');
    setBio(profile?.bio ?? '');
  }, [profile]);
  if (!profile)
    return <p className={sty.empty}>Your profile has no saved data yet.</p>;
  const save = async (event: React.FormEvent) => {
    event.preventDefault();
    setError('');
    setMessage('');
    if (!displayName.trim()) {
      setError('Display name is required.');
      return;
    }
    try {
      await runMutation(() =>
        profileApi.update({
          display_name: displayName.trim(),
          bio: bio.trim() || null,
        })
      );
      setMessage('Profile saved.');
    } catch {
      setError('Profile could not be saved.');
    }
  };
  const upload = async (file?: File) => {
    if (!file) return;
    setError('');
    try {
      await runMutation(() => profileApi.uploadAvatar(file));
      setMessage('Avatar updated.');
    } catch {
      setError('Avatar could not be updated.');
    }
  };
  const remove = async () => {
    if (!window.confirm('Remove this avatar?')) return;
    setError('');
    try {
      await runMutation(() => profileApi.deleteAvatar());
      setMessage('Avatar removed.');
    } catch {
      setError('Avatar could not be removed.');
    }
  };
  return (
    <article className={sty.card}>
      <p className={sty.utility}>Identity</p>
      <h2>Edit your profile</h2>
      <form className={sty.form} onSubmit={save}>
        <label>
          Display name
          <input
            value={displayName}
            onChange={e => setDisplayName(e.target.value)}
            maxLength={80}
          />
        </label>
        <label>
          Username
          <input value={`@${profile.username}`} disabled />
        </label>
        <label>
          Bio
          <textarea
            value={bio}
            onChange={e => setBio(e.target.value)}
            maxLength={280}
            rows={4}
          />
        </label>
        <div className={sty.avatar}>
          <strong>Avatar</strong>
          {profile.avatar_url && <img src={profile.avatar_url} alt="" />}
          <input
            ref={fileRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            onChange={e => void upload(e.target.files?.[0])}
          />
          <div>
            <button type="button" onClick={() => fileRef.current?.click()}>
              Upload avatar
            </button>
            {profile.avatar_url && (
              <button type="button" onClick={() => void remove()}>
                Remove
              </button>
            )}
          </div>
        </div>
        <button className={sty.primary} type="submit">
          Save profile
        </button>
        {message && (
          <p role="status" className={sty.success}>
            {message}
          </p>
        )}
        {error && (
          <p role="alert" className={sty.error}>
            {error}
          </p>
        )}
      </form>
      <p className={sty.note}>
        Publication:{' '}
        <strong>
          {profile.publication_state === 'published' ? 'Published' : 'Draft'}
        </strong>
        . Publishing controls are not available yet.
      </p>
    </article>
  );
}
