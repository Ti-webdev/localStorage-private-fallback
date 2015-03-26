describe('storagePrivateFallback', function() {
  var storagePrivateFallback = window.storagePrivateFallback;
  var GibberishAES = window.GibberishAES;

  [
    {
      name: 'CookieStorage',
      storage: function() { return new storagePrivateFallback.CookieStorage(); }
    },
    {
      name: 'WindowNameStorage',
      storage: function() { return new storagePrivateFallback.WindowNameStorage(); }
    },
    {
      name: 'WindowNameStorage with encrypt',
      storage: function() { return new storagePrivateFallback.WindowNameStorage(GibberishAES); }
    }
  ].forEach(function(fallbackStorage) {
    describe(fallbackStorage.name, function() {
      var storage;

      beforeEach(function(){
        storage = fallbackStorage.storage();
      });

      afterEach(function(){
        storage.clear();
      });

      it('replace storage', function() {
        storagePrivateFallback.replace(storage);
        (localStorage.getItem === storage.getItem).should.equal(true);
        (localStorage.setItem === storage.setItem).should.equal(true);
        (localStorage.removeItem === storage.removeItem).should.equal(true);
        (localStorage.clear === storage.clear).should.equal(true);
      });
      it('setItem, getItem, removeItem', function() {
        storage.setItem('testKey', 'testValue');
        storage.getItem('testKey').should.equal('testValue');
        storage.removeItem('testKey');
        (null === storage.getItem('testKey')).should.equal(true);
      });
      it('replace value', function() {
        storage.setItem('test key', 'value 1');
        storage.getItem('test key').should.equal('value 1');
        storage.setItem('test key', 'value 2');
        storage.getItem('test key').should.equal('value 2');
        storage.removeItem('test key');
        (null === storage.getItem('test tey')).should.equal(true);
        storage.setItem('test key', 'value 3');
        storage.getItem('test key').should.equal('value 3');
      });
      it('special chars', function() {
        storage.setItem('test key % @: ; $=& тест', '*?=%з ; = $');
        storage.getItem('test key % @: ; $=& тест').should.equal('*?=%з ; = $');
      });
      describe('clear', function() {
        it('remove all', function() {
          storage.setItem('testKey1', '1');
          storage.setItem('testKey2', '2');
          storage.setItem('testKey3', '3');
          storage.clear();
          (null === storage.getItem('testKey1')).should.equal(true);
          (null === storage.getItem('testKey2')).should.equal(true);
          (null === storage.getItem('testKey3')).should.equal(true);
        });
        it('do not remove another cookie', function() {
          document.cookie = 'myCookie=storedValue; path=/';
          storage.clear();
          document.cookie.should.equal('myCookie=storedValue');
        });
      });
    });
  });

    // describe('Encrypt', function() {
    //   var encryptedStorage = new storagePrivateFallback.WindowNameStorage(GibberishAES);
    //   encryptedStorage.setItem('test', 'first security data');
    //   (-1 === window.name.indexOf('first security data')).should.equal(true);
    //
    //   var plainStorage = new storagePrivateFallback.WindowNameStorage();
    //   (null === plainStorage.getItem('test')).should.equal(true);
    //   plainStorage.setItem('test', 'second security data');
    //   (-1 !== window.name.indexOf('second security data')).should.equal(true);
    // });
});
