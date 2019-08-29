// pages/partner/mineEarnings/mineEarnings.js
var that;
var Util = require('../../utils/util.js');
var app = getApp();
Page({
  data: {
    urlHttp: '',
    hiddenmodal: true, //提示弹窗
    userPhoto: '', //用户头像
    userName: '', //用户昵称
    recordList : {},//提现记录
    accountList:{},//账户信息
    allMoney : 0,  //账户总金额
    allEarnings : 0, //累计收益
    allInviteNum : 0, //邀请数量
    
  },

  onLoad: function (options) {
    var that = this;

    var host = getApp().globalData.servsers;
    var un_id = getApp().globalData.un_id;
    var openid = getApp().globalData.openid;

    console.log("un_id:" + un_id);
    console.log("openid:" + openid);

    if ((un_id == undefined || un_id == '' || un_id == null) || (openid == undefined || openid == '' || openid == null)) {
      wx.navigateTo({
        url: '/pages/authorize/authorize?link=partnerMineEarnings',
      })
    }else{
      console.log(getApp().globalData.userInfo);
      var userPhoto = getApp().globalData.userInfo.avatarUrl;
      var userName = getApp().globalData.userInfo.nickName;
      that.setData({
        urlHttp: host,
        userPhoto: userPhoto,
        userName: userName
      })
    }
  },


  onShow: function () {
    var that = this;
    var host = getApp().globalData.servsers;
    var un_id = getApp().globalData.un_id;
    var openid = getApp().globalData.openid;
    var userRole = getApp().globalData.userRole;


    // //获取用户账户信息
    wx.request({
      url: host + "api/distributeSell/getMyEarnInfo",
      data: {
        userId  : un_id,     //当前用户userId
        userRole: userRole,  //用户角色
      },
      method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      header: {
        'Accept': 'application/json'
      },
      success: function (res) {
        console.log(res);
        if (res.data.code == '200') {
          that.setData({
            allMoney: res.data.data.accountBalance,  //账户总金额
            allEarnings: res.data.data.accumulativeTotalEarn, //累计收益
            allInviteNum: res.data.data.sharePersonNum, //邀请数量
          })  
        }
        if (res == null || res.data == null) {
          console.error('网络请求失败');
          return;
        }
      }
    })

    // //提现记录
    // wx.request({
    //   url: host + "api/distributeSell/getExtractApplyList",
    //   data: {
    //      userId  : un_id,     //当前用户userId
    //      userRole: userRole,  //用户角色
    //   },
    //   method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
    //   header: {
    //     'Accept': 'application/json'
    //   },
    //   success: function (res) {
    //     if(res.data.code == '200'){
    //       that.setData({
    //         recordList: res.data.data.rows
    //       })  
    //     }
    //     if (res == null || res.data == null) {
    //       console.error('网络请求失败');
    //       return;
    //     }
    //   }
    // })

  },


  //邀请数量 、 累计收益 ： 详情入口
  inviteRecord:function(e){
    var that = this;
    var id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '/pages/partnerCommonRecord/partnerCommonRecord?id=' + id,
    })
  },

  //申请提现
  applyWithdrawal:function(e){
    var that = this;
    that.setData({
      hiddenmodal: false,
      modalCont: '账户金额不足提现最低金额'
    })
    setTimeout(function () {
      that.setData({
        hiddenmodal: true
      })
    }, 1000)
  },

  //邀请好友 - 页面分享
  // onShareAppMessage: function (res) {
  //   var that = this;
  //   var host = getApp().globalData.servsers;
  //   var un_id = getApp().globalData.un_id;
  //   var fromUserPhoto = getApp().globalData.userInfo.avatarUrl;
  //   var fromUserName = getApp().globalData.userInfo.nickName;

  //   if (res.from === 'button') {
  //     // 来自页面内转发按钮
  //   }
  //   return {
  //     title: that.data.title,
  //     path: '/pages/partnerShare/partnerShare?fromUserId=' + un_id + '&fromUserPhoto=' + fromUserPhoto + '&fromUserName=' + fromUserName,
  //     imageUrl: '',
  //     success: function (res) {
  //       // 转发成功
  //       that.setData({
  //         hiddenmodal: false,
  //         modalCont: '分享成功'
  //       })
  //       setTimeout(function () {
  //         that.setData({
  //           hiddenmodal: true
  //         })
  //       }, 1000)
  //     },
  //     fail: function (res) {
  //       // 取消分享、转发失败
  //     }
  //   }
  // },

  onShareAppMessage: function (res) {
    var that = this;
    var host = getApp().globalData.servsers;
    var un_id = getApp().globalData.un_id;
    var fromUserPhoto = getApp().globalData.userInfo.avatarUrl;
    var fromUserName = getApp().globalData.userInfo.nickName;
    var fromUserRole = getApp().globalData.userRole;

    console.log("share-un_id:" + un_id);

    if (res.from === 'button') {
      // 来自页面内转发按钮
    }
    return {
      title: that.data.title,
      path: '/pages/midAutumn/midAutumn?fromUserId=' + un_id + '&fromUserRole=' + fromUserRole,
      imageUrl: '/images/share_img.jpg',
      success: function (res) {
        // 转发成功
        that.setData({
          hiddenmodal: false,
          modalCont: '分享成功'
        })
        setTimeout(function () {
          that.setData({
            hiddenmodal: true
          })
        }, 1000)
      },
      fail: function (res) {
        // 取消分享、转发失败
      }
    }
  },

})