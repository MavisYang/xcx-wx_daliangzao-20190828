// searchList.js
//获取应用实例
// pages/goodlist/goodlist.js
// var request = require('../../utils/https.js')
// var uri = 'goods/api/goodslist' //商品列表的的uri
// var app = getApp();
// var id = '';
var navlist = [
  { id: " ", title: "综合", icon: "../../images/search_list_zh_pre.png" },
  { id: "price", title: "价格", icon: "../../images/search_list_zh_n.png" }
];

// 热销新品
var contentList = [
];


Page({
  data: {
    placeholder: "输入搜索关键字",
    pageNo: 1,
    activeIndex: 0,
    navList: navlist,
    contentList: contentList,
    navId : 0,
    systemInfo: [],
    loadingHidden: false,
    list: [],
    num: 1,
    limt: 20,
    tab: '',
    pre0: "../../images/search_list_zh_pre.png",
    n0: "../../images/search_list_zh_n.png",
    pre: "../../images/search_list_zh_pre.png",
    n: "../../images/search_list_zh_n.png",
    noActPrice: '/images/search_jt_price_up.png',
    dataVal : "0",
    hidden: false,
    page: 0,
    size: 20,
    hasMore: true,
    hasRefesh: false,
    commodity_name: '',
    host: '',
    searchPageNum: 0,   // 设置加载的第几次，默认是第一次  
    callbackcount: 10,      //返回数据的个数  
    searchLoading: false, //"上拉加载"的变量，默认false，隐藏  
    searchLoadingComplete: false,  //“没有数据”的变量，默认false，隐藏  
    tab : '',
    tabVal : ''
  }, 
  onLoad: function (options) {
    var commodity_name = options.commodity_name;
    var that = this;
    var host = getApp().globalData.servsers;
    //检索商品列表
    wx.request({
      url: host+"commodityapi/findAllforseach",
      data: {
        commodity_name: commodity_name,
        offset: 0,
        limit: 10,
      },
      method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      header: {
        'Accept': 'application/json'
      },
      success: function (res) {
        that.setData({
          contentList: res.data.rows,
          commodity_name: commodity_name,
          host: host,
          searchPageNum: 0,   //第一次加载，设置1  
          searchSongList: [],  //放置返回数据的数组,设为空  
          isFromSearch: true,  //第一次加载，设置true  
          searchLoading: true,  //把"上拉加载"的变量设为true，显示  
          searchLoadingComplete: false //把“没有数据”设为false，隐藏 
        });

          console.log(res.data.rows);

        if (res.data.rows.length < 10) {
          that.setData({
            searchPageNum: 0,   //第一次加载，设置1  
            searchSongList: [],  //放置返回数据的数组,设为空  
            isFromSearch: true,  //第一次加载，设置true  
            searchLoading: false,  //把"上拉加载"的变量设为true，显示  
            searchLoadingComplete: false //把“没有数据”设为false，隐藏 
          });
        }
        console.log(res.data.rows)
        if (res == null || res.data == null) {
          console.error('网络请求失败');
          return;
        }
      }
    });
    
  },
  //切换TAB
  tagChoose: function (options) {
    var that = this
    var id = options.currentTarget.dataset.id;
    var index = e.currentTarget.dataset.index;
    var type = e.currentTarget.dataset.dataType;
    if (id == "price" && type == '1'){//价格
      that.setData({
        activeIndex: index,
        pageNo: 1,
        pre: "../../images/search_list_zh_n.png"
      })
    }else{//综合
      //设置当前样式
      if (type == '0') {//选择综合
        that.setData({
          noActPrice: '/images/search_jt_price_up.png'
        })
      }
      that.setData({
        activeIndex: index,
        pageNo: 1
      })
    }
    
  },

  onTapTag: function (e) {
    var that = this;
    var tab = e.currentTarget.id;
    var index = e.currentTarget.dataset.index;
    var tabType = e.currentTarget.dataset.type;
    var tabVal = e.currentTarget.dataset.val;//标志是否是一个tab点击多次（价格）
    that.setData({
      tab: tab,
      tabVal: tabVal,
      searchPageNum: 0
    })

    if (tab == "price" && tabVal == '0') {//切换数据 为  从低到高  （箭头朝上） 
    wx.request({
      url: that.data.host+"commodityapi/findAllforseachpricedown",
        data: {
          commodity_name: that.data.commodity_name,
          offset: 0,
          limit: 10,

        },
        method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
        header: {
          'Accept': 'application/json'
        },
        success: function (res) {
          that.setData({
            contentList: res.data.rows,
            commodity_name: that.data.commodity_name,

            activeIndex: index,
            tab: tab,
            pageNo: 1,
            dataVal: "1",
            pre: "../../images/search_list_zh_pre.png",
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
          console.log(res.data.rows)
          if (res == null || res.data == null) {
            console.error('网络请求失败');
            return;
          }
        }
      });
   
    } else if (tab == "price" && tabVal == '1') {//切换数据 为  从高到低  （箭头朝下）
      wx.request({
        url: that.data.host +"commodityapi/findAllforseachpriceup",
        data: {
          commodity_name: that.data.commodity_name,
          offset: 0,
          limit: 10,

        },
        method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
        header: {
          'Accept': 'application/json'
        },
        success: function (res) {
          that.setData({
            contentList: res.data.rows,
            commodity_name: that.data.commodity_name,
            activeIndex: index,
            tab: tab,
            pageNo: 1,
            dataVal: "0",
            pre: "../../images/search_list_zh_n.png",
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
     
    }else {
      var that = this;
      var host = getApp().globalData.servsers;
      //检索商品列表
      wx.request({
        url: host + "commodityapi/findAllforseach",
        data: {
          commodity_name: that.data.commodity_name,
          offset: 0,
          limit: 10,

        },
        method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
        header: {
          'Accept': 'application/json'
        },
        success: function (res) {
          that.setData({
            contentList: res.data.rows,
            commodity_name: that.data.commodity_name,
            host: host, searchPageNum: 0,   //第一次加载，设置1  
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
      that.setData({
        activeIndex: index,
        tab: tab,
        pageNo: 1,
        pre: "../../images/search_list_zh_pre.png"
      })

    }
  },

  //刷新处理
  // refesh: function (e) {
  //   var that = this;
  //   that.setData({
  //     hasRefesh: true,
  //   });
  //   //检索商品列表
  //   wx.request({
  //     url: that.data.host+"commodityapi/findAllforseach",
  //     data: {
  //       commodity_name: this.data.commodity_name,
  //       offset: 0,
  //       limit: 1000

  //     },
  //     method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
  //     header: {
  //       'Accept': 'application/json'
  //     },
  //     success: function (res) {
  //       that.setData({
  //         contentList: res.data.rows
  //       });
  //       if (res == null || res.data == null) {
  //         console.error('网络请求失败');
  //         return;
  //       }
  //     }
  //   });
  // },

  fetchSearchList: function () {//加载更多

    var that = this;
    var host = getApp().globalData.servsers;
    var forid = that.data.forid;
    var tab = that.data.tab;
    var tabVal = that.data.tabVal;
    if (tab == "price" && tabVal == '0') {//切换数据 为  从低到高  （箭头朝上） 
      wx.request({
        url: that.data.host + "commodityapi/findAllforseachpricedown",
        data: {
          commodity_name: that.data.commodity_name,
          offset: parseInt(that.data.searchPageNum)*10,
          limit: 10
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
    } else if (tab == "price" && tabVal == '1') {//切换数据 为  从高到低  （箭头朝下）
      wx.request({
        url: that.data.host + "commodityapi/findAllforseachpriceup",
        data: {
          commodity_name: that.data.commodity_name,
          offset: parseInt(that.data.searchPageNum)*10,
          limit: 10
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
    }else{
      //检索商品列表
      wx.request({
        url: host + "commodityapi/findAllforseach",
        data: {
          commodity_name: that.data.commodity_name,
          offset: parseInt(that.data.searchPageNum),
          limit: 10
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
  }  
})
var that;
var Util = require('../../utils/util.js'); 