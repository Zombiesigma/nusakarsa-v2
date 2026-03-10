'use client';

import { redirect } from 'next/navigation';
import { useEffect } from 'react';

/**
 * @fileOverview Sistem Pesan & Video Call telah dinonaktifkan.
 */
export default function MessagesPage() {
  useEffect(() => {
    redirect('/');
  }, []);

  return null;
}
