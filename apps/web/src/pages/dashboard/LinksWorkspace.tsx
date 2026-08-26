import { useState } from 'react';

import { linksApi } from '@/features/creator-workspace/linksApi';
import { useCreatorWorkspace } from '@/features/creator-workspace/useCreatorWorkspace';
import type { CreatorLink } from '@/types/api';

import sty from './WorkspacePage.module.scss';

export function LinksWorkspace() {
  const { links, runMutation } = useCreatorWorkspace();
  const [editing, setEditing] = useState<number | null>(null);
  const [label, setLabel] = useState('');
  const [url, setUrl] = useState('');
  const [error, setError] = useState('');
  const begin = (link?: CreatorLink) => {
    setEditing(link?.id ?? 0);
    setLabel(link?.label ?? '');
    setUrl(link?.url ?? '');
    setError('');
  };
  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!label.trim() || !/^https?:\/\//i.test(url)) {
      setError('Enter a label and a valid http(s) URL.');
      return;
    }
    try {
      if (editing)
        await runMutation(() =>
          linksApi.update(editing, { label: label.trim(), url: url.trim() })
        );
      else
        await runMutation(() =>
          linksApi.create({
            label: label.trim(),
            url: url.trim(),
            enabled: true,
          })
        );
      setEditing(null);
    } catch {
      setError('Link could not be saved.');
    }
  };
  const change = async (
    link: CreatorLink,
    action: 'toggle' | 'delete' | 'up' | 'down'
  ) => {
    try {
      if (action === 'toggle')
        await runMutation(() =>
          linksApi.update(link.id, { enabled: !link.enabled })
        );
      else if (action === 'delete')
        await runMutation(() => linksApi.remove(link.id));
      else {
        const ordered = [...links].sort((a, b) => a.position - b.position);
        const i = ordered.findIndex(x => x.id === link.id);
        const j = action === 'up' ? i - 1 : i + 1;
        if (j < 0 || j >= ordered.length) return;
        [ordered[i], ordered[j]] = [ordered[j], ordered[i]];
        await runMutation(() =>
          linksApi.reorder({ ordered_link_ids: ordered.map(x => x.id) })
        );
      }
    } catch {
      setError('Link change could not be saved.');
    }
  };
  return (
    <article className={sty.card}>
      <p className={sty.utility}>Destinations</p>
      <h2>Your links</h2>
      <button className={sty.primary} type="button" onClick={() => begin()}>
        Add link
      </button>
      {editing !== null && (
        <form className={sty.form} onSubmit={save}>
          <label>
            Label
            <input value={label} onChange={e => setLabel(e.target.value)} />
          </label>
          <label>
            URL
            <input
              type="url"
              value={url}
              onChange={e => setUrl(e.target.value)}
              placeholder="https://"
            />
          </label>
          <div>
            <button className={sty.primary} type="submit">
              Save link
            </button>
            <button type="button" onClick={() => setEditing(null)}>
              Cancel
            </button>
          </div>
        </form>
      )}
      <ul className={sty.linkList}>
        {[...links]
          .sort((a, b) => a.position - b.position)
          .map((link, i) => (
            <li key={link.id}>
              <div>
                <strong>{link.label}</strong>
                <span>{link.url}</span>
              </div>
              <div className={sty.actions}>
                <button
                  type="button"
                  onClick={() => void change(link, 'up')}
                  disabled={i === 0}
                  aria-label={`Move ${link.label} up`}
                >
                  ↑
                </button>
                <button
                  type="button"
                  onClick={() => void change(link, 'down')}
                  disabled={i === links.length - 1}
                  aria-label={`Move ${link.label} down`}
                >
                  ↓
                </button>
                <button
                  type="button"
                  onClick={() => void change(link, 'toggle')}
                >
                  {link.enabled ? 'Disable' : 'Enable'}
                </button>
                <button type="button" onClick={() => begin(link)}>
                  Edit
                </button>
                <button
                  type="button"
                  onClick={() => void change(link, 'delete')}
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
      </ul>
      {error && (
        <p role="alert" className={sty.error}>
          {error}
        </p>
      )}
    </article>
  );
}
