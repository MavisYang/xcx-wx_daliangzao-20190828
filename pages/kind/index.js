// index.js
//获取应用实例
var app = getApp();
Page({
  data: {
    urlHttp: '',
    contentList:[],
    command:'', //口令
    commandNeibu:'',
    commandPlaceholder: '请输入口令',
    showVip : false,
    showNeiBu:false,
    hiddenmodal : true  //显示提示弹窗
  },
  onLoad: function () {
    var that = this;
    var host = getApp().globalData.servsers;
    that.setData({
      urlHttp: host
    });
    wx.request({
      url: host+"classifyapi/findAllforhome",
      data: {},
      method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      header: {
        'Accept': 'application/json'
      },

      success: function (res) {
        that.setData({
          contentList: res.data.rows
        });
        console.log(res.data.rows);
        if (res == null || res.data == null) {
          console.error('网络请求失败');
          return;
        }
      }
    })
  },

  //下拉刷新
  onPullDownRefresh: function (e) {
    this.onLoad();
    wx.stopPullDownRefresh();
  },

  //打开VIP弹窗
  openVipWind:function(e){
    var that = this;
    that.setData({
      showVip: true
    })
  },

  //关闭VIP弹窗
  closeVipWind:function(e){
    var that = this;
    that.setData({
      showVip: false
    })
  },



  //口令
  commandInput: function (e) {
    this.setData({
      command: e.detail.value
    })
  },

  commandInputFocus:function(e){
    var that = this;
    that.setData({
      commandPlaceholder : ''
    })
  },

  //vip - 立即进入
  comeInVip:function(e){
    var that = this;
    var command = that.data.command;
    if (command != 'VIPBYU'){
      that.setData({
        hiddenmodal: false,
        modalCont: '输入口令有误！请重新输入口令',
      })
      setTimeout(function () {
        that.setData({
          hiddenmodal: true,
          commandPlaceholder: '请输入口令'
        })
      }, 1000)
      return false;
    }else{

      that.setData({
        showVip: false,
        command : '',
        commandPlaceholder: '请输入口令'
      })
      setTimeout(function () {
        wx.navigateTo({
          url: '/pages/kindSecondList/kindSecondList?classify_name=VIP专区&classify_des=大良造VIP专区&id=2998',
        })
      }, 50)
    }
  },


  //打开内部员工弹窗
  openNeibuWind: function (e) {
    var that = this;
    that.setData({
      showNeibu: true
    })
  },

  //关闭内部员工弹窗
  closeNeibuWind: function (e) {
    var that = this;
    that.setData({
      showNeibu: false
    })
  },

  //内部员工口令
  commandNeibuInput: function (e) {
    this.setData({
      commandNeibu: e.detail.value
    })
  },

  commandNeibuInputFocus: function (e) {
    var that = this;
    that.setData({
      commandPlaceholder: ''
    })
  },

  //内部员工 - 立即进入
  comeInNeibu: function (e) {
    var that = this;
    var commandNeibu = that.data.commandNeibu;
    if (commandNeibu != 'maineibu') {
      that.setData({
        hiddenmodal: false,
        modalCont: '输入口令有误！请重新输入口令',
      })
      setTimeout(function () {
        that.setData({
          hiddenmodal: true,
          commandPlaceholder: '请输入口令'
        })
      }, 1000)
      return false;
    } else {

      that.setData({
        showNeibu: false,
        commandNeibu: '',
        commandPlaceholder: '请输入口令'
      })
      setTimeout(function () {
        wx.navigateTo({
          url: '/pages/kindSecondList/kindSecondList?classify_name=内部购买&classify_des=古德内部员工购买&id=3000&flag=0',
        })
      }, 50)
    }
  },


})
var that;
var Util = require('../../utils/util.js'); 