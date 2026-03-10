'use server';

/**
 * @fileOverview Aksi ICE Servers telah dinonaktifkan kawan.
 */
export async function getIceServers() {
  return [
    { urls: 'stun:stun.l.google.com:19302' }
  ];
}
