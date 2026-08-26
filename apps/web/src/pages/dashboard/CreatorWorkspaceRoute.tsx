import { CreatorWorkspaceProvider } from '@/features/creator-workspace/CreatorWorkspaceContext';

import { DashboardLayout } from './DashboardLayout';

export function CreatorWorkspaceRoute() {
  return (
    <CreatorWorkspaceProvider>
      <DashboardLayout />
    </CreatorWorkspaceProvider>
  );
}
