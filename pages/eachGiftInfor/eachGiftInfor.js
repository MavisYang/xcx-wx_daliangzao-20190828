// pages/eachGiftInfor/eachGiftInfor.js
// pages/awaitState/awaitState.js
var app = getApp()
Page({
  data: {
    src: '',
    msg: '',
    url: '',
    name: '',
    
    order_userid: '',
    sendUserId: '',
    recHidden: false,
    sendHidden: false,
    time: '',
    uploadImg: [],
    newImgList: [],
    order_type: '0',
    goodsList: [],
    showSendFriendMsg: false,//送朋友弹窗
    goodsId: 0, //送朋友-当前商品在列表中的id
    linkFlag: -1,
    shareTime: '',
    footerHidden: true, //默认底部按钮隐藏
    authorize: 0,  //授权标志位
    userInfo: {},//用户信息
    from_user_id:'',//送礼物者union_id
    order_number: '',//订单号
    infor:{},
    listId:'',
    from_user_name:'',
    order_num_o: '',//原始单
    orderNumber: '',//拆分单
    orderNumberGift: '',//分享单号

  },

  onLoad: function (options) {
    var that = this;
    var host = getApp().globalData.servsers;
    var un_id = getApp().globalData.un_id;

    var order_num_o = options.order_num_o;//原始单
    var orderNumber = options.orderNumber;//拆分单
    var orderNumberGift = options.orderNumberGift;//分享单号

    var from_user_id = options.from_user_id;
    var shareTime = options.shareTime;
    var sta = options.sta;
    var listId = options.listId;

    console.log(options.infor);

    var infor = options.infor;


    // $nickname = preg_replace('/[\x{1F600}-\x{1F64F}]/u', '', $nickname);
    // $nickname = preg_replace('/[\x{1F300}-\x{1F5FF}]/u', '', $nickname);
    // $nickname = preg_replace('/[\x{1F680}-\x{1F6FF}]/u', '', $nickname);
    // $nickname = preg_replace('/[\x{2600}-\x{26FF}]/u', '', $nickname);
    // $nickname = preg_replace('/[\x{2700}-\x{27BF}]/u', '', $nickname);
    // $nickname = str_replace(array('"', '\''), '', $nickname);
    // $nickname = addslashes(trim($nickname));  

    //infor = infor.replace(/zss/g, "&");





    infor = JSON.parse(infor);




    console.log(infor);

    that.setData({
      from_user_id: from_user_id,
      order_num_o: order_num_o,
      orderNumber: orderNumber,
      orderNumberGift: orderNumberGift,
      sta: sta,
      listId: listId,
      infor: infor,
      src: infor.giftImg,
      goodsName: infor.affList[0].com_name,
      goodsNum: infor.affList[0].com_num,
      url: infor.fromUserHead,
      name: infor.fromUserName,
      msg: infor.giftMsg,
      newImgList: infor.imgList,
      order_userid: options.order_userid,//送礼物者的union_id
    })

    console.log("sta:" + sta);
    console.log("order_type:" + that.data.order_type);

    console.log("order_num_o:" + order_num_o);
    console.log("orderNumber:" + orderNumber);
    console.log("orderNumberGift:" + orderNumberGift);

    console.log("from_user_id:" + from_user_id);

    console.log(infor);
    
    if (un_id != undefined && un_id != '' && un_id != null){

      //查询订单状态
      wx.request({
        url: host + "orderapi/findOrderTypeByOrderNumber",
        data: {
          order_number: orderNumber
        },
        method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
        header: {
          'Accept': 'application/json'
        },
        success: function (res) {
          that.setData({
            order_type: res.data
          })
          console.log("order_type2:"+res.data);
          if (res.data != 2) {//朋友未完全收下礼物【可能转送了】

            console.log("shareTime:" + shareTime);

            //查询同一分享链接，礼物接收状态【根据订单号和时间做唯一标识，0为未被接收，1为被接收】 
            wx.request({
              url: host + "orderapi/findlinkByOrderNumber",
              data: {
                order_number: orderNumber,
                order_timeno: shareTime
              },
              method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
              header: {
                'Accept': 'application/json'
              },
              success: function (res) {
                console.log("linkFlag:"+res.data);
                that.setData({
                  linkFlag: res.data,
                  footerHidden: false
                })
              }
            })
          }

          if (res == null || res.data == null) {
            console.error('网络请求失败');
            return;
          }
        }
      });
    }

  },

  addGiftList: function (e) {
    var that = this;
    var host = getApp().globalData.servsers;
    var un_id = getApp().globalData.un_id;
    var openid = getApp().globalData.openid;
    var order_number = that.data.order_number;

    if ((un_id == undefined || un_id == '' || un_id == null) || (openid == undefined || openid == '' || openid == null)) {
      wx.navigateTo({
        url: '/pages/authorize/authorize?link=awaitState',
      })
    } else {

      //更改当前链接下，接收礼物的状态为1
      wx.request({
        url: host + "orderapi/updateOrder_link",
        data: {
          order_number: that.data.orderNumber,
          order_timeno: that.data.shareTime,
          order_linkFlag: 1
        },
        method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
        header: {
          'Accept': 'application/json'
        },
        success: function (res) {

          //修改送礼物 - 接收状态为1【已接收】 
          wx.request({
            url: host + "orderapi/updateOrder_linkFlag",
            data: {
              order_number: that.data.orderNumber,
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


          //对应用户保存收到的礼物
          wx.request({
            url: host + "giftapi/insertUserGift",
            data: {
              userId: un_id,
              giftImg: that.data.src,
              giftMsg: that.data.msg,
              fromUserHead: that.data.url,
              fromUserName: that.data.name,
              orderNumber: that.data.orderNumber,
              orderNumberGift: that.data.orderNumberGift,//拆分的订单号
              cTime: that.data.time,
              giftOtherImg: that.data.uploadImg,
              user_head: taht.data.userInfo.avatarUrl,//收礼物者头像
              user_name: taht.data.userInfo.nickName,//收礼物者微信名
              from_user_id: that.data.order_userid,//送礼物者union_id
              receive_flag: 0 //礼物接收状态
            },
            method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
            header: {
              'Accept': 'application/json'
            },
            success: function (res) {
              console.log("接收礼物成功！");
              
              //更改"送礼物表"标志位
              wx.request({
                url: host + "giftapi/updateReceive_flag_send",
                data: {
                  order_number: that.data.orderNumber,
                  order_number_gift: that.data.orderNumberGift,
                },
                method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
                header: {
                  'Accept': 'application/json'
                },
                success: function (res) {
                  var preFlag = that.data.flag;
                  // if (preFlag == '1') {//来自礼物详情页【awaitState】
                  //   wx.navigateTo({
                  //     url: '/pages/mineGiftList/mineGiftList?isSelectNew=1',
                  //   })
                  // } else {
                  //   wx.navigateBack({
                  //     delta: 1
                  //   })
                  // }
                  wx.navigateTo({
                    url: '/pages/mineGiftList/mineGiftList?isSelectNew=1',
                  })
                  if (res == null || res.data == null) {
                    console.error('网络请求失败');
                    return;
                  }
                }
              });

              if (res == null || res.data == null) {
                console.error('网络请求失败');
                return;
              }
            }
          });
        }
      })
    }

  },


  onShow: function () {
    var that = this;
    var authorize = that.data.authorize;
    var un_id = getApp().globalData.un_id;
    if (authorize == 1) {//调起授权，并且授权成功
      //直接执行放入礼物盒操作
      //that.addGiftList();
    }
    if (un_id != undefined && un_id != '' && un_id != null) {
        that.setData({
          userInfo: getApp().globalData.userInfo,
        })
        console.log("un_id::" + un_id);
    }
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
  sendBtn: function (e) {//送朋友 - 提示弹窗
    var that = this;
    var id = e.currentTarget.dataset.id;//i
    that.setData({
      showSendFriendMsg: true
    })
  },

  sureSendFriend: function (options) {//送朋友 - 确定
    var that = this;
    var order_number = that.data.order_number;
    var imgSrc = that.data.goodsList.affList[0].logo;

    var goodsList = that.data.goodsList;
    var newCarts = JSON.stringify(that.data.goodsList);
    newCarts = newCarts.replace(/&/g, "zss");

    that.setData({
      showSendFriendMsg: false
    })

    setTimeout(function () {
      wx.navigateTo({
        url: '/pages/share/share?src=' + imgSrc + "&id=" + goodsList.affList[0].com_id + '&order_number=' + goodsList.order.order_number + '&order_userid=' + goodsList.order.order_userid + "&goodsNme=" + goodsList.affList[0].com_name + "&goodsNum=" + goodsList.affList[0].com_num + "&goodsList=" + newCarts + "&flag=1",
        success: function (res) {

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
})