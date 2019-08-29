// pages/awaitState/awaitState.js
var app = getApp()
Page({
  data: {
    src : '',
    msg : '',
    url : '',
    name : '',
    order_number : '',
    order_userid :'',
    sendUserId : '',
    recHidden : false,
    sendHidden: false,
    time : '',
    uploadImg : []
  },

  onLoad: function (options) {
    var that = this;
    this.setData({
      src: options.src,
      msg: options.msg,
      url : options.url,
      name : options.name,
      order_number: options.order_number,
      order_userid: options.order_userid,
      time: options.time,
      uploadImg: JSON.parse(options.list)
    })
    console.log(options.list);
    var host = getApp().globalData.servsers;
    var un_id = getApp().globalData.un_id;
    if (un_id != undefined && un_id != '' && un_id != null){
      wx.request({
        url: host + "forunionidapi/select",
        data: {
          user_id: un_id
        },
        method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
        header: {
          'Accept': 'application/json'
        },
        success: function (res) {
          if (that.data.order_userid != res.data.unionid) {//当前浏览的用户为收礼物者
            that.setData({
              recHidden: true,
              sendHidden: false
            })
          } else {
            that.setData({
              sendHidden: true,
              recHidden: false
            })
          }
          that.setData({
            receiveUserId: res.code
          })

          if (res == null || res.data == null) {
            console.error('网络请求失败');
            return;
          }
        }
      });
    }
   
  },

  selectWuliu : function(){
    var that = this;
    wx.navigateTo({
      url: '/pages/wuliu/wuliu?id=' + that.data.order_number,
      success: function(res) {},
      fail: function(res) {},
      complete: function(res) {},
    })
  },
  wantSent : function(e){
    wx.switchTab({
      url: '/pages/index/index'
    })
  },
  previewImg: function (e) {//banner图预览
    var that = this;
    var currentUrl = e.currentTarget.dataset.src;
    wx.previewImage({
      current: currentUrl,
      urls: that.data.uploadImg.imgList
    })
  }
})