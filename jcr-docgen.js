#!/home/jason/.nvm/versions/node/v6.2.2/bin/node
function docgen(rulesFile){
    var docBody='';
    var reservedKeyword = [
        'String',
        'Boolean',
        'Number',
        'Object',
        'Array'
    ];

    var fs = require('fs');
    var i = require('./jcri');
    var startRE = /\/\*\*\*.*/g;
    var endRE = /\n.*\*\*\*\//g;
    var starts = [];
    var ends = [];
    var comments = [];

    var contents = fs.readFileSync(rulesFile, 'utf8');
    var rules=i(rulesFile);

    contents.replace(startRE, function(match, index, string){
        starts.push({i:index, l:match.length})
    });
    contents.replace(endRE, function(match, index, string){ends.push(index)});

    if(starts.length !== ends.length) {
        throw new Error('imbalanced annotations');
    }

    comments = starts.map(function(start,index){
        var comment={};
        var meta = contents.slice(starts[index].i+starts[index].l,ends[index]);
        var initialIndent=meta.match(/^\n */)[0].length;
        
        var re='\n {'+(initialIndent-1) + '}';
        re = new RegExp(re);
        var lines=meta.split(re);   
        lines.forEach(function(l,i){
            var space = ' ';
            if(l.charAt(0)===' '){
                l=l.slice(l.match(/\S/).index);
                if(lines[i-1].charAt(lines[i-1].length-1) === ' '){
                    space='';
                }
                lines[i-1]+=space + l;
                lines[i]='';
            }
        });
        lines=lines.filter(function(l){return l.length>0});
        lines.forEach(function(l){
            var props;
            if(/.*:.*/.test(l)){
                props=l.split(':');
                if(props[1].charAt(0)===' '){
                    props[1]=props[1].slice(props[1].match(/\S/).index);
                }
                comment[props[0]]=props[1];
                if(reservedKeyword.indexOf(rules[comment.Name].name) === -1) {
                    comment['functionBody']=rules[comment.Name].toString();
                } else {
                    comment['functionBody'] = rules[comment.Name].name;
                }

            }
        });
        return comment;
    });
    var c = {};
    comments.forEach(function(comment, index){
        if(comment.Name)
            c[comment.Name]=comment;
        comments[index]='';
    });
    comments.filter(function(l){return l.length>0});
    var obj = {rulesSet: rulesFile, comments: comments};
    obj.rules={};
    function decorate(rules, comments){
        for(var rule in rules){
            if(c[rule]){

            }
        }
    }
    
    
    comments.rulesSet=rulesFile;
    docBody+='<html><head>';
    docBody+='<script>';
    docBody+='obj=' + JSON.stringify(obj, null,4);
    docBody+='</script>';
    docBody+='';
    docBody+='</head><body><script src="dv.js"></script></body></html>';

    fs.writeFileSync(outputFile,docBody,'utf8');

    console.log(comments);
}

// Export
module.exports = docgen;


// CLI
var args = process.argv.slice(2);
var r = args[0];
var outputFile = 'rules.html' || process.argv.slice(3);

var f = process.argv[1];
if(f.slice(-3) !== '.js'){
    f+='.js';
}

if(f === __filename){
    docgen(r);    
}

