/**
 * Created by 837781 on 2016/9/12.
 */
define(['require', 'app'], function (require, app) {
    app
        .factory('utils', ['$rootScope', '$state', '$timeout', function ($rootScope, $state, $timeout) {
            return {
                browser: function () {
                    var u = navigator.userAgent;
                    return {
                        trident: u.indexOf('Trident') > -1,
                        presto: u.indexOf('Presto') > -1,
                        webKit: u.indexOf('AppleWebKit') > -1,
                        gecko: u.indexOf('Gecko') > -1 && u.indexOf('KHTML') == -1,
                        mobile: !!u.match(/AppleWebKit.*Mobile.*/) || !!u.match(/AppleWebKit/),
                        ios: !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/),
                        android: u.indexOf('Android') > -1 || u.indexOf('Linux') > -1,
                        iPhone: u.indexOf('iPhone') > -1 || u.indexOf('Mac') > -1,
                        iPad: u.indexOf('iPad') > -1,
                        webApp: u.indexOf('Safari') == -1,
                        weChat: u.indexOf('MicroMessenger') > -1,
                        aliPay: u.indexOf('AlipayDefined') > -1,
                        onePlus: u.indexOf('A0001') > -1 || u.indexOf('A1001') > -1,
                        meiZu: u.indexOf('M351') > -1 || u.indexOf('M353') > -1,
                        sfPay: u.indexOf('[SF-V') > -1,//是顺手付浏览器
                        sfExpress: u.indexOf('SFEXPRESSAPP') > -1,//是速运通浏览器
                        uc: u.indexOf('UCBrowser') > -1//是UC浏览器
                    }
                },
                toast: function (message) {
                    if (message && message != '') {
                        $rootScope.toastStyle = 'toast';
                        $rootScope.toastMessage = message;
                        var t = $timeout(function () {
                            $rootScope.toastStyle = "hidden";
                            $timeout.cancel(t);
                        }, 1500)
                    }
                },
                urlparse: function () {
                    var urlSearch = location.search,
                        urlHash = location.hash,
                        urlParams = [],
                        endpoints = {},
                        kvs = [];
                    var href = location.href;
                    if (href.indexOf('?#/') > 0) {
                        href = href.substring(0, href.indexOf('?#/')) + href.substr(href.indexOf('?#/') + 1);
                    }
                    if (href.indexOf('#/') < href.indexOf('?')) {
                        var hrefParams = href.split('?');
                        urlSearch = hrefParams[1];
                        if (hrefParams[0].indexOf('#/') > 0) {
                            urlHash = hrefParams[0].split('#/')[1];
                        }
                    }
                    urlSearch = urlSearch.indexOf('?') == 0 ? urlSearch.slice(1) : urlSearch;
                    urlSearch = urlSearch == '' ? urlHash : urlSearch;
                    urlSearch = urlSearch.indexOf('#/?') == 0 ? urlSearch.slice(3) : urlSearch;
                    urlParams = urlSearch != '' ? urlSearch.split('&') : [];
                    var len = urlParams.length;
                    for (var i = 0; i < len; i++) {
                        kvs = urlParams[i].split('=');
                        endpoints[kvs[0]] = kvs.length > 1 ? kvs[1] : '';
                    }
                    return endpoints;
                },
                viewWalletBalance: function () {
                    //如果是顺手付扫码进入，则打开顺手付余额界面，
                    if ($rootScope.sourceType == 'APP-SYPAY') {
                        app.get('startBalance')();
                        //唤起顺手付，不能唤起进入下载顺手付页面
                    } else if ($rootScope.sourceType == 'OTHER') {
                        app.get('invokeSFApp')();
                        $state.go('download');
                        //去顺丰彩专区查看余额
                    } else {
                        $state.go('home');
                    }
                },
                getLocation: function (successCallback, failCallback, scope) {
                    if (navigator.geolocation) {
                        navigator.geolocation.getCurrentPosition(successCallback, showError);
                    } else {
                        scope.showPosition = "浏览器不支付定位";
                    }
                    function showError(error) {
                        failCallback();
                        switch (error.code) {
                            case error.PERMISSION_DENIED:
                                scope.showPosition = "定位失败，用户拒绝请求地理定位";
                                break;
                            case error.POSITION_UNAVAILABLE:
                                scope.showPosition = "定位失败，位置信息是不可用";
                                break;
                            case error.TIMEOUT:
                                scope.showPosition = "定位失败，请求获取用户位置超时";
                                break;
                            case error.UNKNOWN_ERROR:
                                scope.showPosition = "定位失败，定位系统失效";
                                break;
                            default :
                                scope.showPosition = "定位失败";
                                break;
                        }
                        scope.$apply();
                    }
                },
                getLocationInfo: function (position, geocoder_CallBack) {
                    var lnglatXY = [position.coords.longitude, position.coords.latitude];
                    //逆地理编码
                    var geocoder = new AMap.Geocoder({
                        radius: 1000,
                        extensions: "all"
                    });
                    geocoder.getAddress(lnglatXY, function (status, result) {
                        if (status === 'complete' && result.info === 'OK') {
                            geocoder_CallBack(result);
                        }else{
                            alert("获取地址失败");
                        }
                    });
                }
            };
        }]);

});