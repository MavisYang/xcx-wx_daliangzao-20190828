var app = getApp()   //实例化小程序，从而获取全局数据或者使用全局函数
var MD5Util = require('../../utils/md5.js');
// let URLINDEX=util.prefix();
var addressList = [];
var addressAll = [];
Page({
  data: {
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
    invoice_flag: 3, //发票标志位，如果为3，则为不开发票   
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
    upViewShow : false
  },

  onLoad: function (options) {
    wx.showNavigationBarLoading();
    var that = this;

    var carts = JSON.parse(options.carts);
    for (var i = 0; i < carts.length; i++) {
      var name = carts[i].name;
      name = name.replace(/zss/g, "&");
      carts[i].name = name;
    }
    that.setData({
      carts: carts
    })
    var carts = that.data.carts;
    var total = 0;
    var total2 = 0;
    for (var i = 0; i < that.data.carts.length; i++) {

      var boxPrice = that.data.carts[i].box_price;
      var goodsPrice = that.data.carts[i].cost;
      if (boxPrice == '' && boxPrice == null) {
        boxPrice = 0;
      }

      total += (parseFloat(goodsPrice) + parseFloat(boxPrice)) * (that.data.carts[i].num);
    }

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
    if (un_id != undefined && un_id != '' && un_id != null) {
      wx.request({
        url: host + "/adressapi/adressview",//收货地址
        data: {
          user_id: un_id
        },
        method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
        header: {
          'Accept': 'application/json'
        },
        success: function (res) {
          that.setData({
            addressAll: res.data.rows
          });

          var len = that.data.addressAll.length;
          for (var i = 0; i < len; i++) {
            if (that.data.addressAll[i].adress_flag == 1) {
              that.setData({
                consignee: that.data.addressAll[i].consignee,
                phone: that.data.addressAll[i].phone,
                province: that.data.addressAll[i].province,
                city: that.data.addressAll[i].city,
                area: that.data.addressAll[i].area,
                adress: that.data.addressAll[i].adress
              })
            }
          }
          if (res == null || res.data == null) {
            console.error('网络请求失败');
            return;
          }
          wx.hideNavigationBarLoading(//加载完成后显示页面
            that.setData({
              hidden: ''
            })
          )
        }
      });

      //查询是否有默认地址，如有则直接返回默认地址所有信息
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
          if (res == null || res.data == null) {
            console.error('网络请求失败');
            return;
          }
        }
      })
    }
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
        'serchecked': true
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

    var pages = getCurrentPages();
    var currPage = pages[pages.length - 1];  //当前页面
    var prevPage = pages[pages.length - 2]; //上一个页面
    var prevPageUrl = prevPage.route;
    that.setData({
      upViewShow : true
    })

    

    var province = that.data.province;
    if (province == '') {
      that.setData({
        hiddenmodal: false,
      })
      setTimeout(function () {
        that.setData({
          hiddenmodal: true
        })
      }, 1000)
      return false;
    } 
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
    var user_num = parseInt(that.data.carts[0].user_num) - parseInt(that.data.carts[0].num);//上线数量

    if (user_num <= -1){

      that.setData({
        hiddenmodal: false,
        modalCont: '数量已达上限'
      })
      setTimeout(function () {
        that.setData({
          hiddenmodal: true
        })
      }, 1000)
      return false;

    }else{
      if (un_id != undefined && un_id != '' && un_id != null){
        //获取该用户下的该商品限购数量
        wx.request({
          url: host + "userapi/user_fake_split_view",
          data: {
            user_id: that.data.user_id
          },
          method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
          header: {
            'Accept': 'application/json'
          },
          success: function (res) {
            that.setData({
              user_allow_num: res.data.rows[0].user_num
            })
            if (res.data.rows[0].user_num <= 0) {
              that.setData({
                hiddenmodal: false,
                modalCont: '数量已达上限'
              })
              setTimeout(function () {
                that.setData({
                  hiddenmodal: true
                })
              }, 1000)
              return false;
            } else {



            }
          }
        })


        wx.request({
          url: host + "orderapi/insertorder",
          data: {
            order_userid: un_id,
            order_sta: '1',
            order_number: timestamp,
            order_type: '0',
            order_Consignee: that.data.consignee,
            order_phone: that.data.phone,
            order_address: that.data.province +
            that.data.city + that.data.area + that.data.adress,
            order_commodityid: that.data.carts[0].id,
            order_num: that.data.carts[0].num,
            order_Price: 0,//////
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
            if (res == null || res.data == null) {
              console.error('网络请求失败');
              return;
            }
          }
        });

        for (var i = 0; i < that.data.carts.length; i++) {
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
            },
            method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
            header: {
              'Accept': 'application/json'
            },
            success: function (res) {
              var stateNum = 0;
              for (var i = 0; i < that.data.carts.length; i++) {
                if ((that.data.carts[i].process_name != '') && (that.data.carts[i].process != -1)) {
                  stateNum++;
                }
              }
              if (stateNum > 0) {
                that.setData({
                  orderState1: 2
                })
              } else {
                that.setData({
                  orderState1: 3
                })
              }
              if (res == null || res.data == null) {
                console.error('网络请求失败');
                return;
              }
            }
          })
        }
        //获取用户登录状态
        wx.login({
          success: function (res) {
            //发起网络请求,发起的是HTTPS请求，向服务端请求预支付

            var code = res.code;
            var title = that.data.carts[0].name;
            var price = that.data.total2 * 100;
            price = 1;
            var timestamp = String(Date.parse(new Date()))   //时间戳
            wx.request({
              url: host + 'prepay',
              data: {

                code: code,
                price: price,
                title: title,
                order_number: timestamp1
              },
              success: function (res) {
                wx.hideLoading()
                that.setData({
                  maskBg: false
                })

                if (res.data.result == true) {
                  var nonceStr = res.data.nonceStr;
                  var prepayId = res.data.prepayId;

                  console.log("1:" + nonceStr);

                  // 按照字段首字母排序组成新字符串
                  var payDataA = "appId=wx9e3f68fa2172f1c7&nonceStr=" + res.data.nonceStr + "&package=prepay_id=" + res.data.prepayId + "&signType=MD5&timeStamp=" + timestamp;
                  var payDataB = payDataA + "&key=MlxMZWpZidKxCPPaOOztMP84XvQzqSOh";
                  // 使用MD5加密算法计算加密字符串
                  paySign = MD5Util.MD5(payDataB).toUpperCase();
                  // 使用MD5加密算法计算加密字符串
                  var paySign = MD5Util.MD5(payDataB).toUpperCase();

                  wx.request({
                    url: host + "orderapi/update",
                    data: {
                      order_sta: that.data.orderState1,
                      order_number: timestamp1,
                      orderState: that.data.orderState1
                    },
                    method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
                    header: {
                      'Accept': 'application/json'
                    },
                    success: function (res) {

                      //获取该用户下的该商品限购数量

                      wx.request({
                        url: host + "userapi/user_fake_split_update",
                        data: {
                          user_id: un_id,
                          user_num: user_num,

                        },
                        method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
                        header: {
                          'Accept': 'application/json'
                        },
                        success: function (res) {
                          // that.setData({
                          //   user_allow_num: res.data.result
                          // })
                        }
                      })


                      wx.redirectTo({
                        url: '/pages/orderList/orderList?isSelect=0'
                      })
                      if (res == null || res.data == null) {
                        console.error('网络请求失败');
                        return;
                      }
                    }
                  });
                } else {
                  console.log('请求失败' + res.data.info)
                }
              }
            })
          }
        });
      } 
    }
  
  }

})
var that;
var Util = require('../../utils/util.js'); 