import { NavLink, Outlet } from 'react-router-dom';

import sty from './DashboardLayout.module.scss';

import { useCreatorWorkspace } from '@/features/creator-workspace/useCreatorWorkspace';

const DASHBOARD_LINKS = [
  { label: 'Profile', to: '/dashboard/profile' },
  { label: 'Links', to: '/dashboard/links' },
  { label: 'Preview', to: '/dashboard/preview' },
];

export function WorkspaceState({ children }: { children: React.ReactNode }) {
  const { isLoading, error, refresh } = useCreatorWorkspace();

  if (isLoading) {
    return (
      <div className={sty.state} role="status">
        <strong>Loading your workspace</strong>
        <span>Connecting to your saved profile and links.</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className={sty.state} role="alert">
        <strong>{error.message}</strong>
        <span>Your workspace could not be loaded yet.</span>
        <button type="button" onClick={() => void refresh()}>
          Try again
        </button>
      </div>
    );
  }

  return <>{children}</>;
}

export function DashboardLayout() {
  const { profile, isMutating, mutationError } = useCreatorWorkspace();

  return (
    <section className={sty.page}>
      <div className={sty.shell}>
        <header className={sty.header}>
          <div>
            <h1>Shape your Tether</h1>
          </div>
          <div className={sty.account}>
            {profile ? `@${profile.username}` : 'Workspace'}
          </div>
        </header>
        <div className={sty.layout}>
          <nav className={sty.nav} aria-label="Creator workspace">
            {DASHBOARD_LINKS.map(link => (
              <NavLink
                className={({ isActive }) =>
                  [sty.navLink, isActive ? sty.navLinkActive : '']
                    .filter(Boolean)
                    .join(' ')
                }
                key={link.to}
                to={link.to}
              >
                {link.label}
              </NavLink>
            ))}
          </nav>
          <div className={sty.content}>
            {isMutating && (
              <p className={sty.mutation} role="status">
                Saving your workspace…
              </p>
            )}
            {mutationError && (
              <p className={sty.mutationError} role="alert">
                {mutationError.message}
              </p>
            )}
            <WorkspaceState>
              <Outlet />
            </WorkspaceState>
          </div>
        </div>
      </div>
    </section>
  );
}
