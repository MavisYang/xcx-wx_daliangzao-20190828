// index.js

//专题
var contentList = [
];

//商品
var goodsList = [
 
];

Page({

  /**
   * 页面的初始数据
   */
  data: {
    contentList: contentList,
    goodsList: goodsList,
    currentItem : 1,
    showcont : 1
  },
  onLoad: function (options) {
    var classid = options.com_id;
    var name = options.name

    wx.setNavigationBarTitle({
      title: name
    })
    that = this;
    var host = getApp().globalData.servsers;
    var un_id = getApp().globalData.un_id;
    if (un_id != undefined && un_id != '' && un_id != null){
      wx.request({
        url: host + "findapi/findMyforxcx",
        data: {
          user_id: un_id
        },
        method: 'GET',
        header: {
          'Accept': 'application/json'
        },
        success: function (res) {
          var size = res.data.total;
          that.setData({
            contentList: res.data.rows,
          });
          if (res == null || res.data == null) {
            console.error('网络请求失败');
            return;
          }
        }
      })

      wx.request({
        url: host + "collectionapi/selectcommodity",
        data: {
          user_id: un_id
        },
        method: 'GET',
        header: {
          'Accept': 'application/json'
        },
        success: function (res) {
          var size = res.data.total;
          that.setData({
            goodsList: res.data.rows,
          });
          if (res == null || res.data == null) {
            console.error('网络请求失败');
            return;
          }
        }
      })  

    }
   
        
  },
  navChange: function (options){
    var that = this
    var id = options.currentTarget.dataset.id;
    that.setData({
      'currentItem': id,
      'showcont' : id
    })
  },
  onShow: function (options){
    var that = this;
    var host = getApp().globalData.servsers;
    var un_id = getApp().globalData.un_id;

    if (un_id != undefined && un_id != '' && un_id != null){
      wx.request({
        url: host + "findapi/findMyforxcx",
        data: {
          user_id: un_id
        },
        method: 'GET',
        header: {
          'Accept': 'application/json'
        },
        success: function (res) {
          var size = res.data.total;
          that.setData({
            contentList: res.data.rows,
          });
          if (res == null || res.data == null) {
            console.error('网络请求失败');
            return;
          }
        }
      })
      
      wx.request({
        url: host + "collectionapi/selectcommodity",
        data: {
          user_id: un_id
        },
        method: 'GET',
        header: {
          'Accept': 'application/json'
        },
        success: function (res) {
          var size = res.data.total;
          that.setData({
            goodsList: res.data.rows,
          });
          if (res == null || res.data == null) {
            console.error('网络请求失败');
            return;
          }
        }
      })  
    }
        
  }
  
})
var that;
var Util = require('../../utils/util.js'); 