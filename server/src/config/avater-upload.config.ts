import { diskStorage } from 'multer';
import { extname, join } from 'path';
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'fs';
import { createHash } from 'crypto';
import { BadRequestException } from '@nestjs/common';
import { Request } from 'express';

export const avatarUploadConfig = {
  storage: diskStorage({
    destination: (req, file, cb) => {
      const uploadPath = join(process.cwd(), 'tmp');

      // Ensure directory exists
      if (!existsSync(uploadPath)) {
        mkdirSync(uploadPath, { recursive: true });
      }

      cb(null, uploadPath);
    },

    filename: (req: any, file, cb) => {
      try {
        // New file, generate new filename
        const name = file.originalname.split('.')[0];
        const fileExt = extname(file.originalname);
        const timestamp = Date.now();
        const fileName = `avatar_${name}_${timestamp}${fileExt}`;

        cb(null, fileName);
      } catch (error) {
        cb(new BadRequestException('File processing failed'), '');
      }
    },
  }),

  limits: {
    fileSize: 2 * 1024 * 1024, // 5MB
    files: 1,
  },

  fileFilter: (req: Request, file, cb) => {
    const allowedMimes = [
      'image/jpeg',
      'image/jpg',
      'image/png',
      'image/gif',
      'image/webp',
    ];

    if (allowedMimes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(
        new BadRequestException(
          'Only image files (JPEG, PNG, GIF, WebP) are allowed',
        ),
        false,
      );
    }
  },
};
