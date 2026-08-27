/**
 * 256-bit AES-GCM Local Cryptographic Vault Utility
 * Encrypts and decrypts account records and profile backups locally in the browser.
 */

import { OfficeProfile, TDAccountItem } from '../types';

export interface VaultBackupPayload {
  version: string;
  createdAt: string;
  app: string;
  accounts: TDAccountItem[];
  office: OfficeProfile;
}

// Generate encryption key from passphrase using PBKDF2
async function getKeyFromPassphrase(passphrase: string, salt: Uint8Array): Promise<CryptoKey> {
  const enc = new TextEncoder();
  const keyMaterial = await window.crypto.subtle.importKey(
    'raw',
    enc.encode(passphrase),
    { name: 'PBKDF2' },
    false,
    ['deriveKey']
  );

  return window.crypto.subtle.deriveKey(
    {
      name: 'PBKDF2',
      salt: salt,
      iterations: 100000,
      hash: 'SHA-256'
    },
    keyMaterial,
    { name: 'AES-GCM', length: 256 },
    false,
    ['encrypt', 'decrypt']
  );
}

/**
 * Encrypts vault data into a 256-bit AES-GCM base64 encoded bundle
 */
export async function encryptVaultData(
  payload: VaultBackupPayload,
  passphrase = 'POSTALPRO_TD_SECURE_VAULT_2026'
): Promise<string> {
  try {
    const enc = new TextEncoder();
    const dataBytes = enc.encode(JSON.stringify(payload));
    const salt = window.crypto.getRandomValues(new Uint8Array(16));
    const iv = window.crypto.getRandomValues(new Uint8Array(12));

    const key = await getKeyFromPassphrase(passphrase, salt);
    const encryptedContent = await window.crypto.subtle.encrypt(
      {
        name: 'AES-GCM',
        iv: iv
      },
      key,
      dataBytes
    );

    const bundle = {
      salt: Array.from(salt),
      iv: Array.from(iv),
      ciphertext: Array.from(new Uint8Array(encryptedContent)),
      version: 'AES-GCM-256-v1'
    };

    return JSON.stringify(bundle, null, 2);
  } catch (err) {
    console.error('Encryption error:', err);
    throw new Error('Failed to encrypt vault data.');
  }
}

/**
 * Decrypts a 256-bit AES-GCM bundle back to VaultBackupPayload
 */
export async function decryptVaultData(
  encryptedJson: string,
  passphrase = 'POSTALPRO_TD_SECURE_VAULT_2026'
): Promise<VaultBackupPayload> {
  try {
    const bundle = JSON.parse(encryptedJson);

    // If it's a legacy unencrypted backup, return parsed directly
    if (bundle.accounts && bundle.office) {
      return bundle as VaultBackupPayload;
    }

    if (!bundle.salt || !bundle.iv || !bundle.ciphertext) {
      throw new Error('Invalid encrypted backup file format.');
    }

    const salt = new Uint8Array(bundle.salt);
    const iv = new Uint8Array(bundle.iv);
    const ciphertext = new Uint8Array(bundle.ciphertext);

    const key = await getKeyFromPassphrase(passphrase, salt);
    const decryptedBytes = await window.crypto.subtle.decrypt(
      {
        name: 'AES-GCM',
        iv: iv
      },
      key,
      ciphertext
    );

    const dec = new TextDecoder();
    const decryptedJson = dec.decode(decryptedBytes);
    return JSON.parse(decryptedJson) as VaultBackupPayload;
  } catch (err) {
    console.error('Decryption error:', err);
    throw new Error('Failed to decrypt vault file. Please check file integrity.');
  }
}
