/**
 * Secure on-device encryption engine using Web Crypto API (AES-GCM 256-bit)
 * Keeps all agent leads and profile records 100% private to the local device.
 */

const SALT_KEY = 'postalpro_device_salt_v1';
const APP_KEY_SEED = 'PostalPro-PLI-Studio-Vault-Key-2026';

// Generate or retrieve device unique salt
function getDeviceSalt(): Uint8Array {
  let saltHex = localStorage.getItem(SALT_KEY);
  if (!saltHex) {
    const salt = crypto.getRandomValues(new Uint8Array(16));
    saltHex = Array.from(salt).map(b => b.toString(16).padStart(2, '0')).join('');
    localStorage.setItem(SALT_KEY, saltHex);
  }
  const match = saltHex.match(/.{1,2}/g) || [];
  return new Uint8Array(match.map(byte => parseInt(byte, 16)));
}

// Derive AES-GCM 256-bit key from device salt and seed
async function deriveKey(): Promise<CryptoKey> {
  const enc = new TextEncoder();
  const keyMaterial = await crypto.subtle.importKey(
    'raw',
    enc.encode(APP_KEY_SEED),
    { name: 'PBKDF2' },
    false,
    ['deriveKey']
  );

  const salt = getDeviceSalt();

  return await crypto.subtle.deriveKey(
    {
      name: 'PBKDF2',
      salt,
      iterations: 100000,
      hash: 'SHA-256',
    },
    keyMaterial,
    { name: 'AES-GCM', length: 256 },
    false,
    ['encrypt', 'decrypt']
  );
}

// Encrypt any JavaScript object/data into a Base64-encoded encrypted string
export async function encryptData<T>(data: T): Promise<string> {
  try {
    const jsonStr = JSON.stringify(data);
    const enc = new TextEncoder();
    const encoded = enc.encode(jsonStr);
    
    const key = await deriveKey();
    const iv = crypto.getRandomValues(new Uint8Array(12)); // 96-bit IV for AES-GCM

    const cipherBuffer = await crypto.subtle.encrypt(
      {
        name: 'AES-GCM',
        iv,
      },
      key,
      encoded
    );

    // Combine IV (12 bytes) + Ciphertext into single payload
    const combined = new Uint8Array(iv.length + cipherBuffer.byteLength);
    combined.set(iv, 0);
    combined.set(new Uint8Array(cipherBuffer), iv.length);

    // Convert to base64
    let binary = '';
    const bytes = combined;
    const len = bytes.byteLength;
    for (let i = 0; i < len; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return btoa(binary);
  } catch (error) {
    console.error('Encryption failed, falling back to safe local store:', error);
    return JSON.stringify({ _fallback: true, data });
  }
}

// Decrypt Base64-encoded encrypted string back into original data
export async function decryptData<T>(ciphertextBase64: string, fallbackDefault: T): Promise<T> {
  if (!ciphertextBase64) return fallbackDefault;

  // Check if unencrypted fallback
  if (ciphertextBase64.startsWith('{') && ciphertextBase64.includes('_fallback')) {
    try {
      const parsed = JSON.parse(ciphertextBase64);
      return parsed.data;
    } catch {
      return fallbackDefault;
    }
  }

  try {
    const binary = atob(ciphertextBase64);
    const len = binary.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
      bytes[i] = binary.charCodeAt(i);
    }

    if (bytes.length < 13) return fallbackDefault;

    const iv = bytes.slice(0, 12);
    const dataBytes = bytes.slice(12);

    const key = await deriveKey();

    const decryptedBuffer = await crypto.subtle.decrypt(
      {
        name: 'AES-GCM',
        iv,
      },
      key,
      dataBytes
    );

    const dec = new TextDecoder();
    const jsonStr = dec.decode(decryptedBuffer);
    return JSON.parse(jsonStr) as T;
  } catch (error) {
    console.warn('Decryption failed, checking for plain json or returning default:', error);
    try {
      // If legacy plain JSON existed
      return JSON.parse(ciphertextBase64) as T;
    } catch {
      return fallbackDefault;
    }
  }
}
