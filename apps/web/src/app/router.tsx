import {
  createBrowserRouter,
  Navigate,
  type RouteObject,
} from 'react-router-dom';

import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { RouteErrorBoundary } from '@/components/ui/errorHandling/RouteErrorBoundary';
import { ProtectedRoute } from '@/features/auth/ProtectedRoute';
import { CreatorWorkspaceRoute } from '@/pages/dashboard/CreatorWorkspaceRoute';
import { ErrorNotFound } from '@pages/NotFound';

import App from './App';

const withHydrateFallback = (route: RouteObject): RouteObject => ({
  hydrateFallbackElement: <LoadingSpinner />,
  ...route,
});

export const router = createBrowserRouter([
  withHydrateFallback({
    path: '/',
    element: <App />,
    errorElement: <RouteErrorBoundary />,
    children: [
      { path: '*', element: <ErrorNotFound /> },
      withHydrateFallback({
        path: '@:username',
        lazy: async () => {
          const module = await import('@/pages/PublicProfilePage');
          return { Component: module.PublicProfilePage };
        },
      }),
      withHydrateFallback({
        index: true,
        lazy: async () => {
          const module = await import('@/pages/LandingPage');
          return { Component: module.LandingPage };
        },
      }),

      withHydrateFallback({
        path: 'login',
        lazy: async () => {
          const module = await import('@/pages/auth/Login');
          return { Component: module.Login };
        },
      }),

      withHydrateFallback({
        path: 'forgot-password',
        lazy: async () => {
          const module = await import('@/pages/auth/ForgotPassword');
          return { Component: module.ForgotPassword };
        },
      }),

      withHydrateFallback({
        path: 'signup',
        lazy: async () => {
          const module = await import('@/pages/auth/Signup');
          return { Component: module.Signup };
        },
      }),

      withHydrateFallback({
        path: 'about',
        lazy: async () => {
          const module = await import('@/pages/About');
          return { Component: module.About };
        },
      }),

      withHydrateFallback({
        path: 'pricing',
        lazy: async () => {
          const module = await import('@/pages/Pricing');
          return { Component: module.Pricing };
        },
      }),

      withHydrateFallback({
        path: 'privacy',
        lazy: async () => {
          const module = await import('@/pages/LegalPage');
          return { Component: () => <module.LegalPage type="privacy" /> };
        },
      }),

      withHydrateFallback({
        path: 'terms',
        lazy: async () => {
          const module = await import('@/pages/LegalPage');
          return { Component: () => <module.LegalPage type="terms" /> };
        },
      }),

      {
        element: <ProtectedRoute />,
        children: [
          {
            path: 'dashboard',
            element: <CreatorWorkspaceRoute />,
            errorElement: <RouteErrorBoundary />,
            children: [
              { index: true, element: <Navigate to="profile" replace /> },
              withHydrateFallback({
                path: 'profile',
                lazy: async () => {
                  const module = await import(
                    '@/pages/dashboard/ProfileWorkspace'
                  );
                  return { Component: module.ProfileWorkspace };
                },
              }),
              withHydrateFallback({
                path: 'links',
                lazy: async () => {
                  const module = await import(
                    '@/pages/dashboard/LinksWorkspace'
                  );
                  return { Component: module.LinksWorkspace };
                },
              }),
              withHydrateFallback({
                path: 'preview',
                lazy: async () => {
                  const module = await import(
                    '@/pages/dashboard/PreviewWorkspace'
                  );
                  return { Component: module.PreviewWorkspace };
                },
              }),
            ],
          },
        ],
      },
    ],
  }),
]);
