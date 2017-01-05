define(function (require) {
    var app = require('../../app');

    app.service('queryPrizeService', ['$http', function ($http) {
        return {
            get: function (orderId) {
                //return $http.jsonp("http://rap.taobao.org/syf-lottery/lottery/queryBatchPay");
                return $http.get('data/queryPay.json');
            }
        };
    }])
    .service('addressListService', ['$http', function ($http) {
        return {
            query: function () {
                return $http.get("data/adress.json");
            }
        };
    }]);
});
