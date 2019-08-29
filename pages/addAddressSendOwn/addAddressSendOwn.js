//index.js
//获取应用实例
var tcity = require("../../utils/citys.js");

var app = getApp()
Page({

  data: {
    provinces: [],
    province: "",
    citys: [],
    city: "",
    countys: [],
    county: '',
    value: [0, 0, 0],
    values: [0, 0, 0],
    condition: false,
    userName: "",//用户名
    userAddressArea: "",//省市区
    userAddress: "",    //详细地址
    userTelephone: "",  //联系方式
    isDefault: 0,      //是否默认
    checked : false,
    hiddenmodal : 'hidden',
    modalCont : '',
    order_number : '',//原单号
    order_number_new : '',//拆分单号
    goodsList:[],
    hiddenLoading:false,//隐藏加载层
    saveInforClick : false,//防止连点
  }, 

  onLoad: function (options) {
    var that = this;
    var order_number = options.order_number;
    var order_number_new = options.order_number_new;

    var goodsList = options.goodsList;
    goodsList = goodsList.replace(/zss/g, "&");
    goodsList = JSON.parse(goodsList);

    var total = 0;
    for (var i = 0; i < goodsList.list_order_aff_data.length; i++) {

      var boxPrice = goodsList.list_order_aff_data[i].box_price;
      var goodsPrice = goodsList.list_order_aff_data[i].com_price;
      if (boxPrice == '' && boxPrice == null) {
        boxPrice = 0;
      }

      total += (parseFloat(goodsPrice) + parseFloat(boxPrice)) * parseInt(goodsList.list_order_aff_data[i].break_num);
    }
    for (var i = 0; i < goodsList.list_order_aff_data.length; i++) {
      goodsList.list_order_aff_data[i].order_Price = total;
    }


    that.setData({//从领取礼物页带过来的礼物得订单号
      order_number: options.order_number,
      order_number_new: options.order_number_new,
      goodsList: goodsList
    })

    console.log(goodsList);

    tcity.init(that);
    var cityData = that.data.cityData;
    const provinces = [];
    const citys = [];
    const countys = [];

    for (let i = 0; i < cityData.length; i++) {
      provinces.push(cityData[i].name);
    }
    console.log('省份完成');
    for (let i = 0; i < cityData[0].sub.length; i++) {
      citys.push(cityData[0].sub[i].name)
    }
    console.log('city完成');
    for (let i = 0; i < cityData[0].sub[0].sub.length; i++) {
      countys.push(cityData[0].sub[0].sub[i].name)
    }

    that.setData({
      'provinces': provinces,
      'citys': citys,
      'countys': countys,
      'province': cityData[0].name,
      'city': cityData[0].sub[0].name,
      'county': cityData[0].sub[0].sub[0].name,
      order_number: order_number
    })
    console.log('初始化完成');

  },
  onShow:function(){
    var that = this;
    that.setData({
      saveInforClick: false
    })
  },

  bindChange: function (e) {
    var val = e.detail.value
    var t = this.data.values;
    var cityData = this.data.cityData;

    if (val[0] != t[0]) {
      const citys = [];
      const countys = [];

      for (let i = 0; i < cityData[val[0]].sub.length; i++) {
        citys.push(cityData[val[0]].sub[i].name)
      }
      for (let i = 0; i < cityData[val[0]].sub[0].sub.length; i++) {
        countys.push(cityData[val[0]].sub[0].sub[i].name)
      }

      this.setData({
        province: this.data.provinces[val[0]],
        city: cityData[val[0]].sub[0].name,
        citys: citys,
        county: cityData[val[0]].sub[0].sub[0].name,
        countys: countys,
        values: val,
        value: [val[0], 0, 0]
      })

      return;
    }
    if (val[1] != t[1]) {
      const countys = [];
      for (let i = 0; i < cityData[val[0]].sub[val[1]].sub.length; i++) {
        countys.push(cityData[val[0]].sub[val[1]].sub[i].name)
      }
      this.setData({
        city: this.data.citys[val[1]],
        county: cityData[val[0]].sub[val[1]].sub[0].name,
        countys: countys,
        values: val,
        value: [val[0], val[1], 0]
      })
      return;
    }
    if (val[2] != t[2]) {
      this.setData({
        county: this.data.countys[val[2]],
        values: val
      })
      return;
    }
  },
  open: function () {
    var that = this;
    this.setData({
      condition: !this.data.condition
    })
    if (that.data.condition == false){
      var province = that.data.province;
      var city = that.data.city;
      var county = that.data.county;
      var cityData = that.data.cityData;
      var provinceId = 0;
      var cityId = 0;
      var countyId = 0;
      var len1 = cityData.length;
      for (var i = 0; i < len1; i++) {
        if (cityData[i].name == province) {
          provinceId = i;
        }
      }
      var len2 = cityData[provinceId].sub.length;
      for (var i = 0; i < len2; i++) {
        if (cityData[provinceId].sub[i].name == city) {
          cityId = i;
        }
      }
      var len3 = cityData[provinceId].sub[cityId].sub.length;
      for (var i = 0; i < len3; i++) {
        if (cityData[provinceId].sub[cityId].sub[i].name == county) {
          countyId = i;
        }
      }
      that.setData({
        value: [provinceId, cityId, countyId]
      })
      
    }
  },

  userNameInput: function (e) {
    this.setData({
      userName: e.detail.value
    })
  },
  userAddressInput: function (e) {
    this.setData({
      userAddress: e.detail.value
    })
  },
  userTelephoneInput: function (e) {
    this.setData({
      userTelephone: e.detail.value
    })
  },

  switchChange: function (e) {
    if (e.detail.value == false){
      this.setData({
        isDefault: 0
      })
    }else{
      this.setData({
        isDefault: 1
      })
    }
  },

  //插入订单
  insertOrder: function (i, order_number, order_number_new, un_id) {
    var that = this;
    var host = getApp().globalData.servsers;
    var stateNum = that.data.stateNum;//记录带有定制的商品数量
    var pages = getCurrentPages();
    var currPage = pages[pages.length - 1];  //当前页面
    var prevPage = pages[pages.length - 2]; //上一个页面
    console.log("i:" + i);

    if (i == 0) {

      that.setData({
        hiddenLoading:true,
        hiddenmodal: false,
        modalCont: '礼物领取成功，等待迎接您的礼物上门吧'
      })
      setTimeout(function () {
        that.setData({
          hiddenmodal: true
        })
        prevPage.setData({
          order_type: '1',
          goosdListnew: {}
        })
        prevPage.onShow();
        wx.navigateBack({
          delta: 1
        })
      }, 1500)

    } else {

      i -= 1;
      
      var break_num = that.data.goodsList.list_order_aff_data[i].break_num;
      var giftbox_name = that.data.goodsList.list_order_aff_data[i].com_dz;
      var process_name = that.data.goodsList.list_order_aff_data[i].com_lh;
      var process_id = 20;
      var giftbox_id = 20;
      if (process_name == '无需定制' || process_name == '') {
        process_id = -1;
      }
      if (giftbox_name == '无需定制' || giftbox_name == '') {
        giftbox_id = -1;
      }
      if (break_num > 0) {
        wx.request({
          url: host + "orderaffapi/insertOrderAff_n",
          data: {
            order_number_o: order_number,//原始单号
            order_number: "N" + order_number_new,
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

            //for (var j = 0; j < that.data.goodsList.length; j++) {
            if ((that.data.goodsList.list_order_aff_data[i].process_name != '') && (that.data.goodsList.list_order_aff_data[i].process != -1)) {
              that.setData({
                stateNum: stateNum + 1
              })

            }
            //}

            that.insertOrder(i, order_number, order_number_new, un_id);

            if (res == null || res.data == null) {
              console.error('网络请求失败');
              return;
            }
          }
        })
      } else {
        that.insertOrder(i, order_number, order_number_new, un_id);
      }
      
    }
  },

  saveInfor: function (e) {//领取礼物
    var that = this;
    var host = getApp().globalData.servsers;
    var un_id = getApp().globalData.un_id;
    
    var consignee = this.data.userName;
    if (consignee == undefined || consignee == '') {
      that.setData({
        hiddenmodal: false,
        modalCont: '请填写收货人姓名'
      })
      setTimeout(function () {
        that.setData({
          hiddenmodal: true
        })
      }, 1000)
      return false;
    } 

    var userAddress = this.data.userAddress;
    if (userAddress == undefined || userAddress == '') {
      that.setData({
        hiddenmodal: false,
        modalCont: '请填写详细地址'
      })
      setTimeout(function () {
        that.setData({
          hiddenmodal: true
        })
      }, 1000)
      return false;
    } 

    var userTelephone = this.data.userTelephone;
    if (userTelephone == undefined || userTelephone == '') {
      that.setData({
        hiddenmodal: false,
        modalCont: '请填写电话号码'
      })
      setTimeout(function () {
        that.setData({
          hiddenmodal: true
        })
      }, 1000)
      return false;
    } 


    var pages = getCurrentPages();
    var currPage = pages[pages.length - 1];  //当前页面
    var prevPage = pages[pages.length - 2]; //上一个页面
    var num = pages.length;

    var timestamp = Date.parse(new Date());
    timestamp = timestamp / 1000;

    var formIdTime = timestamp;//formId 生成时间
    var formId = e.detail;//formId
    console.log(formId);

    //针对消息模版：存储模板消息使用的form_id【操作人产生的form_id，仅可用于给当前操作人发送消息】
    wx.request({
      url: host + "userapi/insertadduserwxsend",
      data: {
        user_id: un_id,
        form_id_fh: formId.formId,
        order_number: "N" + that.data.order_number_new
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


    if(un_id != undefined && un_id != '' && un_id != null){
      that.setData({
        saveInforClick: true
      })
      wx.request({
        url: host + "orderapi/insertorder_n",
        data: {
          order_userid: un_id,
          order_sta: '3',//待发货
          order_number_o: that.data.order_number,//原始单号
          order_number: "N" + that.data.order_number_new,//新单号
          order_type: 1,//订单最终状态标志位 - 送自己
          order_Price: that.data.goodsList.list_order_aff_data[0].order_Price,
          order_Consignee: '',
          order_phone: '',
          order_address: '',
          order_commodityid: that.data.goodsList.list_order_aff_data[0].id,
          order_Specifications: '',
          order_gixbox: '',
          invoice_send_flag: 3,
          invoice_flag: 3, //发票标志位，如果为3，则为无需发票 

        },
        method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
        header: {
          'Accept': 'application/json'
        },
        success: function (res) {

          that.setData({
            hiddenLoading:true
          })

          //更改送出的礼物的订单收货地址
          wx.request({
            url: host + "orderapi/updateOrderInfo",
            data: {
              //user_id: un_id,
              order_number: "N" + that.data.order_number_new,
              order_type: 1,//订单最终状态标志位
              order_Consignee: that.data.userName,
              order_address: that.data.province + that.data.city + that.data.county + that.data.userAddress,
              order_phone: that.data.userTelephone
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



          //插入订单
          var len = that.data.goodsList.list_order_aff_data.length;
          that.insertOrder(len, that.data.order_number, that.data.order_number_new, un_id);
          if (res == null || res.data == null) {
            console.error('网络请求失败');
            return;
          }
        }
      });

    }



    //更改送出的礼物的订单收货地址
    // wx.request({
    //   url: host + "orderapi/updateOrderInfo",
    //   data: {
    //     //user_id: un_id,
    //     order_number: that.data.order_number,
    //     order_type : 1,//订单最终状态标志位
    //     order_Consignee: that.data.userName,
    //     order_address: that.data.province + that.data.city + that.data.county + that.data.userAddress,
    //     order_phone: that.data.userTelephone
    //   },
    //   method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
    //   header: {
    //     'Accept': 'application/json'
    //   },
    //   success: function (res) {
    //     that.setData({
    //       hiddenmodal: false,
    //       modalCont: '礼物领取成功，等待迎接您的礼物上门吧'
    //     })
    //     setTimeout(function () {
    //       that.setData({
    //         hiddenmodal: true
    //       })
    //       prevPage.setData({
    //         order_type: '1',
    //       });
    //       wx.navigateBack({
    //         delta:2
    //       })
    //     }, 1500)

    //     if (res == null || res.data == null) {
    //       console.error('网络请求失败');
    //       return;
    //     }
    //   }
    // })
  }
})
var that;
var Util = require('../../utils/util.js'); 