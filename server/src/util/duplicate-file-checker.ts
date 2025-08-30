import { createHash } from 'crypto';
import { existsSync, readFileSync, renameSync, unlinkSync } from 'fs';
import path, { extname } from 'path';

const generateHash = (filePath: string) => {
  const buffer = readFileSync(filePath);
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
