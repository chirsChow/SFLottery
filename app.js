define(function (require, exports, module) {

    var asyncLoader = require('angular-async-loader');

    require('angular-ui-router');

    var app = angular.module('app', ['ui.router']);

    //H5钱包地址
    app.constant("h5WalletUrl", "https://cpay-sit.sf-pay.com?serviceName=MEMBER_SFPAY_WALLET");
    //app.constant("h5WalletUrl", "https://zb.sf-pay.com?serviceName=MEMBER_SFPAY_WALLET");
    //顺丰彩专区入口地址
    app.constant("lotteryFrontUrl", "https://cpay-sit.sf-pay.com/syf-lottery/lottery/sfcRegion");
    //app.constant("lotteryFrontUrl", "https://lottery.sf-pay.com/syf-lottery/lottery/sfcRegion");
    //顺丰彩兑奖入口地址
    app.constant("exchangeFrontUrl", "https://cpay-sit.sf-pay.com/syf-lottery/lottery/lotteryRegion");
    //app.constant("exchangeFrontUrl", "https://lottery.sf-pay.com/syf-lottery/lottery/lotteryRegion");
    //获取官微OpenId地址
    app.constant("getWXOpenIdUrl", "http://ucmp-wx.sit.sf-express.com/service/weixin/sflot");
    //app.constant("getWXOpenIdUrl", "https://lottery.sf-pay.com/syf-lottery/sfc/mockGetWXOpenid");
    //绑定顺手付地址
    app.constant("bindSFPayUrl", "https://cpay-sit.sf-pay.com/syf-lottery/lottery/bind");
    //app.constant("bindSFPayUrl", "https://lottery.sf-pay.com/syf-lottery/lottery/bind");
    //购彩商城（优选）
    app.constant("lotteryShopUrl", "http://10.102.36.163:18083");
    //app.constant("lotteryShopUrl", "http://cp.sfbest.com");
    //顺手付APP下载页面
    app.constant("sfPayDownloadUrl", "https://m.sf-pay.com/sfpay-openapi/inviteFriends");

    asyncLoader.configure(app);

    module.exports = app;
});
