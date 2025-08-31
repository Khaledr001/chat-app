import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { readFileSync } from 'fs';
import { join } from 'path';
import { createHash } from 'crypto';

@Injectable()
export class AvatarHashInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();

    // If file was uploaded, add hash to file buffer for processing
    if (request.file) {
      const filePath = join(
        process.cwd(),
        'public',
        'images',
        'avatars',
        request.file.filename,
      );

      try {
        const fileBuffer = readFileSync(filePath);
        request.file.buffer = fileBuffer;
      } catch (error) {
        console.error('Error reading uploaded file:', error);
      }
    }

    return next.handle();
  }
}
