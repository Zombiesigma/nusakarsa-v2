'use client';

import { redirect } from 'next/navigation';
import { useEffect } from 'react';

/**
 * @fileOverview Fitur Reels telah dinonaktifkan.
 */
export default function ReelsPage() {
  useEffect(() => {
    redirect('/');
  }, []);

  return null;
}
