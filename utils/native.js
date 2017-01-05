/**
 * Created by 837781 on 2016/8/25.
 */
define(function (require) {
    var app = require('../app');
    app
        //关闭窗口(退出H5)
        .factory('closeWindow', ['$rootScope', function ($rootScope) {
            return function () {
                try {
                    if (typeof window.WeixinJSBridge != 'undefined') {
                        WeixinJSBridge.call('closeWindow');
                    } else {
                        SFPayHybrid.closeWindow();
                    }
                } catch (e) {
                    console.log("原生代码没有注入javascript对象!");
                }
            }
        }])
        //除顺手付App，速运App，微信，其他扫码工具不支持
        .factory('otherTool', ['$rootScope', 'utils', function ($rootScope, utils) {
            return function () {
                if (utils.browser().sfPay || utils.browser().sfExpress || utils.browser().weChat
                    || $rootScope.sourceType == 'APP-SYPAY' || $rootScope.sourceType == 'APP-SFEXP'
                    || $rootScope.sourceType == 'WECHAT' || $rootScope.sourceType == 'H5-SFEXP') {
                    return false;
                }
                return true;
            }
        }])
        //启动原生的余额界面
        .factory('startBalance', function () {
            return function () {
                try {
                    SFPayHybrid.startBalance();
                } catch (e) {
                    console.log("原生代码没有注入javascript对象!");
                }
            }
        })
        //调用扫一扫
        .factory('startScanCode', function () {
            return function (fun) {
                try {
                    SFPayHybrid.startScanCode(fun);
                } catch (e) {
                    console.log("原生代码没有注入javascript对象!");
                }
            }
        })
        //调用原生微信分享
        .factory('shareWechat', function () {
            return function (params) {
                try {
                    SFPayHybrid.shareWechat(params);
                } catch (e) {
                    console.log("原生代码没有注入javascript对象!");
                }
            }
        })
        //调用原生隐藏导航栏 state[0,1]
        .factory('setNativeHeadVisibility', function () {
            return function (state) {
                try {
                    SFPayHybrid.setHeadViewVisibility(state);
                } catch (e) {
                    console.log("原生代码没有注入javascript对象!");
                }
            }
        })
        //唤起顺手付App
        .factory('invokeSFApp', function () {
            return function () {
                window.location.href = 'sfpayscheme://com.sfpay/';
            }
        });
});