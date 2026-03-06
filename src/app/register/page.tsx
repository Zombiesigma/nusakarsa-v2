
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { getAuth, createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { useToast } from '@/hooks/use-toast';

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const auth = getAuth();
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(userCredential.user, { displayName: name });
      router.push('/');
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Registrasi Gagal",
        description: error.message,
      });
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-bg-alt p-4">
        <div className="absolute top-4 left-4">
            <Button variant="ghost" asChild>
                <Link href="/">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Kembali ke Beranda
                </Link>
            </Button>
        </div>
        <Card className="w-full max-w-sm border-none shadow-2xl">
            <CardHeader className="text-center">
            <CardTitle className="text-2xl font-headline">Buat Akun Baru</CardTitle>
            <CardDescription>Daftar dan mulai petualangan literasimu</CardDescription>
            </CardHeader>
            <CardContent>
            <form onSubmit={handleRegister}>
                <div className="grid gap-4">
                <div className="grid gap-2">
                    <Label htmlFor="first-name">Nama Lengkap</Label>
                    <Input 
                        id="first-name" 
                        placeholder="John Doe" 
                        required 
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="rounded-lg"
                        disabled={loading}
                    />
                </div>
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
                    <Label htmlFor="password">Password</Label>
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
                    {loading ? 'Memproses...' : 'Buat Akun'}
                </Button>
                </div>
                <div className="mt-4 text-center text-sm">
                Sudah punya akun?{' '}
                <Link href="/login" className="underline font-semibold text-primary">
                    Masuk
                </Link>
                </div>
            </form>
            </CardContent>
        </Card>
    </div>
  );
}
