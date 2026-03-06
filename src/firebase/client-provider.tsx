
'use client';

import React, { ReactNode, useMemo } from 'react';
import { initializeFirebase, FirebaseProvider } from '.';

interface FirebaseClientProviderProps {
  children: ReactNode;
}

export const FirebaseClientProvider = ({ children }: FirebaseClientProviderProps) => {
  const { firebaseApp, auth, firestore } = useMemo(() => initializeFirebase(), []);

  return (
    <FirebaseProvider firebaseApp={firebaseApp} auth={auth} firestore={firestore}>
      {children}
    </FirebaseProvider>
  );
};
