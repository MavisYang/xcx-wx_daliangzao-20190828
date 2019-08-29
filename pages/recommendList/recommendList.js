// kindSecondList.js
//获取应用实例
var app = getApp();
//导航标题
var navigationBarTitle = {};

//二级菜单项
var navlist = [];

// 列表
var contentList = [];

Page({
  data: {
    pageNo: 1,
    activeIndex: 0,
    navList: navlist,
    contentList: contentList,
    navId: 0,
    systemInfo: [],
    loadingHidden: false,
    list: [],
    num: 1,
    limt: 20,
    tab: '',
    classify_name: '',
    classify_des: '',
    currentItem: 0,
    searchPageNum: 0,   // 设置加载的第几次，默认是第一次  
    callbackcount: 15,      //返回数据的个数  
    searchLoading: false, //"上拉加载"的变量，默认false，隐藏  
    searchLoadingComplete: false  //“没有数据”的变量，默认false，隐藏  
  },
  onLoad: function (options) {

    that = this;
    var host = getApp().globalData.servsers;
    //热销
    wx.request({
      url: host+"commodityapi/findAllforNewproduct",
      data: {
        commodity_recommend: '2',
        offset: parseInt(that.data.searchPageNum) * 10,
        limit: 10,

      },
      method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      header: {
        'Accept': 'application/json'
      },
      success: function (res) { 
        that.setData({
          contentList: res.data.rows,
          searchPageNum: 1,   //第一次加载，设置1  
          searchSongList: [],  //放置返回数据的数组,设为空  
          isFromSearch: true,  //第一次加载，设置true  
          searchLoading: true,  //把"上拉加载"的变量设为true，显示  
          searchLoadingComplete: false //把“没有数据”设为false，隐藏 
        });
        if (res == null || res.data == null) {
          console.error('网络请求失败');
          return;
        }
      }
    });


    // wx.setNavigationBarTitle({
    //   title: navigationBarTitle.title
    // })
    this.setData({
      classify_name: options.classify_name,
      classify_des: options.classify_des,
    })
  },
  //切换TAB
  tagChoose: function (options) {
    var that = this
    var id = options.currentTarget.dataset.id;
    //设置当前样式
    that.setData({
      'firstActive': "",
      'currentItem': id
    })
  },
  fetchSearchList: function () {//加载更多

    var that = this;
    var host = getApp().globalData.servsers;
    wx.request({
      url: host + "commodityapi/findAllforNewproduct",
      data: {
        commodity_recommend: that.data.searchPageNum,
        offset: parseInt(that.data.searchPageNum) * 10,
        limit: 10,

      },
      method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      header: {
        'Accept': 'application/json'
      },
      success: function (res) {
        if (res.data.rows.length != 0) {
          let contentList = [];
          //如果isFromSearch是true从data中取出数据，否则先从原来的数据继续添加  
          that.data.isFromSearch ? contentList = res.data.rows : contentList = that.data.contentList.concat(res.data.rows)
          that.setData({
            contentList: contentList, //获取数据数组   
            searchLoading: true   //把"上拉加载"的变量设为false，显示  
          });
          //没有数据了，把“没有数据”显示，把“上拉加载”隐藏  
        } else {
          console.log(22);
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
    console.log(that.data.searchLoading);
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