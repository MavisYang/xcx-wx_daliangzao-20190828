// feedback.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    urlHttp : '',
    textareaCont : '',
    telphone : '',
    hiddenmodal: true, //弹窗
    modalCont: ''
  },
  onLoad: function (options) {
    var that = this;
    var host = getApp().globalData.servsers;
    that.setData({
      urlHttp: host
    });
  },
  textareaInput:function(e){//反馈内容赋值
    var that = this;
    that.setData({
      textareaCont: e.detail.value
    })
  },
  telphoneInput:function(e){//手机号赋值
    var that = this;
    that.setData({
      telphone: e.detail.value
    })
  },

  feedback:function(e){
    var host = getApp().globalData.servsers;
    var un_id = getApp().globalData.un_id;
    var openid = getApp().globalData.openid;
    var that = this;
    if (that.data.textareaCont == ''){
      that.setData({
        hiddenmodal: false,
        modalCont : '反馈内容不得为空'
      })
      setTimeout(function () {
        that.setData({
          hiddenmodal: true
        })
      }, 1000)
      return false;
    }
    var nickName = getApp().globalData.userInfo.nickName;
    var avatarUrl = getApp().globalData.userInfo.avatarUrl;

    if ((un_id == undefined || un_id == '' || un_id == null) || (openid == undefined || openid == '' || openid == null)){
      wx.navigateTo({
        url: '/pages/authorize/authorize?link=feedback',
      })
    }else{
      wx.request({
        url: host + "feedbackapi/insertadd",
        data: {
          user_id: un_id,
          textareaCont: that.data.textareaCont,//反馈内容
          telphone: that.data.telphone,//手机号码（选填）
          nickName: nickName,//用户昵称（选填）
          avatarUrl: avatarUrl//头像（选填）
        },
        method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
        header: {
          'Accept': 'application/json'
        },
        success: function (res) {
          that.setData({
            hiddenmodal: false,
            modalCont: '提交成功'
          })
          setTimeout(function () {
            that.setData({
              hiddenmodal: true
            })
            wx.navigateBack({})

          }, 1000)

          if (res == null || res.data == null) {
            console.error('网络请求失败');
            return;
          }
        }
      })

    }
   
  },

})
var Util = require('../../utils/util.js'); 