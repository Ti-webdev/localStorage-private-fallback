(function(global, moduleName) {
  'use strict';

  var TEST_LOCALSTORAGE_KEY = 'test-localStorage';
  var value = new Date() + '';

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

  function getCookieLocalStore() {
    var COOKIE_PREFIX = 'locStrg_';

    var CookieLocalStore = function() {
    };
    CookieLocalStore.prototype = {
      setItem: function(key, value){
        document.cookie = encodeURIComponent(COOKIE_PREFIX + key) + '=' + encodeURIComponent(value) + '; path=/';
      },
      getItem: function(key) {
        var thisCookie;
        var keyEquals = encodeURIComponent(COOKIE_PREFIX + key) + '=';
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
      },
      removeItem: function(key) {
        document.cookie = encodeURIComponent(COOKIE_PREFIX + key) + '=' + '' + '; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
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

    return new CookieLocalStore;
  }

  function replace(store) {
    // replace localStorage
    var proto;
    if (window.localStorage) {
      proto = window.localStorage.constructor.prototype;
      proto.setItem    = store.setItem;
      proto.getItem    = store.getItem;
      proto.removeItem = store.removeItem;
      proto.clear      = store.clear;
    }
    else {
      window.localStorage;
    }
  }

  function exportModule() {
    var store;
    if (global.LOCALSTORAGE_PRIVATE_FALLBACK_EXPORT) {
      store = getCookieLocalStore();
      global[moduleName] = {
        replace: function() {
          replace(store);
        },
        store: replace
      };
    }
    else if (!isLocalStorageAvailable()) {
      store = getCookieLocalStore();
      replace(store);
    }
  }

  exportModule();
})(this, 'localStoragePrivateFallback');
