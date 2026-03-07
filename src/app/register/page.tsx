'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Loader2, ImagePlus } from 'lucide-react';
import { getAuth, createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { useToast } from '@/hooks/use-toast';

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [profilePic, setProfilePic] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState('Memproses...');
  const { toast } = useToast();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        toast({
          variant: "destructive",
          title: "Ukuran File Terlalu Besar",
          description: "Ukuran foto profil tidak boleh melebihi 5MB.",
        });
        return;
      }
      setProfilePic(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name) {
        toast({ variant: "destructive", title: "Registrasi Gagal", description: "Nama lengkap harus diisi." });
        return;
    }
    setLoading(true);

    let photoURL = '';

    if (profilePic) {
      setLoadingMessage('Mengunggah foto...');
      const formData = new FormData();
      formData.append('file', profilePic);
      formData.append('folder', `profile/${name.replace(/\s+/g, '_').toLowerCase()}`);

      try {
        const response = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        });

        const result = await response.json();

        if (!response.ok || !result.success) {
          toast({
            variant: "destructive",
            title: "Upload Foto Gagal",
            description: result.error || 'Terjadi kesalahan saat mengunggah foto profil.',
          });
          setLoading(false);
          return;
        }
        photoURL = result.url;
      } catch (error: any) {
        toast({
          variant: "destructive",
          title: "Upload Foto Gagal",
          description: error.message || 'Koneksi ke server upload gagal.',
        });
        setLoading(false);
        return;
      }
    }
    
    setLoadingMessage('Membuat akun...');
    const auth = getAuth();
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      
      await updateProfile(userCredential.user, { 
        displayName: name,
        ...(photoURL && { photoURL: photoURL })
      });
      
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
            <CardTitle className="text-2xl font-headline">Buat Akun Baru</CardTitle>
            <CardDescription>Daftar dan mulai petualangan literasimu</CardDescription>
            </CardHeader>
            <CardContent>
            <form onSubmit={handleRegister}>
                <div className="grid gap-4">
                
                <div className="flex flex-col items-center gap-2">
                    <Label htmlFor="profile-pic-input" className="cursor-pointer">
                        <div className="w-24 h-24 rounded-full bg-bg-alt border-2 border-dashed border-border flex items-center justify-center text-muted-foreground hover:border-primary hover:text-primary transition-colors relative overflow-hidden">
                            {preview ? (
                                <Image src={preview} alt="Pratinjau foto profil" fill className="object-cover" />
                            ) : (
                                <ImagePlus className="w-8 h-8" />
                            )}
                        </div>
                    </Label>
                    <Input id="profile-pic-input" type="file" className="hidden" accept="image/png, image/jpeg, image/gif" onChange={handleFileChange} disabled={loading} />
                    <p className="text-sm text-muted-foreground -mt-1">Pilih foto profil</p>
                </div>
                
                <div className="grid gap-2">
                    <Label htmlFor="full-name">Nama Lengkap</Label>
                    <Input 
                        id="full-name" 
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
                    {loading ? loadingMessage : 'Buat Akun'}
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
