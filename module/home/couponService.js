define(function (require) {
    var app = require('../../app');

    app.service('couponListService', ['$http', '$rootScope', function ($http, $rootScope) {
        return {
            get: function (page, pageSize, useStatus) {
                //return $http.jsonp("http://rap.taobao.org/syf-voucher/voucher/list");
                return $http.get('data/voucherList.json');
            }
        };
    }]);
});
