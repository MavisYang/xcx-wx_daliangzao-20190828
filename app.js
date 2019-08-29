//app.js
App({
  data: {
    deviceInfo: {}
  },

  onLaunch: function () {
    var that = this;
    that.data.deviceInfo = wx.getSystemInfoSync();

    //调用API从本地缓存中获取数据
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now());
    wx.setStorageSync('logs', logs);
    wx.clearStorage();

    // 查看是否授权【只有处于授权状态，才可以利用 wx.getUserInfo 获取用户信息】
    wx.getSetting({
      success: function (res) {
        console.log(res);
        if (res.authSetting['scope.userInfo']) {
          //对于授权过小程序的用户，获取用户信息
          that.getUserRole();
        }
      }
    })
  },

  //获取用户角色
  getUserRole: function (id) {
    var that = this;
    var host = that.globalData.servsers;

    wx.login({
      success: function (res) {
        var code = res.code;
        wx.getUserInfo({
          withCredentials: true,
          success: function (res) {
            that.globalData.userInfo = res.userInfo;
            wx.request({
              url: host + "api/distributeSell/getUserRole",
              data: {
                code: code,
                iv: res.iv,
                encryptedData: res.encryptedData,
              },
              method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
              header: {
                'content-type': 'application/x-www-form-urlencoded'
              },
              success: function (res) {
                //成功
                if (res.data.code == '200') {
                  that.globalData.un_id = res.data.data.user_id;
                  that.globalData.openid = res.data.data.openid;
                  that.globalData.isNewUser = false;//不是新用户
                  that.globalData.userRole = res.data.data.userRole;
                  that.globalData.userInfo.avatarUrl = res.data.data.icon;

                  var name = res.data.data.name;
                  name = name.replace(/\?/g, '');
                  name = unescape(escape(name).replace(/\%uD.{3}/g, ''));
                  that.globalData.userInfo.nickName = name;

                  if (that.employIdCallback) {
                    that.employIdCallback(res.data.data.user_id);
                  }

                  if (that.employIdCallback2) {
                    that.employIdCallback2(res.data.data.openid);
                  }

                  if (that.employIdCallbackUser) {
                    that.employIdCallbackUser(false);
                  }

                  if (that.employIdCallbackRole) {
                    that.employIdCallbackRole(res.data.data.userRole);
                  }
                }else{
                  wx.navigateTo({
                    url: '/pages/authorize/authorize?link=midAutumn',
                  })
                }
                
                if (res.data.data == '') {
                  that.globalData.isNewUser = true;//是新用户
                }
                if (res == null || res.data == null) {
                  console.error('网络请求失败');
                  return;
                }
              }
            });

          },
          fail: function (e) {
            console.log("需重新授权");
          }
        })


      }
    });
  },

  //插入用户信息
  insertUser:function(e){
    var that = this;
    var host = that.globalData.servsers;

    wx.login({
      success: function (res) {
        var code = res.code;
        wx.getUserInfo({
          withCredentials: true,
          success: function (res) {
            that.globalData.userInfo = res.userInfo;
          }
        })
      }
    })
  },



  //设置全局变量
  globalData: {
    userInfo: [],
    un_id:null,
    open_id: null,
    openid : null,
    userRole : '',
    isNewUser : '',
    fromUserId : '',//分享者的id
    fromUserRole : '',//分享者的role
    // servsers: "https://52yqf.cn/",
    //servsers: "https://www.daliangzao.net/",//正式库
    servsers: "https://tt.daliangzao.net/",//测试库
    appid: 'wx50d128239e413fe0',//appid
    secret: 'a009cb3e46c8ecef9c54a50522f11823',//secret
  }
})
