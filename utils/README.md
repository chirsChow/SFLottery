$cacheFactory与缓存对象

$cacheFactory是一个为Angular服务生产缓存对象的服务。
要创建一个缓存对象，可以使用$cacheFactory通过一个ID和capacity。
其中，ID是一个缓存对象的名称，capacity则是描述缓存键值对的最大数量。

$cacheFactory(cacheId, [options]);

var myCache = $cacheFactory('myCache');

其中，缓存对象拥有以下几种方法

1. myCache.info() 返回缓存对象的ID，尺寸和选项

2. myCache.put() 新值键值对并放入缓存对象中 myCache.put("name", "Ben")

3. myCache.get() 返回对应的缓存值，若没有找到则返回undefined myCache.get("name")

4. myCache.remove() 把键值对从对应缓存对象中移除 myCache.remove("name")

5. myCache.remvoeAll() 清空该缓存对象

angular.bind(self, fn, args)
作用：返回一个新的函数，绑定这个函数的this指向self
参数：

self：新函数的上下文对象
fn：需要绑定的函数
args：传递给函数的参数
返回值：this指向self的新函数
var obj = {
    name: 'xxx',
    print: function (country) {
        console.log(this.name + ' is form ' + country);
    }
};

var self = {
    name: 'yyy'
};


var bindFn = angular.bind(self, obj.print, 'China');
//var bindFn = angular.bind(self, obj.print, ['China']);

obj.print('American'); //$ xxx is form American
bindFn(); //$ yyy is form China
注意：bind会根据你的参数类型来决定调用call或apply，所以args可以是一个个数据，也可以是一个数组哦。
angular.copy(source, [destination])
作用：对象的深拷贝
参数：

source：源对象
destination：拷贝的对象
返回值：拷贝的对象
var obj = {
    name: 'xxx',
    age: 50
};


var copyObj = angular.copy(obj);

console.log(copyObj); //$ Object {name: "xxx", age: 50}
angular.equals(o1, o2)
作用：正常比较和对象的深比较
参数：

o1：比较的对象
o2：比较的对象
返回值：boolean
angular.equals(3, 3); //$ true
angular.equals(NaN,NaN); //$ true
angular.equals({name:'xxx'},{name:'xxx'}); //$ true
angular.equals({name:'xxx'},{name:'yyy'}); //$ false
angular.extend(dst, src)
作用：对象的拓展
参数：

dst：拓展的对象
src：源对象
返回值：拓展的对象
var dst = {name: 'xxx', country: 'China'};
var src = {name: 'yyy', age: 10};

angular.extend(dst, src);

console.log(src); //$ Object {name: "yyy", age: 10}
console.log(dst); //$ Object {name: "yyy", country: "China", age: 10}
angular.forEach(obj, iterator, [context])
作用：对象的遍历
参数：

obj：对象
iterator：迭代函数
context：迭代函数中上下文
返回值：obj
var obj = {name: 'xxx', country: 'China'};

angular.forEach(obj, function (value, key) {
    console.log(key + ':' + value);
});

//$ name:xxx
//$ country:China

var array = ['xxx', 'yyy'];

angular.forEach(array, function (item, index) {
    console.log(index + ':' + item + ' form ' + this.country);
}, obj);

//$ 0:xxx form China
//$ 1:yyy form China
angular.fromJson(string)
作用：字符串转json对象
参数：

string：字符串
返回值：json对象
var json = angular.fromJson('{"name":"xxx","age":34}');

console.log(json); //$ Object {name: "xxx", age: 34}
angular.toJson(json,pretty)
作用：json对象转字符串
参数：

json：json
pretty：boolean number 控制字符串输出格式
返回值：字符串
angular.toJson({name:'xxx'});
//$ "{"name":"xxx"}"

angular.toJson({name:'xxx'},true);
//$ "{
//$    "name": "xxx"
//$ }"

angular.toJson({name:'xxx'},10);
//$ "{
//$            "name": "xxx"
//$ }"
angular.identity(value)
作用：返回这个函数的第一个参数
参数：

value：参数
返回值：第一个参数
console.log(angular.identity('xxx','yyy')); //$ xxx
angular.isArray(value)
作用：判断一个数据是否是数组
参数：

value：数据
返回值：boolean
angular.isArray(3); //$ false
angular.isArray([]); //$ true
angular.isArray([1, 2, 3]); //$ true
angular.isArray({name: 'xxx'}); //$ false
angular.isDate(value)
作用：判断一个数据是否是Date类型
参数：

value：数据
返回值：boolean
angular.isDate('2012-12-02'); //$ false
angular.isDate(new Date()); //$ true
angular.isDefined(value)
作用：判断一个数据是否是defined类型
参数：

value：数据
返回值：boolean
angular.isDefined(undefined) //$ false
angular.isDefined([]); //$ true
angular.isUndefined(value)
作用：判断一个数据是否是undefined类型
参数：

value：数据
返回值：boolean
angular.isUndefined(undefined) //$ true
angular.isUndefined([]); //$ false
angular.isFunction(value)
作用：判断一个数据是否是函数
参数：

value：数据
返回值：boolean
angular.isFunction(function(){}); //$ true
angular.isFunction(3); //$ false
angular.isNumber(value)
作用：判断一个数据是否是Number类型
参数：

value：数据
返回值：boolean
angular.isNumber(4); //$ true
angular.isNumber('xxx'); //$ false
angular.isNumber(new Number(4)); //$ false
angular.isNumber(Number(4)); //$ true
angular.isObject(value)
作用：判断一个数据是否是对象
参数：

value：数据
返回值：boolean
angular.isObject('xxx'); //$ false
angular.isObject(null); //$ false
angular.isObject([]); //$ true
angular.isObject(function(){}); //$ false
angular.isObject({name:'xxx'}); //$ true
angular.isString(value)
作用：判断一个数据是否是字符串
参数：

value：数据
返回值：boolean
angular.isString(4); //$ false
angular.isString('xxx'); //$ true
angular.isString(new String('xxx')); //$ false
angular.isString(String('xxx')); //$ true
angular.lowercase(string)
作用：将字符串大写字母变小写
参数：

string：字符串
返回值：改变后的新字符串
var newString = angular.lowercase('XXyyZZ');
console.log(newString); //$ xxyyzz
angular.uppercase(string)
作用：将字符串小写字母变大写
参数：

string：字符串
返回值：改变后的新字符串
var newString = angular.uppercase('XXyyZZ');
console.log(newString); //$ XXYYZZ
angular.noop()
作用：空函数
var flag = false;
flag ? console.log('xxx') : angular.noop();