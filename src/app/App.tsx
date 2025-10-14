import '@assets/styles/App.scss';
import { Suspense } from 'react';
import { Outlet, useNavigation } from 'react-router-dom';

import { Navbar } from '@components/layout/Navbar';
import { LoadingSpinner } from '@components/ui/LoadingSpinner';
import { ErrorBoundary } from '@components/ui/errorHandling/ErrorBoundary';

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
      <ErrorBoundary>
        <Suspense fallback={<LoadingSpinner />}>
          <Navbar />

          <main>
            {isLoading && <LoadingSpinner />}
            <Outlet />
          </main>

          {/* <Footer /> */}
        </Suspense>
      </ErrorBoundary>
    </>
  );
};
export default App;
