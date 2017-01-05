define(function (require) {
    var app = require('../../app');

    app.service('couponListService', ['$http', '$rootScope', function ($http, $rootScope) {
        return {
            get: function (page, pageSize, useStatus) {
                return $http({
                    method: 'POST',
                    data: {
                        page: page,
                        pageSize: pageSize,
                        useStatus: useStatus,
                        token: $rootScope.accessToken
                    },
                    url: "http://rap.taobao.org/syf-voucher/voucher/list"
                });
            }
        };
    }]);
});
