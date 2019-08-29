// pages/invoiceInfor/invoiceInfor.js

var invoiceContList = ["日用品", "家居用品", "食品", "酒/饮料", "服饰","化妆品"];
var invoiceTypeList = ["纸质普通发票","增值税专用发票"];
var invoiceList = [];
Page({

  data: {

    invoiceTypeFlag: 0,//发票类型标志值(记录最后一次保存时的状态)
    invoiceType : "", //发票类型
    invoiceTypeName : '',
    isClick : 0,
    invoiceTitle : '',//个人发票抬头
    condition : false,//发票内容选择开关
    conditionType : false, //发票类型选择开关
    condBg : false,
    contNum : 0,
    invoiceContList: invoiceContList,
    invoiceCont: '明细',//默认发票内容
    contTypeNum : 0,
    invoiceTypeList: invoiceTypeList,
    invoiceTypeList: invoiceTypeList[0],//默认发票类型

    price:0,//金额
    takeName : '',//收货姓名
    takeTelphone : '',//收货人联系方式
    takeAddress : '',//收货人地址

    //所有input值
    userName: "", //请输入个人或姓名'
    companyName: "",//请输入单位名称
    sbNum: "",//纳税人识别号
    address: "",//注册地址
    telphone: "",//注册电话
    brandName: "",//开户银行
    brandNum: "",//银行账户
    // takeName: '',//发票收货人
    // takeTelphone: '',//发票收货人联系方式
    // takeAddress: '',//发票收货地址
    invoiceInfor : [], //发票回值数组
    hiddenmodal: true, //弹窗
    modalCont: '',
    invoiceList: invoiceList,
    invoiceData : [],  //加载时接收数组
    hidden : false,
    province: '',
    city: '',
    area: '',
    adress: '',
    consignee: '',
    phone: '',
  },

  onLoad: function (options){
    var that = this;
    that.data.price = options.total1;
    that.setData({
      price: options.total1
    }) 
    var host = getApp().globalData.servsers;
    var un_id = getApp().globalData.un_id;

    if (un_id != undefined && un_id != '' && un_id != null){
      //查询是否有默认地址，如有则直接返回默认地址所有信息
      wx.request({
        url: host + "adressapi/adressview",//收货地址
        data: {
          user_id: un_id
        },
        method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
        header: {
          'Accept': 'application/json'
        },
        success: function (res) {
          that.setData({
            addressAll: res.data.rows
          });
          var len = that.data.addressAll.length;
          for (var i = 0; i < len; i++) {
            if (that.data.addressAll[i].adress_flag == 1) {
              that.setData({
                consignee: that.data.addressAll[i].consignee,
                phone: that.data.addressAll[i].phone,
                province: that.data.addressAll[i].province,
                city: that.data.addressAll[i].city,
                area: that.data.addressAll[i].area,
                adress: that.data.addressAll[i].adress
              })
            }
          }
          if (res == null || res.data == null) {
            console.error('网络请求失败');
            return;
          }
          wx.hideNavigationBarLoading(//加载完成后显示页面
            that.setData({
              hidden: ''
            })
          )
        }
      });

      wx.request({
        url: host + "invoiceapi/adressview",
        data: {
          //user_id: getApp().globalData.open_id,
          user_id: un_id,
          // getApp().globalData.open_id
          // 'op1_x0EUt7BWyNwip4PI8q8e_2ek'
        },
        method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
        header: {
          'Accept': 'application/json'
        },
        success: function (res) {
          that.setData({
            invoiceData: res.data.rows
          })
          if (res.data.rows.length > 0) {
            wx.showNavigationBarLoading(
              that.setData({
                hidden: true
              })
            )
            var dataLength = res.data.rows.length;
            that.setData({
              userName: res.data.rows[0].invoice_name, //请输入个人或姓名'
              companyName: res.data.rows[0].invoice_company_name,//请输入单位名称
              sbNum: res.data.rows[0].invoice_number,//纳税人识别号
              address: res.data.rows[0].invoice_address,//注册地址
              telphone: res.data.rows[0].invoice_telphone,//注册电话
              brandName: res.data.rows[0].invoice_brandName,//开户银行
              brandNum: res.data.rows[0].invoice_brandNum,//银行账户
              invoiceCont: '明细',//纸质发票内容
              price: that.data.price,//金额
              invoiceTypeFlag: res.data.rows[0].invoice_flag
            })
            var flag = that.data.invoiceTypeFlag;
            if (flag == 0) {//纸质 - 个人
              that.setData({
                isClick: 0,
                contTypeNum: 0
              })
            } else if (flag == 1) {//纸质 - 单位
              that.setData({
                isClick: 1,
                contTypeNum: 0
              })
            } else {
              that.setData({
                isClick: 1,
                contTypeNum: 1
              })
            }

          }
          if (res == null || res.data == null) {
            console.error('网络请求失败');
            return;
          }
          wx.hideNavigationBarLoading(
            that.setData({
              hidden: false
            })
          )
        }
      })

    }
    
    // that.setData({
    //   takeName: options.consignee,
    //   takeTelphone: options.phone,
    //   takeAddress: options.province + options.city + options.area + options.adress
    // })
    
  },

  titleClick: function (options){
    var that = this;
    var id = options.currentTarget.dataset.id;
    that.setData({
      isClick : id,
      invoiceTypeFlag : id
    })
  },

  contShow:function(e){
    var that = this;
    that.setData({
      condition: !that.data.condition,
      condBg: !that.data.condBg
    })
  },

  typeopen:function(){
    var that = this;
    that.setData({
      conditionType: !that.data.conditionType,
      condBg: !that.data.condBg
    })
  },

  //选择发票内容
  invoiceContChoose: function (options){
    var that = this;
    var id = options.currentTarget.dataset.id;
    that.setData({
      contNum: id
    })
  },
  //选择发票内容-确定
  invoiceContSure: function(options){
    var that = this;
    var id = options.currentTarget.dataset.id;
    that.setData({
      contNum: id,
      invoiceCont: invoiceContList[id],
      condition: !that.data.condition,
      condBg: false
    })
  },
  //选择发票类型
  invoiceTypeChoose: function (options){
    var that = this;
    var id = options.currentTarget.dataset.id;
    that.setData({
      contTypeNum: id
    })
  },
  //选择发票类型-确定
  invoiceTypeSure: function (options){
    var that = this;
    var id = options.currentTarget.dataset.id;
    var isClick = that.data.isClick;
    if (id == 0 && isClick == 0) {
      that.setData({
        contTypeNum: 0,
        invoiceTypeFlag: 0,
        conditionType: false,
        condBg: !that.data.condBg
      })
    } else if (id == 0 && isClick == 1) {
      that.setData({
        contTypeNum: 0,
        invoiceTypeFlag: 1,
        conditionType: false,
        condBg: !that.data.condBg
      })
    } else {
      that.setData({
        contTypeNum: 1,
        invoiceTypeFlag: 2,
        conditionType: false,
        condBg: !that.data.condBg
      })
    }
  },

  //点击遮罩层，关闭弹层
  showState:function(){
    var that = this;
    that.setData({
      condition : false,
      conditionType : false,
      condBg: !that.data.condBg
    })
  },

  //请输入个人或姓名'
  userNameInput: function (e){
    this.setData({
      userName: e.detail.value
    })
  },
  clearuserName:function(){
    this.setData({
      userName: ""
    })
  },

  //请输入单位名称
  companyNameInput: function (e) {
    this.setData({
      companyName: e.detail.value
    })
  },
  clearcompanyName: function () {
    this.setData({
      companyName: ""
    })
  },

  //纳税人识别号
  sbNumInput: function (e) {
    this.setData({
      sbNum: e.detail.value
    })
  },
  clearsbNum: function (e) {
    this.setData({
      sbNum: ""
    })
  },

  //注册地址
  addressInput: function (e) {
    this.setData({
      address: e.detail.value
    })
  },
  clearaddress: function () {
    this.setData({
      address: ""
    })
  },

  //注册电话
  telphoneInput: function (e) {
    this.setData({
      telphone: e.detail.value
    })
  },
  cleartelphone: function () {
    this.setData({
      telphone: ""
    })
  },

  //开户银行
  brandNameInput: function (e) {
    this.setData({
      brandName: e.detail.value
    })
  },
  clearbrandName: function () {
    this.setData({
      brandName: ""
    })
  },

  //银行账户
  brandNumInput: function (e) {
    this.setData({
      brandNum: e.detail.value
    })
  },
  clearbrandNum: function () {
    this.setData({
      brandNum: ""
    })
  },

  //保存
  save:function(){
    var that = this;
    let invoiceInfor = this.data.invoiceInfor;
    var typeFlag = this.data.invoiceTypeFlag;
    var isClick = this.data.isClick;
    if (typeFlag == 2) {//增值税专用发票
      var invoiceType = "增值税专用发票";
      var title = "单位";
      var companyName = this.data.companyName;//单位名称
      
      if (companyName == '' || companyName == undefined || companyName == null){
        that.setData({
          hiddenmodal: false,
          modalCont: '请填写单位名称'
        })
        setTimeout(function () {
          that.setData({
            hiddenmodal: true
          })
        }, 1000)
        return false;
      }

      var sbNum = this.data.sbNum;//纳税人识别号
      if (sbNum == '' || sbNum == undefined || sbNum == null) {
        that.setData({
          hiddenmodal: false,
          modalCont: '请填写纳税人识别号'
        })
        setTimeout(function () {
          that.setData({
            hiddenmodal: true
          })
        }, 1000)
        return false;
      }

      var address = this.data.address;//注册地址
      if (address == '' || address == undefined || address == null) {
        that.setData({
          hiddenmodal: false,
          modalCont: '请填写注册地址'
        })
        setTimeout(function () {
          that.setData({
            hiddenmodal: true
          })
        }, 1000)
        return false;
      }

      var telphone = this.data.telphone;//注册电话
      if (telphone == '' || telphone == undefined || telphone == null) {
        that.setData({
          hiddenmodal: false,
          modalCont: '请填写注册电话'
        })
        setTimeout(function () {
          that.setData({
            hiddenmodal: true
          })
        }, 1000)
        return false;
      }

      var brandName = this.data.brandName;//开户银行
      if (brandName == '' || brandName == undefined || brandName == null) {
        that.setData({
          hiddenmodal: false,
          modalCont: '请填写开户银行'
        })
        setTimeout(function () {
          that.setData({
            hiddenmodal: true
          })
        }, 1000)
        return false;
      }

      var brandNum = this.data.brandNum;//银行账户
      if (brandNum == '' || brandNum == undefined || brandNum == null) {
        that.setData({
          hiddenmodal: false,
          modalCont: '请填写银行账户'
        })
        setTimeout(function () {
          that.setData({
            hiddenmodal: true
          })
        }, 1000)
        return false;
      }

      var invoiceCompCont = "明细";//发票内容
      var price = "￥" + this.data.price;//发票金额
      

    } else if (typeFlag == 0) {//纸质发票   
      var invoiceType = "纸质普通发票";
      var title = "个人";
      var userName = this.data.userName;//个人或姓名
      if (userName == '' || userName == undefined || userName == null) {
        that.setData({
          hiddenmodal: false,
          modalCont: '请填写发票姓名'
        })
        setTimeout(function () {
          that.setData({
            hiddenmodal: true
          })
        }, 1000)
        return false;
      }
      var invoiceCont = '明细';//发票内容
      var price = "￥" + this.data.price;//发票金额
    }else{
      var invoiceType = "纸质普通发票";
      var title = "单位";
      var companyName = this.data.companyName;//单位名称
      if (companyName == '' || companyName == undefined || companyName == null) {
        that.setData({
          hiddenmodal: false,
          modalCont: '请填写单位名称'
        })
        setTimeout(function () {
          that.setData({
            hiddenmodal: true
          })
        }, 1000)
        return false;
      }

      var sbNum = this.data.sbNum;//纳税人识别号   
      if (sbNum == '' || sbNum == undefined || sbNum == null) {
        that.setData({
          hiddenmodal: false,
          modalCont: '请填写纳税人识别号 '
        })
        setTimeout(function () {
          that.setData({
            hiddenmodal: true
          })
        }, 1000)
        return false;
      }   
      var invoiceCont = '明细';//发票内容
      var price = "￥" + this.data.price;//发票金额
    }

    var pages = getCurrentPages();
    var currPage = pages[pages.length - 1];  //当前页面
    var prevPage = pages[pages.length - 2]; //上一个页面
    var host = getApp().globalData.servsers;
    var un_id = getApp().globalData.un_id;

    var dataLen = that.data.invoiceData.length;
    if (un_id != undefined && un_id != '' && un_id != null){
      if (dataLen == 0) {
        wx.request({
          url: host + "invoiceapi/insertadd",
          data: {
            user_id: un_id,
            invoice_flag: typeFlag,//发票类型
            invoice_type_name: invoiceType,//发票类型名称

            invoice_name: that.data.userName,//个人名字
            invoice_content: '明细',//纸质发票内容

            invoice_company_name: that.data.companyName,//发票公司名字（纸质单位和增值单位的公司名称相同）
            invoice_number: that.data.sbNum, //纳税人识别号
            invoice_address: that.data.address,//注册地址
            invoice_telphone: that.data.telphone,//注册电话
            invoice_brandName: that.data.brandName,//开户银行
            invoice_brandNum: that.data.brandNum,//银行账户

            invoice_company_content: '明细',//增值发票内容

            invoice_price: that.data.price,//发票金额

            invoice_title: title,//纸质个人发票抬头
            invoice_company_title: '单位',//纸质单位和增值发票抬头

            invoice_takeName: that.data.consignee,//收货姓名
            invoice_takeTelphone: that.data.phone,//收货人联系方式
            invoice_takeAddress: that.data.province + that.data.city + that.data.area + that.data.adress
          },
          method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
          header: {
            'Accept': 'application/json'
          },
          success: function (res) {
            if (that.data.invoiceTypeFlag == 0) {//纸质普通发票 - 个人

              prevPage.setData({
                invoice: true,//勾选我要开发票
                checked: true,
                value: 1,
                invoice_flag: 0,
                invCont: '纸质普通发票',
                invoice_type_name: '纸质普通发票',
                invoice_title: '个人',
                invoice_name: that.data.userName,//个人姓名
                invoice_content: '明细',//发票内容
                invoice_price: price//金额

              })

            } else if (that.data.invoiceTypeFlag == 1) {//纸质 - 单位

              prevPage.setData({
                invoice: true,//勾选我要开发票
                checked: true,
                value: 1,
                invoice_flag: 1,
                invCont: '纸质普通发票',
                invoice_type_name: '纸质普通发票',
                invoice_company_title: '单位',
                invoice_company_name: that.data.companyName,//单位名称
                invoice_number: that.data.sbNum,//纳税人识别号
                invoice_content: '明细',//发票内容
                invoice_price: price //金额
              })
            } else {//增值税专用发票
              prevPage.setData({
                invoice: true,//勾选我要开发票
                checked: true,
                value: 1,
                invoice_flag: 2,
                invCont: '增值税专用发票',
                invoice_type_name: '增值税专用发票',
                invoice_company_title: '单位',
                invoice_company_name: that.data.companyName,//单位名称
                invoice_number: that.data.sbNum,//纳税人识别号
                invoice_address: that.data.address,//注册地址
                invoice_telphone: that.data.telphone,//注册电话
                invoice_brandName: that.data.brandName,//开户银行
                invoice_brandNum: that.data.brandNum,//银行账户
                invoice_company_content: '明细',//发票内容
                invoice_price: price, //金额
                invoice_takeName: that.data.consignee,//收货姓名
                invoice_takeTelphone: that.data.phone,//收货人联系方式
                invoice_takeAddress: that.data.province + that.data.city + that.data.area + that.data.adress
              });
            }
            wx.navigateBack({})//回到上一页


            if (res == null || res.data == null) {
              console.error('网络请求失败');
              return;
            }
          }
        })

      } else {
        wx.request({
          url: host + "invoiceapi/update",
          data: {
            user_id: un_id,
            invoice_flag: typeFlag,//发票类型
            invoice_type_name: invoiceType,//发票类型名称

            invoice_name: that.data.userName,//个人名字
            invoice_content: '明细',//纸质发票内容

            invoice_company_name: that.data.companyName,//发票公司名字（纸质单位和增值单位的公司名称相同）
            invoice_number: that.data.sbNum, //纳税人识别号
            invoice_address: that.data.address,//注册地址
            invoice_telphone: that.data.telphone,//注册电话
            invoice_brandName: that.data.brandName,//开户银行
            invoice_brandNum: that.data.brandNum,//银行账户

            invoice_company_content: '明细',//增值发票内容

            invoice_price: that.data.price,//发票金额

            invoice_title: '个人',//纸质个人发票抬头
            invoice_company_title: '单位',//纸质单位和增值发票抬头

            invoice_takeName: that.data.consignee,//收货姓名
            invoice_takeTelphone: that.data.phone,//收货人联系方式
            invoice_takeAddress: that.data.province + that.data.city + that.data.area + that.data.adress//收货人地址

          },
          method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
          header: {
            'Accept': 'application/json'
          },
          success: function (res) {

            if (that.data.invoiceTypeFlag == 0) {//纸质普通发票 - 个人
              prevPage.setData({
                invoice: true,//勾选我要开发票
                checked: true,
                value: 1,
                invoice_flag: 0,
                invCont: '纸质普通发票',
                invoice_type_name: '纸质普通发票',
                invoice_title: '个人',
                invoice_name: that.data.userName,//个人姓名
                invoice_content: '明细',//发票内容
                invoice_price: price//金额

              })

            } else if (that.data.invoiceTypeFlag == 1) {//纸质 - 单位

              prevPage.setData({
                invoice: true,//勾选我要开发票
                checked: true,
                value: 1,
                invoice_flag: 1,
                invCont: '纸质普通发票',
                invoice_type_name: '纸质普通发票',
                invoice_company_title: '单位',
                invoice_company_name: that.data.companyName,//单位名称
                invoice_number: that.data.sbNum,//纳税人识别号
                invoice_content: '明细',//发票内容
                invoice_price: price //金额
              })
            } else {//增值税专用发票
              prevPage.setData({
                invoice: true,//勾选我要开发票
                checked: true,
                value: 1,
                invoice_flag: 2,
                invCont: '增值税专用发票',
                invoice_type_name: '增值税专用发票',
                invoice_company_title: '单位',
                invoice_company_name: that.data.companyName,//单位名称
                invoice_number: that.data.sbNum,//纳税人识别号
                invoice_address: that.data.address,//注册地址
                invoice_telphone: that.data.telphone,//注册电话
                invoice_brandName: that.data.brandName,//开户银行
                invoice_brandNum: that.data.brandNum,//银行账户
                invoice_company_content: '明细',//发票内容
                invoice_price: price, //金额
                invoice_takeName: that.data.consignee,
                invoice_takeTelphone: that.data.phone,
                invoice_takeAddress: that.data.province + that.data.city + that.data.area + that.data.adress
              });
            }
            wx.navigateBack({})//回到上一页


            if (res == null || res.data == null) {
              console.error('网络请求失败');
              return;
            }
          }
        })
      }
    }
    
  }

})