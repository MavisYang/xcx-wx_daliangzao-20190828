// goodsGift.js - 心礼盒
var app = getApp();
// 列表
var contentList = [];
var conditionTab1 = [
  { id: 1, scene_name:'500以内'},
  { id: 2, scene_name: '500-1000' },
  { id: 3, scene_name: '1000-2000' },
  { id: 4, scene_name: '2000以上' }
];
var conditionTab2 = [
  { id: 10, scene_name: '商务送礼' },
  { id: 29, scene_name: '员工福利' },
  { id: 20, scene_name: '节日送礼' },
  { id: 17, scene_name: '馈赠亲友' },
];

Page({
  data: {
    conditionTab1: conditionTab1,
    conditionTab2: conditionTab2,
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
    hidden : '',
    hiddenAll : 'hidden',
    forid : '',//当前选中tab id
    searchPageNum: 0,   // 设置加载的第几次，默认是第一次  
    callbackcount: 10,      //返回数据的个数  
    searchLoading: false, //"上拉加载"的变量，默认false，隐藏  
    searchLoadingComplete: false,  //“没有数据”的变量，默认false，隐藏  
    selectOneId : -1 , //价钱筛选默认未选中
    selectTwoId : -1, //送礼用途默认未选中
    selectPriceId: -1, //默认选中的价钱的id
    selectWayId: -1, //默认选中送礼用途id
    kindId : '',  //当前页面 - 礼物盒ID
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
    that.setData({
      kindId: options.id
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
        if (res.data.rows != ''){
          var forid = res.data.rows[0].id;
          var forname = res.data.rows[0].classify_name;
          var classifydes = res.data.rows[0].classify_des;
          var selectPriceId = that.data.selectPriceId;
          var selectWayId = that.data.selectWayId;

          console.log("selectPriceId:" + selectPriceId);

          wx.request({
            url: host + "commodityapi/commoditviewfoeeverybody",
            data: {
              commodity_levelTwo: forid,
              //priceType: selectPriceId,
              //purposeId: selectWayId,
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

  //下拉刷新
  onPullDownRefresh: function (e) {
    this.onLoad();
    wx.stopPullDownRefresh();
  },

  fetchSearchList: function () {//加载更多

    var that = this;
    var host = getApp().globalData.servsers;
    var forid = that.data.forid;
    var selectPriceId = that.data.selectPriceId;
    var selectWayId = that.data.selectWayId;

    if (selectPriceId == -1 && selectWayId == -1){
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

    } else if (selectPriceId == -1){
      wx.request({
        url: host + "commodityapi/commoditviewfoeeverybody",
        data: {
          commodity_levelTwo: forid,
          purposeId: selectWayId,
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
    } else if (selectWayId == -1) {
      wx.request({
        url: host + "commodityapi/commoditviewfoeeverybody",
        data: {
          commodity_levelTwo: forid,
          priceType: selectPriceId,
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
    }else{
      wx.request({
        url: host + "commodityapi/commoditviewfoeeverybody",
        data: {
          commodity_levelTwo: forid,
          priceType: selectPriceId,
          purposeId: selectWayId,
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

  //价钱筛选
  filtratePrice:function(e){
    var that = this;
    var host = getApp().globalData.servsers;
    var id = e.currentTarget.dataset.id;
    var flagid = e.currentTarget.dataset.flagid;
    that.setData({
      selectOneId : id,
      selectPriceId: flagid,
    })

    var forid = that.data.contentList[0].id;
    var forname = that.data.contentList[0].classify_name;
    var classifydes = that.data.contentList[0].classify_des;
    var selectPriceId = that.data.selectPriceId;
    var selectWayId = that.data.selectWayId;
    if (selectWayId == -1){
      wx.request({
        url: host + "commodityapi/commoditviewfoeeverybody",
        data: {
          commodity_levelTwo: forid,
          priceType: selectPriceId,
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
          if (res == null || res.data == null) {
            console.error('网络请求失败');
            return;
          }
        }
      });
    }else{
      wx.request({
        url: host + "commodityapi/commoditviewfoeeverybody",
        data: {
          commodity_levelTwo: forid,
          priceType: selectPriceId,
          purposeId: selectWayId,
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
          if (res == null || res.data == null) {
            console.error('网络请求失败');
            return;
          }
        }
      });
    }

  }, 

  //送礼用途筛选
  filtrateWay: function (e) {
    var that = this;
    var host = getApp().globalData.servsers;
    var id = e.currentTarget.dataset.id;
    var flagid = e.currentTarget.dataset.flagid;
    that.setData({
      selectTwoId: id,
      selectWayId: flagid
    })

    var forid = that.data.contentList[0].id;
    var forname = that.data.contentList[0].classify_name;
    var classifydes = that.data.contentList[0].classify_des;
    var selectPriceId = that.data.selectPriceId;
    var selectWayId = that.data.selectWayId;
    if (selectPriceId == -1){
      wx.request({
        url: host + "commodityapi/commoditviewfoeeverybody",
        data: {
          commodity_levelTwo: forid,
          purposeId: selectWayId,
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
        url: host + "commodityapi/commoditviewfoeeverybody",
        data: {
          commodity_levelTwo: forid,
          priceType: selectPriceId,
          purposeId: selectWayId,
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
    

    console.log("selectPriceId2:" + selectPriceId);

    
  },

})

var that;
var Util = require('../../utils/util.js'); 