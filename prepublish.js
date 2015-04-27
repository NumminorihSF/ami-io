/**
 * Created by numminorihsf on 27.04.15.
 */
var fs = require('fs');
var readline = require('readline');
var rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});
var pack = require('./package.json');
function start() {
    rl.question('What version it is?\n['+pack.version+"]: ", function(version){
        if (version.length === 0)  {
            rl.question('Are you sure, that version should not  be changed?\ny[yes]/N[no]: ', function(answer){
                answer = answer.toLowerCase();
                if (answer === 'y' || answer === 'yes') {
                    console.log('OK');
                    process.exit();
                }
                else return setImmediate(function(){start()});
            });
        }
        else if (version.match(/\d+\.\d+\.\d+[\w\d\-]*/)) {
            rl.question('Are you sure, that version should be: '+ version+'?\ny[yes]/N[no]: ', function(answer){
                answer = answer.toLowerCase();
                if (answer === 'y' || answer === 'yes') {
                    pack.version = version;
                    fs.writeFileSync('./package.json', JSON.stringify(pack, null, 2)+'\n');
                    process.exit();
                }
                else return setImmediate(function(){start()});
            });
        }
    });
}
start();


