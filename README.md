# Little Secret text encoder/obfuscator

This is a lightweight text encoder/obfuscator that encodes UTF-8 text using a secret key and stores the result as Base64-encoded ASCII text.
It makes use of TextEncoder web API which may not be supported by some older browsers.
See https://developer.mozilla.org/en-US/docs/Web/API/TextEncoder for details.

NOTE: This encoder is NOT intended to be used for cryptography purposes ;)

## Usage

- Link `lscoder.js` (or `lscoder.min.js`) to a web page using a `script` tag;
- Provide locally handled input for the secret key to manage data coming from/to the server only on the client side.
- Encode data before uploading to the server and decode upon downloading back to the client.

        <script src="lscoder.js"></script>
        <script>
          var secret = "my secret pass :)";
          var Coder = new LittleSecret(secret);
          var originalText = "Global warming is a hoax";
          var encodedText = Coder.encode(originalText);
          var decodedText = Coder.decode(encodedText);

          console.log(originalText); // Global warming is a hoax
          console.log(encodedText); // HQITFxMTBgpBFFhsZ2d4MGRgMiIufTot
          console.log(decodedText === originalText); // true
        </script>

## Examples

Use _test.html_ to test LittleSecret in browser without server-side back-end.

A 'Secret Notes' PHP demo application _demo.php_ might give you more clues about using this thing.
