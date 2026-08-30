import { useEffect, useRef } from 'react';
import { NavLink, Outlet } from 'react-router-dom';

import { useCreatorWorkspace } from '@/features/creator-workspace/useCreatorWorkspace';

import sty from './DashboardLayout.module.scss';
import { PublicationControls } from './PublicationControls';

function OwnershipNotice() {
  const { isReadOnly, ownershipModal, dismissOwnershipModal, takeOver } =
    useCreatorWorkspace();
  const dialogRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!ownershipModal) return;
    dialogRef.current?.focus();
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') dismissOwnershipModal();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [dismissOwnershipModal, ownershipModal]);
  if (!isReadOnly) return null;
  return (
    <>
      <div role="status" className={sty.mutation}>
        Read only: another tab owns editing.{' '}
        <button type="button" onClick={takeOver}>
          Take Over Here
        </button>
      </div>
      {ownershipModal && (
        <div role="dialog">
          <h2>This workspace is open in another tab</h2>
          <p>Continue here in read-only mode or take ownership.</p>
          <button type="button" onClick={takeOver}>
            Take Over Here
          </button>
          <button type="button" onClick={dismissOwnershipModal}>
            Continue Read Only
          </button>
        </div>
      )}
    </>
  );
}

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
      <OwnershipNotice />
      <div className={sty.shell}>
        <header className={sty.header}>
          <div>
            <h1>Shape your Tether</h1>
          </div>
          <div className={sty.account}>
            {profile ? `@${profile.username}` : 'Workspace'}
          </div>
          <PublicationControls compact />
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
