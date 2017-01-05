define(function (require) {
    var app = require('./app');

    require('./directive/directive');

    require('./utils/native');

    require('./utils/utils');

    app.run(['$rootScope', '$state', function ($rootScope) {
        $rootScope.$on('$stateChangeStart', function () {
            //隐藏原生的导航栏
            //app.get('setNativeHeadVisibility')('0');
        });
    }]);

    app.config(['$stateProvider', '$urlRouterProvider', '$httpProvider', function ($stateProvider, $urlRouterProvider, $httpProvider) {

        $httpProvider.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=UTF-8';
        $httpProvider.defaults.transformRequest = function (obj) {
            var str = [];
            for (var p in obj)
                str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
            return str.join("&");
        };

        $urlRouterProvider.otherwise('/home');

        $stateProvider
            //错误界面
            .state('error', {
                url: '/error',
                templateUrl: 'module/error/error.html',
                controllerUrl: 'module/error/errorCtrl',
                controller: 'errorCtrl'
            })
            //请求网络出错
            .state('netError', {
                url: '/netError',
                templateUrl: 'module/error/netError.html',
                controllerUrl: 'module/error/errorCtrl',
                controller: 'netErrorCtrl'
            })
            //顺丰彩首页
            .state('home', {
                url: '/home',
                templateUrl: 'module/home/home.html',
                controllerUrl: 'module/home/homeCtrl',
                controller: 'homeCtrl',
                dependencies: ['module/home/homeService']
            })
            //已使用丰彩券列表
            .state('couponListUsed', {
                url: '/couponListUsed',
                templateUrl: 'module/home/couponListUsed.html',
                controllerUrl: 'module/home/couponCtrl',
                controller: 'couponListUsedCtrl',
                dependencies: ['module/home/couponService']
            })
            //可用丰彩券列表
            .state('couponListValid', {
                url: '/couponListValid',
                templateUrl: 'module/home/couponListValid.html',
                controllerUrl: 'module/home/couponCtrl',
                controller: 'couponListValidCtrl',
                dependencies: ['module/home/couponService']
            })
            //兑奖明细列表
            .state('exchangeDetail', {
                url: '/exchangeDetail',
                templateUrl: 'module/home/exchangeDetail.html',
                controllerUrl: 'module/home/exchangeDetailCtrl',
                controller: 'exchangeDetailCtrl',
                dependencies: ['module/home/exchangeDetailService']
            })
            //兑奖专区
            .state('exchange', {
                url: '/exchange',
                templateUrl: 'module/exchange/exchange.html',
                controllerUrl: 'module/exchange/exchangeCtrl',
                controller: 'exchangeCtrl',
                dependencies: ['module/exchange/exchangeService']
            })
            //中奖界面（少于1万）
            .state('prizeWin', {
                url: '/prizeWin',
                templateUrl: 'module/exchange/prizeWin.html',
                controllerUrl: 'module/exchange/prizeCtrl',
                controller: 'prizeWinCtrl',
                dependencies: ['module/exchange/prizeService', 'module/bind/bindService']
            })
            //未中奖
            .state('prizeLose', {
                url: '/prizeLose',
                templateUrl: 'module/exchange/prizeLose.html',
                controllerUrl: 'module/exchange/prizeCtrl',
                controller: 'prizeLoseCtrl',
                dependencies: ['module/home/homeService']
            })
            //已兑奖
            .state('prizeGot', {
                url: '/prizeGot',
                templateUrl: 'module/exchange/prizeGot.html',
                controllerUrl: 'module/exchange/prizeCtrl',
                controller: 'prizeGotCtrl',
                dependencies: ['module/home/homeService']
            })
            //已中奖未领取
            .state('prizeUnclaimed', {
                url: '/prizeUnclaimed/:exceptionType',
                templateUrl: 'module/exchange/prizeUnclaimed.html',
                controllerUrl: 'module/exchange/prizeCtrl',
                controller: 'prizeUnclaimedCtrl',
                dependencies: ['module/exchange/prizeService','module/exchange/exchangeService']
            })
            //领奖页面
            .state('prizeAccept', {
                url: '/prizeAccept',
                templateUrl: 'module/exchange/prizeAccept.html',
                controllerUrl: 'module/exchange/prizeCtrl',
                controller: 'prizeAcceptCtrl',
                dependencies: ['module/bind/bindService', 'module/exchange/exchangeService']
            })
            .state('download', {
                url: '/download',
                templateUrl: 'module/home/download.html',
                controllerUrl: 'module/home/downloadCtrl',
                controller: 'downloadCtrl'
            })
            //大奖
            .state('prizeBig', {
                url: '/prizeBig',
                templateUrl: 'module/exchange/prizeBig.html',
                controllerUrl: 'module/exchange/prizeCtrl',
                controller: 'prizeBigCtrl',
                dependencies: ['module/exchange/prizeService']
            })
            //登录
            .state('login', {
                url: '/login',
                templateUrl: 'module/bind/login.html',
                controllerUrl: 'module/bind/loginCtrl',
                controller: 'loginCtrl',
                dependencies: ['module/bind/bindService']
            })
            //其他工具扫码兑奖页面
            .state('nonSupport', {
                url: '/nonSupport',
                templateUrl: 'module/error/nonSupport.html',
                controllerUrl: 'module/error/errorCtrl',
                controller: 'nonSupportCtrl'
            })
            //兑奖须知
            .state('protocal', {
                url: '/protocal',
                templateUrl: 'module/exchange/protocal.html',
                controllerUrl: 'module/exchange/exchangeCtrl',
                controller: 'protocalCtrl'
            })
            //体彩中心地址列表
            .state('address', {
                url: '/address',
                templateUrl: 'template/address.html',
                controllerUrl: 'module/exchange/prizeCtrl',
                controller: 'addressListCtrl',
                dependencies: ['module/exchange/prizeService']
            });
    }]);
});
