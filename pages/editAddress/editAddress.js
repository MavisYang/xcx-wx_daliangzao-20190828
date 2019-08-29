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
    isDefault: 0 ,     //是否默认
    arr : [],
    flag : 0,
    checked : true,
    user_id : ''
  },

  onLoad: function (options) {
    var that = this;
    that.data.arr = JSON.parse(options.arr);
    that.setData({
      arr: JSON.parse(options.arr),
      user_id: that.data.arr.id,
      userName: that.data.arr.name,
      userTelephone: that.data.arr.phone,
      userAddress: that.data.arr.adress,
      province: that.data.arr.province,
      city: that.data.arr.city,
      county: that.data.arr.county,
      isDefault: that.data.arr.flag,
      provinceId: that.data.arr.provinceId,
      cityId: that.data.arr.cityId,
      countyId: that.data.arr.countyId
    })

    if (that.data.isDefault == 1) {
      that.setData({
        checked: true
      })
    } else {
      that.setData({
        checked: false
      })
    }

    tcity.init(that);
    var cityData = that.data.cityData;

    const provinces = [];
    const citys = [];
    const countys = [];
    var provinceId = that.data.arr.provinceId;
    var cityId = that.data.arr.cityId;
    var countyId = that.data.arr.countyId;

    for (let i = 0; i < cityData.length; i++) {
      provinces.push(cityData[i].name);
    }
    console.log('省份完成');
    for (let i = 0; i < cityData[provinceId].sub.length; i++) {
      citys.push(cityData[provinceId].sub[i].name)
    }
    console.log('city完成');
    for (let i = 0; i < cityData[provinceId].sub[cityId].sub.length; i++) {
      countys.push(cityData[provinceId].sub[cityId].sub[i].name)
    }

    that.setData({
      'provinces': provinces,
      'citys': citys,
      'countys': countys,
      value: [provinceId, cityId, countyId]
      // 'province': options.province,
      // 'city': options.city,
      // 'county': options.county
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
    if (that.data.condition == false) {
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
    that = this;
    wx.request({
      url: host + "adressapi/update",
      data: {
        id: that.data.user_id,
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
        wx.navigateBack({ delta: 1})
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