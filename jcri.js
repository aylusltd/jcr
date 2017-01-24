module.exports = function(rulesFile){
	var fs = require('fs');
	var i = require('./jcri');
	var data;

	try {
		var r = require(rulesFile);
		if(typeof r === 'function') {
			
			return r;
		} else {
			
		}
	} catch (ex) {
		if(rulesFile.slice(-4)!='.jcr' && rulesFile.slice(-5,-1)!='.jcr') {
			rulesFile+='.jcr'
		}
		data = fs.readFileSync(rulesFile, 'utf8');
		data = 'rules='+data;
	    eval(data);
	    return rules;
	}
	
}