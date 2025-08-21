import { BrowserRouter } from 'react-router-dom';
import { NavigationOverlay, PortfolioRouter } from './components/routing';
import './styles/index.css';
import { ErrorBoundary, setupGlobalErrorHandlers } from './utils/errorHandling';

// Set up global error handlers on app initialization
setupGlobalErrorHandlers();

function App() {
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <div className="relative">
          <PortfolioRouter />
          <NavigationOverlay />
        </div>
      </BrowserRouter>
    </ErrorBoundary>
  );
}

export default App;
