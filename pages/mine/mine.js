// index.js
var app = getApp()
Page({
  data: {
    userId : '',
    userInfo: {},
    phone:'',
    hidden : 'hidden',
    userListInfo1: [{
      icon: '/images/mine_order.png',
      text: '我的订单',
      url:"/pages/orderList/orderList?isSelect=1"
    }, {
      icon: '/images/mine_collect.png',
      text: '我的收藏',
      addclass:"no_border",
      url: "/pages/mineCollect/mineCollect"
    }],

    userListInfo2: [
    {
      icon: '/images/mine_coupon.png',
      text: '优惠券',
      addclass: "no_border",
      url: "/pages/mineCoupon/coupon"
    }],
    userListInfo3: [{
      icon: '/images/mine_address.png',
      text: '我的地址',
      url: "/pages/mineAddress/mineAddress"
    }, {
      icon: '/images/mine_help.png',
      text: '帮助及意见反馈',
      addclass: "no_border",
      url: "/pages/problemList/problemList"
    }],

    userRole : 0, //用户身份【普通用户 / 商务用户】
    hiddenmodal: true, //提示弹窗
    modalCont: '', //提示内容

  },

  onLoad: function () {
    var that = this;
    var openid = getApp().globalData.openid;
    var un_id = getApp().globalData.un_id;
    var host = getApp().globalData.servsers;
    wx.showNavigationBarLoading();

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
        wx:wx.hideNavigationBarLoading(
          that.setData({
            hidden : ''
          })
        )
      }
    });

    that.setData({
      userInfo: getApp().globalData.userInfo,
      userId: getApp().globalData.un_id
    })
 
  },

  //重新加载
  onShow: function () {
    var that = this;
    var host = getApp().globalData.servsers;
    var un_id = getApp().globalData.un_id;
    var openid = getApp().globalData.openid;
    var userInfo = getApp().globalData.userInfo;
    var userRole = getApp().globalData.userRole;

    // if ((un_id == undefined || un_id == '' || un_id == null) || (openid == undefined || openid == '' || openid == null)) {
    //   wx.navigateTo({
    //     url: '/pages/authorize/authorize?link=mine',
    //   })
    // } else {

      userInfo = getApp().globalData.userInfo;
      
      //查询用户身份
    //   getApp().getUserRole(un_id);//获取用户角色
    //   userRole = getApp().globalData.userRole;
    // }
    that.setData({
      userInfo: userInfo,
      userId: un_id,
      userRole: userRole
    })
  },



  //我的订单
  linkOrder: function () {
    var that = this;
    var un_id = getApp().globalData.un_id;
    var openid = getApp().globalData.openid;
    if ((un_id == undefined || un_id == '' || un_id == null) || (openid == undefined || openid == '' || openid == null)){
      wx.navigateTo({
        url: '/pages/authorize/authorize?link=orderList',
      })
    }else{
      wx.navigateTo({
        url: '/pages/orderList/orderList?isSelect=0'
      })
    }
  },

  //我的礼物
  linkGift: function () {
    var that = this;
    var un_id = getApp().globalData.un_id;
    var openid = getApp().globalData.openid;
    if ((un_id == undefined || un_id == '' || un_id == null) || (openid == undefined || openid == '' || openid == null)) {
      wx.navigateTo({
        url: '/pages/authorize/authorize?link=mineGiftList',
      })
    } else {
      wx.navigateTo({
        url: '/pages/mineGiftList/mineGiftList'
      })
    }
  },

  //我的地址
  linkAddress: function () {
    var that = this;
    var un_id = getApp().globalData.un_id;
    var openid = getApp().globalData.openid;
    if ((un_id == undefined || un_id == '' || un_id == null) || (openid == undefined || openid == '' || openid == null)) {
      wx.navigateTo({
        url: '/pages/authorize/authorize?link=mineAddress',
      })
    } else {
      wx.navigateTo({
        url: '/pages/mineAddress/mineAddress'
      })
    }
  },

  //我的收藏
  linkCollect: function () {
    var that = this;
    var un_id = getApp().globalData.un_id;
    var openid = getApp().globalData.openid;
    if ((un_id == undefined || un_id == '' || un_id == null) || (openid == undefined || openid == '' || openid == null)) {
      wx.navigateTo({
        url: '/pages/authorize/authorize?link=mineCollect',
      })
    } else {
      wx.navigateTo({
        url: '/pages/mineCollect/mineCollect'
      })
    }
  },

  //下拉刷新
  onPullDownRefresh: function (e) {
    var that = this;
    that.onLoad();
    wx.stopPullDownRefresh();
  },

  //我的收益
  mineEarnings:function(e){
    var that = this;
    var userRole = that.data.userRole;
    wx.navigateTo({
      url: '/pages/jianshe/jianshe',
    })

    // if (userRole == 0){//普通用户
    //   wx.navigateTo({
    //     url: '/pages/partnerMineEarnings/partnerMineEarnings',
    //   })
    // }else{
    //   wx.navigateTo({
    //     url: '/pages/partnerBusinessEarnings/partnerBusinessEarnings',
    //   })
    // }
  }
})
var that;
var Util = require('../../utils/util.js'); 