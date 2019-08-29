// pages/partnerBusinessEarnings /partnerBusinessEarnings .js
Page({

  data: {
    urlHttp: '',
    hiddenmodal: true, //提示弹窗
    year:'',//年份
    month:'',//月份

    perPersonNum: 0,//业绩指标 - 邀请客户
    perSum: 0,      //业绩指标 - 累计成交

    sharePersonNum: 0,         //累计完成 - 邀请客户
    accumulativeTotalMoney: 0, //累计完成 - 累计成交
    
    needDonePersonNum : 0, //尚需完成 - 邀请客户
    needDoneSum: 0,        //尚需完成 - 累计成交

    level : '不达标',      //提成档
    levelPercent : 0,     //提成档的提成比例
    performanceMoney : 0, //业绩提成

    
  },

  onLoad: function (options) {
    var that = this;
    var host = getApp().globalData.servsers;
    var nowYear = (new Date()).getFullYear();//系统时间年份
    var nowMonth = (new Date()).getMonth() + 1;//系统时间月份
    that.setData({
      urlHttp: host,
      year: nowYear,
      month: nowMonth
    })
  },

  getData:function(e){
    var that = this;
    var host = getApp().globalData.servsers;
    var un_id = getApp().globalData.un_id;
    var openid = getApp().globalData.openid;

    var year = that.data.year;
    var month = that.data.month < 10 ? '0' + that.data.month : that.data.month;


    var perPersonNum = that.data.perPersonNum;
    var perSum = that.data.perSum;

    var sharePersonNum = that.data.sharePersonNum;
    var accumulativeTotalMoney = that.data.accumulativeTotalMoney;

    var needDonePersonNum = that.data.needDonePersonNum;
    var needDoneSum = that.data.needDoneSum;

    var level = that.data.level;       //提成档
    var levelPercent = that.data.levelPercent; //提成档的提成比例
    var performanceMoney = that.data.performanceMoney;//业绩提成

    //获取用户当前考核指标信息
    wx.request({
      url: host + "api/distributeSell/getPerformanceIndexInfo",
      data: {
        userId: un_id,     //当前用户userId
        date: year + '-' + month,  //用户角色
      },
      method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      header: {
        'Accept': 'application/json'
      },
      success: function (res) {
        console.log(res);
        if (res.data.code == '200') {

          var passPersonNum = parseInt(res.data.data.rule.passPersonNum);   //达标 - 业绩指标 - 邀请客户   1
          var passSum = parseInt(res.data.data.rule.passSum);         //达标 - 业绩指标 - 累计成交         100
          var passSharePoint = parseInt(res.data.data.rule.passSharePoint);  //达标 - 提成档              5

          var excellentPersonNum = parseInt(res.data.data.rule.excellentPersonNum);   //优秀 - 业绩指标 - 邀请客户  2
          var excellentSum = parseInt(res.data.data.rule.excellentSum);               //优秀 - 业绩指标 - 累计成交  1000
          var excellentSharePoint = parseInt(res.data.data.rule.excellentSharePoint); //优秀 - 提成档              10

          var sharePersonNum = parseInt(res.data.data.sharePersonNum);        //累计完成 - 邀请客户           2
          var accumulativeTotalMoney = parseInt(res.data.data.accumulativeTotalMoney);//累计完成 - 累计成交   698


          if ((sharePersonNum < passPersonNum || accumulativeTotalMoney < passSum) ){

            perPersonNum = passPersonNum; //业绩指标 - 邀请客户
            perSum = passSum;       //业绩指标 - 累计成交
            level = '不达标';
            levelPercent = 0;
            performanceMoney = 0;
            needDonePersonNum = passPersonNum - sharePersonNum;
            needDoneSum = passSum - accumulativeTotalMoney;
          }else if (sharePersonNum >= excellentPersonNum && accumulativeTotalMoney >= excellentSum) {

            perPersonNum = excellentPersonNum; //业绩指标 - 邀请客户
            perSum = excellentSum;       //业绩指标 - 累计成交
            needDonePersonNum = 0;
            needDoneSum = 0;
            level = '优秀';
            levelPercent = excellentSharePoint;
            performanceMoney = accumulativeTotalMoney * excellentSharePoint / 100;

          }else {

            perPersonNum = excellentPersonNum; //业绩指标 - 邀请客户
            perSum = excellentSum;       //业绩指标 - 累计成交

            if (sharePersonNum < excellentPersonNum){
              needDonePersonNum = excellentPersonNum - sharePersonNum;
            }else{
              needDonePersonNum = 0;
            }

            if (accumulativeTotalMoney < excellentSum){
              needDoneSum = excellentSum - accumulativeTotalMoney;
            }else{
              needDoneSum = 0;
            }
            level = '达标';
            levelPercent = passSharePoint;
            performanceMoney = accumulativeTotalMoney * passSharePoint / 100;

          }

          that.setData({
            perPersonNum: perPersonNum,
            perSum: perSum,
            sharePersonNum: sharePersonNum,
            accumulativeTotalMoney: accumulativeTotalMoney,
            needDonePersonNum: needDonePersonNum,
            needDoneSum: needDoneSum,
            level: level,
            levelPercent: levelPercent,
            performanceMoney: performanceMoney,
          })

        }
        if (res == null || res.data == null) {
          console.error('网络请求失败');
          return;
        }
      }
    })
  },


  onShow: function () {
    var that = this;
    that.getData();
  },

  //查看成交记录
  monthRecord:function(e){
    var that = this;
    var tabId = 0;
    var year = e.currentTarget.dataset.year;
    var month = e.currentTarget.dataset.month;
    wx.navigateTo({
      url: '/pages/partnerBusinessRecord/partnerBusinessRecord?year=' + year + '&month=' + month,
    })

  },

  //上一个月的记录
  monthPre: function (e) {
    var that = this;
    var month = that.data.month;
    var year = that.data.year;
    if (month > 1) {
      month--;
    } else {
      month = 12;
      year--;
    }
    that.setData({
      month: month,
      year: year
    })
    that.getData();
  },

  //下一个月的记录
  monthN: function (e) {
    var that = this;
    var nowMonth = (new Date()).getMonth() + 1;//系统时间月份
    var month = that.data.month;
    var year = that.data.year;

    if (month < 12 && month < nowMonth) {
      month++;
    } else if (month == 12) {
      month = 1;
      year++;
    }
    that.setData({
      month: month,
      year: year
    })
    that.getData();
  },

  //累计完成 - 进入详情页
  recordInfor:function(e){
    var that = this;
    var tabId = e.currentTarget.dataset.id;
    var year = that.data.year;
    var month = that.data.month;
    wx.navigateTo({
      url: '/pages/partnerBusinessRecord/partnerBusinessRecord?year=' + year + '&month=' + month + '&tabId=' + tabId,
    })
  },


  //邀请好友 - 页面分享
  onShareAppMessage: function (res) {
    var that = this;
    var host = getApp().globalData.servsers;
    var un_id = getApp().globalData.un_id;
    var fromUserPhoto = getApp().globalData.userInfo.avatarUrl;
    var fromUserName = getApp().globalData.userInfo.nickName;
    var fromUserRole = getApp().globalData.userRole;

    if (res.from === 'button') {
      // 来自页面内转发按钮
    }
    return {
      title: that.data.title,
      path: '/pages/partnerShare/partnerShare?fromUserId=' + un_id + '&fromUserPhoto=' + fromUserPhoto + '&fromUserName=' + fromUserName + '&fromUserRole=' + fromUserRole,
      imageUrl: '/images/share_img.jpg',
      success: function (res) {
        // 转发成功
        that.setData({
          hiddenmodal: false,
          modalCont: '分享成功'
        })
        setTimeout(function () {
          that.setData({
            hiddenmodal: true
          })
        }, 1000)
      },
      fail: function (res) {
        // 取消分享、转发失败
      }
    }
  },

})