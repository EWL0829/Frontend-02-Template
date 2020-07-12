# Week02

## JavaScript语言通识

### 语言

- 泛用语言分类方法

	- 乔姆斯基谱系

		- 0型-无限制文法
		- 1型-上下文相关文法
		- 2型-上下文无关文法
		- 3型-正则文法

- 命令式编程语言的设计方式

	- 声明式

		- 倾向于使用描述what的方式去完成代码功能

	- 命令式

		- 倾向于使用描述how的方式去完成代码功能

	- 示例：

let movies = [
  { title: 'The Shawshank Redemption', rating: 9.6 },
  { title: 'Forrest Gump', rating: 9.4 },
  { title: 'Roman Holiday', rating: 8.9 }
]

// 命令式
const imperativeMovieFilter = (movies) => {
  let result = []
  for (let i = 0; i < movies.length; i++) { 
    if (movies[i].rating >= 9) {
      result.push(movies[i])
    }
  }
  return result
}

// 声明式
const declarativeMovieFilter = (movies) => {
  return movies.filter((movie) => movie.rating >= 9)
}

参考：https://blog.csdn.net/longzhoufeng/article/details/78802836

### 产生式

- 定义

	- 巴科斯诺尔范式是一种用于表示上下文无关文法的语言，上下文无关文法描述了一类形式语言。它是由约翰·巴科斯（John Backus）和彼得·诺尔（Peter Naur）首先引入的用来描述计算机语言语法的符号集。

- 结构与特征

	- 尖括号内名称表示语法结构名
	- 语法结构

		- 基础结构：终结符
		- 复合结构：非终结符，由其他语法结构组合定义
		- 差异：终结符不可继续拆分，而非终结符则可以继续细化拆分直到拆为不可继续拆分的终结符

	- 引号与中间的字符为终结符
	- 可以有括号
	- *表示重复多次
	- |表示或者
	- +表示至少一次

- 借助产生式理解乔姆斯基谱系

	- 无限制文法

		- ? ::= ? 左右都可以随意书写多个非终结符

	- 上下文相关文法

		- ?<A>? ::=?<B>? 虽然左右都可以书写多个非终结符，但是必须要有先后关系，比如A左侧的?必须为不变的部分，右侧的?则为可变的部分，其中存在一个确定的先后依赖关系，这里我个人的理解是类似于定义域与值域的关系，必须有一个确定的传入值才会产生一个确定的输出值，否则这个前后关系不明确时无法得到一个准确的语义

	- 上下文无关文法

		- <A> ::= ? 左侧只能有一个非终结符，右侧则可以随意书写

	- 正则文法

		- <A> ::= <A>? 右侧的问号部分是不可以放在右侧的开头部分的，尤其是遇上递归这种情况

	- 以上?表示终结符

### 现代语言的分类

- 用途分类

	- 数据描述语言

		- HTML/CSS/JSON/SQL/XAML

	- 编程语言

		- C/C++/C#/Java/Python/Perl/Lisp/Ruby/T-SQL/Clojure/Haskell/JavaScript

- 表达方式

	- 声明式语言

		- JSON/HTML/XAML/SQL/CSS/Lisp/Clojure/Haskell

	- 命令式语言

		- C/C++/C#/Java/Python/Ruby/Perl/JavaScript

### 编程语言的性质

- 图灵完备性表达方式

	- 命令式（图灵机）

		- goto
		- if和while

	- 声明式（Lamda）

		- 递归

	- 参考：https://zh.wikipedia.org/wiki/%E5%9C%96%E9%9D%88%E5%AE%8C%E5%82%99%E6%80%A7

- 图灵完备性定义：在可计算性理论里，如果一系列操作数据的规则（如指令集、编程语言、细胞自动机）可以用来模拟任何图灵机，那么它是图灵完备的。
- 动态与静态语言

	- 动态

		- 在用户的设备/在线服务器上
		- 在产品实际运行时
		- RunTime
		- 特征：在做类型检查时，只有在运行时才能确定变量类型，例如：我们使用JavaScript去编写代码时，可以随意地改变一个变量的类型，而只有当代码运行时才能去判断这个变量的最终类型，这样的灵活性也埋下了一些在类型判断上的隐患

	- 静态

		- 在程序员的设备上
		- 产品开发时
		- CompileTime
		- 特征：在做类型检查时，在编写时就可以进行类型检查了

### 一般命令式语言

- 层级划分

	- Atom（原子）

		- Identifier（关键字）
		- Literal（直接量）

	- Expression（表达式）

		- Atom
		- Operator（运算符）
		- Punctuator（标点符号）

	- Statement（语句）

		- Expression
		- Keyword（关键字）
		- Punctuator

	- Structure（结构）

		- Function（函数）
		- Class（类）
		- Process（过程，像PASCAL这种古老的语言会有）
		- NameSpace（命名空间）

	- Program

		- Program（实际执行的代码，在JavaScript中严格区分Program与Module）
		- Module（模块）
		- Library
		- Package（在Java中有使用）

## JavaScript类型

### Number

- IEEE 754标准 64位双精度浮点数

	- 符号位（S）

		- 值为1表示负值
		- 值为0表示正值

	- 指数（E）
	- 有效数字（F）
	- 表示方式:
数值等于符号位（sign bit）乘以指数偏移值(exponent bias)再乘以分数值(fraction)。
	- 实际的数字转换练习：
========整数练习========
将20转换为双精度浮点数的二进制形式：
21 = 16 + 4 + 1
转为二进制：10101
改为二进制小数表示：1.0101 * 2^4
- 此处符号位为0，表示正值
- 此处的指数为4，双精度的偏移值为1023（2^10 - 1）加和为1023 + 4 = 1027，1027转为二进制表示10000 0000 11（11位）
- 此处的有效数字为0101，加上隐藏位1则最终有效数字部分为11000000000000000000000000000000000000000000000000000（53位）

	- 定义参考：https://zh.wikipedia.org/wiki/IEEE_754

- 进制

	- 十进制
	- 二进制

		- 0b开头

	- 八进制

		- 0o开头

	- 十六进制

		- 0x开头

	- 一个特例：0.toString()此处的点运算符会因为解析成小数点而导致调用不成功，所以必须在点前面加上空格

### String

- 基本概念

	- Character(字符)

		- 例如'a'就是一个单独的字符

	- Encoding(编码)

		- 例如01100001是'a'的编码，实际上这就是码点表示数的一个存储方式

	- Code Point(码点)

		- 例如97就是'a'在unicode字符集中的一个码点表示数，属于既定的规则

- 常见的一些字符集

	- ASCII

		- 单字节字符合集，长度仅为00-7F，共127个字符，仅针对英文可用，遇到中文等语言则需要扩充，因此衍生出了一系列的字符集

	- Unicode

		- 集合全世界的字符，使用分段分层的方式分配码点字段，例如常见的基本中文汉字分段为4E00-9FA5，参考https://www.qqxiuzi.cn/zh/hanzi-unicode-bianma.php

	- UCS

		- 通用字符集，由ISO制定的ISO 10646（或称ISO/IEC 10646）标准所定义的字符编码方式，采用4字节编码。

	- GB

		- GB2312
		- GBK(GB13000)
		- GB18030

	- ISO8859

		- 东欧地区使用

	- BIG5

		- 台湾地区使用

- 常见的编码方式

	- UTF-8

		- 1-4字节表示一个字符

	- UTF-16

		- 2-4字节表示一个字符

	- UTF-32

		- 4字节表示一个字符

	- UTF-8 1-4字节的编码方式，老师在课堂中提到前面的1110里有几个1代表占据几个字节，由下方的表可以看出，第一行就对应了ASCII码表中单字节

====================开始====================


Unicode符号范围     |        UTF-8编码方式
(十六进制)        |              （二进制）
----------------------+---------------------------------------------
0000 0000-0000 007F | 0xxxxxxx（单字节）
0000 0080-0000 07FF | 110xxxxx 10xxxxxx（双字节）
0000 0800-0000 FFFF | 1110xxxx 10xxxxxx 10xxxxxx（三字节）
0001 0000-0010 FFFF | 11110xxx 10xxxxxx 10xxxxxx 10xxxxxx（四字节）


====================结束====================


上述表中除了x之外的部分都属于控制位，在UTF-16中也是一样的道理，如果字符太多，当前的字节数表示不了时也会出现和UTF-8一样的控制位



- 语法部分

	- 字符串模板
	- 普通字符

		- 单引号字符
		- 双引号字符

### 其他类型

- Boolean

	- 表示真与假

- Null

	- Null表示有值，但是值为空，并且Null是一个关键字而Undefined则不是,undefined只是一个全局变量，故我们可以去访问一下window.undefined


==============开始==============
var null = 123; // Uncaught SyntaxError: Unexpected token 'null'

// 全局作用域的undefined与局部作用域的undefined
var undefined = 123;
console.log(undefined); // 此处的赋值操作可以成功，但是undefined的值不会被覆盖，打印值仍然为undefined

function test() {
    var undefined = 123;
    console.log('undefined', undefined);
    return undefined;
}

console.log(test()); // 打印出 'undefined 123' '123' // 此处的赋值操作成功，test作用域中的undefined的值被完全覆盖掉了

==============结束==============
	- typeof Null返回值是Object属于语言设计bug

- Object
- undefined

	- 表示没有赋值，无定义

		- 在上面的例子中window.undefined不能被赋值的原因是undefined作为window的一个属性，它是一个只读属性，不可配置不可写，我们可以使用Object.getOwnPropertyDescriptor来查看该对象属性的数据属性(value/writable/enumerable/configurable)

	- 如何安全的表示undefined

		- void 0，void运算符本身是一个关键字，且无论其后的表达式是什么，它所进行的运算都会将后面的表达式值改为undefined

- Symbol

	- JavaScript中特有的概念，专用于Object的属性名

## JavaScript对象

### 对象的基础知识

- Object

	- 三个核心要素

		- 唯一性标识
		- 状态
		- 行为

			- Tip: 如果一个方法并没有改变自身状态，那么这实际上不属于行为

	- 描述方式与流派

		- 使用类Class来描述

			- 分类（单继承，有一个基类Object，其他的）

				- 将所有的个体都抽象为一个基础类，然后在基础类上去添加个体化的内容和特性

			- 归类（多继承，如C++）

				- 在不同的个体间获取共性，将其抽象为类，而在类中获取共性，将其抽象为更高级的抽象类

		- 使用Prototype原型来描述

			- 

	- 任何一个对象都是唯一的，即便他们的状态相同，他们也是完全独立的个体，状态用于描述对象，状态的改变即是对象的行为

### JavaScript中的对象

- 原生对象的描述只需要关心属性以及原型

	- Property

		- Tip:这里需要明白Property一般偏向指代对象上的普通属性，像数据属性和访问器属性，我们使用Attribute来描述，表示特征值
		- 数据属性

			- Value
			- Enumerable
			- Writable

				- 即使设置为false，仍可以借助defineProperty来强制改为true，使得属性可改写，而Configurable则不可以

			- Configurable

		- 访问器属性

			- set
			- get
			- Enumerable
			- Configurable

	- Prototype

		- 如果我们要从一个对象上去获取某一个属性或方法，那么寻找的过程会先从对象本身找起，如果没有找到，则寻找的动作会延伸到该对象的原型上，如果再找不到则延伸到原型的原型上，一直到null（原型链的顶端），之后便停止查找，这就是原型链

- API/Grammer

	- {}/./[]/Object.defineProperty
	- Object.create/Object.setPrototypeOf/Object.setPrototypeOf
	- new/class/extends


-----
![Week02.png](https://i.loli.net/2020/07/12/ALCGqocr8l2ExKJ.png)
