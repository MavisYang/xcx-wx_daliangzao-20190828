// confirmedList.js
var app = getApp() 
var MD5Util = require('../../utils/md5.js'); 
var goosdListnew = [];
var breakOrderList = [];
Page({

  data: {
    orderState : 0,
    order_type : '0',
    goosdListnew: goosdListnew,
    orderTime : '',
    order_Consignee: '',
    order_phone: '',
    order_address: '',
    invoice_type_name : '',
    invoice_title : '',
    invoice_company_title : '',
    invoice_number: '', 
    order_number: '', //订单编号
    orderr_Coupon : 0, //优惠劵
    hiddenmodal: true, //弹窗
    maskBg : false,//支付提示蒙层
    phone: '',
    order_check_sta : '',
    showCancelOrder: false,//待定制状态 - 取消订单
    showShouhou: false, //已完成状态 - 售后
    showCancelPay: false,//待付款 - 取消弹窗
    showSendFriendMsg: false,//送朋友弹窗
    breakOrderList: breakOrderList,//准备拆分的订单
    sendFlag: 0,//送朋友 - 0，送自己 - 1
    newTotal: 0,//拆分订单总价
    breakAllNum: 0,
    sendMsg: '',//赠送提示语
  },

  onLoad: function (options) {
    var that = this;
    var host = getApp().globalData.servsers;

    //转义&符
    var goosdListnew = options.goosdListnew;
    goosdListnew = goosdListnew.replace(/zss/g, "&");
    goosdListnew = JSON.parse(goosdListnew);

    var listLen = goosdListnew.list_order_aff_data.length;
    for (var i = 0; i < listLen ; i ++){
      var price = parseFloat(goosdListnew.list_order_aff_data[i].com_price);
      var boxPrice = parseFloat(goosdListnew.list_order_aff_data[i].box_price);//礼盒价格
      if (boxPrice == '' || boxPrice == null || boxPrice == undefined){
        boxPrice = 0;
      }
      var num = parseFloat(goosdListnew.list_order_aff_data[i].com_num);
      goosdListnew.list_order_aff_data[i].new_price = (price + boxPrice) * num;
    }

    console.log(goosdListnew);

    that.setData({
      goosdListnew: goosdListnew,
      orderTime : goosdListnew.list_order_aff_data[0].creat_time,
      order_Consignee: goosdListnew.list_order_aff_data[0].order_Consignee,
      order_phone: goosdListnew.list_order_aff_data[0].order_phone,
      order_address: goosdListnew.list_order_aff_data[0].order_address,
      invoice_type_name: goosdListnew.list_order_aff_data[0].invoice_type_name,
      invoice_title: goosdListnew.list_order_aff_data[0].invoice_title,
      invoice_company_name: goosdListnew.list_order_aff_data[0].invoice_company_name,
      invoice_number: goosdListnew.list_order_aff_data[0].invoice_number,
      orderState: goosdListnew.order_sta,
      order_number: goosdListnew.order_number,
      orderr_Coupon : goosdListnew.list_order_aff_data[0].orderr_Coupon,
      order_type: goosdListnew.list_order_aff_data[0].order_type,
      order_check_sta: goosdListnew.list_order_aff_data[0].order_check_sta
    })
    wx.request({
      url: host + "phoneapi/phoneall",
      data: {},
      method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      header: {
        'Accept': 'application/json'
      },
      success: function (res) {
        that.setData({
          phone: res.data.rows[0].phone,
        });
        if (res == null || res.data == null) {
          console.error('网络请求失败');
          return;
        }
        wx: wx.hideNavigationBarLoading(
          that.setData({
            hidden: ''
          })
        )
      }
    })
  },

  sendBtn: function (options) {
    var that = this;
    var id = options.currentTarget.dataset.id;//i
    if (that.data.goosdListnew.list_order_aff_data[0].img2 != '' && that.data.goosdListnew.list_order_aff_data[0].img2 != undefined) {
      var imgSrc = that.data.goosdListnew.list_order_aff_data[0].img2
    } else {
      var imgSrc = that.data.goosdListnew.list_order_aff_data[0].logo
    }
    wx.navigateTo({
      url: '/pages/share/share?src=' + imgSrc + "&id=" + that.data.goosdListnew.list_order_aff_data[0].order_aff_id + '&order_number=' + that.data.goosdListnew.order_number + '&order_userid=' + that.data.goosdListnew.list_order_aff_data[0].order_userid
    })
  },

  sendBtn: function (options) {//送朋友 - 提示弹窗
    var that = this;
    that.setData({
      showSendFriendMsg: true
    })
  },

  sureSendFriend: function (e) {//送朋友 - 确定
    var that = this;
    var formId = e.detail;
    console.log("confirmeList - formId:" + formId.formId);

    var order_number = that.data.order_number;
    var imgSrc = that.data.goosdListnew.list_order_aff_data[0].logo
    that.setData({
      showSendFriendMsg: false,
      orderState: 3,
      order_type: 1
    })
    var newCarts = JSON.stringify(that.data.goosdListnew);
    newCarts = newCarts.replace(/&/g, "zss");
    setTimeout(function () {
      wx.navigateTo({
        url: '/pages/share/share?src=' + imgSrc + "&id=" + that.data.goosdListnew.list_order_aff_data[0].com_id + '&order_number=' + that.data.goosdListnew.order_number + '&order_userid=' + that.data.goosdListnew.list_order_aff_data[0].order_userid + "&goodsNme=" + that.data.goosdListnew.list_order_aff_data[0].com_name + "&goodsNum=" + that.data.goosdListnew.list_order_aff_data[0].com_num + "&goodsList=" + newCarts + "&flag=0&formId=" + formId.formId,
        success: function (res) {

        }
      })
    }, 500)
  },

  cancelSendFriend: function (e) {//送朋友 - 取消
    var that = this;
    that.setData({
      order_id: '',
      order_number : '',
      showSendFriendMsg: false
    })
  },

  sendMineBtn: function (options) {//送自己
    var that = this;
    that.setData({
      showSendMineMsg: true,
      order_number: that.data.goosdListnew.order_number
    })
  },
  sureSendMine: function (e) {//送自己 - 确认
    var that = this;
    var host = getApp().globalData.servsers;
    var order_number = that.data.order_number;
    that.setData({
      showSendMineMsg: false
    })
    wx.navigateTo({
      url: '/pages/sendOwnAddress/sendOwnAddress?order_number=' + order_number,
    })
  },
  cancelSendMine: function (e) {//取消送自己
    var that = this;
    that.setData({
      showSendMineMsg: false,
      order_number: ''
    })
  },

  dzwc: function (e) {//定制完成 - 提示弹窗
    var that = this;
    var id = e.currentTarget.dataset.id;
    var host = getApp().globalData.servsers;
    that.setData({
      showQrfhMode: true
    })
  },

  cancelFh: function (e) {//取消定制完成
    var that = this;
    that.setData({
      showQrfhMode: false,
    })
  },
  sureFh: function (e) {//定制完成
    var that = this;
    var order_number = that.data.order_number;
    var host = getApp().globalData.servsers;
    wx.request({
      url: host + "orderapi/updateOrder_dzwc",
      data: {
        order_number: order_number
      },
      method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      header: {
        'Accept': 'application/json'
      },
      success: function (res) {
        that.setData({
          showQrfhMode: false,
          orderState : 10
        })
        if (res == null || res.data == null) {
          console.error('网络请求失败');
          return;
        }
      }
    })
  },
  qrsh: function (e) {
    var that = this;
    var order_number = that.data.order_number;
    var goosdListnew = that.data.goosdListnew;

    var host = getApp().globalData.servsers;
    wx.request({
      url: host + "orderapi/updateOrder_wc",
      data: {
        order_number: order_number
      },
      method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      header: {
        'Accept': 'application/json'
      },
      success: function (res) {
        console.log("ababa:");
        console.log(res);
        that.data.goosdListnew.order_sta = 5;
        that.setData({
          hiddenmodal: false,
          modalCont: '确认收货成功！',
          goosdListnew: that.data.goosdListnew,
          orderState : 5
        })
        console.log(that.data.goosdListnew);
        setTimeout(function () {
          that.setData({
            hiddenmodal: true
          })
        }, 2000);
        if (res == null || res.data == null) {
          console.error('网络请求失败');
          return;
        }
      }
    })
  },

  //立即付款
  save: function (e) {
    var that = this;
    var un_id = getApp().globalData.un_id;
    var timestamp = Date.parse(new Date());
    timestamp = timestamp / 1000;
    var timestamp1 = timestamp;
    var order_number = that.data.order_number;

    var len = that.data.goosdListnew.list_order_aff_data.length;//当前订单下商品数量

    //检测是否存在下架商品
    that.selectCartsSta( len, order_number, un_id);
    
  },

  //检查立即购买的商品中是否有下架商品
  selectCartsSta: function ( len, order_number, un_id) {
    var that = this;
    var host = getApp().globalData.servsers;

    if (len == 0) {
      wx.showLoading({
        title: '微信支付',
        icon: 'loading',
        mask: true,
        success: function () {
          that.setData({
            maskBg: true
          })
        }
      })

      //获取用户登录状态
      wx.login({
        success: function (res) {
          //发起网络请求,发起的是HTTPS请求，向服务端请求预支付

          var code = res.code;

          var title = that.data.goosdListnew.list_order_aff_data[0].com_name;
          var price = that.data.goosdListnew.total * 100;
          price = 1;

          console.log("price:" + price);
          console.log("title:" + title);
          console.log("order_number:" + order_number);


          wx.request({
            url: host + 'prePayOrder',
            data: {
              code: code,
              price: price,
              title: title,
              order_number: order_number
              //order_number: timestamp1
            },
            success: function (res) {
              wx.hideLoading()
              that.setData({
                maskBg: false
              })
              console.log(res.data);
              var timestamp = String(Date.parse(new Date()));  //时间戳
              if (res.data.result == true) {
                var nonceStr = res.data.nonceStr
                var prepayId = res.data.prepayId
                // 按照字段首字母排序组成新字符串
                var payDataA = "appId=wx9e3f68fa2172f1c7&nonceStr=" + res.data.nonceStr + "&package=prepay_id=" + res.data.prepayId + "&signType=MD5&timeStamp=" + timestamp;
                var payDataB = payDataA + "&key=MlxMZWpZidKxCPPaOOztMP84XvQzqSOh";
                // 使用MD5加密算法计算加密字符串
                paySign = MD5Util.MD5(payDataB).toUpperCase();
                // 使用MD5加密算法计算加密字符串
                var paySign = MD5Util.MD5(payDataB).toUpperCase();
                // 发起微信支付
                wx.requestPayment({
                  'timeStamp': timestamp,
                  'nonceStr': nonceStr,
                  'package': 'prepay_id=' + prepayId,
                  'signType': 'MD5',
                  'paySign': paySign,
                  'success': function (res) {
                    //人气推荐
                    for (var i = 0; i < that.data.goosdListnew.list_order_aff_data.length; i++) {
                      if (that.data.goosdListnew.list_order_aff_data[i].order_gy_id > -1) {
                        that.setData({
                          orderState: 2//待定制
                        })
                      } else {
                        that.setData({
                          orderState: 10//待送礼
                        })
                      }
                    }
                    wx.request({
                      url: host + "orderapi/update",
                      data: {
                        order_sta: that.data.orderState,
                        order_number: order_number,
                        order_userid: un_id
                      },
                      method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
                      header: {
                        'Accept': 'application/json'
                      },
                      success: function (res) {
                        console.log("更新");
                        that.loadFun();
                        if (res == null || res.data == null) {
                          console.error('网络请求失败');
                          return;
                        }
                      }
                    });
                    // 保留当前页面，跳转到应用内某个页面，使用wx.nevigeteBack可以返回原页面
                  },
                  'fail': function (res) {
                    console.log(res.errMsg)
                  }
                })
              } else {
                console.log('请求失败' + res.data.info);
              }
            }
          })
        }
      });


    } else {

      len -= 1;

      var com_id = that.data.goosdListnew.list_order_aff_data[len].com_id;
      var name = that.data.goosdListnew.list_order_aff_data[len].com_name;//商品名称
      var order_number = that.data.goosdListnew.order_number;

      //检测商品是否下架
      wx.request({
        url: host + "commodityapi/commoditview",
        data: {
          com_id: com_id
        },
        method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
        header: {
          'Accept': 'application/json'
        },
        success: function (res) {
          //有此商品
          if (res.data.total > 0) {
            if (res.data.commodity.commodity_flag != 0) {//此商品为下架商品
              wx.hideLoading();
              that.setData({
                maskBg: false,
                hiddenmodal: false,
                modalCont: '"' + name + '"已下架，即将为您取消订单，请重新选购！',
                showCancelPay: false,
                order_id: id,
                order_number: order_number
              })
              setTimeout(function () {
                that.setData({
                  hiddenmodal: true
                })
                that.sureSave();
              }, 2000);
              return false;
            } else {

              //不是失效商品，检测库存是否充足
              wx.request({
                url: host + "api/commodityGroup/checkCommodityGroupRepertory",
                data: {
                  datasheetGroupId: that.data.goosdListnew.list_order_aff_data[len].com_group_id
                },
                method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
                header: {
                  'Accept': 'application/json'
                },
                success: function (res) {
                  if (res.data.code == '200') {
                    if (res.data.data.canBuy) {
                      if (res.data.data.repertory < that.data.goosdListnew.list_order_aff_data[len].com_num) {//商品数量小于库存，置数量为库存数量
                        wx.hideLoading();
                        that.setData({
                          maskBg: false,
                          hiddenmodal: false,
                          modalCont: '"' + name + '"已售罄，即将为您取消订单，请重新选购！',
                          showCancelPay: false,
                          //order_id: id,
                          order_number: order_number
                        })
                        setTimeout(function () {
                          that.setData({
                            hiddenmodal: true
                          })
                          that.sureSave();
                        }, 2500);
                        return false;

                      } else {

                        var sumNum = parseInt(that.data.goosdListnew.list_order_aff_data[len].com_num);
                        for (var t = 0; t < len; t++) {
                          if (that.data.goosdListnew.list_order_aff_data[t].com_id == that.data.goosdListnew.list_order_aff_data[len].com_id && that.data.goosdListnew.list_order_aff_data[t].com_group_id == that.data.goosdListnew.list_order_aff_data[len].com_group_id) {
                            sumNum += parseInt(that.data.goosdListnew.list_order_aff_data[t].com_num);
                          }
                        }
                        console.log("立即购买-sumNum:" + sumNum);
                        console.log("立即购买-repertory:" + res.data.data.repertory);
                        if (sumNum > res.data.data.repertory) {
                          wx.hideLoading();
                          that.setData({
                            maskBg: false,
                            hiddenmodal: false,
                            //order_id: id,
                            order_number: order_number,
                            modalCont: '“' + name + '”库存不足，，即将为您取消订单，请重新选购！'
                          })
                          setTimeout(function () {
                            that.setData({
                              hiddenmodal: true
                            })
                            //删除当前订单
                            that.sureSave();
                          }, 3000);
                          return false;

                        } else {
                          //继续判断下架和库存
                          that.selectCartsSta(len, order_number, un_id);
                        }
                      }

                    } else {
                      wx.hideLoading();
                      that.setData({
                        maskBg: false,
                        hiddenmodal: false,
                        modalCont: '"' + name + '"已售罄，即将为您取消订单，请重新选购！',
                        showCancelPay: false,
                        //order_id: id,
                        order_number: order_number
                      })
                      setTimeout(function () {
                        that.setData({
                          hiddenmodal: true
                        })
                        that.sureSave();
                      }, 2500);

                      return false;
                    }
                  }
                }
              })
            }
          } else {
            wx.hideLoading();
            that.setData({
              maskBg: false,
              hiddenmodal: false,
              modalCont: '"' + name + '"已下架，即将为您取消订单，请重新选购！',
              showCancelPay: false,
              //order_id: id,
              order_number: order_number
            })
            setTimeout(function () {
              that.setData({
                hiddenmodal: true
              })
            }, 2500);
            that.sureSave();
            return false;
          }
        }
      })
    }
  },


  //取消付款 - 提示弹窗
  cancalSaveMsg: function (e) {
    var that = this;
    that.setData({
      showCancelPay: true
    })
  },

  //关闭“取消付款”的弹窗
  closeSaveMsg: function (e) {
    var that = this;
    that.setData({
      showCancelPay: false
    })
  },

  //取消付款
  sureSave: function (e) {
    var that = this;
    var host = getApp().globalData.servsers;
    var order_number = that.data.order_number;
    wx.request({
      url: host + "orderapi/updateOrder_del",
      data: {
        order_number: order_number
      },
      method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      header: {
        'Accept': 'application/json'
      },
      success: function (res) {
        that.setData({
          showCancelPay: false,
          hiddenmodal: false,
          modalCont: '取消订单成功'
        })
        setTimeout(function () {
          that.setData({
            hiddenmodal: true
          })
        }, 1500)
        if (res == null || res.data == null) {
          console.error('网络请求失败');
          return;
        }
      }
    })
    that.data.orderState = 6;
    that.setData({
      orderState: 6
    });
  },


  //拆分订单 - 送朋友
  breakFriend: function (e) {
    var that = this;
    var sendFlag = e.currentTarget.dataset.sendflag;
    var breakOrderList = e.currentTarget.dataset.order;//要拆分的订单
    var goods_list = breakOrderList.list_order_aff_data;
    var break_num = 0;
    var newTotal = 0;
    var breakAllNum = 0;
    for (var i = 0; i < goods_list.length; i++) {
      break_num = parseInt(goods_list[i].com_num);
      breakOrderList.list_order_aff_data[i].break_num = break_num;//可拆分的数量
      if (break_num == 0) {
        breakOrderList.list_order_aff_data[i].minus = 'no_opar';//默认不可减
      }
      breakOrderList.list_order_aff_data[i].add = 'no_opar';//默认不可加
      newTotal += parseFloat(breakOrderList.total);
      breakAllNum += break_num;
    }
    console.log("breakAllNum-11:" + breakAllNum);
    that.setData({
      sendFlag: sendFlag,
      breakOrderList: breakOrderList,
      showSendFriendMsg: true,
      newTotal: newTotal,
      breakAllNum: breakAllNum,
    })
  },

  //拆分 - 绑定加数量事件
  addCount(e) {
    var that = this;
    var id = e.currentTarget.dataset.id;
    var breakOrderList = that.data.breakOrderList;
    var break_num = e.currentTarget.dataset.breaknum;
    var breakAllNum = that.data.breakAllNum;
    var com_num = e.currentTarget.dataset.num;//可拆分总数量
    var price = e.currentTarget.dataset.price;

    if (break_num < com_num) {
      break_num++;
      if (break_num == com_num) {//已到上限
        breakOrderList.list_order_aff_data[id].add = 'no_opar';
      } else {
        breakOrderList.list_order_aff_data[id].add = '';
      }

      breakOrderList.list_order_aff_data[id].break_num = break_num;
      breakOrderList.list_order_aff_data[id].minus = '';
      that.data.breakAllNum = breakAllNum++;
      that.setData({
        breakOrderList: breakOrderList,
        breakAllNum: breakAllNum
      })
    } else {
      breakOrderList.list_order_aff_data[id].add = 'no_opar';
      breakOrderList.list_order_aff_data[id].minus = '';
      that.setData({
        breakOrderList: breakOrderList
      })
      return false;
    }
  },


  //拆分 - 手动填写数量
  writeNum: function (e) {
    var that = this;
    var val = e.detail.value;
    var id = e.currentTarget.dataset.id;
    var breakOrderList = that.data.breakOrderList;
    var com_num = e.currentTarget.dataset.num;//可拆分总数量
    var break_num = breakOrderList.list_order_aff_data[id].break_num;
    var breakAllNum = that.data.breakAllNum;//累计拆分数量加和

    if (parseInt(val) >= parseInt(com_num)) {

      breakOrderList.list_order_aff_data[id].break_num = com_num;
      breakAllNum = parseInt(breakAllNum) - parseInt(break_num) + parseInt(com_num);
      breakOrderList.list_order_aff_data[id].minus = '';
      breakOrderList.list_order_aff_data[id].add = 'no_opar';
      that.setData({
        breakOrderList: breakOrderList,
        breakAllNum: breakAllNum
      })

    } else if (parseInt(val) <= 0) {

      breakOrderList.list_order_aff_data[id].break_num = 0;
      breakAllNum = parseInt(breakAllNum) - parseInt(break_num);
      breakOrderList.list_order_aff_data[id].minus = 'no_opar';
      breakOrderList.list_order_aff_data[id].add = '';
      that.setData({
        breakOrderList: breakOrderList,
        breakAllNum: breakAllNum
      })

    } else {
      breakOrderList.list_order_aff_data[id].break_num = val;
      breakAllNum = parseInt(breakAllNum) - parseInt(break_num) + parseInt(val);
      breakOrderList.list_order_aff_data[id].minus = '';
      breakOrderList.list_order_aff_data[id].add = '';
      that.setData({
        breakOrderList: breakOrderList,
        breakAllNum: breakAllNum
      })
    }
  },

  //拆分 - 绑定减数量事件
  minusCount(e) {
    var that = this;
    var id = e.currentTarget.dataset.id;
    var break_num = e.currentTarget.dataset.breaknum;
    var breakAllNum = that.data.breakAllNum;//累计拆分数量加和
    var breakOrderList = that.data.breakOrderList;
    var price = e.currentTarget.dataset.price;

    if (break_num <= 0) {
      return false;
    } else {
      break_num--;
      if (break_num <= 0) {
        breakOrderList.list_order_aff_data[id].minus = 'no_opar';
      } else {
        breakOrderList.list_order_aff_data[id].minus = '';
      }
      breakOrderList.list_order_aff_data[id].break_num = break_num;
      breakOrderList.list_order_aff_data[id].add = '';
      that.data.breakAllNum = breakAllNum--;
      console.log("breakAllNum1111:" + breakAllNum);
      that.setData({
        breakOrderList: breakOrderList,
        breakAllNum: breakAllNum--
      })

    }
  },

  sureSendFriend: function (options) {//送朋友 - 确定


    var that = this;
    var userRole = getApp().globalData.userRole;//用户角色

    var breakOrderList = that.data.breakOrderList;
    var totalNumber = breakOrderList.totalNumber;
    console.log("totalNumber:" + totalNumber);
    var breakAllNum = that.data.breakAllNum;//总的拆分数量
    console.log("breakAllNum:" + breakAllNum);
    if (breakAllNum > 0 && breakAllNum <= totalNumber) {//商品总数不为0
      var id = that.data.order_id;//i
      var sendFlag = that.data.sendFlag;


      var order_number = breakOrderList.order_number;
      var imgSrc = breakOrderList.list_order_aff_data[0].logo;

      var com_id = breakOrderList.list_order_aff_data[0].com_id;
      var order_userid = breakOrderList.list_order_aff_data[0].order_userid;
      var com_name = breakOrderList.list_order_aff_data[0].com_name;
      var goodsNum = breakOrderList.list_order_aff_data[0].break_num;
      var newTotal = 0;
      var len = breakOrderList.list_order_aff_data.length;
      for (var i = 0; i < len; i++) {
        var goodsPrice = parseFloat(breakOrderList.list_order_aff_data[i].com_price);
        var boxPrice = parseFloat(breakOrderList.list_order_aff_data[i].box_price);
        var num = parseInt(breakOrderList.list_order_aff_data[i].break_num);
        newTotal += (goodsPrice + boxPrice) * num;
      }
      for (var i = 0; i < len; i++) {
        breakOrderList.list_order_aff_data[i].newTotal = newTotal;
      }


      that.setData({
        breakOrderList: breakOrderList
      })
      breakOrderList = that.data.breakOrderList;

      var newCarts = JSON.stringify(breakOrderList);
      newCarts = newCarts.replace(/&/g, "zss");

      var order_number_new = Date.parse(new Date());
      order_number_new = order_number_new / 1000;


      if (sendFlag == 0) {//点击送朋友
        setTimeout(function () {
          wx.navigateTo({
            url: '/pages/share/share?src=' + imgSrc + "&id=" + com_id + '&order_number=' + order_number + '&order_userid=' + order_userid + "&goodsNme=" + com_name + "&goodsNum=" + goodsNum + "&goodsList=" + newCarts + "&flag=0" + '&fromUserRole=' + userRole,
            success: function (res) {
              that.setData({
                showSendFriendMsg: false
              })
            }
          })
        }, 500)
      } else {//送自己
        that.setData({
          showSendFriendMsg: false
        })
        wx.navigateTo({
          url: '/pages/addAddressSendOwn/addAddressSendOwn?order_number_new=' + order_number_new + '&goodsList=' + newCarts + '&order_number=' + order_number,
        })
      }
    } else if (breakAllNum <= 0) {
      that.setData({
        hiddenmodal: false,
        modalCont: '请选择需要赠送的礼物及数量'

      })
      setTimeout(function () {
        that.setData({
          hiddenmodal: true
        })
      }, 1500)
    } else {
      that.setData({
        hiddenmodal: false,
        modalCont: '选择送礼商品数量超出现有商品数量！'

      })
      setTimeout(function () {
        that.setData({
          hiddenmodal: true
        })
      }, 1500)
    }

  },

  cancelSendFriend: function (e) {//送朋友 - 取消
    var that = this;
    that.setData({
      order_id: '',
      order_number : '',
      showSendFriendMsg: false
    })
  },

  //提醒发货
  fahuo: function () {
    var that = this;
    var host = getApp().globalData.servsers;
    var order_number = e.currentTarget.dataset.ordernum;
    wx.request({
      url: host + "orderapi/updateOrderInformation",
      data: {
        order_number: order_number,
        information_type: 3
      },
      method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      header: {
        'Accept': 'application/json'
      },
      success: function (res) {
        that.setData({
          hiddenmodal: false,
          modalCont: '已提醒商家发货，请您耐心等待'
        })
        setTimeout(function () {
          that.setData({
            hiddenmodal: true
          })
        }, 1500);
        if (res == null || res.data == null) {
          console.error('网络请求失败');
          return;
        }
      }
    })
  },

  //待定制 - 申请取消订单 - 显示提示弹窗
  openCancelWind: function (e) {
    var that = this;
    that.setData({
      showCancelOrder: true
    })
  },

  cancelCancelOrder: function (e) {//取消弹窗 - 待定制的取消的弹窗 
    var that = this;
    that.setData({
      showCancelOrder: false
    })
  },

  //待定制 - 申请取消订单
  cancelOrder: function (e) {
    var that = this;
    var host = getApp().globalData.servsers;
    var order_number = that.data.order_number;

    wx.request({
      url: host + "orderapi/updateOrderInformation",
      data: {
        order_number: order_number,
        information_type: 1
      },
      method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      header: {
        'Accept': 'application/json'
      },
      success: function (res) {
        that.setData({
          showCancelOrder: false
        })
        that.setData({
          hiddenmodal: false,
          modalCont: '取消申请已受理，请等待审核！'
        })
        setTimeout(function () {
          that.setData({
            hiddenmodal: true
          })
        }, 1500)
        that.data.order_check_sta = 1;
        that.setData({
          order_check_sta: 1
        });
        if (res == null || res.data == null) {
          console.error('网络请求失败');
          return;
        }
      }
    })

  },

  //已完成 - 申请售后 - 显示提示弹窗
  openShowhouWind: function (e) {
    var that = this;
    that.setData({
      showShouhou: true
    })

  },

  cancelShouhou: function (e) {//取消弹窗 - 已完成的取消的弹窗 
    var that = this;
    that.setData({
      showShouhou: false
    })
  },
  sureShouhou: function (e) {//确认弹窗 - 已完成的取消的弹窗 
    var that = this;
    var host = getApp().globalData.servsers;
    var order_number = that.data.order_number;

    wx.request({
      url: host + "orderapi/updateOrderInformation",
      data: {
        order_number: order_number,
        information_type: 2
      },
      method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      header: {
        'Accept': 'application/json'
      },
      success: function (res) {
        that.setData({
          showShouhou: false
        })
        that.setData({
          hiddenmodal: false,
          modalCont: '售后申请已受理，请等待处理！'
        })
        setTimeout(function () {
          that.setData({
            hiddenmodal: true
          })
        }, 1500)
        
        that.data.order_check_sta = 1;
        that.setData({
          order_check_sta: 1
        });
        if (res == null || res.data == null) {
          console.error('网络请求失败');
          return;
        }
      }
    })
  },

  buyUrl:function(e){//跳转到当前商品对应的购买页
    var that = this;
    var host = getApp().globalData.servsers;
    var id = e.currentTarget.dataset.id;
    console.log(that.data.goosdListnew.list_order_aff_data[id]);
    var buyUrl = that.data.goosdListnew.list_order_aff_data[id].com_id;  
    wx.request({
      url: host + "commodityapi/commoditview",
      data: {
        com_id: buyUrl,
      },
      method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      header: {
        'Accept': 'application/json'
      },
      success: function (res) {
        if (res.data.total > 0){
          wx.redirectTo({
            url: '/pages/buy/buy?com_id=' + buyUrl 
          })
        }else{
          that.setData({
            hiddenmodal: false,
            modalCont: '该商品已下架！'
          })
          setTimeout(function () {
            that.setData({
              hiddenmodal: true
            })
          }, 1500)
          return false;
        }
      }
    
    })
  }
})
var that;
var Util = require('../../utils/util.js'); 