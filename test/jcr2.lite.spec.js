var jcr = require('../jcrv.js');
var expect = require('chai').expect;
var t = require('./test.json');

describe('jcr testing suite', function() {
	it('should fail jcr2 with imports if allowUndefined not set', function() {
        expect(function() {
            jcr('test/importTestLite.jcr2', t, {allowCustomRules : true});
        }).to.throw(Error);
    });
    it('should fail jcr2 with imports if allowUndefined not set', function() {
        console.log(t.MyConstructor);
        expect(function() {
            jcr('test/importTest.jcr2', t, {allowCustomRules : true});
        }).to.throw(Error);
    });
});