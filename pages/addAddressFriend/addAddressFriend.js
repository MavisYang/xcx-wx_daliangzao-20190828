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
    order_number : '',
    addGiftListClick : false
  },

  onLoad: function (options) {
    var that = this;
    that.setData({//从领取礼物页带过来的礼物得订单号
      order_number: options.order_number
    })
    console.log("1:"+options.order_number);
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
      'county': cityData[0].sub[0].sub[0].name
    })
    console.log('初始化完成');

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

  saveInfor: function (e) {//领取礼物
    var host = getApp().globalData.servsers;
    var un_id  = getApp().globalData.un_id;
    var that = this;

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
    wx.showLoading({
      title: '礼物领取中，请稍候',
      icon: 'loading',
      mask: true,
      success: function () {
      }
    })

    var pages = getCurrentPages();
    var currPage = pages[pages.length - 1];  //当前页面
    var prevPage = pages[pages.length - 2]; //上一个页面
    var num = pages.length;

    var timestamp = Date.parse(new Date());
    var formIdTime = timestamp / 1000;//formId 生成时间
    var formId = e.detail;//formId
    console.log(formId);

    //针对消息模版：存储模板消息[用于已发货提醒]使用的form_id【操作人产生的form_id，仅可用于给当前操作人发送消息】
    wx.request({
      url: host + "userapi/insertadduserwxsend",
      data: {
        user_id: un_id,
        form_id_fh: formId.formId,
        order_number: that.data.order_number
      },
      method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      header: {
        'Accept': 'application/json'
      },
      success: function (res) {
        console.log(res);
        if (res == null || res.data == null) {
          console.error('网络请求失败');
          return;
        }
      }
    })

    that.setData({
      addGiftListClick : true
    })

    //更改送出的礼物的订单收货地址
    wx.request({
      url: host + "orderapi/updateOrderInfo",
      data: {
        //user_id: un_id,
        order_number: that.data.order_number,
        order_type : 2,//订单最终状态标志位
        order_Consignee: that.data.userName,
        order_address: that.data.province + that.data.city + that.data.county + that.data.userAddress,
        order_phone: that.data.userTelephone
      },
      method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      header: {
        'Accept': 'application/json'
      },
      success: function (res) {
        wx.hideLoading(); 
        that.setData({
          hiddenmodal: false,
          modalCont: '礼物领取成功，等待迎接您的礼物上门吧'
        })
        setTimeout(function () {
          that.setData({
            hiddenmodal: true
          })
          prevPage.setData({
            isSelect: 1,
            goosdListnew: {},
            goosdListnew2: {}
          })
          prevPage.onShow();
          wx.navigateBack({
            delta: 1
          })
        }, 1500)

        if (res == null || res.data == null) {
          console.error('网络请求失败');
          return;
        }
      }
    })
  }
})
var that;
var Util = require('../../utils/util.js'); 