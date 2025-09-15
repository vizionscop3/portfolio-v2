import { useCallback, useEffect, useRef, useState } from 'react';

interface ScrollSectionState {
  activeSection: number;
  scrollProgress: number;
  sections: HTMLElement[];
  isScrolling: boolean;
}

interface UseScrollTransitionsReturn {
  activeSection: number;
  scrollProgress: number;
  registerSection: (element: HTMLElement | null, index: number) => void;
  isScrolling: boolean;
  scrollToSection: (index: number) => void;
}

export const useScrollTransitions = (): UseScrollTransitionsReturn => {
  const [state, setState] = useState<ScrollSectionState>({
    activeSection: 0,
    scrollProgress: 0,
    sections: [],
    isScrolling: false,
  });

  const sectionsRef = useRef<(HTMLElement | null)[]>([]);
  const scrollTimeoutRef = useRef<NodeJS.Timeout>();
  const rafRef = useRef<number>();

  // Register sections for tracking
  const registerSection = useCallback(
    (element: HTMLElement | null, index: number) => {
      sectionsRef.current[index] = element;

      if (element) {
        setState(prev => {
          const newSections = [...prev.sections];
          newSections[index] = element;
          return { ...prev, sections: newSections };
        });
      }
    },
    []
  );

  // Calculate which section should be active based on scroll position
  const calculateActiveSection = useCallback(() => {
    const sections = sectionsRef.current.filter(Boolean) as HTMLElement[];
    if (sections.length === 0) return { activeSection: 0, scrollProgress: 0 };

    const scrollY = window.scrollY;
    const windowHeight = window.innerHeight;
    const documentHeight = document.documentElement.scrollHeight;

    // Calculate scroll progress (0 to 1)
    const scrollProgress = Math.min(
      scrollY / (documentHeight - windowHeight),
      1
    );

    // Find active section based on scroll position
    let activeSection = 0;

    for (let i = sections.length - 1; i >= 0; i--) {
      const section = sections[i];
      const rect = section.getBoundingClientRect();
      const sectionTop = scrollY + rect.top;

      // Section becomes active when its top is within the viewport
      if (scrollY >= sectionTop - windowHeight * 0.5) {
        activeSection = i;
        break;
      }
    }

    return { activeSection, scrollProgress };
  }, []);

  // Smooth scroll to specific section
  const scrollToSection = useCallback((index: number) => {
    const sections = sectionsRef.current.filter(Boolean) as HTMLElement[];
    const targetSection = sections[index];

    if (targetSection) {
      const rect = targetSection.getBoundingClientRect();
      const scrollY = window.scrollY;
      const targetY = scrollY + rect.top - window.innerHeight * 0.1;

      window.scrollTo({
        top: targetY,
        behavior: 'smooth',
      });
    }
  }, []);

  // Apply section styles based on scroll position
  const applySectionStyles = useCallback(() => {
    const sections = sectionsRef.current.filter(Boolean) as HTMLElement[];
    const { activeSection, scrollProgress } = calculateActiveSection();

    sections.forEach((section, index) => {
      if (!section) return;

      const rect = section.getBoundingClientRect();
      const sectionCenter = rect.top + rect.height / 2;
      const viewportCenter = window.innerHeight / 2;
      const distanceFromCenter = Math.abs(sectionCenter - viewportCenter);
      const maxDistance = window.innerHeight;

      // Calculate section-specific progress
      const sectionProgress = Math.max(0, 1 - distanceFromCenter / maxDistance);

      // Remove all transition classes first
      section.classList.remove(
        'section-active',
        'section-covering',
        'section-revealing'
      );

      // Apply appropriate classes based on position
      if (index === activeSection) {
        section.classList.add('section-active');

        // If this section is in the upper part of viewport, it's covering
        if (rect.top <= 0 && rect.bottom > window.innerHeight * 0.7) {
          section.classList.add('section-covering');
        }
      } else if (index < activeSection) {
        // Sections above are being covered
        section.style.transform = `translateY(-${Math.min(100, (activeSection - index) * 20)}px)`;
        section.style.opacity = `${Math.max(0.3, 1 - (activeSection - index) * 0.2)}`;
      } else if (index > activeSection) {
        // Sections below are waiting to be revealed
        section.classList.add('section-revealing');
        section.style.setProperty(
          '--section-progress',
          sectionProgress.toString()
        );
      }

      // Add parallax effect to background elements
      const parallaxElements = section.querySelectorAll('.scroll-bg-parallax');
      parallaxElements.forEach(element => {
        const htmlElement = element as HTMLElement;
        const parallaxOffset = (window.scrollY - rect.top) * 0.5;
        htmlElement.style.setProperty('--scroll-offset', `${parallaxOffset}px`);
      });
    });

    return { activeSection, scrollProgress };
  }, [calculateActiveSection]);

  // Handle scroll events with throttling
  const handleScroll = useCallback(() => {
    setState(prev => ({ ...prev, isScrolling: true }));

    // Clear existing timeout
    if (scrollTimeoutRef.current) {
      clearTimeout(scrollTimeoutRef.current);
    }

    // Use requestAnimationFrame for smooth updates
    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current);
    }

    rafRef.current = requestAnimationFrame(() => {
      const result = applySectionStyles();
      setState(prev => ({
        ...prev,
        activeSection: result.activeSection,
        scrollProgress: result.scrollProgress,
      }));
    });

    // Set scroll end timeout
    scrollTimeoutRef.current = setTimeout(() => {
      setState(prev => ({ ...prev, isScrolling: false }));
    }, 150);
  }, [applySectionStyles]);

  // Setup scroll listener
  useEffect(() => {
    const handleScrollThrottled = handleScroll;

    window.addEventListener('scroll', handleScrollThrottled, { passive: true });
    window.addEventListener('resize', handleScrollThrottled, { passive: true });

    // Initial calculation
    handleScrollThrottled();

    return () => {
      window.removeEventListener('scroll', handleScrollThrottled);
      window.removeEventListener('resize', handleScrollThrottled);

      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, [handleScroll]);

  return {
    activeSection: state.activeSection,
    scrollProgress: state.scrollProgress,
    registerSection,
    isScrolling: state.isScrolling,
    scrollToSection,
  };
};
