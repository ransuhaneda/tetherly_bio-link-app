import { createContext } from 'react';

import type { CreatorWorkspaceContextValue } from './CreatorWorkspaceContext';

export const CreatorWorkspaceContext = createContext<
  CreatorWorkspaceContextValue | undefined
>(undefined);
