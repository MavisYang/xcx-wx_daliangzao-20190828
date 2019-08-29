// pages/bindingPhone/bindingPhone.js
var app = getApp();
Page({

  data: {
    user_phone:'',//绑定的手机号码
    code:'',//验证码
    oldCode :　'',//短信验证码
    userName:'',//联系人
    userTelephone:'',//手机号码
    hiddenmodal: true, //弹窗
    modalCont: '',//提示内容
    prevPageUrl:'',//上一个页面的地址
    codeCont:'获取验证码',
    time_nun:'',//获取验证码后的样式
    wait:60,//倒计时时间
  },

  
  onLoad: function (options) {
    var that = this;
    var host = getApp().globalData.servsers;
    var un_id = getApp().globalData.un_id;
    var pages = getCurrentPages();
    var currPage = pages[pages.length - 1];  //当前页面
    var prevPage = pages[pages.length - 2]; //上一个页面
    var prevPageUrl = '';
    if (prevPage != undefined) {
      that.setData({
        prevPageUrl: prevPage.route
      })
    }
    
  },

  userNameInput: function (e) {
    this.setData({
      userName: e.detail.value
    })
  },
  userTelephoneInput: function (e) {
    this.setData({
      userTelephone: e.detail.value
    })
  },
  codeInput:function(e){
    this.setData({
      code: e.detail.value
    })
  },

  //获取验证码
  checkYanzhengma:function(){

    var that = this;
    var host = getApp().globalData.servsers;
    var un_id = getApp().globalData.un_id;
    var userName = that.data.userName;
    var userTelephone = that.data.userTelephone;
    var code = that.data.code;

    var codeCont = that.data.codeCont;
    if (codeCont != '获取验证码'){
      return false;
    }

    if (userTelephone == '') {
      that.setData({
        hiddenmodal: false,
        modalCont: '请填写手机号'
      })
      setTimeout(function () {
        that.setData({
          hiddenmodal: true
        })
      }, 1000)
      return false;
    } 

    if (!checkMobile(that)) {
      that.setData({
        hiddenmodal: false,
        modalCont: '请输入正确的手机号'
      })
      setTimeout(function () {
        that.setData({
          hiddenmodal: true
        })
      }, 1000)
      return false;
    }

    wx.request({
      url: host + 'commodityapi/sendCode',
      data: {
        user_phone: userTelephone
      },
      method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      header: {
        'Accept': 'application/json'
      },
      success: function (data) {
        if (data.data == "0") {
          that.setData({
            hiddenmodal: false,
            modalCont: '该手机号已被使用！'
          })
          setTimeout(function () {
            that.setData({
              hiddenmodal: true
            })
          }, 1000)
          return false;
        } else if (data.data == '1') {

          that.setData({
            hiddenmodal: false,
            modalCont: '验证码发送失败！'
          })
          setTimeout(function () {
            that.setData({
              hiddenmodal: true
            })
          }, 1000)
          return false;

        } else {
          that.setData({
            oldCode: data.data
          })
          that.time(that);
        }
      }
    })

    
  },

  //绑定手机
  bangdingFun:function(){
    var that = this;
    var pages = getCurrentPages();
    var currPage = pages[pages.length - 1];  //当前页面
    var prevPage = pages[pages.length - 2]; //上一个页面
    var host = getApp().globalData.servsers;
    var un_id = getApp().globalData.un_id;
    var userName = that.data.userName;
    var userTelephone = that.data.userTelephone;
    var code = that.data.code;
    var oldCode = that.data.oldCode;
    var prevPageUrl = that.data.prevPageUrl;

    if (userName == '') {
      that.setData({
        hiddenmodal: false,
        modalCont: '请填写联系人'
      })
      setTimeout(function () {
        that.setData({
          hiddenmodal: true
        })
      }, 1000)
      return false;
    } 

    if (userTelephone == '') {
      that.setData({
        hiddenmodal: false,
        modalCont: '请填写手机号'
      })
      setTimeout(function () {
        that.setData({
          hiddenmodal: true
        })
      }, 1000)
      return false;
    } 

    if (code == '') {
      that.setData({
        hiddenmodal: false,
        modalCont: '请填写验证码'
      })
      setTimeout(function () {
        that.setData({
          hiddenmodal: true
        })
      }, 1000)
      return false;
    } 

    console.log("oldCode:" + oldCode);
    console.log("code:" + code);

    if (oldCode != code){
      that.setData({
        hiddenmodal: false,
        modalCont: '验证码错误，请重新输入'
      })
      setTimeout(function () {
        that.setData({
          hiddenmodal: true,
          code : ''
        })
      }, 1000)
      return false;
    }


    if (un_id != undefined && un_id != '' && un_id != null){
      wx.request({
        url: host + 'commodityapi/bindingPhone',
        data:{
          user_phone: userTelephone, 
          user_id: un_id, 
          user_name: userName 
        },
        method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
        header: {
          'Accept': 'application/json'
        },
        success: function (data) {
          console.log(data);
          if (data == "0") {
            that.setData({
              hiddenmodal: false,
              modalCont: '操作失败,请重试！'
            })
            setTimeout(function () {
              that.setData({
                hiddenmodal: true
              })
            }, 1000)
            return false;
           
          } else {
            that.setData({
              hiddenmodal: false,
              modalCont: '绑定成功'
            })
            setTimeout(function () {
              that.setData({
                hiddenmodal: true
              })
              prevPage.setData({
                user_phone: userTelephone
              })
              wx.navigateBack({
                delta: 1
              })
            }, 1500)
            return false;
          }
        }
      })
    }

  },

  //倒计时
  time:function(){
    var that = this;
    var wait = that.data.wait;
    if (wait == 0) {
      that.setData({
        codeCont: '获取验证码',
        oldCode:'',
        wait : 60
      })
    }else{
      that.setData({
        codeCont: wait + '秒'
      })
      wait--;
      that.setData({
        wait: wait
      })
      setTimeout(function () { that.time(that) }, 1000)
    }
  },

  //跳过
  jumpBinding:function(e){
    var that = this;
    var pages = getCurrentPages();
    var currPage = pages[pages.length - 1];  //当前页面
    var prevPage = pages[pages.length - 2]; //上一个页面
    prevPage.setData({
      user_phone:1
    })
    wx.navigateBack({
      delta: 1
    })
    //调用支付页面的支付方法
    prevPage.save();
  }
})

//验证电话  
function checkMobile(that) {
  var userTelephone = that.data.userTelephone;;
  if (trim(userTelephone) != "") {
    var regu = /^[1][3-9][0-9]{9}$/;
    var re = new RegExp(regu);
    if (re.test(userTelephone)) {
      return true;
    } else {
      return false;
    }
  }
}
function trim(str) { //删除左右两端的空格  
  return str.replace(/(^\s*)|(\s*$)/g, "");
}  