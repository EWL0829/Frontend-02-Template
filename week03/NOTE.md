## 类型转换部分
#### JavaScript的类型

- Null
- Undefined
- Object(根据红宝书的说法，还包含了Array/Function/RegExp/Date)
- String
- Boolean
- Number
- Symbol

#### Undefined与Null

说到Undefined与Null，就要提到关键字<sup>[1]</sup>这个概念。

保留字（英文：Reserved word），有时也叫关键字（keyword），是编程语言中的一类语法结构。
保留字（关键字）本身是不能用作变量、函数名、过程和对象名的。

Null就是JavaScript的关键字，且Null这一数据类型仅有一个值，即Null，表示空值。我们可以借助Null关键字获得Null空值从而赋值给我们的变量，让该变量的值为Null，类型为Object<sup>[2]</sup>。(typeof Null返回Object并非意指Null是一个对象，它是一个primitive value，即原值，历史遗留问题不做赘述)
Undefined却并非关键字，这就说明我们可以为Undefined赋值，但是这是JavaScript语言设计的一个失误。每当一个变量被声明但未被赋值时，该变量的值就是Undefined，类型也是Undefined，并且Undefined这一数据类型也只有一个值，为Undefined。

具体到代码层面表示为：

```JavaScript
var foo;
typeof foo;       // "undefined"
console.log(foo); //  undefined
var boo = null;
typeof boo;       // "object"
console.log(boo); //  null
```

#### Boolean

布尔类型仅有两个值，true以及false，作为真假判断的依据，在此不做赘述。

#### String

string是字符串类型，用于表示文本数据，一旦创建就不能再修改内容，属于值类型。

> The length property of a String object indicates the length of a string, in UTF-16 code units.
> String对象的length属性以UTF-16<sup>[3]</sup>代码单位表示字符串的长度。

UTF-16是一种变长的2或4字节编码模式。对于BMP内的字符使用2字节编码，其它的则使用4字节组成所谓的代理对来编码。

上述这段话来自MDN,但是这段话成立的前提是我们使用单个的16位字符单元来表示大部分常用文本。假设我们使

用了两位16位字符单元来表示生僻字（以汉字为例，可称之为超出BMP-basic multilingual plane的字符）时，length属性就可能会出现偏差。ECMAScript2016第7版本里建立了字符串的最大长度为2^53 - 1，在此版本之前没有明确过最大长度。


#### Number

这里主要积累了几点JavaScript中较为特殊的几点：

- NaN
- -Infinity
- Inifinity

###### (1) NaN解惑

NaN的有一些让人印象深刻的特点，NaN属于Number类型，并且NaN与任何数字不相等，两个NaN之间也不相等，那么什么时候会出现NaN呢？英文翻译中NaN指Not a Number，这并非意指NaN不是个数字，而是用来表示在数字类型的限制内无法表示的数字。所以按这种说法来讲，在数字类型限制之外的数字是非常多的，NaN数字的值是不能保证相等的，这为NaN === NaN返回false提供了依据。

此外需要提及的是，JavaScript中的Number类型基本IEEE754-2008中的双精度浮点数规则，范围在-0x1fffffffffffff到0x1fffffffffffff，在此范围之外的Number类型就无法再进行表示了，即NaN。（By the way负数开根号所得到的虚数也是无法正常显示的，也是NaN）

###### (2) 小数的对比准确性

入门前端的时候就时常在一些博客中看到0.1 + 0.2 === 0.3返回false的示例，但仅仅止步于知其然而不知其所以然的水平。

首先，我们看一下计算机是如何表示浮点数的：

```PlainText
value = sign * exponent * fraction
```

value部分表示数值，符号（sign部分，表示符号0正，1负数），指数（exponent部分，表示指数位），和尾数（fraction部分，表示有效数字，大于等于1，小于2）。对于JavaScript来说，双精度浮点数的sign占1位，exponent部分占11位，fraction部分占52位。

--补充--

回到我们之前提出的 0.1 + 0.2 与 0.3 的准确性问题，难道在JavaScript中我们就没有方法去准确比较浮点数了吗？答案当然是否定的，JavaScript为我们提供了一个最小精度值Math.EPSILON该，该值表示JavaScript中的最小精度，对比方法如下：

```JavaScript
console.log(Math.abs(0.1 + 0.2 - 0.3) <= Number.EPSILON);
```

```Number.EPSILON```的值为2.220446049250313e-16，是一个非常小的值，如果比较的两个值差值比这个值还小，那就认定这两个值相等。

###### （3）正负零的区分判断

在JavaScript中有+0以及-0之分，这在加法类运算中并没有过多分别，但是在除法类运算中需要格外留意，当分母为+0出现错误时，返回的是+Infinity，分母为-0出现错误时，返回的是-Infinity，因此也可以通过判断Infinity的正负来判断是+0或者-0。

```JavaScript
var y1 = -0;
var y2 = 0；
var x1 = 1 / y1;
var x2 = 1 / y2;

console.log(x1);  //  Infinity
console.log(x2);  // -Infinity
```

#### Symbol

数据类型 “symbol” 是ES6新提出的一种原始数据类型，该类型的性质在于这个类型的值可以用来创建匿名的对象属性。该数据类型通常被用作一个对象属性的键值——当你想让它是私有的时候。

###### 类型特性：

(1) 可以将一个Symbol类型实例赋给一个左值变量，例如var foo = Symbol();
(2) 可以通过标识符检查类型

以上就是Symbol类型的全部特性，目的明确功能单一。

###### Symbol类型的小特点：

(1) Symbol类型不像其他Number类型可以使用其他操作符进行比较或者组合，对Symbol类型操作会报错。

```JavaScript
var symb = Symbol('aSymbol');
typeof symb;   // "symbol"

var symb2 = Symbol('anotherSymbol');
symb2 + symb;  // Uncaught TypeError: Cannot convert a Symbol value to a number at <anonymous>:2:7
```

由上述代码可以看出，该表达式甚至还没有执行到symb部分就已经报错，足可以说明使用这样的组合操作对于Symbol来说是完全行不通的。

(2) 即使两个Symbol实例拥有相同的字符串描述，但它们之间仍不相等，并且该字符串描述并不是必须的，添加描述的目的仅供调试。

```JavaScript
var a = Symbol('aaa'); 
var b = Symbol('aaa');

a === b; // false
a == b;  // false
```

(3) 从上述所有的代码中都能看出，创建一个Symbol类型的实例，并不像是其他类型一样通过new一个构造函数，而是直接调用一个Symbol函数创建。

一个具有数据类型“symbol”的值可以被称为“符号类型值”。在JavaScript运行时环境中，一个符号类型值可以通过调用函数Symbol()创建，这个函数动态地生成了一个匿名，唯一的值。

此外，在一些标准中我们其实已经已经接触过了Symbol，例如迭代器Symbol.iterator<sup>[4]</sup>，Symbol.search<sup>[5]</sup>
我们可以使用Symbol.iterator为对象添加遍历接口，使用Symbol.search为字符串提供搜索方法。

--补充详细的遍历器和搜索器的示例代码--

#### Object

JavaScript的类仅仅是运行时对象(v8引擎？)的一个私有属性，在JavaScript中不能自定义类型的，这与C++和Java是有区别的。

JavaScript中的基本类型，在Object中都有着对应的类型，例如：

- Number
- String
- Boolean
- Symbol

代码示例：

```JavaScript
var normalNum = 3;
var objNum = new Number(3);
typeof normalNum;  // "number"
typeof objNum;     // "object"

var normalString = '3';
var objString = new String('3');
typeof normalString; // "string"
typeof objString;    // "object"

var normalBool = false;
var objBool = new Boolean(false);
typeof normalBool;  // "boolean"
typeof objBool;     // "object"

var normalSymb = Symbol();
typeof normalSymb;  // "symbol"
```

要提及的一点是，Symbol类型与其他类型不同，并不能使用new来创建对象实例，Symbol()函数方法会直接构造一个Symbol实例，Symbol对象也仅仅是Symbol原始值的封装。那如果我们非得想做出一个Symbol对象怎么办呢？可以通过装箱的方式去包裹出一个Symbol对象来，后面会具体贴出代码。

--这里对于Symbol对象的使用仍旧存疑--

从以上代码中，我们可以尝试着去挖掘为什么基本类型可以去调用对象类型的方法。当我们在为基本类型调用对象类型的方法时.运算符为我们提供了一个临时对象，使得我们在基本类型上可以去调用对象类型的方法。

#### 类型转换

对于类型转换中这一部分我不会总结太多细节部分，仅将平时开发需要注意的一些点罗列。

首先，日常开发的时候尽量多使用显式转换以及===来完成相等判断。（这一点并非是因为不熟悉隐式转换的坑而逃避使用==，而是大部分人实际上都不能熟练记住隐式转换的细节，这么做无非是保证代码的可读性以及健壮性，但如果是个人项目，单纯为了炫技，这就无可非议了）
在===以及==之外还存在一些会导致隐式转换的操作符，例如> < >= <= + - * /等等。但实际上这些隐式转换的规则不算复杂，就算记不住，也可以查表，具体内容详见链接<sup>[6]<sup>。

#### 文章总结

本节的学习内容主要是将重学前端专栏里JavaScript中的类型部分拿出来重点记录一下，其中当属Symbol以及类型转换，数字以及字符长等内容最为重要，在知其然的前提下去挖掘其所以然，这对于我后续的深入学习显得尤为重要。

## 提升部分
#### 内容介绍
**JavaScript**
- 函数作用域、块级作用域
- 变量提升、函数提升

**CSS**
- 新增属性transition

----

#### (1) 函数作用域
函数作用域的含义就是属于这个函数的所有变量可以在整个函数的范围内使用以及复用。
在没有块级作用域出现的时候我们时常会使用函数作用域来包裹「隐藏」一些代码，可是为什么我们总是想要隐藏一些代码呢？这样做的原因是什么？在《你不知道的JavaScript》(上)一书中有这么一段话：
>为什么“隐藏”变量和函数是一个有用的技术？
有很多原因促成了这种基于作用域的隐藏方法。它们大都是从最小特权原则中引申出来的，也叫最小授权或最小暴露原则。这个原则是指在软件设计中，应该最小限度地暴露必要内容，而将其他内容都“隐藏”起来，比如某个模块或对象的API设计。

我们来看一段代码是如何体现最小暴露原则的：
```
function doSomething(a) {
    b = a + doSomethingElse( a * 2 );

    console.log( b * 3 );
}

function doSomethingElse(a) {
    return a - 1;
}

var b;

doSomething( 2 ); // 15
```
上述代码的前提是函数**doSomethingElse**以及变量**b**仅被**doSomething**使用，那么将这两个部分完全暴露在全局作用域中是不明智的做法，我们无法保证全局作用域中是否会有代码覆盖或者影响这两个部分的值。所以遵循最小暴露原则的做法，最佳实践应当是：
```
function doSomething(a) {
    function doSomethingElse(a) {
        return a - 1;
    }

    var b;

    b = a + doSomethingElse( a * 2 );

    console.log( b * 3 );
}

doSomething( 2 ); // 15
```

我们已经知道，在任意代码片段外部添加包装函数，可以将内部的变量和函数定义“隐藏”起来，外部作用域无法访问包装函数内部的任何内容。
根据上述这段话，我们可以实践一下：
```
var a = 2;

function foo() {
    var a = 3;
    console.log(a); // 3
}

foo();
console.log(a); // 2
```
虽然foo函数提供了一层很好的隔离，但是这样的做法未免稍显笨拙，且每次需要声明一个函数去污染全局作用域，在解决了一些问题的同时又带来了一些新问题，有没有更好的办法呢？JavaScript提供了一种方法：
```
var a = 2;

// 立即执行函数
(function foo() {
    var a = 3;
    console.log(a); // 3
})();

console.log(a); // 2
```
立即执行函数(**IIFE**)为中间的变量a初始化创建了一个独立于全局作用域的函数作用域，隔绝了内部与外部的两部分不同用途的变量**a**声明。有时候也可以换一种写法```(function() {}())```，这两种写法在功能上**完全一致**。
在了解了立即执行函数造成了隔离效应之后，我们来观察一下这里写法上的细节，这里的立即执行函数拥有一个函数名```foo```，那么这是一个真正的函数声明吗？我们来做个测试：
```
(function foo() {
  console.log('我是一个立即执行函数');
})();
console.log(foo); // guess what? 这里打印foo会返回一个引用错误，foo is not defined
```
上面代码的执行结果说明了一个问题，那就是立即执行函数并非是一个普通的函数声明，第一个括号中的内容相当于是一个函数表达式的声明，使用括号去包裹获取到该函数体，然后由第二个括号进行执行，完成一整个函数声明执行的过程。
函数声明和函数表达式之间最重要的区别是它们的名称标识符将会绑定在何处。比较一下前面两个代码片段。第一个片段中foo被绑定在所在作用域中，可以直接通过foo()来调用它。第二个片段中foo被绑定在函数表达式自身的函数中而不是所在作用域中，也就是说我们可以在foo函数内部去访问foo，但是不可以在外层的作用域中借助函数名称去访问，做个小测试：
```
(function foo() { 
  console.log('foo', foo);  // foo ƒ foo() { console.log('foo', foo); console.log('test') }
  console.log('test'); 
})();
```
**关于匿名函数表达式和具名函数表达式**
因为function()..没有名称标识符，这种写法被称为**匿名函数表达式**。函数表达式可以是匿名的，而函数声明则不可以省略函数名——在JavaScript的语法中这是非法的。虽然这样写显得简洁快速，但是它仍然存在一些缺点：
- 匿名函数在调用栈中不会有具体的函数名称，这让调试变得困难
- 如果没有函数名，在需要引用函数自身的时候只能借助过期的arguments.callee
- 代码的可读性变得比较差

关于调用栈再多说两句，对比下面两段代码的运行结果就能很明显看出具名和匿名的差别：
```
// 具名
setTimeout(function fn() {
      console.log('I want 1 second');
    }, 1000);

// 匿名
setTimeout(function () {
      console.log('I want 1 second');
    }, 1000);
```
调用栈内容：
![匿名函数.png](https://upload-images.jianshu.io/upload_images/7930564-32f25e37f785a989.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)
![具名函数.png](https://upload-images.jianshu.io/upload_images/7930564-14900f544d9c38fa.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

#### (2) 块级作用域
块级作用域其实就是词法作用域，我们的代码写在哪，就会在哪里执行，这更符合我们的编程习惯。我们常说的块包括函数内部 和 {}之间的部分。为了实现块级作用域，ES6使用let以及const来代替var声明变量。
我们可以通过两段代码来进行对比：
```
// var声明
var x = 1;
{
  var x = 2;
}
console.log(x); // 输出 2

// let声明
let x = 1;
{
  let x = 2;
}
console.log(x); // 输出 1
```
提到块级作用域就不得不提到一道非常经典的面试题，下列代码的打印结果会是什么样子？
```
var arr = [];
for (var i = 0; i < 10; i++) {
    arr[i] = function () { console.log('current', i) };
}
arr[0](); // 10
arr[1](); // 10
arr[9](); // 10
```
答案很简单，最终i是10，所以arr数组中的函数打印出的内容都是10，但是为什么呢？首先要考虑的是我们借助var声明i变量时，只会声明一次，后面不断自增1，所以当循环结束时i变量指向的值已经变成了10，而arr中的函数们只是简单指向了i变量，那么这时候i变量是10就打印出10了。回想前面的函数作用域的隐藏功能，我们是不是可以借助函数作用域形成的隔离作用改写这个例子以得出我们希望的结果：
```
var arr = [];
for (var i = 0; i < 10; i++) {
    (function(i) {
        arr[i] = function () { console.log('current', i) };
    })(i);
}
arr[0](); // 0
arr[1](); // 1
arr[9](); // 9
```
这个方法实际上就是借用了闭包，如果我们将匿名的立即执行函数改成具名的，并且打印出其参数，就可以得到arr每一个函数对象的作用域链，从而得知其中的原理，代码如下：
```
var arr = [];
    for (var i = 0; i < 10; i++) {
        (function foo(i) {
            console.log('foo的arguments', foo.arguments);
            arr[i] = function () { console.log('current', i) };
        })(i);
    }
    arr[0](); // 0
    arr[1](); // 1
    arr[9](); // 9
```
![image.png](https://upload-images.jianshu.io/upload_images/7930564-bb2af2cbc27dd166.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)
在加上立即执行函数的包裹后，arr中的每一个函数的作用域链都增加了一层立即执行函数的AO，并且立即执行函数上下文中的AO包含当前i的值，所以arr中的函数不会再向上（即全局上下文）查找，具体内容可以参考[此处](https://github.com/mqyqingfeng/Blog/issues/9)。

#### (3) 变量提升
根据MDN的一段描述，我们可以将变量提升理解为：
>从概念的字面意义上说，“变量提升”意味着变量和函数的声明会在物理层面移动到代码的最前面，但这么说并不准确。实际上变量和函数声明在代码里的位置是不会动的，而是在编译阶段被放入内存中。

然而随着JavaScript的标准不断更新，一些旧的规则已经不再适用，比如变量提升在let/const出现之后就开始显得没有那么值得关注了，当然在var时代它还是相当重要的一个知识点，所以接下来的学习内容，我们就基于let/const以及var这两个时代背景去阐述一下变量提升的前世今生。

以下示例来自[https://www.cnblogs.com/liuhe688/p/5891273.html](https://www.cnblogs.com/liuhe688/p/5891273.html)
下面的代码中，我们在函数中声明一个变量，但是函数声明是在if语句块中，第一次访问该变量却是在if判断括号中
```
// var版本
function hoistVariable() {
    if (!foo) {
        var foo = 5;
    }

    console.log(foo); // 5
}

hoistVariable(); // 不报错，正常打印出5

// let版本
function hoistVariable() {
    if (!foo) {
        let foo = 5;
    }

    console.log(foo); // 5
}

hoistVariable(); // 报错 d is not defined.
```

在var时代，预编译阶段结束后，代码中的某一个作用域中的变量声明会被提升到作用域的前端，比如上面var版本的代码在预编译后会变成：
```
function hoistVariable() {
    var foo;
    if (!foo) {
        foo = 5;
    }

    console.log(foo); // 5
}
```
这样看起来是不是就好理解多了，但是为什么let版本会报错呢？首先我们需要知道let时代出现了块级作用域并禁止了变量的提升，那么在一个变量声明之前去访问它，内存中并不能找到该变量，就自然会抛出一个变量未声明的错误。
接下来再看一个例子：
```
// var版
var foo = 3;

function hoistVariable() {
    var foo = foo || 5;

    console.log(foo); // 5
}

hoistVariable();

// let版
let foo = 3;

function hoistVariable() {
    let foo = foo || 5; // 报错，禁止在foo变量初始化之前就去访问

    console.log(foo);
}

hoistVariable();
```

上面let版本的报错似乎不太常见，相关的内容可以参考[https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Errors/Cant_access_lexical_declaration_before_init](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Errors/Cant_access_lexical_declaration_before_init)。为啥会出现这么一个错误呢？我们需要了解一个概念叫做「临时性死区」，所谓的临时性死区就是被let声明的变量在其声明未被执行之前的区域都称为临时性死区，举例如下：
```
function tempDeadZone() {
  console.log(foo); // undefined
  console.log(boo); // ReferenceError, Cannot access 'boo' before initialization
  var foo = 5;
  let boo = 1;
}
tempDeadZone();
```
上述代码中，在```let boo = 1;```之前的区域都算是boo变量的临时性死区，在临时性死区访问boo变量时boo的声明还未被执行即初始化尚未完成。了解了临时性死区之后，let不存在变量提升这个结论瞬间就变得水到渠成。

此外，let时代还出现了一个概念——块级作用域，这在var时代是没有的，下面这段代码就充分说明了块级作用域对变量提升的影响：
```
// var版
function hoistVariable() {
    var foo = 3;
    
    {
        var foo = 5; // 这里的花括号写与不写结果是一样的
    }

    console.log(foo); // 5
}

hoistVariable();

// let版
function hoistVariable() {
    let foo = 3;
    
    {
        let foo = 5; // 在let时代，花括号就意味着块级作用域
    }

    console.log(foo); // 3
}

hoistVariable();
```
上述代码中，let版本中的花括号包裹的部分我们可以将其理解为hostVariable函数自身作用域中又包了一层内部的作用域，根据前面我回顾过的作用域访问顺序，很明显，外部作用域是不能访问内部作用域的，那么花括号中的```let foo = 5```对于外层的```let foo = 3```不会造成重复声明或者是值覆盖的问题，所以这就是为什么最后结果是3而不是5的原因。

#### (4) 函数提升
所谓的函数提升，也就是在函数声明之前就去调用函数，例如下面这段代码：
```
function hoistFunction() {
    foo(); // output: I am hoisted

    function foo() {
        console.log('I am hoisted');
    }
}

hoistFunction();
```
引擎把函数声明提升到了当前作用域的前端，换种明了的写法就是：
```
function hoistFunction() {
    function foo() {
        console.log('I am hoisted');
    }
    foo(); // output: I am hoisted
}

hoistFunction();
```
如果出现多个相同名称的函数声明，那么最后一个会覆盖前面的，例如：
```
function hoistFunction() {
    function foo() {
        console.log('I am hoisted');
    }

    foo(); // output: I am hoisted

    function foo() {
        console.log('I am hoisted again');
    }

    function foo() {
        console.log('This is the third time that I am hoisted');
    }
}

hoistFunction(); // 'This is the third time that I am hoisted'
```
函数的声明方式实际上不止上述这一种，还包括匿名函数表达式以及具名函数表达式，这几种方式在函数提升上面是有一些差异的。
先看一个简单的示例：
```
hoistFunction(); // TypeError,  hoistedFunction is not a function
var hoistedFunction = function () {
  console.log('hoisted first time');
};
```
其实上述的匿名函数表达式就相当于是一个变量声明，换一种写法就是：
```
var hoistedFunction; // 此时的hoistedFunction 被初始化成了undefined
hoistedFunction(); // 误将undefined作为函数调用会报TypeError
hoistedFunction = function() {
  console.log('hoisted first time');
}
```
接下来，我们再看一个稍微复杂的示例，如果将函数表达式和函数声明混写会发生什么呢：
```
function hoistFunction () {
    foo();
    var foo = function() {
      console.log('这是第一个foo声明');
    };

    foo();
    function foo() {
      console.log('这是第二个foo声明');
    }

    foo();
}

hoistFunction();
```
结果输出是：
```
这是第二个foo声明
这是第一个foo声明
这是第一个foo声明
```
为什么会是这么一个结果呢？我们可以站在编译器的角度来看一下上面那段代码，首先```var foo```会被提升，其次```function foo() { ... }```整个函数声明也会提升，那么形成的结果就会变成下面这个样子：
```
function hoistFunction () {
    // 被提升上来的foo函数表达式声明
    var foo;
    function foo() {
      console.log('这是第二个foo声明');
    }

    foo(); // 此时调用了函数foo，且同时存在一个值为undefined的变量foo

    foo = function() {
      console.log('这是第一个foo声明');
    }; // 将已经声明过的foo初始化为function () { console.log('这是第二个foo声明'); }

    // 以下两次调用都是指向上面这个匿名函数的foo变量
    foo();
    foo();
}

hoistFunction();
```
那如果我们再绕一圈，将上面代码中的函数声明和函数表达式对换位置，又会得到一个什么样的结果呢？
```
function hoistFunction () {
    foo();

    function foo() {
      console.log('这是第二个foo声明');
    }

    foo();
    
    var foo = function() {
      console.log('这是第一个foo声明');
    };

    foo();
}

hoistFunction();
```
先给出结果：
```
这是第二个foo声明
这是第二个foo声明
这是第一个foo声明
```
照着之前的思路再来整理一遍代码，将其写成预编译后的格式：
```
function hoistFunction () {
    // 被提升的部分
    function foo() {
      console.log('这是第二个foo声明');
    }
    var foo;

    // 两次调用foo，打印出两个"这是第二个foo声明"
    foo();
    foo();
    
    foo = function() {
      console.log('这是第一个foo声明');
    };
    // 调用指向上面匿名函数的foo函数变量
    foo();
}

hoistFunction();
```

#### (5) 哪个提升优先级更高
那到这里，还需要思考一个问题，在变量提升和函数提升里，哪一个级别更高？我们来看一段代码：
```
function testHoistLevel() {
    var foo = 123;
    function foo () {
      console.log('foo');
    }
    console.log('当前的foo'， foo);
}
testHoistLevel();
```

猜测结果是什么呢？打印出来的结果是函数还是123呢？先看一下结果：
![image.png](https://upload-images.jianshu.io/upload_images/7930564-eec97641744dd7e5.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)
结果很让人惊讶，居然是123，难道函数声明会被提升到变量声明的前面？此时还是不够明确，那我们可以对函数声明和变量声明对换位置试试，代码如下：
```
function testHoistLevel() {
    function foo () {
      console.log('foo');
    }
    var foo = 123;
    console.log('当前的foo', foo);
}
testHoistLevel();
```
运行结果：
![image.png](https://upload-images.jianshu.io/upload_images/7930564-98c1c0a46f4bad54.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

两次的运行结果完全一致，但是我仍然还是有些疑惑，因为下面还有这几类情况将情况变得复杂起来了：
```
// 第一种
test(); // 'test func'
function test() {
  console.log('test func');
}
var test = 123;

// 第二种
function test() {
  console.log('test func');
}
test(); // 'test func'
var test = 123;

// 第三种
function test() {
  console.log('test func');
}
var test = 123;
test(); // TypeError test is not a function

// 第四种
var test = 123;
function test() {
  console.log('test func');
}
test(); // TypeError test is not a function

// 第五种
var test = 123;
test(); // TypeError test is not a function
function test() {
  console.log('test func');
}

// 第六种
test(); // 'test func'
var test = 123;
function test() {
  console.log('test func');
}
```
我们可以站在预编译的角度去试想一下代码的结果，顺便我会在这里给出预编译后这六种情况的代码（代码均为简写，主要观察代码编译后的顺序）：
```
// 第一种
funciton test() { ... }
var test;
test();
test = 123;

// 第二种
function test() { ... }
var test;
test();
test = 123;

// 第三种
function test() { ... }
var test;
test = 123;
test();

// 第四种
function test() { ... }
var test;
tets = 123;
test();

// 第五种
function test() { ... }
var test;
test = 123;
test();

// 第六种
function test() { ... }
var test;
test();
test = 123;
```
在看了上面那么多例子之后，我又翻了很多资料，后来得出这样几点结论：
- 在提升的优先等级上，函数声明比变量声明高，所以最终预编译的结果函数总是在变量前面
- 当变量标识符和函数标识符同名时，变量仅仅是声明了而没有被赋值，即该变量并未指向任何有意义的值，但是函数声明却已经完成了所有步骤等待执行而已，所以如果在获取标识符之前，我们完成了对变量的赋值，那么变量一定会覆盖函数声明，相反如果我们并未对变量赋值，那么我们获取到的就会是函数声明(此处结论参考了stackoverflow上的一个[回答](https://stackoverflow.com/questions/40675821/what-happens-when-javascript-variable-name-and-function-name-is-the-same))

#### (6) 为什么要有提升？
在看了一些文章后，关于提升出现的原因，我总结出了以下几点结论：
- 良好的容错性
- 声明提升可以提高性能

根据师兄的博客中提到的设计初衷，变量提升是人为实现的问题，而函数提升在当初设计时是有目的的。
>**关于变量提升的设计初衷:**由于第一代JS虚拟机中的抽象纰漏导致的，编译器将变量放到了栈槽内并编入索引，然后在（当前作用域的）入口处将变量名绑定到了栈槽内的变量。换句话说就是，在刚进入当前作用域时，将当前作用域中所有的变量声明也就是```var xxx```这样的字眼，全部提升到当前作用域的前端，然后为其赋一个初始值undefined，结束这项工作后就开始逐行执行。

>**关于函数提升的设计初衷:**Brendan Eich很确定的说，函数提升就是为了解决相互递归的问题，大体上可以解决像ML语言这样自下而上的顺序问题。

#### (7) 最佳实践
无论是变量还是函数，遵循先声明后使用的规则。既然有会发生变量提升的关键字，那么有没有用不会发生变量提升的关键字呢？答案是肯定的，我搜集了一下，罗列如下：
- 变量/函数赋值
- ```const``` 以及 ```let``` 声明
- ```class``` 声明
- 代码块
- 函数调用


[1] [JavaScript全部保留字](http://www.runoob.com/js/js-reserved.html)

[2] [typeof Null为什么会返回object](http://2ality.com/2013/10/typeof-null.html)

[3] [关于编码的一些内容](https://my.oschina.net/goldenshaw/blog/310331)

[4] [关于Symbol.search](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Symbol/search)

[5] [关于Symbol.iterator](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Symbol/iterator)

[6] [关于类型转换](http://javascript.ruanyifeng.com/grammar/conversion.html)

[7] [W3School关于变量提升的解释](https://www.w3schools.com/js/js_hoisting.asp)

[8] [advance javascript why hoisting](https://medium.com/@sidhujaspreet963/advance-javascript-why-hoisting-3db74309e674)

[9] [MDN-块级作用域](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Statements/block)
