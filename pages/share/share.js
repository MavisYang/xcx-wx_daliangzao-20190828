// pages/share/share.js
var app = getApp();
var cardList = [
  { id: 1, src: 'images/sendCards/send_cards_1.jpg', intro:'生日快乐'},
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
    var userRole = that.data.userRole;

    console.log("share:" + userRole);
    if (this.data.msg == '' || this.data.msg == undefined){
      this.setData({
        msg: '小小心意'
      })
    }
    if (res.from === 'button') {
      // 来自页面内转发按钮
      console.log("11:"+res.target)
    }

    var dataTime = new Date()

    var time = Util.formatTime(dataTime);  //获赠时间
    var shareTime = Date.parse(dataTime);//分享时间
    shareTime = shareTime / 1000;

    var timestamp = Date.parse(new Date());
    timestamp =timestamp / 1000;

    that.setData({
      time: time,
      shareTime: shareTime,
      timestamp: timestamp,
    })

    var cardSrc = that.data.cardSrc;
    var src = that.data.src;
    if (cardSrc){
      this.setData({
        src: cardSrc
      })
    }

    var newCarts = JSON.stringify(that.data.goodsList);
    newCarts = newCarts.replace(/&/g, "zss");

    return {

      title: that.data.msg,
      path: '/pages/awaitState/awaitState?src=' + that.data.src + '&msg=' + that.data.msg + '&url=' + that.data.userInfo.avatarUrl + '&name=' + that.data.userInfo.nickName + '&order_number=N' + timestamp + '&order_userid=' + that.data.order_userid + "&time=" + time + "&uploadImg=" + that.data.uploadImgList + "&goodsName=" + that.data.goodsNme + "&goodsNum=" + that.data.goodsNum + "&goodsList=" + newCarts + "&shareTime=" + shareTime + '&order_number_send=6' + timestamp + '&userRole=' + userRole,

      imageUrl: this.data.src,
      success: function (res) {

        console.log('成功' + res);
        that.setData({
          shareNum : 1
        })

        //消息模版：存储模板消息使用的form_id
        wx.request({
          url: host + "userapi/insertadduserwxsend",
          data: {
            user_id: un_id,
            form_id_dz: that.data.formId,
            order_number: '6' + timestamp,//6开头的单号
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

        //插入到分享礼物表【仅有 分享订单号  分享时间（字符串）  分享标志位  三个字段】
        wx.request({
          url: host + "orderapi/insertorderlink",
          data: {
            order_number: "N" + timestamp,//拆分后的订单号
            order_timeno: shareTime,
            order_linkFlag: 0  //是否收下的标志位 0：未被收下   1：已被收下
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

        if (un_id != undefined && un_id != '' && un_id != null) {
          wx.request({
            url: host + "orderapi/insertorder_n",
            data: {
              order_userid: un_id,
              order_sta: '3',//待发货
              order_number_o: that.data.order_number,//原始单号
              order_number: "N" + timestamp,//新单号
              order_type: '3',//赠送 - 送朋友 - 流转
              order_Price: that.data.goodsList.list_order_aff_data[0].order_Price,
              order_Consignee: '',
              order_phone: '',
              order_address: '',
              order_commodityid: that.data.goodsList.list_order_aff_data[0].id,
              order_Specifications: '',
              order_gixbox: '',
              order_Price: that.data.goodsList.list_order_aff_data[0].newTotal,
              invoice_send_flag: 3,
              invoice_flag: 3, //发票标志位，如果为3，则为无需发票 
            },
            method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
            header: {
              'Accept': 'application/json'
            },
            success: function (res) {

              console.log(res);

              if (res.data.result == 1){
                //插入订单
                var len = that.data.goodsList.list_order_aff_data.length;
                that.insertOrder(len, that.data.order_number, timestamp, un_id); 
              }else{//请求超时

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

  //插入订单
  insertOrder: function (i,order_number_old, timestamp, un_id) {
    var that = this;
    var host = getApp().globalData.servsers;
    var un_id = getApp().globalData.un_id;
    var stateNum = that.data.stateNum;//记录带有定制的商品数量
    console.log("i:" + i);

    if (i == 0) {

      //对应插入"送出礼物表"
      wx.request({
        url: host + "giftapi/insertUserGiftSend",
        data: {
          userId: un_id,
          giftImg: that.data.src,
          giftMsg: that.data.msg,
          fromUserHead: that.data.userInfo.avatarUrl,
          fromUserName: that.data.userInfo.nickName,
          orderNumber: "N" + that.data.timestamp,
          orderNumberGift: "6" + that.data.timestamp,
          cTime: that.data.time,
          giftOtherImg: that.data.uploadImgList
        },
        method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
        header: {
          'Accept': 'application/json'
        },
        success: function (res) {
          //返回订单页
          wx.redirectTo({
            url: '/pages/orderList/orderList?isSelect=0',
          })
          if (res == null || res.data == null) {
            console.error('网络请求失败');
            return;
          }
        }
      });

      

    } else {

      i -= 1;    

      var break_num = that.data.goodsList.list_order_aff_data[i].break_num;
      var giftbox_name = that.data.goodsList.list_order_aff_data[i].com_dz;
      var process_name = that.data.goodsList.list_order_aff_data[i].com_lh;
      var process_id = 20;
      var giftbox_id = 20;
      if (process_name == '无需定制' || process_name == ''){
        process_id = -1;
      }
      if (giftbox_name == '无需定制' || giftbox_name == '') {
        giftbox_id = -1;
      }
      console.log(that.data.goodsList);   

      if (break_num >0){

        wx.request({
          url: host + "orderaffapi/insertOrderAff_n",
          data: {
            order_number_o: order_number_old,//原始单号
            order_number: "N" + timestamp,
            cost: that.data.goodsList.list_order_aff_data[i].com_price,
            com_id: that.data.goodsList.list_order_aff_data[i].com_id,
            logo: that.data.goodsList.list_order_aff_data[i].logo,
            name: that.data.goodsList.list_order_aff_data[i].com_name,
            num: that.data.goodsList.list_order_aff_data[i].break_num,
            process: process_id,
            giftbox_name: that.data.goodsList.list_order_aff_data[i].com_dz,
            giftbox_id: giftbox_id,
            box_price: that.data.goodsList.list_order_aff_data[i].box_price,
            process_name: that.data.goodsList.list_order_aff_data[i].com_lh,
            process_id: process_id,
            logo: that.data.goodsList.list_order_aff_data[i].logo,
            style1_name: that.data.goodsList.list_order_aff_data[i].com_style1,
            style2_name: that.data.goodsList.list_order_aff_data[i].com_style2,
            style3_name: that.data.goodsList.list_order_aff_data[i].com_style3,
            style4_name: that.data.goodsList.list_order_aff_data[i].com_style4,
            style5_name: that.data.goodsList.list_order_aff_data[i].com_style5,
            affId: that.data.goodsList.list_order_aff_data[i].id,
          },
          method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
          header: {
            'Accept': 'application/json'
          },
          success: function (res) {

            if ((that.data.goodsList.list_order_aff_data[i].process_name != '') && (that.data.goodsList.list_order_aff_data[i].process != -1)) {
              that.setData({
                stateNum: stateNum + 1
              })
            }
            that.insertOrder(i, order_number_old, timestamp, un_id);

            if (res == null || res.data == null) {
              console.error('网络请求失败');
              return;
            }
          }
        })

      } else{
        that.insertOrder(i, order_number_old, timestamp, un_id);
      }

   
    }
  },



  data: {
    urlHttp: '',//图片访问线上路径
    cardList: cardList,
    userInfo: {},
    src : '',
    id : '',
    msg : '',
    msgCopy : '',
    order_number : '',
    order_userid : '',
    uploadImgList :[],
    uploadImgListLength : 0,
    shortTimeList : [],
    selectFlag : false,  //场景是否选中，默认为选中
    selectId : -1 , //默认勾选为不勾选
    flagId : -1, //记录当前点击的卡片id
    cardSrc : '', //选中的卡片的图片地址
    cardIntro : '', //选中的卡片的描述
    goodsList : [],
    flag : '0', //来源标志【0：来自订单或者订单详情   1：来自礼物详情页】
    shareNum :0,//点击分享的次数
    formId: '', //用于消息模版的formId
    time : '',
    shareTime: '',
    timestamp: '',
    flag : '',
    formId : '',
    userRole : '', //分享者-用户角色【0：普通  1：商务】
  },

  onLoad: function (options) {
    var that = this;
    var host = getApp().globalData.servsers;

    var goodsList = options.goodsList;
    goodsList = goodsList.replace(/zss/g, "&");
    goodsList = JSON.parse(goodsList);

    var total = 0;
    for (var i = 0; i < goodsList.list_order_aff_data.length; i++) {

      var boxPrice = goodsList.list_order_aff_data[i].box_price;
      var goodsPrice = goodsList.list_order_aff_data[i].cost;
      if (boxPrice == '' && boxPrice == null) {
        boxPrice = 0;
      }

      total += (parseFloat(goodsPrice) + parseFloat(boxPrice)) * (goodsList.list_order_aff_data[i].num);
    }

    for (var i = 0; i < goodsList.list_order_aff_data.length; i++) {
      goodsList.list_order_aff_data[i].order_Price = total;
    }
    console.log(goodsList);
    console.log("formId:" + options.formId);
    console.log("share-onlload:" + options.userRole);
    that.setData({
      urlHttp: host,
      src: options.src,
      id: options.id,
      order_number: options.order_number,
      order_userid: options.order_userid,
      goodsNme: options.goodsNme,
      goodsNum: options.goodsNum,
      goodsList: goodsList,
      flag: options.flag,
      formId: options.formId,
      userRole: options.userRole,
      userInfo: getApp().globalData.userInfo
    })

  },

  textFocus:function(e){
    var that = this;  
    that.setData({
      msg: e.detail.value,
      msgCopy: e.detail.value
    })  
  },

  //选择场景
  cardSelect:function(e){
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
    if (flagId == id){//相同卡片的点击
      if (selectFlag) {
        selectFlag = false;
        cardSrc = '';
        msg = msgCopy;
      }else{
        selectFlag = true;
        if (msgCopy == '' || msgCopy == undefined || msgCopy == null) {
          msg = cardIntro;
        }
      }
    }else{
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

  uploadImg:function(e){//上传图片
    var that = this;
    var host = getApp().globalData.servsers;
    var un_id = getApp().globalData.un_id;
    wx.chooseImage({
      count: 9, // 默认9
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {  

        for (var i = 0; i < res.tempFilePaths.length;i++){
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

  deleteUploadImg:function(e){//删除上传图片
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