import { createHash } from 'crypto';
import { create } from 'domain';
import {
  existsSync,
  mkdirSync,
  readFileSync,
  renameSync,
  unlinkSync,
  writeFileSync,
} from 'fs';
import path, { extname, join } from 'path';

const generateHash = (filePath: string) => {
  const buffer = readFileSync(filePath);
  return createHash('md5').update(buffer).digest('hex');
};

const genHashWithBuffer = (buffer: any) => {
  return createHash('md5').update(buffer).digest('hex');
};

export const duplicateImageChecker = (file: any): any => {
  try {
    // Logic to check for duplicate images
    const filePath = file.path;

    const hash = generateHash(filePath);

    // Build new filename
    const ext = extname(file.originalname);
    const finalFileName = `avatar-${hash}${ext}`;
    const publicPath = path.join(
      process.cwd(),
      'public',
      'images',
      finalFileName,
    );

    // 3. Check if already exists
    if (existsSync(publicPath)) {
      unlinkSync(filePath);
    }

    // 4. Move temp file to public/images
    else {
      renameSync(filePath, publicPath);
    }

    const relativePath = `images/${finalFileName}`;

    file.path = relativePath;
    file.filename = finalFileName;

    return file;
  } catch (error) {
    console.error('Error checking for duplicate images:', error);
  }
};

export const duplicateAttachmentChecker = (file: any): any => {
  try {
    // Logic to check for duplicate attachments

    const uploadPath = join(process.cwd(), 'public/attachments');

    // Ensure directory exists
    if (!existsSync(uploadPath)) {
      mkdirSync(uploadPath, { recursive: true });
    }

    const hash = genHashWithBuffer(file.buffer);

    // Build new filename
    const ext = extname(file.originalname);
    const finalFileName = `attachment-${hash}${ext}`;
    const publicPath = path.join(
      process.cwd(),
      'public',
      'attachments',
      finalFileName,
    );

    // 3. If file already exists → do nothing
    if (!existsSync(publicPath)) {
      // 4. Save file to attachments folder
      writeFileSync(publicPath, file.buffer);
    }

    const relativePath = `attachments/${finalFileName}`;

    file.path = relativePath;
    file.filename = finalFileName;

    return file;
  } catch (error) {
    console.error('Error checking for duplicate images:', error);
  }
};
