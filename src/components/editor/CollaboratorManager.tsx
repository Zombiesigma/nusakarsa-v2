'use client';

import React from 'react';
import type { Book } from '@/lib/types';

export function CollaboratorManager({ book }: { book: Book | null }) {
  if (!book) return null;

  return (
    <div className="flex flex-col items-center justify-center h-full bg-muted/50 rounded-2xl p-8 text-center">
      <h3 className="font-bold text-lg">Manajemen Kolaborator</h3>
      <p className="text-sm text-muted-foreground mt-2">
        Undang dan kelola rekan penulis untuk karya Anda. Fitur ini sedang dalam pengembangan.
      </p>
    </div>
  );
}
