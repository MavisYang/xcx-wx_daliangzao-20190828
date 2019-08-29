// allGiftList.js
//获取应用实例
var giftList = [
  { id: 1, src: "../../images/goods_4.png", intro: "年会佳品", title: "Kindle Paperwhite3", price: 320 },
  { id: 2, src: "../../images/goods_5.png", intro: "年会佳品", title: "小米智能电饭煲", price: 320 },
  { id: 3, src: "../../images/goods_6.png", intro: "年会佳品", title: "米家智能摄像头云台版", price: 320 },
  { id: 4, src: "../../images/goods_7.png", intro: "年会佳品", title: "小米智能", price: 320 }
];
var app = getApp()
Page({
  data: {
    motto: 'Hello World',
    userInfo: {},
    search: {
      placeholder: "输入搜索关键字"
    },

    giftList: giftList,
    page: 1,
    hasMore: true
  }

})




