import Portfolio from './components/Portfolio';
import './styles/index.css';
import { ErrorBoundary, setupGlobalErrorHandlers } from './utils/errorHandling';

// Set up global error handlers on app initialization
setupGlobalErrorHandlers();

function App() {
  return (
    <ErrorBoundary>
      <Portfolio />
    </ErrorBoundary>
  );
}

export default App;
