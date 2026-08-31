import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';

import { getApiError } from '@/services/api';
import type { ApiError, CreatorLink, CreatorProfile } from '@/types/api';

import { CreatorWorkspaceContext } from './creatorWorkspaceContextValue';
import { linksApi } from './linksApi';
import { profileApi } from './profileApi';
import { useEditingLease } from './useEditingLease';

export interface CreatorWorkspaceContextValue {
  profile: CreatorProfile | null;
  links: CreatorLink[];
  isLoading: boolean;
  error: ApiError | null;
  isMutating: boolean;
  mutationError: ApiError | null;
  refresh: () => Promise<void>;
  runMutation: <T>(operation: () => Promise<T>) => Promise<T>;
  isReadOnly: boolean;
  ownershipModal: boolean;
  dismissOwnershipModal: () => void;
  takeOver: () => void;
}

export function CreatorWorkspaceProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [profile, setProfile] = useState<CreatorProfile | null>(null);
  const [links, setLinks] = useState<CreatorLink[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<ApiError | null>(null);
  const [isMutating, setIsMutating] = useState(false);
  const [mutationError, setMutationError] = useState<ApiError | null>(null);
  const lease = useEditingLease(profile?.id ?? null);

  const refresh = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [nextProfile, nextLinks] = await Promise.all([
        profileApi.get(),
        linksApi.list(),
      ]);
      setProfile(nextProfile);
      setLinks(nextLinks);
    } catch (workspaceError) {
      setError(getApiError(workspaceError));
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const runMutation = useCallback(
    async <T,>(operation: () => Promise<T>): Promise<T> => {
      if (lease.readOnly)
        throw new Error('This workspace is read-only in this tab.');
      setIsMutating(true);
      setMutationError(null);
      try {
        const result = await operation();
        await refresh();
        return result;
      } catch (workspaceError) {
        const apiError = getApiError(workspaceError);
        setMutationError(apiError);
        throw apiError;
      } finally {
        setIsMutating(false);
      }
    },
    [lease.readOnly, refresh]
  );

  const value = useMemo<CreatorWorkspaceContextValue>(
    () => ({
      profile,
      links,
      isLoading,
      error,
      isMutating,
      mutationError,
      refresh,
      runMutation,
      isReadOnly: lease.readOnly,
      ownershipModal: lease.modal,
      dismissOwnershipModal: lease.dismissModal,
      takeOver: lease.takeOver,
    }),
    [
      error,
      isLoading,
      isMutating,
      links,
      mutationError,
      profile,
      refresh,
      runMutation,
      lease.dismissModal,
      lease.modal,
      lease.readOnly,
      lease.takeOver,
    ]
  );

  return (
    <CreatorWorkspaceContext.Provider value={value}>
      {children}
    </CreatorWorkspaceContext.Provider>
  );
}
