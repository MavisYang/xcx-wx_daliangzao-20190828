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
    modalCont : ''
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

  saveInfor: function (e) {
    var host = getApp().globalData.servsers;
    var un_id = getApp().globalData.un_id;
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


    var pages = getCurrentPages();
    var currPage = pages[pages.length - 1];  //当前页面
    var prevPage = pages[pages.length - 2]; //上一个页面
    var prevPage3 = pages[pages.length - 3];

    var prevPageUrl = prevPage.route;   
    var prevPageUrl3 = pages[pages.length - 3].route;
    var num = pages.length;
    if (un_id != undefined){
      wx.request({
        url: host + "adressapi/insertadd",
        data: {
          user_id: un_id,
          consignee: that.data.userName,
          province: that.data.province,
          city: that.data.city,
          area: that.data.county,
          adress: that.data.userAddress,
          phone: that.data.userTelephone,
          adress_flag: that.data.isDefault
        },
        method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
        header: {
          'Accept': 'application/json'
        },
        success: function (res) {

          if (prevPageUrl3 == 'pages/confirmOrder/confirmOrder') {
            prevPage3.setData({
              province: that.data.province,
              city: that.data.city,
              area: that.data.county,

              adress: that.data.userAddress,
              consignee: that.data.userName,
              phone: that.data.userTelephone
            });

            wx.navigateBack({
              delta: 2
            })
          } else {
            wx.redirectTo({
              url: '/' + prevPageUrl
            })
          }
          if (res == null || res.data == null) {
            console.error('网络请求失败');
            return;
          }
        }
      })
    }
    
  },

  onLoad: function () {
    var that = this;
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

  }
})
var that;
var Util = require('../../utils/util.js'); 