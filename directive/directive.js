define(function (require) {
    var app = require('../app');
    app
        .directive('headTitle', ['$timeout', 'utils', function ($timeout, utils) {
            return {
                restrict: 'AE',
                scope: {
                    showBackbtn: '@',//返回按钮是否显示true false
                    backTitle: '@',//"返回"按钮名称
                    appTitle: '@',//当前页面标题
                    finishTitle: '@',//"完成"按钮名称
                    goBack: '&',//返回事件
                    finishGo: '&',//完成
                    theme: '@'
                },
                replace: true,
                template: '<header class="header tc" ng-class="theme">' +
                '<span class="icon-font btn-prev" ng-click="goBack()">&#xe600;</span>' +
                '<h1 ng-bind="appTitle"></h1>' +
                '<span class="btn-next" ng-click="finishGo()" ng-bind="finishTitle"></span>' +
                '</header>',
                link: function ($scope) {
                    if (utils.browser().weChat) {
                        if (utils.browser().android) {
                            document.title = $scope.appTitle;
                        } else {
                            //js修改iOS微信浏览器的title标签
                            document.title = $scope.appTitle;
                            var i = document.createElement('iframe');
                            i.src = 'favicon.ico';
                            i.style.display = 'none';
                            i.onload = function () {
                                $timeout(function () {
                                    i.remove();
                                }, 10);
                            };
                            document.body.appendChild(i);
                        }
                        document.getElementsByTagName("section")[0].style.paddingTop = "0";
                        document.getElementsByTagName("header")[0].remove();
                    }
                }
            }
        }])
        /* Loading 遮罩层 */
        .directive('loading', function () {
            return {
                restrict: 'AE',
                template:
                '<div class="cg-busy-default-wrapper" ng-show="loading">' +
                    '<div ng-class={"cg-busy-mask":loadingTips}></div><div class="cg-busy-default-sign">' +
                        '<div class="cg-busy-default-spinner">' +
                            '<img src="images/loading.gif" alt="loading" />' +
                            '<p ng-bind="loadingTips"></p>' +//loading中的提示语
                        '</div>' +
                    '</div>' +
                '</div>'
            };
        })
        /* 对话框 */
        .directive('bbDialog', function () {
            return {
                scope: {
                    show: '=',
                    htmlpath: '@',
                    tipTitle: '=',//用于在模板中显示
                    tipContent: '='
                },
                restrict: 'AE',
                replace: true,
                template: '<div ng-show="show">' +
                '<div class="bb_mask"></div>' +
                '<div class="bb_body1">' +
                '<div class="bb_content" ng-include="htmlpath"></div>' +
                //'<div class="bb_close" ng-click="close()">X</div>' +
                '</div>' +
                '</div>',
                link: function ($scope) {
                    $scope.close = function () {
                        $scope.show = false;
                    };
                }
            };
        })

        /* 弹出框 */
        .directive('bbAlert', function () {
            return {
                scope: {
                    msg: '@'
                },
                restrict: 'AE',
                replace: true,
                transclude: true,
                template: '<div class="bb_alert"><div class="bb_mask"></div><div class="bb_box"><div class="bb_body"><div class="bb_content">{{msg}}</div></div><div class="bb_buttons"><button type="submit" class="bb_button bb_ok" ng-click="ok()">确定</button></div></div>',
                link: function ($scope, elm) {
                    $scope.ok = function () {
                        elm.remove();
                    };
                }
            };
        })
        /* 输入框旁边 倒计时
         参数说明：
         times(倒计时的时间)
         text(倒计时按钮显示的文本)
         phoneNumber(发送验证码到哪个手机上)
         onSend(没想好干嘛用)

         调用：
         verify.html:
         <count-down text="发送验证码" times="10" phone-number="13590457837"></count-down>
         */
        .directive('countDown', ['$timeout', function ($timeout) {
            return {
                restrict: 'AE',
                replace: true,
                scope: {
                    text: '@',
                    times: '=',
                    phoneNumber: '=',
                    onSend: '&',
                    ifSend: '='
                },
                template: '<button type="button" ng-disabled="hideBtn" ng-click="onSend()" class="btn-count-down"><i class="timers">{{text}}</i></button>',
                link: function ($scope, elm, attrs) {
                    var leaveTime = 0, timeoutId;

                    function updateTimer() {
                        elm.find('.button').attr('disabled', 'true');
                        timeoutId = $timeout(function () {
                            leaveTime--;
                            $scope.text = leaveTime + '秒';
                            //elm.find('.timers').html(leaveTime+'秒后重发');
                            if (leaveTime < 1) {
                                $timeout.cancel(timeoutId);
                                $scope.text = '重新发送';
                                //elm.find('.timers').html('重新发送');
                                elm.find('.button').removeAttr('disabled');
                                $scope.ifSend = false;//倒计时完毕则将是否发送关键字至为false。
                            } else {
                                updateTimer();
                            }
                        }, 1000);
                    }

                    function countdown() {
                        leaveTime = $scope.times;
                        leaveTime--;
                        //elm.find('.timers').html(leaveTime+'秒后重发');
                        $scope.text = leaveTime + '秒';
                        //alert("更新文字");
                        updateTimer();
                    }

                    //监听是否发送关键字，为true则倒计时。
                    $scope.$watch('ifSend', function () {
                        if ($scope.ifSend) {
                            $scope.hideBtn = true;
                            countdown();
                        } else {
                            $scope.hideBtn = false;
                        }
                    });
                }
            };
        }])
        /* PICC 底部的页脚 */
        .directive('picc', function () {
            return {
                restrict: 'AE',
                replace: true,
                transclude: true,
                template: '<div class="picc">PICC人保财险承保，为您的每一分钱保价护航<p>顺丰金融 版权所有</p></div>'
            };
        })
});