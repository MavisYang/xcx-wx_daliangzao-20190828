// pages/indepCoupon/indepCoupon.js
var app = getApp();
var WxParse = require('../../wxParse/wxParse.js');
Page({
  data: {
    hiddenmodal: true, //提示弹窗
    shareFlag : 0
  },

  onLoad: function (options) {
    var that = this;
    var shareFlag = options.shareFlag;
    if (shareFlag != '' && shareFlag != null && shareFlag != undefined) {
      that.setData({
        shareFlag: shareFlag
      })
    }
  },

  //获取优惠劵
  getCoupon:function(e){
    var that = this;
    var host = getApp().globalData.servsers;
    var un_id = getApp().globalData.un_id;

    //优惠劵共有25张

    wx.login({
      success: function (res) {
        var code = res.code;
        wx.getUserInfo({
          withCredentials: true,
          success: function (res) {
            wx.request({
              url: host + "userapi/insertadd",
              data: {
                user_id: code,
                name: res.userInfo.nickName,
                icon: res.userInfo.avatarUrl,
                iv: res.iv,
                encryptedData: res.encryptedData,
              },
              method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
              header: {
                'Accept': 'application/json'
              },
              success: function (res) {
                that.setData({
                  un_id: res.data.unionId
                })
                var un_id = res.data.unionId;

                if (un_id != undefined && un_id != '' && un_id != null){
                  //判断是否还有剩余优惠劵

                  wx.request({
                    url: host + "mycouponapi/insertaddno2",
                    data: {
                      user_id: un_id,
                      coupon_id: '5',
                      batch_no: '2'
                    },
                    method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
                    header: {
                      'Accept': 'application/json'
                    },
                    success: function (res) {

                      if (res.data.result > 0) {//优惠劵有剩余

                        that.setData({
                          hiddenmodal: false,
                          modalCont: '领取成功'
                        })
                        setTimeout(function () {
                          that.setData({
                            hiddenmodal: true
                          })
                          wx.redirectTo({
                            url: '/pages/girlsDay/girlsDay'
                          })
                        }, 1000)

                      } else {
                        //优惠劵张数已用尽 提示
                        that.setData({
                          hiddenmodal: false,
                          modalCont: '优惠劵已被抢空！'
                        })
                        setTimeout(function () {
                          that.setData({
                            hiddenmodal: true
                          })
                          wx.redirectTo({
                            url: '/pages/girlsDay/girlsDay'
                          })
                        }, 1000)
                      }
                    }
                  })
                }
                //判断结束

                if (res == null || res.data == null) {
                  console.error('网络请求失败');
                  return;
                }
              }
            })
          }
        })
      }
    })
    return false;

  },

  onShareAppMessage: function (res) {//页面分享
    var that = this;
    var host = getApp().globalData.servsers;
    if (res.from === 'button') {
      // 来自页面内转发按钮
      console.log(res.target)
    }
    return {
      title: '大良造-送您一张无门槛优惠劵！',
      path: '/pages/indepCoupon/indepCoupon?shareFlag=1',
      success: function (res) {
        that.setData({
          hiddenmodal: false,
          modalCont: '分享成功'
        })
        setTimeout(function () {
          that.setData({
            hiddenmodal: true
          })
          wx.redirectTo({
            url: '/pages/girlsDay/girlsDay'
          })
        }, 1000)
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
var imageUtil = require('../../utils/util.js'); 