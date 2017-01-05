//下载App界面 hash:download
define(function (require) {
    var app = require('../../app');

    app
    .controller('downloadCtrl', ['$scope', '$sce', 'sfPayDownloadUrl', function ($scope, $sce, sfPayDownloadUrl) {
        $scope.goBack = function () {
            window.history.back();
        };
        window.onBack = function () {
            $scope.goBack();
        };
        $scope.downloadUrl = $sce.trustAsResourceUrl(sfPayDownloadUrl);
    }]);
});