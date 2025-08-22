/**
 * Analytics Dashboard Component
 * 
 * Provides a comprehensive dashboard for viewing analytics data including
 * user behavior, 3D interactions, performance metrics, and error reports.
 */

import React, { useState, useEffect } from 'react';
import { 
  BarChart3, 
  Eye, 
  MousePointer, 
  Clock, 
  AlertTriangle,
  Activity,
  Users,
  Zap,
  TrendingUp,
  TrendingDown,
  ChevronDown,
  ChevronUp
} from 'lucide-react';

interface AnalyticsData {
  pageViews: { section: string; count: number; }[];
  userInteractions: { element: string; count: number; }[];
  threeDInteractions: { objectId: string; type: string; count: number; }[];
  performanceMetrics: { metric: string; value: number; unit: string; }[];
  errors: { type: string; count: number; message: string; }[];
  realTimeStats: {
    activeUsers: number;
    currentSection: string;
    avgSessionDuration: number;
    bounceRate: number;
  };
}

interface DashboardProps {
  className?: string;
  isOpen?: boolean;
  onToggle?: () => void;
  position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
}

export const AnalyticsDashboard: React.FC<DashboardProps> = ({
  className = '',
  isOpen = false,
  onToggle,
  position = 'bottom-right'
}) => {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'behavior' | '3d' | 'performance' | 'errors'>('overview');
  const [isMinimized, setIsMinimized] = useState(false);

  // Position classes
  const positionClasses = {
    'top-left': 'top-4 left-4',
    'top-right': 'top-4 right-4',
    'bottom-left': 'bottom-4 left-4',
    'bottom-right': 'bottom-4 right-4'
  };

  // Mock data fetching - in a real app, this would fetch from your analytics API
  useEffect(() => {
    if (isOpen && !data) {
      setIsLoading(true);
      // Simulate API call
      setTimeout(() => {
        setData({
          pageViews: [
            { section: 'about', count: 1250 },
            { section: 'tech', count: 980 },
            { section: 'blog', count: 750 },
            { section: 'fashion', count: 420 },
            { section: 'merch', count: 320 }
          ],
          userInteractions: [
            { element: 'navigation', count: 2850 },
            { element: 'project_demo', count: 450 },
            { element: 'social_share', count: 180 },
            { element: 'contact_form', count: 85 }
          ],
          threeDInteractions: [
            { objectId: 'desk-computer', type: 'hover', count: 820 },
            { objectId: 'desk-computer', type: 'click', count: 340 },
            { objectId: 'bed-book', type: 'hover', count: 620 },
            { objectId: 'closet-main', type: 'click', count: 280 }
          ],
          performanceMetrics: [
            { metric: 'LCP', value: 2.4, unit: 's' },
            { metric: 'FID', value: 45, unit: 'ms' },
            { metric: 'CLS', value: 0.08, unit: 'score' },
            { metric: 'FPS', value: 58, unit: 'fps' }
          ],
          errors: [
            { type: 'TypeError', count: 12, message: 'Cannot read properties of undefined' },
            { type: 'NetworkError', count: 8, message: 'Failed to fetch' },
            { type: 'ReferenceError', count: 3, message: 'Variable not defined' }
          ],
          realTimeStats: {
            activeUsers: 24,
            currentSection: 'tech',
            avgSessionDuration: 245000, // in ms
            bounceRate: 0.32
          }
        });
        setIsLoading(false);
      }, 1000);
    }
  }, [isOpen, data]);

  if (!isOpen) return null;


  return (
    <div className={`fixed z-50 ${positionClasses[position]} ${className}`}>
      <div className={`bg-black/95 border border-cyan-400/50 rounded-lg backdrop-blur-md text-cyan-300 transition-all duration-300 ${
        isMinimized ? 'w-80 h-12' : 'w-96 h-[600px]'
      }`}>
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-cyan-400/30">
          <div className="flex items-center space-x-2">
            <BarChart3 className="w-5 h-5 text-cyan-400" />
            <h3 className="font-mono font-semibold text-cyan-400">Analytics</h3>
            {data && (
              <span className="text-xs text-cyan-300/70">
                {data.realTimeStats.activeUsers} active
              </span>
            )}
          </div>
          
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setIsMinimized(!isMinimized)}
              className="text-cyan-300 hover:text-cyan-400 transition-colors"
            >
              {isMinimized ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>
            
            {onToggle && (
              <button
                onClick={onToggle}
                className="text-cyan-300 hover:text-cyan-400 transition-colors"
              >
                ✕
              </button>
            )}
          </div>
        </div>

        {!isMinimized && (
          <>
            {/* Tabs */}
            <div className="flex border-b border-cyan-400/30">
              {[
                { id: 'overview', label: 'Overview', icon: Activity },
                { id: 'behavior', label: 'Behavior', icon: Users },
                { id: '3d', label: '3D', icon: MousePointer },
                { id: 'performance', label: 'Perf', icon: Zap },
                { id: 'errors', label: 'Errors', icon: AlertTriangle }
              ].map(tab => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`flex-1 flex items-center justify-center space-x-1 py-2 text-xs font-mono transition-colors ${
                      activeTab === tab.id
                        ? 'bg-cyan-400/20 text-cyan-400'
                        : 'text-cyan-300 hover:text-cyan-400'
                    }`}
                  >
                    <Icon className="w-3 h-3" />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Content */}
            <div className="p-4 h-[480px] overflow-y-auto">
              {isLoading ? (
                <div className="flex items-center justify-center h-full">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-400"></div>
                </div>
              ) : data ? (
                <>
                  {activeTab === 'overview' && <OverviewTab data={data} />}
                  {activeTab === 'behavior' && <BehaviorTab data={data} />}
                  {activeTab === '3d' && <ThreeDTab data={data} />}
                  {activeTab === 'performance' && <PerformanceTab data={data} />}
                  {activeTab === 'errors' && <ErrorsTab data={data} />}
                </>
              ) : (
                <div className="text-center text-cyan-300/70">
                  No data available
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

// Overview Tab Component
const OverviewTab: React.FC<{ data: AnalyticsData }> = ({ data }) => (
  <div className="space-y-4">
    {/* Real-time stats */}
    <div className="grid grid-cols-2 gap-3">
      <StatCard 
        icon={Users} 
        label="Active Users" 
        value={data.realTimeStats.activeUsers.toString()} 
      />
      <StatCard 
        icon={Eye} 
        label="Current Section" 
        value={data.realTimeStats.currentSection} 
      />
      <StatCard 
        icon={Clock} 
        label="Avg Session" 
        value={formatDuration(data.realTimeStats.avgSessionDuration)} 
      />
      <StatCard 
        icon={TrendingDown} 
        label="Bounce Rate" 
        value={formatPercentage(data.realTimeStats.bounceRate)} 
      />
    </div>

    {/* Top sections */}
    <div>
      <h4 className="text-sm font-mono font-semibold mb-2">Top Sections</h4>
      <div className="space-y-1">
        {data.pageViews.slice(0, 3).map((item) => (
          <div key={item.section} className="flex justify-between text-xs">
            <span className="capitalize">{item.section}</span>
            <span className="text-cyan-400">{item.count}</span>
          </div>
        ))}
      </div>
    </div>

    {/* Performance summary */}
    <div>
      <h4 className="text-sm font-mono font-semibold mb-2">Performance</h4>
      <div className="grid grid-cols-2 gap-2 text-xs">
        {data.performanceMetrics.map(metric => (
          <div key={metric.metric} className="flex justify-between">
            <span>{metric.metric}</span>
            <span className={
              metric.metric === 'LCP' ? (metric.value < 2.5 ? 'text-green-400' : 'text-yellow-400') :
              metric.metric === 'FID' ? (metric.value < 100 ? 'text-green-400' : 'text-yellow-400') :
              metric.metric === 'CLS' ? (metric.value < 0.1 ? 'text-green-400' : 'text-yellow-400') :
              'text-cyan-400'
            }>
              {metric.value}{metric.unit}
            </span>
          </div>
        ))}
      </div>
    </div>
  </div>
);

// Behavior Tab Component
const BehaviorTab: React.FC<{ data: AnalyticsData }> = ({ data }) => (
  <div className="space-y-4">
    <div>
      <h4 className="text-sm font-mono font-semibold mb-2">Page Views</h4>
      <div className="space-y-2">
        {data.pageViews.map(item => (
          <div key={item.section} className="flex justify-between items-center">
            <span className="text-xs capitalize">{item.section}</span>
            <div className="flex items-center space-x-2">
              <div className="w-16 h-2 bg-cyan-400/20 rounded">
                <div 
                  className="h-full bg-cyan-400 rounded"
                  style={{ width: `${(item.count / Math.max(...data.pageViews.map(p => p.count))) * 100}%` }}
                />
              </div>
              <span className="text-xs text-cyan-400 w-8">{item.count}</span>
            </div>
          </div>
        ))}
      </div>
    </div>

    <div>
      <h4 className="text-sm font-mono font-semibold mb-2">User Interactions</h4>
      <div className="space-y-1">
        {data.userInteractions.map(item => (
          <div key={item.element} className="flex justify-between text-xs">
            <span>{item.element.replace('_', ' ')}</span>
            <span className="text-cyan-400">{item.count}</span>
          </div>
        ))}
      </div>
    </div>
  </div>
);

// 3D Tab Component
const ThreeDTab: React.FC<{ data: AnalyticsData }> = ({ data }) => (
  <div className="space-y-4">
    <div>
      <h4 className="text-sm font-mono font-semibold mb-2">3D Object Interactions</h4>
      <div className="space-y-2">
        {data.threeDInteractions.map((item, index) => (
          <div key={`${item.objectId}-${item.type}-${index}`} className="flex justify-between items-center text-xs">
            <div>
              <div className="font-medium">{item.objectId.replace('-', ' ')}</div>
              <div className="text-cyan-300/70 capitalize">{item.type}</div>
            </div>
            <span className="text-cyan-400">{item.count}</span>
          </div>
        ))}
      </div>
    </div>
  </div>
);

// Performance Tab Component
const PerformanceTab: React.FC<{ data: AnalyticsData }> = ({ data }) => (
  <div className="space-y-4">
    <div>
      <h4 className="text-sm font-mono font-semibold mb-2">Core Web Vitals</h4>
      <div className="space-y-3">
        {data.performanceMetrics.map(metric => (
          <div key={metric.metric} className="flex justify-between items-center">
            <span className="text-xs font-medium">{metric.metric}</span>
            <div className="flex items-center space-x-2">
              <span className={`text-xs px-2 py-1 rounded ${
                metric.metric === 'LCP' ? (metric.value < 2.5 ? 'bg-green-400/20 text-green-400' : 'bg-yellow-400/20 text-yellow-400') :
                metric.metric === 'FID' ? (metric.value < 100 ? 'bg-green-400/20 text-green-400' : 'bg-yellow-400/20 text-yellow-400') :
                metric.metric === 'CLS' ? (metric.value < 0.1 ? 'bg-green-400/20 text-green-400' : 'bg-yellow-400/20 text-yellow-400') :
                'bg-cyan-400/20 text-cyan-400'
              }`}>
                {metric.value}{metric.unit}
              </span>
              {metric.metric === 'LCP' && (metric.value < 2.5 ? <TrendingUp className="w-3 h-3 text-green-400" /> : <TrendingDown className="w-3 h-3 text-yellow-400" />)}
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

// Errors Tab Component
const ErrorsTab: React.FC<{ data: AnalyticsData }> = ({ data }) => (
  <div className="space-y-4">
    <div>
      <h4 className="text-sm font-mono font-semibold mb-2">Error Summary</h4>
      <div className="space-y-2">
        {data.errors.map((item, index) => (
          <div key={`${item.type}-${index}`} className="border border-red-400/30 rounded p-2">
            <div className="flex justify-between items-center mb-1">
              <span className="text-xs font-medium text-red-400">{item.type}</span>
              <span className="text-xs text-red-400">{item.count}</span>
            </div>
            <div className="text-xs text-cyan-300/70 truncate">{item.message}</div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

// Utility Components
const StatCard: React.FC<{ 
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
}> = ({ icon: Icon, label, value }) => (
  <div className="bg-cyan-400/10 border border-cyan-400/30 rounded p-2">
    <div className="flex items-center space-x-2 mb-1">
      <Icon className="w-3 h-3 text-cyan-400" />
      <span className="text-xs text-cyan-300/70">{label}</span>
    </div>
    <div className="text-sm font-mono font-semibold text-cyan-400">{value}</div>
  </div>
);

const formatDuration = (ms: number) => {
  const minutes = Math.floor(ms / 60000);
  const seconds = Math.floor((ms % 60000) / 1000);
  return `${minutes}m ${seconds}s`;
};

const formatPercentage = (value: number) => {
  return `${(value * 100).toFixed(1)}%`;
};

export default AnalyticsDashboard;