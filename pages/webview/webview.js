// pages/webview/webview.js
var app = getApp() ;
Page({

  data: {
    hiddenmodal : true,
    webUrl : '',
    order_aff_num :'',//订单号
    order_aff_id : '',//商品id
    order_aff_gg_id :'',//规格id
    order_gy_id : '',//工艺id
    unionid: ''//unionid
  },
  onLoad: function (options) {
    var that = this;
    wx.getSystemInfo({
      success: function (res) {
        var version = res.SDKVersion;
        version = version.replace(/\./g, "")
        console.log(version)
        if (parseInt(version) < 164) {// 小于1.6.4的版本
          that.setData({
            hiddenmodal: false
          })
          setTimeout(function () {
            that.setData({
              hiddenmodal: true
            })
            wx.navigateBack({//返回订单页
              delta: 1
            })
          }, 4000)
          
        }
      }
    })
    
    var host = getApp().globalData.servsers;
    var img2 = options.img2;
    var order_sta = options.order_sta;

    var order_aff_num = options.order_aff_num;
    var order_aff_id = options.order_aff_id;
    var order_aff_gg_id = options.order_aff_gg_id;
    var order_gy_id = options.order_gy_id;
    var order_aff_dz_id = options.order_aff_dz_id;

    console.log(order_aff_dz_id);

    if (order_aff_dz_id == undefined){
      order_aff_dz_id = 'null';
    }
    var unionid = options.unionid;

    var webUrl = '';
    if (order_sta > 2) {//定制完成后的预览

      webUrl = 'customization/index_jpg?order_aff_dz_id=' + order_aff_dz_id;
    
    }else{

      webUrl = 'customization/index?order_aff_num=' + order_aff_num + '&order_aff_id=' + order_aff_id + '&order_aff_gg_id=' + order_aff_gg_id + '&order_gy_id=' + order_gy_id + '&order_aff_dz_id=' + order_aff_dz_id + '&unionid=' + unionid;

    }
    that.setData({
      webUrl: host + webUrl
    })

  }
})
var that;
var Util = require('../../utils/util.js'); 