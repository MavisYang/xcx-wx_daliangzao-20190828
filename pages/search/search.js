// search.js
var touchDot = 0;//触摸时的原点  
var time = 0;// 时间记录，用于滑动时且时间小于1s则执行左右滑动  
var interval = "";// 记录/清理时间记录
Page({
  data: {
    wordClick : false,
    searchValue : '',
    searchList:[],
    logoList:[
      { 
        logoUrl: '/pages/brandInfor/brandInfor?title=Moleskine&intro=传奇笔记本&src=https://www.daliangzao.net/images/1513653278658_Moleskine-2.jpg&src1=https://www.daliangzao.net/images/1513653278658_Moleskine-2.jpg&id=2991', 
        logoSrc: 'https://www.daliangzao.net/images/searchLogo/search_logo_1.png'
      },
      { 
        logoUrl: '/pages/brandInfor/brandInfor?title=凌美&intro=唤醒书写的记忆&src=https://www.daliangzao.net/images/1513653080002_Lamy-2.jpg&src1=https://www.daliangzao.net/images/1513653080002_Lamy-2.jpg&id=3023', 
        logoSrc: 'https://www.daliangzao.net/images/searchLogo/search_logo_2.png' 
      },
      { 
        logoUrl: '/pages/brandInfor/brandInfor?title=哲品&intro=东方生活品牌&src=https://www.daliangzao.net/images/1513653110782_哲品-2.jpg&src1=https://www.daliangzao.net/images/1513653110782_哲品-2.jpg&id=3030', 
        logoSrc: 'https://www.daliangzao.net/images/searchLogo/search_logo_3.png' 
      },
      { 
        logoUrl: '/pages/brandInfor/brandInfor?title=Foreo&intro=美容护肤新革命&src=https://www.daliangzao.net/images/1513652834541_Foreo-2.jpg&src1=https://www.daliangzao.net/images/1513652834541_Foreo-2.jpg&id=3011', 
        logoSrc: 'https://www.daliangzao.net/images/searchLogo/search_logo_4.png' 
      },
      { 
        logoUrl: '/pages/brandInfor/brandInfor?title=Best-Life百灵&intro=遇见更好的自己&src=https://www.daliangzao.net/images/1513652716420_Best-Life百灵-2.jpg&src1=https://www.daliangzao.net/images/1513652716420_Best-Life百灵-2.jpg&id=3008', 
        logoSrc: 'https://www.daliangzao.net/images/searchLogo/search_logo_5.png' 
      },
      { 
        logoUrl: '/pages/brandInfor/brandInfor?title=Cutipol&intro=来自葡萄牙的纯手工厨具&src=https://www.daliangzao.net/images/1513652786108_Cutipol-2.jpg&src1=https://www.daliangzao.net/images/1513652786108_Cutipol-2.jpg&id=3010', 
        logoSrc: 'https://www.daliangzao.net/images/searchLogo/search_logo_6.png' 
      },
      { 
        logoUrl: '/pages/brandInfor/brandInfor?title=BOSE&intro=享音乐之极&src=https://www.daliangzao.net/images/1513652743364_Bose-2.jpg&src1=https://www.daliangzao.net/images/1513652743364_Bose-2.jpg&id=3003', 
        logoSrc: 'https://www.daliangzao.net/images/searchLogo/search_logo_7.png' 
      },
      { 
        logoUrl: '/pages/brandInfor/brandInfor?title=B&O&intro=B&O&src=https://www.daliangzao.net/images/1513645951531_B&O-2.jpg&src1=https://www.daliangzao.net/images/1513645951531_B&O-2.jpg&id=3004', 
        logoSrc: 'https://www.daliangzao.net/images/searchLogo/search_logo_8.png' 
      },
      { 
        logoUrl: '/pages/brandInfor/brandInfor?title=PUEBCO&intro=工业风家品&src=https://www.daliangzao.net/images/1513653187662_PUEBCO-2.jpg&src1=https://www.daliangzao.net/images/1513653187662_PUEBCO-2.jpg&id=3019', 
        logoSrc: 'https://www.daliangzao.net/images/searchLogo/search_logo_9.png' 
      },
      { 
        logoUrl: '/pages/brandInfor/brandInfor?title=CORKCICLE&intro=来自美国佛罗里达&src=https://www.daliangzao.net/images/1513652765187_CORKCICLE-2.jpg&src1=https://www.daliangzao.net/images/1513652765187_CORKCICLE-2.jpg&id=3009', 
        logoSrc: 'https://www.daliangzao.net/images/searchLogo/search_logo_10.png' 
      },
      { 
        logoUrl: '/pages/brandInfor/brandInfor?title=JORDAN&JUDY&intro=以创新设计为基点的时尚生活品牌&src=https://www.daliangzao.net/images/1513652927301_JORDAN&JUDY佐敦朱迪-2.jpg&src1=https://www.daliangzao.net/images/1513652927301_JORDAN&JUDY佐敦朱迪-2.jpg&id=3015', 
        logoSrc: 'https://www.daliangzao.net/images/searchLogo/search_logo_11.png' 
      },
      { 
        logoUrl: '/pages/brandInfor/brandInfor?title=ALLYO+&intro=专注生产研发&src=https://www.daliangzao.net/images/1513645926762_ALLOY-2.jpg&src1=https://www.daliangzao.net/images/1513645926762_ALLOY-2.jpg&id=3006', 
        logoSrc: 'https://www.daliangzao.net/images/searchLogo/search_logo_12.png' 
      }
    ]
  },
  onLoad: function () {
    var that = this;
    var host = getApp().globalData.servsers;

    wx.request({
      url: host +"keywordapi/keywordallxcx",
      data: {},
      method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      header: {
        'Accept': 'application/json'
      },
      success: function (res) {
        that.setData({
          searchList: res.data.rows,
        });
        if (res == null || res.data == null) {
          console.error('网络请求失败');
          return;
        }
      }
    })
  },
  inputSearch:function(e){
    this.setData({
      searchValue: e.detail.value
    }) 
  },

  cancelVal:function(e){
    this.setData({
      searchValue: '',
    })
    wx.navigateBack();   //返回上一个页面
  },

  searResult:function(e){
    let data;
    let localStorageValue = [];
    if (this.data.searchValue != '') {

      //调用API从本地缓存中获取数据  
      var searchData = wx.getStorageSync('searchData') || []
      searchData.push(this.data.inputValue)
      wx.setStorageSync('searchData', searchData)
      wx.redirectTo({
        url: '/pages/searchList/searchList?commodity_name=' + this.data.searchValue
      })
    } else {
      console.log('6666');
      wx.redirectTo({
        url: '/pages/searchList/searchList'
      })
    }  



  },

  writeVal:function(e){//点击热搜词后
    var that = this; 
    var thisVal = e.currentTarget.dataset.val;
    that.setData({
      wordClick : true,
      'searchValue': thisVal
    })
    wx.navigateTo({
      url: '/pages/searchList/searchList?commodity_name=' + thisVal,
      success:function(){
        that.setData({
          wordClick: false
        })
      }
    })
  },

  // 触摸开始事件  
  touchStart: function (e) {
    touchDot = e.touches[0].pageX; // 获取触摸时的原点  
   
    interval = setInterval(function () {
      time++;
    }, 100);
  },  
  // 触摸移动事件  
  touchMove: function (e) {
    var touchMove = e.touches[0].pageX;
    console.log("touchMove:" + touchMove + " touchDot:" + touchDot + " diff:" + (touchMove - touchDot));
    // 向左滑动    
    if (touchMove - touchDot <= -40 && time < 10) {
      wx.switchTab({
        url: '/pages/index/index'
      });
    }
    // 向右滑动  
    if (touchMove - touchDot >= 40 && time < 10) {
      console.log('向右滑动');
      wx.switchTab({
        url: '/pages/index/index'
      });
    }
  },
  // 触摸结束事件  
  touchEnd: function (e) {
    clearInterval(interval); // 清除setInterval  
    time = 0;
  }
})
var that;
var Util = require('../../utils/util.js'); 