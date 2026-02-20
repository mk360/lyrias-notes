import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Config } from '../types';
import { GetConfig, GetExModeEnabled, SetExModeEnabled } from '../services/storage';

interface AppContextType {
  config: Config | null;
  exModeEnabled: boolean;
  toggleExMode: () => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [config, setConfig] = useState<Config | null>(null);
  const [exModeEnabled, setExModeEnabled] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadConfig = async () => {
      try {
        const cfg = await GetConfig();
        setConfig(cfg);
        
        const exMode = await GetExModeEnabled();
        setExModeEnabled(exMode);
      } catch (error) {
        console.error('Failed to load config:', error);
      } finally {
        setLoading(false);
      }
    };

    loadConfig();
  }, []);

  const toggleExMode = async () => {
    const newValue = !exModeEnabled;
    try {
      await SetExModeEnabled(newValue);
      setExModeEnabled(newValue);
    } catch (error) {
      console.error('Failed to toggle EX mode:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900 text-white">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <AppContext.Provider value={{ config, exModeEnabled, toggleExMode }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within AppProvider');
  }
  return context;
};
