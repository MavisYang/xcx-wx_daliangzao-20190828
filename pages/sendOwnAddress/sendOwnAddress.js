// index.js  我的地址
var tcity = require("../../utils/citys.js");
//  addressDefault ：设为默认地址  1为默认   
var addressList = [

];
Page({

  data: {
    addressList: addressList,
    isSelect: false,
    nickName: '',
    userInfoAvatar: '',
    sex: '',
    province: '',
    city: '',

    provinces: [],
    province: "",
    citys: [],
    city: "",
    countys: [],
    county: '',
    value: [0, 0, 0],
    values: [0, 0, 0],
    condition: false,
    allowDelete: true, //默认可以删除
    allowEdit: true, //默认可以编辑
    arr: {},
    flag: 0,
    hidden: 'hidden',
    order_number:''
  },
  onLoad: function (options) {
    wx.showNavigationBarLoading();
    var that = this;
    var order_number = options.order_number;
    console.log("order_number::" + order_number);
    var un_id = getApp().globalData.un_id;
    var host = getApp().globalData.servsers;
    that.setData({
      order_number: order_number
    })
    if (un_id != undefined && un_id != '' && un_id != null){
      wx.login({
        success: function (res) {
          var code = res.code;
          wx.request({
            url: host + "/adressapi/adressview",
            data: {
              user_id: un_id
            },
            method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
            header: {
              'Accept': 'application/json'
            },
            success: function (res) {
              that.setData({
                addressList: res.data.rows
              });
              if (res == null || res.data == null) {
                console.error('网络请求失败');
                return;
              }
              wx.hideNavigationBarLoading(
                that.setData({
                  hidden: ''
                })
              )
            }
          });

        }
      })
    }
  },

  onShow: function (e) {
    var that = this;
    //that.onLoad();
    var listLength = addressList.length;
    var defaultData = [];
    var count = 0;
    for (var i = 1; i < listLength; i++) {//判断是否有默认地址
      defaultData[i] = addressList[i].addressDefault;
      if (defaultData[i] == 1) {
        this.setData({
          'selectnum': i
        })
        count++;
      }
    }
    if (listLength == 1) {
      this.setData({
        'selectnum': 0
      })
    } else {
      if (count == 0) {
        this.setData({
          'selectnum': 0
        })
      }

    }
  },

  editAddress: function (e) {//编辑地址
    var that = this;
    var order_number = that.data.order_number;
    var id = e.currentTarget.dataset.id;
    var dataId = that.data.addressList[id].id;
    var name = that.data.addressList[id].consignee;
    var phone = that.data.addressList[id].phone;
    var adress = that.data.addressList[id].adress;
    var province = that.data.addressList[id].province;
    var city = that.data.addressList[id].city;
    var county = that.data.addressList[id].area;
    var cityData = that.data.cityData;
    var provinceId = 0;
    var cityId = 0;
    var countyId = 0;
    var flag = that.data.addressList[id].adress_flag;
    tcity.init(that);
    var cityData = that.data.cityData;
    var len1 = that.data.cityData.length;
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

    var arr = {
      id: dataId,
      name: name,
      phone: phone,
      adress: adress,
      province: province,
      city: city,
      county: county,
      flag: flag,
      provinceId: provinceId,
      cityId: cityId,
      countyId: countyId
    };
    this.setData({
      arr: arr
    })

    wx.navigateTo({
      url: '/pages/editAddressSendOwn/editAddressSendOwn?arr=' + JSON.stringify(that.data.arr) + '&order_number=' + order_number,
      success: function (res) { },
      fail: function (res) { },
      complete: function (res) { },
    })
  },

  deleteAddress: function (e) {//删除地址
    var that = this;
    var host = getApp().globalData.servsers;
    var id = e.currentTarget.dataset.deleteid;
    var index = e.currentTarget.dataset.index;
    var addressList = that.data.addressList;
    wx.request({
      url: host + 'adressapi/delete',
      data: {
        id: id
      },
      method: 'GET',
      success: function (res) {
        addressList.splice(index, 1);
        that.setData({
          addressList: addressList
        });
        if (res == null || res.data == null) {
          console.error('网络请求失败');
          return;
        }
      }
    })
  }


})