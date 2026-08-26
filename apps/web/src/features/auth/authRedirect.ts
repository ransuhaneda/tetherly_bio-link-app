import type { Location } from 'react-router-dom';

interface AuthRedirectState {
  from?: {
    pathname?: unknown;
    search?: unknown;
    hash?: unknown;
  };
}

export function getAuthRedirect(location: Pick<Location, 'state'>): string {
  const state = location.state as AuthRedirectState | null;
  const pathname = state?.from?.pathname;

  if (
    typeof pathname !== 'string' ||
    !pathname.startsWith('/') ||
    pathname.startsWith('//')
  ) {
    return '/dashboard/profile';
  }

  const search =
    typeof state.from?.search === 'string' ? state.from.search : '';
  const hash = typeof state.from?.hash === 'string' ? state.from.hash : '';
  return `${pathname}${search}${hash}`;
}
