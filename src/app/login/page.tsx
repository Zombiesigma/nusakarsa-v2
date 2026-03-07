'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { useToast } from '@/hooks/use-toast';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const auth = getAuth();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.push('/');
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Login Gagal",
        description: error.message,
      });
      setLoading(false);
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center bg-bg-alt p-4">
       <div
        className="absolute inset-0 bg-contain bg-center opacity-5 dark:opacity-[0.02] pointer-events-none"
        style={{
          backgroundImage: "url('https://raw.githubusercontent.com/Zombiesigma/nusakarsa-assets/main/download.webp')",
          backgroundRepeat: 'no-repeat',
        }}
      />
      <div className="absolute top-4 left-4 z-10">
        <Button variant="ghost" asChild>
          <Link href="/">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Kembali ke Beranda
          </Link>
        </Button>
      </div>
      <Card className="w-full max-w-sm border-none shadow-2xl bg-card/90 backdrop-blur-xl">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-headline">Masuk ke Nusakarsa</CardTitle>
          <CardDescription>Masukkan detail akun Anda</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin}>
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="rounded-lg"
                  disabled={loading}
                />
              </div>
              <div className="grid gap-2">
                <div className="flex items-center">
                  <Label htmlFor="password">Password</Label>
                  <Link href="#" className="ml-auto inline-block text-sm underline">
                    Lupa password?
                  </Link>
                </div>
                <Input 
                  id="password" 
                  type="password" 
                  required 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="rounded-lg"
                  disabled={loading}
                />
              </div>
              <Button type="submit" className="w-full btn-primary rounded-xl mt-2" disabled={loading}>
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {loading ? 'Memproses...' : 'Masuk'}
              </Button>
            </div>
            <div className="mt-4 text-center text-sm">
              Belum punya akun?{' '}
              <Link href="/register" className="underline font-semibold text-primary">
                Daftar
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
