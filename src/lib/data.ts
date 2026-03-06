

import { PlaceHolderImages } from './placeholder-images';

export type Book = {
  id: string; // Changed to string for Firestore
  title: string;
  author: string;
  category: 'Novel' | 'Non-Fiksi' | 'Sastra' | 'Custom';
  rating: number;
  year: number;
  pages: number;
  readers: string;
  trending: boolean;
  progress: number;
  coverImage: {
    src: string;
    width: number;
    height: number;
    hint: string;
  },
  content?: string;
  isUserCreated?: boolean;
  ownerId?: string; // To associate book with a user
};

const findImage = (id: string) => {
  const img = PlaceHolderImages.find(p => p.id === id);
  if (!img) return { src: 'https://picsum.photos/seed/error/600/800', width: 600, height: 800, hint: 'placeholder' };
  const url = new URL(img.imageUrl);
  const pathParts = url.pathname.split('/');
  const width = parseInt(pathParts[pathParts.length - 2]);
  const height = parseInt(pathParts[pathParts.length - 1]);
  return { src: img.imageUrl, width, height, hint: img.imageHint };
};

// This will now serve as initial data for a new user, or can be removed if we fetch everything from Firestore.
export const initialBooks: Omit<Book, 'id' | 'ownerId'>[] = [
      { title: "Laskar Pelangi", author: "Andrea Hirata", category: "Novel", rating: 4.8, year: 2005, pages: 529, readers: "125K", trending: true, progress: 44, coverImage: findImage('laskar-pelangi') },
      { title: "Filosofi Teras", author: "Henry Manampiring", category: "Non-Fiksi", rating: 4.7, year: 2018, pages: 340, readers: "89K", trending: true, progress: 78, coverImage: findImage('filosofi-teras') },
      { title: "Bumi Manusia", author: "Pramoedya Ananta Toer", category: "Sastra", rating: 4.9, year: 1980, pages: 535, readers: "200K", trending: true, progress: 12, coverImage: findImage('bumi-manusia') },
      { title: "Pulang", author: "Tere Liye", category: "Novel", rating: 4.6, year: 2015, pages: 400, readers: "95K", trending: false, progress: 0, coverImage: findImage('pulang') },
      { title: "Sapiens", author: "Yuval Noah Harari", category: "Non-Fiksi", rating: 4.8, year: 2011, pages: 443, readers: "180K", trending: true, progress: 0, coverImage: findImage('sapiens') },
      { title: "Cantik Itu Luka", author: "Eka Kurniawan", category: "Sastra", rating: 4.7, year: 2002, pages: 520, readers: "75K", trending: false, progress: 0, coverImage: findImage('cantik-itu-luka') },
      { title: "Negeri 5 Menara", author: "Ahmad Fuadi", category: "Novel", rating: 4.5, year: 2009, pages: 424, readers: "110K", trending: false, progress: 0, coverImage: findImage('negeri-5-menara') },
      { title: "Atomic Habits", author: "James Clear", category: "Non-Fiksi", rating: 4.9, year: 2018, pages: 320, readers: "250K", trending: true, progress: 95, coverImage: findImage('atomic-habits') },
      { title: "Ronggeng Dukuh Paruk", author: "Ahmad Tohari", category: "Sastra", rating: 4.6, year: 1982, pages: 408, readers: "60K", trending: false, progress: 0, coverImage: findImage('ronggeng-dukuh-paruk') },
      { title: "Perahu Kertas", author: "Dee Lestari", category: "Novel", rating: 4.4, year: 2009, pages: 368, readers: "80K", trending: false, progress: 0, coverImage: findImage('perahu-kertas') },
      { title: "The Psychology of Money", author: "Morgan Housel", category: "Non-Fiksi", rating: 4.7, year: 2020, pages: 256, readers: "150K", trending: true, progress: 0, coverImage: findImage('psychology-of-money') },
      { title: "Saman", author: "Ayu Utami", category: "Sastra", rating: 4.5, year: 1998, pages: 276, readers: "70K", trending: false, progress: 0, coverImage: findImage('saman') }
];

export const categories = ["Semua", "Novel", "Non-Fiksi", "Sastra", "Custom"] as const;

export type Category = typeof categories[number];
