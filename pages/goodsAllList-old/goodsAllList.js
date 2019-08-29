// goodsAllList.js
//获取应用实例
var app = getApp();

// 列表
var contentList = [];
var conditionTab = [
  { id: 31, scene_name: 'For her' },
  { id: 32, scene_name: 'For him' },
  { id: -2, scene_name: 'New' },
  { id: -3, scene_name: 'SALE' }
];

Page({
  data: {
    conditionTab: conditionTab,
    contentList: contentList,
    loadingHidden: false,
    searchPageNum: 0,   // 设置加载的第几次，默认是第一次  
    limt: 10,
    callbackcount: 15,      //返回数据的个数  
    searchLoading: false, //"上拉加载"的变量，默认false，隐藏  
    searchLoadingComplete: false,  //“没有数据”的变量，默认false，隐藏  
    kindId: '',  //当前页面 - 礼物盒ID
    selectId : -1,
    objectId : -1 , //默认送礼对象的id
    filtrateId : 0 , //默认筛选条件【价钱1-2、销量3-4、起订量5-6、定制周期7-8   的  由高到低   还是   由低到高】

    priceIcon: '/images/sort_icon_default.png', //价钱icon默认
    priceId: 0, //价钱默认id
    countIcon: '/images/sort_icon_default.png', //销量icon默认
    countId: 0, //销量默认id
    orderIcon: '/images/sort_icon_default.png', //起订量icon默认
    orderId: 0, //起订量默认id
    cycleIcon: '/images/sort_icon_default.png', //定制周期icon默认
    cycleId: 0, //定制周期默认id
  },
  onLoad: function (options) {
    var that = this;
    var host = getApp().globalData.servsers;
    //全部商品
    wx.request({
      url: host +"commodityapi/findAllforNewproduct",
      data: {
        offset: 0,
        limit: 10
      },
      method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      header: {
        'Accept': 'application/json'
      },
      success: function (res) { 
        that.setData({
          contentList: res.data.rows,
          searchPageNum: 0,   //第一次加载，设置1  
          searchSongList: [],  //放置返回数据的数组,设为空  
          isFromSearch: true,  //第一次加载，设置true  
          searchLoading: true,  //把"上拉加载"的变量设为true，显示  
          searchLoadingComplete: false //把“没有数据”设为false，隐藏 
        });
        if (res.data.rows.length < 10) {
          that.setData({
            searchPageNum: 0,   //第一次加载，设置1  
            searchSongList: [],  //放置返回数据的数组,设为空  
            isFromSearch: true,  //第一次加载，设置true  
            searchLoading: false,  //把"上拉加载"的变量设为true，显示  
            searchLoadingComplete: false //把“没有数据”设为false，隐藏 
          });
        }
        if (res == null || res.data == null) {
          console.error('网络请求失败');
          return;
        }
      }
    });
  },
  fetchSearchList: function () {//加载更多
    var that = this;
    var host = getApp().globalData.servsers;

    var objectId = that.data.objectId;//筛选条件第一行选择
    var filtrateId = that.data.filtrateId;//筛选排序

    if (objectId>0){
      wx.request({
        url: host + "commodityapi/findAllforNewproduct",
        data: {
          commodity_object: objectId,
          sort_type: filtrateId,
          offset: parseInt(that.data.searchPageNum) * 10
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
    } else if (objectId == -2) {//点击的是推荐类型 - New[新品]
      wx.request({
        url: host + "commodityapi/findAllforNewproduct",
        data: {
          commodity_recommend: '1',
          sort_type: filtrateId,
          offset: parseInt(that.data.searchPageNum) * 10
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
    } else if (objectId == -3) {//点击的是推荐类型 - SALE[打折品]
      wx.request({
        url: host + "commodityapi/findAllforNewproduct",
        data: {
          commodity_recommend: '3',
          sort_type: filtrateId,
          offset: parseInt(that.data.searchPageNum) * 10
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
  } ,

   //送礼对象 - 筛选
  objectType:function(e){
    var that = this;
    var host = getApp().globalData.servsers;

    var id = e.currentTarget.dataset.id;
    var objectId = e.currentTarget.dataset.flagid;//查询id
    var filtrateId = that.data.filtrateId;//筛选排序

    if (objectId > 0){//点击的是选礼对象
      wx.request({
        url: host + "commodityapi/findAllforNewproduct",
        data: {
          commodity_object: objectId,
          sort_type: filtrateId,
          offset: 0,
          limit: 10
        },
        method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
        header: {
          'Accept': 'application/json'
        },
        success: function (res) {
          that.setData({
            contentList: res.data.rows,
            objectId: objectId,
            selectId : id,
            searchPageNum: 0,   //第一次加载，设置1  
            searchSongList: [],  //放置返回数据的数组,设为空  
            isFromSearch: true,  //第一次加载，设置true  
            searchLoading: true,  //把"上拉加载"的变量设为true，显示  
            searchLoadingComplete: false //把“没有数据”设为false，隐藏 
          });
          if (res.data.rows.length < 10) {
            that.setData({
              searchPageNum: 0,   //第一次加载，设置1  
              searchSongList: [],  //放置返回数据的数组,设为空  
              isFromSearch: true,  //第一次加载，设置true  
              searchLoading: false,  //把"上拉加载"的变量设为true，显示  
              searchLoadingComplete: false //把“没有数据”设为false，隐藏 
            });
          }
          if (res == null || res.data == null) {
            console.error('网络请求失败');
            return;
          }
        }
      });
    } else if (objectId == -2){//点击的是推荐类型 - New[新品]
      wx.request({
        url: host + "commodityapi/findAllforNewproduct",
        data: {
          commodity_recommend: '1',
          sort_type: filtrateId,
          offset: 0,
          limit: 10
        },
        method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
        header: {
          'Accept': 'application/json'
        },
        success: function (res) {
          that.setData({
            contentList: res.data.rows,
            objectId: objectId,
            selectId: id,
            searchPageNum: 0,   //第一次加载，设置1  
            searchSongList: [],  //放置返回数据的数组,设为空  
            isFromSearch: true,  //第一次加载，设置true  
            searchLoading: true,  //把"上拉加载"的变量设为true，显示  
            searchLoadingComplete: false //把“没有数据”设为false，隐藏 
          });
          if (res.data.rows.length < 10) {
            that.setData({
              searchPageNum: 0,   //第一次加载，设置1  
              searchSongList: [],  //放置返回数据的数组,设为空  
              isFromSearch: true,  //第一次加载，设置true  
              searchLoading: false,  //把"上拉加载"的变量设为true，显示  
              searchLoadingComplete: false //把“没有数据”设为false，隐藏 
            });
          }
          if (res == null || res.data == null) {
            console.error('网络请求失败');
            return;
          }
        }
      });
    } else if (objectId == -3) {//点击的是推荐类型 - SALE[打折品]
      wx.request({
        url: host + "commodityapi/findAllforNewproduct",
        data: {
          commodity_recommend: '3',
          sort_type: filtrateId,
          offset: 0,
          limit: 10
        },
        method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
        header: {
          'Accept': 'application/json'
        },
        success: function (res) {
          that.setData({
            contentList: res.data.rows,
            objectId: objectId,
            selectId: id,
            searchPageNum: 0,   //第一次加载，设置1  
            searchSongList: [],  //放置返回数据的数组,设为空  
            isFromSearch: true,  //第一次加载，设置true  
            searchLoading: true,  //把"上拉加载"的变量设为true，显示  
            searchLoadingComplete: false //把“没有数据”设为false，隐藏 
          });
          if (res.data.rows.length < 10) {
            that.setData({
              searchPageNum: 0,   //第一次加载，设置1  
              searchSongList: [],  //放置返回数据的数组,设为空  
              isFromSearch: true,  //第一次加载，设置true  
              searchLoading: false,  //把"上拉加载"的变量设为true，显示  
              searchLoadingComplete: false //把“没有数据”设为false，隐藏 
            });
          }
          if (res == null || res.data == null) {
            console.error('网络请求失败');
            return;
          }
        }
      });
    }

  },

  //排序 先升序[箭头向上]，后降序[箭头向下]
  priceChange:function(e){
    var that = this;
    var host = getApp().globalData.servsers;

    var objectId = that.data.objectId;//查询id
    var flag = e.currentTarget.dataset.flag;//当前排序类型
    var priceIcon = that.data.priceIcon;
    var countIcon = that.data.countIcon;
    var orderIcon = that.data.orderIcon;
    var cycleIcon = that.data.cycleIcon;
    var filtrateId = that.data.filtrateId;//当前排序值

    if (flag == 1){//价格

      if (filtrateId == 2){
        filtrateId = 1;
        priceIcon = '/images/sort_icon_descending.png';

      } else{
        filtrateId = 2;
        priceIcon = '/images/sort_icon_ascending.png';
      }
      countIcon = '/images/sort_icon_default.png';
      orderIcon = '/images/sort_icon_default.png';
      cycleIcon = '/images/sort_icon_default.png';

    } 
    else if (flag == 2){//综合

      if (filtrateId == 4) {
        filtrateId = 3;
        countIcon = '/images/sort_icon_descending.png';
      } else{
        filtrateId = 4;
        countIcon = '/images/sort_icon_ascending.png';
      }
      priceIcon = '/images/sort_icon_default.png';
      orderIcon = '/images/sort_icon_default.png';
      cycleIcon = '/images/sort_icon_default.png';

    } 
    else if (flag == 3) {//起订量

      if(filtrateId == 6) {
        filtrateId = 5;
        orderIcon = '/images/sort_icon_descending.png';
      } else {
        filtrateId = 6;
        orderIcon = '/images/sort_icon_ascending.png';
      }
      priceIcon = '/images/sort_icon_default.png';
      countIcon = '/images/sort_icon_default.png';
      cycleIcon = '/images/sort_icon_default.png';
    } 
    else if (flag == 4) {//定制周期

      if (filtrateId == 8) {
        filtrateId = 7;
        cycleIcon = '/images/sort_icon_descending.png';
      } else{
        filtrateId = 8;
        cycleIcon = '/images/sort_icon_ascending.png';
      }
      priceIcon = '/images/sort_icon_default.png';
      countIcon = '/images/sort_icon_default.png';
      orderIcon = '/images/sort_icon_default.png';
    }



    if (objectId > 0) {//点击的是选礼对象
      wx.request({
        url: host + "commodityapi/findAllforNewproduct",
        data: {
          commodity_object: objectId,
          sort_type: filtrateId,
          offset: 0,
          limit: 10
        },
        method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
        header: {
          'Accept': 'application/json'
        },
        success: function (res) {
          that.setData({
            contentList: res.data.rows,
            filtrateId: filtrateId,
            priceIcon: priceIcon,
            countIcon: countIcon,
            orderIcon: orderIcon,
            cycleIcon: cycleIcon,
            searchPageNum: 0,   //第一次加载，设置1  
            searchSongList: [],  //放置返回数据的数组,设为空  
            isFromSearch: true,  //第一次加载，设置true  
            searchLoading: true,  //把"上拉加载"的变量设为true，显示  
            searchLoadingComplete: false, //把“没有数据”设为false，隐藏 
          });
          if (res.data.rows.length < 10) {
            that.setData({
              searchPageNum: 0,   //第一次加载，设置1  
              searchSongList: [],  //放置返回数据的数组,设为空  
              isFromSearch: true,  //第一次加载，设置true  
              searchLoading: false,  //把"上拉加载"的变量设为true，显示  
              searchLoadingComplete: false //把“没有数据”设为false，隐藏 
            });
          }
          if (res == null || res.data == null) {
            console.error('网络请求失败');
            return;
          }
        }
      });
    } else if (objectId == -2) {//点击的是推荐类型 - New[新品]
      wx.request({
        url: host + "commodityapi/findAllforNewproduct",
        data: {
          commodity_recommend: '1',
          sort_type: filtrateId,
          offset: 0,
          limit: 10
        },
        method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
        header: {
          'Accept': 'application/json'
        },
        success: function (res) {
          that.setData({
            contentList: res.data.rows,
            filtrateId: filtrateId,
            priceIcon: priceIcon,
            countIcon: countIcon,
            orderIcon: orderIcon,
            cycleIcon: cycleIcon,
            searchPageNum: 0,   //第一次加载，设置1  
            searchSongList: [],  //放置返回数据的数组,设为空  
            isFromSearch: true,  //第一次加载，设置true  
            searchLoading: true,  //把"上拉加载"的变量设为true，显示  
            searchLoadingComplete: false //把“没有数据”设为false，隐藏 
          });
          if (res.data.rows.length < 10) {
            that.setData({
              searchPageNum: 0,   //第一次加载，设置1  
              searchSongList: [],  //放置返回数据的数组,设为空  
              isFromSearch: true,  //第一次加载，设置true  
              searchLoading: false,  //把"上拉加载"的变量设为true，显示  
              searchLoadingComplete: false //把“没有数据”设为false，隐藏 
            });
          }
          if (res == null || res.data == null) {
            console.error('网络请求失败');
            return;
          }
        }
      });
    } else if (objectId == -3) {//点击的是推荐类型 - SALE[打折品]
      wx.request({
        url: host + "commodityapi/findAllforNewproduct",
        data: {
          commodity_recommend: '3',
          sort_type: filtrateId,
          offset: 0,
          limit: 10
        },
        method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
        header: {
          'Accept': 'application/json'
        },
        success: function (res) {
          that.setData({
            contentList: res.data.rows,
            filtrateId: filtrateId,
            priceIcon: priceIcon,
            countIcon: countIcon,
            orderIcon: orderIcon,
            cycleIcon: cycleIcon,
            searchPageNum: 0,   //第一次加载，设置1  
            searchSongList: [],  //放置返回数据的数组,设为空  
            isFromSearch: true,  //第一次加载，设置true  
            searchLoading: true,  //把"上拉加载"的变量设为true，显示  
            searchLoadingComplete: false //把“没有数据”设为false，隐藏 
          });
          if (res.data.rows.length < 10) {
            that.setData({
              searchPageNum: 0,   //第一次加载，设置1  
              searchSongList: [],  //放置返回数据的数组,设为空  
              isFromSearch: true,  //第一次加载，设置true  
              searchLoading: false,  //把"上拉加载"的变量设为true，显示  
              searchLoadingComplete: false //把“没有数据”设为false，隐藏 
            });
          }
          if (res == null || res.data == null) {
            console.error('网络请求失败');
            return;
          }
        }
      });
    }else{
      wx.request({
        url: host + "commodityapi/findAllforNewproduct",
        data: {
          sort_type: filtrateId,
          offset: 0,
          limit: 10
        },
        method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
        header: {
          'Accept': 'application/json'
        },
        success: function (res) {
          that.setData({
            contentList: res.data.rows,
            filtrateId: filtrateId,
            priceIcon: priceIcon,
            countIcon: countIcon,
            orderIcon: orderIcon,
            cycleIcon: cycleIcon,
            searchPageNum: 0,   //第一次加载，设置1  
            searchSongList: [],  //放置返回数据的数组,设为空  
            isFromSearch: true,  //第一次加载，设置true  
            searchLoading: true,  //把"上拉加载"的变量设为true，显示  
            searchLoadingComplete: false //把“没有数据”设为false，隐藏 
          });
          if (res.data.rows.length < 10) {
            that.setData({
              searchPageNum: 0,   //第一次加载，设置1  
              searchSongList: [],  //放置返回数据的数组,设为空  
              isFromSearch: true,  //第一次加载，设置true  
              searchLoading: false,  //把"上拉加载"的变量设为true，显示  
              searchLoadingComplete: false //把“没有数据”设为false，隐藏 
            });
          }
          if (res == null || res.data == null) {
            console.error('网络请求失败');
            return;
          }
        }
      });
    }

  },

})

var that;
var Util = require('../../utils/util.js'); 