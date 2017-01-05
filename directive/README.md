
ng-init
该指令被调用时会初始化内部作用域。
这个指令一般会出现在比较小的应用中，比如给个demo什么的...
代码如下:
<div ng-init="job='fighter'">
    I'm a/an {{job}}
</div>


ng-disabled
像这种只要出现则生效的属性，我们可以在AngularJS中通过表达式返回值true/false令其生效。
禁用表单输入字段。
代码如下:
<textarea ng-disabled="1+1==2">1+1=?</textarea>

ng-readonly
通过表达式返回值true/false将表单输入字段设为只读。
弄个例子，3秒后变成只读.
代码如下:

<input type="text" ng-readonly="stopTheWorld" value="stop the world after 3s"/>
.run(function($rootScope,$timeout){
    $rootScope.stopTheWorld=false;
    $timeout(function(){
        $rootScope.stopTheWorld = true;
    },3000)
})
ng-checked
这个是给<input type="checkbox" />用的，比如...
代码如下:
<input type="checkbox" ng-checked="someProperty" ng-init="someProperty = true" ng-model="someProperty">
ng-selected
给<select>里面的<option>用的，例子:
代码如下:

<label>
    <input type="checkbox" ng-model="isFullStack">
    I'm Full Stack Engineer
</label>
<select>
    <option>Front-End</option>
    <option>Back-End</option>
    <option ng-selected="isFullStack">Full Stack !!!</option>
</select>

ng-show/ng-hide
根据表达式显示/隐藏HTML元素，注意是隐藏，不是从DOM移除，例如:
代码如下:

<div ng-show="1+1 == 2">
    1+1=2
</div>
<div ng-hide="1+1 == 3">
    you can't see me.
</div>

ng-cloak
ng-cloak也可以为我们解决FOUC。 ng-cloak会将内部元素隐藏，直到路由调用对应的页面。

ng-if
如果ng-if中的表达式为false，则对应的元素整个会从DOM中移除而非隐藏，但审查元素时你可以看到表达式变成注释了。
如果相进行隐藏，可以使用ng-hide。
代码如下:
<div ng-if="1+1===3">
    无法审查到该元素
</div>
<div ng-hide="1+1==2">
    可审查
</div>

ng-switch
单独使用没什么意思，下面是例子:
代码如下:

<div ng-switch on="1+1">
    <p ng-switch-default>0</p>
    <p ng-switch-when="1">1</p>
    <p ng-switch-when="2">2</p>
    <p ng-switch-when="3">3</p>
</div>

ng-repeat
不明白为毛不叫iterate，总之是遍历集合，给每个元素生成模板实例，每个实例的作用域中可以用一些特殊属性，如下:
代码如下:

$index
$first
$last
$middle
even
odd
不用特地解释，这些都很容易看出来是干什么的，下面是一个例子:
代码如下:

<ul>
    <li ng-repeat="char in
    [{'alphabet': 'K'},
    {'alphabet': 'A'},
    {'alphabet': 'V'},
    {'alphabet': 'L'},
    {'alphabet': 'E'},
    {'alphabet': 'Z'}] " ng-show="$even">{{char.alphabet}}</li>
</ul>

ng-href
起初我在一个文本域中弄了个ng-model，然后像这样<a href="{{myUrl}}">在href里面写了进去。
其实这样href和ng-href看不出什么区别，所以我们可以试试这样:

ng-src
大同小异，即表达式生效前不要加载该资源。
例子(ps: 图片不错! ):
代码如下:

<img ng-src="{{imgSrc}}"/>
.run(function($rootScope, $timeout) {
    $timeout(function() {
        $rootScope.imgSrc = 'https://octodex.github.com/images/daftpunktocat-guy.gif';
    }, 2000);
})

ng-class
用作用域中的对象动态改变类样式，例如:
代码如下:

<style>
    .red {background-color: red;}
    .blue {background-color: blue;}
</style>
<div ng-controller="CurTimeController">
    <button ng-click="getCurrentSecond()" >Get Time!</button>
    <p ng-class="{red: x%2==0,blue: x%2!=0}" >Number is: {{ x }}</p>
</div>
.controller('CurTimeController', function($scope) {
    $scope.getCurrentSecond = function() {
        $scope.x = new Date().getSeconds();
    };
})