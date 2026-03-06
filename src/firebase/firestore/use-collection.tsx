
'use client';
import { useState, useEffect, useMemo } from 'react';
import { collection, onSnapshot, Query, DocumentData, FirestoreError, QuerySnapshot, CollectionReference } from 'firebase/firestore';
import { useFirestore } from '../provider';

interface UseCollectionOptions {
  // You can add options like queries, limits, etc.
}

export function useCollection(ref: CollectionReference | Query | null, options?: UseCollectionOptions) {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<FirestoreError | null>(null);

  useEffect(() => {
    if (!ref) {
      setData([]);
      setLoading(false);
      return;
    };
    
    setLoading(true);

    const unsubscribe = onSnapshot(ref, 
      (snapshot: QuerySnapshot<DocumentData>) => {
        const data = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));
        setData(data);
        setLoading(false);
      }, 
      (err: FirestoreError) => {
        console.error(err);
        setError(err);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [ref]); // Re-run effect if collection reference changes

  return { data, loading, error };
}

