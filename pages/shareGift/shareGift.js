// pages/share/share.js
var app = getApp();
var cardList = [
  { id: 1, src: 'images/sendCards/send_cards_1.jpg', intro: '生日快乐' },
  { id: 2, src: 'images/sendCards/send_cards_2.jpg', intro: '很高兴遇见你' },
  { id: 3, src: 'images/sendCards/send_cards_3.jpg', intro: '多谢关照' },
  { id: 4, src: 'images/sendCards/send_cards_4.jpg', intro: '感谢有你' },
  { id: 5, src: 'images/sendCards/send_cards_5.jpg', intro: '欢度国庆' },
  { id: 6, src: 'images/sendCards/send_cards_6.jpg', intro: '清凉一夏' },
  { id: 7, src: 'images/sendCards/send_cards_7.jpg', intro: '新春快乐' },
  { id: 8, src: 'images/sendCards/send_cards_8.jpg', intro: '有空长聚' },
  { id: 9, src: 'images/sendCards/send_cards_9.jpg', intro: '有你真好' }
];
Page({
  onShareAppMessage: function (res) {
    var that = this;
    var host = getApp().globalData.servsers;
    var un_id = getApp().globalData.un_id;
    if (this.data.msg == '' || this.data.msg == undefined) {
      this.setData({
        msg: '小小心意'
      })
    }
    if (res.from === 'button') {
      // 来自页面内转发按钮
      console.log("11:" + res.target)
    }

    var time = Util.formatTime(new Date());  //获赠时间
    var shareTime = Date.parse(new Date());//分享时间
    shareTime = shareTime / 1000;

    var pages = getCurrentPages();
    var currPage = pages[pages.length - 1];  //当前页面
    var prevPage = pages[pages.length - 2]; //上一个页面


    var cardSrc = that.data.cardSrc;
    var src = that.data.src;
    if (cardSrc) {
      this.setData({
        src: cardSrc
      })
    }
    var newCarts = JSON.stringify(that.data.goodsList);
    newCarts = newCarts.replace(/&/g, "zss");

    var shareNum = that.data.shareNum;

      return {

        title: that.data.msg,
        path: '/pages/awaitState/awaitState?src=' + that.data.src + '&msg=' + that.data.msg + '&url=' + that.data.userInfo.avatarUrl + '&name=' + that.data.userInfo.nickName + '&order_number=' + that.data.order_number + '&order_userid=' + that.data.order_userid + "&time=" + time + "&uploadImg=" + that.data.uploadImgList + "&goodsName=" + that.data.goodsNme + "&goodsNum=" + that.data.goodsNum + "&goodsList=" + newCarts + "&shareTime=" + shareTime + '&order_number_send=6' + shareTime,

        imageUrl: this.data.src,
        success: function (res) {
          that.setData({
            addGiftListClick: true
          })

          console.log('成功' + res);
          that.setData({
            shareNum: 1
          })

          //消息模版：存储模板消息使用的form_id
          wx.request({
            url: host + "userapi/insertadduserwxsend",
            data: {
              user_id: un_id,
              form_id_dz: that.data.formId,
              order_number: '6' + shareTime,//6开头的单号
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

          console.log("order_number_send2:" + that.data.order_number_send);

          //插入到分享礼物表【仅有 分享订单号  分享时间（字符串）  分享标志位  三个字段】
          wx.request({
            url: host + "orderapi/insertorderlink",
            data: {
              order_number: that.data.order_number,//拆分后的订单号
              order_timeno: shareTime,
              order_linkFlag: 0
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

          if (un_id != undefined && un_id != '' && un_id != null) {

                console.log("order_number_send3:" + that.data.order_number_send);

                //更改"收到礼物表"标志位
                wx.request({
                  url: host + "giftapi/updateReceive_flag",
                  data: {
                    order_number: that.data.order_number,
                    order_number_gift: that.data.order_number_send

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


                //对应插入"送出礼物表"
                wx.request({
                  url: host + "giftapi/insertUserGiftSend",
                  data: {
                    userId: un_id,
                    giftImg: that.data.src,
                    giftMsg: that.data.msg,
                    fromUserHead: that.data.userInfo.avatarUrl,
                    fromUserName: that.data.userInfo.nickName,
                    orderNumber: that.data.order_number,
                    orderNumberGift: "6" + shareTime,
                    cTime: time,
                    giftOtherImg: that.data.uploadImgList
                  },
                  method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
                  header: {
                    'Accept': 'application/json'
                  },
                  success: function (res) {

                    var preFlag = that.data.flag;
                    if (preFlag == '1') {//来自礼物详情页【awaitState】
                      wx.redirectTo({
                        url: '/pages/mineGiftList/mineGiftList?isSelectNew=1',
                      })
                    } else {
                      prevPage.setData({
                        isSelect :1,
                        goosdListnew:{},
                        goosdListnew2:{}
                      })
                      prevPage.onShow();
                      wx.navigateBack({
                        delta: 1
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
        fail: function (res) {
          console.log('shibai' + res);
          // 转发失败
        }
      }
  
  
  },



  data: {
    urlHttp: '',//图片访问线上路径
    cardList: cardList,
    userInfo: {},
    src: '',
    id: '',
    msg: '',
    msgCopy: '',
    order_number: '',
    order_userid: '',
    uploadImgList: [],
    uploadImgListLength: 0,
    shortTimeList: [],
    selectFlag: false,  //场景是否选中，默认为选中
    selectId: -1, //默认勾选为不勾选
    flagId: -1, //记录当前点击的卡片id
    cardSrc: '', //选中的卡片的图片地址
    cardIntro: '', //选中的卡片的描述
    goodsList: [],
    flag: '0', //来源标志【0：来自订单或者订单详情   1：来自礼物详情页】
    order_number_send:'',
    shareNum: 0,//点击分享的次数
  },

  onLoad: function (options) {
    var that = this;
    var host = getApp().globalData.servsers;

    var goodsListNew =options.goodsList;
    goodsListNew = goodsListNew.replace(/zss/g, "&");
    goodsListNew = JSON.parse(goodsListNew);

    console.log(goodsListNew);
    console.log("shareGift - formId:" + options.formId);

    that.setData({
      urlHttp: host,
      src: options.src,
      id: options.id,
      order_number: options.order_number,
      order_userid: options.order_userid,
      goodsNme: options.goodsNme,
      goodsNum: options.goodsNum,
      goodsList: goodsListNew,
      flag: options.flag,
      order_number_send: options.order_number_send,
      addGiftListClick: false, //判断“放入礼物盒”按钮是否点击过
      formId: options.formId,
      userInfo: getApp().globalData.userInfo
    })

    console.log("order_number:" + options.order_number);
    console.log("order_number_send:" + options.order_number_send);

  },

  textFocus: function (e) {
    var that = this;
    that.setData({
      msg: e.detail.value,
      msgCopy: e.detail.value
    })
  },

  //选择场景
  cardSelect: function (e) {
    var that = this;
    var id = e.currentTarget.dataset.id;
    var selectId = id;
    var cardSrc = e.currentTarget.dataset.src;
    var cardIntro = e.currentTarget.dataset.intro;
    var selectFlag = that.data.selectFlag;

    var flagId = that.data.flagId;
    var msg = that.data.msg;//留言区内容
    var msgCopy = that.data.msgCopy;
    console.log(msgCopy)
    if (flagId == id) {//相同卡片的点击
      if (selectFlag) {
        selectFlag = false;
        cardSrc = '';
        msg = msgCopy;
      } else {
        selectFlag = true;
        if (msgCopy == '' || msgCopy == undefined || msgCopy == null) {
          msg = cardIntro;
        }
      }
    } else {
      selectId = selectId;
      flagId = id;
      selectFlag = true;
      if (msgCopy == '' || msgCopy == undefined || msgCopy == null) {
        msg = cardIntro;
      }
    }
    that.setData({
      selectId: selectId,
      flagId: flagId,
      selectFlag: selectFlag,
      cardSrc: cardSrc,
      msg: msg
    })
  },

  uploadImg: function (e) {//上传图片
    var that = this;
    var host = getApp().globalData.servsers;
    var un_id = getApp().globalData.un_id;
    wx.chooseImage({
      count: 9, // 默认9
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {

        for (var i = 0; i < res.tempFilePaths.length; i++) {
          var filePath = res.tempFilePaths[i];
          wx.uploadFile({
            url: host + "UploadFileOneforxcx",
            filePath: filePath,
            name: 'file',
            header: {
              "Content-Type": "multipart/form-data"
            },
            formData: {
              //和服务器约定的token, 一般也可以放在header中
              //'session_token': wx.getStorageSync('session_token')
              userId: un_id,
              orderNumber: that.data.orderNumber
            },
            success: function (res) {
              var newList = that.data.uploadImgList.push(res.data);
              that.setData({
                uploadImgList: that.data.uploadImgList
              })
              if (res.statusCode != 200) {
                wx.showModal({
                  title: '提示',
                  content: '上传失败',
                  showCancel: false
                })
                return;
              }
            },
            fail: function (e) {
              console.log(e);
              wx.showModal({
                title: '提示',
                content: '上传失败',
                showCancel: false
              })
            },
            complete: function () {
              wx.hideToast();  //隐藏Toast
            }
          })
        }
      }
    })
  },

  deleteUploadImg: function (e) {//删除上传图片
    var that = this;
    var id = e.currentTarget.dataset.id;
    var uploadImgList = that.data.uploadImgList;
    uploadImgList.splice(id, 1);
    that.setData({
      uploadImgList: uploadImgList
    });
  }

})
var that;
var Util = require('../../utils/util.js'); 