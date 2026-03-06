import { Timestamp } from "firebase/firestore";

export type User = {
  uid: string;
  email: string;
  displayName: string;
  photoURL: string;
  username: string;
  bio: string;
  role: 'admin' | 'penulis' | 'pembaca';
  followers: string[];
  following: string[];
  phoneNumber?: string;
  domicile?: string;
  createdAt?: Timestamp;
};

export type ScreenplayBlock = {
  id: string;
  type: 'slugline' | 'action' | 'character' | 'parenthetical' | 'dialogue' | 'transition';
  text: string;
};

export type Chapter = {
  id: string;
  title: string;
  content: string; // For novels/poems, it's markdown. For screenplays, it's a stringified JSON of ScreenplayBlock[]
  order: number;
  createdAt: Timestamp;
};

export type Book = {
  id: string;
  title: string;
  authorId: string;
  authorName: string;
  authorPhotoUrl: string;
  type: 'book' | 'screenplay' | 'poem';
  genre: string;
  synopsis: string;
  coverUrl: string;
  status: 'draft' | 'pending_review' | 'published';
  visibility: 'public' | 'followers_only';
  isCompleted: boolean;
  viewCount: number;
  favoriteCount: number;
  chapterCount: number;
  createdAt: Timestamp;
  updatedAt: Timestamp;
  collaboratorUids?: string[];
  collaborators?: {
    uid: string;
    displayName: string;
    photoURL: string;
    username: string;
  }[];
  fileUrl?: string;
  shotListUrl?: string;
};

export type Reel = {
  id: string;
  authorId: string;
  videoUrl: string;
  caption: string;
  bookId?: string;
  likes: number;
  commentCount: number;
  createdAt: Timestamp;
}

export type Story = {
  id: string;
  authorId: string;
  authorName: string;
  authorAvatarUrl: string;
  content?: string;
  mediaUrl?: string;
  mediaType?: 'image' | 'video';
  createdAt: Timestamp;
}

export type AuthorRequest = {
  id: string;
  userId: string;
  name: string;
  status: 'pending' | 'approved' | 'rejected';
  phoneNumber: string;
  domicile: string;
  portfolio?: string;
  createdAt: Timestamp;
}

export type CollaborationInvitation = {
    id: string;
    bookId: string;
    bookTitle: string;
    ownerId: string;
    ownerName: string;
    collaboratorId: string;
    collaboratorEmail: string;
    status: 'pending' | 'accepted' | 'rejected';
    createdAt: Timestamp;
}

export type Notification = {
    id: string;
    type: 'follow' | 'comment' | 'collaboration' | 'system' | 'broadcast';
    text: string;
    link: string;
    actor: {
        uid: string;
        displayName: string;
        photoURL: string;
    };
    read: boolean;
    createdAt: Timestamp;
}
