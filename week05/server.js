// server.js
// 由于node提供了HTTP这个核心模块所以不用特别安装就可以直接require进来使用
const http = require('http');
http.createServer((req, res) => {
    let body = [];
    req.on('error', (err) => {
        console.log('err', err);
    }).on('data', (chunk) => {
        body.push(chunk.toString());
    }).on('end', () => {
        // const bufferedBody = Buffer.from(body);
        // console.log('body', body);
        body = [].concat(body).toString();
        console.log("body:", body);
        res.writeHead(200, {'Content-Type': 'text/html'});
        res.end(`
        <html maaa=a>
        <head>
            <style>
                #container {
                    width: 500px;
                    height: 300px;
                    display: flex;    
                    background-color: rgb(255,255,255);
                }
                #container #myid {
                    width: 200px;
                    height: 100px;
                    background-color: rgb(255,0,0);
                }
                #container .c1 {
                    flex: 1;
                    background-color: rgb(0,255,0);
                }
        
            </style>
        </head>
        <body>
            <div id="container">
                <div id="myid" />
                <div class="c1" />
            </div>
        </body>
        </html>
    `);
    })
}).listen(8088);
console.log('server started'); // eslint-disable-line

