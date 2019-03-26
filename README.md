# Little Secret text encoder/obfuscator

This is a lightweight text encoder/obfuscator that encodes UTF-8 text using a secret passphrase and stores the result as Base64-encoded ASCII text.
It makes use of TextEncoder web API which may not be supported by some older browsers.
See https://developer.mozilla.org/en-US/docs/Web/API/TextEncoder for details.

NOTE: This encoder is NOT intended to be used for cryptography purposes ;)

## Usage

- Link `lscoder.js` (or `lscoder.min.js`) to a web page using `script` tag;
- Provide a locally handled input for the passphrase to manage data coming from/to the server on the client side.
- Encode data before uploading to the server and decode upon downloading back to the client.
