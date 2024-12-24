import { useRef } from "react";

const DEFAULT_BOUNCE_RATE = 1000;

type UseDebounceReturn = {
  debounce: (callback: () => void) => void;
};

export const useDebounce = (
  delay: number = DEFAULT_BOUNCE_RATE
): UseDebounceReturn => {
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const debounce = (callback: () => void) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    timeoutRef.current = setTimeout(() => {
      callback();
    }, delay);
  };

  return { debounce };
};
