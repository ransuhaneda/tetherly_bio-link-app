import { DashboardLayout } from './DashboardLayout';

import { CreatorWorkspaceProvider } from '@/features/creator-workspace/CreatorWorkspaceContext';

export function CreatorWorkspaceRoute() {
  return (
    <CreatorWorkspaceProvider>
      <DashboardLayout />
    </CreatorWorkspaceProvider>
  );
}
