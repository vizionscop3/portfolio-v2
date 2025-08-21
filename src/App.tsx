import { BrowserRouter } from 'react-router-dom';
import { NavigationOverlay, PortfolioRouter } from './components/routing';
import { PerformanceMonitor } from './components/performance';
import { AssetPreloader } from './components/loading';
import { KeyboardAccessibilityProvider } from './components/accessibility';
import './styles/index.css';
import {
  ErrorBoundary,
  setupGlobalErrorHandlers,
} from './utils/errorHandling.tsx';
// Portfolio assets are automatically initialized in assetRegistry

// Set up global error handlers on app initialization
setupGlobalErrorHandlers();

function App() {
  return (
    <ErrorBoundary>
      <AssetPreloader
        onLoadingComplete={() => {
          console.log('Portfolio assets loaded successfully');
        }}
        onError={errors => {
          console.warn('Asset loading errors:', errors);
        }}
        showLoadingScreen={true}
        minLoadingTime={1500}
      >
        <BrowserRouter>
          <KeyboardAccessibilityProvider
            onSectionNavigation={section => {
              // This will be handled by the PortfolioRouter
              window.location.hash = `#${section}`;
            }}
          >
            <div className="relative">
              <PortfolioRouter />
              <NavigationOverlay />
              <PerformanceMonitor
                position="top-right"
                showRecommendations={true}
              />
            </div>
          </KeyboardAccessibilityProvider>
        </BrowserRouter>
      </AssetPreloader>
    </ErrorBoundary>
  );
}

export default App;
