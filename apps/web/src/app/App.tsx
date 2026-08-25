import '@assets/styles/App.scss';

import { Footer } from '@components/layout/Footer';
import { Navbar } from '@components/layout/Navbar';
import { LoadingSpinner } from '@components/ui/LoadingSpinner';
import { ErrorBoundary } from '@components/ui/errorHandling/ErrorBoundary';
import { Suspense, useEffect } from 'react';
import { Outlet, useLocation, useNavigation } from 'react-router-dom';

const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, [pathname]);

  return null;
};

const App = () => {
  const navigation = useNavigation();
  const isLoading = navigation.state === 'loading';

  if (isLoading) {
    document.body.style.overflow = 'hidden';
  } else {
    document.body.style.overflow = '';
  }

  return (
    <>
      <ScrollToTop />
      <ErrorBoundary>
        <Suspense fallback={<LoadingSpinner />}>
          <Navbar />

          <main>
            {isLoading && <LoadingSpinner />}
            <Outlet />
          </main>

          <Footer />
        </Suspense>
      </ErrorBoundary>
    </>
  );
};
export default App;
