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
    condition: false
  },
  onLoad: function () {
    console.log("onLoad");
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
    var un_id = getApp().globalData.un_id;

    var host = getApp().globalData.servsers;
    console.log('获取用户openid成功' + openid)
    //人气推荐
    wx.request({
    
      url: host+"adressapi/adressview",
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
      }
    });

  },

  onShow:function(e){
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
    if (listLength == 1){
      this.setData({
        'selectnum': 0
      })      
    }else{     
      if (count == 0){
        this.setData({
          'selectnum': 0
        })
      }

    }
  },

  selectAddress: function (options){//勾选地址
    var that = this
    var id = options.currentTarget.dataset.id;
    var pages = getCurrentPages();
    var currPage = pages[pages.length - 1];  //当前页面
    var prevPage = pages[pages.length - 2]; //上一个页面
    console.log(pages);
    console.log(currPage);
    console.log(prevPage);
    prevPage.setData({
      address: '32131'
      })
    wx.navigateBack();
    //设置当前样式
    that.setData({
      'selectnum': id
    })
  },

  deleteAddress:function(e){//删除地址
    var id = event.currentTarget.dataset.deleteid;
    wx.request({
      url: 'https://shop.yunapply.com/home/shipping/delAddress?id=' + id,
      data: {},
      method: 'GET',
      success: function (res) {
        if (res.data.status == 0) {
          wx.showToast({
            title: res.data.info,
            icon: 'loading',
            duration: 1500
          })
        } else {
          wx.showToast({
            title: res.data.info,
            icon: 'success',
            duration: 1000
          })
          //删除之后应该有一个刷新页面的效果，等和其他页面刷新跳转一起做
        }
      },
      fail: function () {
        wx.showToast({
          title: '服务器网络错误!',
          icon: 'loading',
          duration: 1500
        })
      }
    })
  }

  
})