import { describe, expect, it, vi } from 'vitest';

import { copyText, safeDestination } from './PublicProfilePage';

describe('public profile safety helpers', () => {
  it('allows only HTTP(S) destinations', () => {
    expect(safeDestination('https://example.com/path')?.hostname).toBe(
      'example.com'
    );
    expect(safeDestination('javascript:alert(1)')).toBeNull();
    expect(safeDestination('data:text/html,unsafe')).toBeNull();
  });

  it('reports clipboard success only after writeText resolves', async () => {
    const writeText = vi.fn().mockResolvedValue(undefined);
    Object.defineProperty(navigator, 'clipboard', {
      configurable: true,
      value: { writeText },
    });
    await expect(copyText('https://example.com')).resolves.toBe(true);
    expect(writeText).toHaveBeenCalledWith('https://example.com');
  });

  it('reports clipboard failure when unavailable or rejected', async () => {
    Object.defineProperty(navigator, 'clipboard', {
      configurable: true,
      value: undefined,
    });
    await expect(copyText('https://example.com')).resolves.toBe(false);
    const writeText = vi.fn().mockRejectedValue(new Error('denied'));
    Object.defineProperty(navigator, 'clipboard', {
      configurable: true,
      value: { writeText },
    });
    await expect(copyText('https://example.com')).resolves.toBe(false);
  });
});
