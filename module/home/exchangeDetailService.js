define(function (require) {
    var app = require('../../app');

    app.service('exchangeDetailService', ['$http', function ($http) {
        return {
            get: function (param) {
                return $http({
                    method: 'POST',
                    data: {
                        status:param.status,	//兑奖状态	不填写返回全部
                        page:param.page,	//开始页码	默认第一页
                        pageSize:param.pageSize	//页显示条数	默认10

                    },
                    url: "http://rap.taobao.org/syf-lottery/lottery/orderListQuery"
                });
            }
        };
    }]);
});
