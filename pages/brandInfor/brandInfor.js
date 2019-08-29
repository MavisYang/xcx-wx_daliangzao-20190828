// 品牌相关产品列表
var contentList = [];
Page({
  data: {
    placeholder: "输入搜索关键字",
    pageNo: 1,
    contentList: contentList,
    loadingHidden: false,
    num: 1,
    title: '',
    intro: '',
    id: '',
    src: '',
    src1: '',
    limt: 20
  },

   onLoad: function (options) {
     this.setData({
       title: options.title,
       intro: options.intro,
       id: options.id,
       src: options.src,
       src1: options.src1,

     })
     that = this;
     var host = getApp().globalData.servsers;
     //首页banner
     wx.request({
       url: host+"commodityapi/findAllfor",
       data: {
         commodity_brand: options.id
       },
       method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
       header: {
         'Accept': 'application/json'
       },
       success: function (res) {
         that.setData({
           contentList: res.data.rows
         });
         if (res == null || res.data == null) {
           console.error('网络请求失败');
           return;
         }
       }
     });
     wx.setNavigationBarTitle({
       title: options.title
     }) 
  }   
})
var that;
var Util = require('../../utils/util.js'); 