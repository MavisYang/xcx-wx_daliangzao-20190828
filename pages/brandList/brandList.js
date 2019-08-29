// brandList.js
//获取应用实例
var brandList = [
  {}
];
var app = getApp()
Page({
  data: {
    brandList: brandList,
    page: 1,
    hasMore: true,
    isFromSearch: true,   // 用于判断searchSongList数组是不是空数组，默认true，空的数组  
    searchPageNum: 0,   // 设置加载的第几次，默认是第一次  
    callbackcount: 10,      //返回数据的个数  
    searchLoading: false, //"上拉加载"的变量，默认false，隐藏  
    searchLoadingComplete: false  //“没有数据”的变量，默认false，隐藏  
  },

  onLoad: function () {
    var that = this;
    var host = getApp().globalData.servsers;
    //品牌定制
    wx.request({
      url: host + "brandapi/brandall",
      data: {
        offset: 0,
        limit : 10
      },
      method: 'GET',
      header: {
        'Accept': 'application/json'
      },
      success: function (res) {
        var size = res.data.total;
        that.setData({
          brandList: res.data.rows,
          searchPageNum: 0,   //第一次加载，设置1  
          isFromSearch: true,  //第一次加载，设置true  
          searchLoading: true,  //把"上拉加载"的变量设为true，显示  
          searchLoadingComplete: false //把“没有数据”设为false，隐藏 
        });
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
  },

  fetchSearchList: function () {//加载更多

    var that = this;
    var host = getApp().globalData.servsers;
    wx.request({
      url: host + "brandapi/brandall",
      data: {
        offset: parseInt(that.data.searchPageNum)*10
      },
      method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      header: {
        'Accept': 'application/json'
      },
      success: function (res) {

        if (res.data.rows.length != 0) {
          let searchList  = [];
          //如果isFromSearch是true从data中取出数据，否则先从原来的数据继续添加 
          that.data.isFromSearch ? searchList = res.data.rows : searchList  = that.data.brandList.concat(res.data.rows)
          that.setData({
            brandList: searchList , //获取数据数组   
            searchLoading: true   //把"上拉加载"的变量设为false，显示  
          });
          //没有数据了，把“没有数据”显示，把“上拉加载”隐藏  
        } else {
          that.setData({
            searchLoadingComplete: true, //把“没有数据”设为true，显示  
            searchLoading: false  //把"上拉加载"的变量设为false，隐藏  
          });
        }

        if (res == null || res.data == null) {
          console.error('网络请求失败');
          return;
        }
        wx.hideNavigationBarLoading(
          that.setData({
            hidden: 'hidden'
          })
        )
      }
    });
  },
  //滚动到底部触发事件  
  searchScrollLower: function () {
    var that = this;
    if (that.data.searchLoading && !that.data.searchLoadingComplete) {
      that.setData({
        searchPageNum: that.data.searchPageNum + 1,  //每次触发上拉事件，把searchPageNum+1  
        isFromSearch: false  //触发到上拉事件，把isFromSearch设为为false  
      });
      that.fetchSearchList();
    }
  }  

})

var that;
var Util = require('../../utils/util.js'); 


