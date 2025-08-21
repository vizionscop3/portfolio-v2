import { render, screen, fireEvent } from '@testing-library/react';
import { describe, expect, it, vi, beforeEach } from 'vitest';
import PerformanceMonitor from '../PerformanceMonitor';

// Mock framer-motion
vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: Record<string, unknown>) => (
      <div {...props}>{children}</div>
    ),
    button: ({ children, ...props }: Record<string, unknown>) => (
      <button {...props}>{children}</button>
    ),
  },
  AnimatePresence: ({ children }: { children: React.ReactNode }) => (
    <>{children}</>
  ),
}));

interface MockIconProps {
  size?: number;
  className?: string;
}

// Mock lucide-react icons
vi.mock('lucide-react', () => ({
  Activity: ({ size, className, ...props }: MockIconProps) => (
    <svg data-testid="activity-icon" className={className} {...props}>
      {size}
    </svg>
  ),
  BarChart3: ({ size, className, ...props }: MockIconProps) => (
    <svg data-testid="barchart-icon" className={className} {...props}>
      {size}
    </svg>
  ),
  Settings: ({ size, className, ...props }: MockIconProps) => (
    <svg data-testid="settings-icon" className={className} {...props}>
      {size}
    </svg>
  ),
  X: ({ size, className, ...props }: MockIconProps) => (
    <svg data-testid="x-icon" className={className} {...props}>
      {size}
    </svg>
  ),
  Monitor: ({ size, className, ...props }: MockIconProps) => (
    <svg data-testid="monitor-icon" className={className} {...props}>
      {size}
    </svg>
  ),
  Zap: ({ size, className, ...props }: MockIconProps) => (
    <svg data-testid="zap-icon" className={className} {...props}>
      {size}
    </svg>
  ),
  AlertTriangle: ({ size, className, ...props }: MockIconProps) => (
    <svg data-testid="alert-triangle-icon" className={className} {...props}>
      {size}
    </svg>
  ),
  CheckCircle: ({ size, className, ...props }: MockIconProps) => (
    <svg data-testid="check-circle-icon" className={className} {...props}>
      {size}
    </svg>
  ),
}));

// Mock performance hook with controllable state
const mockPerformanceData = {
  metrics: {
    fps: 60,
    frameTime: 16.67,
    memoryUsage: 25 * 1024 * 1024, // 25MB
    drawCalls: 150,
    triangles: 50000,
    averageFps: 58,
    gpuMemory: undefined,
  },
  mode: 'high' as 'high' | 'medium' | 'low',
  isMonitoring: false,
  start: vi.fn(),
  stop: vi.fn(),
  reset: vi.fn(),
  setMode: vi.fn(),
};

vi.mock('@/hooks/usePerformanceMonitor', () => ({
  usePerformanceMonitor: vi.fn(() => mockPerformanceData),
}));

// Mock performance utilities
vi.mock('@/utils/performance', () => ({
  formatBytes: vi.fn(
    (bytes: number) => `${(bytes / (1024 * 1024)).toFixed(1)} MB`
  ),
  getPerformanceRecommendations: vi.fn(() => []),
}));

describe('PerformanceMonitor', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Reset to default state
    mockPerformanceData.isMonitoring = false;
    mockPerformanceData.metrics = {
      fps: 60,
      frameTime: 16.67,
      memoryUsage: 25 * 1024 * 1024,
      drawCalls: 150,
      triangles: 50000,
      averageFps: 58,
      gpuMemory: undefined,
    };
    mockPerformanceData.mode = 'high';
  });

  it('renders start button when not monitoring', () => {
    render(<PerformanceMonitor />);

    const startButton = screen.getByRole('button');
    expect(startButton).toBeInTheDocument();
    expect(screen.getByTestId('activity-icon')).toBeInTheDocument();
  });

  it('calls start function when start button is clicked', () => {
    render(<PerformanceMonitor />);

    const startButton = screen.getByRole('button');
    fireEvent.click(startButton);

    expect(mockPerformanceData.start).toHaveBeenCalled();
  });

  it('renders compact view when monitoring', () => {
    mockPerformanceData.isMonitoring = true;

    render(<PerformanceMonitor />);

    expect(screen.getByText('58 FPS')).toBeInTheDocument();
    expect(screen.getByTestId('check-circle-icon')).toBeInTheDocument();
  });

  it('expands to detailed view when chart button is clicked', () => {
    mockPerformanceData.isMonitoring = true;

    render(<PerformanceMonitor />);

    const expandButton = screen.getByTestId('barchart-icon').closest('button');
    expect(expandButton).toBeInTheDocument();

    fireEvent.click(expandButton!);

    expect(screen.getByText('Performance Monitor')).toBeInTheDocument();
  });

  it('displays performance metrics in expanded view', () => {
    mockPerformanceData.isMonitoring = true;

    render(<PerformanceMonitor />);

    // Expand the monitor
    const expandButton = screen.getByTestId('barchart-icon').closest('button');
    fireEvent.click(expandButton!);

    // Check for metrics
    expect(screen.getByText('FPS (Average)')).toBeInTheDocument();
    expect(screen.getByText('Frame Time')).toBeInTheDocument();
    expect(screen.getByText('Memory')).toBeInTheDocument();
    expect(screen.getByText('Mode')).toBeInTheDocument();
  });

  it('shows settings panel when settings button is clicked', () => {
    mockPerformanceData.isMonitoring = true;

    render(<PerformanceMonitor />);

    // Expand the monitor
    const expandButton = screen.getByTestId('barchart-icon').closest('button');
    fireEvent.click(expandButton!);

    // Click settings button
    const settingsButton = screen
      .getByTestId('settings-icon')
      .closest('button');
    fireEvent.click(settingsButton!);

    expect(screen.getByText('Performance Mode:')).toBeInTheDocument();
    const highButtons = screen.getAllByText('HIGH');
    expect(highButtons.length).toBeGreaterThan(0);
    expect(screen.getByText('MEDIUM')).toBeInTheDocument();
    expect(screen.getByText('LOW')).toBeInTheDocument();
  });

  it('calls setMode when performance mode button is clicked', () => {
    mockPerformanceData.isMonitoring = true;

    render(<PerformanceMonitor />);

    // Expand the monitor
    const expandButton = screen.getByTestId('barchart-icon').closest('button');
    fireEvent.click(expandButton!);

    // Open settings
    const settingsButton = screen
      .getByTestId('settings-icon')
      .closest('button');
    fireEvent.click(settingsButton!);

    // Click medium mode
    const mediumButton = screen.getByText('MEDIUM');
    fireEvent.click(mediumButton);

    expect(mockPerformanceData.setMode).toHaveBeenCalledWith('medium');
  });

  it('displays different icons for different performance modes', () => {
    mockPerformanceData.isMonitoring = true;

    // High performance mode
    mockPerformanceData.mode = 'high';
    const { rerender } = render(<PerformanceMonitor />);
    expect(screen.getByTestId('check-circle-icon')).toBeInTheDocument();

    // Medium performance mode
    mockPerformanceData.mode = 'medium';
    rerender(<PerformanceMonitor />);
    expect(screen.getByTestId('alert-triangle-icon')).toBeInTheDocument();

    // Low performance mode
    mockPerformanceData.mode = 'low';
    rerender(<PerformanceMonitor />);
    expect(screen.getByTestId('alert-triangle-icon')).toBeInTheDocument();
  });

  it('calls stop function when stop button is clicked', () => {
    mockPerformanceData.isMonitoring = true;

    render(<PerformanceMonitor />);

    const stopButton = screen.getByTestId('x-icon').closest('button');
    fireEvent.click(stopButton!);

    expect(mockPerformanceData.stop).toHaveBeenCalled();
  });

  it('applies correct position classes', () => {
    const { rerender } = render(<PerformanceMonitor position="top-left" />);
    expect(screen.getByRole('button').closest('div')).toHaveClass(
      'top-4',
      'left-4'
    );

    rerender(<PerformanceMonitor position="bottom-right" />);
    expect(screen.getByRole('button').closest('div')).toHaveClass(
      'bottom-4',
      'right-4'
    );
  });

  it('displays performance recommendations when available', async () => {
    mockPerformanceData.isMonitoring = true;

    // Mock recommendations using vi.mock at module level
    const mockRecommendations = [
      'Consider reducing visual effects quality',
      'Enable Level of Detail (LOD) system',
    ];

    // Import and mock the utils module
    const utils = await import('@/utils/performance');
    const getPerformanceRecommendationsSpy = vi.spyOn(
      utils,
      'getPerformanceRecommendations'
    );
    getPerformanceRecommendationsSpy.mockReturnValue(mockRecommendations);

    render(<PerformanceMonitor showRecommendations={true} />);

    // Expand the monitor
    const expandButton = screen.getByTestId('barchart-icon').closest('button');
    fireEvent.click(expandButton!);

    expect(screen.getByText('Recommendations')).toBeInTheDocument();
    expect(
      screen.getByText('• Consider reducing visual effects quality')
    ).toBeInTheDocument();
  });

  it('formats memory usage correctly', () => {
    mockPerformanceData.isMonitoring = true;
    mockPerformanceData.metrics.memoryUsage = 50 * 1024 * 1024; // 50MB

    render(<PerformanceMonitor />);

    // Expand the monitor
    const expandButton = screen.getByTestId('barchart-icon').closest('button');
    fireEvent.click(expandButton!);

    expect(screen.getByText('50.0 MB')).toBeInTheDocument();
  });

  it('collapses when close button is clicked in expanded view', () => {
    mockPerformanceData.isMonitoring = true;

    render(<PerformanceMonitor />);

    // Expand the monitor
    const expandButton = screen.getByTestId('barchart-icon').closest('button');
    fireEvent.click(expandButton!);

    expect(screen.getByText('Performance Monitor')).toBeInTheDocument();

    // Close the expanded view
    const closeButtons = screen.getAllByTestId('x-icon');
    const closeExpandedButton = closeButtons.find(button =>
      button.closest('div')?.textContent?.includes('Performance Monitor')
    );
    fireEvent.click(closeExpandedButton!.closest('button')!);

    // Should be back to compact view
    expect(screen.queryByText('Performance Monitor')).not.toBeInTheDocument();
    expect(screen.getByText('58 FPS')).toBeInTheDocument();
  });
});
