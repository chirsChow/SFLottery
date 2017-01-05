/**
 * Created by 837781 on 2016/8/25.
 */
define(function (require) {
    var app = require('../app');
    app
        .factory('Alert', ['$compile', '$document', function ($compile, $document) {
            return function (scope, message) {
                if (!message) return;
                message = message.replace(/\s+/g, "");
                var bbBox = $compile('<bb-alert msg=' + message + '></bb-alert>')(scope);
                $document.find('body').append(bbBox);
            }
        }])
        .factory('Confirm', ['$compile', '$document', function ($compile, $document) {
            return function (scope, msg, callback) {
                if (!msg) return;
                if (!angular.isFunction(callback)) return;
                scope._callback = function () {
                    callback();
                    bbBox.remove();
                };
                msg = msg.replace(/\s+/g, "");
                var bbBox = $compile('<bb-confirm msg=' + msg + ' ok-callback="_callback()"></bb-confirm>')(scope);
                $document.find('body').append(bbBox);
            }
        }]);
});