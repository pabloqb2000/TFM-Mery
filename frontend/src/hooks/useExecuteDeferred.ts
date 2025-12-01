import { useCallback, useRef, useEffect } from 'react';

/**
 * Hook that provides a function to execute a callback after a delay.
 * If called multiple times before the delay expires, it cancels the previous
 * execution and resets the timer.
 * 
 * @param callback - The function to execute after the delay
 * @param delay - The delay in milliseconds (default: 0)
 * @returns A function that schedules the callback execution
 */
export function useExecuteDeferred<T extends (...args: any[]) => any>(
  callback: T,
  delay: number = 0,
  callOnFirstTime: boolean = true,
): (...args: Parameters<T>) => void {
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const executeDeferred = useCallback(
    (...args: Parameters<T>) => {
      const isFirstCall = !timeoutRef.current && callOnFirstTime;
      // Clear any existing timeout
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      if (isFirstCall) {
        callback(...args);
      }

      // Set new timeout
      timeoutRef.current = setTimeout(() => {
        if(!isFirstCall)
            callback(...args);
        timeoutRef.current = null;
      }, delay);
    },
    [callback, delay]
  );

  return executeDeferred;
}

