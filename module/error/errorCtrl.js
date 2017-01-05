/**
 * Created by 837781 on 2016/9/7.
 */
define(function (require) {
    var app = require('../../app');

    //丰彩券首页
    app.controller('errorCtrl', ['$scope', '$rootScope', 'utils', function ($scope, $rootScope, utils) {
        $scope.goBack = function () {
            app.get('closeWindow')();
        };
        window.onBack = function () {
            $scope.goBack();
        };

        $rootScope.loading = false;

        //因为有可能是后台重定向过来，需要获取sourceType，不然会对closeWindow有影响,一个原则，后台重定向的都需要sourceType
        var parse = utils.urlparse();
        var sourceType = parse['sourceType'];
        if (sourceType) {
            $rootScope.sourceType = sourceType;
        }

    }])
    //请求网络异常
    .controller('netErrorCtrl', ['$scope', '$rootScope', function ($scope, $rootScope) {
        $scope.goBack = function () {
            app.get('closeWindow')();
        };
        window.onBack = function () {
            $scope.goBack();
        };

        $rootScope.loading = false;

    }])
    //其他工具扫码兑奖页面
    .controller('nonSupportCtrl', ['$scope', '$rootScope', function ($scope, $rootScope) {
        $scope.goBack = function () {
            app.get('closeWindow')();
        };
        window.onBack = function () {
            $scope.goBack();
        };
        $rootScope.loading = false;
    }]);
});