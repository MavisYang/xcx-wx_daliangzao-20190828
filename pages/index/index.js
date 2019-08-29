//index.js
//获取应用实例
var app = getApp();
var coupon = [
  {
    coupon_monry : '1000',
    coupon_rule : '9999',
    coupon_name: '新年专属红包',
    coupon_begin_time: '2018-01-01',
    coupon_end_time: '2018-02-08'
  },
  {
    coupon_monry: '300',
    coupon_rule: '4999',
    coupon_name: '新年专属红包',
    coupon_begin_time: '2018-01-01',
    coupon_end_time: '2018-02-08'
  },
  {
    coupon_monry: '50',
    coupon_rule: '999',
    coupon_name: '新年专属红包',
    coupon_begin_time: '2018-01-01',
    coupon_end_time: '2018-02-08'
  }
];


Page({
  data: {
    urlHttp: '',
    host : '',
    scrollLeft: 0,//tab标题的滚动条位置
    search:{
      placeholder:"输入搜索关键字"
    },
    navList:["推荐","中秋","改良生活","优化办公","智能科技"],
    firstActive: "header_nav_active",
    currentItem : '',
    flag:true,
    banners: [],
    rexiao: [],
    tuijian: [],
    tuijiannew: [],
    forviewFir: [],
    forviewSec: [],
    forviewtitele: '',
    title1: '',
    title2: '',
    title3: '',
    intro1: '',
    intro2: '',
    intro3: '',
    id1: '',
    id2: '',
    id3: '',
    src1: '',
    src2: '',
    src3: '',
    src4: '',
    src5: '',
    src6: '',
    price1: '',
    price2: '',
    price3: '',
    host: '',
    idTwo: '',
    find_name: '',
    find_id: '',
    find_logo: '',
    find_yuedu: '',
    find_shoucang: '',
    datatime: new Date().getTime(),
    
    city_name: '',
    jingpin: {// 发现精品
      id: 1, src: "../../images/jingxuan_banner.jpg", title: "各星座员工生日礼品如何选", liulan: 117, zan: 34
    },
    page: 1,
    hasMore: true,
    hidden : '',
    winHeight: "",//窗口高度
    coupon: coupon, //优惠劵
    showCoupon : false,
    couponSta : 0,//对于用户来说，是否是第一次显示
    un_id : '',
    showMsg : true,  //显示切换模式提示
    showChangeModel : false,  //显示切换模式确认弹窗
    bannerFlag : 0  //banner数量
  },

  //tab切换
  tagChoose: function (options) {
    var that = this
    var name = options.currentTarget.dataset.name;
    var des = options.currentTarget.dataset.des;
    var forid = options.currentTarget.dataset.forid;
    wx:wx.navigateTo({
      url: '/pages/kindSecondList/kindSecondList?classify_name=' + name + '&classify_des=' + des + '&id=' + forid
    })
  },

  // 滚动切换标签样式
  switchTab: function (e) {
    var that = this;
    var host = getApp().globalData.servsers;
    var current = e.detail.current;
    if (e.detail.current == 0){
      var forid = 0;
    }else{
      var forid = that.data.navList[e.detail.current - 1].id;
      var forname = that.data.navList[e.detail.current - 1].classify_name;
      var classifydes = that.data.navList[e.detail.current - 1].classify_des;
    }
    
    this.setData({
      currentItem: e.detail.current
    })
    if (forid > 0) {
      wx.request({
        url: that.data.host + "classifyapi/findAllforviewFir",
        data: {
          id: forid
        },
        method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT flag: true,
        header: {
          'Accept': 'application/json'
        },
        success: function (res) {
          wx.request({
            url: that.data.host + "commodityapi/findOneforxcx",
            data: {
              com_id: forid,
            },
            method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT flag: true,
            header: {
              'Accept': 'application/json'
            },
            success: function (res) {
              that.setData({
                tuijiannew: res.data.rows

              });
              if (res == null || res.data == null) {
                console.error('网络请求失败');
                return;
              }
            }
          });
          that.setData({
            forviewFir: res.data.rows,
            forviewtitele: res.data.rows[0].classify_des,
            'firstActive': "",
            flag: false,
          });
          if (res == null || res.data == null) {
            console.error('网络请求失败');
            return;
          }
        }
      });

    } else {

      //设置当前样式
      that.setData({
        'firstActive': "",
        'currentItem':0,
        flag: true,
      })
    }
    that.checkCor();
  },
  checkCor: function () {
    if (this.data.currentItem > 2) {
      this.setData({
        scrollLeft: 300
      })
    } else {
      this.setData({
        scrollLeft: 0
      })
    }
  },

  onLoad: function () {
    var that = this;
    var host = getApp().globalData.servsers;
    var un_id = getApp().globalData.un_id;
    that.setData({
      urlHttp : host
    })
    //首页banner
    wx.request({
      url: host+"homebannerapi/homebannerall",
      data: {},
      method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      header: {
        'Accept': 'application/json'
      },
      success: function (res) {
        that.setData({
          banners: res.data.rows,
          host: host
        });
        console.log(res.data.rows);
        //判断banner位置是否为空
        for (var i = 0; i < res.data.rows.length;i++){
          var bannerFlag = that.data.bannerFlag;
          if (bannerFlag > 0){
            return false;
          }else{
            if (res.data.rows[i].banner_flag == 0) {
              bannerFlag++;
              that.setData({
                bannerFlag: bannerFlag
              })
              return false;
            }
          } 
        }
        //console.log(that.data.banners);
        if (res == null || res.data == null) {
          console.error('网络请求失败');
          return;
        }
      }
    });
    

    //品牌定制
    wx.request({
      url: host + "brandapi/findforfirst",
      data: {},
      method: 'GET', 
      header: {
        'Accept': 'application/json'
      },
      success: function (res) {
        if (res.data.rows[0] == undefined) {
          that.setData({
            hidden: 'hidden'
          })
        }else{
          var img = res.data.rows[0].brand_logo;
          that.setData({
            title1: res.data.rows[0].brand_name,
            intro1: res.data.rows[0].brand_des,
            src1: res.data.rows[0].brand_logo,
            src4: res.data.rows[0].brand_logo1,
            price1: res.data.rows[0].price,
            id1: res.data.rows[0].id,
          });
        }

        if (res.data.rows[1] == undefined) {
          // that.setData({
          //   hidden: 'hidden'
          // })
        } else {
          var img = res.data.rows[0].brand_logo;
          that.setData({
            title2: res.data.rows[1].brand_name,
            intro2: res.data.rows[1].brand_des,
            src2: res.data.rows[1].brand_logo,
            src5: res.data.rows[1].brand_logo1,
            price2: res.data.rows[1].price,
            id2: res.data.rows[1].id,
          });
        }

        if (res.data.rows[2] == undefined) {
          // that.setData({
          //   hidden: 'hidden'
          // })
        } else {
          var img = res.data.rows[0].brand_logo;
          that.setData({   
            title3: res.data.rows[2].brand_name,
            intro3: res.data.rows[2].brand_des,
            src3: res.data.rows[2].brand_logo,
            src6: res.data.rows[2].brand_logo1,
            price3: res.data.rows[2].price,
            id3: res.data.rows[2].id,
          });
        }
        if (res == null || res.data == null) {
          console.error('网络请求失败');
          return;
        }
      }
    })

    //  高度自适应
    wx.getSystemInfo({
      success: function (res) {
        var clientHeight = res.windowHeight,
          clientWidth = res.windowWidth,
          rpxR = 750 / clientWidth;
        var calc = clientHeight * rpxR;
        that.setData({
          winHeight: calc
        });
      }
    });
  },

  onReady:function(e){
    var that = this;
    var host = getApp().globalData.servsers;

    //判断时间，在规定时间内显示优惠劵弹窗
    var beiginTime = '2017/12/28';
    var endTime = '2018/01/08';
    var beginTimestamp = beiginTime.replace(/-/g, '/');
    beginTimestamp = Date.parse(beginTimestamp);
    var endTimestamp = endTime.replace(/-/g, '/');
    endTimestamp = Date.parse(endTimestamp);

    //获取当前日期
    var date = new Date();
    var Y = date.getFullYear();
    var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1);
    var D = date.getDate() < 10 ? '0' + date.getDate() : date.getDate();
    var nowTime = Y + '/' + M + '/' + D;
    nowTime = nowTime.replace(/-/g, '/');
    nowTime = Date.parse(nowTime);

    wx.login({
      success: function (res) {
        var code = res.code;
        wx.getUserInfo({
          withCredentials: true,
          success: function (res) {
            wx.request({
              url: host + "userapi/insertadd",
              data: {
                user_id: code,
                name: res.userInfo.nickName,
                icon: res.userInfo.avatarUrl,
                iv: res.iv,
                encryptedData: res.encryptedData,
              },
              method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
              header: {
                'Accept': 'application/json'
              },
              success: function (res) {
                that.setData({
                  un_id: res.data.unionId
                })
                var un_id = res.data.unionId;

                if (parseInt(nowTime) >= parseInt(beginTimestamp) && parseInt(nowTime) <= parseInt(endTimestamp)) {//当前日期在优惠劵领取时间内
                  console.log("un_id:" + un_id);
                  if (un_id != undefined && un_id != '' && un_id != null){
                      wx.request({//优惠活动-对于用户来说，是否应该显示
                        url: host + "mycouponapi/getAlertFlag",
                        data: {
                          user_id: un_id,
                          batch_no: 1,
                          alert_num: 1//优惠活动对于每个用户来说，一共显示的次数
                        },
                        method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
                        header: {
                          'Accept': 'application/json'
                        },
                        success: function (res) {
                          if (res.data == 0) {
                            that.setData({
                              showCoupon: true
                            })
                          } else {
                            that.setData({
                              showCoupon: false
                            })
                          }

                          if (res == null || res.data == null) {
                            console.error('网络请求失败');
                            return;
                          }
                        }
                      });
                  }
                  
                }
                if (res == null || res.data == null) {
                  console.error('网络请求失败');
                  return;
                }
              }
            })
          }
        })
      }
    })
 
  },

  footerTap: app.footerTap,

  onShow:function(){
    var that = this;
    that.onLoad();  
  },

  //跳转到“发现”tab页
  find:function(e){
    wx.switchTab({
      url : "/pages/find/index"
    })
  },
  //下拉刷新
  onPullDownRefresh: function (e) {
    var that = this;
    that.onLoad();
    wx.stopPullDownRefresh();
  },
  onShareAppMessage: function (res) {//页面分享
    var that = this;
    var host = getApp().globalData.servsers;
    if (res.from === 'button') {
      // 来自页面内转发按钮
      console.log(res.target)
    }
    return {
      title:'大良造-精良之选,用心造物！',
      path: '/pages/index/index',
      success: function (res) {
      
      },
      fail: function (res) {
        // 转发失败
      }
    }
  },
  //关闭优惠劵弹窗
  closeCoupon:function(e){
    var that = this;
    that.setData({
      showCoupon : false
    })
  },

  //关闭切换模式提示
  closeMsg:function(e){
    var that = this;
    that.setData({
      showMsg : false
    })
  },

  //打开切换提示
  openChangeModel:function(e){
    var that = this;
    that.setData({
      showMsg: false,
      showChangeModel: true
    })
  },

  //跳转至一键选礼
  goChooseGift:function(e){
    var that = this;
    that.setData({
      showChangeModel : false
    })
    wx.navigateTo({
      url: '/pages/patternMenu/patternMenu'
    })
  },

  //关闭切换模式确认弹窗
  closeChangeModel:function(e){
    var that = this;
    that.setData({
      showChangeModel: false
    })
  }

})

var banners = []

// 热销新品
var rexiao = []

// 热销新品
var pinpai = []

// 人气推荐
var tuijian = []
var that;
var Util = require('../../utils/util.js'); 