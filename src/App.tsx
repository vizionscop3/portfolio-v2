import { BrowserRouter } from 'react-router-dom';
import { AccessibilityProvider } from './components/accessibility';
import { AnalyticsProvider } from './components/analytics';
import { DeploymentInfo } from './components/DeploymentInfo';
// import { AssetPreloader } from './components/loading'; // Temporarily disabled
import { Layout } from './components/layout';
import { PerformanceMonitor } from './components/performance';
import { PortfolioRouter } from './components/routing';
import { PipWindowProvider } from './app/providers/contexts/PipWindowContext';
import './shared/styles/index.css';
import {
  ErrorBoundary,
  setupGlobalErrorHandlers,
} from './shared/utils/errorHandling';
import { initializeLogging } from './shared/utils/loggingService';
// Portfolio assets are automatically initialized in assetRegistry

// Initialize professional logging system
initializeLogging();

// Set up global error handlers on app initialization
setupGlobalErrorHandlers();

function App() {
  return (
    <ErrorBoundary>
      {/* Temporarily disabled AssetPreloader to fix loading issues */}
      {/* <AssetPreloader
        onLoadingComplete={() => {
          console.log('Portfolio assets loaded successfully');
        }}
        onError={errors => {
          console.warn('Asset loading errors:', errors);
        }}
        showLoadingScreen={true}
        minLoadingTime={1500}
      > */}
      <BrowserRouter
        future={{
          v7_startTransition: true,
          v7_relativeSplatPath: true,
        }}
      >
        <AnalyticsProvider
          enabled={true}
          showDashboard={false}
          dashboardPosition="bottom-right"
        >
          <AccessibilityProvider
            onSectionNavigation={section => {
              // This will be handled by the PortfolioRouter
              window.location.hash = `#${section}`;
            }}
          >
            <PipWindowProvider>
              <Layout>
                <PortfolioRouter />
                <PerformanceMonitor
                  position="top-right"
                  showRecommendations={true}
                />
                <DeploymentInfo />
              </Layout>
            </PipWindowProvider>
          </AccessibilityProvider>
        </AnalyticsProvider>
      </BrowserRouter>
      {/* </AssetPreloader> */}
    </ErrorBoundary>
  );
}

export default App;
