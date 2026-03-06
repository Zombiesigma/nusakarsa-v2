
'use client';
import { HomeView } from '@/components/views/home-view';
import { useAppContext } from '@/context/app-context';
import { Loader2 } from 'lucide-react';

export default function Home() {
  const { loading } = useAppContext();

  if (loading) {
    return <div className="flex h-screen items-center justify-center">
      <Loader2 className="h-12 w-12 animate-spin text-primary" />
    </div>
  }

  return <HomeView />;
}
