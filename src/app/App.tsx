import { Providers } from './providers';
import { AppRoutes } from './routes';
import { ErrorBoundary } from '../shared/components/ErrorBoundary';

function App() {
  return (
    <Providers>
      <ErrorBoundary>
        <AppRoutes />
      </ErrorBoundary>
    </Providers>
  );
}

export default App;

