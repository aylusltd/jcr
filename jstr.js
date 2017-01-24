function p12p2(val){
	function recurse(obj){
		if(typeof obj == 'object'){
			for(var k in obj){
				return recurse(obj[k])	
			}
		} else {
			return ~val;
		}
	}
}
function(obj1){
	var obj2 = {};
	var map = {
		'prop1': ['prop2', 'prop3']
	};
	var funcMap = {
		prop1 : [p12ps, function(){}]
	};
	var n;

	for(var key in obj){
		if(Array.isArray(map[key])){
			mapKey.forEach(function(k1){
				obj2[k1] = funcMap[key][k1](obj1[key]);
			})
		}
		n = map(key) || key;
		obj2[n] = funcMap[key](obj1[key]);
	}
}

Object.prototype.map = function(fn){
	var o = Object.create();
	for(var key in this){
		o[key] = this.hasOwnProperty(key) ? fn(this[key]) : this[key];
	}
	return o;
}