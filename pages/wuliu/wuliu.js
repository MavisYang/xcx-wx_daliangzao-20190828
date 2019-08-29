// pages/wuliu/wuliu.js
Page({
  data: {
    company : '',
    orderNum : '',
    id:'',
    dizhi : []
  },

  onLoad: function (options) {
    var that = this;
    var host = getApp().globalData.servsers;
    var id = options.id;
    
    if (id != undefined){
      that.setData({
        id: id
      })

      wx.request({
        url: host + "orderapi/findAllOneforxcx",
        data: {
          order_number: options.id,
        },
        method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
        header: {
          'Accept': 'application/json'
        },
        success: function (res) {
          console.log(res);
          //console.log(res.data.rows[0].order_logistics);
          var dizhi = (res.data.rows[0].order_logistics);
          console.log("dizhi:" + dizhi);
          if (res.data.rows[0].order_logistics != null){
            dizhi = dizhi.split(",");
            that.setData({
              id: id,
              dizhi: dizhi,
              company: dizhi[0],
              orderNum: dizhi[1]
            })
            that.selectList();
          }
          if (res == null || res.data == null) {
            console.error('网络请求失败');
            return;
          }
        }
      })
    }
  },

  selectList:function(e){
    var that = this;
    var id = that.data.id;
    var dizhi = that.data.dizhi;
    var orderNum = that.data.orderNum;
    if (orderNum != undefined){
      wx.request({
        url: "https://way.jd.com/jisuapi/query",
        data: {
          type: 'auto',
          number: orderNum,
          appkey: '9c5b9c4c777db65e00f4a70aa8c51a8b',

        },
        method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
        header: {
          'Accept': 'application/json'
        },
        success: function (res) {
          console.log(res);
          that.setData({
            searchList: res.data.result.result.list,
          });
          if (res == null || res.data == null) {
            console.error('网络请求失败');
            return;
          }
        }
      })
    }
  },

  onShow: function (e) {
    var that = this;
    var host = getApp().globalData.servsers;
    var id = that.data.id;

    if (id != undefined) {
      wx.request({
        url: host + "orderapi/findAllOneforxcx",
        data: {
          order_number: id,
        },
        method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
        header: {
          'Accept': 'application/json'
        },
        success: function (res) {
          var dizhi = res.data.rows[0].order_logistics;
          if (res.data.rows[0].order_logistics != null) {
            dizhi = dizhi.split(",");
            that.setData({
              id: id,
              dizhi: dizhi,
              company: dizhi[0],
              orderNum: dizhi[1]
            })
            that.selectList();
          }

          if (res == null || res.data == null) {
            console.error('网络请求失败');
            return;
          }
        }
      })
    }
  }
})