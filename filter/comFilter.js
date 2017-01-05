'use strict';
define(['app'],function (app) {
		app
		.filter('subStrForStar', function () {//用*替换一些字符
			return function (input) {
				if (input == null || typeof(input) == "undefined"){
					return "";
				}
				if (input.length > 3) {
					var s = input.substring(0, 1);
					var e = input.substring(input.length - 1, input.length);
					return s + "****************" + e;
				} else if (input.length > 1) {
					return input.substring(0, 1) + "**";
				}
				return input;
			};
		})
		.filter('subStrForStar_phone', function () {//用*替换一些字符
			return function (input) {
				if (input == null || typeof(input) == "undefined"){
					return "";
				}
				if (input.length > 3) {
					var s = input.substring(0, 3);
					var e = input.substring(input.length - 4, input.length);
					return s + "****" + e;
				}
				return input;
			};
		})
		.filter('AvaBalance', function () {//可用余额格式化(单位是分)
			return function (input) {
				if (input == null || typeof(input) == "undefined") {
					return "";
				}
				return parseFloat(input / 100).toFixed(2);
			};
		})
		.filter('lotteryNoSplit', function () {//彩票编码用'-'分隔
			return function (input) {
				if (input == null || typeof(input) == "undefined") {
					return "";
				}
				input = input.replace(/\s/g, '');
				if (input.length == 16 || input.length == 18) {
					var temp = '';
					angular.forEach(input, function (i) {
						temp = temp + i;
						if (temp.length >= 3 && temp.length <= 4) {
							temp = temp.replace(/\s/g, '').replace(/(\d{2})(?=\d)/g, '$1-');
						} else if (temp.length >= 6 && temp.length <= 10) {
							temp = temp.replace(/\s/g, '').replace(/(\d{2}[-]+\d{4})(?=\d)/g, '$1-');
						} else if (temp.length >= 12) {
							if (input.length == 16) {
								temp = temp.replace(/\s/g, '').replace(/(\d{2}[-]+\d{4}[-]+\d{7})(?=\d)/g, '$1-');
							}
							if (input.length == 18) {
								temp = temp.replace(/\s/g, '').replace(/(\d{2}[-]+\d{4}[-]+\d{9})(?=\d)/g, '$1-');
							}
						}
					});
					return temp;
				} else {
					return input.replace(/(\d{4})(?=\d)/g, '$1-');
				}
			};
		})
		/**
		 * 规则
		 * 1分
		 * 1元
		 * 10元
		 * 100元
		 * 当转化成元为整数时，不显示小数位
 		 */
		.filter('cent2yuanforvoucher', function () {//分转成元，无小数点
			return function (input) {
				if (input == null || typeof(input) == "undefined") {
					return "";
				}
				var input0 = parseFloat(input / 100).toFixed(0);//不留小数位
				if (input0 * 100 == input) {//传化元为整数
					return input0+"元";//单位元
				} else {
					return input+"分";//单位分
				}
			};
		})
		.filter('cent2yuanforvoucherdiget', function () {//分转成元，无小数点
			return function (input) {
				if (input == null || typeof(input) == "undefined") {
					return "";
				}
				var input0 = parseFloat(input / 100).toFixed(0);//不留小数位
				if (input0 * 100 == input) {//传化元为整数
					return input0;//单位元
				} else {
					return input;//单位分
				}
			};
		})
		.filter('cent2yuanforvoucherunit', function () {//分转成元，无小数点
			return function (input) {
				if (input == null || typeof(input) == "undefined") {
					return "";
				}
				var input0 = parseFloat(input / 100).toFixed(0);//不留小数位
				if (input0 * 100 == input) {//传化元为整数
					return "元";
				} else {
					return "分"
				}
			};
		})
		//金额前的人民币符号
		.filter('RMBPrefix', function () {
			return function (input) {
				if (input == null || typeof(input) == "undefined") {
					return "";
				}
				return "\u00A5" + input;
			};
		});
});
