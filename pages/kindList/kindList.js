// kindList.js
var app = getApp()
Page({
  data: {
    contentList: [],
    name:''
  },
  onLoad: function (options) {
    var classid = options.com_id  ;
    var name = options.name 
    wx.setNavigationBarTitle({
      title: name
    })
    that = this;
    var host = getApp().globalData.servsers;
    //品牌定制
    wx.request({
      url: host +"findapi/findAllxcx",
      data: {
        id: classid
      },
      method: 'GET',
      header: {
        'Accept': 'application/json'
      },
      success: function (res) {
        var size = res.data.total;

        that.setData({
          contentList: res.data.rows,
          name: name
        });
        console.log(res.data.rows);
        if (res == null || res.data == null) {
          console.error('网络请求失败');
          return;
        }
      }
    })
  },
  //下拉刷新
  onPullDownRefresh: function (e) {
    this.onLoad();
    wx.stopPullDownRefresh();
  }
})

var contentList = []
var that;
var Util = require('../../utils/util.js'); 