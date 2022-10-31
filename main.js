const http = require('http');
var fs = require("fs");
const {CasparCG} = require("casparcg-connection");

const hostname = '127.0.0.1';
const port = 62300;

const server = http.createServer((req, res) => {
    if (req.url == "/info") {
        res.statusCode = 200
        res.setHeader('Content-Type', 'text/plain');
        res.end(JSON.stringify(remtime));
    } else {
        fs.readFile('index.html', function(err, data) {
            res.writeHead(200, {'Content-Type': 'text/html'});
            res.write(data);
            return res.end();
        });
    }
});

server.listen(port, hostname, () => {
    console.log("http server started at http://" + hostname + ":" + port);
});


var ccgconn = new CasparCG("192.168.100.73", 5250);
ccgconn.play(1,1, "test_MPEG2_MXF");

var ccginfo;
var timeArr;
var resfile;
var remtime;
setInterval(async function(){
    ccginfo = await ccgconn.info(1, 1);
    resfile = ccginfo.response.data.stage.layer.layer_1.foreground.file;
    if (resfile != undefined) { timeArr = resfile.time; 
    remtime = timeArr[1] - timeArr[0];
    console.log("ccginfo: " + ccginfo + " " + Math.trunc(remtime));
    } else {
        console.log("--:--:--")
    }
}, 250);
