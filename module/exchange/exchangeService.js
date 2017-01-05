define(function (require) {
    var app = require('../../app');

    app.factory('exchangeService', ['$http', function ($http) {
        return {
            exchange: function (params) {
                //return $http.jsonp("http://rap.taobao.org/syf-lottery/lottery/exchange");
                return $http.get('data/exchange.json');
            },
            query: function (orderId) {
                //return $http.jsonp("http://rap.taobao.org/syf-lottery/lottery/queryBatchPayOrderStatus");
                return $http.get('data/queryStatus.json');
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
