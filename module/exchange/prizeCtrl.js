/**
 * Created by 837781 on 2016/8/26.
 */
define(function (require) {
    var app = require('../../app');
    require('../../filter/comFilter');
    require('../../utils/dialog');
    //中奖界面（少于1万）
    app.controller('prizeWinCtrl', ['$scope', '$rootScope', '$state', 'utils', '$cacheFactory', '$timeout', '$filter', 'Alert', function ($scope, $rootScope, $state, utils, $cacheFactory, $timeout, $filter, Alert) {
        $scope.goBack = function () {
            if ($rootScope.entrance == "home") {
                window.history.back();
            } else {
                app.get('closeWindow')();
            }
        };
        window.onBack = function () {
            $scope.goBack();
        };

        $scope.obj = {
            phoneNumber: '',//手机号码
            smsCode: '',//短信验证码
            inputPhone: true,//手动输入手机号
            autoSend: false
        };
        //未绑定顺手付，关联的手机号
        var mobile = $rootScope.sfPayBindInfo.mobile;

        if (mobile && mobile != 'null') {//存在关联的手机号
            $scope.obj.phoneNumber = mobile;
            $scope.obj.inputPhone = false;
        }

        //修改手机号
        $scope.edit = function () {
            $scope.obj.inputPhone = true;
            $scope.obj.phoneNumber = '';
        };
        //发送短信验证码
        $scope.send = function () {
            if (!/^1\d{10}$/.test($scope.obj.phoneNumber)) {
                utils.toast('输入手机号不正确');
                return;
            }
            app.get("sendSMSCodeService").send($scope.obj.phoneNumber).success(function (response) {
                if (response.resultCode != '00') {
                    utils.toast(response.resultMsg);
                    return;
                }
                $scope.obj.autoSend = true;
                utils.toast('短信验证码已发送至手机' + $filter('subStrForStar_phone')($scope.obj.phoneNumber));
            }).error(function () {
                utils.toast('发送短信验证码失败');
            });
        };
        //绑定顺手付（不用验证短信验证码）
        $scope.next1 = function(){
            var _mobile = $scope.obj.phoneNumber.replace(/\s+/g, "");
            bind(_mobile);
        };

        //1验证短信验证码-->2绑定顺手付
        $scope.next2 = function(){
            var _mobile = $scope.obj.phoneNumber.replace(/\s+/g, "");
            var _smsCode = $scope.obj.smsCode.replace(/\s+/g, "");

            //验证短信码
            app.get("verifySMSCodeService").verify(_mobile, _smsCode).success(function (response) {
                if (response.resultCode == '13000') {//手机号已经绑定
                    var _msg = "";
                    if ($rootScope.isWeChat) {
                        _msg = "抱歉，顺手付账号"+$filter('subStrForStar_phone')(_mobile)+"已经和其他微信账号绑定，请使用登录之前绑定的微信号操作";
                    }
                    if ($rootScope.isSFExp) {
                        _msg = "抱歉，顺手付账号"+$filter('subStrForStar_phone')(_mobile)+"已经和其他顺丰会员绑定，请使用登录之前绑定的顺丰会员操作";
                    }
                    Alert($scope, _msg);
                    $scope.obj.phoneNumber = '';
                    $scope.obj.smsCode = '';
                    return;
                }
                if (response.resultCode != '00') {
                    utils.toast(response.resultMsg);
                    return;
                }
                bind(_mobile);
            }).error(function () {
                utils.toast('验证短信验证码失败');
            });
        };
        //绑定顺手付 --(重写向到领奖界面)--> 领取奖金
        function bind(mobile){
            app.get("bindSFPayService").bind(mobile, 'EXCHANGE');
        }

        window.checkTextLength = function (obj, length) {
            if (/[^\d]/.test(obj.value)) {
                obj.value = obj.value.replace(/[^\d]/g, '');
            }
            if (obj.value.length > length) {
                obj.value = obj.value.substr(0, length);
            }
        };
    }])
    //中奖界面（奖金大于1万）
    .controller('prizeBigCtrl', ['$scope', '$rootScope', '$state', function ($scope, $rootScope, $state) {
        $scope.goBack = function () {
            if ($rootScope.entrance == "home") {
                $state.go('home');
            } else {
                app.get('closeWindow')();
            }
        };
        window.onBack = function () {
            $scope.goBack();
        };

        //查看体彩中心地址列表
        $scope.sportLotteryAddress = function () {
            $state.go('address');
        };
    }])
    //兑奖超时、失败
    .controller('prizeUnclaimedCtrl', ['$scope', '$rootScope', '$state', '$stateParams', '$cacheFactory', '$timeout', 'utils', function ($scope, $rootScope, $state, $stateParams, $cacheFactory, $timeout, utils) {
        $scope.goBack = function () {
            if ($rootScope.entrance == "home") {
                $state.go('home');
            } else {
                app.get('closeWindow')();
            }
        };
        window.onBack = function () {
            $scope.goBack();
        };

        $scope.obj = {
            isNetTimeout:false,//超时异常
            isNetFail:true//网络失败
        };

        var cache = $cacheFactory.get('exchange');
        if (!cache) {
            cache = $cacheFactory('exchange');
        }
        var lotterySn = cache.get('lotterySn');
        var lotteryPayNo = cache.get('lotteryPayNo');
        var payStyle = cache.get("payStyle");
        var orderId = cache.get("orderId");//兑奖订单号

        //继续查询
        $scope.reView = function () {
            $rootScope.loading = true;
            app.get("queryPrizeService").get(orderId).success(function (response) {
                $rootScope.loading = false;
                $rootScope.amount = response.amount;
                switch (response.returnCode) {
                    case '0'://网关调用成功 已经付款
                        $state.go('prizeAccept');
                        break;
                    case '1'://网关调用成功 付款失败
                        $scope.obj.isNetTimeout = false;
                        $scope.obj.isNetFail = true;
                        break;
                    case '2'://网关调用成功 未付款
                    case '3'://网关调用超时 重新发起代付 受理成功
                        //查询订单状态
                        queryOrder();
                        break;
                    case '4'://网关调用超时 重新发起代付（失败，超时）
                    case '5'://网关订单查询失败
                        //当前页面
                        break;
                    case '6'://验证authToken异常
                    case '7'://参数错误
                        $state.go('error');
                        break;
                    default :
                        $scope.obj.isNetTimeout = false;
                        $scope.obj.isNetFail = true;
                        break;
                }
            }).error(function () {
                $state.go('netError');
            });
        };

        var queryTimes = 1;
        function queryOrder(){
            $rootScope.loading = true;
            app.get("exchangeService").query(orderId).success(function (response) {
                switch (response.returnCode) {
                    case '4'://网关代付其他状态，如进行中
                    case '5'://查询网关订单失败
                        queryTimes++;
                        if (queryTimes <= 18) {
                            $timeout(function () {
                                $rootScope.loading = false;
                                queryOrder();
                            }, 2000);
                        } else {
                            $rootScope.loading = false;
                            $scope.obj.isNetTimeout = false;
                            $scope.obj.isNetFail = true;
                        }
                        break;
                    case '2'://网关代付成功
                        $rootScope.loading = false;
                        $state.go('prizeAccept');
                        break;
                    case '3'://网关代付失败，如未实名
                        $rootScope.loading = false;
                        $scope.obj.isNetTimeout = false;
                        $scope.obj.isNetFail = true;
                        break;
                    case '1'://网关订单不存在
                    case '6'://验证authToken异常
                    case '7'://参数错误
                        $state.go('error');
                        break;
                    default :
                        $rootScope.loading = false;
                        $scope.obj.isNetTimeout = false;
                        $scope.obj.isNetFail = true;
                        break;
                }
            }).error(function () {
                $state.go('netError');
            });
        }

        if ($stateParams.exceptionType == 'timeout') {
            $scope.obj.isNetTimeout = true;
            $scope.obj.isNetFail = false;
        } else {
            $scope.obj.isNetTimeout = false;
            $scope.obj.isNetFail = true;
        }

        $scope.viewWalletBalance = function () {
            utils.viewWalletBalance();
        };
    }])
    //已经兑过奖
    .controller('prizeGotCtrl', ['$scope', '$rootScope', '$state', 'lotteryShopUrl', function ($scope, $rootScope, $state, lotteryShopUrl) {
        $scope.goBack = function () {
            if ($rootScope.entrance == "home") {
                $state.go('home');
            } else {
                app.get('closeWindow')();
            }
        };
        window.onBack = function () {
            $scope.goBack();
        };

        //购彩商城
        $scope.goShop = function () {
            app.get('accessTokenLinkService').go(function (accessToken) {
                var _url = lotteryShopUrl + "/sfpay?sourceType=" + $rootScope.sourceType + "&sfpayToken=";
                window.location.href = _url + accessToken;
            });
        };

    }])
    //没有中奖
    .controller('prizeLoseCtrl', ['$scope', '$rootScope', '$state', 'lotteryShopUrl', function ($scope, $rootScope, $state, lotteryShopUrl) {
        $scope.goBack = function () {
            if ($rootScope.entrance == "home") {
                $state.go('home');
            } else {
                app.get('closeWindow')();
            }
        };
        window.onBack = function () {
            $scope.goBack();
        };

        //购彩商城
        $scope.goShop = function () {
            app.get('accessTokenLinkService').go(function(accessToken){
                var _url = lotteryShopUrl + "/sfpay?sourceType="+$rootScope.sourceType+"&sfpayToken=";
                window.location.href = _url + accessToken;
            });
        };

    }])
    //领奖页面
    .controller('prizeAcceptCtrl', ['$scope', '$state', '$rootScope', '$timeout', '$cacheFactory', 'utils', function ($scope, $state, $rootScope, $timeout, $cacheFactory, utils) {
        $scope.goBack = function () {
            if ($rootScope.entrance == "home") {
                $state.go('home');
            } else {
                app.get('closeWindow')();
            }
        };
        window.onBack = function () {
            $scope.goBack();
        };

        var parse = utils.urlparse();
        if (parse['page'] == 'prizeAccept') {//兑奖--(中奖)-->绑定-->领奖
            $rootScope.sourceType = parse['sourceType'];
            //领奖
            $rootScope.loading = true;
            app.get("awardService").receive().success(function (response) {
                $rootScope.loading = false;
                if (response.resultCode == '0') {
                    var cache = $cacheFactory.get('exchange');
                    if (!cache) {
                        cache = $cacheFactory('exchange');
                    }
                    cache.put("orderId", response.data.orderId);//兑奖订单号
                    $rootScope.sfPayBindInfo = response.data;
                    var b = response.data.bind;//0未绑定, 1已绑定
                    if (b == 1) {//已绑定
                        query(response.data.orderId);
                    } else {
                        $state.go('prizeWin');
                    }
                } else if (response.resultCode == '1') {//重复兑奖
                    $state.go('prizeGot');
                } else if (response.resultCode == '2') {//兑奖失败，请重试(例如用户乱输的情况)
                    utils.toast('输入信息有误,请确认后重新输入');
                } else if(response.resultCode == '5'){
                    $state.go('prizeUnclaimed', {exceptionType: 'timeout'});
                } else if(response.resultCode == '6'){
                    $state.go('prizeUnclaimed', {exceptionType: 'fail'});
                } else {
                    utils.toast(response.resultMsg);
                    $state.go('error');
                }
            }).error(function () {
                utils.toast('领取奖金失败');
            });
            //查询次数
            var queryTimes = 1;
            //查询网关付款状态
            function query(orderId){
                $rootScope.loading = true;
                $rootScope.loadingTips = '奖金正在发放中';
                app.get("exchangeService").query(orderId).success(function (response) {
                    switch (response.returnCode) {
                        case '4'://网关代付其他状态，如进行中
                        case '5'://查询网关订单失败
                            queryTimes++;
                            if (queryTimes <= 18) {
                                $timeout(function () {
                                    $rootScope.loading = false;
                                    query(orderId);
                                }, 2000);
                            } else {
                                $rootScope.loading = false;
                                $rootScope.loadingTips = '';
                                $state.go('prizeUnclaimed', {exceptionType: 'timeout'});
                            }
                            break;
                        case '2'://网关代付成功(领奖成功)
                            $rootScope.loading = false;
                            $rootScope.loadingTips = '';
                            $rootScope.amount = $rootScope.sfPayBindInfo.amount;
                            $scope.sfpayLoginName = $rootScope.sfPayBindInfo.sypayLoginName;
                            break;
                        case '3'://网关代付失败，如未实名
                            $rootScope.loading = false;
                            $rootScope.loadingTips = '';
                            $state.go('prizeUnclaimed', {exceptionType: 'fail'});
                            break;
                        case '1'://网关订单不存在
                        case '7'://参数错误
                        case '6'://验证authToken异常
                            $rootScope.loadingTips = '';
                            $state.go('error');
                            break;
                        default :
                            $rootScope.loading = false;
                            $rootScope.loadingTips = '';
                            $state.go('prizeUnclaimed', {exceptionType: 'fail'});
                            break;
                    }
                }).error(function () {
                    $rootScope.loadingTips = '';
                    $state.go('error');
                });
            }
        } else {//顺丰彩专区-->兑奖-->领奖
            $rootScope.loadingTips = '';//表示领奖完成
            $scope.sfpayLoginName = $rootScope.sfPayBindInfo.sypayLoginName;//绑定的顺手付账号
        }
        //兑奖记录
        $scope.record = function () {
            $rootScope.loadingTips = '';
            $state.go('home');
        };

    }])
    //体彩中心地址列表
    .controller('addressListCtrl', ['$scope', '$rootScope', '$state', function ($scope, $rootScope, $state) {
        $scope.goBack = function () {
            window.history.back();
        };
        window.onBack = function () {
            $scope.goBack();
        };

        $scope.finish = false;//加载是否完成标识

        $scope.list = [];

        $scope.getList = function(p) {
            $rootScope.loading = true;
            app.get("addressListService").query().success(function (response) {
                $rootScope.loading = false;
                for (var i = 0; i < response.data.length; i++) {
                    if (response.data[i].province == p) {
                        $scope.list = response.data[i].list;
                        break;
                    }
                }
                $scope.finish = true;
            }).error(function () {
                $state.go('netError');
            });
        };

        $scope.getList('广东省');

        //html5定位
        //function location() {
        //    $scope.showPosition = '正在定位...';
        //    utils.getLocation(function (position) {
        //        utils.getLocationInfo(position, function (data) {
        //            //console.log(data.regeocode.addressComponent.province);
        //            //console.log(data.regeocode.addressComponent.city);
        //            //console.log(data.regeocode.addressComponent.district);
        //            $scope.showPosition = data.regeocode.formattedAddress; //返回地址描述
        //            getList(data.regeocode.addressComponent.province);
        //            $scope.$apply();
        //        });
        //    }, function(){//定位失败回调
        //        getList('湖南省');
        //    }, $scope);
        //}
    }]);

});
