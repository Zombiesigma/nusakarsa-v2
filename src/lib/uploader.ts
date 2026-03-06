export const uploadFile = async (file: File, folder: string = 'uploads') => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('folder', folder);

  try {
    const response = await fetch('/api/upload', {
      method: 'POST',
      body: formData,
    });

    const result = await response.json();

    if (!response.ok || !result.success) {
      throw new Error(result.error || 'Gagal mengunggah file.');
    }
    return result.url as string;
  } catch (error: any) {
    console.error('[Uploader Error]', error);
    throw error;
  }
};
