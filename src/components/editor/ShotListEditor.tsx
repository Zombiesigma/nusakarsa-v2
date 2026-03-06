'use client';

import React from 'react';

export function ShotListEditor({ bookId }: { bookId: string }) {
  return (
    <div className="flex flex-col items-center justify-center h-full bg-muted/50 rounded-2xl p-8 text-center">
      <h3 className="font-bold text-lg">Editor Shot List</h3>
      <p className="text-sm text-muted-foreground mt-2">
        Buat dan kelola daftar shot untuk naskah film Anda. Fitur ini sedang dalam pengembangan.
      </p>
    </div>
  );
}
