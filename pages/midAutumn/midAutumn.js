// pages/dragonBoatFestival/dragonBoatFestival.js
var app = getApp();
Page({
  data: {
    urlHttp: '',
    src:'',
    flag: 0,   //隐藏引导页商品信息的标志位,0为隐藏，1为显示
    fromUserId : '',//分享者的un_id
  },
  onLoad: function (options) {
    var that = this;
    var partnerShare = options.partnerShare;
    var host = getApp().globalData.servsers;
    var fromUserId = options.fromUserId;
    var fromUserRole = options.fromUserRole;
    console.log("fromUserId:0000" + options.fromUserId);
    console.log("fromUserRole:0000" + options.fromUserRole);

    if (fromUserId != undefined){
      getApp().globalData.fromUserId = options.fromUserId;
      getApp().globalData.fromUserRole = options.fromUserRole;
    }
    that.setData({
      urlHttp: host
    })
  },

  onShow:function(e){
    var that = this;
    var host = getApp().globalData.servsers;
    var un_id = getApp().globalData.un_id;
    var openid = getApp().globalData.openid;
    var isNewUser = getApp().globalData.isNewUser;
    var fromUserId = getApp().globalData.fromUserId;
    var fromUserRole = getApp().globalData.fromUserRole;

    console.log("fromUserId:" + fromUserId);
    console.log("fromUserRole:" + fromUserRole);

    //来自分享
    if (fromUserId != ''){
      console.log("infor:来自分享");
      wx.getSetting({
        success: function (res) {
          console.log(res);
          if (res.authSetting['scope.userInfo']) {//授权过

            if (getApp().globalData.un_id && getApp().globalData.un_id != '' && getApp().globalData.un_id != undefined) {

              var isNewUser = getApp().globalData.isNewUser; //新用户标识

              if (isNewUser) {
                that.createRelation();
              } else {
                console.log("老用户-isNewUser:" + isNewUser);
              }

            } else {
              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止  onLoad 和 onShow  在  onLaunch  之前执行
              getApp().employIdCallback = un_id => {

                if (un_id != '') {
                  var isNewUser = getApp().globalData.isNewUser; //新用户标识
                  console.log("isNewUser:" + isNewUser);
                  if (isNewUser) {
                    that.createRelation();
                  } else {
                    console.log("mid-isNewUser22:" + isNewUser);
                  }
                }
              }
            }

          }else{
            wx.navigateTo({
              url: '/pages/authorize/authorize?link=midAutumn&fromUserId=fromUserId&fromUserRole=fromUserRole',
            })
          }
        }
      })
      
    }else{

      wx.getSetting({
        success: function (res) {
          console.log(res);
          if (res.authSetting['scope.userInfo']) {//授权过
            if (getApp().globalData.un_id && getApp().globalData.un_id != '' && getApp().globalData.un_id != undefined) {

              var isNewUser = getApp().globalData.isNewUser; //新用户标识
              if (isNewUser) {
                console.log("自己进入的新用户-1");
              } else {
                console.log("自己进入的老用户-1");
              }

            } else {
              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止  onLoad 和 onShow  在  onLaunch  之前执行
              getApp().employIdCallback = un_id => {

                if (un_id != '') {
                  if (isNewUser) {
                    console.log("自己进入的新用户-2");
                  } else {
                    console.log("自己进入的老用户-2");
                  }
                }
              }
            }
          }
        }
      })
    }

    
    //隐藏引导页商品信息
    wx.request({
      url: host + "tempUpdate/getNum",
      data: {

      },
      method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      header: {
        'Accept': 'application/json'
      },
      success: function (res) {
        console.log(res.data);
        that.setData({
          //flag: res.data
          flag: 1
        })
        if (res == null || res.data == null) {
          console.error('网络请求失败');
          return;
        }
      }
    })
  },

  //获取用户角色
  getUserRole: function (id) {
    var that = this;
    var un_id = getApp().globalData.un_id;
    var openid = getApp().globalData.openid;
    var isNewUser = getApp().globalData.isNewUser;
    var fromUserId = that.data.fromUserId;
    var fromUserRole = that.data.fromUserRole;

    wx.login({
      success: function (res) {
        var code = res.code;
        console.log("get-code:" + code);
        wx.getUserInfo({
          withCredentials: true,
          success: function (res) {
            getApp().globalData.userInfo = res.userInfo;
            //console.log("code:" + code);
            //console.log("iv:" + res.iv);
            //console.log("encryptedData:" + res.encryptedData);

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
                console.log("user-infor");
                console.log(res);
                //成功
                if (res.data.code == '200') {
                  getApp().globalData.un_id = res.data.data.user_id;
                  getApp().globalData.openid = res.data.data.openid;
                  getApp().globalData.isNewUser = false;//不是新用户
                  getApp().globalData.userRole = res.data.data.userRole;
                  getApp().globalData.userInfo.avatarUrl = res.data.data.icon;
                  getApp().globalData.userInfo.nickName = res.data.data.name;

                  console.log("getUserRole-openid1:" + res.data.data.openid);
                  console.log("getUserRole-isNewUser2:" + res.data.data.isNewUser);
                  console.log("getUserRole-userRole3:" + res.data.data.userRole);

                } else if (res.data.data == '') {
                  getApp().globalData.isNewUser = true;//是新用户
                  console.log("getUserRole-isNewUser:" + res.data.isNewUser);
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

  //创建分销关系-当被分享用户通过分享进入客户端时进行关系确立
  createRelation: function (e) {
    var that = this;
    var host = getApp().globalData.servsers;
    var un_id = getApp().globalData.un_id;
    var fromUserId = getApp().globalData.fromUserId;
    var fromUserRole = getApp().globalData.fromUserRole;

    console.log("from-fromUserId:" + fromUserId);
    console.log("create-un_id:" + un_id);
    console.log("from-userRole:" + fromUserRole);

    wx.request({
      url: host + "api/distributeSell/createRelation",
      data: {
        shareUserId: fromUserId,//分享者 - 用户userId
        currentUserId: un_id,//当前操作用户userId
        userRole: fromUserRole,//分享者 - 用户角色 0：普通用户  1：商务用户
      },
      method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      header: {
        'Accept': 'application/json'
      },
      success: function (res) {
        if (res.data.code == '200') {
          console.log('分销关系建立成功');
        }
        if (res == null) {
          console.log('网络异常，请重新操作！');
          return;
        }
      }
    })
  },


  linkIndex:function(){
    wx.switchTab({
      url:'/pages/index/index'
    })
  }
})