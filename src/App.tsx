import { BrowserRouter } from 'react-router-dom';
import { AccessibilityProvider } from './components/accessibility';
import { AnalyticsProvider } from './components/analytics';
import { DeploymentInfo } from './components/DeploymentInfo';
import { AssetPreloader } from './components/loading';
import { PerformanceMonitor } from './components/performance';
import { NavigationOverlay, PortfolioRouter } from './components/routing';
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
          <AnalyticsProvider
            enabled={true}
            showDashboard={process.env.NODE_ENV === 'development'}
            dashboardPosition="bottom-right"
          >
            <AccessibilityProvider
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
                <DeploymentInfo />
              </div>
            </AccessibilityProvider>
          </AnalyticsProvider>
        </BrowserRouter>
      </AssetPreloader>
    </ErrorBoundary>
  );
}

export default App;
