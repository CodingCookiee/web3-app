import { useEffect, useState } from "react";

/**
 * Creates periodic refresh triggers for data loading
 */
export const useRefresh = () => {
  // State values that change to trigger rerenders
  const [fastRefresh, setFastRefresh] = useState(0);
  const [slowRefresh, setSlowRefresh] = useState(0);

  useEffect(() => {
    // Update fast refresh every 10 seconds
    const fastRefreshInterval = setInterval(() => {
      setFastRefresh((prev) => prev + 1);
    }, 10000);

    // Update slow refresh every 60 seconds
    const slowRefreshInterval = setInterval(() => {
      setSlowRefresh((prev) => prev + 1);
    }, 60000);

    return () => {
      clearInterval(fastRefreshInterval);
      clearInterval(slowRefreshInterval);
    };
  }, []);

  return { fastRefresh, slowRefresh };
};
