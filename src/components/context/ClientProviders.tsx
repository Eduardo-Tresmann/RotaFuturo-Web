'use client';

import React from 'react';
import { AuthProvider } from '@/components/context/AuthContext';

interface ClientProvidersProps {
  children: React.ReactNode;
}

export default function ClientProviders({ children }: ClientProvidersProps) {
  return <AuthProvider>{children}</AuthProvider>;
}
