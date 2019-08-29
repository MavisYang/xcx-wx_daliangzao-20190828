// pages/awaitState/awaitState.js
var app = getApp();
var Util = require('../../utils/util.js'); 
Page({
  data: {
    src: '',
    msg: '',
    url: '',
    name: '',
    order_number: '',
    order_userid: '',
    sendUserId: '',
    recHidden: false,
    sendHidden: false,
    time: '',
    uploadImg: [],
    newImgList: [],
    order_type: '0',
    goodsList: [],
    userInfo: {},
    showSendFriendMsg: false,//送朋友弹窗
    goodsId: 0, //送朋友-当前商品在列表中的id
    linkFlag: -1,
    shareTime: '',
    footerHidden: true, //默认底部按钮隐藏
    authorize: 0,  //授权标志位
    userInfo: {},//用户信息
    order_number_send: '',//拆分的订单号
    hiddenmodal: true, //提示弹窗 - 初始隐藏
    modalCont: '',//提示弹窗内容
    addGiftListClick: false, //判断“放入礼物盒”按钮是否点击过
    wrapShowFlag : '', //显示领取弹窗
    loadingFinish : false, //全局加载完毕
    fromUserRole : '', //分享者-用户角色
  },

  onLoad: function (options) {

    var that = this;
    var host = getApp().globalData.servsers;
    var un_id = getApp().globalData.un_id;
    var order_number = options.order_number;
    var order_number_send = options.order_number_send;
    var shareTime = options.shareTime;
    var goodsList = options.goodsList;
    goodsList = goodsList.replace(/zss/g, "&");
    goodsList = JSON.parse(goodsList); 

    console.log(goodsList);

    that.setData({
      src: options.src,
      msg: options.msg,
      url: options.url,
      name: options.name,
      order_number: options.order_number,//拆分的订单号
      order_userid: options.order_userid,//送礼物者的union_id
      time: options.time,
      uploadImg: options.uploadImg,
      newImgList: (options.uploadImg).split(","),
      order_type: '0',
      goodsName: options.goodsName,
      goodsNum: options.goodsNum,
      goodsList: goodsList,
      shareTime: options.shareTime,
      order_number_send: options.order_number_send,//赠送的订单号
      addGiftListClick: false, //判断“放入礼物盒”按钮是否点击过
      wrapShowFlag: '',
      loadingFinish:false,
      fromUserRole: options.fromUserRole,
      userInfo: getApp().globalData.userInfo
    })
    console.log("awaitState-userRole:" + options.fromUserRole);

  },

  //放入礼物盒
  addGiftList: function (e) {
    var that = this;
    var host = getApp().globalData.servsers;
    var un_id = getApp().globalData.un_id;
    var openid = getApp().globalData.openid;
    var isNewUser = getApp().globalData.isNewUser;//是否是新用户
    var order_number = that.data.order_number_send;
    var nickName = that.data.userInfo.nickName;

    console.log("openid:" + openid);

    var time = Util.formatTime(new Date());  //获赠时间

    if ((un_id == undefined || un_id == '' || un_id == null) || (openid == undefined || openid == '' || openid == null) || (nickName == undefined || nickName == '' || nickName == null)) {
      wx.navigateTo({
        url: '/pages/authorize/authorize?link=awaitState',
      })
    } else {

      var timestamp = Date.parse(new Date());
      var formIdTime = timestamp / 1000;//formId 生成时间
      var formId = e.detail;//formId
      console.log(formId);

      if (isNewUser) {//新用户 - 创建分销关系
        that.createRelation();
      }

      //针对消息模版：存储模板消息使用的form_id【操作人产生的form_id，仅可用于给当前操作人发送消息】
      wx.request({
        url: host + "userapi/insertadduserwxsend",
        data: {
          user_id: un_id,
          form_id_dz: formId.formId,
          order_number: order_number,//6开头的单号
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

      that.setData({
        addGiftListClick: true
      })

      //查询同一分享链接，礼物接收状态【根据订单号和时间做唯一标识，0为未被接收，1为被接收】 
      wx.request({
        url: host + "orderapi/findlinkByOrderNumber",
        data: {
          order_number: that.data.order_number,
          order_timeno: that.data.shareTime
        },
        method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
        header: {
          'Accept': 'application/json'
        },
        success: function (res) {
          console.log(res.data);

          if (res.data == 0) {
            that.addGiftListFun(un_id, time);
            wx.showLoading({
              title: '领取中，请稍候',
              icon: 'loading',
              mask: true,
              success: function () {

              }
            })

          } else {
            that.setData({
              hiddenmodal: false,
              modalCont: '礼物已被抢走了'
            })
            setTimeout(function () {
              that.setData({
                hiddenmodal: true
              })
            }, 1000)
            return false;
          }
          that.setData({
            linkFlag: res.data,
            footerHidden: false
          })
          console.log(res.data);

        }
      })
    }

  },

  //获取用户角色
  getUserRole: function (id) {
    var that = this;
    var host = getApp().globalData.servsers;

    wx.login({
      success: function (res) {
        var code = res.code;
        wx.getUserInfo({
          withCredentials: true,
          success: function (res) {
            console.log("aaa:");
            console.log(res);
            getApp().globalData.userInfo = res.userInfo;
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
                console.log("获取用户角色:");
                console.log(res);
                //成功
                if (res.data.code == '200') {
                  getApp().globalData.un_id = res.data.data.user_id;
                  getApp().globalData.openid = res.data.data.openid;
                  getApp().globalData.isNewUser = false;//不是新用户
                  getApp().globalData.userRole = res.data.data.userRole;
                  getApp().globalData.userInfo.avatarUrl = res.data.data.icon;
                  getApp().globalData.userInfo.nickName = res.data.data.name;

                  console.log("getUserRole-openid:" + res.data.data.openid);
                  console.log("getUserRole-isNewUser:" + getApp().globalData.isNewUser);
                  console.log("getUserRole-userRole:" + res.data.data.userRole);


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
                } else {
                  wx.navigateTo({
                    url: '/pages/authorize/authorize?link=midAutumn',
                  })
                }

                if (res.data.data == '') {
                  that.globalData.isNewUser = true;//是新用户
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

  //对应更改礼物流程方法
  addGiftListFun: function (un_id, time) {
    var that = this;
    var host = getApp().globalData.servsers;

    //更改当前链接下，接收礼物的状态为1
    // wx.request({
    //   url: host + "orderapi/updateOrder_link",
    //   data: {
    //     order_number: that.data.order_number,
    //     order_timeno: that.data.shareTime,
    //     order_linkFlag: 1
    //   },
    //   method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
    //   header: {
    //     'Accept': 'application/json'
    //   },
    //   success: function (res) {

        console.log("from_user_id:" + that.data.order_userid);

        console.log("un_id:" + un_id);
        console.log("user_head:" + that.data.userInfo.avatarUrl);
        console.log("user_name:" + that.data.userInfo.nickName);
        console.log("time:" + time);


        //对应用户保存收到的礼物
        wx.request({
          url: host + "giftapi/insertUserGift",
          data: {
            userId: un_id,
            giftImg: that.data.src,
            giftMsg: that.data.msg,
            fromUserHead: that.data.url,
            fromUserName: that.data.name,
            orderNumber: that.data.order_number,
            orderNumberGift: that.data.order_number_send,//拆分的订单号
            cTime: time,//获赠时间
            giftOtherImg: that.data.uploadImg,
            user_head: that.data.userInfo.avatarUrl,//收礼物者头像
            user_name: that.data.userInfo.nickName,//收礼物者微信名
            from_user_id: that.data.order_userid,//送礼物者union_id
            receive_flag: 1 //礼物接收状态 : 已接收
          },
          method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
          header: {
            'Accept': 'application/json'
          },
          success: function (res) {
            console.log(res.data.flag);


            //已经被领取
            if (res.data.flag == false){
              wx.hideLoading(); 
              that.setData({
                hiddenmodal: false,
                modalCont: '礼物已被抢走了'
              })
              setTimeout(function () {
                that.setData({
                  hiddenmodal: true,
                  linkFlag : 1,
                  wrapShowFlag : ''
                })

              }, 1000)
              return false;
            } else if (res.data.flag == true){
              console.log("接收礼物成功！");

              //更改"送礼物表"，回显领取状态的标志位 - receive_flag  【 0 : 未接收   1：已接收   2：超时未领取 】
              wx.request({
                url: host + "giftapi/updateReceive_flag_send",
                data: {
                  order_number: that.data.order_number,
                  order_number_gift: that.data.order_number_send,
                },
                method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
                header: {
                  'Accept': 'application/json'
                },
                success: function (res) {
                  var preFlag = that.data.flag;

                  wx.hideLoading();
                  that.setData({
                    hiddenmodal: false,
                    modalCont: '礼物领取成功'
                  })
                  setTimeout(function () {
                    that.setData({
                      hiddenmodal: true
                    })
                    wx.redirectTo({
                      url: '/pages/mineGiftList/mineGiftList?isSelectNew=1',
                    })
                  }, 1000)

                  if (res == null || res.data == null) {
                    that.setData({
                      addGiftListClick: false
                    })
                    console.error('网络请求失败');
                    return;
                  }
                }
              });


              //更改 order表 ，当前链接下，接收礼物的状态为1
              wx.request({
                url: host + "orderapi/updateOrder_link",
                data: {
                  order_number: that.data.order_number,
                  order_timeno: that.data.shareTime,
                  order_linkFlag: 1
                },
                method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
                header: {
                  'Accept': 'application/json'
                },
                success: function (res) {

                }
              })

              //修改送礼物 - 接收状态为1【已接收】 【订单列表】
              wx.request({
                url: host + "orderapi/updateOrder_linkFlag",
                data: {
                  order_number: that.data.order_number,
                  linkFlag: 1
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
              });
              
            }else{
              wx.hideLoading(); 
            }

            if (res == null || res.data == null) {
              console.error('网络请求失败');
              return;
            }
          }
        });
    //   }
    // })
  },

  //创建分销关系-当被分享用户通过分享进入客户端时进行关系确立
  createRelation: function (e) {
    var that = this;
    var host = getApp().globalData.servsers;
    var un_id = getApp().globalData.un_id;
    var fromUserId = that.data.order_userid;
    var fromUserRole = that.data.fromUserRole;

    console.log("awaitState-fromUserId:" + fromUserId);
    console.log("awaitState-un_id:" + un_id);
    console.log("awaitState-userRole:" + fromUserRole);

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


  onShow: function () {
    var that = this;
    var authorize = that.data.authorize;
    wx.showLoading({
      title: '加载中，请稍候',
      icon: 'loading',
      mask: true,
      success: function () {
      }
    })

    wx.getSetting({
      success: function (res) {
        console.log(res);
        if (res.authSetting['scope.userInfo']) {//授权过
          //对于授权过小程序的用户，获取用户信息
          that.getUserRole();
        }
      }
    })

    var host = getApp().globalData.servsers;
    var un_id = getApp().globalData.un_id;

    
    //查询订单状态 - 订单表
    wx.request({
      url: host + "orderapi/findOrderTypeByOrderNumber",
      data: {
        order_number: that.data.order_number//拆分的订单号
      },
      method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      header: {
        'Accept': 'application/json'
      },
      success: function (res) {
        console.log("状态：" + res.data);
        that.setData({
          order_type: res.data
        })
        if (res.data != 2) {//朋友未完全收下礼物【可能转送了】

          console.log("order_number:" + that.data.order_number);
          console.log("shareTime:" + that.data.shareTime);

          console.log("order_number_send:" + that.data.order_number_send);

          //查询同一分享链接，礼物接收状态【根据订单号和时间做唯一标识，0为未被接收，1为被接收, 2为超时未领取】 
          wx.request({
            url: host + "orderapi/findlinkByOrderNumber",
            data: {
              order_number: that.data.order_number,
              order_timeno: that.data.shareTime
            },
            method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
            header: {
              'Accept': 'application/json'
            },
            success: function (res) {
              console.log(res.data);
              if (res.data == 0) {
                that.setData({
                  wrapShowFlag: 'wrapShow',
                }) 
              }
              that.setData({
                linkFlag: res.data,
                footerHidden: false,
                loadingFinish: true
              })
              wx.hideLoading(); 

            }
          })
        }

        if (res == null || res.data == null) {
          console.error('网络请求失败');
          return;
        }
      }
    });

    if (un_id != undefined) {
        that.setData({
          userInfo: getApp().globalData.userInfo,
        })
        console.log("un_id::" + un_id);
    }
  },

  onHide:function(){
    var that = this;
    that.setData({
      wrapShowFlag: '',
      loadingFinish:false
    })
    wx.hideLoading(); 
  },

  //页面卸载[完全关闭]
  onUnload:function () {
    var that = this;
    that.setData({
      wrapShowFlag: '',
      loadingFinish: false,
    })
    wx.hideLoading(); 
  },

  selectWuliu: function () {
    var that = this;
    wx.navigateTo({
      url: '/pages/wuliu/wuliu?id=' + that.data.order_number,
      success: function (res) { },
      fail: function (res) { },
      complete: function (res) { },
    })
  },
  wantSent: function (e) {
    wx.switchTab({
      url: '/pages/index/index'
    })
  },
  previewImg: function (e) {//banner图预览
    var that = this;
    var currentUrl = e.currentTarget.dataset.src;
    wx.previewImage({
      current: currentUrl,
      urls: that.data.uploadImg.imgList
    })
  },
  getGift: function () {//领取礼物
    var that = this;
    var host = getApp().globalData.servsers;
    var order_number = that.data.order_number;
    wx.navigateTo({
      url: '/pages/addAddressFriend/addAddressFriend?order_number=' + order_number
    })
  },
})