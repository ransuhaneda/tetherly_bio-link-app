import { useEffect, useRef, useState } from 'react';
import { MdDragIndicator } from 'react-icons/md';

import { linksApi } from '@/features/creator-workspace/linksApi';
import { useCreatorWorkspace } from '@/features/creator-workspace/useCreatorWorkspace';
import type { CreatorLink } from '@/types/api';

import sty from './WorkspacePage.module.scss';

const orderLinks = (links: CreatorLink[]) =>
  [...links].sort((a, b) => a.position - b.position);

type FailedOrder = {
  ids: number[];
  movedId: number;
  movedLabel: string;
};

export function LinksWorkspace() {
  const { links, runMutation } = useCreatorWorkspace();
  const [editing, setEditing] = useState<number | null>(null);
  const [label, setLabel] = useState('');
  const [url, setUrl] = useState('');
  const [error, setError] = useState('');
  const [orderedLinks, setOrderedLinks] = useState<CreatorLink[]>(() =>
    orderLinks(links)
  );
  const [draggedId, setDraggedId] = useState<number | null>(null);
  const [failedOrder, setFailedOrder] = useState<FailedOrder | null>(null);
  const [announcement, setAnnouncement] = useState('');
  const [isPersistingOrder, setIsPersistingOrder] = useState(false);
  const lastDragOverTargetId = useRef<number | null>(null);
  const draggedIdRef = useRef<number | null>(null);
  const orderedLinksRef = useRef(orderedLinks);

  useEffect(() => {
    if (draggedIdRef.current === null && !isPersistingOrder) {
      const next = orderLinks(links);
      orderedLinksRef.current = next;
      setOrderedLinks(next);
    }
  }, [draggedId, isPersistingOrder, links]);

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

  const move = async (link: CreatorLink, direction: 'up' | 'down') => {
    const current = orderLinks(orderedLinks);
    const index = current.findIndex(item => item.id === link.id);
    const target = direction === 'up' ? index - 1 : index + 1;
    if (target < 0 || target >= current.length) return;
    const next = [...current];
    const source = next[index];
    const destination = next[target];
    if (!source || !destination) return;
    next[index] = destination;
    next[target] = source;
    await persistOrder(next, current, link);
  };

  const persistOrder = async (
    next: CreatorLink[],
    previous: CreatorLink[],
    movedLink?: Pick<CreatorLink, 'id' | 'label'>
  ) => {
    orderedLinksRef.current = next;
    setOrderedLinks(next);
    setFailedOrder(null);
    setIsPersistingOrder(true);
    try {
      await runMutation(() =>
        linksApi.reorder({ ordered_link_ids: next.map(item => item.id) })
      );
      const index = movedLink
        ? next.findIndex(item => item.id === movedLink.id)
        : next.findIndex(item => item.id === draggedId);
      setAnnouncement(
        `${movedLink?.label ?? 'Destination'} moved to position ${index + 1} of ${next.length}`
      );
    } catch {
      orderedLinksRef.current = previous;
      setOrderedLinks(previous);
      if (movedLink) {
        setFailedOrder({
          ids: next.map(item => item.id),
          movedId: movedLink.id,
          movedLabel: movedLink.label,
        });
      }
      setError('Order could not be saved.');
    } finally {
      setIsPersistingOrder(false);
    }
  };

  const onDragStart = (event: React.DragEvent, link: CreatorLink) => {
    if (editing !== null) {
      event.preventDefault();
      return;
    }
    setDraggedId(link.id);
    draggedIdRef.current = link.id;
    lastDragOverTargetId.current = null;
    event.dataTransfer.effectAllowed = 'move';
    event.dataTransfer.setData('text/plain', String(link.id));
  };

  const onDragOver = (event: React.DragEvent, targetId: number) => {
    event.preventDefault();
    const activeDraggedId = draggedIdRef.current ?? draggedId;
    if (
      activeDraggedId === null ||
      activeDraggedId === targetId ||
      editing === targetId
    )
      return;
    if (lastDragOverTargetId.current === targetId) return;
    const current = orderLinks(orderedLinksRef.current);
    const from = current.findIndex(item => item.id === activeDraggedId);
    const to = current.findIndex(item => item.id === targetId);
    if (from < 0 || to < 0) return;
    const next = [...current];
    const [dragged] = next.splice(from, 1);
    if (!dragged) return;
    next.splice(to, 0, dragged);
    orderedLinksRef.current = next;
    setOrderedLinks(next);
    lastDragOverTargetId.current = targetId;
    setAnnouncement(
      `${dragged.label} moved to position ${to + 1} of ${next.length}`
    );
  };

  const onDrop = (event: React.DragEvent) => {
    event.preventDefault();
    const activeDraggedId = draggedIdRef.current ?? draggedId;
    if (activeDraggedId === null) return;
    const previous = orderLinks(links);
    const next = [...orderedLinksRef.current];
    lastDragOverTargetId.current = null;
    if (
      next.map(item => item.id).join() !== previous.map(item => item.id).join()
    ) {
      const moved = next.find(item => item.id === activeDraggedId);
      if (moved) void persistOrder(next, previous, moved);
    }
    draggedIdRef.current = null;
    setDraggedId(null);
  };

  const change = async (link: CreatorLink, action: 'toggle' | 'delete') => {
    if (action === 'delete' && !window.confirm('Remove this destination?'))
      return;
    try {
      await runMutation(() =>
        action === 'toggle'
          ? linksApi.update(link.id, { enabled: !link.enabled })
          : linksApi.remove(link.id)
      );
    } catch {
      setError('Destination change could not be saved.');
    }
  };

  const retry = () => {
    if (!failedOrder) return;
    const previous = orderLinks(links);
    const next = failedOrder.ids
      .map(id => previous.find(link => link.id === id))
      .filter((link): link is CreatorLink => Boolean(link));
    void persistOrder(next, previous, {
      id: failedOrder.movedId,
      label: failedOrder.movedLabel,
    });
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
      <p className={sty.srOnly} aria-live="polite">
        {announcement}
      </p>
      <ul className={sty.linkList} onDragOver={event => event.preventDefault()}>
        {orderedLinks.map((link, i) => (
          <li
            key={link.id}
            onDragOver={event => onDragOver(event, link.id)}
            onDrop={event => {
              event.stopPropagation();
              onDrop(event);
            }}
            className={draggedId === link.id ? sty.dragging : ''}
          >
            <div className={sty.linkDetails}>
              <strong>{link.label}</strong>
              <span>{link.url}</span>
              {!link.enabled && <span className={sty.hiddenBadge}>Hidden</span>}
            </div>
            <div className={sty.actions}>
              <button
                className={sty.dragHandle}
                type="button"
                draggable={editing === null}
                onDragStart={event => onDragStart(event, link)}
                onDragEnd={() => {
                  lastDragOverTargetId.current = null;
                  draggedIdRef.current = null;
                  setDraggedId(null);
                }}
                aria-label={`Reorder ${link.label}`}
                disabled={editing !== null}
              >
                <MdDragIndicator aria-hidden="true" />
              </button>
              <button
                type="button"
                onClick={() => void move(link, 'up')}
                disabled={i === 0}
                aria-label={`Move ${link.label} up`}
              >
                Move up
              </button>
              <button
                type="button"
                onClick={() => void move(link, 'down')}
                disabled={i === orderedLinks.length - 1}
                aria-label={`Move ${link.label} down`}
              >
                Move down
              </button>
              <button type="button" onClick={() => void change(link, 'toggle')}>
                {link.enabled ? 'Disable' : 'Enable'}
              </button>
              <button type="button" onClick={() => begin(link)}>
                Edit
              </button>
              <button type="button" onClick={() => void change(link, 'delete')}>
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
      {failedOrder && (
        <p className={sty.error}>
          Order could not be saved.{' '}
          <button type="button" onClick={retry}>
            Retry
          </button>
        </p>
      )}
      {error && !failedOrder && (
        <p role="alert" className={sty.error}>
          {error}
        </p>
      )}
    </article>
  );
}
