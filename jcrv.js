#!/home/jason/.nvm/versions/node/v6.2.2/bin/node
function jcr(r,v,o){
    var fs = require('fs');
    var i = require('./jcri');

    var validationFile = v;
    var rulesFile = r;
    var optionsFile = o;

    var reservedKeyword = [
        'String',
        'Boolean',
        'Number',
        'Object',
        'Array'
    ];

    var testObj;

    function preDot(str){
        if(str.indexOf('./') !== 0){
            return './' + str;
        } else {
            return str;
        }
    }

    var options;
    try {
        optionsFile = preDot(optionsFile);
        options = require(optionsFile);
    } catch (ex) {
        options = typeof o == 'object' ? o : {};
    }
    
    var rules;
    if(typeof r == 'object') {
        rules = r;
    } else if (typeof r == 'undefined') {
        if(options.allowUndefined){
            rules = {};    
        } else {
            throw new Error('No rules file provided');
        }
        
    } else {
        data = fs.readFileSync(rulesFile, 'utf8');
        data = 'rules='+data;
        eval(data);
    }
   
    v = typeof v == 'object' ? v : require(preDot(validationFile));

    function jcrv(rules, obj, options){
        options = options || {};
        var keys = Array.prototype.concat(Object.keys(rules), Object.keys(obj));
        keys.forEach(function(key){
            if(
                (obj[key] !== undefined && typeof rules[key] == 'function' && obj[key].constructor == rules[key]) ||
                (rules[key]===undefined && options.allowUndefined)
            ){
                // Do nothing. This is a match.

            } else if (Array.isArray(rules[key]) && Array.isArray(obj[key])){
                // Iterative recursion for arrays
                obj[key].forEach(function(el){
                    jcrv(rules[key][0], el, options)
                });

            } else if (rules[key].constructor == Object) {
                // Simple recursion for objects
                jcrv(rules[key], obj[key], options);

            } else if(
                (obj[key] !== undefined && typeof rules[key] == 'function' && obj[key].constructor.name == rules[key].name) &&
                (!~reservedKeyword.indexOf(rules[key].name))
            ){
                // JCRP Match. Constructor names match, and not a reserved name.
                testObj = new rules[key]();
                for(k in  obj[key]){
                    if( typeof obj[key][k] != typeof testObj[k]){
                        console.log('Possible mismatch on testObj.' + key + '.' + obj[key][k] + '. Found ' + typeof obj[key][k] + ', but expected ' + typeof testObj[k]);
                        console.log('Could be due to instantiation differences.');
                    }
                }

            } else if (options.allowCustomRules && rules[key](obj[key]) === true){
                // custom validation function returned true
                //console.log('key')
                //console.log(key);
                //console.log('rule')
                //console.log(rules[key]);
                //console.log(rules[key].name);
                //console.log('value')
                //console.log(obj[key]);
                ////console.log(rules[key](obj[key]));
                //console.log('custom rule passed');
            } else {
                // Mismatch
                // console.log(key + ' : ' + obj[key]);
                // console.log(obj[key].property);
                // console.log(obj[key].constructor);
                // console.log(obj[key].constructor.name);
                // console.log(rules[key].name);
                throw new Error('invalid value at ' + key);
            }
        });
    }
    jcrv(rules, v, options);
    if(options.verbose){
        console.log(validationFile + ' successfully validated against ' + rulesFile);
    }
}
module.exports = jcr;

var args = process.argv.slice(2);
var v = args[0];
var r = args[1];
var o = args[2];
if(process.argv[1] == __filename){
    jcr(r,v,{verbose:true});    
}
