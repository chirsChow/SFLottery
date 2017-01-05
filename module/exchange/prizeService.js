define(function (require) {
    var app = require('../../app');

    app.service('queryPrizeService', ['$http', function ($http) {
        return {
            get: function (orderId) {
                return $http({
                    method: 'POST',
                    data: {
                        orderId: orderId
                    },
                    url: "http://rap.taobao.org/syf-lottery/lottery/queryBatchPay"
                });
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
