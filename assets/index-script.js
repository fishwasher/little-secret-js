!(function () {
  if (!window.LittleSecret) {
    document.body.innerHTML = "<h1>Not supported ☹️</h1>";
    return alert("Not Supported!");
  }

  const byId = id => document.getElementById(id);

  const addHandler = (target, eventType, handler) => {
    const el = typeof target === "string" ? byId(target) : target;
    eventType
      .split(/\W+/)
      .map(s => s.trim())
      .filter(s => !!s)
      .forEach(it => {
        el.addEventListener(it, handler);
      });
  };

  addHandler(window, "DOMContentLoaded", ev => {
    const O = {};
    [
      "area-secret",
      "area-original",
      "area-encoded",
      "btn-clear-secret",
      "btn-clear-original",
      "btn-clear-encoded",
      "btn-clear-all",
      "btn-encode",
      "btn-decode",
      "btn-reset"
    ].forEach(id => {
      O[id] = byId(id);
    });

    const X = {
      secret: "📢Hello,\nWorld!😎",
      original:
        "Lorem ipsum ✌️ sit amet,\nconsectetur ☹️ elit. Quisque magna\njusto 👀, venenatis sed mauris 🌷,\nscelerisque sagittis 💩.",
      encoded: ""
    };

    const checkState = () => {
      const secret = O["area-secret"].value;
      const orig = O["area-original"].value;
      const encoded = O["area-encoded"].value;
      O["btn-clear-secret"].disabled = !secret;
      O["btn-clear-original"].disabled = !orig;
      O["btn-clear-encoded"].disabled = !encoded;
      O["btn-clear-all"].disabled = !secret && !orig && !encoded;
      O["btn-encode"].disabled = !secret || !orig;
      O["btn-decode"].disabled = !secret || !encoded;
      O["btn-reset"].disabled =
        secret === X.secret && orig === X.original && encoded === X.encoded;
    };

    const initialize = () => {
      O["area-secret"].value = X.secret;
      O["area-original"].value = X.original;
      O["area-encoded"].value = X.encoded;
      checkState();
    };

    const getCoder = () => {
      const secret = O["area-secret"].value;
      return secret ? new LittleSecret(secret) : null;
    };

    const encode = () => {
      O["area-encoded"].value = "";
      const orig = O["area-original"].value;
      if (orig) {
        const Coder = getCoder();
        if (Coder) {
          O["area-encoded"].value = Coder.encode(orig);
          return true;
        }
      }
      return false;
    };

    const decode = () => {
      O["area-original"].value = "";
      const encoded = O["area-encoded"].value;
      if (encoded) {
        const Coder = getCoder();
        if (Coder) {
          O["area-original"].value = Coder.decode(encoded);
          return true;
        }
      }
      return false;
    };

    addHandler(O["btn-clear-secret"], "click", () => {
      O["area-secret"].value = "";
      checkState();
    });

    addHandler(O["btn-clear-original"], "click", () => {
      O["area-original"].value = "";
      checkState();
    });

    addHandler(O["btn-clear-encoded"], "click", () => {
      O["area-encoded"].value = "";
      checkState();
    });

    addHandler(O["btn-clear-all"], "click", () => {
      O["area-secret"].value = O["area-original"].value = O[
        "area-encoded"
      ].value = "";
      checkState();
    });

    addHandler(O["btn-reset"], "click", () => {
      initialize();
      checkState();
    });

    addHandler(O["btn-encode"], "click", () => {
      encode();
      checkState();
    });

    addHandler(O["btn-decode"], "click", () => {
      decode();
      checkState();
    });

    ["area-secret", "area-original", "area-encoded"].forEach(it => {
      addHandler(O[it], "input", checkState);
    });

    /*
    addHandler(O["area-secret"], "input", () => {
      checkState();
    });

    addHandler(O["area-original"], "input", () => {
      checkState();
    });

    addHandler(O["area-encoded"], "input", () => {
      checkState();
    });
    */

    addHandler(O["area-encoded"], "focus", ev => {
      ev.target.select();
    });

    initialize();

    //---------------------
  });
})();
