var header=document.createElement('h1');
header.innerText='JCR Rules';
document.body.appendChild(header);
var rulesSet=document.createElement('h2');
rulesSet.innerText='For: ' + obj.rulesSet;
document.body.appendChild(rulesSet);
obj.comments.forEach(function(comment){
	var container=document.createElement('div');
})