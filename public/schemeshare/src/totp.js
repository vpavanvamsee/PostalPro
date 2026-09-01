/**
 * RFC 6238 / RFC 4226 Time-based One-Time Password (TOTP)
 * Standard Google Authenticator & 2FA Engine for PostalPro Admin
 */

const BASE32_ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';
export const ADMIN_TOTP_SECRET = 'POSTALPROADMIN2FA';

/**
 * Decode Base32 string to Uint8Array
 */
export function base32ToBytes(base32) {
  const clean = (base32 || '').toUpperCase().replace(/[^A-Z2-7]/g, '');
  let bits = '';
  for (let i = 0; i < clean.length; i++) {
    const val = BASE32_ALPHABET.indexOf(clean[i]);
    if (val === -1) continue;
    bits += val.toString(2).padStart(5, '0');
  }
  const bytes = new Uint8Array(Math.floor(bits.length / 8));
  for (let i = 0; i < bytes.length; i++) {
    bytes[i] = parseInt(bits.substr(i * 8, 8), 2);
  }
  return bytes;
}

/**
 * Generate 6-digit TOTP code for a given timestamp step
 */
export async function generateTOTPCode(secretBase32 = ADMIN_TOTP_SECRET, timeStepOffset = 0, timeStepSeconds = 30) {
  const counter = Math.floor(Date.now() / 1000 / timeStepSeconds) + timeStepOffset;
  const keyBytes = base32ToBytes(secretBase32);

  const cryptoKey = await crypto.subtle.importKey(
    'raw',
    keyBytes,
    { name: 'HMAC', hash: { name: 'SHA-1' } },
    false,
    ['sign']
  );

  const counterBuffer = new ArrayBuffer(8);
  const dataView = new DataView(counterBuffer);
  dataView.setUint32(0, Math.floor(counter / 0x100000000), false);
  dataView.setUint32(4, counter & 0xffffffff, false);

  const signature = await crypto.subtle.sign('HMAC', cryptoKey, counterBuffer);
  const sigBytes = new Uint8Array(signature);

  // Dynamic truncation per RFC 4226
  const offset = sigBytes[sigBytes.length - 1] & 0x0f;
  const binary =
    ((sigBytes[offset] & 0x7f) << 24) |
    ((sigBytes[offset + 1] & 0xff) << 16) |
    ((sigBytes[offset + 2] & 0xff) << 8) |
    (sigBytes[offset + 3] & 0xff);

  const otp = binary % 1000000;
  return otp.toString().padStart(6, '0');
}

/**
 * Verify a 6-digit code against Google Authenticator TOTP
 * Allows ±2 time steps (±60 seconds) drift tolerance
 */
export async function verifyGoogleAuthenticatorCode(inputCode, secretBase32 = ADMIN_TOTP_SECRET) {
  const cleanCode = (inputCode || '').trim().replace(/\D/g, '');
  if (cleanCode.length !== 6) return false;

  for (let offset of [0, -1, 1, -2, 2]) {
    try {
      const expected = await generateTOTPCode(secretBase32, offset);
      if (cleanCode === expected) {
        return true;
      }
    } catch (e) {
      console.warn('TOTP check exception', e);
    }
  }
  return false;
}
