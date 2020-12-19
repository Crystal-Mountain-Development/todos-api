import { authenticator, totp } from "otplib";

const EXPIRATION = 5 * 60;

totp.options = { ...totp.options, step: EXPIRATION };

export const secret = authenticator.generateSecret();

export function generateToken() {
  return totp.generate(secret);
}

export function validateToken(token: string) {
  return totp.verify({ token, secret });
}
