import CryptoJS from "crypto-js";

export function encryptShare(share: string, password: string): string {
  return CryptoJS.AES.encrypt(share, password).toString();
}

export function decryptShare(encryptedShare: string, password: string): string {
  const bytes = CryptoJS.AES.decrypt(encryptedShare, password);
  return bytes.toString(CryptoJS.enc.Utf8);
}

