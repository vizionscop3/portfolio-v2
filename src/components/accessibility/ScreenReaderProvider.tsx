/**
 * Screen Reader Provider
 *
 * Provides comprehensive screen reader support for the 3D portfolio,
 * including announcements, alternative text descriptions, and section navigation support.
 */

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
} from 'react';

interface ScreenReaderContextType {
  announce: (message: string, priority?: 'polite' | 'assertive') => void;
  announceSection: (sectionName: string, description?: string) => void;
  announceInteraction: (
    objectName: string,
    action: string,
    result?: string
  ) => void;
  setAlternativeText: (elementId: string, altText: string) => void;
  getAlternativeText: (elementId: string) => string | undefined;
}

const ScreenReaderContext = createContext<ScreenReaderContextType | null>(null);

export const useScreenReader = () => {
  const context = useContext(ScreenReaderContext);
  if (!context) {
    throw new Error('useScreenReader must be used within ScreenReaderProvider');
  }
  return context;
};

interface ScreenReaderProviderProps {
  children: React.ReactNode;
}

export const ScreenReaderProvider: React.FC<ScreenReaderProviderProps> = ({
  children,
}) => {
  const announcementQueueRef = useRef<
    Array<{ message: string; priority: 'polite' | 'assertive'; id: string }>
  >([]);
  const alternativeTextsRef = useRef<Map<string, string>>(new Map());
  const lastAnnouncementRef = useRef<string>('');
  const announcementTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Section descriptions for screen readers
  const sectionDescriptions = {
    about:
      'Personal information, background, and professional summary of Denward Lee Aulder',
    tech: 'Technical skills showcase including programming languages, frameworks, and development projects',
    blog: 'Collection of blog posts, articles, and technical writing about development and technology',
    fashion:
      'Creative fashion gallery showcasing style, design work, and artistic photography',
    merch:
      'Merchandise store featuring custom designs, apparel, and branded products for purchase',
  };

  // 3D object descriptions for screen readers
  const objectDescriptions = {
    'desk-computer':
      'Interactive holographic computer display showing technical skills and project portfolio',
    'bed-book':
      'Digital codex with floating holographic pages containing blog posts and articles',
    'closet-main':
      'Futuristic neon wardrobe pod with LED lighting displaying fashion gallery items',
    'shelf-merch':
      'Holographic merchandise display showcasing products with floating previews and pricing',
    'desk-headphones':
      'Advanced audio engineering station with waveform displays and mixing console controls',
  };

  const announce = useCallback(
    (message: string, priority: 'polite' | 'assertive' = 'polite') => {
      // Avoid duplicate announcements
      if (message === lastAnnouncementRef.current) {
        return;
      }

      const id = Date.now().toString();
      const announcement = { message, priority, id };

      announcementQueueRef.current.push(announcement);
      lastAnnouncementRef.current = message;

      // Clear previous timeout
      if (announcementTimeoutRef.current) {
        clearTimeout(announcementTimeoutRef.current);
      }

      // Set timeout to clear announcement after it's been read
      announcementTimeoutRef.current = setTimeout(() => {
        announcementQueueRef.current = announcementQueueRef.current.filter(
          a => a.id !== id
        );
        if (announcementQueueRef.current.length === 0) {
          lastAnnouncementRef.current = '';
        }
      }, 3000);

      // Trigger re-render by dispatching a custom event
      window.dispatchEvent(
        new CustomEvent('screenreader-announcement', { detail: announcement })
      );
    },
    []
  );

  const announceSection = useCallback(
    (sectionName: string, description?: string) => {
      const sectionKey =
        sectionName.toLowerCase() as keyof typeof sectionDescriptions;
      const sectionDesc =
        description ||
        sectionDescriptions[sectionKey] ||
        `${sectionName} section`;

      announce(
        `Navigated to ${sectionName} section. ${sectionDesc}. Use Tab to navigate interactive elements, or number keys 1 through 5 to jump between sections.`,
        'assertive'
      );
    },
    [announce]
  );

  const announceInteraction = useCallback(
    (objectName: string, action: string, result?: string) => {
      const objectKey = objectName
        .toLowerCase()
        .replace(/\s+/g, '-') as keyof typeof objectDescriptions;
      const objectDesc = objectDescriptions[objectKey] || objectName;

      let message = '';

      switch (action) {
        case 'focus':
          message = `Focused on ${objectName}. ${objectDesc}. Press Enter or Space to activate.`;
          break;
        case 'activate':
          message = `Activated ${objectName}. ${result || 'Loading content.'} Please wait.`;
          break;
        case 'hover':
          message = `Hovering over ${objectName}. ${objectDesc}`;
          break;
        default:
          message = `${action} ${objectName}. ${result || ''}`;
      }

      announce(message, action === 'activate' ? 'assertive' : 'polite');
    },
    [announce]
  );

  const setAlternativeText = useCallback(
    (elementId: string, altText: string) => {
      alternativeTextsRef.current.set(elementId, altText);
    },
    []
  );

  const getAlternativeText = useCallback((elementId: string) => {
    return alternativeTextsRef.current.get(elementId);
  }, []);

  // Initialize screen reader support
  useEffect(() => {
    // Announce page load
    announce(
      "Welcome to Denward Lee Aulder's interactive 3D portfolio. This is a cyberpunk-themed showcase featuring tech skills, blog posts, fashion gallery, and merchandise. You can navigate using keyboard shortcuts: Tab to move between elements, arrow keys for spatial navigation, Enter to activate, and number keys 1-5 to jump to sections.",
      'assertive'
    );

    // Set up initial alternative texts for key elements
    setAlternativeText(
      'main-portfolio',
      'Interactive 3D portfolio room with cyberpunk styling'
    );
    setAlternativeText(
      'navigation-menu',
      'Main navigation menu with section links'
    );
    setAlternativeText(
      'performance-monitor',
      'Performance monitoring display showing FPS and optimization status'
    );

    return () => {
      if (announcementTimeoutRef.current) {
        clearTimeout(announcementTimeoutRef.current);
      }
    };
  }, [announce, setAlternativeText]);

  const contextValue: ScreenReaderContextType = {
    announce,
    announceSection,
    announceInteraction,
    setAlternativeText,
    getAlternativeText,
  };

  return (
    <ScreenReaderContext.Provider value={contextValue}>
      {children}
      <ScreenReaderAnnouncements />
    </ScreenReaderContext.Provider>
  );
};

// Component for live region announcements
const ScreenReaderAnnouncements: React.FC = () => {
  const [politeAnnouncements, setPoliteAnnouncements] = React.useState<
    string[]
  >([]);
  const [assertiveAnnouncements, setAssertiveAnnouncements] = React.useState<
    string[]
  >([]);

  useEffect(() => {
    const handleAnnouncement = (event: CustomEvent) => {
      const { message, priority } = event.detail;

      if (priority === 'assertive') {
        setAssertiveAnnouncements(prev => [...prev, message]);
        // Clear assertive announcements after reading
        setTimeout(() => {
          setAssertiveAnnouncements(prev => prev.slice(1));
        }, 100);
      } else {
        setPoliteAnnouncements(prev => [...prev, message]);
        // Clear polite announcements after reading
        setTimeout(() => {
          setPoliteAnnouncements(prev => prev.slice(1));
        }, 100);
      }
    };

    window.addEventListener(
      'screenreader-announcement',
      handleAnnouncement as EventListener
    );

    return () => {
      window.removeEventListener(
        'screenreader-announcement',
        handleAnnouncement as EventListener
      );
    };
  }, []);

  return (
    <>
      {/* Polite announcements */}
      <div
        aria-live="polite"
        aria-atomic="true"
        className="sr-only"
        role="status"
        aria-label="Status updates"
      >
        {politeAnnouncements.map((message, index) => (
          <div key={index}>{message}</div>
        ))}
      </div>

      {/* Assertive announcements */}
      <div
        aria-live="assertive"
        aria-atomic="true"
        className="sr-only"
        role="alert"
        aria-label="Important notifications"
      >
        {assertiveAnnouncements.map((message, index) => (
          <div key={index}>{message}</div>
        ))}
      </div>

      {/* Hidden navigation landmarks for screen readers */}
      <nav aria-label="Screen reader navigation shortcuts" className="sr-only">
        <h2>Quick Navigation</h2>
        <ul>
          <li>
            <a href="#about" aria-describedby="about-desc">
              About Section
            </a>
          </li>
          <li>
            <a href="#tech" aria-describedby="tech-desc">
              Technical Skills
            </a>
          </li>
          <li>
            <a href="#blog" aria-describedby="blog-desc">
              Blog Posts
            </a>
          </li>
          <li>
            <a href="#fashion" aria-describedby="fashion-desc">
              Fashion Gallery
            </a>
          </li>
          <li>
            <a href="#merch" aria-describedby="merch-desc">
              Merchandise Store
            </a>
          </li>
        </ul>

        <div id="about-desc" className="sr-only">
          Personal information and professional background
        </div>
        <div id="tech-desc" className="sr-only">
          Programming skills, frameworks, and development projects
        </div>
        <div id="blog-desc" className="sr-only">
          Technical articles and blog posts
        </div>
        <div id="fashion-desc" className="sr-only">
          Creative fashion gallery and style showcase
        </div>
        <div id="merch-desc" className="sr-only">
          Custom merchandise and branded products
        </div>
      </nav>

      {/* Skip navigation for screen readers */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:bg-cyan-400 focus:text-black focus:px-4 focus:py-2 focus:rounded focus:z-50"
        tabIndex={0}
      >
        Skip to main content
      </a>
    </>
  );
};

export default ScreenReaderProvider;
