define(function (require) {
    var app = require('../../app');

    app.factory('exchangeService', ['$http', function ($http) {
        return {
            exchange: function (params) {
                return $http({
                    method: 'POST',
                    data: {
                        platform: "H5",
                        lotterySn: params.lotterySn,
                        lotteryPayNo: params.lotteryPayNo,
                        sourceCode: params.sourceCode,
                        payStyle: params.payStyle
                    },
                    url: "http://rap.taobao.org/syf-lottery/lottery/exchange"
                });
            },
            query: function (orderId) {
                return $http({
                    method: 'POST',
                    data: {
                        orderId: orderId
                    },
                    url: "http://rap.taobao.org/syf-lottery/lottery/queryBatchPayOrderStatus"
                });
            },
            //速运和顺手付使用，防止location.href的页面闪烁
            href: function (url) {
                return $http({
                    method: 'GET',
                    data: {},
                    url: url
                });
            }
        }
    }]);
});
