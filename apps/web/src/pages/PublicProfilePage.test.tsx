import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { publicationApi } from '@/features/creator-workspace/publicationApi';

import {
  copyText,
  PublicProfilePage,
  safeDestination,
} from './PublicProfilePage';

vi.mock('react-router-dom', () => ({
  MemoryRouter: ({ children }: { children: unknown }) => children,
  Navigate: () => null,
  useParams: () => ({ username: 'alice' }),
}));
vi.mock('@/features/creator-workspace/publicationApi', () => ({
  publicationApi: { getPublic: vi.fn() },
}));

vi.mock('@components/common/SEOHelmet', () => ({
  SEOHelmet: ({
    title,
    description,
    url,
  }: {
    title: string;
    description: string;
    url: string;
  }) => (
    <>
      <title>{title}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={url} />
    </>
  ),
}));

const profile = {
  username: 'alice',
  display_name: 'Alice Example',
  bio: 'Designer and maker.',
  avatar_url: null,
  theme: 'editorial-bento' as const,
  version: 3,
  published_at: '2026-01-01T00:00:00Z',
  links: [
    {
      id: 2,
      label: 'Second',
      url: 'https://second.example/path',
      icon: null,
      category: 'work',
      position: 2,
    },
    {
      id: 1,
      label: 'First',
      url: 'https://first.example',
      icon: 'globe',
      category: 'social',
      position: 1,
    },
    {
      id: 3,
      label: 'Unsafe',
      url: 'javascript:alert(1)',
      icon: null,
      category: null,
      position: 0,
    },
  ],
};

const renderProfile = () => {
  window.history.pushState({}, '', '/@Alice');
  return render(<PublicProfilePage />);
};

describe('public profile safety helpers', () => {
  beforeEach(() => {
    vi.mocked(publicationApi.getPublic).mockReset();
  });

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

  it('canonicalizes mixed-case routes before loading the lowercase snapshot', async () => {
    vi.mocked(publicationApi.getPublic).mockResolvedValue(profile);
    renderProfile();

    await waitFor(() =>
      expect(publicationApi.getPublic).toHaveBeenCalledWith('alice')
    );
    expect(
      screen.getByRole('heading', { name: 'Alice Example' })
    ).toBeInTheDocument();
  });

  it('renders the exact unavailable state for a missing snapshot', async () => {
    vi.mocked(publicationApi.getPublic).mockRejectedValue({
      response: { status: 404 },
    });
    renderProfile();

    expect(
      await screen.findByRole('heading', {
        name: 'This Tether isn’t available.',
      })
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        'The link may be incorrect, unpublished, or no longer active.'
      )
    ).toBeInTheDocument();
  });

  it('renders snapshot links in position order, filters unsafe URLs, and supports preview copy', async () => {
    vi.mocked(publicationApi.getPublic).mockResolvedValue(profile);
    const user = userEvent.setup();
    renderProfile();

    await screen.findByRole('heading', { name: 'Alice Example' });
    const links = screen.getAllByRole('link');
    expect(links.map(link => link.textContent)).toEqual(['First', 'Second']);
    expect(screen.queryByText('Unsafe')).not.toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Preview First' }));
    expect(screen.getByText('first.example')).toBeInTheDocument();
    const writeText = vi.fn().mockResolvedValue(undefined);
    Object.defineProperty(navigator, 'clipboard', {
      configurable: true,
      value: { writeText },
    });
    await user.click(screen.getByRole('button', { name: 'Copy URL' }));
    await waitFor(() =>
      expect(writeText).toHaveBeenCalledWith('https://first.example/')
    );
    expect(screen.getByRole('status')).toHaveTextContent('URL copied.');
  });

  it('falls back from share to clipboard and exposes profile metadata', async () => {
    vi.mocked(publicationApi.getPublic).mockResolvedValue(profile);
    const user = userEvent.setup();
    Object.defineProperty(navigator, 'share', {
      configurable: true,
      value: undefined,
    });
    const writeText = vi.fn().mockResolvedValue(undefined);
    Object.defineProperty(navigator, 'clipboard', {
      configurable: true,
      value: { writeText },
    });
    renderProfile();

    await screen.findByRole('heading', { name: 'Alice Example' });
    await user.click(screen.getByRole('button', { name: /Share/ }));
    await waitFor(() =>
      expect(writeText).toHaveBeenCalledWith('http://localhost:3000/@alice')
    );
    expect(document.title).toContain('Alice Example (@alice) | Tetherly');
    expect(document.querySelector('meta[name="description"]')).toHaveAttribute(
      'content',
      profile.bio
    );
    expect(document.querySelector('link[rel="canonical"]')).toHaveAttribute(
      'href',
      'http://localhost:3000/@alice'
    );
  });
});
