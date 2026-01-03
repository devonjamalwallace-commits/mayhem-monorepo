import { createContext, useContext, useMemo, ReactNode } from 'react';
import { StrapiClient, createStrapiClient } from '../client';
import type { StrapiConfig } from '../types';

interface StrapiContextValue {
  client: StrapiClient;
}

const StrapiContext = createContext<StrapiContextValue | null>(null);

interface StrapiProviderProps {
  config: StrapiConfig;
  children: ReactNode;
}

export function StrapiProvider({ config, children }: StrapiProviderProps) {
  const client = useMemo(() => createStrapiClient(config), [config.baseURL, config.siteUID, config.token]);

  return <StrapiContext.Provider value={{ client }}>{children}</StrapiContext.Provider>;
}

export function useStrapiClient(): StrapiClient {
  const context = useContext(StrapiContext);

  if (!context) {
    throw new Error('useStrapiClient must be used within a StrapiProvider');
  }

  return context.client;
}
