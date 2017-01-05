define(function (require) {
    var app = require('../../app');

    app.service('homeService', ['$http', function ($http) {
        return {
            get: function () {
                return $http.jsonp("http://rap.taobao.org/syf-lottery/lottery/sfcQuery");
            }
        };
    }])
    //取顺手付账号余额
    .service('balanceService', ['$http', function ($http) {
        return {
            get: function () {
                return $http.jsonp("http://rap.taobao.org/syf-lottery/lottery/balanceQuery");
            }
        };
    }])
    //免登访问accessToken
    .service('accessTokenService', ['$http', function ($http) {
        return {
            get: function () {
                return $http.jsonp("http://rap.taobao.org/syf-lottery/lottery/getAccessToken");
            }
        };
    }])
    //URL需要accesstoken跳转
    .service('accessTokenLinkService', ['$rootScope', '$state', 'accessTokenService', 'utils', function ($rootScope, $state, accessTokenService, utils) {
        return {
            go: function (callback) {
                $rootScope.loading = true;
                accessTokenService.get().success(function (response) {
                    $rootScope.loading = false;
                    if (response.resultCode == '00') {
                        var accessToken = response.data.accessToken;
                        if (callback) {
                            callback(accessToken)
                        }
                    } else {
                        utils.toast(response.resultMsg);
                    }
                }).error(function () {
                    $state.go('netError');
                });
            }
        };
    }]);
});
