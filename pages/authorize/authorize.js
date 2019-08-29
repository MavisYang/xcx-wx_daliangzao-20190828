// pages/authorize/authorize.js
var app = getApp();
Page({

  data: {
    link :'' ,//授权成功后的跳转地址
    code : '',
    fromUserId : '',//分享者的id
    fromUserRole : '',//分享者的角色
    hiddenmodal: true, //提示弹窗 - 初始隐藏
  },

  onLoad: function (options) {
    var that = this;
    var link = options.link;
    that.setData({
      link: link
    })
  },

  onShow:function(){
    var that = this;
    wx.login({
      success: function (res) {
        if (res.code) {
          that.setData({
            code: res.code
          })
        }
      }
    })
  },

  //确认授权
  onGotUserInfo:function(e){
    var that = this;
    var userInfo = e.detail.userInfo;
    var host = getApp().globalData.servsers;
    var un_id = e.detail.userInfo;
    var link = that.data.link;

    console.log(e.detail);

    if (userInfo != undefined){
      var pages = getCurrentPages();
      var currPage = pages[pages.length - 1];  //当前页面
      var prevPage = pages[pages.length - 2]; //上一个页面
      var prevPageUrl = prevPage.route;

      var name = e.detail.userInfo.nickName;
      name = name.replace(/\?/g, '');
      name = unescape(escape(name).replace(/\%uD.{3}/g, ''));

      var icon = e.detail.userInfo.avatarUrl;
      var iv = e.detail.iv;
      var encryptedData = e.detail.encryptedData;
      getApp().globalData.userInfo = userInfo;

      // wx.login({
      //   success: function (res) {
            var code = that.data.code;
            console.log("code:" + code);
            wx.request({
              url: host + "userapi/insertadd",
              data: {
                user_id: code,
                name: name,
                icon: icon,
                iv: iv,
                encryptedData: encryptedData,
              },
              method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
              header: {
                'Accept': 'application/json'
              },
              success: function (res) {

                console.log("auu:");
                console.log(res);
                if(res.data.code == 500){
                  that.setData({
                    hiddenmodal: false,
                    modalCont: '授权超时，请重新授权！'
                  })
                  setTimeout(function () {
                    that.setData({
                      hiddenmodal: true
                    })
                    wx.login({
                      success: function (res) {
                        if (res.code) {
                          that.setData({
                            code: res.code
                          })
                        }
                      }
                    })
                  }, 1000)
                  return false;
                }else{

                  //确认授权
                  getApp().globalData.un_id = res.data.unionId;
                  getApp().globalData.openid = res.data.openid;
                  getApp().globalData.isNewUser = res.data.isNewUser;
                  getApp().globalData.userRole = res.data.userRole;

                  console.log("authorize-unionId:" + res.data.unionId);
                  console.log("authorize-openid:" + res.data.openid);
                  console.log("authorize-isNewUser:" + res.data.isNewUser);
                  console.log("authorize-userRole:" + res.data.userRole);

                  console.log("link:" + link);

                  //授权成功后，跳转
                  if (link != 'awaitState' && link != 'buy' && link != 'mine') {//来自收礼物页面的授权请求  来自产品详情页
                    wx.redirectTo({
                      url: "/pages/" + link + "/" + link,
                    })
                  } else if (link == 'buy') {
                    prevPage.setData({
                      authorize: 1
                    })
                    wx.navigateBack({
                      delta: 1
                    })
                  } else if (link == 'mine') {
                    wx.switchTab({
                      url: "/pages/" + link + "/" + link,
                    })

                  } else if (link == 'midAutumn') {
                    wx.navigateBack({
                      delta: 1
                    })
                  } else {
                    prevPage.setData({
                      authorize: 1
                    })
                    wx.navigateBack({
                      delta: 2
                    })
                  }

                  if (res == null || res.data == null) {
                    console.error('网络请求失败');
                    return;
                  }

                }


               
                  
              }
            })

      //   }
      // })

    }else{
      //拒绝
      return false;
    }
  },

  //页面卸载[完全关闭]
  onUnload: function () {
    var that = this;
    that.setData({
      wrapShowFlag: '',
      loadingFinish: false,
    })
    wx.hideLoading();
  },

})
var Util = require('../../utils/util.js'); 