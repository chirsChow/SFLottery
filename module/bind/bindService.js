/**
 * Created by SF on 27/11/16.
 */
define(function (require) {
    var app = require('../../app');
    //发送短信验证码
    app.service('sendSMSCodeService', ['$http', function ($http) {
        return {
            send: function (mobile) {
                //return $http.jsonp('http://rap.taobao.org/syf-lottery/lottery/sendSMS');
                return $http.get('data/sendSmsCode.json');
            }
        };
    }])
    //校验短信验证码
    .service('verifySMSCodeService', ['$http', function ($http) {
        return {
            verify: function (mobile, vcode) {
                //return $http.jsonp('http://rap.taobao.org/syf-lottery/lottery/validateSMS');
                return $http.get('data/sendSmsCode.json');
            }
        };
    }])
    //绑定顺手付
    //HOME 顺丰彩专区/EXCHANGE 兑奖
        .factory('bindSFPayService', ['$rootScope', 'bindSFPayUrl', function ($rootScope, bindSFPayUrl) {
        return {
            bind: function (mobile, businessType) {
                var targetUrl = '';
                if (businessType == 'HOME') {
                    var searchStr = '';//url的查询参数
                    if (location.hash.indexOf('?') > 0) {
                        searchStr = location.hash.substring(location.hash.indexOf('?'));
                    }
                    targetUrl = location.origin + location.pathname + searchStr + "#/home";
                } else if (businessType == 'EXCHANGE') {
                    targetUrl = location.origin + location.pathname + $rootScope.searchExchange + "&page=prizeAccept#/prizeAccept";
                }
                window.location.replace(bindSFPayUrl + "?mobile=" + mobile + "&businessType=" + businessType + "&targetUrl=" + encodeURIComponent(targetUrl));
            }
        };
    }])
    //领奖
    .factory('awardService', ['$http', function ($http) {
        return {
            receive: function () {
                //return $http.jsonp("http://rap.taobao.org/syf-lottery/lottery/award");
                return $http.get('data/award.json');
            }
        };
    }]);

});

