import axios from 'axios';

import { apiService, getApiError } from './api';

const { axiosInstance } = vi.hoisted(() => ({
  axiosInstance: {
    delete: vi.fn(),
    get: vi.fn(),
    patch: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
  },
}));

vi.mock('axios', () => ({
  default: {
    create: vi.fn(() => axiosInstance),
    get: vi.fn(),
    isAxiosError: vi.fn(),
  },
}));

describe('apiService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('supports PATCH requests and unwraps data envelopes', async () => {
    axiosInstance.patch.mockResolvedValue({ data: { data: 'updated' } });

    await expect(
      apiService.patch('/profile', { bio: 'Hello' })
    ).resolves.toEqual({
      data: 'updated',
    });
    expect(axiosInstance.patch).toHaveBeenCalledWith(
      '/profile',
      { bio: 'Hello' },
      undefined
    );
  });

  it('refreshes CSRF and retries a mutation once after a 419 response', async () => {
    const csrfError = { response: { status: 419 } };
    axiosInstance.patch
      .mockRejectedValueOnce(csrfError)
      .mockResolvedValueOnce({ data: { data: 'updated' } });
    vi.mocked(axios.isAxiosError).mockReturnValue(true);
    vi.mocked(axios.get).mockResolvedValue({ data: undefined });

    await expect(
      apiService.patch('/profile', { bio: 'Hello' })
    ).resolves.toEqual({ data: 'updated' });
    expect(axios.get).toHaveBeenCalledWith('/sanctum/csrf-cookie', {
      withCredentials: true,
    });
    expect(axiosInstance.patch).toHaveBeenCalledTimes(2);
  });

  it('does not retry a mutation more than once after repeated 419 responses', async () => {
    const csrfError = { response: { status: 419 } };
    axiosInstance.patch.mockRejectedValue(csrfError);
    vi.mocked(axios.isAxiosError).mockReturnValue(true);
    vi.mocked(axios.get).mockResolvedValue({ data: undefined });

    await expect(apiService.patch('/profile', { bio: 'Hello' })).rejects.toBe(
      csrfError
    );
    expect(axios.get).toHaveBeenCalledTimes(1);
    expect(axiosInstance.patch).toHaveBeenCalledTimes(2);
  });

  it('supports multipart avatar requests without changing the payload', async () => {
    const formData = new FormData();
    formData.append(
      'avatar',
      new File(['image'], 'avatar.webp', { type: 'image/webp' })
    );
    axiosInstance.put.mockResolvedValue({ data: { data: 'uploaded' } });

    await expect(
      apiService.putMultipart('/profile/avatar', formData)
    ).resolves.toEqual({
      data: 'uploaded',
    });
    expect(axiosInstance.put).toHaveBeenCalledWith(
      '/profile/avatar',
      formData,
      expect.objectContaining({
        headers: { 'Content-Type': 'multipart/form-data' },
      })
    );
  });

  it.each([
    [401, 'Your session has expired. Log in to continue.'],
    [403, 'You do not have permission to make that change.'],
    [404, "We couldn't find what you requested."],
    [409, 'That change conflicts with the current workspace data.'],
    [422, 'Check the highlighted fields and try again.'],
    [429, 'Too many requests. Wait a moment and try again.'],
  ] as const)('maps HTTP %s to a readable message', (status, message) => {
    vi.mocked(axios.isAxiosError).mockReturnValue(true);

    const mapped = getApiError({
      response: { status, data: { message: 'implementation detail' } },
    });

    expect(mapped).toMatchObject({ status, message });
  });
});
