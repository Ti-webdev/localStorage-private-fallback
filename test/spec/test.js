describe('localStoragePrivateFallback', function() {
  localStoragePrivateFallback.replace();

  it('setItem, getItem, removeItem', function() {
    localStorage.setItem('testKey', 'testValue');
    localStorage.getItem('testKey').should.equal('testValue');
    localStorage.removeItem('testKey');
    (null === localStorage.getItem('testKey')).should.equal(true);
  });
  it('replace value', function() {
    localStorage.setItem('test key', 'value 1');
    localStorage.getItem('test key').should.equal('value 1');
    localStorage.setItem('test key', 'value 2');
    localStorage.getItem('test key').should.equal('value 2');
    localStorage.removeItem('test key');
    (null === localStorage.getItem('test tey')).should.equal(true);
    localStorage.setItem('test key', 'value 3');
    localStorage.getItem('test key').should.equal('value 3');
  });
  it('special chars', function() {
    localStorage.setItem('test key % @: ; $=& тест', '*?=%з ; = $');
    localStorage.getItem('test key % @: ; $=& тест').should.equal('*?=%з ; = $');
  });
  describe('clear', function() {
    it('remove all', function() {
      localStorage.setItem('testKey1', '1');
      localStorage.setItem('testKey2', '2');
      localStorage.setItem('testKey3', '3');
      localStorage.clear();
      (null === localStorage.getItem('testKey1')).should.equal(true);
      (null === localStorage.getItem('testKey2')).should.equal(true);
      (null === localStorage.getItem('testKey3')).should.equal(true);
    });
    it('do not remove another cookie', function() {
      document.cookie = 'myCookie=storedValue; path=/';
      localStorage.clear();
      document.cookie.should.equal('myCookie=storedValue');
    });
  });
});
