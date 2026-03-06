'use client';

import React, { forwardRef, useImperativeHandle } from 'react';
import type { ScreenplayBlock } from '@/lib/types';

export type ScreenplayEditorHandle = {
  getBlocks: () => ScreenplayBlock[];
  setBlockType: (type: ScreenplayBlock['type']) => void;
};

interface ScreenplayEditorProps {
  initialContent: string;
  isReadOnly: boolean;
  onBlockFocus: (type: ScreenplayBlock['type']) => void;
  onChange: (content: string) => void;
}

export const ScreenplayEditor = forwardRef<ScreenplayEditorHandle, ScreenplayEditorProps>(
  ({ initialContent, isReadOnly, onBlockFocus, onChange }, ref) => {
    
    useImperativeHandle(ref, () => ({
      getBlocks: () => {
        try {
          return JSON.parse(initialContent) as ScreenplayBlock[];
        } catch {
          return [];
        }
      },
      setBlockType: (type) => {
        console.log(`Setting block type to: ${type}`);
        // Placeholder for block type logic
      },
    }));

    return (
      <div className="flex flex-col items-center justify-center h-full bg-muted/50 rounded-2xl p-8 text-center">
        <h3 className="font-bold text-lg">Editor Naskah Film</h3>
        <p className="text-sm text-muted-foreground mt-2">
          Editor khusus untuk format naskah film sedang dalam pengembangan.
        </p>
        <div className="mt-4 p-4 bg-background rounded-lg text-left text-xs w-full max-w-md">
            <pre className="whitespace-pre-wrap break-words">{initialContent}</pre>
        </div>
      </div>
    );
  }
);

ScreenplayEditor.displayName = 'ScreenplayEditor';
