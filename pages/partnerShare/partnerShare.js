// pages/partnerShare/partnerShare.js
var that;
var Util = require('../../utils/util.js');
var app = getApp();
Page({
  data: {
    urlHttp: '',
    hiddenmodal: true, //提示弹窗
    userPhoto: '',     //用户头像
    userName: '',      //用户昵称
    fromUserId: '',    //分享人的un_id
    fromUserPhoto : '',
    fromUserName : '',
    fromUserRole : '',
    userRole :0,       //用户身份【默认普通用户】
    un_id : '',        //当前用户un_id
  },

  onLoad: function (options) {
    var that = this;
    var host = getApp().globalData.servsers;
    var un_id = getApp().globalData.un_id;
    var openid = getApp().globalData.openid;
    var fromUserId = options.fromUserId;//分享人的un_id
    var fromUserPhoto = options.fromUserPhoto;
    var fromUserName = options.fromUserName;
    var fromUserRole = options.fromUserRole;
    that.setData({
      urlHttp: host,
      fromUserId: fromUserId,
      fromUserPhoto: fromUserPhoto,
      fromUserName: fromUserName,
      fromUserRole: fromUserRole
    })
  },

  //返回首页
  backIndex: function (e) {
    wx.switchTab({
      url: '/pages/index/index',
    })
  },

  //立即加入
  addPartner:function(e){
    var that = this;
    var host = getApp().globalData.servsers;
    var un_id = getApp().globalData.un_id;
    var openid = getApp().globalData.openid;
    var isNewUser = getApp().globalData.isNewUser; //新用户标识
    var fromUserId = that.data.fromUserId;//分享人的un_id
    var userRole = that.data.fromUserRole;//分享人的角色

    console.log("shae1-un_id:" + un_id);
    console.log("shae1-openid:" + openid);
    console.log("shae1-isNewUser:" + isNewUser);
    console.log("shae1-userRole:" + userRole);

    
    if ((un_id == undefined || un_id == '' || un_id == null) || (openid == undefined || openid == '' || openid == null)){//最原始用户【模板消息前的用户】

      wx.navigateTo({
        url: '/pages/authorize/authorize?link=partnerShare',
      })

    } else if (isNewUser == true){

      //创建分销关系-当被分享用户通过分享进入客户端时进行关系确立
      wx.request({
        url: host + "api/distributeSell/createRelation",
        data: {
          shareUserId: fromUserId,//分享用户userId
          currentUserId: un_id,//当前操作用户userId
          userRole: userRole,//分销人 - 用户角色 0：普通用户  1：商务用户
        },
        method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
        header: {
          'Accept': 'application/json'
        },
        success: function (res) {
          if (res.data.code == '200') {

            // 转发成功
            that.setData({
              hiddenmodal: false,
              modalCont: '加入成功'
            })
            setTimeout(function () {
              that.setData({
                hiddenmodal: true
              })
              wx.navigateTo({
                url: '/pages/midAutumn/midAutumn',
              })
            }, 800)

          } else {//请求失败
            that.setData({
              hiddenmodal: false,
              modalCont: '网络异常，请重新操作！'
            })
            setTimeout(function () {
              that.setData({
                hiddenmodal: true
              })
            }, 800)
          }

          if (res == null) {
            that.setData({
              hiddenmodal: false,
              modalCont: '网络异常，请重新操作！'
            })
            setTimeout(function () {
              that.setData({
                hiddenmodal: true
              })
            }, 800)
            return;
          }
        }
      })

    }else{

      that.setData({
        hiddenmodal: false,
        modalCont: '仅限新用户，快去分享好友开始赚钱吧！'
      })
      setTimeout(function () {
        that.setData({
          hiddenmodal: true
        })
        wx.navigateTo({
          url: '/pages/midAutumn/midAutumn',
        })
      }, 800)
      return false;

    }
  },

  onHide: function () {
    var that = this;
    that.setData({
      fromUserId: '',
      fromUserPhoto: '',
      fromUserName: '',
      fromUserRole: ''
    })
  },

  //页面卸载[完全关闭]
  onUnload: function () {
    var that = this;
    that.setData({
      fromUserId: '',
      fromUserPhoto: '',
      fromUserName: '',
      fromUserRole: ''
    })
  },
})