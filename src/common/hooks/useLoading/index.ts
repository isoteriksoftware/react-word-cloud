import { useRef, useState } from "react";

export const useLoading = (initialState = false) => {
  const loadingStateCache = useRef(initialState);
  const [isLoading, setIsLoading] = useState(loadingStateCache.current);

  const updateLoading = (loading: boolean) => {
    setIsLoading(loading);
    loadingStateCache.current = loading;
  };

  return { isLoading, loadingStateCache, setIsLoading: updateLoading };
};
