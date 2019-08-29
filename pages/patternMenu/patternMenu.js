// pages/patternList/patternList.js
var app = getApp();
var yongtuList = [];
var duxiangList = [];
Page({

  data: {
      urlHttp: '',
      yongtuList : yongtuList,
      duxiangList : duxiangList,
      yongtuLength : 0,
      duixiangLength : 0,
      activeTab1 : -1,  //tab选中状态值
      activeTab2: -1,
      activeTab3: -1,
      activeId1 : -1,   //记录选中tab的id
      activeId2: -1,
      activeId3: -1,
      activeName1: '',  //记录选中tab的名称
      activeName2: '',
      activeName3: '',
      hiddenmodal: true, //弹窗
  },

  onLoad: function (options) {
    var that = this;
    var host = getApp().globalData.servsers;
    that.setData({
      urlHttp: host
    })

    wx.request({
      url: host + "commodityapi/findAllScene",
      data: {
      },
      method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      header: {
        'Accept': 'application/json'
      },
      success: function (res) {
        var yongtuLength = res.data.purposeList.length;

        console.log(res.data.objectList)

        var duixiangLength = res.data.objectList.length;
        that.setData({
          yongtuList: res.data.purposeList,
          duxiangList: res.data.objectList,
          yongtuLength: yongtuLength,
          duixiangLength: duixiangLength
        })
      }
    })
  },

  //送礼用途
  yongtuClick:function(e){
    var that = this;
    var id = e.currentTarget.dataset.id;
    var activeName1 = e.currentTarget.dataset.name;
    var flagId = e.currentTarget.dataset.flagid;
    that.setData({
        activeTab1 : id,
        activeName1: activeName1,
        activeId1: flagId
    })
  },

  //送礼对象
  duixiangClick: function (e) {
    var that = this;
    var id = e.currentTarget.dataset.id;
    var activeName2 = e.currentTarget.dataset.name;
    var flagId = e.currentTarget.dataset.flagid;
    that.setData({
        activeTab2: id,
        activeName2: activeName2,
        activeId2: flagId
    })
  },

  //预算范围
  fanweiClick:function(e){
    var that = this;
    var id = e.currentTarget.dataset.id;
    var activeName3 = e.currentTarget.dataset.name;
    var flagId = e.currentTarget.dataset.flagid;
    that.setData({
        activeTab3: id,
        activeName3: activeName3,
        activeId3: flagId
    })
  },

  //生成礼品清单
  saveChange:function(e){
      var that = this;
      var host = getApp().globalData.servsers;
      var activeId1 = that.data.activeId1;
      var activeId2 = that.data.activeId2;
      var activeId3 = that.data.activeId3;
      var activeName1 = that.data.activeName1;
      var activeName2 = that.data.activeName2;
      var activeName3 = that.data.activeName3;
      if (activeId1 == -1) {
          that.setData({
              hiddenmodal: false,
              modalCont: '请选择送礼用途'
          })
          setTimeout(function () {
              that.setData({
                  hiddenmodal: true
              })
          }, 1000)
          return false;
      }
      if (activeId2 == -1) {
          that.setData({
              hiddenmodal: false,
              modalCont: '请选择送礼对象'
          })
          setTimeout(function () {
              that.setData({
                  hiddenmodal: true
              })
          }, 1000)
          return false;
      }
      if (activeId3 == -1) {
          that.setData({
              hiddenmodal: false,
              modalCont: '请选择预算范围'
          })
          setTimeout(function () {
              that.setData({
                  hiddenmodal: true
              })
          }, 1000)
          return false;
      }
      wx.navigateTo({
          url: '/pages/patternList/patternList?activeId1=' + that.data.activeId1 + 
          '&activeName1=' + activeName1 + 
          '&activeId2=' + that.data.activeId2 + 
          '&activeName2=' + activeName2 + 
          '&activeId3=' + activeId3 + 
          '&activeName3=' + activeName3
      })

  }
})
var that;
var Util = require('../../utils/util.js'); 