import { useEffect, useMemo, useState } from 'react';
import { FiCopy, FiExternalLink, FiShare2 } from 'react-icons/fi';
import { Navigate, useParams } from 'react-router-dom';

import { publicationApi } from '@/features/creator-workspace/publicationApi';
import { getApiStatus } from '@/services/api';
import type { PublicProfile } from '@/types/api';
import { SEOHelmet } from '@components/common/SEOHelmet';

import sty from './PublicProfilePage.module.scss';

const UNAVAILABLE = 'This Tether isn’t available.';
const UNAVAILABLE_DETAIL =
  'The link may be incorrect, unpublished, or no longer active.';
const DEFAULT_DESCRIPTION = 'A Tetherly creator profile.';

const safeDestination = (value: string) => {
  try {
    const url = new URL(value);
    return url.protocol === 'http:' || url.protocol === 'https:' ? url : null;
  } catch {
    return null;
  }
};

const initials = (name: string, username: string) => {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  return (
    parts.length > 1
      ? `${parts[0]?.[0] ?? ''}${parts.at(-1)?.[0] ?? ''}`
      : parts[0]?.slice(0, 2) || username.slice(0, 1)
  ).toUpperCase();
};

function Unavailable() {
  return (
    <main className={sty.unavailable}>
      <p className={sty.brand}>Tetherly</p>
      <h1>{UNAVAILABLE}</h1>
      <p>{UNAVAILABLE_DETAIL}</p>
    </main>
  );
}

export function PublicProfilePage() {
  const { username = '' } = useParams();
  const canonical = username.toLowerCase();
  const [profile, setProfile] = useState<PublicProfile | null>(null);
  const [failed, setFailed] = useState(false);
  const [copied, setCopied] = useState(false);
  const [previewId, setPreviewId] = useState<number | null>(null);

  useEffect(() => {
    let active = true;
    publicationApi
      .getPublic(canonical)
      .then(data => active && setProfile(data))
      .catch(error => {
        if (active && getApiStatus(error) === 404) setFailed(true);
        else if (active) setFailed(true);
      });
    return () => {
      active = false;
    };
  }, [canonical]);

  const publicUrl = useMemo(
    () => `${window.location.origin}/@${canonical}`,
    [canonical]
  );
  if (username !== canonical) return <Navigate to={`/@${canonical}`} replace />;
  if (failed) return <Unavailable />;
  if (!profile)
    return (
      <main className={sty.loading} aria-busy="true">
        Loading…
      </main>
    );

  const share = async () => {
    if (navigator.share)
      await navigator
        .share({ title: `${profile.display_name} | Tetherly`, url: publicUrl })
        .catch(() => undefined);
    else if (navigator.clipboard) {
      await navigator.clipboard.writeText(publicUrl);
      setCopied(true);
    }
  };

  return (
    <>
      <SEOHelmet
        title={`${profile.display_name} (@${profile.username}) | Tetherly`}
        description={profile.bio || DEFAULT_DESCRIPTION}
        image={profile.avatar_url || '/favicon/opengraph-image.png'}
        url={publicUrl}
      />
      <main className={sty.page}>
        <div className={sty.shell}>
          <header className={sty.header}>
            <span className={sty.brand}>Tetherly</span>
            <button className={sty.share} type="button" onClick={share}>
              <FiShare2 aria-hidden="true" /> Share
            </button>
          </header>
          <section className={sty.identity} aria-labelledby="profile-name">
            {profile.avatar_url ? (
              <img className={sty.avatar} src={profile.avatar_url} alt="" />
            ) : (
              <div className={sty.avatar} aria-hidden="true">
                {initials(profile.display_name, profile.username)}
              </div>
            )}
            <h1 id="profile-name">{profile.display_name}</h1>
            <p className={sty.username}>@{profile.username}</p>
            {profile.bio && <p className={sty.bio}>{profile.bio}</p>}
          </section>
          <section className={sty.destinations} aria-label="Destinations">
            {profile.links
              .slice()
              .sort((a, b) => a.position - b.position)
              .map(link => {
                const destination = safeDestination(link.url);
                if (!destination) return null;
                const open = () =>
                  window.open(
                    destination.href,
                    '_blank',
                    'noopener,noreferrer'
                  );
                return (
                  <article className={sty.destination} key={link.id}>
                    <a
                      href={destination.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={sty.destinationLink}
                    >
                      {link.label}
                      <FiExternalLink aria-hidden="true" />
                    </a>
                    <button
                      type="button"
                      className={sty.previewButton}
                      aria-expanded={previewId === link.id}
                      onClick={() =>
                        setPreviewId(previewId === link.id ? null : link.id)
                      }
                    >
                      Preview
                    </button>
                    {previewId === link.id && (
                      <div
                        className={sty.preview}
                        role="region"
                        aria-label={`Destination preview for ${link.label}`}
                      >
                        <strong>{destination.hostname}</strong>
                        <span>{destination.href}</span>
                        <button
                          type="button"
                          onClick={() => {
                            navigator.clipboard?.writeText(destination.href);
                            setCopied(true);
                          }}
                        >
                          <FiCopy aria-hidden="true" /> Copy URL
                        </button>
                        <button
                          type="button"
                          className={sty.openButton}
                          onClick={open}
                        >
                          Open destination
                        </button>
                      </div>
                    )}
                  </article>
                );
              })}
          </section>
          <footer className={sty.footer}>
            {copied && <span role="status">URL copied.</span>}
            <label className={sty.readonlyUrl}>
              Public URL
              <input
                readOnly
                value={publicUrl}
                aria-label="Public profile URL"
              />
            </label>
            <span>Made with Tetherly</span>
          </footer>
        </div>
      </main>
    </>
  );
}

export default PublicProfilePage;
