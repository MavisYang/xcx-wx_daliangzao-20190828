// buy.js
var app = getApp();
var WxParse = require('../../wxParse/wxParse.js');

var goodsInfor = {
  cycle: 10,
  minNumber: 100
};
//服务
var goodsService = [
];
//礼盒
var gixboxService = [
];
//定制
var dingzhiService = [
];

//定制
var Style1 = [
];
//定制
var Style2 = [
];
//定制
var Style3 = [
];
//定制
var Style4 = [
];
//定制
var Style5 = [
];

//选择颜色
var colorList = [
];


//规格选择
var ruleList = [
  { id: 1, icon: "/images/collect_pre.png", rule: "规格1" },
  { id: 2, icon: "/images/collect_pre.png", rule: "规格2" },
  { id: 3, icon: "/images/collect_pre.png", rule: "规格3" }
];

var recommend = "";
let animationShowHeight = 1000;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    urlHttp: '',
    banner: '',
    bannerSml: '',
    title: '',
    shangpin_id: '',
    intro: '',
    newPrice: '',
    oldPrice: '',
    allPrice: '',
    cycle: '',
    brandname: '',
    brandlogo: '',
    brandBanner: '',
    bannerShare: 　'',//分享的图片
    minNumber: '',
    goodsInfor: goodsInfor,
    goodsService: goodsService,
    gixboxService: gixboxService,
    dingzhiService: dingzhiService,
    Style1: Style1,
    Style2: Style2,
    Style3: Style3,
    Style4: Style4,
    Style5: Style5,

    serviceLength: 0,
    serviceIcon: 0,
    giftboxsize: '',
    colorList: colorList,
    colorListLength: 0,
    style1: 0,
    style2: 0,
    style3: 0,
    style4: 0,
    style5: 0,
    style1_name: '',
    style2_name: '',
    style3_name: '',
    style4_name: '',
    style5_name: '',
    colorIconNum: 0,
    colorClick: 0, //颜色是否选中
    commodity_details: '',
    ruleList: ruleList,
    recommend: recommend,
    ruleListLength: 1,
    ruleIconNum: 0,
    ruleClick: 0, //规格是否选中

    brandid: '',
    brandtitle: '',
    cartNum: 0,

    num: 1,  //起订量
    limitNum: 1,//装起订量
    isMinus: false,//初始不可减
    totalPrice: 0,  // 总价，初始为0

    selectColor: "",
    selectBox: "",
    selectRule: "",
    com_id: "",
    recommend: "",
    collectState: false,
    boxClick: "-",//礼盒选中状态
    //立即购买中的规格，当前选中状态
    ruleClick1: "-",
    ruleClick2: "-",
    ruleClick3: "-",
    ruleClick4: "-",
    ruleClick5: "-",
    dingZhiClick: "-",//定制

    //规格回显值
    rule1: "",
    rule2: "",
    rule3: "",
    rule4: "",
    rule5: "",
    imagewidth: 0,//缩放后的宽  
    imageheight: 0,//缩放后的高  
    imageheight1: 0,
    state: '',//滚动条状态（有 auto/无 hidden）
    carts: [],
    hiddenmodal: true, //弹窗
    modalCont: '',
    stateId: 0,//判断是点击的加入购物车 - 0 / 立即购买 - 1 
    maxHeight: 0,
    imgList: [],//banner数组
    serviceIsShow: false,
    isShow: false,
    chooseFlag: 0,
    chooseResult: 0,

    animationData: {},
    animationDataBuy: {},
    animationDataSer: {},
    animation: {},
    styleLen: 0,
    soldOutShow : false ,//商品下架提示信息
    com_id : '3419',//正式商品地址
    //com_id: '3294',//测试商品地址
    user_id : '',
    user_allow_num : 0 //该商品对于该用户的限购数量
    
  },

  onLoad: function (options) {
    var that = this;
    var host = getApp().globalData.servsers;
    var un_id = getApp().globalData.un_id;
    that.setData({
      user_id: un_id
    })
    var serviceLength = goodsService.length;
    var iconNum = 0;
    for (var i = 0; i < serviceLength; i++) {
      if (goodsService[i].icon != '') {
        iconNum++;
      }
    }

    var colorListLength = colorList.length;
    var colorIconNum = 0;
    for (var i = 0; i < colorListLength; i++) {
      if (colorList[i].icon != '') {
        colorIconNum++;
      }
    }

    var ruleListLength = colorList.length;
    var ruleIconNum = 0;
    for (var i = 0; i < ruleListLength; i++) {
      if (ruleList[i].icon != '') {
        ruleIconNum++;
      }
    }

    that.setData({
      urlHttp: host,
      com_id: that.data.com_id,
      "serviceLength": serviceLength,
      "serviceIcon": iconNum,
      "num": goodsInfor.minNumber,
      "limitNum": goodsInfor.minNumber,
      "colorListLength": colorListLength,
      "colorIconNum": colorIconNum,
      "ruleListLength": ruleListLength,
      "ruleIconNum": ruleIconNum
    })


    //商品列表
    that = this;
    //检测商品是否下架


    wx.request({
      url: host + "commodityapi/commoditview",
      data: {
        com_id: that.data.com_id
      },
      method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      header: {
        'Accept': 'application/json'
      },
      success: function (res) {
        console.log(res.data);
        //有此商品
        if (res.data.total > 0){
          if (res.data.commodity.commodity_flag == '1'){//此商品为下架商品
              that.setData({
                soldOutShow : true
              })
          }else{
            //获取该用户下的该商品限购数量
            wx.request({
              url: host + "userapi/user_fake_split_view",
              data: {
                user_id: that.data.user_id
              },
              method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
              header: {
                'Accept': 'application/json'
              },
              success: function (res) {
                console.log(res.data.rows[0].user_num);
                that.setData({
                  user_allow_num: res.data.rows[0].user_num
                })
              }
            })  
          }
        }
        var article1 = res.data.commodity.commodity_details;
        WxParse.wxParse('article1', 'html', res.data.commodity.commodity_details, that, 5)
        var acceptance = res.data.commodity.commodity_acceptance
        wx.request({
          url: host + "/brandapi/findAllforid",
          data: {
            id: res.data.commodity.commodity_brand
          },
          method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
          header: {
            'Accept': 'application/json'
          },
          success: function (res) {
            that.setData({
              brandid: res.data.rows[0].id,
              brandtitle: res.data.rows[0].brand_des,
              brandname: res.data.rows[0].brand_name,
              brandlogo: res.data.rows[0].brand_logo2,
              brandBanner: res.data.rows[0].brand_logo1
            });
            if (res == null || res.data == null) {
              console.error('网络请求失败');
              return;
            }
          }
        });
        if (acceptance != null && acceptance != '') {
          wx.request({
            url: host + "acceptanceapi/findBuy",
            data: {
              id: acceptance
            },
            method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
            header: {
              'Accept': 'application/json'
            },
            success: function (res) {

              that.setData({
                goodsService: res.data.rows
              });
              if (res == null || res.data == null) {
                console.error('网络请求失败');
                return;
              }
            }
          });
        }
        var giftbox = res.data.commodity.commodity_giftbox
        if (giftbox != null && giftbox != '') {
          wx.request({
            url: host + "giftboxapi/findBuy",
            data: {
              id: giftbox
            },
            method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
            header: {
              'Accept': 'application/json'
            },
            success: function (res) {

              that.setData({
                giftboxsize: res.data.total,
                gixboxService: res.data.rows
              });
              if (res == null || res.data == null) {
                console.error('网络请求失败');
                return;
              }
            }
          });
        }
        var process = res.data.commodity.commodity_process
        if (process != null && process != '') {
          wx.request({
            url: host + "processapi/findBuy",
            data: {
              id: process
            },
            method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
            header: {
              'Accept': 'application/json'
            },
            success: function (res) {
              that.setData({
                iconNum: res.data.total,
                dingzhiService: res.data.rows
              });
              if (res == null || res.data == null) {
                console.error('网络请求失败');
                return;
              }
            }
          });
        }
        var style1 = res.data.commodity.style1
        if (style1 != null && style1 != '') {
          wx.request({
            url: host + "datasheetapi/findAllforid",
            data: {
              id: res.data.commodity.style1
            },
            method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
            header: {
              'Accept': 'application/json'
            },
            success: function (res) {
              that.setData({
                style1_name: res.data.rows[0].datasheet_com_name,
                style1: res.data.total,
                Style1: res.data.rows
              });
              if (res == null || res.data == null) {
                console.error('网络请求失败');
                return;
              }
            }
          });
        }
        var style2 = res.data.commodity.style2
        if (style2 != null && style2 != '') {
          wx.request({
            url: host + "datasheetapi/findAllforid",
            data: {
              id: res.data.commodity.style2
            },
            method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
            header: {
              'Accept': 'application/json'
            },
            success: function (res) {
              that.setData({
                style2_name: res.data.rows[0].datasheet_com_name,
                style2: res.data.total,
                Style2: res.data.rows
              });
              if (res == null || res.data == null) {
                console.error('网络请求失败');
                return;
              }
            }
          });
        }

        var style3 = res.data.commodity.style3
        if (style3 != null && style3 != '') {
          wx.request({
            url: host + "datasheetapi/findAllforid",
            data: {
              id: res.data.commodity.style3
            },
            method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
            header: {
              'Accept': 'application/json'
            },
            success: function (res) {
              that.setData({
                style3_name: res.data.rows[0].datasheet_com_name,
                style3: res.data.total,
                Style3: res.data.rows
              });
              if (res == null || res.data == null) {
                console.error('网络请求失败');
                return;
              }
            }
          });
        }

        var style4 = res.data.commodity.style4
        if (style4 != null && style4 != '') {
          wx.request({
            url: host + "datasheetapi/findAllforid",
            data: {
              id: res.data.commodity.style4
            },
            method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
            header: {
              'Accept': 'application/json'
            },
            success: function (res) {
              that.setData({
                style4_name: res.data.rows[0].datasheet_com_name,
                style4: res.data.total,
                Style4: res.data.rows
              });
              if (res == null || res.data == null) {
                console.error('网络请求失败');
                return;
              }
            }
          });
        }

        var style5 = res.data.commodity.style5
        if (style5 != null && style5 != '') {
          wx.request({
            url: host + "datasheetapi/findAllforid",
            data: {
              id: res.data.commodity.style5
            },
            method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
            header: {
              'Accept': 'application/json'
            },
            success: function (res) {
              that.setData({
                style5_name: res.data.rows[0].datasheet_com_name,
                style5: res.data.total,
                Style5: res.data.rows
              });
              if (res == null || res.data == null) {
                console.error('网络请求失败');
                return;
              }
            }
          });
        }


        that.setData({
          tuijian: res.data.commodity,
          serviceLength: res.data.total,
          banner: res.data.images,
          bannerShare: res.data.images[0],
          bannerSml: host + 'images/' + res.data.images[0],
          title: res.data.commodity.commodity_name,
          shangpin_id: res.data.commodity.id,
          intro: res.data.commodity.commodity_des,
          newPrice: res.data.commodity.commodity_sale,
          allPrice: res.data.commodity.commodity_sale,
          oldPrice: res.data.commodity.commodity_cost,
          cycle: res.data.commodity.commodity_cyc,
          minNumber: res.data.commodity.commodity_num,
          num: res.data.commodity.commodity_num,
          recommend: res.data.commodity.commodity_recommend,
        });
        var imgList = [];
        for (var i = 0; i < that.data.banner.length; i++) {
          imgList[i] = host + 'images/' + that.data.banner[i];
        }
        that.setData({
          imgList: imgList
        })
        if (res == null || res.data == null) {
          console.error('网络请求失败');
          return;
        }
        wx.setNavigationBarTitle({
          title: res.data.commodity.commodity_name
        })
      }
    });

    wx.request({
      url: host + "collectionapi/findAllforxcx",
      data: {
        user_id: un_id,
        collection_clas: 2,
        collection_name: that.data.com_id,
      },
      method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      header: {
        'Accept': 'application/json'
      },
      success: function (res) {
        if (res.data.total != 0) {
          that.setData({
            collectState: true
          })
        }
        if (res == null || res.data == null) {
          console.error('网络请求失败');
          return;
        }
      }
    })

    wx.getSystemInfo({
      success: function (res) {
        animationShowHeight = res.windowHeight;
      }
    })
    // 显示遮罩层  
    var animation = wx.createAnimation({
      duration: 200,
      timingFunction: 'linear',
    })
    this.animation = animation
    animation.bottom(-animationShowHeight).step()
    this.setData({
      animationDataBuy: animation.export()
    })
    setTimeout(function () {
      animation.bottom(-animationShowHeight).step()
      this.setData({
        animationDataBuy: animation.export()
      })
    }.bind(this), 200)

  },

  onShow: function () {
    var that = this;
    var host = getApp().globalData.servsers;
    var un_id = getApp().globalData.un_id;
    that.setData({
      user_id: un_id
    })
    //获取该用户下的该商品限购数量
    wx.request({
      url: host + "userapi/user_fake_split_view",
      data: {
        user_id: that.data.user_id
      },
      method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      header: {
        'Accept': 'application/json'
      },
      success: function (res) {
        that.setData({
          user_allow_num: res.data.rows[0].user_num
        })
      }
    })
  },

  //手动填写数量
  writeNum: function (e) {
    var that = this;
    var val = e.detail.value;
    var minnum = that.data.num;
    var user_allow_num = that.data.user_allow_num;

    if (parseInt(val) > parseInt(user_allow_num)){
      that.setData({
        hiddenmodal: false,
        modalCont: '选择数量已达上限'
      })
      setTimeout(function () {
        that.setData({
          hiddenmodal: true
        })
      }, 1000)
      if (parseInt(val) > parseInt(minnum)){
        that.setData({
          minNumber: user_allow_num,
          isMinus: true
        })
      }else{
        that.setData({
          minNumber: user_allow_num,
          isMinus: false
        })
      }

    }else{
      if (parseInt(val) > parseInt(minnum)) {
        that.setData({
          minNumber: val,
          isMinus: true
        })
      } else {
        that.setData({
          minNumber: minnum,
          isMinus: false
        })
      }
    }


    
  },


  //立即购买下的选择礼盒
  boxSelect: function (options) {
    var that = this
    var id = options.currentTarget.dataset.id;
    var boxPrice = that.data.gixboxService[id].box_price;
    that.data.allPrice = that.data.tuijian.commodity_sale;
    if (boxPrice == '' || boxPrice == null || boxPrice == undefined) {
      boxPrice = 0;
    }
    var newPrice = parseFloat(that.data.allPrice) + parseFloat(boxPrice); //加上礼盒的价格
    if (that.data.boxClick == id) {//变为取消状态
      that.setData({
        boxClick: '-',
        allPrice: that.data.allPrice, //商品原价
        selectBox: '',
      })
      if (that.data.styleLen == 0) {
        that.setData({
          chooseResult: 0
        })
      }
    } else {
      that.setData({
        chooseResult: 1,
        boxClick: id,
        allPrice: newPrice, //加上礼盒的价格
        selectBox: that.data.gixboxService[id].giftbox_name,

      })
    }
  },

  //立即购买下的规格选择
  ruleSelect: function (options) {
    var that = this
    var id = options.currentTarget.dataset.id;
    var ruleNum = options.currentTarget.dataset.rule;//当前规格1-5
    var styleLen = that.data.styleLen;

    if (ruleNum == 1) {
      if (that.data.ruleClick1 == id) {//当前为选中状态，变为取消状态
        that.setData({
          ruleClick1: '-',
          rule1: '',
          styleLen: styleLen--
        })
      } else {
        that.setData({
          ruleClick1: id,
          rule1: that.data.Style1[id].datasheet_name,
          styleLen: styleLen++
        })
      }
    } else if (ruleNum == 2) {
      if (that.data.ruleClick2 == id) {
        that.setData({
          ruleClick2: '-',
          rule2: '',
          styleLen: styleLen--
        })
      } else {
        that.setData({
          ruleClick2: id,
          rule2: that.data.Style2[id].datasheet_name,
          styleLen: styleLen++
        })
      }
    } else if (ruleNum3 == 1) {
      if (that.data.ruleClick3 == id) {
        that.setData({
          ruleClick3: '-',
          rule3: '',
          styleLen: styleLen--
        })
      } else {
        that.setData({
          ruleClick3: id,
          rule3: that.data.Style3[id].datasheet_name,
          styleLen: styleLen++
        })
      }
    } else if (ruleNum == 4) {
      if (that.data.ruleClick4 == id) {
        that.setData({
          ruleClick4: '-',
          rule4: '',
          styleLen: styleLen--
        })
      } else {
        that.setData({
          ruleClick4: id,
          rule4: that.data.Style4[id].datasheet_name,
          styleLen: styleLen++
        })
      }
    } else {
      if (that.data.ruleClick5 == id) {
        that.setData({
          ruleClick5: '-',
          rule5: '',
          styleLen: styleLen--
        })
      } else {
        that.setData({
          ruleClick5: id,
          rule5: that.data.Style5[id].datasheet_name,
          styleLen: styleLen++
        })
      }
    }
    if (that.data.styleLen == 0) {
      that.setData({
        chooseResult: 0
      })
    } else {
      that.setData({
        chooseResult: 1
      })
    }

  },

  //立即购买下的定制
  dingZhiSelect: function (options) {
    var that = this
    var id = options.currentTarget.dataset.id;
    if (that.data.dingZhiClick == id) {//变为取消状态
      that.setData({
        dingZhiClick: '-',
        selectDingZhi: ''
      })
    } else {
      that.setData({
        chooseResult: 1,
        dingZhiClick: id,
        selectDingZhi: this.data.dingzhiService[id].process_name
      })
    }
    //判断当前是否有选择的规格
    if (that.data.styleLen == 0) {
      that.setData({
        chooseResult: 0
      })
    } else {
      that.setData({
        chooseResult: 1
      })
    }
  },

  //绑定加数量事件
  addCount(e) {
    var that = this;
    let num = this.data.minNumber;
    var user_allow_num = that.data.user_allow_num;
    if (num == user_allow_num){
      that.setData({
        hiddenmodal: false,
        modalCont: '选择数量已达上限'
      })
      setTimeout(function () {
        that.setData({
          hiddenmodal: true
        })
      }, 1000)
      return false;
    }else{
      num++;
      this.setData({
        "minNumber": num,
        "isMinus": true
      })
    }
    
  },

  //绑定减数量事件
  minusCount(e) {
    let num = this.data.minNumber;
    let minnum = this.data.num;
    if (num <= minnum) {
      return false;
    }
    num--;
    if (num == minnum) {
      this.setData({
        "isMinus": false
      })
    }
    this.setData({
      "minNumber": num
    })
  },

  //加入购物车
  addCart: function (e) {
    var that = this;
    var scrollTop = that.data.scrollTop;
    //判断商品是否已下架，若下架则不可点击
    var soldOutShow = that.data.soldOutShow;
    if (soldOutShow == true){
      return false;
    }

    that.setData({
      chooseFlag: 0,//判断进入购买的入口【底部footer】
      stateId: 0
    });
    wx.getSystemInfo({
      success: function (res) {
        animationShowHeight = res.windowHeight;
      }
    })

    // 显示遮罩层  
    var animation = wx.createAnimation({
      duration: 400,
      timingFunction: 'linear',
    })

    this.animation = animation
    animation.opacity(0).step()
    this.setData({
      isShow: true,
      windBgShow: animation.export()
    })

    setTimeout(function () {
      animation.opacity(1).step()
      this.setData({
        windBgShow: animation.export()
      })
    }.bind(this), 200)

    //内容
    animation.bottom(-animationShowHeight).step()
    this.setData({
      animationDataBuy: animation.export()
    })

    setTimeout(function () {
      animation.bottom(0).step()
      this.setData({
        animationDataBuy: animation.export()
      })
    }.bind(this), 200)

  },

  //立即购买
  buyCart: function (e) {
    var that = this;
    var scrollTop = that.data.scrollTop;
    //判断商品是否已下架，若下架则不可点击
    var soldOutShow = that.data.soldOutShow;
    if (soldOutShow == true) {
      return false;
    }

    this.setData({
      chooseFlag: 0,//判断进入购买的入口【底部footer】
      stateId: 1
    })
    wx.getSystemInfo({
      success: function (res) {
        animationShowHeight = res.windowHeight;
      }
    })

    var animation = wx.createAnimation({
      duration: 400,
      timingFunction: 'linear',
    })

    this.animation = animation
    animation.opacity(0).step()
    this.setData({
      isShow: true,
      windBgShow: animation.export()
    })

    setTimeout(function () {
      animation.opacity(1).step()
      this.setData({
        windBgShow: animation.export()
      })
    }.bind(this), 200)

    // 显示遮罩层  
    animation.bottom(-animationShowHeight).step()
    this.setData({
      animationDataBuy: animation.export()
    })
    setTimeout(function () {
      animation.bottom(0).step()
      this.setData({
        animationDataBuy: animation.export()
      })
    }.bind(this), 200)
  },

  //跳转到购物车
  linkCart: function (e) {
    wx.redirectTo({
      url: '/pages/carInsert/carInsert'
    })
  },

  //收藏
  collect: function (e) {
    var dataState = e.currentTarget.dataset.state;
    var host = getApp().globalData.servsers;
    var un_id = getApp().globalData.un_id;

    var that = this
    if (!dataState) {
      //后台增加收藏用户收藏数据
      wx.request({
        url: host + "collectionapi/insertcollection",
        data: {
          user_id: un_id,
          collection_clas: 2,
          collection_name: that.data.com_id,
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

      this.setData({
        collectState: true
      })
    } else {

      wx.request({
        url: host + "collectionapi / deleteforxcx",
        data: {
          user_id: un_id,
          collection_clas: 2,
          collection_name: that.data.com_id,
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

      this.setData({
        collectState: false
      })
    }

  },

  //立即购买-去付款
  tz: function (e) {
    var that = this;
    var id = e.currentTarget.dataset.id;
    let carts = this.data.carts;
    var shangpin_id = this.data.shangpin_id;
    var name = this.data.title;
    var logo = this.data.bannerSml;
    var cost = this.data.newPrice;
    var cyc = this.data.cycle;
    var number = this.data.minNumber;
    var limitNum = this.data.num;//起订量
    var acceptance = this.data.title;
    var region = this.data.title;
    var specifications = this.data.title;
    var host = getApp().globalData.servsers;
    var un_id = getApp().globalData.un_id;

    //规格 : 名称 当前选中的index 当前选中的对应数据Id
    var style1 = this.data.Style1;
    if (style1 == undefined || style1 == '') {
      var styleName1 = '';
      var styleId1 = '';
    } else {
      var styleName1 = this.data.style1_name;
      var styleIndex1 = this.data.ruleClick1;
      if (styleIndex1 == '-') {
        that.setData({
          hiddenmodal: false,
          modalCont: '请选择' + styleName1
        })
        setTimeout(function () {
          that.setData({
            hiddenmodal: true
          })
        }, 1000)
        return false;
      } else {
        var styleId1 = this.data.Style1[styleIndex1].id;
        var styleName1 = this.data.Style1[styleIndex1].datasheet_name;
      }
    }

    var style2 = this.data.Style2;
    if (style2 == undefined || style2 == '') {
      var styleName2 = '';
      var styleId2 = '';
    } else {
      var styleName2 = this.data.style2_name;
      var styleIndex2 = this.data.ruleClick2;
      if (styleIndex2 == '-') {
        that.setData({
          hiddenmodal: false,
          modalCont: '请选择' + styleName2
        })
        setTimeout(function () {
          that.setData({
            hiddenmodal: true
          })
        }, 1000)
        return false;
      } else {
        var styleId2 = this.data.Style2[styleIndex2].id;
        var styleName2 = this.data.Style2[styleIndex2].datasheet_name;
      }
    }

    var style3 = this.data.Style3;
    if (style3 == undefined || style3 == '') {
      var styleName3 = '';
      var styleId3 = '';
    } else {
      var styleName3 = this.data.style3_name;
      var styleIndex3 = this.data.ruleClick3;
      if (styleIndex3 == '-') {
        that.setData({
          hiddenmodal: false,
          modalCont: '请选择' + styleName3
        })
        setTimeout(function () {
          that.setData({
            hiddenmodal: true
          })
        }, 1000)
        return false;
      } else {
        var styleId3 = this.data.Style3[styleIndex3].id;
        var styleName3 = this.data.Style3[styleIndex3].datasheet_name;
      }

    }

    var style4 = this.data.Style4;
    if (style4 == undefined || style4 == '') {
      var styleName4 = '';
      var styleId4 = '';
    } else {
      var styleName4 = this.data.style4_name;
      var styleIndex4 = this.data.ruleClick4;
      if (styleIndex4 == '-') {
        that.setData({
          hiddenmodal: false,
          modalCont: '请选择' + styleName4
        })
        setTimeout(function () {
          that.setData({
            hiddenmodal: true
          })
        }, 1000)
        return false;
      } else {
        var styleId4 = this.data.Style4[styleIndex4].id;
        var styleName4 = this.data.Style1[styleIndex4].datasheet_name;
      }


    }

    var style5 = this.data.Style5;
    if (style5 == undefined || style5 == '') {
      var styleName5 = '';
      var styleId5 = '';
    } else {
      var styleName5 = this.data.style5_name;
      var styleIndex5 = this.data.ruleClick5;
      if (styleIndex5 == '-') {
        that.setData({
          hiddenmodal: false,
          modalCont: '请选择' + styleName5
        })
        setTimeout(function () {
          that.setData({
            hiddenmodal: true
          })
        }, 1000)
        return false;
      } else {
        var styleId5 = this.data.Style5[styleIndex5].id;
        var styleName5 = this.data.Style5[styleIndex5].datasheet_name;
      }

    }

    //礼盒 名称 当前选中的index 当前选中的对应数据Id
    var selectBox = this.data.gixboxService;
    if (selectBox == undefined || selectBox == '') {
      var selectBoxName = '';
      var selectBoxId = '';
      var selectBoxPrice = '';
    } else {
      var gixboxIndex = this.data.boxClick;
      if (gixboxIndex == '-') {
        that.setData({
          hiddenmodal: false,
          modalCont: '请选择礼盒'
        })
        setTimeout(function () {
          that.setData({
            hiddenmodal: true
          })
        }, 1000)
        return false;
      } else {
        var selectBoxId = this.data.gixboxService[gixboxIndex].id;
        var selectBoxName = this.data.gixboxService[gixboxIndex].giftbox_name;
        var selectBoxPrice = this.data.gixboxService[gixboxIndex].box_price;
      }
    }

    //定制 名称 当前选中的index 当前选中的对应数据Id
    var selectDingZhi = this.data.dingzhiService;
    if (selectDingZhi == undefined || selectDingZhi == '') {
      var selectDingZhiName = '';
      var selectDingZhiId = '';
    } else {
      var selectDingZhiIndex = this.data.dingZhiClick;
      if (selectDingZhiIndex == '-') {
        that.setData({
          hiddenmodal: false,
          modalCont: '请选择定制'
        })
        setTimeout(function () {
          that.setData({
            hiddenmodal: true
          })
        }, 1000)
        return false;
      } else {
        var selectDingZhiId = this.data.dingzhiService[selectDingZhiIndex].id;
        var selectDingZhiName = this.data.dingzhiService[selectDingZhiIndex].process_name;
      }
    }

    if (id == 0) {//加入购物车

      let num = parseInt(this.data.minNumber);
      let oldNum = parseInt(this.data.cartNum);
      let newNum = oldNum + num;
      if (newNum > 99) {
        this.setData({
          'cartNum': '99+'
        })
      } else {
        this.setData({
          'cartNum': newNum
        })
      }

      var host = getApp().globalData.servsers;
      var un_id = getApp().globalData.un_id;
      var name = this.data.title;
      var id = this.data.com_id;
      var logo = this.data.bannerSml;
      var cost = this.data.newPrice;
      var acceptance = this.data.acceptance;
      var cyc = this.data.cycle;
      var number = this.data.minNumber;
      var limitNum = this.data.num;//起订量



      wx.request({
        url: host + "shoppingcartapi/insertshoppingcart",
        data: {
          user_id: un_id,
          com_id: id,
          name: name,
          logo: logo,
          cost: cost,
          cyc: cyc,
          num: number,
          minNumber: limitNum,
          acceptance: acceptance,
          flag: 1,
          giftbox: selectBoxId,
          giftbox_name: selectBoxName,
          box_price: selectBoxPrice,
          process: selectDingZhiId,
          process_name: selectDingZhiName,
          style1_name: styleName1,
          style1: styleId1,
          style2_name: styleName2,
          style2: styleId2,
          style3_name: styleName3,
          style3: styleId3,
          style4_name: styleName4,
          style4: styleId4,
          style5: styleId4,
          style5_name: styleName5,
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

    } else {








      carts = [{
        id: shangpin_id,
        com_id: shangpin_id,
        name: name,
        logo: logo,
        cost: cost,
        cyc: cyc,
        num: number,
        acceptance: acceptance,
        region: region,
        specifications: specifications,
        flag: 1,
        giftbox: selectBoxId,
        giftbox_name: selectBoxName,
        box_price: selectBoxPrice,
        style1: styleId1,
        style1_name: styleName1,
        style2: styleId2,
        style2_name: styleName2,
        style3: styleId3,
        style3_name: styleName3,
        style4: styleId4,
        style4_name: styleName4,
        style5: styleId5,
        style5_name: styleName5,
        process: selectDingZhiId,
        process_name: selectDingZhiName,
        new_price: that.data.allPrice,
        user_num: that.data.user_allow_num
        
      }];

      this.setData({
        carts: carts
      })
      var newCarts = JSON.stringify(that.data.carts);
      newCarts = newCarts.replace(/&/g, "zss");
      wx.navigateTo({
        url: '/pages/confirmOrderOnly/confirmOrderOnly?carts=' + newCarts,
        success: function (res) {
          // success  
        },
        fail: function () {
          // fail  
        },
        complete: function () {
          // complete  
        }
      })
    }
    wx.getSystemInfo({
      success: function (res) {
        animationShowHeight = res.windowHeight;
      }
    })
    // 关闭遮罩层  
    var animation = wx.createAnimation({
      duration: 400,
      timingFunction: 'linear',
    })

    this.animation = animation;
    animation.bottom(0).step()
    this.setData({
      isShow: false,
      animationDataBuy: animation.export()
    })
    setTimeout(function () {
      animation.bottom(-animationShowHeight).step()
      this.setData({
        animationDataBuy: animation.export()
      })
    }.bind(this), 200)


    animation.opacity(1).step()
    this.setData({
      windBgShow: animation.export()
    })

    setTimeout(function () {
      animation.opacity(0).step()
      this.setData({
        isShow: false,
        windBgShow: animation.export()
      })
    }.bind(this), 200)
  },

  imageLoad: function (e) {
    var that = this;
    var imageSize = {};
    var originalWidth = e.detail.width;//图片原始宽  
    var originalHeight = e.detail.height;//图片原始高  
    var originalScale = originalHeight / originalWidth;//图片高宽比  
    wx.getSystemInfo({
      success: function (res) {
        var windowWidth = res.windowWidth;
        var windowHeight = res.windowHeight;
        var windowscale = windowHeight / windowWidth;//屏幕高宽比  
        imageSize.imageHeight = (windowWidth * originalHeight) / originalWidth;
      }
    })
    that.setData({
      imageheight: imageSize.imageHeight,
    })
  },

  windOpen: function () {
    console.log("延时调用");
  },
  windClose: function () {
    this.setData({
      hidden: true
    });
  },

  previewImg: function (e) {//banner图预览
    var that = this;
    var currentUrl = e.currentTarget.dataset.src;
    wx.previewImage({
      current: currentUrl,
      urls: that.data.imgList
    })
  },

  //显示选择商品&定制详情
  showGoodsInfor: function () {
    var that = this;
    var scrollTop = that.data.scrollTop;
    that.setData({
      chooseFlag: 1
    })
    wx.getSystemInfo({
      success: function (res) {
        animationShowHeight = res.windowHeight;
      }
    })

    // 显示遮罩层  

    var animation = wx.createAnimation({
      duration: 400,
      timingFunction: 'linear',
    })

    this.animation = animation
    animation.opacity(0).step()
    this.setData({
      isShow: true,
      windBgShow: animation.export()
    })

    setTimeout(function () {
      animation.opacity(1).step()
      this.setData({
        windBgShow: animation.export()
      })
    }.bind(this), 200)

    //内容
    animation.bottom(-animationShowHeight).step()
    this.setData({
      animationDataBuy: animation.export()
    })
    setTimeout(function () {
      animation.bottom(0).step()
      this.setData({
        animationDataBuy: animation.export()
      })
    }.bind(this), 200)
  },


  showServiceInfor: function () {//显示服务
    var that = this;
    var scrollTop = that.data.scrollTop;
    that.setData({
      stateId: 0
    });
    wx.getSystemInfo({
      success: function (res) {
        animationShowHeight = res.windowHeight;
      }
    })
    var animation = wx.createAnimation({
      duration: 400,
      timingFunction: 'linear',
    })

    this.animation = animation
    animation.opacity(0).step()
    this.setData({
      isShow: true,
      windBgShow: animation.export()
    })
    setTimeout(function () {
      animation.opacity(1).step()
      this.setData({
        windBgShow: animation.export()
      })
    }.bind(this), 200)


    animation.bottom(-animationShowHeight).step()
    this.setData({
      animationDataSer: animation.export()
    })
    setTimeout(function () {
      animation.bottom(0).step()
      this.setData({
        animationDataSer: animation.export()
      })
    }.bind(this), 200)
  },

  closeBuy: function () {//关闭购买弹窗
    var that = this;
    wx.getSystemInfo({
      success: function (res) {
        animationShowHeight = res.windowHeight;
      }
    })

    var animation = wx.createAnimation({
      duration: 400,
      timingFunction: 'linear',
    })

    this.animation = animation
    animation.opacity(1).step()
    this.setData({
      windBgShow: animation.export()
    })

    setTimeout(function () {
      animation.opacity(0).step()
      this.setData({
        isShow: false,
        windBgShow: animation.export()
      })
    }.bind(this), 200)

    // 显示遮罩层  

    animation.bottom(0).step()
    this.setData({
      animationDataBuy: animation.export()
    })
    setTimeout(function () {
      animation.bottom(-animationShowHeight).step()
      this.setData({
        animationDataBuy: animation.export()
      })
    }.bind(this), 200)
  },


  closeService: function () {//关闭服务弹窗
    var that = this;
    that.setData({
      chooseFlag: 0
    })
    wx.getSystemInfo({
      success: function (res) {
        animationShowHeight = res.windowHeight;
      }
    })

    var animation = wx.createAnimation({
      duration: 400,
      timingFunction: 'linear',
    })
    this.animation = animation

    animation.opacity(1).step()
    this.setData({
      windBgShow: animation.export()
    })
    setTimeout(function () {
      animation.opacity(0).step()
      this.setData({
        isShow: false,
        windBgShow: animation.export()
      })
    }.bind(this), 200)


    // 内容  
    animation.bottom(0).step()
    this.setData({
      animationDataSer: animation.export()
    })
    setTimeout(function () {
      animation.bottom(-animationShowHeight).step()
      this.setData({
        animationDataSer: animation.export()
      })
    }.bind(this), 200)

  },

  onShareAppMessage: function (res) {//页面分享
    var that = this;
    var host = getApp().globalData.servsers;
    if (res.from === 'button') {
      // 来自页面内转发按钮
    }
    return {
      title: that.data.title,
      path: '/pages/buyOnly/buyOnly?com_id=' + that.data.com_id,
      imageUrl: host + 'images/' + that.data.bannerShare,
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
  }

})
var that;
var imageUtil = require('../../utils/util.js'); 