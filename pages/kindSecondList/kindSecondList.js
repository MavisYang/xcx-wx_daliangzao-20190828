// kindSecondList.js
var app = getApp();
// 列表
var contentList = [];

Page({
  data: {
    pageNo: 1,
    activeIndex: 0,
    tuijian:[],
    Title:'',
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
    id: '',
    winHeight: "",//窗口高度
    currentTab: 0, //预设当前项的值
    scrollLeft: 0, //tab标题的滚动条位置
    hidden : '',
    hiddenAll : 'hidden',
    forid : '',//当前选中tab id
    searchPageNum: 0,   // 设置加载的第几次，默认是第一次  
    callbackcount: 10,      //返回数据的个数  
    searchLoading: false, //"上拉加载"的变量，默认false，隐藏  
    searchLoadingComplete: false , //“没有数据”的变量，默认false，隐藏  
    flag : 1,
    shareFlag : 0,//非分享为0，来自分享页面为1
  },

  // 滚动切换标签样式
  switchTab: function (e) {
    var that = this;
    var host = getApp().globalData.servsers;
    // var id = e.currentTarget.dataset.id;
    var current = e.detail.current;
    var forid = that.data.contentList[e.detail.current].id;
    var forname = that.data.contentList[e.detail.current].classify_name;
    var classifydes = that.data.contentList[e.detail.current].classify_des;
    this.setData({
      currentTab: e.detail.current,
      Title: classifydes
    })
    wx.request({
      url: host + "commodityapi/commoditviewfoeeverybody",
      data: {
        commodity_levelTwo: forid,
        offset: 0,
        limit: 10,
      },
      method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      header: {
        'Accept': 'application/json'
      },
      success: function (res) {
        that.setData({
          tuijian: res.data.rows,
          forid: forid,
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
    that.checkCor();
  },
  checkCor: function () { 
    if (this.data.currentTab > 2) {
      this.setData({
        scrollLeft: 300
      })
    } else {
      this.setData({
        scrollLeft: 0
      })
    }
  },

  onLoad: function (options) {
    var that = this;
    var host = getApp().globalData.servsers;
    var classify_name = options.classify_name;
    var flag = options.flag;
    var shareFlag = options.shareFlag;
    if (shareFlag != '' && shareFlag != null && shareFlag != undefined){
      that.setData({
        shareFlag: shareFlag
      })
    }
    console.log("id:" + options.id);
    console.log("classify_name:" + options.classify_name);
    console.log("shareFlag:" + options.shareFlag);
    console.log("classify_des: "+options.classify_des);

    if(options.id == '2298' || options.id == '3000'){//内部员工和VIP禁止分享
      //禁止分享
      wx.hideShareMenu();
    }

    that.setData({
      id: options.id
    })
    
    wx.request({
      url: host+"classifyapi/findAllforviewSce",
      data: {
        id: options.id
      },
      method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      header: {
        'Accept': 'application/json'
      },
      success: function (res) {
        that.setData({
          contentList: res.data.rows
        });
        console.log(res.data.rows);
        if (res.data.rows != ''){
          var forid = res.data.rows[0].id;
          var forname = res.data.rows[0].classify_name;
          var classifydes = res.data.rows[0].classify_des;
          wx.request({
            url: host + "commodityapi/commoditviewfoeeverybody",
            data: {
              commodity_levelTwo: forid,
              offset: 0,
              limit: 10,
            },
            method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
            header: {
              'Accept': 'application/json'
            },
            success: function (res) {
              that.setData({
                tuijian: res.data.rows,
                Title: classifydes,
                forid: forid,
                searchPageNum: 0,   //第一次加载，设置1  
                searchSongList: [],  //放置返回数据的数组,设为空  
                isFromSearch: true,  //第一次加载，设置true  
                searchLoading: true,  //把"上拉加载"的变量设为true，显示  
                searchLoadingComplete: false //把“没有数据”设为false，隐藏 
              });
              if (res.data.rows.length<10){
                that.setData({
                  searchPageNum: 0,   //第一次加载，设置1  
                  searchSongList: [],  //放置返回数据的数组,设为空  
                  isFromSearch: true,  //第一次加载，设置true  
                  searchLoading: false,  //把"上拉加载"的变量设为true，显示  
                  searchLoadingComplete: false //把“没有数据”设为false，隐藏 
                });
              }
              console.log(res.data.rows);
              if (res == null || res.data == null) {
                console.error('网络请求失败');
                return;
              }
            }
          });
        }
        
        if (res == null || res.data == null) {
          console.error('网络请求失败');
          return;
        }
      }
    });

    wx.setNavigationBarTitle({
      title: options.classify_name
    })
    this.setData({
      classify_name: options.classify_name,
      classify_des: options.classify_des,
      flag: flag
    })

    var that = this;
    //  高度自适应
    wx.getSystemInfo({
      success: function (res) {
        var clientHeight = res.windowHeight,
            clientWidth = res.windowWidth,
            rpxR = 750 / clientWidth;
        var calc = clientHeight * rpxR;
        that.setData({
          winHeight: calc
        });
      }
    });
  },

  footerTap: app.footerTap,

  //切换TAB
  tagChoose: function (options) {
    var that = this;
    var host = getApp().globalData.servsers;
    var id = options.currentTarget.dataset.id;
    var forid = options.currentTarget.dataset.forid;
    var forname = options.currentTarget.dataset.forname;
    //设置当前样式
    if (this.data.currentTab == id) {
      return false;
    } else {
      that.setData({
        'firstActive': "",
        'currentTab': id,
        Title: forname
      })
    }
    wx.request({
      url: host+"commodityapi/commoditviewfoeeverybody",
      data: {
        commodity_levelTwo: forid,
        offset: 0,
        limit: 10,
      },
      method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      header: {
        'Accept': 'application/json'
      },
      success: function (res) {
        that.setData({
          tuijian: res.data.rows,
          forid: forid,
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

  //下拉刷新
  onPullDownRefresh: function (e) {
    this.onLoad();
    wx.stopPullDownRefresh();
  },

  fetchSearchList: function () {//加载更多

    var that = this;
    var host = getApp().globalData.servsers;
    var forid = that.data.forid;
    wx.request({
      url: host + "commodityapi/commoditviewfoeeverybody",
      data: {
        commodity_levelTwo: forid,
        offset: parseInt(that.data.searchPageNum),
        limit: 10
      },
      method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      header: {
        'Accept': 'application/json'
      },
      success: function (res) {
        if (res.data.rows.length != 0) {
          let tuijian = [];
          //如果isFromSearch是true从data中取出数据，否则先从原来的数据继续添加  
          that.data.isFromSearch ? tuijian = res.data.rows : tuijian = that.data.tuijian.concat(res.data.rows)
          that.setData({
            tuijian: tuijian, //获取数据数组   
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
  } ,

  //分享【非“内部购买”和“VIP”】
  onShareAppMessage: function (res) {
    var that = this;
    var host = getApp().globalData.servsers;
    var contentList = that.data.contentList;
    var classify_name = that.data.classify_name;
    var classify_des = that.data.classify_des;
    var id = that.data.id;

    if (res.from === 'button') {
      //来自页面内转发按钮
      console.log(res.target)
    }
    return {
      title: '大良造-精良之选,用心造物！',
      path: '/pages/kindSecondList/kindSecondList?classify_name=' + classify_name + '&classify_des=' + classify_des + '&id=' + id + '&shareFlag=1',
      success: function (res) {

      },
      fail: function (res) {
        // 转发失败
      }
    }
  }, 

  //返回首页
  backIndex: function (e) {
    wx.switchTab({
      url: '/pages/index/index',
    })
  }

})

var that;
var Util = require('../../utils/util.js'); 