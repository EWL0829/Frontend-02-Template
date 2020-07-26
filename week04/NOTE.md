# 前端训练营week04
### 浏览器整体的渲染步骤
- URL(HTTP)
- HTML(parse)
- DOM(CSS computing)
- DOM with CSS(layout)
- DOM with position(render)
- bitmap

**整体流程的概括描述：**
首先经过一个HTTP请求以及一个解析HTTP回应的过程，我们需要把URL里面包含的HTML给获取到，之后我们会对文本的HTML进行解析也就是上述的parse，这其实就是一个一般的文本分析或者说是编译的初级技术，我们把HTML解析成一棵DOM树，此时这棵树是一个只有初级结构的DOM树，在下一个步骤(CSS computing)中，我们赋予了DOM树详细节点的样式，且这个过程会决定某些CSS属性所带来的样式该如何叠加如何覆盖，而这个最终的结果就是CSS computing的结果；计算结束之后我们就得到了一棵带有CSS属性的DOM树，之后就到了layout部分，这里可以翻译为**排版**也可以翻译为**布局**，布局的作用就是把这棵DOM树上面的所有元素产生的盒的位置给计算出来（**本身获得位置的不是DOM元素本身，而是CSS最后生成的核**）；当DOM树的元素们有了布局位置之后，就可以将它们按照自己的排版位置以及层级高低去合成一张图片（可以参考PS中的图层去理解），然后借助操作系统和硬件驱动提供的这些接口将这些内容展示出来。

### 状态机
#### 有限状态机
- 每一个状态都是一个机器
  - 在每一个机器里，我们可以做计算、存储、输出……
  - 所有的机器接收的输入是一致的
  - 状态机的每一个机器本身是没有状态的，如果我们用函数来表示的话，它应该是纯函数（无副作用）
- 每一个机器知道下一个状态
  - 每一个机器都有确定的下一个状态（Moore型状态机）
  - 每个机器根据输入决定下一个状态（Mealy型状态机） 【这里可能会出现很多选择判断的分支，比如if/else】

在(不)使用状态机处理字符串的时候正好复习一下for...in以及for...of。
```javascript
// for of(可以被break终止)
// for in(可以被break终止)

const arr = [52,22,13,4,95];
const str = 'This is a hello world string';
const obj = {
    name: 'dog',
    hobby: 'eat bones'
};
const num = 123456;

// 作用于数组（返回索引值）
for (let i in arr) {
    if (i === '2') break;
    console.log(`arr for in ${i}`, i);
}
// 作用于字符串（返回索引值）
for (let i in str) {
    console.log(`str for in ${i}`, i);
}
// 作用于对象（返回属性）
for (let i in obj) {
    console.log(`obj for in ${i}`, i);
}
// 作用于数字(并不会有反应，也不会报错)
for (let i in num) {
    console.log(`num for in ${i}`, i);
}

// --------我是分隔符--------
// 对于没有迭代器的对象，for of会报错
// 作用于数组（返回索引值）
for (let i of arr) {
    if (i === 22) break;
    console.log(`arr for of ${i}`, i);
}
// 作用于字符串（返回索引值）
for (let i of str) {
    console.log(`str for of ${i}`, i);
}
// 作用于对象（返回属性） 报错Uncaught TypeError: obj is not iterable
for (let i of obj) {
    console.log(`obj for of ${i}`, i);
}
// 作用于数字 报错Uncaught TypeError: num is not iterable
for (let i of num) {
    console.log(`num for of ${i}`, i);
}

```

**关于有限状态机的小练习**
```javascript
// 找到字符串中的abcabx
function match(str) {
    let state = start;
    for (let c of str) {
        state = state(c);
    }
    // 循环完所有的字符之后，状态是否是结束状态
    return state === end;
}

function start(c) {
    if (c === 'a') {
        return foundA;
    } else {
        return start;
    }
}
function foundA(c) {
    if (c === 'b') {
        return foundB;
    } else {
        return start;
    }
}
function foundB(c) {
    if (c === 'c') {
        return foundC;
    } else {
        return start;
    }
}
function foundC(c) {
    if (c === 'a') {
        return foundA2;
    } else {
        return start;
    }
}
function foundA2(c) {
    if (c === 'b') {
        return foundB2;
    } else {
        return start;
    }
}
function foundB2(c) {
    if (c === 'x') {
        return end;
    } else {
        return start;
    }
}
function end(c) {
    return end;
}

const str01 = 'abcabc';
const str02 = 'abcabx';
const str03 = 'abxabc';
const str04 = 'hellow';

match(str02);

// 找到字符串中的abababx
function match(str) {
    let state = start;
    for (let c of str) {
        state = state(c);
    }
    // 循环完所有的字符之后，状态是否是结束状态
    return state === end;
}

function start(c) {
    if (c === 'a') {
        return foundA;
    } else {
        return start;
    }
}
function foundA(c) {
    if (c === 'b') {
        return foundB;
    } else {
        return start;
    }
}
function foundB(c) {
    if (c === 'a') {
        return foundA2;
    } else {
        return start;
    }
}
function foundA2(c) {
    if (c === 'b') {
        return foundB2;
    } else {
        return start;
    }
}
function foundB2(c) {
    if (c === 'a') {
        return foundA3;
    } else {
        return start;
    }
}
function foundA3(c) {
    if (c === 'b') {
        return foundB3;
    } else {
        return start;
    }
}
function foundB3(c) {
    if (c === 'x') {
        return end;
    } else {
        return start;
    }
}
function end(c) {
    return end;
}

const str01 = 'abcabc';
const str02 = 'helloabababxwo';
const str03 = 'abxabc';
const str04 = 'hellow';

console.log(match(str02));
```
#### HTTP协议
首先回顾一下OSI模型，一共七层（应用层、表达层、会话层、传输层、网络层、数据链路层、物理层），但是普遍来讲我们说的最多的还是四层模型，应用层、传输层、网络层、数据链路层。像HTTP这样的**文本型协议**，它处于应用层。

**补充的TCP/IP基础知识**
在TCP传输数据的概念是流，流是一种没有明显分割单位的东西，TCP只需要保证这个流里面的数据前后顺序是正确的即可。TCP是传输层的协议，它需要将服务器传递回来的数据准确无误地传递给当前主机上需要该数据的软件，那么此时就存在一个判断谁是这个需要数据的软件，这里就要提到端口的概念了，计算机网卡会根据端口将数据分配给不同的软件。IP地址则是一个主机的唯一的标示性信息，这里需要和MAC硬件地址做一对比和区分。

前面说到了HTTP是文本型的协议，文本型的协议是和二进制的协议相对的。文本型的协议说明这个协议里面所有的内容都是字符串。

#### 练习代码的部分
```javascript
const net = require('net');

class Request {
    constructor(options) {
        this.method = options.method || 'GET';
        this.host = options.host;
        this.port = options.port || '80'; // 80是HTTP的默认端口
        this.path = options.path || '/';
        this.headers = options.headers || {};
        this.body = options.body || {};
        if (!this.headers['Content-Type']) { // 在HTTP协议中必须要有Content-Type这个协议的否则body不知道以何种方式进行解析
            this.headers['Content-Type'] = 'application/x-www-form-urlencoded';
        }

        // 如果数据类型是json
        // 常用的ContentType有四种
        // application/x-www-form-urlencoded - 原生表单
        // multipart/form-data - 常见的 POST 提交方式，通常表单上传文件时使用该种方式
        // application/json - 把其作为请求头，用来告诉服务器消息主体是序列化后的 JSON 字符串
        // text/xml - 该种方式主要用来提交 XML 格式的数据

        if (this.headers['Content-Type'] === 'application/json') {
            this.bodyText = JSON.stringify(this.body);
        } else if (this.headers['Content-Type'] === 'application/x-www-form-urlencoded') {
            this.bodyText = Object.keys(this.body).map(item => `${item}=${encodeURIComponent(this.body[item])}`).join('&');
        }
        this.headers['Content-Length'] = this.bodyText.length; // 当计算JSON格式化之后的数据时这里更像是在计算字符串的长度
    }

    send(connection) {
        return new Promise((resolve, reject) => {
            const parser = new ResponseParser();
            // 如果连接已经创建了，那么就在这个连接上把请求发出去
            if (connection) {
                connection.write(this.toString());
            } else {
                // 如果连接没有创建，就自行创建一个TCP连接，这里使用了net的createConnection方法
                connection = net.createConnection({
                    host: this.host,
                    port: this.port,
                }, () => {
                    connection.write(this.toString());
                })
            }
            connection.on('data', (data) => {
                console.log(data.toString());
                parser.receive(data.toString());
                if (parser.isFinished) {
                    resolve(parser.response);
                    // 关闭TCP连接
                    connection.end();
                }
            });
            connection.on('error', (err) => {
                reject('err is ', err);
                connection.end();
            });
        }).catch((err) => {
            console.error('error is ', err);
        });
    }

    toString() {
        // 此处以1.1版本为示例
        // 以普通的请求报文格式为例：
        // GET /index.html HTTP/1.1(回车符+换行符)
        // Host: 127.0.0.1(回车符+换行符)
        // Accept-Language: zh-cn(回车符+换行符)
        //
        // body正文
        return `${this.method} ${this.path} HTTP/1.1\r\n
        ${Object.keys(this.headers).map(key => `${key}: ${this.headers[key]}`).join('\r\n')}\r\n\r
        ${this.bodyText}`;
    }
}

class ResponseParser {
    constructor() {
        // HTTP/1.1 200 OK - status line
        // Content-Encoding: gzip - response head
        // Content-Type: text/html;charset=utf-8 - response head
        //
        //     <!DOCTYPE html>
        // <html lang="en">
        //     <head>
        //     <meta charset="UTF-8" />
        //     <title>Document</title>
        //     </head>
        //     <body>
        //     <p>this is http response</p>
        // </body>
        // </html>

        // status line会以\r\n做结尾
        this.WAITING_STATUS_LINE = 0; // 等待status line开始 也就是 HTTP/1.1 statusCode statusText这一行
        this.WAITING_STATUS_LINE_END = 1; // 等待status line结束，也就是\r\n
        this.WAITING_HEADER_NAME = 2; // 等待header kv行的key值，也就是类似于Content-Type:这样的name
        this.WAITING_HEADER_SPACE = 3; // 等待header kv行的name冒号后面的空格
        this.WAITING_HEADER_VALUE = 4; // 等待header kv行的value
        this.WAITING_HEADER_LINE_END = 5; // 等待header kv行一整行结束
        this.WAITING_HEADER_BLOCK_END = 6; // 等待header一整块数据结束
        this.WAITING_BODY = 7; // 等待body部分

        this.current = this.WAITING_STATUS_LINE;
        this.statusLine = '';
        this.headers = {};
        this.headerName = '';
        this.headerValue = '';
        this.bodyParser = null;
    }

    get isFinished () {
        return this.bodyParser && this.bodyParser.isFinished;
    }

    get response() {
        let statusCode = '';
        let statusText = '';
        this.statusLine.replace(/HTTP\/1.1 ([0-9]+) ([\s\S]+)/g, (match, p1, p2) => { 
            statusCode = p1;
            statusText = p2;
         });
        
        return {
            statusCode,
            statusText,
            headers: this.headers,
            body: this.bodyParser.content.join(''),
        };
    }

    receive(string) {
        console.log('string', string);
        for (let i = 0; i < string.length; i++) {
            this.receiveChar(string.charAt(i));
        }
    }

    receiveChar(char) {
        // 如果当前在等待status line开始
        // 如果下一个字符是\r则不会立即切换到等待header的状态，而是要继续等待一个\n的字符
        if (this.current === this.WAITING_STATUS_LINE) {
            if (char === '\r') {
                this.current = this.WAITING_STATUS_LINE_END;
            } else {
                // 如果当前字符不是\r回车符，那么就在statusLine上面叠加当前的字符
                this.statusLine += char;
            }
        } else if (this.current === this.WAITING_STATUS_LINE_END) {
            if (char === '\n') {
                this.current = this.WAITING_HEADER_NAME;
            }
        } else if (this.current === this.WAITING_HEADER_NAME) {
            if (char === ':') {
                this.current = this.WAITING_HEADER_SPACE;
            } else if (char === '\r') {
                // 如果在进入下一行的headerLine判断时直接遇到一个新空行，那么就说明整个header体已经结束
                this.current = this.WAITING_HEADER_BLOCK_END;
                // 当header块解析完毕之后，开始创建bodyParser
                // 在Node中默认了Transfer-Encoding的值就是chunked
                // 但实际上普通浏览器中的Transfer-Encoding可以是很多种类型，这里的if后面可以跟着很多的else if
                // 去进行分支的判断

                // 当服务器返回 Transfer-Encoding: chunked 时，表明此时服务器会对返回的包体进行 chunked 编码，
                // 每个 chunk 的格式如下所示：
                // ${chunk-length}\r\n${chunk-data}\r\n
                // ${chunk-length} 表示 chunk 的字节长度，使用 16 进制表示，${chunk-data} 为 chunk 的内容。
                // 比如咱们的 'hello world' 被进行chunk编码后，会是这样的一个body

                // b\r\n
                // hello world\r\n
                // 0\r\n\r\n

                if (this.headers['Transfer-Encoding'] === 'chunked') {
                    this.bodyParser = new TrunkedBodyParser();
                }
            } else {
                this.headerName += char;
            }
        } else if (this.current === this.WAITING_HEADER_SPACE) {
            if (char === ' ') {
                this.current = this.WAITING_HEADER_VALUE;
            } else {
                this.headerValue += char;
            }
        } else if (this.current === this.WAITING_HEADER_VALUE) {
            if (char === '\r') {
                this.current = this.WAITING_HEADER_LINE_END;
                // 更新headers中当前headerName的值
                this.headers[this.headerName] = this.headerValue;
                this.headerName = '';
                this.headerValue = '';
            } else {
                this.headerValue += char;
            }
        } else if (this.current === this.WAITING_HEADER_LINE_END) {
            if (char === '\n') {
                this.current = this.WAITING_HEADER_NAME;
            }
        } else if (this.current === this.WAITING_HEADER_BLOCK_END) {
            if (char === '\n') {
                // header和body 之间的空行仍旧是由\r\n组成的
                this.current = this.WAITING_BODY;
            }
        } else if (this.current === this.WAITING_BODY) {
            // 当处于WAITING_BODY的状态时，就全部将其塞给bodyParser的receiveChar去处理
            this.bodyParser.receiveChar(char);
        }
    }
}

class TrunkedBodyParser {
    constructor() {
        this.WAITING_LENGTH = 0;
        this.WAITING_LENGTH_LINE_END = 1;
        this.READING_TRUNK = 2;
        this.WAITING_NEW_LINE = 3;
        this.WAITING_NEW_LINE_END = 4;

        this.length = 0;
        this.content = [];
        this.isFinished = false;
        this.current = this.WAITING_LENGTH;
    }

    receiveChar(char) {
        if (this.current === this.WAITING_LENGTH) {
            // 当我们找到一个\r的时候，有可能是刚从header结束进入body前面的这一行空行，遇到了一个\r
            // 也有可能是body部分的某一行结束遇到了\r
            // 当length为0时说明我们遇到了一个长度为0的chunk，此时要告诉上一级的Parser我们的解析已经结束了
            if (char === '\r') {
                if (this.length === 0) {
                    this.isFinished = true;
                }
                this.current = this.WAITING_LENGTH_LINE_END;
            } else {
                // 由于这里的length是十六进制显示，所以这里如果要转换为真正的长度，需要乘以16
                // 且当前的char一定是一个长度值，所以将其以16进制的方式解析出来，然后加上当前的length即可
                this.length *= 16;
                this.length += parseInt(char, 16);
            }
        } else if (this.current === this.WAITING_LENGTH_LINE_END) {
            if (char === '\n' && !this.isFinished) {
                this.current = this.READING_TRUNK;
            }
        } else if (this.current === this.READING_TRUNK) {
            this.content.push(char);
            // this.length--;
            if (this.length > 0) {
                this.length --;
            }
            // this.length = this.length > 0 ? this.length-- : this.length; // 每解析一个字符就将当前的length减掉1，直到length为0时就说明当前的chunk解析结束了
            if (this.length === 0) {
                this.current = this.WAITING_NEW_LINE;
            }
        } else if (this.current === this.WAITING_NEW_LINE) {
            if (char === '\r') {
                this.current = this.WAITING_NEW_LINE_END;
            }
        } else if (this.current = this.WAITING_NEW_LINE_END) {
            if (char === '\n') {
                this.current = this.WAITING_LENGTH; 
            }
        }
    }
}
void async function() {
    let request = new Request({
        method: 'POST',
        host: '127.0.0.1', // 来自IP层
        port: '8088', // 来自TCP层
        path: '/',
        headers: {
            ['X-foo']: 'custom'
        },
        body: {
            name: 'ewl'
        },
    });
    let response = await request.send(); // send会返回一个promise
    console.log('response', response);
}()

```


![image.png](https://i.loli.net/2020/07/26/qAmpc3IhLZPDNH8.png)

