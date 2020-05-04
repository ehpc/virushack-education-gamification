import { useState, useEffect } from 'react';
import debounce from 'lodash/debounce';

function getSize() {
  return {
    innerHeight: window.innerHeight,
    innerWidth: window.innerWidth,
    outerHeight: window.outerHeight,
    outerWidth: window.outerWidth,
  };
}

function useResize(callback) {
  const [windowSize, setWindowSize] = useState(getSize());

  const handleResize = debounce(() => {
    const size = getSize();
    setWindowSize(size);
    if (typeof callback === 'function') {
      callback(size);
    }
  }, 500);

  useEffect(() => {
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [handleResize]);

  return windowSize;
}

export default useResize;
