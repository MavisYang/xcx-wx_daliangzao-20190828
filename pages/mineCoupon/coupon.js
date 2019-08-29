// coupon.js  -  优惠劵

//  useState : 使用状态  0-未使用   1-使用   2-过期
var app = getApp() ;
var couponList = [
];


Page({
  data: {
    couponList: couponList,
    isSelect: false,
    usey : true,
    total2 : 0,
    hiddenmodal: true, //弹窗
    modalCont: ''
  },

  onLoad: function (options){
    var that = this;
    var host = getApp().globalData.servsers;
    var un_id = getApp().globalData.un_id;
    console.log(un_id);

    un_id = 'oovpNwvQGE0uUqpsQrbiVigaEFM0';

    if (un_id != undefined && un_id != '' && un_id != null){
      //增加登陆优惠券（后台自动判断是否是新用户）
      wx.request({
        url: host + "mycouponapi/insertadd",
        data: {
          user_id: un_id,
          coupon_id: '1',
          batch_no: '0'
        },
        method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
        header: {
          'Accept': 'application/json'
        },
        success: function (res) {
          if (res == null || res.data == null) {
            console.error('网络请求失败');
            return;
          }
        }
      })

      wx.request({//请求回当前用户下的所有优惠劵
        url: host + "couponapi/couponall",
        data: {
          user_id: un_id,
          coupon_id: '1',
        },
        method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
        header: {
          'Accept': 'application/json'
        },
        success: function (res) {
          that.setData({
            couponList: res.data.rows
          });
          console.log(res.data.rows)
          if (res == null || res.data == null) {
            console.error('网络请求失败');
            return;
          }
        }
      });

      wx.request({//将当前优惠劵活动对应的优惠劵插入相应的用户中
        url: host + "mycouponapi/insertadd",
        data: {
          user_id: un_id,
          coupon_id: '2,3,4',
          batch_no: '1'
        },
        method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
        header: {
          'Accept': 'application/json'
        },
        success: function (res) {

          wx.request({//请求回当前用户下的所有优惠劵
            url: host + "couponapi/couponall",
            data: {
              user_id: un_id,
              coupon_id: '1',
            },
            method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
            header: {
              'Accept': 'application/json'
            },
            success: function (res) {
              that.setData({
                couponList: res.data.rows
              });
              if (res == null || res.data == null) {
                console.error('网络请求失败');
                return;
              }
            }
          })

          if (res == null || res.data == null) {
            console.error('网络请求失败');
            return;
          }
        }
      })

      //获取当前日期
      var date = new Date();
      var Y = date.getFullYear();
      var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1);
      var D = date.getDate() < 10 ? '0' + date.getDate() : date.getDate();
      var nowTime = Y + '/' + M + '/' + D;
      nowTime = nowTime.replace(/-/g, '/');
      nowTime = Date.parse(nowTime);

      var couponList = that.data.couponList;
      var listLen = couponList.length;
      for (var i = 0; i < listLen; i++) {
        var beiginTime = that.data.couponList[i].coupon_start;
        var beginTimestamp = beiginTime.replace(/-/g, '/');
        beginTimestamp = Date.parse(beginTimestamp);
        var endTime = that.data.couponList[i].coupon_stop;
        var endTimestamp = endTime.replace(/-/g, '/');
        endTimestamp = Date.parse(endTimestamp);
        if (parseInt(nowTime) > parseInt(endTimestamp)) {//已过期
          if (that.data.couponList[i].coupon_state == 0) {
            that.data.couponList[i].coupon_state = 4;
          }
        }
      }



      that.data.total2 = options.total2;
      var pages = getCurrentPages();
      var currPage = pages[pages.length - 1];  //当前页面
      var prevPage = pages[pages.length - 2]; //上一个页面
      if (prevPage.route == 'pages/mine/index') {//从"我的"进入，则没有使用状态
        that.setData({
          usey: false
        })
      }

    }

  },

  //选用优惠劵
  usrCoupon: function (e) {
    var that = this;
    var pages = getCurrentPages();
    var currPage = pages[pages.length - 1];  //当前页面
    var prevPage = pages[pages.length - 2]; //上一个页面
    var id = e.currentTarget.dataset.id;
    var youhuiLimit = that.data.couponList[id].coupon_full_money;

    //获取当前日期
    var date = new Date();
    var Y = date.getFullYear();
    var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1);
    var D = date.getDate() < 10 ? '0' + date.getDate() : date.getDate();
    var nowTime = Y + '/' + M + '/' + D;
    nowTime = nowTime.replace(/-/g, '/');
    nowTime = Date.parse(nowTime);

    var beiginTime = that.data.couponList[id].coupon_start;
    var endTime = that.data.couponList[id].coupon_stop;

    if (beiginTime == '' || beiginTime == null || beiginTime　==　undefined){
      beginTimestamp = parseInt(nowTime) + 1;
    }else{
      var beginTimestamp = beiginTime.replace(/-/g, '/');
      beginTimestamp = Date.parse(beginTimestamp);
    }

    if (endTime == '' || endTime == null || endTime 　== 　undefined) {
      endTimestamp = parseInt(nowTime) + 1;
    } else {
      var endTimestamp = endTime.replace(/-/g, '/');
      endTimestamp = Date.parse(endTimestamp);
    }

    // console.log("1:" + (parseInt(nowTime) >= parseInt(beginTimestamp)));
    // console.log("2:" + (parseInt(nowTime) <= parseInt(endTimestamp)));    
    // console.log("nowTime:" + nowTime);
    // console.log("beginTimestamp:" + beginTimestamp);
    // console.log("endTimestamp:" + endTimestamp);
    // console.log("that.data.total2:" + that.data.total2);
    // console.log("youhuiLimit:" + youhuiLimit);

    if (parseInt(nowTime) >= parseInt(beginTimestamp) && parseInt(nowTime) <= parseInt(endTimestamp) || (beiginTime == null && endTime == null)) {//限定使用时间之内
      if (parseFloat(that.data.total2) > parseFloat(youhuiLimit) || parseFloat(that.data.total2) == parseFloat(youhuiLimit)) {
        var couponName = that.data.couponList[id].coupon_rule;
        var minNum = that.data.couponList[id].coupon_cou_money;
        var total2 = parseFloat(that.data.total2);
        var newTotal = 0;
        if (total2 > minNum){

          minNum = minNum;
          newTotal = this.data.total2 - parseFloat(minNum);
        } else{
          minNum = total2 - 0.01;
          newTotal = 0.01;
        }        

        var coupon_id = that.data.couponList[id].id;

        prevPage.setData({
          minNum: minNum,//优惠金额
          couponName: couponName,
          total2: newTotal,
          coupon_id: coupon_id
        });
        wx.navigateBack({});
      }else{
        that.setData({
          hiddenmodal: false,
          modalCont: '不满足使用条件！'
        })
        setTimeout(function () {
          that.setData({
            hiddenmodal: true
          })
        }, 1500)
        var newTotal = this.data.total2;
        var couponName = '';
        var minNum = 0;
      }
    }else{
      console.log("dd")
      that.setData({
        hiddenmodal: false,
        modalCont: '不满足使用条件！'
      })
      setTimeout(function () {
        that.setData({
          hiddenmodal: true
        })
      }, 1500)
      var newTotal = this.data.total2 ;
      var couponName = '';
      var minNum = 0;
    }
    
    
  }

})