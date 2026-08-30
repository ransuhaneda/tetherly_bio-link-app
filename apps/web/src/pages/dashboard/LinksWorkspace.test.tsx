import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
} from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { linksApi } from '@/features/creator-workspace/linksApi';
import { useCreatorWorkspace } from '@/features/creator-workspace/useCreatorWorkspace';

import { LinksWorkspace } from './LinksWorkspace';

vi.mock('@/features/creator-workspace/linksApi', () => ({
  linksApi: {
    reorder: vi.fn(),
    update: vi.fn(),
    create: vi.fn(),
    remove: vi.fn(),
  },
}));
vi.mock('@/features/creator-workspace/useCreatorWorkspace', () => ({
  useCreatorWorkspace: vi.fn(),
}));

const links = [
  {
    id: 1,
    label: 'First',
    url: 'https://first.example',
    icon: null,
    category: null,
    position: 1,
    enabled: true,
    created_at: '',
    updated_at: '',
  },
  {
    id: 2,
    label: 'Second',
    url: 'https://second.example',
    icon: null,
    category: null,
    position: 2,
    enabled: true,
    created_at: '',
    updated_at: '',
  },
];

const renderLinks = (
  runMutation = vi.fn(async <T,>(operation: () => Promise<T>) => operation())
) => {
  vi.mocked(useCreatorWorkspace).mockReturnValue({
    links,
    runMutation,
    profile: null,
    isLoading: false,
    error: null,
    isMutating: false,
    mutationError: null,
    refresh: vi.fn(),
  });
  return render(<LinksWorkspace />);
};

describe('LinksWorkspace ordering', () => {
  beforeEach(() => {
    vi.mocked(linksApi.reorder).mockReset();
  });

  it('keeps repeated dragover on the same target stable and drops once', async () => {
    vi.mocked(linksApi.reorder).mockResolvedValue(links);
    renderLinks();
    const firstHandle = screen.getByRole('button', { name: 'Reorder First' });
    const secondRow = screen.getByText('Second').closest('li');
    expect(secondRow).not.toBeNull();

    fireEvent.dragStart(firstHandle, {
      dataTransfer: {
        effectAllowed: '',
        setData: vi.fn(),
      },
    });
    await act(async () => {
      fireEvent.dragOver(secondRow!, { preventDefault: vi.fn() });
      fireEvent.dragOver(secondRow!, { preventDefault: vi.fn() });
    });
    expect(linksApi.reorder).not.toHaveBeenCalled();
  });

  it('persists exactly once after repeated dragover events and a drop', async () => {
    vi.mocked(linksApi.reorder).mockResolvedValue(links);
    renderLinks();
    const firstHandle = screen.getByRole('button', { name: 'Reorder First' });
    const secondRow = screen.getByText('Second').closest('li');
    expect(secondRow).not.toBeNull();

    fireEvent.dragStart(firstHandle, {
      dataTransfer: {
        effectAllowed: '',
        setData: vi.fn(),
      },
    });
    await act(async () => {
      fireEvent.dragOver(secondRow!, { preventDefault: vi.fn() });
      fireEvent.dragOver(secondRow!, { preventDefault: vi.fn() });
    });
    fireEvent.drop(secondRow!, {
      preventDefault: vi.fn(),
      dataTransfer: { dropEffect: 'move', getData: () => '1' },
    });

    await waitFor(() => expect(linksApi.reorder).toHaveBeenCalledTimes(1));
    expect(linksApi.reorder).toHaveBeenCalledWith({
      ordered_link_ids: [2, 1],
    });
  });

  it('rolls back a failed reorder and retries the requested order', async () => {
    vi.mocked(linksApi.reorder)
      .mockRejectedValueOnce(new Error('offline'))
      .mockResolvedValueOnce(links);
    renderLinks();
    const secondMoveUp = screen.getByRole('button', { name: 'Move Second up' });
    fireEvent.click(secondMoveUp);

    expect(
      await screen.findByRole('button', { name: 'Retry' })
    ).toBeInTheDocument();
    expect(screen.getAllByRole('listitem')[0]).toHaveTextContent('First');
    fireEvent.click(screen.getByRole('button', { name: 'Retry' }));
    await waitFor(() => expect(linksApi.reorder).toHaveBeenCalledTimes(2));
    expect(linksApi.reorder).toHaveBeenLastCalledWith({
      ordered_link_ids: [2, 1],
    });
    expect(
      screen.getByText('Second moved to position 1 of 2')
    ).toBeInTheDocument();
  });

  it('announces keyboard move actions', async () => {
    vi.mocked(linksApi.reorder).mockResolvedValue(links);
    renderLinks();
    fireEvent.click(screen.getByRole('button', { name: 'Move Second up' }));
    await waitFor(() =>
      expect(
        screen.getByText('Second moved to position 1 of 2')
      ).toBeInTheDocument()
    );
    expect(linksApi.reorder).toHaveBeenCalledTimes(1);
    expect(linksApi.reorder).toHaveBeenCalledWith({ ordered_link_ids: [2, 1] });
  });
});
