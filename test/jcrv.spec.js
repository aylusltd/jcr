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

    it('should pass jcrp if valid', function() {
        delete t.potato;
        require('./test.jcrp');
        t.MyConstructor = new global.MyConstructor();
        expect(function() {
            jcr('test/test.jcrp', t);
        }).to.not.throw(Error);
    });

    it('should compose with imports', function() {
        delete t.potato;
        require('./test.jcrp');
        t.MyConstructor = new global.MyConstructor();
        expect(function() {
            jcr('test/test2.jcrp', t);
        }).to.not.throw(Error);
    });

    it('should pass jcrp if valid but warn of mismatched property', function() {
        require('./test.jcrp');
        t.MyConstructor = new global.MyConstructor();
        t.MyConstructor.property = 2;
        expect(function() {
            jcr('test/test.jcrp', t);
        }).to.not.throw(Error);
    });

    it('should pass jcr2 if valid and allowCustomRules', function() {
        delete t.MyConstructor;
        expect(function() {
            jcr('test/test.jcr2', t, {allowCustomRules : true});
        }).to.not.throw(Error);
    });

    it('should fail jcr2 if valid and allowCustomRules false', function() {
        expect(function() {
            jcr('test/test.jcr2', t);
        }).to.throw(Error);
    });

    it('should pass jcr2 with imports', function() {
        t.MyConstructor = new global.MyConstructor();
        expect(function() {
            jcr('test/importTest.jcr2', t, {allowCustomRules : true});
        }).to.not.throw(Error);
        delete t.MyConstructor;
    });

    it('should fail jcr2 with imports if allowUndefined not set (lite test)', function() {
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

    it('should fail jcr2 when a rule isn\'t met', function() {
        t.number=1;
        expect(function() {
            jcr('test/importTest.jcr2', t, {allowCustomRules : true});
        }).to.throw(Error);
        t.number=2;
    });
});