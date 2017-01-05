/**
 * Created by 837781 on 2016/8/26.
 */
define(function (require) {
    var app = require('../../app');
    require('../../filter/comFilter');
    require('../../utils/dialog');
    //丰彩专区入口-会员绑定页面
    app.controller('loginCtrl', ['$scope', '$rootScope', '$state', '$filter', 'utils', 'Alert', function ($scope, $rootScope, $state, $filter, utils, Alert) {
        $scope.goBack = function () {
            app.get('closeWindow')();
        };
        window.onBack = function () {
            $scope.goBack();
        };
        var parse = utils.urlparse();
        var mobile = parse['mobile']=='null'?null:parse['mobile'];//用户信息
        var sourceType = $rootScope.sourceType = parse['sourceType'];//APP-SFEXP(速运通APP)、APP-SYPAY（顺手付）、WECHAT（微信）、ALIPAY（支付宝）、HIVEBOX(丰巢)、H5-LOTTERY (顺丰彩H5专区)、UPP 统一收银台、H5-WALLET、OTHER(其它)
        $rootScope.isFirstExchange = parse['isFirstExchange'];//Y 是第一次兑奖 N 不是第一次兑奖

        //判断是速运(App)
        $rootScope.isSFExp = sourceType == 'APP-SFEXP';

        $rootScope.isWeChat = sourceType == 'WECHAT' || utils.browser().weChat;

        if(app.get('otherTool')()){
            $state.go('nonSupport');
        }

        $scope.obj = {
            phoneNumber: '',//绑定手机号
            smsCode: '',//短信验证码
            inputPhone:true, //手动输入
            autoSend:false
        };

        if (mobile && mobile != 'null') {//存在关联的手机号
            $scope.obj.phoneNumber = mobile;
            $scope.obj.inputPhone = false;
        }

        //修改手机号
        $scope.edit = function(){
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
        //1验证短信验证码-->2判断是否已注册顺手付
        $scope.next = function(){
            var _mobile = $scope.obj.phoneNumber.replace(/\s+/g, "");
            var _smsCode = $scope.obj.smsCode.replace(/\s+/g, "");

            if($scope.obj.inputPhone){//无关联手机号
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
            }else{//有关联手机号
                bind(_mobile);
            }
        };
        //绑定顺手付(绑定后会重写向到顺丰彩专区)
        function bind(mobile){
            app.get("bindSFPayService").bind(mobile, 'HOME');
        }

        window.checkTextLength = function (obj, length) {
            if (/[^\d]/.test(obj.value)) {
                obj.value = obj.value.replace(/[^\d]/g, '');
            }
            if (obj.value.length > length) {
                obj.value = obj.value.substr(0, length);
            }
        };
    }]);
});


