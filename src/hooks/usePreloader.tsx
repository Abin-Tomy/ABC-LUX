import React, { createContext, useContext, useState, useCallback } from "react";

interface PreloaderContextType {
  isLoaded: boolean;
  setLoaded: () => void;
}

const PreloaderContext = createContext<PreloaderContextType | undefined>(undefined);

export function PreloaderProvider({ children }: { children: React.ReactNode }) {
  const [isLoaded, setIsLoaded] = useState(false);

  const setLoaded = useCallback(() => {
    setIsLoaded(true);
  }, []);

  return (
    <PreloaderContext.Provider value={{ isLoaded, setLoaded }}>
      {children}
    </PreloaderContext.Provider>
  );
}

export function usePreloader() {
  const context = useContext(PreloaderContext);
  if (context === undefined) {
    throw new Error("usePreloader must be used within a PreloaderProvider");
  }
  return context;
}
