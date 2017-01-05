define(function (require) {
    var app = require('../../app');

    app.service('exchangeDetailService', ['$http', function ($http) {
        return {
            get: function (param) {
                //return $http.jsonp("http://rap.taobao.org/syf-lottery/lottery/orderListQuery");
                return $http.get('data/orderList.json');
            }
        };
    }]);
});
