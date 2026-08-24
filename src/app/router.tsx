import { createBrowserRouter, type RouteObject } from 'react-router-dom';

import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { RouteErrorBoundary } from '@/components/ui/errorHandling/RouteErrorBoundary';
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
        path: 'samplepage',
        lazy: async () => {
          // error display test
          // throw new Response('Not Found', {
          //   status: 500,
          //   statusText: 'Not Found',
          // });

          const module = await import('@/pages/boilerplatePages/SamplePage');
          return {
            Component: module.SamplePage,
          };
        },
        // can add route-specific error handling
        // errorElement: <DashboardError />,
      }),

      withHydrateFallback({
        path: 'mockapi',
        lazy: async () => {
          // error display test
          // throw new Response('Not Found', {
          //   status: 500,
          //   statusText: 'Not Found',
          // });

          const module = await import('@/pages/boilerplatePages/MockApi');
          return {
            Component: module.MockApi,
            loader: module.MockLoader,
            errorElement: <RouteErrorBoundary />,
          };
        },
      }),
    ],
  }),
]);
