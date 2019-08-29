var app = getApp()   //实例化小程序，从而获取全局数据或者使用全局函数
var MD5Util = require('../../utils/md5.js');
// let URLINDEX=util.prefix();
var addressList = [];
var addressAll = [];
Page({
  data: {
    user_phone: '',//绑定的手机号码
    hidden: 'hidden',
    addressAll: addressAll,
    addressList: addressList,

    addressBg: "../../images/address_line.png",
    addressVal: "../../images/address_logo.png",
    addressAddImg: "../../images/add_address.png",
    addressEditImg: "../../images/gray_back.png",

    checkState: true,
    carts: [],
    gotJson2: {},
    total: 0,
    value: 0,
    checked: false,//发票默认不选中
    servalue: 1,
    serchecked: true,//服务协议默认选中
    isShow: false,
    address: '',
    total1: 0,
    total2: 0,
    province: '',
    city: '',
    area: '',
    adress: '',
    consignee: '',
    phone: '',
    hiddenmodal: true,
    minNum: 0,//优惠金额
    coupon_id: '',
    couponName: '', //优惠劵名称
    invoice: false,
    invCont: '我要开发票',


    //发票信息
    invoice_send_flag: 3,
    invoice_flag: 3, //发票标志位，如果为3，则为无需发票   
    invoice_type_name: '',//发票类型名称
    invoice_company_name: '',//发票公司名字（纸质单位和增值单位的公司名称相同）
    invoice_number: '', //纳税人识别号
    invoice_address: '',//注册地址
    invoice_telphone: '',//注册电话
    invoice_brandName: '',//开户银行
    invoice_brandNum: '',//银行账户
    invoice_company_content: '',//增值发票内容
    invoice_price: '',//发票金额
    invoice_title: '',//纸质个人发票抬头
    invoice_company_title: '',//纸质单位和增值发票抬头
    invoice_takeName: '',//收货姓名
    invoice_takeTelphone: '',//收货人联系方式
    invoice_takeAddress: '',//收货人地址
    invoiceTypeFlag: 0,
    orderState: 0,
    orderState1: 0,
    stateNum: 0,
    maskBg: false,//支付提示蒙层
    agrService: true,//同意服务协议
    stateNum:0,//记录定制商品数量
    allowPay : 0//避免重复点击付款
  },

  onLoad: function (options) {
    wx.showNavigationBarLoading();
    var that = this;

    //转义&符
    var carts = options.carts;
    carts = carts.replace(/zss/g, "&");
    carts = JSON.parse(carts);

    console.log(carts);

    that.setData({
      carts: carts
    })
    var total = 0;
    var total2 = 0;
    for (var i = 0; i < carts.length; i++) {

      var boxPrice = carts[i].box_price;
      console.log("boxPrice:" + boxPrice);
      var goodsPrice = carts[i].cost;
      console.log("goodsPrice:" + goodsPrice);


      if (boxPrice == '' && boxPrice == null) {
        boxPrice = 0;
      }

      total += ((parseFloat(goodsPrice) + parseFloat(boxPrice)) * parseInt(carts[i].num));
    }

    total = total.toFixed(2)
    total2 = total - that.data.minNum;
    if (total == 0) {
      total = 0.01;
    }
    if (total2 == 0) {
      total2 = 0.01;
    }
    that.setData({
      carts: carts,
      total1: total,
      total2: total2
    })
    var host = getApp().globalData.servsers;
    var un_id = getApp().globalData.un_id;
    var openid = getApp().globalData.openid;
    wx.login({
      success: function (res) {
        //判断开始

        if ((un_id == undefined || un_id == '' || un_id == null) || (openid == undefined || openid == '' || openid == null)) {
          wx.navigateTo({
            url: '/pages/authorize/authorize?link=confirmOrder',
          })
        }else{

          //查询是否绑定手机号
          wx.request({
            url: host + "userapi/userGetPhone",
            data: {
              user_id: un_id,
            },
            method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
            header: {
              'Accept': 'application/json'
            },
            success: function (res) {
              console.log("phone:"+res.data.result);
              that.setData({
                user_phone: res.data.result
              })
              if (res == null || res.data == null) {
                console.error('网络请求失败');
                return;
              }
            }
          });

          //查询是否有发票信息
          wx.request({
            url: host + "invoiceapi/adressview",//发票
            data: {
              user_id: un_id
            },
            method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
            header: {
              'Accept': 'application/json'
            },
            success: function (res) {
              var flag = res.data.rows;
              if (res.data.total > 0) {
                if (res.data.rows[0].invoice_flag == 0) {
                  that.setData({
                    invoice_flag: 0,
                    invoice_send_flag: 0,
                    invCont: '纸质普通发票',
                    invoice: true,
                    invoice_type_name: '纸质普通发票',
                    invoice_title: '个人',
                    invoice_name: res.data.rows[0].invoice_name,//个人姓名
                    invoice_content: res.data.rows[0].invoice_content,//发票内容
                    invoice_price: res.data.rows[0].invoice_price//金额
                  })
                } else if (res.data.rows[0].invoice_flag == 1) {
                  that.setData({
                    invoice_flag: 1,
                    invoice_send_flag: 1,
                    invCont: '纸质普通发票',
                    invoice: true,
                    invoice_type_name: '纸质普通发票',
                    invoice_company_title: '单位',
                    invoice_company_name: res.data.rows[0].invoice_company_name,//单位名称
                    invoice_number: res.data.rows[0].invoice_number,//纳税人识别号
                    invoice_content: res.data.rows[0].invoice_content,//发票内容
                    invoice_price: res.data.rows[0].invoice_price //金额
                  })
                } else {
                  that.setData({
                    invoice_flag: 2,
                    invoice_send_flag: 2,
                    invCont: '增值税专用发票',
                    invoice: true,
                    invoice_type_name: '增值税专用发票',
                    invoice_company_title: '单位',
                    invoice_company_name: res.data.rows[0].invoice_company_name,//单位名称
                    invoice_number: res.data.rows[0].invoice_number,//纳税人识别号
                    invoice_address: res.data.rows[0].invoice_address,//注册地址
                    invoice_telphone: res.data.rows[0].invoice_telphone,//注册电话
                    invoice_brandName: res.data.rows[0].invoice_brandName,//开户银行
                    invoice_brandNum: res.data.rows[0].invoice_brandNum,//银行账户
                    invoice_company_content: '明细',//发票内容
                    invoice_price: res.data.rows[0].invoice_price, //金额
                    invoice_takeName: res.data.rows[0].invoice_takeName,
                    invoice_takeTelphone: res.data.rows[0].invoice_takeTelphone,
                    invoice_takeAddress: res.data.rows[0].invoice_takeAddress
                  })
                }
              }
              wx.hideNavigationBarLoading(//加载完成后显示页面
                that.setData({
                  hidden: ''
                })
              )
              if (res == null || res.data == null) {
                console.error('网络请求失败');
                return;
              }
            }
          })
        }
        //判断结束
      }
    })
  },

  onShow:function(){
    var that = this;
    var host = getApp().globalData.servsers;
    var un_id = getApp().globalData.un_id;
  },

  coupon: function () {//选择优惠劵
    wx.navigateTo({//把总价带过去，直接返回优惠之后的总价
      url: '/pages/mineCoupon/coupon?total2=' + this.data.total1
    })
  },

  invoice: function () {//我要开发票，把商品价钱带过来
    wx.navigateTo({
      url: '/pages/invoiceInfor/invoiceInfor?total1=' + this.data.total1
    })
  },

  checkboxChange: function (e) {
    var that = this;
    var datavalue = e.currentTarget.dataset.value;
    var invoice = this.data.invoice;
    if (invoice) {
      if (datavalue == 0) {
        that.setData({
          'value': 1,
          'checked': true,
          'isShow': true,
          invCont: that.data.invoice_type_name
        })
      } else {
        that.setData({
          'value': 0,
          'checked': false,
          'isShow': true,
          invCont: that.data.invoice_type_name
        })
      }
    }
  },

  agrService: function (e) {
    var that = this;
    var datavalue = e.currentTarget.dataset.value;
    if (datavalue == 0) {
      that.setData({
        servalue: 1,
        'serchecked': true,
        allowPay : 0
      })
    } else {
      that.setData({
        servalue: 0,
        'serchecked': false
      })
    }
  },

  save: function (e) {
    var that = this;
    var user_phone = that.data.user_phone;

    var formId = e.detail.formId;
    console.log("mineGiftList - formId1:" + formId);

    if (user_phone == '' || user_phone == null || user_phone == undefined){
      wx.navigateTo({
        url: '/pages/bindingPhone/bindingPhone',
      })
      return false;
    }

    var pages = getCurrentPages();
    var currPage = pages[pages.length - 1];  //当前页面
    var prevPage = pages[pages.length - 2]; //上一个页面
    var prevPageUrl = prevPage.route;

    var len = that.data.carts.length;

    wx.showLoading({//支付提示
      title: '微信支付',
      icon: 'loading',
      mask: true,
      success: function () {
        that.setData({
          maskBg: true,
          allowPay : 1
        })
      }
    })

    if (that.data.value == 0) {
      that.setData({
        invoice_flag: 3,
        invoice_send_flag: 3,
        invoice_type_name: '',//发票类型名称
        invoice_name: '',//个人名字
        invoice_content: '',//纸质发票内容
        invoice_company_name: '',//发票公司名字（纸质单位和增值单位的公司名称相同）
        invoice_number: '', //纳税人识别号
        invoice_address: '',//注册地址
        invoice_telphone: '',//注册电话
        invoice_brandName: '',//开户银行
        invoice_brandNum: '',//银行账户
        invoice_company_content: '',//增值发票内容
        invoice_price: '',//发票金额
        invoice_title: '',//纸质个人发票抬头
        invoice_company_title: '',//纸质单位和增值发票抬头
        invoice_takeName: '',//收货姓名
        invoice_takeTelphone: '',//收货人联系方式
        invoice_takeAddress: ''//收货人地址
      })
    }
    var timestamp = Date.parse(new Date());
    timestamp = timestamp / 1000;
    var timestamp1 = timestamp;
    var host = getApp().globalData.servsers;
    var un_id = getApp().globalData.un_id;

    if (un_id != undefined && un_id != '' && un_id != null){

      wx.request({
        url: host + "orderapi/insertorder",
        data: {
          order_userid: un_id,
          order_sta: '1',
          order_number: timestamp,
          order_type: '0',
          order_Consignee: that.data.consignee,
          order_phone: that.data.phone,
          order_address: '',
          order_commodityid: that.data.carts[0].id,
          order_num: that.data.carts[0].num,
          order_Price: that.data.total2,//////
          orderr_Coupon: that.data.minNum,
          coupon_id: that.data.coupon_id,
          order_Specifications: '',
          order_gixbox: '',
          invoice_send_flag: that.data.invoice_send_flag,
          invoice_flag: that.data.invoice_flag, //发票标志位
          invoice_type_name: that.data.invoice_type_name,//发票类型名称
          invoice_name: that.data.invoice_name,//个人名字
          invoice_content: that.data.invoice_content,//纸质发票内容
          invoice_company_name: that.data.invoice_company_name,//发票公司名字（纸质单位和增值单位的公司名称相同）
          invoice_number: that.data.invoice_number, //纳税人识别号
          invoice_address: that.data.invoice_address,//注册地址
          invoice_telphone: that.data.invoice_telphone,//注册电话
          invoice_brandName: that.data.invoice_brandName,//开户银行
          invoice_brandNum: that.data.invoice_brandNum,//银行账户
          invoice_company_content: that.data.invoice_company_content,//增值发票内容
          invoice_price: that.data.invoice_price,//发票金额
          invoice_title: that.data.invoice_title,//纸质个人发票抬头
          invoice_company_title: that.data.invoice_company_title,//纸质单位和增值发票抬头
          invoice_takeName: that.data.invoice_takeName,//收货姓名
          invoice_takeTelphone: that.data.invoice_takeTelphone,//收货人联系方式
          invoice_takeAddress: that.data.invoice_takeAddress//收货人地址
        },
        method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
        header: {
          'Accept': 'application/json'
        },
        success: function (res) {
          if (res.data.result == 1){
            //插入订单
            that.insertOrder(len, timestamp, timestamp1, that.data.coupon_id, un_id, formId); 
          }else{
            //删除当前订单
            that.deleteOrder(un_id, timestamp, that.data.coupon_id);
            wx.hideLoading();
            that.setData({
              maskBg: false,
              allowPay: 0,
              firstClick: 0
            })
          }

          if (res == null || res.data == null || res.data == '') {
            console.error('插入订单失败');
            //删除当前订单
            that.deleteOrder(un_id, timestamp, that.data.coupon_id);
            that.setData({
              maskBg: false,
              allowPay: 0,
              firstClick: 0
            })
            return;
          }
        }
      });

      
    }
  },


  //插入订单
  insertOrder: function (i, timestamp, timestamp1, coupon_id, un_id, formId){
    var that = this;
    var host = getApp().globalData.servsers;
    var stateNum = that.data.stateNum;//记录带有定制的商品数量

    if(i == 0){
      if (stateNum > 0) {
        that.setData({
          orderState1: 2//待定制
        })
      } else {
        that.setData({
          orderState1: 10//待送礼 10
        })
      }

      //调起支付
      that.payOrder(timestamp, timestamp1, coupon_id, un_id, formId);

    }else{

      i -=1;

      var com_id = that.data.carts[i].com_id;
      var name = that.data.carts[i].name;//商品名称

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
                modalCont: name + '已下架，请重新选购！'
              })
              setTimeout(function () {
                that.setData({
                  hiddenmodal: true
                })
              }, 2000)

              //删除当前订单
              that.deleteOrder(un_id, timestamp, coupon_id);
              wx.navigateBack({
                delta:1
              })
              return false;

            } else {


              //检测库存
              wx.request({
                url: host + "api/commodityGroup/checkCommodityGroupRepertory",
                data: {
                  datasheetGroupId: that.data.carts[i].com_group_id
                },
                method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
                header: {
                  'Accept': 'application/json'
                },
                success: function (res) {
                  if (res.data.code == '200') {
                    var canBuy = res.data.data.canBuy;
                    //库存充足【当前选择的规格库存不为0，且库存数量大于起订量】
                    if (res.data.data.canBuy == true) {
                      if (res.data.data.repertory < that.data.carts[i].num) {
                        wx.hideLoading();
                        that.setData({
                          maskBg: false,
                          hiddenmodal: false,
                          modalCont: '"' + that.data.carts[i].name + '"的库存不足，请重新选择购买数量！'
                        })
                        setTimeout(function () {
                          that.setData({
                            hiddenmodal: true
                          })
                          //删除当前订单
                          that.deleteOrder(un_id, timestamp, coupon_id);
                          wx.navigateBack({
                            delta: 1
                          })
                        }, 3000);
                        return false;

                      }else{
                        
                        var sumNum = parseInt(that.data.carts[i].num);
                        for (var t = 0; t < i; t++) {
                          if (that.data.carts[t].com_id == that.data.carts[i].com_id && that.data.carts[t].com_group_id == that.data.carts[i].com_group_id) {
                            sumNum += parseInt(that.data.carts[t].num);
                          }
                        }
                        console.log("立即购买-sumNum:" + sumNum);
                        console.log("立即购买-repertory:" + res.data.data.repertory);
                        if (sumNum > res.data.data.repertory) {
                          wx.hideLoading();
                          that.setData({
                            maskBg: false,
                            hiddenmodal: false,
                            modalCont: '“' + that.data.carts[i].name + '”库存不足，请重新选择！'
                          })
                          setTimeout(function () {
                            that.setData({
                              hiddenmodal: true
                            })
                            //删除当前订单
                            that.deleteOrder(un_id, timestamp, coupon_id);
                            wx.navigateBack({
                              delta: 1
                            })
                          }, 3000);
                          return false;

                        } else {
                          that.insertEachGoods(i, timestamp, timestamp1, coupon_id, un_id, formId);
                        }
                      }
                    }else{
                      wx.hideLoading();
                      that.setData({
                        maskBg: false,
                        hiddenmodal: false,
                        modalCont: '“' + that.data.carts[i].name + '”已售罄，请重新选购！'
                      })
                      setTimeout(function () {
                        that.setData({
                          hiddenmodal: true
                        })
                        //删除当前订单
                        that.deleteOrder(un_id, timestamp, coupon_id);
                        wx.navigateBack({
                          delta: 1
                        })
                      }, 3000);

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
              modalCont: '“' + that.data.carts[i].name + '”已下架，请重新选购！'
            })
            setTimeout(function () {
              that.setData({
                hiddenmodal: true
              })
              wx.navigateBack({
                delta: 1
              })
              //删除当前订单
              that.deleteOrder(un_id, timestamp, coupon_id);
            }, 3000);
            return false;
          }
        }
      })
    }
  },

  //插入订单中的每一样商品
  insertEachGoods: function (i, timestamp, timestamp1, coupon_id, un_id, formId){
    var that = this;
    var host = getApp().globalData.servsers;

    wx.request({
      url: host + "orderaffapi/insertOrderAff",
      data: {
        order_number: timestamp,
        cost: that.data.carts[i].cost,
        com_id: that.data.carts[i].com_id,
        logo: that.data.carts[i].logo,
        name: that.data.carts[i].name,
        num: that.data.carts[i].num,
        process: that.data.carts[i].process,
        giftbox_name: that.data.carts[i].giftbox_name,
        giftbox_id: that.data.carts[i].giftbox,
        box_price: that.data.carts[i].box_price,
        process_name: that.data.carts[i].process_name,
        process_id: that.data.carts[i].process,
        logo: that.data.carts[i].logo,
        style1: that.data.carts[i].style1,
        style1_name: that.data.carts[i].style1_name,
        style2: that.data.carts[i].style2,
        style2_name: that.data.carts[i].style2_name,
        style3: that.data.carts[i].style3,
        style3_name: that.data.carts[i].style3_name,
        style4: that.data.carts[i].style4,
        style4_name: that.data.carts[i].style4_name,
        style5: that.data.carts[i].style5,
        style5_name: that.data.carts[i].style5_name,
        comGroupId: that.data.carts[i].com_group_id
      },
      method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      header: {
        'Accept': 'application/json'
      },
      success: function (res) {

        console.log("插入");
        console.log(res);

        if ((that.data.carts[i].process_name != '') && (that.data.carts[i].process != -1)) {
          that.setData({
            stateNum: that.data.stateNum + 1
          })
        }

        //插入订单
        that.insertOrder(i, timestamp, timestamp1, coupon_id, un_id, formId);
        console.log("插入2");

        if (res == null || res.data == null || res.data == '') {
          //删除当前订单
          that.deleteOrder(un_id, timestamp, coupon_id);
          that.setData({
            maskBg: false,
            allowPay: 0,
            firstClick: 0
          })
          console.error('插入订单失败');
          return;
        }
      }
    })

  },

  //删除订单
  deleteOrder: function (un_id, timestamp, coupon_id){
    var that = this;
    var host = getApp().globalData.servsers;

    wx.request({
      url: host + "orderapi/deleteorder",
      data: {
        order_userid: un_id,
        order_number: timestamp,
        coupon_id: coupon_id,
      },
      method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      header: {
        'Accept': 'application/json'
      },
      success: function (res) {

        if (res == null || res.data == null) {
          console.error('已下架-删除订单：失败');
          return;
        }
      }
    });
  },


  //调起付款
  payOrder:function(timestamp, timestamp1, coupon_id, un_id, formId){

    console.log("pay");
    console.log("pay-formId:" + formId);

    var that = this;
    var pages = getCurrentPages();
    var currPage = pages[pages.length - 1];  //当前页面
    var prevPage = pages[pages.length - 2]; //上一个页面
    var prevPageUrl = prevPage.route;
    var host = getApp().globalData.servsers;
    var carts = that.data.carts;

    var timestamp = String(Date.parse(new Date()));  //时间戳

    //插入用于模板消息的formId
    wx.request({
      url: host + "userapi/insertadduserwxsend",
      data: {
        user_id: un_id,
        form_id_fh: formId,
        order_number: timestamp,
      },
      method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      header: {
        'Accept': 'application/json'
      },
      success: function (res) {
        console.log("formid");
        console.log(res);
        if (res == null || res.data == null) {
          console.error('插入formId失败');
          return;
        }
      }
    })

    //获取用户登录状态
    wx.login({
      success: function (res) {

        //发起网络请求,发起的是HTTPS请求，向服务端请求预支付
        var code = res.code;
        var title = that.data.carts[0].name;
        var price = that.data.total2 * 100;
        price = 1;
        
        wx.request({
          url: host + 'prepay',
          data: {
            code: code,
            price: price,
            title: title,
            order_number: timestamp1,
            userid: un_id
          },
          success: function (res) {
            console.log("pay:");
            console.log(res);
            if (res.data.result) {

              wx.hideLoading();
              that.setData({
                maskBg: false
              })

              if (res.data.result == true) {
                var nonceStr = res.data.nonceStr;
                var prepayId = res.data.prepayId;

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
                    console.log(111);
                    console.log(res);

                    wx.request({
                      url: host + "orderapi/update",
                      data: {
                        order_sta: that.data.orderState1,
                        order_number: timestamp1,
                        orderState: that.data.orderState1,
                        order_userid: un_id
                      },
                      method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
                      header: {
                        'Accept': 'application/json'
                      },
                      success: function (res) {
                        console.log("支付");
                        console.log(res);
                        that.setData({
                          maskBg: false,
                          hiddenmodal: false,
                          modalCont: '支付成功'
                        })
                        setTimeout(function () {
                          that.setData({
                            hiddenmodal: true
                          })
                          wx.redirectTo({
                            url: '/pages/orderList/orderList?isSelect=0'
                          })
                        }, 2000);

                        if (res == null || res.data == null) {
                          //删除当前订单
                          that.deleteOrder(un_id, timestamp, that.data.coupon_id);
                          that.setData({
                            maskBg: false,
                            allowPay: 0,
                            firstClick: 0
                          })
                          return false;
                        }
                      }
                    });
                  },
                  'fail': function (res) {
                    that.setData({
                      maskBg: false,
                      hiddenmodal: false,
                      modalCont: '取消支付'
                    })
                    setTimeout(function () {
                      that.setData({
                        hiddenmodal: true
                      })
                      wx.redirectTo({
                        url: '/pages/orderList/orderList?isSelect=0'
                      })
                    }, 2000);
                  }
                })

                //如果是从购物车进入支付，则清空对应购物车商品
                if (prevPageUrl == 'pages/car/index' || prevPageUrl == 'pages/carInsert/carInsert') {
                  for (var i = 0; i < that.data.carts.length; i++) {
                    wx.request({
                      url: host + "shoppingcartapi/deleteshoppingcart",
                      data: {
                        id: that.data.carts[i].id
                      },
                      method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
                      header: {
                        'Accept': 'application/json'
                      },
                      success: function (res) {
                        if (res == null || res.data == null) {
                          console.error('清空对应购物车商品失败');
                          return;
                        }
                      }
                    });
                  }
                }

              } else {
                that.setData({
                  maskBg: false,
                  allowPay: 0,
                  firstClick: 0
                })

                //删除当前订单
                that.deleteOrder(un_id, timestamp, coupon_id);
                return false;
              }

            } else {
              that.setData({
                maskBg: false,
                allowPay: 0,
                firstClick: 0,
                hiddenmodal: false,
                modalCont: '网络错误，请重新操作！'
              })
              setTimeout(function () {
                that.setData({
                  hiddenmodal: true,
                  allowPay: 0
                })
                //删除当前订单
                that.deleteOrder(un_id, timestamp, coupon_id);
                
              }, 3000);
              return false;

            }
          }
        })

      }
    })

  },

})
var that;
var Util = require('../../utils/util.js'); 