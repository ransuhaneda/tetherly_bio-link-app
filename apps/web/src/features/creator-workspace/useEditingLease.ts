import { useCallback, useEffect, useRef, useState } from 'react';

const TTL = 15_000;
const HEARTBEAT = 5_000;
const CHANNEL = 'tetherly-creator-workspace';
type Lease = { tabId: string; expiresAt: number };
export const keyFor = (userId: number | string) =>
  `tetherly:editing-lease:${userId}`;
const read = (key: string): Lease | null => {
  try {
    const value = localStorage.getItem(key);
    return value ? (JSON.parse(value) as Lease) : null;
  } catch {
    return null;
  }
};

export function useEditingLease(userId: number | string | null) {
  const tabId = useRef(crypto.randomUUID()).current;
  const [readOnly, setReadOnly] = useState(false);
  const [modal, setModal] = useState(false);
  const key = userId ? keyFor(userId) : null;
  const channel = useRef<BroadcastChannel | null>(null);
  const claim = useCallback(() => {
    if (!key) return false;
    const existing = read(key);
    if (existing && existing.tabId !== tabId && existing.expiresAt > Date.now())
      return false;
    localStorage.setItem(
      key,
      JSON.stringify({ tabId, expiresAt: Date.now() + TTL })
    );
    channel.current?.postMessage({ type: 'claimed', tabId });
    setReadOnly(false);
    setModal(false);
    return true;
  }, [key, tabId]);
  useEffect(() => {
    if (!key) return;
    const changed = () => {
      const lease = read(key);
      if (lease && lease.tabId !== tabId && lease.expiresAt > Date.now()) {
        setReadOnly(true);
        setModal(true);
      }
    };
    const onMessage = (event: MessageEvent) => {
      if (
        event.data?.tabId !== tabId &&
        ['claimed', 'takeover'].includes(event.data?.type)
      )
        changed();
    };
    const onStorage = (event: StorageEvent) => {
      if (event.key === key) changed();
    };
    channel.current =
      typeof BroadcastChannel !== 'undefined'
        ? new BroadcastChannel(CHANNEL)
        : null;
    channel.current?.addEventListener('message', onMessage);
    window.addEventListener('storage', onStorage);
    if (!claim()) {
      setReadOnly(true);
      setModal(true);
    }
    const timer = window.setInterval(() => {
      if (!readOnly && read(key)?.tabId === tabId)
        localStorage.setItem(
          key,
          JSON.stringify({ tabId, expiresAt: Date.now() + TTL })
        );
    }, HEARTBEAT);
    return () => {
      window.clearInterval(timer);
      channel.current?.close();
      window.removeEventListener('storage', onStorage);
      if (read(key)?.tabId === tabId) localStorage.removeItem(key);
    };
  }, [claim, key, readOnly, tabId]);
  const takeOver = useCallback(() => {
    if (!key) return;
    localStorage.setItem(
      key,
      JSON.stringify({ tabId, expiresAt: Date.now() + TTL })
    );
    channel.current?.postMessage({ type: 'takeover', tabId });
    setReadOnly(false);
    setModal(false);
  }, [key, tabId]);
  return { readOnly, modal, dismissModal: () => setModal(false), takeOver };
}
export { TTL };
