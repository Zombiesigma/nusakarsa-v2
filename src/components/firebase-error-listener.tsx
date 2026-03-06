
'use client';

import { useEffect } from 'react';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';

export function FirebaseErrorListener() {
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      const handleError = (error: FirestorePermissionError) => {
        // We throw the error so that the Next.js development overlay can pick it up.
        // This provides a much better developer experience for debugging security rules.
        throw error;
      };

      errorEmitter.on('permission-error', handleError);

      return () => {
        errorEmitter.off('permission-error', handleError);
      };
    }
  }, []);

  return null; // This component doesn't render anything.
}
