import jwt, { SignOptions } from 'jsonwebtoken';

export function generateToken(userId: number): string {
  const options: SignOptions = {
    expiresIn: (process.env.JWT_EXPIRES_IN || '7d') as any,
  };
  return jwt.sign(
    { userId },
    process.env.JWT_SECRET || 'secret',
    options
  );
}
