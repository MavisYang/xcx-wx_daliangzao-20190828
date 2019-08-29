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
    flag: 0,
    hidden : 'hidden'
  },
  onLoad: function () {
    wx.showNavigationBarLoading()
    var that = this;
    

    var host = getApp().globalData.servsers;
    var un_id = getApp().globalData.un_id;
    var openid = getApp().globalData.openid;

    if ((un_id == undefined || un_id == '' || un_id == null) || (openid == undefined || openid == '' || openid == null)) {
      wx.navigateTo({
        url: '/pages/authorize/authorize?link=selectAddress',
      })
    } else {
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
       
  },

  onShow:function(e){
    // var listLength = addressList.length;
    // var defaultData = [];
    // var count = 0;
    // for (var i = 1; i < listLength; i++) {//判断是否有默认地址
    //   defaultData[i] = addressList[i].addressDefault;
    //   if (defaultData[i] == 1) {
    //     this.setData({
    //       'selectnum': i
    //     })
    //     count++;
    //   }
    // }
    // if (listLength == 1){
    //   this.setData({
    //     'selectnum': 0
    //   })      
    // }else{     
    //   if (count == 0){
    //     this.setData({
    //       'selectnum': 0
    //     })
    //   }

    // }
  },

  selectAddress: function (options){//勾选地址
    var that = this
    var id = options.currentTarget.dataset.id;
    var province = options.currentTarget.dataset.province;
    var city = options.currentTarget.dataset.city;
    var area = options.currentTarget.dataset.area;
    var consignee = options.currentTarget.dataset.consignee;
    var phone = options.currentTarget.dataset.phone;
    var adress = options.currentTarget.dataset.adress;
    var pages = getCurrentPages();
    var currPage = pages[pages.length - 1];  //当前页面
    var prevPage = pages[pages.length - 2]; //上一个页面
    
    //if (prevPage.route == 'pages/confirmOrder/confirmOrder'){
      prevPage.setData({
        province: province,
        city: city,
        area: area,
        adress: adress,
        consignee: consignee,
        phone: phone
      });
      wx.navigateBack();
    //}
  }
  
})