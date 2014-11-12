// 今天看了rank的一篇javascript脚本控件topic， 突然想总结一下一些写JS组件的方法， 或者说一些不同人的不同coding style。

// 　　 首先看下Prototype里的写法：　　 复制代码 代码如下:

	　　
	var Class = {
		create: function() {
			return function() {
				this.init.apply(this, arguments);
			}
		}
	}
var A = Class.create();
A.prototype = {
	init: function(msg) {
		this.msg = msg;
	},
	fn: function() {
		alert(this.msg);
	}
}
var a = new A("myMsg");
a.fn();


// 如果你不喜欢上面这一大堆Class.create之类的， 你也可以这样：　　 复制代码 代码如下:

	　　 function A() {} //var A = function(){} 
A.prototype = {
	init: function(msg) {
		this.msg = msg;
	},
	fn: function() {
		alert(this.msg);
	}
}
var a = new A();
a.init("myMsg");
a.fn();


// 当然， 也可以把this.msg的初始化放到
function A(msg) {
	this.msg = msg;
}
// 里。 总之你会发现这样调用很麻烦， 并且参数是固定对应好的。　　 你如果既不愿搞一大堆Class.create， 也不愿调用不方便， 那就把Prototype里的var Class = {...
}
// 和
var A = Class.create();
// 合并起来。 得到：　　 复制代码 代码如下:

	　　 function A() {
		this.init.apply(this, arguments);
	}
A.prototype = {
	init: function(msg) {
		this.msg = msg;
	},
	fn: function() {
		alert(this.msg);
	}
}
var a = new A("myMsg");
a.fn();


// 看上去干净了许多， 但是如果你的库里有很多组件， 则每个组件都要写一遍this.init.apply(this, arguments);
// 如果用Class.create的话， 则只要写一个Class， 然后每个组件执行下Class.create() 即可。 当然， 每个组件都写一遍this.init.apply(this, arguments);
// 也没啥不好的， 还是看个人喜好了。 另外写原型方法是合在一起还是分开来写也是个人喜好， 出于封装的角度， 合一起好， 但是分开有时候显的更清晰。 譬如A.prototype.init = function(msg) {...
}
A.prototype.fn = function() {...
}

　　
// 然后还有人喜欢这样去写组件：　　 复制代码 代码如下:

	　　var A = function(msg) {
		this.msg = msg;
		var _this = this;
		var privateFn1 = function() {
			alert(_this.msg);
		}
		var privateFn2 = function() {
			alert(_this.msg);
		}
		return {
			fn1: privateFn1,
			fn2: privateFn2
		};
	}
var a = new A("myMsg");
a.fn1();


// 这边一定要把A构造的对象this放到临时变量_this中哦， 因为运行时， privateFn1的函数体内this实际是
 {
	fn1: ...,
	fn2: ...
}
这样的匿名对象， 你可以用this.hasOwnProperty("fn1") 去测试。 this是在运行时才有意义的一个东西。 另外这种方法每个对象都会有privateFn1 和 privateFn2的副本， 这种方法不太好。

　　（ 未完待续， 下面会讲些不同框架的一些写法）
作者： JayChow