// orderList.js
var app = getApp()
var MD5Util = require('../../utils/md5.js');
var navList = [
  { id: 1, navName: "送出的礼物" },
  { id: 2, navName: "礼物盒" }
];

Page({

  data: {
    navList: navList,
    goosdList: [],
    goosdListnew: [],
    goodsList: [],
    goodsListPage: [],//整体数据分页数据
    pageLen: 0,
    isSelect: 0,
    orderState: 0,  //状态
    total: [],
    modalCont: '',
    orderState: 0,
    order_number: '', //订单编号
    tabState: 0,

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
    
    order_id: '',
    order_check_sta: '',
    showSendFriendMsg: false,//送朋友弹窗
    goodsId : 0, //送朋友-当前商品在列表中的id
    showBtn: false, //是否显示右侧返回首页按钮
    isSelectNew : 0,  //默认,
    searchPageNum: 0,   // 设置加载的第几次，默认是第一次  
    callbackcount: 10,      //返回数据的个数  
    searchLoading: false, //"上拉加载"的变量，默认false，隐藏  
    searchLoadingComplete: false, //“没有数据”的变量，默认false，隐藏 
  },

  onLoad: function (options) {
    var that = this;
    var host = getApp().globalData.servsers;
    var un_id = getApp().globalData.un_id;
    var id;
    if (options.isSelectNew == undefined) {
        id = that.data.isSelect;
        
    } else {
        id = options.isSelectNew;
        that.setData({
          isSelect: options.isSelectNew,
          showBtn: true
        })
    } 

    wx.showLoading({
      title: '加载中，请稍候',
      icon: 'loading',
      mask: true,
      success: function () {

      }
    })

    //console.log(getApp().globalData.userInfo.nickName);
    //un_id = 'oovpNwvQGE0uUqpsQrbiVigaEFM0';

  },

  onShow: function (options) {
    var that = this;
    var pages = getCurrentPages();
    var currPage = pages[pages.length - 1];  //当前页面
    var prevPage = pages[pages.length - 2]; //上一个页面
    var that = this;
    var host = getApp().globalData.servsers;
    var un_id = getApp().globalData.un_id;
    var id = that.data.isSelect;
    that.setData({
      goosdList: [],
      goosdListnew : [],
      goodsListPage: [],//整体数据分页数据
      pageLen: 0,
      modalCont: '',
      order_number: '', //订单编号
      searchPageNum: 0,   // 设置加载的第几次，默认是第一次  
      callbackcount: 10,      //返回数据的个数  
      searchLoading: false, //"上拉加载"的变量，默认false，隐藏  
      searchLoadingComplete: false, //“没有数据”的变量，默认false，隐藏 
    })

    if (un_id != undefined && un_id != '' && un_id != null){
      if (id == 0) {
        //送出的礼物
        that.sendGiftData();
        
      } else {

        //收到的礼物
        that.receiveGiftData();

      }
    } 
  },

  tabNav: function (options) {
    var that = this
    var id = options.currentTarget.dataset.id;
    var host = getApp().globalData.servsers;
    var un_id = getApp().globalData.un_id;
    that.setData({
      isSelect: id,
      goosdListnew: [],
      goodsList: [],
      goodsListPage: [],
      pageLen: 0,
      searchPageNum: 0,             // 设置加载的第几次，默认是第一次  
      callbackcount: 10,            //返回数据的个数  
      searchLoading: false,         //"上拉加载"的变量，默认false，隐藏  
      searchLoadingComplete: false, //“没有数据”的变量，默认false，隐藏 
    })

    wx.showLoading({
      title: '加载中，请稍候',
      icon: 'loading',
      mask: true,
      success: function () {

      }
    })

    if (un_id != undefined && un_id != '' && un_id != null){ 
      if (id == 0) {

        //送出的礼物
        that.sendGiftData();

      } else { 

        //收到的礼物
        that.receiveGiftData();

      }
    }
    
  },


  //送出的礼物
  sendGiftData:function(e){
    var that = this;
    var host = getApp().globalData.servsers;
    var un_id = getApp().globalData.un_id;
    //un_id = 'oovpNwlZEABfbvN5Fkku7rntNIXc';
    wx.request({
      url: host + "giftapi/findUserGiftListSend",
      data: {
        userId: un_id
      },
      method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      header: {
        'Accept': 'application/json'
      },
      success: function (res) {
        console.log("flag");
        console.log(res);
         if (res.data.flag || res.flag) {
           var dataLen = res.data.userGiftList.length;
           if (dataLen > 0) {
             //分页
             var goodsListPage = that.data.goodsListPage;
             var chunk = 10; //每10个分一组
             for (var i = 0, j = dataLen; i < j; i += chunk) {
               goodsListPage.push(res.data.userGiftList.slice(i, i + chunk));
             }
             console.log(goodsListPage[0]);
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

             if (goodsListPage[0].length < 10) {
               that.setData({
                 searchLoading: false,  //把"上拉加载"的变量设为true，显示  
               })
             }
           }
         }
        //console.log(res.data.userGiftList);
        wx.hideLoading(); 
        if (res == null || res.data == null) {
          console.error('网络请求失败');
          return;
        }
      }
    })
  },

  //礼物盒
  receiveGiftData:function(e){
    var that = this;
    var host = getApp().globalData.servsers;
    var un_id = getApp().globalData.un_id;
    
    wx.request({
      url: host + "giftapi/findUserGiftList",
      data: {
        userId: un_id
      },
      method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      header: {
        'Accept': 'application/json'
      },
      success: function (res) {
        console.log("收礼物：");
        console.log(res);
        
        if (res.data.flag || res.flag) {
          var dataLen = res.data.userGiftList.length;
          if (dataLen > 0) {
            //分页
            var goodsListPage = that.data.goodsListPage;
            var chunk = 10; //每10个分一组
            for (var i = 0, j = dataLen; i < j; i += chunk) {
              goodsListPage.push(res.data.userGiftList.slice(i, i + chunk));
            }
            console.log(goodsListPage[0]);
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

            console.log(that.data.goosdListnew);

            if (goodsListPage[0].length < 10) {
              that.setData({
                searchLoading: false,  //把"上拉加载"的变量设为true，显示  
              })
            }
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

  //加载更多
  fetchSearchList: function () {

    var that = this;
    var searchPageNum = that.data.searchPageNum;
    console.log("searchPageNum:" + searchPageNum);
    var goosdListnew = that.data.goosdListnew;
    var goodsListPage = that.data.goodsListPage;
    var pageLen = that.data.pageLen;
    if (searchPageNum < pageLen) {
      let dataList = [];
      var newData = goodsListPage[searchPageNum];
      that.data.isFromSearch ? dataList = newData : dataList = that.data.goosdListnew.concat(newData);
      that.setData({
        goosdListnew: dataList, //获取数据数组   
        searchLoading: true   //把"上拉加载"的变量设为false，显示  
      });
    } else {
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

  // sendBtn: function (e) {//送朋友 - 提示弹窗
  //   var that = this;
  //   var id = e.currentTarget.dataset.id;//i
  //   that.setData({
  //     goodsId: id,
  //     showSendFriendMsg: true
  //   })
  // },

  sureSendFriend: function (e) {//送朋友 - 确定
    var that = this;
    var un_id = getApp().globalData.un_id;

    var formId = e.detail;
    console.log("mineGiftList - formId1:" + formId.formId);

    var id = e.currentTarget.dataset.id;
    that.setData({
      goodsId: id,
    })
    var id = that.data.goodsId;

    console.log(that.data.goosdListnew[id]);

    var order_number = that.data.order_number;
    var imgSrc = that.data.goosdListnew[id].affList[0].logo;
    var goosdListnew = that.data.goosdListnew[id];

    var newCarts = JSON.stringify(that.data.goosdListnew[id]);
    newCarts = newCarts.replace(/&/g, "zss");


    setTimeout(function () {
      wx.navigateTo({
        url: '/pages/shareGift/shareGift?src=' + imgSrc + "&id=" + that.data.goosdListnew[id].affList[0].com_id + '&order_number=' + that.data.goosdListnew[id].order.order_number + '&order_userid=' + un_id + "&goodsNme=" + that.data.goosdListnew[id].affList[0].com_name + "&goodsNum=" + that.data.goosdListnew[id].affList[0].com_num + "&goodsList=" + newCarts + "&flag=0" + '&order_number_send=' + that.data.goosdListnew[id].orderNumberGift + "&formId=" + formId.formId,
        success: function (res) {
          that.receiveGiftData();
        }
      })
    }, 500)
  },

  cancelSendFriend: function (e) {//送朋友 - 取消
    var that = this;
    that.setData({
      goodsId: '',
      showSendFriendMsg: false
    })
  },

  //查看礼物详情
  giftInfor:function(e){
    var that = this;
    var order_num_o = e.currentTarget.dataset.onum;//原始单
    var orderNumber = e.currentTarget.dataset.nnum;//拆分单
    var orderNumberGift = e.currentTarget.dataset.snum;//分享单号
    
    var un_id = getApp().globalData.un_id;
    var listId = e.currentTarget.dataset.id;
    var order_userid = that.data.goosdListnew[listId].order.order_userid;//unionid
    var infor = JSON.stringify(that.data.goosdListnew[listId]);
    console.log(infor);
    var newCarts = infor.replace(/&/g, "zss");
    //newCarts = newCarts.replace(/?/g, "口");
    newCarts = infor.replace(/\?/g, " ");


    // newCarts = newCarts.replace(/[\x{1F600}-\x{1F64F}]/g, '');
    // newCarts = newCarts.replace(/[\x{1F300}-\x{1F5FF}]/g, '');
    // newCarts = newCarts.replace(/[\x{1F680}-\x{1F6FF}]/g, '');
    // newCarts = newCarts.replace(/[\x{2600}-\x{26FF}]/g, '');
    // newCarts = newCarts.replace(/[\x{2700}-\x{27BF}]/g, '');
    //newCarts = infor.replace(array('"', '\''), '');



    var sta = 0;
    wx.navigateTo({
      url: '/pages/eachGiftInfor/eachGiftInfor?from_user_id=' + un_id + '&order_num_o=' + order_num_o + '&orderNumber=' + orderNumber + '&orderNumberGift=' + orderNumberGift + '&sta=' + sta + '&listId=' + listId + '&infor=' + newCarts + '&order_userid=' + order_userid,
    })

  },

  giftSendInfor:function(e){
    var that = this;
    var un_id = getApp().globalData.un_id;
    var order_num_o = e.currentTarget.dataset.onum;//原始单
    var orderNumber = e.currentTarget.dataset.nnum;//拆分单
    var orderNumberGift = e.currentTarget.dataset.snum;//分享单号
    var listId = e.currentTarget.dataset.id;
    var order_userid = that.data.goosdListnew[listId].order.order_userid;//unionid
    var infor = JSON.stringify(that.data.goosdListnew[listId]);
    var newCarts = infor.replace(/&/g, "zss");
    var sta = 1;
    wx.navigateTo({
      url: '/pages/eachGiftInfor/eachGiftInfor?from_user_id=' + un_id + '&order_num_o=' + order_num_o + '&orderNumber=' + orderNumber + '&orderNumberGift=' + orderNumberGift + '&sta=' + sta + '&listId=' + listId + '&infor=' + newCarts + '&order_userid=' + order_userid,
    })
  },

  preview: function (e) {//定制预览
    var that = this;
    var id = e.currentTarget.dataset.id;
    var index = e.currentTarget.dataset.index;
    var img = that.data.goosdListnew[id].list_order_aff_data[index].img1;
    if (img) {
      wx.previewImage({
        urls: [that.data.goosdListnew[id].list_order_aff_data[index].img2, that.data.goosdListnew[id].list_order_aff_data[index].img1]
      })
    } else {
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

  preview: function (e) {//定制预览
    var that = this;
    var id = e.currentTarget.dataset.id;
    var index = e.currentTarget.dataset.index;
    var img = that.data.goosdListnew[id].list_order_aff_data[index].img1;
    if (img) {
      wx.previewImage({
        urls: [that.data.goosdListnew[id].list_order_aff_data[index].img2, that.data.goosdListnew[id].list_order_aff_data[index].img1]
      })
    } else {
      wx.previewImage({
        urls: [that.data.goosdListnew[id].list_order_aff_data[index].img2]
      })
    }
  },

  //返回首页
  backIndex:function(e){
    wx.switchTab({
      url: '/pages/index/index',
    })
  }

})


var that;
var Util = require('../../utils/util.js'); 