
'use server';

import { PDFDocument as PDFLib, StandardFonts, rgb, degrees } from 'pdf-lib';
import type { PDFImage, PDFPage } from 'pdf-lib';
import { promises as fs } from 'fs';
import path from 'path';
import { initializeFirebase } from '@/firebase';
import { collection, query, orderBy, getDocs, doc, getDoc } from 'firebase/firestore';
import type { Book, Chapter, User } from '@/lib/types';

const PAGE_WIDTH = 595.28; 
const PAGE_HEIGHT = 841.89; 
const MARGIN = 72; 

// Define brand colors
const nusakarsaPrimary = rgb(0.45, 0.56, 0.22); // hsl(66, 50%, 45%) - Accent Green
const nusakarsaBackground = rgb(0.97, 0.98, 0.96); // A very light, elegant green
const textDark = rgb(0.1, 0.1, 0.1);
const textMuted = rgb(0.4, 0.4, 0.4);

/**
 * Menambahkan watermark ke halaman PDF.
 */
function addWatermarkToPage(page: PDFPage, watermarkImage: PDFImage) {
    const { width, height } = page.getSize();
    // Skala watermark agar memenuhi sebagian besar halaman
    const watermarkDims = watermarkImage.scale(0.8); 

    page.drawImage(watermarkImage, {
        x: width / 2 - watermarkDims.width / 2,
        y: height / 2 - watermarkDims.height / 2,
        width: watermarkDims.width,
        height: watermarkDims.height,
        opacity: 0.05, // Opasitas sangat rendah agar tidak mengganggu
        rotate: degrees(-45),
    });
}

/**
 * Membersihkan string untuk digunakan sebagai nama folder kawan.
 */
function sanitizePath(str: string): string {
  return str.replace(/[^a-z0-9]/gi, '_').toLowerCase().trim();
}

export async function generateBookPdf(bookId: string): Promise<string> {
  const { firestore } = initializeFirebase();
  if (!firestore) throw new Error('Firestore not initialized');

  const bookRef = doc(firestore, 'books', bookId);
  const bookSnap = await getDoc(bookRef);
  if (!bookSnap.exists()) throw new Error('Book not found');
  const book = { id: bookSnap.id, ...bookSnap.data() } as Book;

  // Ambil data penulis industri kawan
  const authorUserRef = doc(firestore, 'users', book.authorId);
  const authorUserSnap = await getDoc(authorUserRef);
  const authorProfile = authorUserSnap.exists() ? authorUserSnap.data() as User : null;

  const chaptersQuery = query(collection(firestore, 'books', bookId, 'chapters'), orderBy('order', 'asc'));
  const chaptersSnap = await getDocs(chaptersQuery);
  const chapters = chaptersSnap.docs.map(d => ({ id: d.id, ...d.data() } as Chapter));

  const pdfDoc = await PDFLib.create();
  
  // Muat dan sematkan gambar watermark
  const watermarkBytes = await fs.readFile(path.join(process.cwd(), 'public/logo/copyright.png'));
  const watermarkImage = await pdfDoc.embedPng(watermarkBytes);

  const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  const fontRegular = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const fontItalic = await pdfDoc.embedFont(StandardFonts.HelveticaOblique);
  const fontSerifBold = await pdfDoc.embedFont(StandardFonts.TimesRomanBold);
  const fontSerifRegular = await pdfDoc.embedFont(StandardFonts.TimesRoman);
  const fontSerifItalic = await pdfDoc.embedFont(StandardFonts.TimesRomanItalic);

  // --- COVER PAGE ---
  let page = pdfDoc.addPage([PAGE_WIDTH, PAGE_HEIGHT]);
  const { width, height } = page.getSize();
  
  // Background color
  page.drawRectangle({
    x: 0, y: 0, width, height,
    color: nusakarsaBackground,
  });

  // Add watermark
  addWatermarkToPage(page, watermarkImage);
  
  // Top decorative bar
  page.drawRectangle({
    x: 0, y: height - 20, width, height: 20,
    color: nusakarsaPrimary
  });

  // Main Title
  const titleFontSize = 40;
  const titleText = book.title;
  
  page.drawText(titleText, {
    x: MARGIN,
    y: height - 200,
    size: titleFontSize,
    font: fontBold,
    color: textDark,
    maxWidth: width - (MARGIN * 2),
    lineHeight: 48,
  });
  
  // Genre Badge
  page.drawText(book.genre.toUpperCase(), {
    x: MARGIN,
    y: height - 230,
    size: 10,
    font: fontBold,
    color: nusakarsaPrimary,
    characterSpacing: 2,
  });

  // Author Section
  page.drawText('Oleh:', {
    x: MARGIN,
    y: height - 300,
    size: 12,
    font: fontItalic,
    color: textMuted,
  });
  
  const authorName = book.authorName;
  const authorFontSize = 24;
  page.drawText(authorName, {
    x: MARGIN,
    y: height - 325,
    size: authorFontSize,
    font: fontSerifBold,
    color: textDark,
  });

  // Synopsis
  const synopsisYStart = height - 400;
  page.drawText("Sinopsis", {
      x: MARGIN,
      y: synopsisYStart,
      size: 12,
      font: fontBold,
      color: textDark
  });
  
  const synopsisLines = wrapText(book.synopsis, width - (MARGIN * 2), fontSerifRegular, 11);
  let currentY = synopsisYStart - 20;
  for (const line of synopsisLines) {
      if (currentY < 150) break; // Don't let synopsis overlap footer
      page.drawText(line, { x: MARGIN, y: currentY, size: 11, font: fontSerifItalic, color: textMuted, lineHeight: 15 });
      currentY -= 15;
  }
  

  // Footer section
  const footerY = 80;
  page.drawLine({
      start: { x: MARGIN, y: footerY + 20 },
      end: { x: width - MARGIN, y: footerY + 20 },
      thickness: 0.5,
      color: nusakarsaPrimary,
      opacity: 0.5
  });

  if (authorProfile) {
    const contactText = [authorProfile.email, authorProfile.domicile].filter(Boolean).join(' • ');
    page.drawText(contactText, {
        x: MARGIN,
        y: footerY,
        size: 9,
        font: fontRegular,
        color: textMuted,
    });
  }
  
  const footerText = `Diterbitkan melalui Nusakarsa © ${new Date().getFullYear()}`;
  page.drawText(footerText, {
    x: width - MARGIN - fontRegular.widthOfTextAtSize(footerText, 9),
    y: footerY,
    size: 9,
    font: fontRegular,
    color: textMuted,
  });

  let pageCount = 1;

  for (const chapter of chapters) {
    page = pdfDoc.addPage([PAGE_WIDTH, PAGE_HEIGHT]);
    pageCount++;
    addWatermarkToPage(page, watermarkImage);

    const isPoem = book.type === 'poem';

    page.drawText('NUSAKARSA DIGITAL', { x: MARGIN, y: height - 40, size: 7, font: fontBold, color: rgb(0.7, 0.7, 0.7) });
    page.drawText(book.title.toUpperCase(), { x: width - MARGIN - fontRegular.widthOfTextAtSize(book.title.toUpperCase(), 7), y: height - 40, size: 7, font: fontRegular, color: rgb(0.7, 0.7, 0.7) });

    const chapterTitleX = isPoem ? (width - fontSerifBold.widthOfTextAtSize(chapter.title.toUpperCase(), 16)) / 2 : MARGIN;
    page.drawText(isPoem ? chapter.title.toUpperCase() : chapter.title, {
      x: chapterTitleX,
      y: height - 90,
      size: isPoem ? 16 : 22,
      font: fontSerifBold,
      color: rgb(0.1, 0.1, 0.1),
    });

    let currentY = height - 130;
    const contentWidth = width - MARGIN - MARGIN;

    if (isPoem) {
      const paras = chapter.content.split('\n');
      for (const para of paras) {
        if (!para.trim()) {
            currentY -= 10;
            continue;
        }
        const size = 14;
        const font = fontSerifItalic;
        const wrappedLines = wrapText(para, contentWidth, font, size);
        for (const line of wrappedLines) {
          if (currentY < 70) {
            page = pdfDoc.addPage([PAGE_WIDTH, PAGE_HEIGHT]);
            pageCount++;
            addFooter(page, pageCount, fontRegular, width);
            addWatermarkToPage(page, watermarkImage);
            currentY = height - 60;
          }
          const lineX = (width - font.widthOfTextAtSize(line, size)) / 2;
          page.drawText(line, { x: lineX, y: currentY, size, font });
          currentY -= 18;
        }
      }
    } else {
      const paras = chapter.content.split('\n');
      for (const para of paras) {
        const wrappedLines = wrapText(para, contentWidth, fontSerifRegular, 12);
        for (const line of wrappedLines) {
          if (currentY < 70) {
            page = pdfDoc.addPage([PAGE_WIDTH, PAGE_HEIGHT]);
            pageCount++;
            addFooter(page, pageCount, fontRegular, width);
            addWatermarkToPage(page, watermarkImage);
            currentY = height - 60;
          }
          page.drawText(line, { x: MARGIN, y: currentY, size: 12, font: fontSerifRegular });
          currentY -= 16;
        }
        currentY -= 8;
      }
    }
    addFooter(page, pageCount, fontRegular, width);
  }

  const pdfBytes = await pdfDoc.save();
  const pdfBuffer = Buffer.from(pdfBytes);
  const safeFileName = `${sanitizePath(book.title)}.pdf`;
  
  const typeMap: Record<string, string> = {
    'book': 'books',
    'poem': 'puisi'
  };
  const typeFolder = typeMap[book.type] || 'books';
  const folderPath = `${typeFolder}/${sanitizePath(book.title)}`;

  return await uploadPdf(pdfBuffer, safeFileName, folderPath);
}

async function uploadPdf(buffer: Buffer, fileName: string, folderPath: string): Promise<string> {
  const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
  const GITHUB_REPO_OWNER = process.env.GITHUB_REPO_OWNER;
  const GITHUB_REPO_NAME = process.env.GITHUB_REPO_NAME;

  if (GITHUB_TOKEN && GITHUB_REPO_OWNER && GITHUB_REPO_NAME) {
    try {
      return await uploadPdfToGithub(buffer, fileName, folderPath, GITHUB_TOKEN, GITHUB_REPO_OWNER, GITHUB_REPO_NAME);
    } catch (e) {
      console.warn("[PDF Generator] GitHub upload failed, falling back...");
    }
  }

  try {
    return await uploadToPublicService(buffer, fileName);
  } catch (e) {
    console.error("[PDF Generator] All upload methods failed:", e);
    throw new Error("Gagal mengunggah file PDF.");
  }
}

async function uploadPdfToGithub(buffer: Buffer, fileName: string, folderPath: string, token: string, owner: string, repo: string): Promise<string> {
  const base64Content = buffer.toString('base64');
  const timestamp = Date.now();
  const filePath = `${folderPath}/${timestamp}-${fileName}`;

  const response = await fetch(`https://api.github.com/repos/${owner}/${repo}/contents/${filePath}`, {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
      'Accept': 'application/vnd.github.v3+json',
      'User-Agent': 'Nusakarsa-App',
    },
    body: JSON.stringify({
      message: `Automatic PDF Generation for ${fileName}`,
      content: base64Content,
      branch: 'main'
    }),
  });

  if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || 'GitHub Error');
  }

  return `https://raw.githubusercontent.com/${owner}/${repo}/main/${filePath}`;
}

async function uploadToPublicService(buffer: Buffer, fileName: string): Promise<string> {
  const POMF_MIRRORS = ['https://pomf.lain.la/upload.php', 'https://quax.moe/upload.php', 'https://pomf.cat/upload.php'];
  for (const mirror of POMF_MIRRORS) {
    try {
      const formData = new FormData();
      const blob = new Blob([buffer], { type: 'application/pdf' });
      formData.append('files[]', blob, fileName);
      const response = await fetch(mirror, { method: 'POST', body: formData, signal: AbortSignal.timeout(30000) });
      if (response.ok) {
        const data = await response.json();
        if (data.success && data.files && data.files[0]) return data.files[0].url;
      }
    } catch (err) { continue; }
  }
  throw new Error("Public storage mirrors failed.");
}

function addFooter(page: any, pageNum: number, font: any, width: number) {
    page.drawText(`${pageNum}.`, { x: width - 60, y: PAGE_HEIGHT - 40, size: 10, font: font, color: rgb(0.1, 0.1, 0.1) });
}

function wrapText(text: string, maxWidth: number, font: any, fontSize: number): string[] {
  if (!text) return [""];
  const paragraphs = text.split('\n');
  const allLines: string[] = [];
  for (const para of paragraphs) {
    if (!para.trim()) { allLines.push(""); continue; }
    const words = para.split(/\s+/);
    let currentLine = '';
    for (const word of words) {
        const testLine = currentLine ? `${currentLine} ${word}` : word;
        const testWidth = font.widthOfTextAtSize(testLine, fontSize);
        if (testWidth > maxWidth) {
            allLines.push(currentLine);
            currentLine = word;
        } else { currentLine = testLine; }
    }
    allLines.push(currentLine);
  }
  return allLines;
}
