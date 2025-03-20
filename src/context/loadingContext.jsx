
import React, { createContext, useState, useContext } from 'react';
import { Loading } from '../components/ui/loader';

// Create context with a default value
export const LoadingContext = createContext({
  isLoading: false,
  setIsLoading: () => {}
});

// Custom hook to use the loading context
export const useLoading = () => useContext(LoadingContext);

export const LoadingProvider = ({ children }) => {
  const [isLoading, setIsLoading] = useState(false);
  
  return (
    <LoadingContext.Provider value={{ isLoading, setIsLoading }}>
      {isLoading && <Loading />}
      {children}
    </LoadingContext.Provider>
  );
};