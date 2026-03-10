'use client';

import { redirect } from 'next/navigation';
import { useEffect } from 'react';

/**
 * @fileOverview Panggung AI telah dinonaktifkan kawan.
 */
export default function AiPage() {
  useEffect(() => {
    redirect('/');
  }, []);

  return null;
}
