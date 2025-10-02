import { useEffect } from 'react';

/**
 * Hook to disable text selection across the application
 * @returns {void}
 */
export function useDisableTextSelection() {
  useEffect(() => {
    // Prevent text selection
    const preventSelection = (e: Event) => {
      e.preventDefault();
      return false;
    };

    // Remove any existing selection
    const clearSelection = () => {
      if (window.getSelection) {
        window.getSelection()?.removeAllRanges();
      }
    };

    // Prevent mousedown default behavior that might lead to selection
    const preventMouseDown = (e: MouseEvent) => {
      if (e.target instanceof HTMLElement) {
        const isInput = e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA';
        if (!isInput) {
          e.preventDefault();
          clearSelection();
        }
      }
    };

    // Apply disable-selection class to root element
    const rootElement = document.getElementById('root') || document.documentElement;
    rootElement.classList.add('disable-selection');

    // Add event listeners
    document.addEventListener('selectstart', preventSelection);
    document.addEventListener('mousedown', preventMouseDown);
    document.addEventListener('click', clearSelection);

    // Clean up on unmount
    return () => {
      rootElement.classList.remove('disable-selection');
      document.removeEventListener('selectstart', preventSelection);
      document.removeEventListener('mousedown', preventMouseDown);
      document.removeEventListener('click', clearSelection);
    };
  }, []);
}
