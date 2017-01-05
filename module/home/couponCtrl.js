/**
 * Created by 837781 on 2016/9/7.
 */
define(function (require) {
    var app = require('../../app');
    require('../../filter/comFilter');
    //已使用丰彩券列表
    app.controller('couponListUsedCtrl', ['$scope', '$rootScope', '$state', 'utils', function ($scope, $rootScope, $state, utils) {
        $scope.goBack = function () {
            window.history.back();
        };
        window.onBack = function () {
            $scope.goBack();
        };

        $scope.list = [];

        $scope.finish = false;
        var page = 1;
        var pageSize = 10;
        getList(page, pageSize, 'USED');
        document.querySelector('.showList').addEventListener('scroll', function () {
            if (this.scrollHeight - this.clientHeight - this.scrollTop < 70 && $scope.finish) {
                page++;
                getList(page, pageSize, 'USED');
            }
        });

        function getList(page, pageSize, useStatus) {
            $scope.finish = false;
            $rootScope.loading = true;
            app.get("couponListService").get(page, pageSize, useStatus).success(function (response) {
                $rootScope.loading = false;
                utils.toast(response.returnMsg);
                if (response.resultCode == '00') {
                    if (response.data.length > 0) {
                        $scope.list = $scope.list.concat(response.data);
                    }
                    $scope.finish = true;
                } else {
                    $state.go('error');
                }
            }).error(function () {
                $state.go('netError');
            });
        }
    }])
        //可用丰彩券列表
        .controller('couponListValidCtrl', ['$scope', '$rootScope', '$state', 'utils', 'accessTokenService', function ($scope, $rootScope, $state, utils, accessTokenService) {
            $scope.goBack = function () {
                window.history.back();
            };
            window.onBack = function () {
                $scope.goBack();
            };

            $scope.list = [];

            $scope.finish = false;
            var page = 1;
            var pageSize = 10;

            document.querySelector('.showList').addEventListener('scroll', function () {
                if (this.scrollHeight - this.clientHeight - this.scrollTop < 70 && $scope.finish) {
                    page++;
                    getList(page, pageSize, 'INIT');
                }

            });

            function getList(page, pageSize, useStatus) {
                $scope.finish = false;
                $rootScope.loading = true;
                app.get("couponListService").get(page, pageSize, useStatus).success(function (response) {
                    $rootScope.loading = false;
                    utils.toast(response.returnMsg);
                    if (response.resultCode == '00') {
                        if (response.data.length > 0) {
                            $scope.list = $scope.list.concat(response.data);
                        }
                        $scope.finish = true;
                    }else{
                        $state.go('error');
                    }
                }).error(function () {
                    $state.go('netError');
                });
            }

            $rootScope.loading = true;
            accessTokenService.get().success(function (response) {
                $rootScope.loading = false;
                if (response.resultCode == '00') {
                    $rootScope.accessToken = response.data.accessToken;
                    getList(page, pageSize, 'INIT');
                } else {
                    utils.toast(response.resultMsg);
                }
            }).error(function () {
                $state.go('netError');
            });

        }]);
});