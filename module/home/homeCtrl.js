define(function (require) {
    var app = require('../../app');
    require('../../filter/comFilter');
    require('../../utils/dialog');

    //顺丰彩专区
    app.controller('homeCtrl', ['$scope', '$rootScope', '$state', 'utils', '$cacheFactory', 'h5WalletUrl', 'lotteryFrontUrl', 'lotteryShopUrl', function ($scope, $rootScope, $state, utils, $cacheFactory, h5WalletUrl, lotteryFrontUrl, lotteryShopUrl) {
        $scope.goBack = function () {
            app.get('closeWindow')();
        };
        window.onBack = function () {
            $scope.goBack();
        };

        var parse = utils.urlparse();
        var authStatus = parse['authStatus']=='null'?'N':parse['authStatus'];//用户信息是否失效(N无效)
        if(authStatus == 'N'){//用户信用失效，直接关闭页面
            $scope.goBack();
        }
        var sourceType = parse['sourceType'];//APP-SFEXP(速运通APP)、APP-SYPAY（顺手付）、WECHAT（微信）、ALIPAY（支付宝）、HIVEBOX(丰巢)、H5-LOTTERY (顺丰彩H5专区)、UPP 统一收银台、H5-WALLET、OTHER(其它)
        if (!sourceType || sourceType == '') {
            sourceType = $rootScope.sourceType;
        } else {
            $rootScope.sourceType = sourceType;//全局保存渠道来源
        }
        var isFirstExchange = parse['isFirstExchange'];//Y 是第一次兑奖 N 不是第一次兑奖
        if (!isFirstExchange || isFirstExchange == '') {
            isFirstExchange = $rootScope.isFirstExchange;
        } else {
            $rootScope.isFirstExchange = isFirstExchange;
        }
        $rootScope.isWifi = parse['wifi'];//1 WIFI 0非WIFI

        if(app.get('otherTool')()){
            $state.go('nonSupport');
        }

        //判断是速运(App,H5,WeChat)
        $rootScope.isSFExp = sourceType == 'APP-SFEXP';

        $rootScope.isWeChat = sourceType == 'WECHAT' || utils.browser().weChat;

        //累计中奖（元）
        $scope.totalAmt = 0;
        //中奖次数
        $scope.winCnt = 0;
        //最高金额（元）
        $scope.maxAmt = 0;
        //账户余额
        $scope.balance = 0;

        $rootScope.loading = true;
        app.get("homeService").get().success(function(response) {
            $rootScope.loading = false;
            if (response.resultCode == '00') {
                $scope.totalAmt = response.data.totalAmt;
                $scope.winCnt = response.data.winCnt;
                $scope.maxAmt = response.data.maxAmt;
                $scope.voucherCnt = response.data.voucherCnt;//可用券数量
            } else if (response.resultCode == '990008') {
                utils.toast('用户验证信息失效，请重试！');
                app.get('closeWindow')();
            } else {
                utils.toast(response.resultMsg);
            }
        }).error(function(){
            $state.go('netError');
        });
        //去兑奖
        $scope.goExchange = function () {
            var cache = $cacheFactory.get('exchange');
            if (!cache) {
                cache = $cacheFactory('exchange');
            }
            cache.put('entrance', 'home');
            $state.go('exchange');
        };
        //查询账户余额
        function queryBanlance(){
            $rootScope.loading = true;
            app.get("balanceService").get().success(function (response) {
                $rootScope.loading = false;
                if (response.resultCode == '00') {
                    $scope.balance = response.data.balanceAmt;//单位：分
                } else if (response.resultCode == '990008') {
                    utils.toast('用户验证信息失效，请重试！');
                    app.get('closeWindow')();
                } else {
                    utils.toast(response.resultMsg);
                }
            }).error(function () {
                $state.go('netError');
            });
        }
        //顺手付和丰巢不用显示账户余额
        if ($rootScope.isSFExp || $rootScope.isWeChat) {
            queryBanlance();
        }

        //去钱包
        $scope.goWallet = function(){
            if (utils.browser().sfPay || $rootScope.sourceType == 'APP-SYPAY') {
                app.get('startBalance')();
            } else {
                goH5Wallet();
            }
        };
        //去H5钱包
        function goH5Wallet() {
            var memberType = parse['memberType'];
            var merchantId = parse['merchantId'];
            //H5钱包地址
            app.get('accessTokenLinkService').go(function(accessToken){
                var forwardUrl = lotteryFrontUrl + "?sourceType="+sourceType+"&accessToken="+accessToken;
                var _url = h5WalletUrl+"&memberType="+memberType+"&merchantId="+merchantId+"&forwardUrl="+ encodeURIComponent(forwardUrl) + "&sourceType=H5-LOTTERY&businessType=H5-WALLET&authToken=";
                window.location.href = _url + accessToken;
            });
        }

        //购彩商城
        $scope.goShop = function () {
            app.get('accessTokenLinkService').go(function (accessToken) {
                $scope.hidePage = true;
                var _url = lotteryShopUrl + "/sfpay?sourceType=" + sourceType + "&sfpayToken=";
                window.location.href = _url + accessToken;
            });
        };

        //解决一加手机在顺手付打开H5时第一次不能加载完成的问题
        if(utils.browser().onePlus && !sessionStorage.getItem('onceReload')){
            window.location.reload();
            sessionStorage.setItem('onceReload',true);
        }
    }]);
});