
import CryptoJS from 'crypto-js';
import { BASE64_CHARS, DEFAULT_MAP } from './constants';

/**
 * Encrypts a string using AES and then converts the Base64 ciphertext into emojis using a specific map.
 */
export const encryptToEmojis = (text: string, secret: string, customMap: string[] = DEFAULT_MAP): string => {
  if (!text) throw new Error("Message text cannot be empty.");
  if (!secret) throw new Error("Password cannot be empty.");
  if (customMap.length !== 65) throw new Error("Invalid Encryption Key configuration.");

  try {
    // 1. Encrypt with AES
    // This produces a salted, OpenSSL-compatible ciphertext string in Base64 format
    const encrypted = CryptoJS.AES.encrypt(text, secret).toString();

    // 2. Map Base64 characters to Emojis using the provided map
    let emojiString = '';
    for (let i = 0; i < encrypted.length; i++) {
      const char = encrypted[i];
      const index = BASE64_CHARS.indexOf(char);
      if (index !== -1 && customMap[index]) {
        emojiString += customMap[index];
      } else {
        // This theoretically shouldn't happen with standard CryptoJS Base64 output
        throw new Error(`Encryption produced an unexpected character: '${char}'`);
      }
    }

    return emojiString;
  } catch (error: any) {
    console.error("Encryption error:", error);
    throw new Error(error.message || "Encryption failed due to an unexpected error.");
  }
};

/**
 * Decrypts an emoji string back to the original text using the secret and a specific map.
 */
export const decryptFromEmojis = (emojiString: string, secret: string, customMap: string[] = DEFAULT_MAP): string => {
  if (!emojiString) throw new Error("Cipher text cannot be empty.");
  if (!secret) throw new Error("Password cannot be empty.");
  if (customMap.length !== 65) throw new Error("Invalid Decryption Key configuration.");

  // 1. Clean and Validate Input
  // Remove whitespace/newlines that might have been pasted accidentally
  const cleanEmojiString = emojiString.replace(/\s+/g, '');
  
  if (cleanEmojiString.length === 0) {
    throw new Error("Input text is empty or contains only whitespace.");
  }

  const emojiArray = Array.from(cleanEmojiString);
  
  // strict check: Are there emojis in the input that don't exist in our map?
  const invalidEmojis = emojiArray.filter(char => !customMap.includes(char));
  
  if (invalidEmojis.length > 0) {
    const uniqueBadChars = Array.from(new Set(invalidEmojis)).slice(0, 5).join(' ');
    throw new Error(
      `Input contains characters not found in the selected Key (${uniqueBadChars}...). ` +
      `Ensure you are using the EXACT same Emoji Key used for encryption.`
    );
  }

  try {
    // 2. Map Emojis back to Base64 characters
    let base64String = '';
    for (const emoji of emojiArray) {
      const index = customMap.indexOf(emoji);
      if (index !== -1) {
        base64String += BASE64_CHARS[index];
      }
    }

    // 3. Decrypt with AES
    const bytes = CryptoJS.AES.decrypt(base64String, secret);
    
    // Convert to UTF-8
    let originalText = '';
    
    try {
      originalText = bytes.toString(CryptoJS.enc.Utf8);
    } catch (e) {
      // CryptoJS throws 'Malformed UTF-8 data' if the bytes are garbage (wrong password)
      throw new Error("Decryption failed. Incorrect Password or Wrong Emoji Key.");
    }

    // If text is empty after decryption, it usually means the key/password was wrong
    // and the resulting bytes didn't form valid UTF-8 strings.
    if (!originalText) {
      throw new Error("Decryption failed. Incorrect Password or Wrong Emoji Key.");
    }

    return originalText;

  } catch (error: any) {
    // Re-throw known validation errors
    if (error.message.includes("Input contains") || 
        error.message.includes("Input text is empty") ||
        error.message.includes("Decryption failed")) {
      throw error;
    }

    // Catch-all for other crypto library errors
    console.error("Decryption error details:", error);
    throw new Error("Decryption failed. Verify your password and key.");
  }
};
