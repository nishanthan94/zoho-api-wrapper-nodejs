const CryptoJS = require('crypto-js');
require('dotenv').config();

const encryptionKey = process.env.ENCRYPTION_KEY;

const encryption = {
    encrypt: (text) => {
        if (!text) return null;
        return CryptoJS.AES.encrypt(text, encryptionKey).toString();
    },

    decrypt: (encryptedText) => {
        if (!encryptedText) return null;
        const bytes = CryptoJS.AES.decrypt(encryptedText, encryptionKey);
        return bytes.toString(CryptoJS.enc.Utf8);
    }
};

module.exports = encryption;