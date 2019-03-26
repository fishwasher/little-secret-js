/**
 A lightweight text encoder/decoder which converts UTF-8 text into a binary array,
transforms the array using a secret UTF-8 passphrase, and then encodes it as Base64 ASCII text.
It makes use of TextEncoder web API which may not be supported by some older browsers.
See https://developer.mozilla.org/en-US/docs/Web/API/TextEncoder for details.

Not intended to be used for cryptography purposes ;)

(c)2019 Vlad Podvorny
*/
!function(scope){
  'use strict';

  if (!scope.Uint8Array || !scope.TextEncoder || !scope.TextDecoder) {
    return console.log("Text encoding is not supported in this browser");
  }

  // Re-order array elements by splitting into halves and reversing each half;
  Uint8Array.prototype._flip = function() {
    var len = this.length, pos = Math.floor(len / 2);
    if (len < 3) return this.reverse();
    this.subarray(0, pos).reverse();
    this.subarray(pos).reverse();
    return this;
  };

  // Transform elements of Uint8Array by XORing with elements of another Uint8Array
  Uint8Array.prototype._transform = function(inst2, revert) {
    var len = inst2.length, salt = inst2.length % 256;
    this.forEach((x, i, a) => {
      var j = i % len, y = x ^ inst2[j] ^ salt;
      salt = revert ? y : x;
      a[i] = y;
    });
    return this;
  };

  function LS(secret) {
    secret || (secret = 'secret');
    var enc = new TextEncoder();
    this.secret = enc.encode(secret)._flip();
  }

  LS.prototype.encode = function(str) {
    if (!str) return '';
    var
      enc = new TextEncoder(),
      ui8a = enc.encode(str)._flip(),
      xored = ui8a._transform(this.secret),
      ascii = Array.prototype.map.call(xored, c => String.fromCharCode(c)).join('');
    return scope.btoa(ascii);
  };

  LS.prototype.decode = function(b64str) {
    if (!b64str) return '';
    var
      ascii = scope.atob(b64str),
      ui8a = new Uint8Array(ascii.length),
      dec = new TextDecoder(),
      xored;

    Array.prototype.forEach.call(ascii,
      function(c, i) {
        ui8a[i] = c.charCodeAt(0);
      }
    );
    xored = ui8a._transform(this.secret, 1)._flip();
    return dec.decode(xored);
  };

  scope.LittleSecret = LS;

}(window);
