<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# EmojiCrypt

EmojiCrypt is a secure encryption application that transforms text messages into unique strings of emojis using advanced cryptographic techniques. With a user-friendly interface and robust security features, EmojiCrypt makes encryption accessible and fun.

## App Layout & Functionality

### Encryption/Decryption Panels

EmojiCrypt features a dual-panel interface that allows users to seamlessly switch between encryption and decryption modes:

- **Encryption Panel**: Convert plain text messages into emoji cipher strings using a password-based encryption system
- **Decryption Panel**: Restore emoji cipher strings back to their original text using the correct password

Both panels include intuitive input fields, password strength meters, and visual feedback for successful operations.

### Emoji-Based Cipher System

The core innovation of EmojiCrypt lies in its emoji-based cipher system:

- Uses AES-256-GCM encryption algorithm for military-grade security
- Maps Base64-encoded ciphertext to a set of 65 unique emojis
- Offers multiple emoji themes including Animals, Food, Faces, and Love themes
- Provides a customizable emoji mapping system for enhanced security

The cipher system transforms complex cryptographic output into visually appealing emoji sequences that are easy to share and remember.

### Clipboard Management Settings

EmojiCrypt prioritizes user privacy with built-in clipboard management:

- **Auto-Clear Feature**: Automatically removes sensitive data from clipboard after a configurable time period
- **Time-Based Controls**: Adjustable timer settings ranging from 10 seconds to 5 minutes
- **Manual Override**: Users can manually clear clipboard contents at any time

These features protect against clipboard sniffing and unauthorized data access.

### QR Code Generation and Scanning

For convenient sharing and mobile compatibility, EmojiCrypt includes QR code functionality:

- **Generate QR Codes**: Create scannable QR codes from encrypted emoji strings
- **Scan QR Codes**: Import emoji ciphers by scanning QR codes with device cameras
- **Export Options**: Save QR codes as images or share them directly

This feature bridges desktop and mobile platforms, enabling seamless cross-device communication.

### Password Strength Meter

To ensure robust security practices, EmojiCrypt incorporates a real-time password strength meter:

- Visual indicators for password strength (Empty, Weak, Medium, Strong)
- Helpful feedback including suggestions for improvement
- Real-time evaluation as users type their passwords

### Multi-Language Support

EmojiCrypt is accessible to a global audience with support for multiple languages:

- English
- Español (Spanish)
- Français (French)
- हिन्दी (Hindi)
- తెలుగు (Telugu)
- العربية (Arabic)

The interface automatically adapts to right-to-left languages ensuring proper display for all users.

### History Tracking Functionality

EmojiCrypt maintains a local history of recent encryption operations:

- Stores the last 10 encrypted messages with previews
- Allows quick access to previously encrypted content
- Provides option to clear history for privacy

## Technologies Used

### Core Framework

- **React with TypeScript**: Modern, type-safe frontend development
- **Vite**: Ultra-fast build tool and development server
- **Tailwind CSS**: Utility-first CSS framework for responsive design

### Encryption Library

- **Crypto-JS**: Industry-standard cryptographic library implementing AES-256-GCM encryption

### UI Animations

- **Framer Motion**: Production-ready motion library for React applications
- Smooth transitions and interactive animations throughout the interface

### State Management

- **React Hooks**: Built-in state management using useState, useEffect, and useContext
- **Context API**: Application-wide state management for language preferences

### Storage Mechanisms

- **localStorage**: Client-side storage for user preferences, clipboard settings, and history
- **Session-independent persistence**: Settings maintained across browser sessions

### Additional Libraries

- **Lucide React**: Beautiful, consistent icon set
- **QRCode.js**: QR code generation library
- **jsQR**: JavaScript QR code scanning library

## Creator Details

EmojiCrypt was created by Pondara Akhil Behara, a passionate BTech student specializing in Artificial Intelligence and Data Science at Chaitanya Engineering College. Dedicated to making cryptography accessible and engaging, this project embodies the vision that security tools can be both powerful and enjoyable to use.

**Project Vision**: Transform the perception of encryption from complex and intimidating to simple and fun, encouraging everyday users to adopt secure communication practices.

**Open Source Commitment**: As an open-source project, EmojiCrypt is freely available for community contribution, inspection, and enhancement. The source code is hosted on GitHub with full transparency.

For more information about the creator and other projects, visit the [portfolio](https://akhilbehara999.github.io/my-portfolio/).

## Run Locally

**Prerequisites:** Node.js

1. Install dependencies:
   ```bash
   npm install
   ```
2. Set the `GEMINI_API_KEY` in `.env.local` to your Gemini API key
3. Run the app:
   ```bash
   npm run dev
   ```

## Security Features

- Zero-knowledge architecture - no data leaves the user's device
- Military-grade AES-256-GCM encryption
- No server-side storage of sensitive information
- Automatic clipboard clearing for enhanced privacy
- Password strength enforcement

## Contributing

Contributions are welcome! Feel free to submit issues, feature requests, or pull requests to help improve EmojiCrypt.

## License

This project is licensed under the MIT License - see the LICENSE file for details.