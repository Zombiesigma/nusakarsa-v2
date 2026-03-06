
'use client';

import { useState, useEffect } from 'react';
import { onSnapshot, DocumentReference, DocumentData, FirestoreError, DocumentSnapshot } from 'firebase/firestore';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';

interface UseDocOptions {
  // You can add options if needed
}

export function useDoc(ref: DocumentReference | null, options?: UseDocOptions) {
  const [data, setData] = useState<DocumentData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<FirestoreError | null>(null);

  useEffect(() => {
    if (!ref) {
      setData(null);
      setLoading(false);
      return;
    }

    setLoading(true);

    const unsubscribe = onSnapshot(ref, 
      (snapshot: DocumentSnapshot<DocumentData>) => {
        if (snapshot.exists()) {
          setData({ id: snapshot.id, ...snapshot.data() });
        } else {
          setData(null); // Document does not exist
        }
        setLoading(false);
        setError(null);
      }, 
      async (err: FirestoreError) => {
        const permissionError = new FirestorePermissionError({
            path: ref.path,
            operation: 'get',
        });
        errorEmitter.emit('permission-error', permissionError);
        setError(err);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [ref]); // Re-run effect if document reference changes

  return { data, loading, error };
}
