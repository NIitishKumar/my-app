import { Providers } from './providers';
import { AppRoutes } from './routes';
import { ErrorBoundary } from '../shared/components/ErrorBoundary';
import { ProgressBar } from '../shared/components/ProgressBar';

function App() {
  return (
    <Providers>
      <ErrorBoundary>
        <ProgressBar />
        <AppRoutes />
      </ErrorBoundary>
    </Providers>
  );
}

export default App;

