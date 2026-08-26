import { useContext } from 'react';

import { CreatorWorkspaceContext } from './creatorWorkspaceContextValue';

export function useCreatorWorkspace() {
  const context = useContext(CreatorWorkspaceContext);
  if (!context) {
    throw new Error(
      'useCreatorWorkspace must be used inside CreatorWorkspaceProvider'
    );
  }
  return context;
}
