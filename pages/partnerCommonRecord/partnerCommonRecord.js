// pages/partnerCommonRecord/partnerCommonRecord.js
var that;
var Util = require('../../utils/util.js');
var app = getApp();
Page({

  data: {
    urlHttp: '',
    id : 0,
    tabId : 0,//默认tab id
    recordList: {},//关系列表
    searchPageNum: 0,       // 设置加载的第几次，默认是第一次  
    callbackcount: 10,      //返回数据的个数  
    searchLoading: false,   //"上拉加载"的变量，默认false，隐藏  
    searchLoadingComplete: false, //“没有数据”的变量，默认false，隐藏  
    scrollTrue : false,//页面滚动
  },

  onLoad: function (options) {
    var that = this;
    var host = getApp().globalData.servsers;
    console.log(options.id)
    that.setData({
      urlHttp: host ,
      tabId: options.id
    })
  },

  onShow: function () {
    var that = this;
    var host = getApp().globalData.servsers;
    var un_id = getApp().globalData.un_id;
    var openid = getApp().globalData.openid;
    var userRole = getApp().globalData.userRole;
    var tabId = that.data.tabId;
    if ((un_id == undefined || un_id == '' || un_id == null) || (openid == undefined || openid == '' || openid == null)){
      wx.navigateTo({
        url: '/pages/authorize/authorize?link=partnerCommonRecord',
      })
    }else{
      if (tabId == 0) {
        //邀请客户
        that.recordPerson();
        wx.setNavigationBarTitle({
          title: '邀请客户'
        })

      } else {
        //收益记录
        that.recordEarnings();
        wx.setNavigationBarTitle({
          title: '收益记录'
        })

      }
    }
  },

  //tab切换
  tabChange:function(e){
    var that = this;
    var tabId = e.currentTarget.dataset.id;
    var tabIdOld = that.data.tabId;
    if (tabId == tabIdOld){
      return false;
    }else{
      that.setData({
        tabId: tabId,
        recordList: {},
        searchPageNum: 0,       // 设置加载的第几次，默认是第一次  
        callbackcount: 10,      //返回数据的个数  
        searchLoading: false,   //"上拉加载"的变量，默认false，隐藏  
        searchLoadingComplete: false, //“没有数据”的变量，默认false，隐藏  
        scrollTrue : false
      })
      if (tabId == 0) { 
        //邀请客户
        that.recordPerson();
        wx.setNavigationBarTitle({
          title: '邀请客户'
        })

      } else {
        //收益记录
        that.recordEarnings();
        wx.setNavigationBarTitle({
          title: '收益记录'
        })

      }
    }
  },

  //分页获取用户分销关系列表
  recordPerson:function(e){
    var that = this;
    var host = getApp().globalData.servsers;
    var un_id = getApp().globalData.un_id;
    var openid = getApp().globalData.openid;
    var userRole = getApp().globalData.userRole;
    wx.request({
      url: host + "api/distributeSell/getRelationList",
      data: {
        userId: un_id,//当前用户userId
        userRole: userRole,//用户角色 0 普通用户 1 商务用户
        offset: 0,
        limit: 10
      },
      method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      header: {
        'Accept': 'application/json'
      },
      success: function (res) {

        if (res.data.data.total == 10 ) {
          that.setData({
            recordList: res.data.data.rows,
            searchPageNum: 0,   //第一次加载，设置1  
            searchSongList: [],  //放置返回数据的数组,设为空  
            isFromSearch: true,  //第一次加载，设置true  
            searchLoading: true,  //把"上拉加载"的变量设为true，显示  
            searchLoadingComplete: false, //把“没有数据”设为false，隐藏 
            scrollTrue : true

          })
        } else if (res.data.data.total > 0 && res.data.data.total < 10){
          that.setData({
            recordList: res.data.data.rows,
            searchPageNum: 0,   //第一次加载，设置1  
            searchSongList: [],  //放置返回数据的数组,设为空  
            isFromSearch: true,  //第一次加载，设置true  
            searchLoading: false,  //把"上拉加载"的变量设为true，显示  
            searchLoadingComplete: false, //把“没有数据”设为false，隐藏 
            scrollTrue : true
          });
        }
        if (res == null || res.data == null) {
          console.error('网络请求失败');
          return;
        }
      }
    })

  },

  //收益记录
  recordEarnings:function(e){
    var that = this;
    var host = getApp().globalData.servsers;
    var un_id = getApp().globalData.un_id;
    var openid = getApp().globalData.openid;
    var userRole = getApp().globalData.userRole;
    wx.request({
      url: host + "api/distributeSell/getEarnList",
      data: {
        userId: un_id,//当前用户userId
        userRole: userRole,//用户角色 0 普通用户 1 商务用户
        offset: 0,
        limit: 10
      },
      method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      header: {
        'Accept': 'application/json'
      },
      success: function (res) {
        console.log(res);

        if (res.data.data.total == 10) {
          that.setData({
            recordList: res.data.data.rows,
            searchPageNum: 0,   //第一次加载，设置1  
            searchSongList: [],  //放置返回数据的数组,设为空  
            isFromSearch: true,  //第一次加载，设置true  
            searchLoading: true,  //把"上拉加载"的变量设为true，显示  
            searchLoadingComplete: false, //把“没有数据”设为false，隐藏 
            scrollTrue : true

          })
        } else if (res.data.data.total > 0 && res.data.data.total < 10) {
          that.setData({
            recordList: res.data.data.rows,
            searchPageNum: 0,   //第一次加载，设置1  
            searchSongList: [],  //放置返回数据的数组,设为空  
            isFromSearch: true,  //第一次加载，设置true  
            searchLoading: false,  //把"上拉加载"的变量设为true，显示  
            searchLoadingComplete: false, //把“没有数据”设为false，隐藏 
            scrollTrue : true
          });
        }

        if (res == null || res.data == null) {
          console.error('网络请求失败');
          return;
        }
      }
    })
  },

  fetchSearchList: function () {//加载更多
    var that = this;
    var host = getApp().globalData.servsers;
    var un_id = getApp().globalData.un_id;
    var openid = getApp().globalData.openid;
    var userRole = getApp().globalData.userRole;
    var tabId = that.data.tabId;

    if (tabId == 0){
        //关系列表
      wx.request({
        url: host + "api/distributeSell/getRelationList",
        data: {
          userId: un_id,//当前用户userId
          userRole: userRole,//用户角色 0 普通用户 1 商务用户
          offset: parseInt(that.data.searchPageNum),
          limit: 10
        },
        method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
        header: {
          'Accept': 'application/json'
        },
        success: function (res) {

          if (res.data.data.total > 0) {
            let recordList = [];
            //如果isFromSearch是true从data中取出数据，否则先从原来的数据继续添加  
            that.data.isFromSearch ? recordList = res.data.data.rows : recordList = that.data.recordList.concat(res.data.data.rows)
            that.setData({
              recordList: recordList, //获取数据数组   
              searchLoading: true ,  //把"上拉加载"的变量设为false，显示  
              scrollTrue : true
            }); 
          } else {
            that.setData({
              searchLoadingComplete: true, //把“没有数据”设为true，显示  
              searchLoading: false , //把"上拉加载"的变量设为false，隐藏  
              scrollTrue: true
            });
          }
          if (res == null || res.data == null) {
            console.error('网络请求失败');
            return;
          }
        }
      })

    }else{
      //收益记录
      wx.request({
        url: host + "api/distributeSell/getEarnList",
        data: {
          userId: un_id,//当前用户userId
          userRole: userRole,//用户角色 0 普通用户 1 商务用户
          offset: parseInt(that.data.searchPageNum),
          limit: 10
        },
        method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
        header: {
          'Accept': 'application/json'
        },
        success: function (res) {

          if (res.data.data.total > 0) {
            let recordList = [];
            //如果isFromSearch是true从data中取出数据，否则先从原来的数据继续添加  
            that.data.isFromSearch ? recordList = res.data.data.rows : recordList = that.data.recordList.concat(res.data.data.rows)
            that.setData({
              recordList: recordList, //获取数据数组   
              searchLoading: true,   //把"上拉加载"的变量设为false，显示  
              scrollTrue: true
            }); 
          } else{
            that.setData({
              searchLoadingComplete: true, //把“没有数据”设为true，显示  
              searchLoading: false,  //把"上拉加载"的变量设为false，隐藏  
              scrollTrue: true
            });
          }
          if (res == null || res.data == null) {
            console.error('网络请求失败');
            return;
          }
        }
      })
    }

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
  },  

  //下拉刷新
  onPullDownRefresh: function () {
    var that = this;
    var tabId = that.data.tabId;
    // if (tabId == 0){
    //   that.recordPerson();
    // }else{
    //   that.recordEarnings();
    // }

  },

})