var CryptoJS = require("crypto-js");

export const encryptText = (inputText, key) => {
  return CryptoJS.AES.encrypt(inputText, key).toString();
};

export const decryptText = (encryptedText, key) => {
  try {
    console.log("inside decrypt", encryptedText);
    let bytes = CryptoJS.AES.decrypt(encryptedText, key);
    const word = bytes.toString(CryptoJS.enc.Utf8);
    console.log({ word });
    return word;
  } catch (err) {
    console.log({ err });
    return encryptedText;
  }
};
