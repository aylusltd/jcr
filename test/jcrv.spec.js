var jcr = require('../jcrv.js');
var expect = require('chai').expect;
var t = require('./test.json');

describe('jcr testing suite', function() {
    it('should validate the reference file', function() {
        expect(function(){
            jcr('test/test.jcr', 'test/test.json');
        }).to.not.throw(Error);
    });

    it('should validate the reference file against an object', function() {
        expect(function(){
            jcr('test/test.jcr', t);
        }).to.not.throw(Error);
    });

    it('should fail with no rules file', function() {
        expect(function() {
            jcr(undefined, 'test/test.json')
        }).to.throw(Error);
    });
    it('should fail with no test file', function() {
        expect(function() {
            jcr('test/test.jcr', undefined)
        }).to.throw(Error);
    });

    it('should fail with no test file and no rules file', function() {
        expect(function() {
            jcr(undefined, undefined)
        }).to.throw(Error);
    });

    it('should pass a test file and no rules file if allowUndefined', function() {
        expect(function() {
            jcr(undefined, 'test/test.json', {
                allowUndefined: true
            })
        }).to.not.throw(Error);
    });

    it('should fail with a property in the test file that\'s not defined in the rules file and allowUndefined false', function() {
        t.potato = 'test'
        expect(function() {
            jcr('test/test.jcr', t, {
                    allowUndefined: false
                });
        }).to.throw(Error);
    });

    it('should pass with a property in the test file that\'s not defined in the rules file and allowUndefined true', function() {
        t.potato = 'test'
        expect(function() {
            jcr('test/test.jcr', t, {
                    allowUndefined: true
                });
        }).to.not.throw(Error);
    });
});