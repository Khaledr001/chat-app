import { registerAs } from '@nestjs/config';

export const JWT_CONFIG = registerAs('JWT_CONFIG', () => {
  return {
    secret: process.env.JWT_SECRET || 'ckznvoweahnsdsfopieoindldoieaf',
    expiresIn: process.env.JWT_EXPIRES_IN || '12h',
  };
});
