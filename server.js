const http = require('http');

var fs = require('fs');

var path = require('path');

const mongo = require('mongodb');

const MongoClient = mongo.MongoClient;

const url = 'mongodb://localhost:12345';

const ObjectID = mongo.ObjectID;

//machine host REAL ip goes here (not localhost)
const hostname = 'xxx.xxx.x.xxx';

const port = 3000;




const server = http.createServer((request, response) => {
        
    var filePath = '.' + request.url;
    if (filePath == './') {
        filePath = './index.html';
    }

    var extname = String(path.extname(filePath)).toLowerCase();
    var mimeTypes = {
        '.html': 'text/html',
        '.js': 'text/javascript',
        '.css': 'text/css',
        '.json': 'application/json',
        '.png': 'image/png',
        '.jpg': 'image/jpg',
        '.gif': 'image/gif',
        '.svg': 'image/svg+xml',
        '.wav': 'audio/wav',
        '.mp4': 'video/mp4',
        '.woff': 'application/font-woff',
        '.ttf': 'application/font-ttf',
        '.eot': 'application/vnd.ms-fontobject',
        '.otf': 'application/font-otf',
        '.wasm': 'application/wasm'
    };

    var contentType = mimeTypes[extname] || 'application/octet-stream';

    fs.readFile(filePath, function(error, content) {
        if (error) {
            if(error.code == 'ENOENT') {
                fs.readFile('./404.html', function(error, content) {
                    response.writeHead(404, { 'Content-Type': 'text/html' });
                    response.end(content, 'utf-8');
                });
            }
            else {
                response.writeHead(500);
                response.end('Sorry, check with the site admin for error: '+error.code+' ..\n');
            }
        }
        else {
            response.writeHead(200, { 'Content-Type': contentType });
            response.end(content, 'utf-8');
        }
    });
});

server.listen(port, hostname, () => {
        console.log(`Server running at http://${hostname}:${port}`)
});

MongoClient.connect(url, { useNewUrlParser: true }, (err, client) => {

    if (err) throw err;

    const db = client.db("testdb");

    db.listCollections().toArray().then((docs) => {

        console.log('Available collections:');
        docs.forEach((doc, idx, array) => { console.log(doc.name) });

    }).catch((err) => {

        console.log(err);
    }).finally(() => {

        client.close();
    });
});
