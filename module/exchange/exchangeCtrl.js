/**
 * Created by 837781 on 2016/8/26.
 */
define(function (require) {
    var app = require('../../app');
    require('../../directive/directive');
    require('../../utils/dialog');

    app.controller('exchangeCtrl', ['$scope', '$rootScope', '$state', 'utils', '$cacheFactory', '$timeout', 'Alert', 'exchangeFrontUrl', 'getWXOpenIdUrl', function ($scope, $rootScope, $state, utils, $cacheFactory, $timeout, Alert, exchangeFrontUrl, getWXOpenIdUrl) {
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
            accept:true,
            security: '',//保安区10位码
            ticketNo: '',//票码16位
            manualInput: false,//是否显示手动输入兑奖码界面
            showScanCode: true//是否显示扫码
        };

        var cache = $cacheFactory.get('exchange');
        if (!cache) {
            cache = $cacheFactory('exchange');
        }

        //从顺丰彩专区首页进入兑奖
        $rootScope.entrance = cache.get('entrance');

        var sourceType = '';
        var isFirstExchange;
        var parse = utils.urlparse();
        if ($rootScope.entrance == "home") {
            sourceType = $rootScope.sourceType;
            isFirstExchange = $rootScope.isFirstExchange;
        } else {
            sourceType = parse['sourceType'];//渠道来源
            isFirstExchange = parse['isFirstExchange'];//Y 是第一次兑奖 N 不是第一次兑奖
            $rootScope.sourceType = sourceType;//全局保存渠道来源
        }

        if(app.get('otherTool')()){
            $state.go('nonSupport');
        }

        var searchStr = '';
        if (location.hash.indexOf('?') > 0) {
            //绑定的时候需要这个查询参数
            $rootScope.searchExchange = searchStr = location.hash.substring(location.hash.indexOf('?'));
        }

        //判断是速运(App,H5,WeChat)
        $rootScope.isSFExp = sourceType == 'APP-SFEXP';

        $rootScope.isWeChat = sourceType == 'WECHAT' || utils.browser().weChat;

        //手动输入
        $scope.input = function(){
            $scope.obj.manualInput = true;
            if(isFirstExchange == 'Y'){
                $scope.showMaskLayerInput();
            }
        };

        $scope.showMaskLayer = function(){
            if($scope.obj.manualInput){
                $scope.showMaskLayerInput();
            }else{
                $scope.showMaskLayerScan();
            }
        };
        //显示手动输入界面遮罩层
        $scope.showMaskLayerInput = function () {
            $scope.ifMaskLayerInput = true;
        };
        //显示可以扫一扫界面遮罩层
        $scope.showMaskLayerScan = function () {
            $scope.ifMaskLayerScan = true;
        };
        $scope.closeMaskLayer = function () {
            $scope.ifMaskLayerInput = false;
            $scope.ifMaskLayerScan = false;
        };

        function initShowMaskLayer(){
            if (sourceType == 'APP-SYPAY' || sourceType == 'APP-SFEXP') {
                $scope.obj.manualInput = false;
                $scope.obj.showScanCode = true;
                if (isFirstExchange == 'Y') {
                    $scope.showMaskLayerScan();
                }
            } else {
                $scope.obj.manualInput = true;
                $scope.obj.showScanCode = false;
                if (isFirstExchange == 'Y') {
                    $scope.showMaskLayerInput();
                }
            }
        }
        if ($rootScope.entrance != "home") {
            initShowMaskLayer();
        }

        /////////////以上是界面控制逻辑,下面是业务逻辑//////////////////

        //调用原生的扫一扫兑奖
        $scope.scan = function(){
            app.get('startScanCode')(onResultForScanCode);
        };
        var payStyle = 1;
        //获取扫一扫结果
        window.onResultForScanCode = function (result) {
            payStyle = 0;
            var _result = result.replace(/\s+/g, "");
            var _security = _result.substr(-11);//取后11位数字
            var _ticketNo = _result.slice(0, -11);
            exchange(_security, _ticketNo);
        };
        //顺手付App直接扫DM码兑奖
        if (sourceType == 'APP-SYPAY') {
            var dm = parse['dm'];//顺手付扫DM码直接进入兑奖页面
            if (dm) {//有DM码直接兑奖，不用显示兑奖页面
                $scope.hasDM = true;
                app.get("exchangeService").href(exchangeFrontUrl + searchStr).success(function () {
                    onResultForScanCode(dm);
                }).error(function () {
                    $state.go('error');
                });
            }
        }

        //手动输入兑奖
        $scope.exchange = function () {
            payStyle = 1;
            var _security = $scope.obj.security + "";
            _security = _security.replace(/\s+/g, "");
            var _ticketNo = $scope.obj.ticketNo;
            _ticketNo = _ticketNo.replace(/\s+|[-]+/g, "");
            //手动输入只能是16位或18位
            if (_ticketNo.length != 16 && _ticketNo.length != 18) {
                Alert($scope, "保安区右侧的票码输入有误！");
                return;
            }
            exchange(_security, _ticketNo);
        };
        //兑奖
        function exchange(lotteryPayNo, lotterySn){
            $scope.showDialogTips = false;
            if (/[^\d]/.test(lotteryPayNo)) {
                Alert($scope, "保安区的兑奖码输入有误！");
                return;
            }
            if(/[^\d]/.test(lotterySn)){
                Alert($scope, "保安区右侧的票码输入有误！");
                return;
            }

            cache.put("lotterySn", lotterySn);
            cache.put("lotteryPayNo", lotteryPayNo);
            cache.put("sourceType", sourceType);
            cache.put("payStyle", payStyle);
            var param = {
                lotterySn: lotterySn,
                lotteryPayNo: lotteryPayNo,//验证码
                sourceCode: sourceType,//sourceType
                payStyle: payStyle//兑奖方式1 手工兑奖 0 扫码兑奖
            };
            $rootScope.loading = true;
            app.get("exchangeService").exchange(param).success(function(response) {
                $rootScope.loading = false;
                $rootScope.amount = response.amount;
                response.returnCode = utils.getRandomFromArray(['0','0','0','0','0','0','1','2','5','6','10','11','12','13']);
                if (response.returnCode == '0') {//兑奖成功
                    var _orderId = response.orderId;
                    cache.put("orderId", _orderId);//兑奖订单号
                    response.awardStatus = utils.getRandomFromArray([1,2,2,2,2,2,2,3]);
                    switch (response.awardStatus) {
                        case 1://未中奖
                            $state.go('prizeLose');
                            break;
                        case 2://中小奖,需要代付款,轮询三次付款状态
                            //顺手付是否绑定的信息(bind, sypayLoginName, mobile, orderId)
                            $rootScope.sfPayBindInfo = response;
                            var b = response.bind;//0未绑定, 1已绑定
                            if (b == 1) {//已绑定
                                query(_orderId);
                            } else {
                                $state.go('prizeWin');
                            }
                            break;
                        case 3://中大奖(单位分)
                            $state.go('prizeBig');
                            break;
                        default :
                            $state.go('prizeLose');
                            break;
                    }
                } else if (response.returnCode == '1') {//重复兑奖
                    $state.go('prizeGot');
                } else if (response.returnCode == '2') {//兑奖失败，请重试(例如用户乱输的情况)
                    $scope.showDialogWarn = true;
                    $scope.tipTitle = "出错啦";
                    $scope.tipContent = "输入信息有误,请确认后重新输入";
                } else if (response.returnCode == '5') {//兑奖成功，付款超时
                    $state.go('prizeUnclaimed', {exceptionType: 'timeout'});
                } else if (response.returnCode == '6') {//兑奖成功，付款失败
                    $state.go('prizeUnclaimed', {exceptionType: 'fail'});
                } else if (response.returnCode == '10') {//验证authToken异常
                    Alert($scope, "用户验证信息已失效，请重试！");
                } else if (response.returnCode == '11') {//每分钟兑奖次数超限制
                    Alert($scope, "兑奖次数超限制！");
                } else if (response.returnCode == '12') {//不是丰彩即开型彩票
                    $scope.showDialogWarn = true;
                    $scope.tipTitle = "";
                    $scope.tipContent = "抱歉，只支持丰彩即开票兑奖";
                } else if (response.returnCode == '13') {//亚博系统异常
                    $scope.showDialogWarn = true;
                    $scope.tipTitle = "";
                    $scope.tipContent = "抱歉，暂时无法获取兑奖结果，详情请咨询客服 9533889";
                } else {//34789都到异常页面
                    $state.go('error');
                }
            }).error(function(){
                $state.go('netError');
            });
        }

        var queryTimes = 1;
        //查询网关付款状态
        function query(orderId){
            $rootScope.loading = true;
            app.get("exchangeService").query(orderId).success(function (response) {
                response.returnCode = utils.getRandomFromArray(['4','5','2','2','2','2','2','2','2','2','2','3']);
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
                            $state.go('prizeUnclaimed', {exceptionType: 'timeout'});
                        }
                        break;
                    case '2'://网关代付成功
                        $rootScope.loading = false;
                        $state.go('prizeAccept');
                        break;
                    case '3'://网关代付失败，如未实名
                        $rootScope.loading = false;
                        $state.go('prizeUnclaimed', {exceptionType: 'fail'});
                        break;
                    case '1'://网关订单不存在
                    case '7'://参数错误
                    case '6'://验证authToken异常
                        $state.go('error');
                        break;
                    default :
                        $rootScope.loading = false;
                        $state.go('prizeUnclaimed', {exceptionType: 'fail'});
                        break;
                }
            }).error(function () {
                $state.go('error');
            });
        }
        //判断wifi
        var connection = navigator.connection;
        if (connection && connection.type == 'wifi') {
            $scope.ifWifi = true;
        }
        //速运和微信
        if (parse['wifi'] == '1' || $rootScope.isWifi == '1') {
            $scope.ifWifi = true;
        }
        var _top = "0";
        var _height = "100%";
        if ($scope.ifWifi) {
            _top = "-62px";
            _height = "calc(100% + 62px)";
        }
        $scope.maskTop = {
            "top": _top,
            "height": _height
        };

        $scope.showDialogTips = isFirstExchange ? false : true;
        if ($rootScope.entrance == "home") {
            $scope.showDialogTips = true;
        }
        if (dm) {
            $scope.showDialogTips = false;
        }
        //提示下一步
        $scope.closeTips = function () {
            $scope.showDialogTips = false;
            if ($rootScope.entrance == "home") {
                initShowMaskLayer();
                return ;
            }
            if ($rootScope.isWeChat) {//获取官微openId
                var mobileNo = "";
                window.location.href = getWXOpenIdUrl + "?callbackUrl=" + encodeURIComponent(exchangeFrontUrl) + "&mobileNo=" + mobileNo;
            } else {
                app.get("exchangeService").href(exchangeFrontUrl + searchStr).success(function () {
                    initShowMaskLayer();
                }).error(function () {
                    $state.go('error');
                });
            }
        };
        //我知道了
        $scope.closeIknow = function () {
            $scope.showDialogWarn = false;
        };

        window.split = function (obj) {
            var _value = obj.value;
            var _length = _value.length;
            if (/[^\d-]/.test(_value)) {
                obj.value = _value = _value.replace(/[^\d-]/g, '');
            }
            if (_length >= 3 && _length <= 4) {
                obj.value = _value.replace(/\s/g, '').replace(/(\d{2})(?=\d)/g, '$1-');
            } else if (_length >= 6 && _length <= 10) {
                obj.value = _value.replace(/\s/g, '').replace(/(\d{2}[-]+\d{4})(?=\d)/g, '$1-');
            } else if (_length >= 12) {
                obj.value = _value.replace(/\s/g, '').replace(/(\d{2}[-]+\d{4}[-]+\d{7})(?=\d)/g, '$1-');
            }
            if (_length >= 20) {//按18位的票码格式化
                var lastIndex = _value.lastIndexOf('-');
                var _v = _value.substring(0, lastIndex) + _value.substring(lastIndex + 1);
                obj.value = _v.replace(/(\d{2}[-]+\d{4}[-]+\d{9})(?=\d)/g, '$1-');
            }
            //input框在输入时，光标移动到最后
            var t = obj.value;
            obj.value = '';
            obj.focus();
            obj.value = t;
        };
        window.checkTextLength = function (obj, length) {
            if (/[^\d]/.test(obj.value)) {
                obj.value = obj.value.replace(/[^\d]/g, '');
            }
            if (obj.value.length > length) {
                obj.value = obj.value.substr(0, length);
            }
        };
        $scope.showPicc = true;
        $scope.inputFocus = function () {
            $scope.showPicc = false;
        };
        $scope.inputBlur = function () {
            $scope.showPicc = true;
        };

    }])
    //兑奖须知
    .controller('protocalCtrl', ['$rootScope','$scope', function($rootScope, $scope){
        $scope.goBack = function(){
            window.history.back();
        };
        window.doKeyBack = function(){
            $scope.goBack();
        };
    }]);
});


