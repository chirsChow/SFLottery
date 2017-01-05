define(function (require) {
    var app = require('../../app');
    require('../../filter/comFilter');
    //丰彩券首页
    app.controller('exchangeDetailCtrl', ['$scope', '$rootScope', '$state', 'utils', function ($scope, $rootScope, $state, utils) {
        $scope.goBack = function () {
            window.history.back();
        };
        window.onBack = function () {
            $scope.goBack();
        };

        $scope.list = [];

        $scope.finish = false;//上一次加载是否完成，且有数据标识

        var param = {
            status: '',	//兑奖状态	不填写返回全部
            page: 1,	//开始页码	默认第一页
            pageSize: 15	//页显示条数	默认10
        };
        getList(param);

        document.querySelector('.showList').addEventListener('scroll', function () {
            if (this.scrollHeight - this.clientHeight - this.scrollTop < 70 && $scope.finish) {
                param.page++;
                getList(param);
            }
        });

        function getList(param) {
            $scope.finish = false;
            $rootScope.loading = true;
            app.get('exchangeDetailService').get(param).success(function (response) {
                $rootScope.loading = false;
                if (response.resultCode == '00') {
                    if (response.data.length > 0) {
                        $scope.list = $scope.list.concat(response.data);
                    }
                    $scope.finish = true;
                } else if (response.resultCode == '990008') {//验证authToken异常
                    $state.go('error');
                } else {
                    utils.toast(response.resultMsg);
                }
            }).error(function () {
                $state.go('netError');
            });
        }

    }]);
});