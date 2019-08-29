// orderList.js
var app = getApp()
var MD5Util = require('../../utils/md5.js');

var navList = [
  { id: 1, navName: "全部" },
  { id: 2, navName: "待付款" },
  { id: 3, navName: "待定制" },
  { id: 4, navName: "待发货" },
  { id: 5, navName: "已发货" },
  { id: 6, navName: "已完成" },
  // { id: 7, navName: "已取消" },
  { id: 7, navName: "待送礼" },
];
var goosdListnew = [];
var goosdList = [];
var breakOrderList = [];

Page({

  data: {
    un_id: '', //标识id
    navList: navList,
    goosdList: goosdList,
    goodsList : [],
    goodsListPage:[],//整体数据分页数据
    pageLen : 0,
    goosdListnew: goosdListnew,
    isSelect: 0,
    orderState: 0,  //状态
    total: [],
    hiddenmodal: true, //弹窗
    modalCont: '',
    orderState: 0,
    order_number: '', //订单编号
    tabState: 0,
    hidden: 'hidden',
    maskBg: false,  //支付提示蒙层
    previewUrl: [],
    previewUrlEach: '',
    previewUrlBoxEach: '',
    previewHidden: 'hidden',
    id: '',
    result: [],
    end_time: '',
    clock: '',
    tomorrow_timetamp: '',
    showQrfhMode: false,
    showSendMineMsg: false,//送自己提示弹窗
    showSendFriendMsg: false,//送朋友弹窗
    order_id: '',
    order_check_sta: '',
    showCancelOrder: false,//待定制状态 - 取消订单
    showShouhou: false, //已完成状态 - 售后
    showCancelPay: false,//待付款 - 取消弹窗
    wxTimerList: {},
    breakOrderList: breakOrderList,//准备拆分的订单
    sendFlag: 0,//送朋友 - 0，送自己 - 1
    newTotal: 0,//拆分订单总价
    breakAllNum: 0,
    scrollHidden: '',//控制蒙层穿透问题
    showContact : false,
    searchPageNum: 0,   // 设置加载的第几次，默认是第一次  
    callbackcount: 10,      //返回数据的个数  
    searchLoading: false, //"上拉加载"的变量，默认false，隐藏  
    searchLoadingComplete: false, //“没有数据”的变量，默认false，隐藏 
  },

  onLoad: function (options){
    var that = this;
    var un_id = getApp().globalData.un_id;
    var id = options.isSelect;
    console.log("isSelect:" + options.isSelect);
    that.setData({
      un_id: un_id,
      isSelect: id
    })
  },

  loadFun: function (options) {
    var that = this;

    that.setData({
      goodsList: [],
      goodsListPage: [],//整体数据分页数据
      pageLen: 0,
      goosdListnew: goosdListnew,
      isSelect: 0,
      orderState: 0,  //状态
      total: [],
      hiddenmodal: true, //弹窗
      modalCont: '',
      orderState: 0,
      order_number: '', //订单编号
      tabState: 0,
      hidden: 'hidden',
      maskBg: false,  //支付提示蒙层
      previewUrl: [],
      previewUrlEach: '',
      previewUrlBoxEach: '',
      previewHidden: 'hidden',
      id: '',
      result: [],
      end_time: '',
      clock: '',
      tomorrow_timetamp: '',
      showQrfhMode: false,
      showSendMineMsg: false,//送自己提示弹窗
      showSendFriendMsg: false,//送朋友弹窗
      order_id: '',
      order_check_sta: '',
      showCancelOrder: false,//待定制状态 - 取消订单
      showShouhou: false, //已完成状态 - 售后
      showCancelPay: false,//待付款 - 取消弹窗
      wxTimerList: {},
      breakOrderList: breakOrderList,//准备拆分的订单
      sendFlag: 0,//送朋友 - 0，送自己 - 1
      newTotal: 0,//拆分订单总价
      breakAllNum: 0,
      scrollHidden: '',//控制蒙层穿透问题
      showContact: false,
      searchPageNum: 0,   // 设置加载的第几次，默认是第一次  
      callbackcount: 10,      //返回数据的个数  
      searchLoading: false, //"上拉加载"的变量，默认false，隐藏  
      searchLoadingComplete: false, //“没有数据”的变量，默认false，隐藏 
    })

    var host = getApp().globalData.servsers;
    var un_id = getApp().globalData.un_id;
    var openid = getApp().globalData.openid;
    var id = that.data.isSelect;


    if ((un_id == undefined || un_id == '' || un_id == null) || (openid == undefined || openid == '' || openid == null)) {
      wx.navigateTo({
        url: '/pages/authorize/authorize?link=orderList',
      })

    } else {
      //order_split_flag    2-拆分完     1-拆分中
      if (id == 0) {
        that.allData();
      } else {
        that.tabStaData();
      }
    }
  },

  onShow: function (options) {
    var that = this;
    var host = getApp().globalData.servsers;
    var pages = getCurrentPages();
    var currPage = pages[pages.length - 1];  //当前页面
    var prevPage = pages[pages.length - 2]; //上一个页面
    that.setData({
      showContact: false
    })
    wx.showLoading({
      title: '加载中，请稍候',
      icon: 'loading',
      mask: true,
      success: function () {

      }
    })
    wx.request({
      url: host + "phoneapi/phoneall",
      data: {},
      method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      header: {
        'Accept': 'application/json'
      },
      success: function (res) {
        that.setData({
          phone: res.data.rows[0].phone,
        });
        if (res == null || res.data == null) {
          console.error('网络请求失败');
          return;
        }
      }
    })
    that.loadFun();

  },

  tabNav: function (options) {
    var that = this
    var id = options.currentTarget.dataset.id;
    that.setData({
      isSelect: id,
      goosdList: [],
      goodsList: [],
      goodsListPage: [],//整体数据分页数据
      pageLen: 0,
      goosdListnew: [],
      searchPageNum: 0,   // 设置加载的第几次，默认是第一次  
      callbackcount: 10,      //返回数据的个数  
      searchLoading: false, //"上拉加载"的变量，默认false，隐藏  
      searchLoadingComplete: false, //“没有数据”的变量，默认false，隐藏 
    })
    wx.showLoading({
      title: '加载中，请稍候',
      icon: 'loading',
      mask: true,
      success: function () {
      }
    })
    if (id == 0) {
      that.allData();
    } else {
      that.tabStaData();
    }

  },

  //tab - 全部 - 数据请求
  allData:function(e){
    var that = this
    var host = getApp().globalData.servsers;
    var un_id = getApp().globalData.un_id;
    var id = that.data.isSelect;
    wx.request({
      url: host + "orderapi/orderlist",
      data: {
        user_id: un_id,
      },
      method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      header: {
        'Accept': 'application/json'
      },
      success: function (res) {
        console.log(res);
        that.setData({
          goodsList: res.data,
        });
        var dataLe = res.data.length;
        var waitPayNum = 0;
        for (var i = 0; i < dataLe; i++) {
          var totalNum = 0;//商品合计
          var eachNum = 0;
          var eachPrice = 0;
          var eachBoxPrice = 0;
          var totalNumber = 0;//每一单的总商品数
          var dataLen = res.data.length;
          for (var j = 0; j < res.data[i].list_order_aff_data.length; j++) {
            eachNum = res.data[i].list_order_aff_data[j].com_num;
            totalNum = parseFloat(res.data[i].list_order_aff_data[j].order_Price);
            totalNumber += parseInt(eachNum);
          }
          that.data.goodsList[i].total = totalNum;
          that.data.goodsList[i].totalNumber = totalNumber;

          // if (res.data[i].order_sta == 1) {
          //   //倒计时
          //   that.timeFun(i, tomorrow_timetamp);
          // }
        }

        that.setData({
          goodsList: that.data.goodsList,
        });

        if (dataLen > 0) {
          //分页
          var goodsListPage = that.data.goodsListPage;
          var chunk = 10; //每10个分一组
          for (var i = 0, j = dataLen; i < j; i += chunk) {
            goodsListPage.push(that.data.goodsList.slice(i, i + chunk));
          }
          console.log(goodsListPage);
          console.log(goodsListPage.length);

          that.setData({
            goodsListPage: goodsListPage,
            pageLen: goodsListPage.length,
            goosdListnew: goodsListPage[0],
            showQrfhMode: false,
            order_number: '',
            searchPageNum: 0,   //第一次加载，设置1  
            searchSongList: [],  //放置返回数据的数组,设为空  
            isFromSearch: true,  //第一次加载，设置true  
            searchLoading: true,  //把"上拉加载"的变量设为true，显示  
            searchLoadingComplete: false //把“没有数据”设为false，隐藏 
          });


          var goosdListnew = that.data.goosdListnew;
          for (var k = 0; k < goosdListnew.length;k++){
            if (goosdListnew[k].order_sta == 1) {
              var timestamp = (goosdListnew[k].list_order_aff_data[0].creat_time).replace(/-/g, '/');
              timestamp = Date.parse(timestamp);

              var tomorrow_timetamp = timestamp + 1 * 60 * 60 * 1000;
              goosdListnew[k].tomorrow_timetamp = tomorrow_timetamp;

              var NowTime = new Date().getTime();
              var EndTime = tomorrow_timetamp;
              var total_micro_second = EndTime - NowTime || [];
              //倒计时
              that.timeFun(k, tomorrow_timetamp);
            }
          }
          
          if (goodsListPage[0].length < 10) {
            that.setData({
              searchLoading: false,  //把"上拉加载"的变量设为true，显示  
            })
          }
        }

        wx.hideLoading();
        if (res == null || res.data == null) {
          console.error('网络请求失败');
          return;
        }
      }
    })
  },

  //tab - 其他分类数据
  tabStaData:function(e){
    var that = this
    var host = getApp().globalData.servsers;
    var un_id = getApp().globalData.un_id;
    var id = that.data.isSelect;
    if (id == 6) {
      id = 10;
    }
    wx.request({
      url: host + "orderapi/orderlistByStatus",
      data: {
        user_id: un_id,
        status: id
      },
      method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      header: {
        'Accept': 'application/json'
      },
      success: function (res) {
        that.setData({
          goodsList: res.data
        });
        var dataLen = res.data.length;
        for (var i = 0; i < dataLen; i++) {
          var totalNum = 0;//商品合计
          var eachNum = 0;
          var eachPrice = 0;
          var eachBoxPrice = 0;
          var totalNumber = 0;//每一单的总商品数
          for (var j = 0; j < res.data[i].list_order_aff_data.length; j++) {
            eachNum = res.data[i].list_order_aff_data[j].com_num;
            totalNum = parseFloat(res.data[i].list_order_aff_data[j].order_Price);
            totalNumber += parseInt(eachNum);
          }

          that.data.goodsList[i].total = totalNum;
          that.data.goodsList[i].totalNumber = totalNumber;

        }

        that.setData({
          goodsList: that.data.goodsList,
        });

        if (dataLen > 0){
          //分页
          var goodsListPage = that.data.goodsListPage;
          var chunk = 10; //每10个分一组
          for (var i = 0, j = dataLen; i < j; i += chunk) {
            goodsListPage.push(that.data.goodsList.slice(i, i + chunk));
          }
          console.log(goodsListPage);
          console.log(goodsListPage.length);

          that.setData({
            goodsListPage: goodsListPage,
            pageLen: goodsListPage.length,
            goosdListnew: goodsListPage[0],
            showQrfhMode: false,
            order_number: '',
            searchPageNum: 0,   //第一次加载，设置1  
            searchSongList: [],  //放置返回数据的数组,设为空  
            isFromSearch: true,  //第一次加载，设置true  
            searchLoading: true,  //把"上拉加载"的变量设为true，显示  
            searchLoadingComplete: false //把“没有数据”设为false，隐藏 
          });

          var goosdListnew = that.data.goosdListnew;
          for (var k = 0; k < goosdListnew.length; k++) {
            if (goosdListnew[k].order_sta == 1) {
              var timestamp = (goosdListnew[k].list_order_aff_data[0].creat_time).replace(/-/g, '/');
              timestamp = Date.parse(timestamp);

              var tomorrow_timetamp = timestamp + 1 * 60 * 60 * 1000;
              goosdListnew[k].tomorrow_timetamp = tomorrow_timetamp;

              var NowTime = new Date().getTime();
              var EndTime = tomorrow_timetamp;
              var total_micro_second = EndTime - NowTime || [];
              //倒计时
              that.timeFun(k, tomorrow_timetamp);
            }
          }

          if (goodsListPage[0].length < 10) {
            that.setData({
              searchLoading: false,  //把"上拉加载"的变量设为true，显示  
            })
          }

        }
        
        wx.hideLoading();
        if (res == null || res.data == null) {
          console.error('网络请求失败');
          return;
        }
      }
    })
  },


  //倒计时
  timeFun: function (id, timer) {
    var that = this;
    var host = getApp().globalData.servsers;
    var un_id = getApp().globalData.un_id;
    var EndTime = timer;
    var NowTime = new Date().getTime();
    var total_micro_second = EndTime - NowTime || [];
    nowTime();

    function nowTime(){
      
      if (total_micro_second <= 0) {
        clearTimeout(nowTime);
        that.data.goosdListnew[id].clock = "支付时间已截止";
        that.data.goosdListnew[id].order_sta = 6;
        that.setData({
          goosdListnew: that.data.goosdListnew
        });
        wx.request({
          url: host + "orderapi/updateOrder_del",
          data: {
            order_number: that.data.goosdListnew[id].order_number
          },
          method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
          header: {
            'Accept': 'application/json'
          },
          success: function (res) {
            if (res == null || res.data == null) {
              console.error('网络请求失败');
              return;
            }
          }
        })
        return;

      } else {

        that.data.goosdListnew[id].clock = dateformat(total_micro_second);
        that.data.goosdListnew[id].total_micro_second = total_micro_second;

          //var total_micro_second = that.data.goosdListnew[id].total_micro_second;
          total_micro_second -= 1000;
          that.data.goosdListnew[id].total_micro_second = total_micro_second;
          that.setData({
            goosdListnew: that.data.goosdListnew
          });

      }
      setTimeout(nowTime, 1000);
    }
    
    //var nowTimeFun = setInterval(nowTime, 1000);

    
    
  },



  //加载更多
  fetchSearchList: function () {

    var that = this;
    var searchPageNum = that.data.searchPageNum;
    console.log("searchPageNum:"+searchPageNum);
    var goosdListnew = that.data.goosdListnew;
    var goodsListPage = that.data.goodsListPage;
    var pageLen = that.data.pageLen;

    console.log(goodsListPage);

    if (searchPageNum < pageLen){
      let dataList = [];
      var newData = goodsListPage[searchPageNum];
      var newDataLen = newData.length;

      console.log(newData);


      that.data.isFromSearch ? dataList = newData : dataList = that.data.goosdListnew.concat(newData);
      that.setData({
        goosdListnew: dataList, //获取数据数组   
        searchLoading: true   //把"上拉加载"的变量设为false，显示  
      });


      var goosdListnew = that.data.goosdListnew;
      for (var k = searchPageNum * 10; k < (searchPageNum * 10 + newDataLen); k++) {
        if (goosdListnew[k].order_sta == 1) {
          var timestamp = (goosdListnew[k].list_order_aff_data[0].creat_time).replace(/-/g, '/');
          timestamp = Date.parse(timestamp);

          var tomorrow_timetamp = timestamp + 1 * 60 * 60 * 1000;
          goosdListnew[k].tomorrow_timetamp = tomorrow_timetamp;

          var NowTime = new Date().getTime();
          var EndTime = tomorrow_timetamp;
          var total_micro_second = EndTime - NowTime || [];
          //倒计时
          that.timeFun(k, tomorrow_timetamp);
        }
      }


    }else{
      that.setData({
        searchLoadingComplete: true, //把“没有数据”设为true，显示  
        searchLoading: false  //把"上拉加载"的变量设为false，隐藏  
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

  orderInfor: function (options) {
    var that = this;
    var id = options.currentTarget.dataset.id;

    var newCarts = JSON.stringify(that.data.goosdListnew[id]);
    newCarts = newCarts.replace(/&/g, "zss");

    wx.navigateTo({
      url: '/pages/confirmedList/confirmedList?goosdListnew=' + newCarts
    })

  },

  //开始定制
  contactWind:function(e){
    var that = this;
    that.setData({
      showContact : true
    })
  },
  closeContactWind:function(e){
    var that = this;
    that.setData({
      showContact: false
    })
  },

  dzwc: function (e) {//定制完成 - 提示弹窗
    var that = this;
    var id = e.currentTarget.dataset.id;
    var order_number = e.currentTarget.dataset.order_number;
    var host = getApp().globalData.servsers;
    that.setData({
      showQrfhMode: true,
      order_number: order_number
    })
  },

  cancelFh: function (e) {//取消定制完成
    var that = this;
    that.setData({
      showQrfhMode: false,
      order_number: ''
    })
  },
  sureFh: function (e) {//定制完成
    var that = this;
    var order_number = that.data.order_number;
    console.log(order_number)
    var host = getApp().globalData.servsers;
    wx.request({
      url: host + "orderapi/updateOrder_dzwc",
      data: {
        order_number: order_number
      },
      method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      header: {
        'Accept': 'application/json'
      },
      success: function (res) {
        that.setData({
          showQrfhMode: false,
          order_number: ''
        })
        that.loadFun();
        if (res == null || res.data == null) {
          console.error('网络请求失败');
          return;
        }
      }
    })
  },

  qrsh: function (e) {//确认收货
    var that = this;
    var id = e.currentTarget.dataset.id;
    var order_number = e.currentTarget.dataset.order_number;
    var host = getApp().globalData.servsers;
    var un_id = getApp().globalData.un_id;
    wx.request({
      url: host + "orderapi/updateOrder_wc",
      data: {
        order_number: order_number
      },
      method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      header: {
        'Accept': 'application/json'
      },
      success: function (res) {

        //that.loadFun();
        wx.request({
          url: host + "orderapi/orderlist",
          data: {
            user_id: un_id
          },
          method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
          header: {
            'Accept': 'application/json'
          },
          success: function (res) {
            //that.loadFun();
            that.setData({
              goosdListnew: res.data
            });
            var dataLe = res.data.length;
            var waitPayNum = 0;
            for (var i = 0; i < dataLe; i++) {
              var totalNum = 0;//商品合计
              var eachNum = 0;
              var eachPrice = 0;
              var totalNumber = 0;//每一单的总商品数
              for (var j = 0; j < res.data[i].list_order_aff_data.length; j++) {
                eachNum = res.data[i].list_order_aff_data[j].com_num;
                //eachPrice = res.data[i].list_order_aff_data[j].com_price;
                //eachBoxPrice = res.data[i].list_order_aff_data[j].com_price;
                totalNum = parseFloat(res.data[i].list_order_aff_data[j].order_Price);
                totalNumber += parseInt(eachNum);
              }

              //totalNum = totalNum.toFixed(2);
              that.data.goosdListnew[i].total = totalNum;
              that.data.goosdListnew[i].totalNumber = totalNumber;

              //倒计时
              var timestamp = (res.data[i].list_order_aff_data[0].creat_time).replace(/-/g, '/');
              timestamp = Date.parse(timestamp);

              var tomorrow_timetamp = timestamp + 1 * 60 * 60 * 1000;
              that.data.goosdListnew[i].tomorrow_timetamp = tomorrow_timetamp;

              if (res.data[i].order_sta == 1) {//待付款
                //倒计时
                that.timeFun(i, tomorrow_timetamp);
              }
            }
            that.setData({
              goosdListnew: that.data.goosdListnew
            });

            if (res == null || res.data == null) {
              console.error('网络请求失败');
              return;
            }
          }
        })
        if (res == null || res.data == null) {
          console.error('网络请求失败');
          return;
        }
      }
    })
  },
  //提醒发货
  fahuo: function (e) {
    var that = this;
    var host = getApp().globalData.servsers;
    var order_number = e.currentTarget.dataset.ordernum;
    wx.request({
      url: host + "orderapi/updateOrderInformation",
      data: {
        order_number: order_number,
        information_type: 3
      },
      method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      header: {
        'Accept': 'application/json'
      },
      success: function (res) {
        that.setData({
          hiddenmodal: false,
          modalCont: '已提醒商家发货，请您耐心等待'
        })
        setTimeout(function () {
          that.setData({
            hiddenmodal: true
          })
        }, 1500);
        if (res == null || res.data == null) {
          console.error('网络请求失败');
          return;
        }
      }
    })
  },

  //待定制 - 申请取消订单 - 显示提示弹窗
  openCancelWind: function (e) {
    var that = this;
    var id = e.currentTarget.dataset.id;
    var order_number = that.data.goosdListnew[id].order_number;
    that.setData({
      showCancelOrder: true,
      order_id: id,
      order_number: order_number
    })
  },

  cancelCancelOrder: function (e) {//取消弹窗 - 待定制的取消的弹窗 
    var that = this;
    that.setData({
      showCancelOrder: false,
      order_id: '',
      order_number: ''
    })
  },

  //待定制 - 申请取消订单
  cancelOrder: function (e) {
    var that = this;
    var host = getApp().globalData.servsers;
    var id = that.data.order_id;
    var order_number = that.data.order_number;

    wx.request({
      url: host + "orderapi/updateOrderInformation",
      data: {
        order_number: order_number,
        information_type: 1
      },
      method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      header: {
        'Accept': 'application/json'
      },
      success: function (res) {
        that.setData({
          showCancelOrder: false,
          order_id: '',
          order_number: ''
        })
        that.setData({
          hiddenmodal: false,
          modalCont: '取消申请已受理，请等待审核！'
        })
        setTimeout(function () {
          that.setData({
            hiddenmodal: true
          })
        }, 1500)
        that.data.goosdListnew[id].list_order_aff_data[0].order_check_sta = 1;
        that.setData({
          goosdListnew: that.data.goosdListnew
        });
        if (res == null || res.data == null) {
          console.error('网络请求失败');
          return;
        }
      }
    })

  },

  //已完成 - 申请售后 - 显示提示弹窗
  openShowhouWind: function (e) {
    var that = this;
    var id = e.currentTarget.dataset.id;
    var order_number = that.data.goosdListnew[id].order_number;
    that.setData({
      showShouhou: true,
      order_id: id,
      order_number: order_number
    })

  },

  cancelShouhou: function (e) {//取消弹窗 - 已完成的取消的弹窗 
    var that = this;
    that.setData({
      showShouhou: false,
      order_id: '',
      order_number: ''
    })
  },
  sureShouhou: function (e) {
    var that = this;
    var host = getApp().globalData.servsers;
    var id = that.data.order_id;
    var order_number = that.data.order_number;

    wx.request({
      url: host + "orderapi/updateOrderInformation",
      data: {
        order_number: order_number,
        information_type: 2
      },
      method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      header: {
        'Accept': 'application/json'
      },
      success: function (res) {
        that.setData({
          showShouhou: false,
          order_id: '',
          order_number: ''
        })
        that.setData({
          hiddenmodal: false,
          modalCont: '售后申请已受理，请等待处理！'
        })
        setTimeout(function () {
          that.setData({
            hiddenmodal: true
          })
        }, 1500)
        that.data.goosdListnew[id].list_order_aff_data[0].order_check_sta = 1;
        that.setData({
          goosdListnew: that.data.goosdListnew
        });
        if (res == null || res.data == null) {
          console.error('网络请求失败');
          return;
        }
      }
    })
  },


  //立即付款
  save: function (e) {
    var that = this;
    var un_id = getApp().globalData.un_id;
    
    var id = e.currentTarget.dataset.id;
    var order_number = that.data.goosdListnew[id].order_number;

    var len = that.data.goosdListnew[id].list_order_aff_data.length;//当前订单下商品数量

    var timestamp = Date.parse(new Date());
    timestamp = timestamp / 1000;
    var timestamp1 = timestamp;
    var host = getApp().globalData.servsers;


    //检测是否存在下架商品
    that.selectCartsSta(id, len, order_number, un_id);


  },

  //检查立即购买的商品中是否有下架商品
  selectCartsSta: function (id, len, order_number, un_id) {
    var that = this;
    var host = getApp().globalData.servsers;

    if (len == 0) {
      wx.showLoading({
        title: '微信支付',
        icon: 'loading',
        mask: true,
        success: function () {
          that.setData({
            maskBg: true
          })
        }
      })

      //获取用户登录状态
      wx.login({
        success: function (res) {
          //发起网络请求,发起的是HTTPS请求，向服务端请求预支付

          var code = res.code;

          var title = that.data.goosdListnew[id].list_order_aff_data[0].com_name;
          var price = that.data.goosdListnew[id].total * 100;
          price = 1;

          console.log("price:" + price);
          console.log("title:" + title);
          console.log("order_number:" + order_number);

          wx.request({
            url: host + 'prePayOrder',
            data: {
              code: code,
              price: price,
              title: title,
              order_number: order_number
              //order_number: timestamp1
            },
            success: function (res) {
              wx.hideLoading()
              that.setData({
                maskBg: false,
                order_id : id,
                order_number: order_number
              })
              console.log(res.data);
              var timestamp = String(Date.parse(new Date()));  //时间戳
              if (res.data.result == true) {
                var nonceStr = res.data.nonceStr
                var prepayId = res.data.prepayId
                // 按照字段首字母排序组成新字符串
                var payDataA = "appId=wx9e3f68fa2172f1c7&nonceStr=" + res.data.nonceStr + "&package=prepay_id=" + res.data.prepayId + "&signType=MD5&timeStamp=" + timestamp;
                var payDataB = payDataA + "&key=MlxMZWpZidKxCPPaOOztMP84XvQzqSOh";
                // 使用MD5加密算法计算加密字符串
                paySign = MD5Util.MD5(payDataB).toUpperCase();
                // 使用MD5加密算法计算加密字符串
                var paySign = MD5Util.MD5(payDataB).toUpperCase();
                // 发起微信支付
                wx.requestPayment({
                  'timeStamp': timestamp,
                  'nonceStr': nonceStr,
                  'package': 'prepay_id=' + prepayId,
                  'signType': 'MD5',
                  'paySign': paySign,
                  'success': function (res) {
                    //人气推荐
                    for (var i = 0; i < that.data.goosdListnew[id].list_order_aff_data.length; i++) {
                      if (that.data.goosdListnew[id].list_order_aff_data[len].order_gy_id > -1) {
                        that.setData({
                          orderState: 2//待定制
                        })
                      } else {
                        that.setData({
                          orderState: 10//待送礼
                        })
                      }
                    }
                    wx.request({
                      url: host + "orderapi/update",
                      data: {
                        order_sta: that.data.orderState,
                        order_number: order_number,
                        order_userid: un_id
                      },
                      method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
                      header: {
                        'Accept': 'application/json'
                      },
                      success: function (res) {
                        console.log("更新");
                        that.loadFun();
                        if (res == null || res.data == null) {
                          console.error('网络请求失败');
                          return;
                        }
                      }
                    });
                    // 保留当前页面，跳转到应用内某个页面，使用wx.nevigeteBack可以返回原页面
                  },
                  'fail': function (res) {
                    console.log(res.errMsg)
                  }
                })
              } else {
                console.log('请求失败' + res.data.info);
              }
            }
          })
        }
      });


    } else {

      len -= 1;

      var com_id = that.data.goosdListnew[id].list_order_aff_data[len].com_id;
      var name = that.data.goosdListnew[id].list_order_aff_data[len].com_name;//商品名称
      var order_number = that.data.goosdListnew[id].order_number;

      //检测商品是否下架
      wx.request({
        url: host + "commodityapi/commoditview",
        data: {
          com_id: com_id
        },
        method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
        header: {
          'Accept': 'application/json'
        },
        success: function (res) {
          //有此商品
          if (res.data.total > 0) {
            if (res.data.commodity.commodity_flag != 0) {//此商品为下架商品
              wx.hideLoading();
              that.setData({
                maskBg: false,
                hiddenmodal: false,
                modalCont: '"' + name + '"已下架，即将为您取消订单，请重新选购！',
                showCancelPay: false,
                order_id: id,
                order_number: order_number
              })
              setTimeout(function () {
                that.setData({
                  hiddenmodal: true
                })
                that.sureSave();
              }, 2000);
              return false;
            } else {

              //不是失效商品，检测库存是否充足
              wx.request({
                url: host + "api/commodityGroup/checkCommodityGroupRepertory",
                data: {
                  datasheetGroupId: that.data.goosdListnew[id].list_order_aff_data[len].com_group_id
                },
                method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
                header: {
                  'Accept': 'application/json'
                },
                success: function (res) {
                  if (res.data.code == '200') {
                    if (res.data.data.canBuy) {
                      if (res.data.data.repertory < that.data.goosdListnew[id].list_order_aff_data[len].com_num) {//商品数量小于库存，置数量为库存数量
                        wx.hideLoading();
                        that.setData({
                          maskBg: false,
                          hiddenmodal: false,
                          modalCont: '"' + name + '"已售罄，即将为您取消订单，请重新选购！',
                          showCancelPay: false,
                          order_id: id,
                          order_number: order_number
                        })
                        setTimeout(function () {
                          that.setData({
                            hiddenmodal: true
                          })
                          that.sureSave();
                        }, 3000);
                        return false;

                      }else{

                        var sumNum = parseInt(that.data.goosdListnew[id].list_order_aff_data[len].com_num);
                        for (var t = 0; t < len; t++) {
                          if (that.data.goosdListnew[id].list_order_aff_data[t].com_id == that.data.goosdListnew[id].list_order_aff_data[len].com_id && that.data.goosdListnew[id].list_order_aff_data[t].com_group_id == that.data.goosdListnew[id].list_order_aff_data[len].com_group_id) {
                            sumNum += parseInt(that.data.goosdListnew[id].list_order_aff_data[t].com_num);
                          }
                        }
                        console.log("立即购买-sumNum:" + sumNum);
                        console.log("立即购买-repertory:" + res.data.data.repertory);
                        if (sumNum > res.data.data.repertory) {
                          wx.hideLoading();
                          that.setData({
                            maskBg: false,
                            order_id: id,
                            order_number: order_number,
                            hiddenmodal: false,
                            modalCont: '“' + name + '”库存不足，，即将为您取消订单，请重新选购！'
                          })
                          setTimeout(function () {
                            that.setData({
                              hiddenmodal: true
                            })
                            //删除当前订单
                            that.sureSave();
                          }, 3000);
                          return false;

                        } else {
                          //继续判断下架和库存
                          that.selectCartsSta(id, len, order_number, un_id);
                        }
                      }

                    }else{
                      wx.hideLoading();
                      that.setData({
                        maskBg: false,
                        hiddenmodal: false,
                        modalCont: '"' + name + '"已售罄，即将为您取消订单，请重新选购！',
                        showCancelPay: false,
                        order_id: id,
                        order_number: order_number
                      })
                      setTimeout(function () {
                        that.setData({
                          hiddenmodal: true
                        })
                        that.sureSave();
                      }, 2500);

                      return false;
                    }
                  }
                }
              })
            }
          } else {
            wx.hideLoading();
            that.setData({
              maskBg: false,
              hiddenmodal: false,
              modalCont: '"' + name  + '"已下架，即将为您取消订单，请重新选购！',
              showCancelPay: false,
              order_id: id,
              order_number: order_number
            })
            setTimeout(function () {
              that.setData({
                hiddenmodal: true
              })
            }, 2500);
            that.sureSave();
            return false;
          }
        }
      })
    }
  },


  //取消付款 - 提示弹窗
  cancalSaveMsg: function (e) {
    var that = this;
    var id = e.currentTarget.dataset.id;
    var order_number = that.data.goosdListnew[id].order_number;
    that.setData({
      showCancelPay: true,
      order_id: id,
      order_number: order_number
    })
  },

  //关闭“取消付款”的弹窗
  closeSaveMsg: function (e) {
    var that = this;
    that.setData({
      showCancelPay: false,
      order_id: '',
      order_number: ''
    })
  },

  //取消付款
  sureSave: function (e) {
    var that = this;
    var host = getApp().globalData.servsers;
    var un_id = getApp().globalData.un_id;
    var id = that.data.order_id;
    var order_number = that.data.order_number;
    wx.request({
      url: host + "orderapi/updateOrder_del",
      data: {
        order_number: order_number,
        order_userid : un_id
      },
      method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      header: {
        'Accept': 'application/json'
      },
      success: function (res) {
        that.setData({
          showCancelPay: false,
          order_id: '',
          order_number: '',
          hiddenmodal: false,
          modalCont: '取消订单成功'

        })
        setTimeout(function () {
          that.setData({
            hiddenmodal: true
          })
        }, 1500)
        if (res == null || res.data == null) {
          console.error('网络请求失败');
          return;
        }
      }
    })
    that.data.goosdListnew[id].order_sta = 6;
    that.setData({
      goosdListnew: that.data.goosdListnew
    });
  },


  //拆分订单 - 送朋友
  breakFriend: function (e) {
    var that = this;
    var id = e.currentTarget.dataset.id;
    var sendFlag = e.currentTarget.dataset.sendflag;
    var breakOrderList = e.currentTarget.dataset.order;//要拆分的订单
    var goods_list = breakOrderList.list_order_aff_data;
    var break_num = 0;
    var newTotal = 0;
    var breakAllNum = 0;
    for (var i = 0; i < goods_list.length; i++) {
      break_num = parseInt(goods_list[i].com_num);
      breakOrderList.list_order_aff_data[i].break_num = break_num;//可拆分的数量
      if (break_num == 0) {
        breakOrderList.list_order_aff_data[i].minus = 'no_opar';//默认不可减
      }
      breakOrderList.list_order_aff_data[i].add = 'no_opar';//默认不可加
      newTotal += parseFloat(breakOrderList.total).toFixed(2);
      breakAllNum += break_num;
    }
    console.log("breakAllNum-11:" + breakAllNum);
    that.setData({
      sendFlag: sendFlag,
      order_id: id,
      breakOrderList: breakOrderList,
      scrollHidden: 'scrollHidden',
      scrollY: false,
      showSendFriendMsg: true,
      newTotal: newTotal,
      breakAllNum: breakAllNum,
    })
  },

  //拆分 - 绑定加数量事件
  addCount(e) {
    var that = this;
    var id = e.currentTarget.dataset.id;
    var breakOrderList = that.data.breakOrderList;
    var break_num = e.currentTarget.dataset.breaknum;
    var breakAllNum = that.data.breakAllNum;
    var com_num = e.currentTarget.dataset.num;//可拆分总数量
    var price = e.currentTarget.dataset.price;

    if (break_num < com_num) {
      break_num++;
      if (break_num == com_num) {//已到上限
        breakOrderList.list_order_aff_data[id].add = 'no_opar';
      } else {
        breakOrderList.list_order_aff_data[id].add = '';
      }

      breakOrderList.list_order_aff_data[id].break_num = break_num;
      breakOrderList.list_order_aff_data[id].minus = '';
      that.data.breakAllNum = breakAllNum++;
      that.setData({
        breakOrderList: breakOrderList,
        breakAllNum: breakAllNum
      })
    } else {
      breakOrderList.list_order_aff_data[id].add = 'no_opar';
      breakOrderList.list_order_aff_data[id].minus = '';
      that.setData({
        breakOrderList: breakOrderList
      })
      return false;
    }
  },


  //拆分 - 手动填写数量
  writeNum: function (e) {
    var that = this;
    var val = e.detail.value;
    var id = e.currentTarget.dataset.id;
    var breakOrderList = that.data.breakOrderList;
    var com_num = e.currentTarget.dataset.num;//可拆分总数量
    var break_num = breakOrderList.list_order_aff_data[id].break_num;
    var breakAllNum = that.data.breakAllNum;//累计拆分数量加和

    if (parseInt(val) >= parseInt(com_num)) {

      breakOrderList.list_order_aff_data[id].break_num = com_num;
      breakAllNum = parseInt(breakAllNum) - parseInt(break_num) + parseInt(com_num);
      breakOrderList.list_order_aff_data[id].minus = '';
      breakOrderList.list_order_aff_data[id].add = 'no_opar';
      that.setData({
        breakOrderList: breakOrderList,
        breakAllNum: breakAllNum
      })

    } else if (parseInt(val) <= 0) {

      breakOrderList.list_order_aff_data[id].break_num = 0;
      breakAllNum = parseInt(breakAllNum) - parseInt(break_num);
      breakOrderList.list_order_aff_data[id].minus = 'no_opar';
      breakOrderList.list_order_aff_data[id].add = '';
      that.setData({
        breakOrderList: breakOrderList,
        breakAllNum: breakAllNum
      })

    } else {
      breakOrderList.list_order_aff_data[id].break_num = val;
      breakAllNum = parseInt(breakAllNum) - parseInt(break_num) + parseInt(val);
      breakOrderList.list_order_aff_data[id].minus = '';
      breakOrderList.list_order_aff_data[id].add = '';
      that.setData({
        breakOrderList: breakOrderList,
        breakAllNum: breakAllNum
      })
    }
  },

  //拆分 - 绑定减数量事件
  minusCount(e) {
    var that = this;
    var id = e.currentTarget.dataset.id;
    var break_num = e.currentTarget.dataset.breaknum;
    var breakAllNum = that.data.breakAllNum;//累计拆分数量加和
    var breakOrderList = that.data.breakOrderList;
    var price = e.currentTarget.dataset.price;

    if (break_num <= 0) {
      return false;
    } else {
      break_num--;
      if (break_num <= 0) {
        breakOrderList.list_order_aff_data[id].minus = 'no_opar';
      } else {
        breakOrderList.list_order_aff_data[id].minus = '';
      }
      breakOrderList.list_order_aff_data[id].break_num = break_num;
      breakOrderList.list_order_aff_data[id].add = '';
      that.data.breakAllNum = breakAllNum--;
      console.log("breakAllNum1111:" + breakAllNum);
      that.setData({
        breakOrderList: breakOrderList,
        breakAllNum: breakAllNum--
      })

    }
  },



  sendBtn: function (options) {//送朋友 - 提示弹窗
    var that = this;
    var id = e.currentTarget.dataset.id;//i
    var formId = e.detail;
    console.log("formId0:" + formId.formId);
    that.setData({
      order_id: id,
      scrollHidden: 'scrollHidden',
      scrollY: false,
      showSendFriendMsg: true
    })
  },

  sureSendFriend: function (e) {//送朋友 - 确定

    var that = this;
    var formId = e.detail;
    console.log("formId1:" + formId.formId);

    var userRole = getApp().globalData.userRole;

    var breakOrderList = that.data.breakOrderList;
    var totalNumber = that.data.breakOrderList.totalNumber;
    console.log("totalNumber:" + totalNumber);
    var breakAllNum = that.data.breakAllNum;//总的拆分数量
    console.log("breakAllNum:" + breakAllNum);
    if (breakAllNum > 0 && breakAllNum <= totalNumber) {//商品总数不为0
      var id = that.data.order_id;//i
      var sendFlag = that.data.sendFlag;


      var order_number = breakOrderList.order_number;
      var imgSrc = breakOrderList.list_order_aff_data[0].logo;

      var com_id = breakOrderList.list_order_aff_data[0].com_id;
      var order_userid = breakOrderList.list_order_aff_data[0].order_userid;
      var com_name = breakOrderList.list_order_aff_data[0].com_name;
      var goodsNum = breakOrderList.list_order_aff_data[0].break_num;
      var newTotal = 0;
      var len = breakOrderList.list_order_aff_data.length;
      for (var i = 0; i < len; i++) {
        var goodsPrice = parseFloat(breakOrderList.list_order_aff_data[i].com_price);
        var boxPrice = parseFloat(breakOrderList.list_order_aff_data[i].box_price);
        var num = parseInt(breakOrderList.list_order_aff_data[i].break_num);
        newTotal += (goodsPrice + boxPrice) * num;
      }
      for (var i = 0; i < len; i++) {
        breakOrderList.list_order_aff_data[i].newTotal = newTotal.toFixed(2);
      }


      that.setData({
        breakOrderList: breakOrderList
      })
      breakOrderList = that.data.breakOrderList;

      var newCarts = JSON.stringify(breakOrderList);
      newCarts = newCarts.replace(/&/g, "zss");

      var order_number_new = Date.parse(new Date());
      order_number_new = order_number_new / 1000;


      if (sendFlag == 0) {//点击送朋友
        setTimeout(function () {
          wx.navigateTo({
            url: '/pages/share/share?src=' + imgSrc + "&id=" + com_id + '&order_number=' + order_number + '&order_userid=' + order_userid + "&goodsNme=" + com_name + "&goodsNum=" + goodsNum + "&goodsList=" + newCarts + "&flag=0&formId=" + formId.formId + '&fromUserRole=' + userRole,
            success: function (res) {
              that.setData({
                scrollHidden: '',
                scrollY: true,
                showSendFriendMsg: false
              })
            }
          })
        }, 500)
      } else {//送自己
        that.setData({
          scrollHidden: '',
          scrollY: true,
          showSendFriendMsg: false
        })
        wx.navigateTo({
          url: '/pages/addAddressSendOwn/addAddressSendOwn?order_number_new=' + order_number_new + '&goodsList=' + newCarts + '&order_number=' + order_number,
        })
      }
    } else if (breakAllNum <= 0) {
      that.setData({
        hiddenmodal: false,
        modalCont: '请选择需要赠送的礼物及数量'

      })
      setTimeout(function () {
        that.setData({
          hiddenmodal: true
        })
      }, 1500)
    } else {
      that.setData({
        hiddenmodal: false,
        modalCont: '选择送礼商品数量超出现有商品数量！'

      })
      setTimeout(function () {
        that.setData({
          hiddenmodal: true
        })
      }, 1500)
    }

  },

  cancelSendFriend: function (e) {//送朋友 - 取消
    var that = this;
    that.setData({
      order_id: '',
      scrollHidden: '',
      scrollY: true,
      showSendFriendMsg: false
    })
  },

  sendMineBtn: function (options) {//送自己
    var that = this;
    var id = options.currentTarget.dataset.id;//i
    var order_number = that.data.goosdListnew[id].order_number;
    that.setData({
      showSendMineMsg: true,
      order_number: order_number
    })
  },
  sureSendMine: function (e) {//送自己 - 确认
    var that = this;
    var host = getApp().globalData.servsers;
    var order_number = that.data.order_number;
    that.setData({
      showSendMineMsg: false
    })
    wx.navigateTo({
      url: '/pages/sendOwnAddress/sendOwnAddress?order_number=' + order_number,
    })


    // wx.request({//修改礼物状态【0->1】
    //   url: host + "orderapi/updateOrderType",
    //   data: {
    //     order_number: order_number,
    //     order_type: '1'
    //   },
    //   method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
    //   header: {
    //     'Accept': 'application/json'
    //   },
    //   success: function (res) {

    //     that.setData({
    //       showSendMineMsg: false,
    //       order_number: ''
    //     })
    //     that.loadFun();
    //     if (res == null || res.data == null) {
    //       console.error('网络请求失败');
    //       return;
    //     }
    //   }
    // })
  },
  cancelSendMine: function (e) {//取消送自己
    var that = this;
    that.setData({
      showSendMineMsg: false,
      order_number: ''
    })
  },

  preview: function (e) {//定制预览
    var that = this;
    var id = e.currentTarget.dataset.id;
    var index = e.currentTarget.dataset.index;
    var img = that.data.goosdListnew[id].list_order_aff_data[index].img2;
    if (img) {
      wx.previewImage({
        urls: [that.data.goosdListnew[id].list_order_aff_data[index].img2]
      })
    }
  },
  cancelPreview: function (e) {//取消定制预览
    var that = this;
    that.setData({
      previewHidden: 'hidden'
    })
  },

  //开始定制
  goDingzhi: function (e) {
    var that = this;
    var id = e.currentTarget.dataset.id;
    var index = e.currentTarget.dataset.index;//子数组下标
    var img2 = e.currentTarget.dataset.url;//是否定制过的标志

    var order_sta = that.data.goosdListnew[id].order_sta;
    var order_aff_num = that.data.goosdListnew[id].order_number;//订单号
    var order_aff_id = that.data.goosdListnew[id].list_order_aff_data[index].com_id;//商品id
    var order_aff_gg_id = that.data.goosdListnew[id].list_order_aff_data[index].order_aff_gg_id;//规格id
    var order_gy_id = that.data.goosdListnew[id].list_order_aff_data[index].order_gy_id;//工艺id
    var order_aff_dz_id = that.data.goosdListnew[id].list_order_aff_data[index].order_aff_dz_id;//定制id
    var unionid = that.data.goosdListnew[id].list_order_aff_data[index].order_userid;//unionid



    if (order_aff_dz_id == undefined) {
      order_aff_dz_id = 'null';
    }

    console.log(that.data.goosdListnew[id]);

    wx: wx.navigateTo({
      url: '/pages/webview/webview?order_aff_num=' + order_aff_num + '&order_aff_id=' + order_aff_id + '&order_aff_gg_id=' + order_aff_gg_id + '&order_gy_id=' + order_gy_id + '&order_aff_dz_id=' + order_aff_dz_id + '&unionid=' + unionid + '&img2=' + img2 + '&order_sta=' + order_sta
    })

  },

  //拨打电话
  tel:function(){
    var that = this;
    that.setData({
      showContact : false
    })
    wx.makePhoneCall({
      phoneNumber: that.data.phone //仅为示例，并非真实的电话号码
    })
  }

})

// 时间格式化输出，每1s都会调用一次
function dateformat(micro_second) {
  // 总秒数
  var second = Math.floor(micro_second / 1000);
  // 天数
  //var day = Math.floor(second / 3600 / 24);
  // 小时
  //var hr = Math.floor(day * 24 + second / 3600 % 24);
  // 分钟
  var min = Math.floor(second / 60 % 60) < 10 ? ("0" + (Math.floor(second / 60 % 60))) : Math.floor(second / 60 % 60);
  // 秒
  var sec = Math.floor(second % 60) < 10 ? ("0" + Math.floor(second % 60)) : Math.floor(second % 60);
  return min + ":" + sec;
}


var that;
var Util = require('../../utils/util.js'); 