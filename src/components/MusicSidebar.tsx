'use client';

import React from 'react';

export function MusicSidebar({ bookId }: { bookId: string }) {
  return (
    <div className="flex flex-col items-center justify-center h-full bg-muted/50 rounded-2xl p-8 text-center">
      <h3 className="font-bold text-lg">Fitur Musik Latar</h3>
      <p className="text-sm text-muted-foreground mt-2">
        Pilih musik yang sesuai dengan suasana tulisan Anda. Fitur ini sedang dalam pengembangan.
      </p>
    </div>
  );
}
