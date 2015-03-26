(function(topWindow, w, global, moduleName) {
  'use strict';

  var TEST_LOCALSTORAGE_KEY = 'test-localStorage';
  var value = new Date() + '';
  var COOKIE_PREFIX = 'locStrg_';
  var WINDOW_NAME_KEY_COOKE = 'wNameStrgKey';

  function isLocalStorageAvailable() {
    try {
      localStorage.setItem(TEST_LOCALSTORAGE_KEY, value);
      var actual = localStorage.getItem(TEST_LOCALSTORAGE_KEY);
      localStorage.removeItem(TEST_LOCALSTORAGE_KEY);
      if (actual !== value) {
        return false;
      }
      return true;
    } catch(e) {
      return false;
    }
  }

  var setCookie = function(name, value) {
    document.cookie = encodeURIComponent(name) + '=' + encodeURIComponent(value) + '; path=/';
  };

  var getCookie = function(name) {
    var thisCookie;
    var keyEquals = encodeURIComponent(name) + '=';
    var cookies = document.cookie.split(';');
    var i;
    var j = cookies.length;
    for(i = 0; i < j; i++) {
      thisCookie = cookies[i];
      while (' ' === thisCookie.charAt(0)) {
        thisCookie = thisCookie.substring(1, thisCookie.length);
      }
      if (0 === thisCookie.indexOf(keyEquals)) {
        return decodeURIComponent(thisCookie.substring(keyEquals.length, thisCookie.length));
      }
    }
    return null;
  };

  var removeCookie = function(name) {
    document.cookie = encodeURIComponent(name) + '=' + '' + '; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
  };

  var CookieStorage = function() {
  };

  CookieStorage.prototype = {
    setItem: function(key, value){
      setCookie(COOKIE_PREFIX + key, value);
    },
    getItem: function(key) {
      return getCookie(COOKIE_PREFIX + key);
    },
    removeItem: function(key) {
      removeCookie(COOKIE_PREFIX + key);
    },
    clear: function() {
      var cookies = document.cookie.split(/; +/);
      var thisCookie;
      var equalsPosition;
      var name;
      var i;
      var j = cookies.length;
      for(i = 0; i < j; i++) {
        thisCookie = cookies[i];
        equalsPosition = thisCookie.indexOf('=');
        name = -1 < equalsPosition ? thisCookie.substr(0, equalsPosition) : thisCookie;
        if (0 === name.indexOf(COOKIE_PREFIX)) {
          this.removeItem(decodeURIComponent(name.substring(COOKIE_PREFIX.length)));
        }
      }
    }
  };

  var getEncryptProcessor = function(encryptor, cookieName) {
    var key = getCookie(cookieName);

    var generageKey = function() {
      var result = '';
      var i;
      for(i = 0; i < 16; i++) {
        result += Math.random().toString(36).substring(2);
      }
      return result;
    };

    return {
      parse: function(str) {
        if (str && key) {
          return encryptor.dec(JSON.parse(str), key);
        }
        else {
          key = generageKey();
          setCookie(cookieName, key);
          return {};
        }
      },
      stringify: function(data) {
        if (!key) {
          key = generageKey();
        }
        return encryptor.enc(JSON.stringify(data), key);
      },
      clear: function() {
        removeCookie(cookieName);
      }
    };
  };

  var WindowNameStorage = function(encryptor) {
    var data = {}, processor;
    if (encryptor) {
      processor = getEncryptProcessor(encryptor, WINDOW_NAME_KEY_COOKE);
    }
    else {
      processor = JSON;
    }

    var _load = function() {
      try {
        data = processor.parse(topWindow.name);
        return;
      }
      catch(err) {
      }
      data = {};
    };

    var _save = function() {
      topWindow.name = processor.stringify(data);
    };

    this.setItem = function(key, value){
      data[key] = value;
      _save();
    };
    this.getItem = function(key) {
      return data.hasOwnProperty(key) ? data[key] : null;
    };
    this.removeItem = function(key) {
      delete data[key];
      _save();
    };
    this.clear = function() {
      data = {};
      topWindow.name = '';
      if (processor.clear) {
        processor.clear();
      }
    };

    _load();
  };

  function replace(store) {
    // replace localStorage
    var proto;
    if (w.localStorage) {
      proto = w.localStorage.constructor.prototype;
      proto.setItem    = store.setItem;
      proto.getItem    = store.getItem;
      proto.removeItem = store.removeItem;
      proto.clear      = store.clear;
    }
    else {
      w.localStorage = store;
    }
  }

  function exportModule() {
    if (global.LOCALSTORAGE_PRIVATE_FALLBACK_EXPORT) {
      global[moduleName] = {
        WindowNameStorage: WindowNameStorage,
        CookieStorage: CookieStorage,
        replace: replace
      };
    }
    else if (!isLocalStorageAvailable()) {
      if (w.GibberishAES) {
        replace(new WindowNameStorage(w.GibberishAES));
      }
      else {
        replace(new WindowNameStorage());
      }
    }
  }

  exportModule();
})(top || this, window || this, this, 'storagePrivateFallback');
