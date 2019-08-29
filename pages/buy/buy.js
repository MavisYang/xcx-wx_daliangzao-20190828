// buy.js
var app = getApp();
var WxParse = require('../../wxParse/wxParse.js');

//规格
var Style1 = [];
var Style2 = [];
var Style3 = [];
var Style4 = [];
var Style5 = [];

let animationShowHeight = 1000;
Page({
  data: {
    allHidden : '',
    authorize: 0,
    urlHttp: '',
    com_id: "",//商品id
    shangpin_id: '',//商品id
    banner: '',
    bannerSml: '',//商品弹窗的小图
    title: '',//商品名称
    intro: '',//商品详情
    minPrice : 0,//最低价格
    maxPrice : 0,//最高价格
    newPrice: '',//现价
    oldPrice: '',//原价
    goodPrice: 0,//商品单独的价格
    showPrice: 0,//显示的区间价格【  （商品价格 + 礼盒价格）  】
    num: 1,      //起订量
    cycle: 1,//定制周期
    recommend: "",
    collectState: false,//是否收藏

    //品牌信息
    brandid: '',
    brandtitle: '',
    brandname: '',
    brandlogo: '',
    brandBanner: '',
    bannerShare: '',//分享链接上显示的图片

    goodsService: [],  //服务
    giftboxsize: '',   //礼盒长度
    gixboxService: [], //礼盒
    dingzhiService: [],//定制工艺
    Style1: [],        //规格
    Style2: [],
    Style3: [],
    Style4: [],
    Style5: [],

    //每一类规格的数量
    style1: 0,
    style2: 0,
    style3: 0,
    style4: 0,
    style5: 0,
    //规格每个类别的类别名称
    style1_name: '',
    style2_name: '',
    style3_name: '',
    style4_name: '',
    style5_name: '',
    
    //立即购买中的规格，当前选中状态
    ruleClick1: "-",
    ruleClick2: "-",
    ruleClick3: "-",
    ruleClick4: "-",
    ruleClick5: "-",
    dingZhiClick: "-",//定制
    boxClick: "-",//礼盒选中状态

    //规格回显值
    rule1: "",
    rule2: "",
    rule3: "",
    rule4: "",
    rule5: "",
    selectBox: "",//选择的礼盒名称
    selectDingZhi: '',//选择的定制工艺

    //选中的规格组合id
    sheetid1: '',
    sheetid2: '',
    sheetid3: '',
    sheetid4: '',
    sheetid5: '',

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
    soldOutShow: false,//商品下架提示信息
    isSpecialGood: false, //特定具有时效性的商品标识
    specialGoodMsgShowCount: 0,//特定具有时效性的商品，提示显示次数
    cont_hidden: '',

    showBtn: false, //是否显示右侧返回首页按钮
    isSelectNew: 0,  //默认
    from_flag: 0,//入口来源【 0：分享   商品列表】
    neibuFlag: 0,
    loadingFlag: 0,//所有规格加载完成的标志
    groupList: [],  //组合信息
    sumTotal: 0,    //总库存
    showNum: 0,     //显示的库存数量
    keys: {},//总类别集合
    keys2: {},
    dataList: {},//组合类别集合对象
    SKUResult: {},//保存最后的组合结果信息
    sizeList: [],    //总规格类别
    modelStyleNum: 0,//规格总类别数
    styleAllNum: 0,  //分类规格总数量
    clickBoxPrice : 0, //选中的礼盒的价格
    saveStyleId : '', //最终选取的组合id
    clickNum: 0,//规格已选择数量  
    cartNum: 0,//footer购物车显示的数量
    minNumber: 0,//购买数量

  },

  //重置所有变量
  resetVar : function(e){
    var that = this;
    that.setData({
      allHidden: '',
      goodPrice: 0,//商品单独的价格
      showPrice: 0,//显示的区间价格【  （商品价格 + 礼盒价格）  】
      num: 1,      //起订量
      cartNum: 0,//footer购物车显示的数量
      minNumber: 0,//购买数量
      goodsService: [],  //服务
      giftboxsize: '',   //礼盒长度
      gixboxService: [], //礼盒
      dingzhiService: [],//定制工艺
      Style1: [],        //规格
      Style2: [],
      Style3: [],
      Style4: [],
      Style5: [],

      //立即购买中的规格，当前选中状态
      ruleClick1: "-",
      ruleClick2: "-",
      ruleClick3: "-",
      ruleClick4: "-",
      ruleClick5: "-",
      boxClick: "-",//礼盒选中状态
      dingZhiClick: "-",//定制

      //规格回显值
      rule1: "",
      rule2: "",
      rule3: "",
      rule4: "",
      rule5: "",
      selectBox: "",//选择的礼盒名称
      selectDingZhi: '',//选择的定制工艺
      sheetid1: '',
      sheetid2: '',
      sheetid3: '',
      sheetid4: '',
      sheetid5: '',
      loadingFlag: 0,//所有规格加载完成的标志
      groupList: [],  //组合信息
      showNum: 0,     //显示的库存数量
      sumTotal: 0,    //总库存

      dataList: {},   //组合类别集合对象
      SKUResult: {},  //保存最后的组合结果信息
      clickNum: 0,//规格已选择数量
      clickBoxPrice: 0, //选中的礼盒的价格
      saveStyleId: '', //最终选取的组合id
      hiddenmodal: true, //弹窗
      modalCont: '',
      stateId: 0,//判断是点击的加入购物车 - 0 / 立即购买 - 1 
      maxHeight: 0,
      serviceIsShow: false,
      isShow: false,
      chooseFlag: 0,
      chooseResult: 0,
      animationData: {},
      animationDataBuy: {},
      animationDataSer: {},
      animation: {},
      styleLen: 0,
      isSpecialGood: false, //特定具有时效性的商品标识
      specialGoodMsgShowCount: 0,//特定具有时效性的商品，提示显示次数
      cont_hidden: '',
      isSelectNew: 0,  //默认
    })
  },

  onLoad: function (options) {
    var that = this;
    var host = getApp().globalData.servsers;
    var un_id = getApp().globalData.un_id;

    var neibuFlag = options.flag;//来自内部员工，则为0
    if (options.flag == undefined) {
      neibuFlag = 1;
    } else {
      wx.hideShareMenu();
    }

    if (options.from_flag == 1) {//从分享链接进入
      that.setData({
        showBtn: true
      })
    } else {
      that.setData({
        showBtn: false
      })
    }

    that.setData({
      urlHttp: host,
      com_id: options.com_id,
      from_flag: options.from_flag,
      neibuFlag: neibuFlag,
    })

    //检测商品是否下架
    wx.request({
      url: host + "commodityapi/commoditview",
      data: {
        com_id: options.com_id
      },
      method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      header: {
        'Accept': 'application/json'
      },
      success: function (res) {
        console.log(res);
        //有此商品
        if (res.data.total > 0) {
          if (res.data.commodity.commodity_flag == '1') {//此商品为下架商品
            that.setData({
              soldOutShow: true
            })
          }
        }

        var article1 = res.data.commodity.commodity_details;
        WxParse.wxParse('article1', 'html', res.data.commodity.commodity_details, that, 5)
        var acceptance = res.data.commodity.commodity_acceptance;

        if (acceptance != null && acceptance != '') {
          wx.request({//服务保证
            url: host + "acceptanceapi/findBuy",
            data: {
              id: acceptance
            },
            method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
            header: {
              'Accept': 'application/json'
            },
            success: function (res) {
              if (res.data.total > 0) {
                that.setData({
                  goodsService: res.data.rows
                })
              }
              if (res == null || res.data == null) {
                console.error('网络请求失败');
                return;
              }
            }
          });
        }

        //是否收藏
        if (un_id != undefined && un_id != '' && un_id != null) {
          wx.request({
            url: host + "collectionapi/findAllforxcx",
            data: {
              user_id: un_id,
              collection_clas: 2,
              collection_name: options.com_id,
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
        }

        that.setData({
          tuijian: res.data.commodity,
          banner: res.data.images,
          bannerShare: res.data.images[0],
          bannerSml: host + 'images/' + res.data.images[0],
          title: res.data.commodity.commodity_name,
          shangpin_id: res.data.commodity.id,
          intro: res.data.commodity.commodity_des,
          newPrice: res.data.commodity.commodity_sale,        
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
        wx.setNavigationBarTitle({
          title: res.data.commodity.commodity_name
        })
        if (res == null || res.data == null) {
          console.error('网络请求失败');
          return;
        }
      }
    })
  },



  //渲染
  loadFun: function (e) {
    var that = this;
    var host = getApp().globalData.servsers;
    var un_id = getApp().globalData.un_id;
    that.resetVar();

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
        console.log(res);
        //有此商品
        if (res.data.total > 0) {
          if (res.data.commodity.commodity_flag == '1') {//此商品为下架商品
            that.setData({
              soldOutShow: true
            })
          }
        }

        var loadingFlag = that.data.loadingFlag;//所有规则加载标识
        var giftbox = res.data.commodity.commodity_giftbox;
        if (giftbox != null && giftbox != '') {
          wx.request({//礼盒
            url: host + "giftboxapi/findBuy",
            data: {
              id: giftbox
            },
            method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
            header: {
              'Accept': 'application/json'
            },
            success: function (res) {
              if (res.data.total > 0) {
                that.setData({
                  giftboxsize: res.data.total,
                  gixboxService: res.data.rows
                })
              }
              if (res == null || res.data == null) {
                console.error('网络请求失败');
                return;
              }
            }
          });
        }

        var process = res.data.commodity.commodity_process;
        if (process != null && process != '') {
          wx.request({//定制
            url: host + "processapi/findBuy",
            data: {
              id: process
            },
            method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
            header: {
              'Accept': 'application/json'
            },
            success: function (res) {
              if (res.data.total > 0) {
                that.setData({
                  iconNum: res.data.total,
                  dingzhiService: res.data.rows
                });
              }
              if (res == null || res.data == null) {
                console.error('网络请求失败');
                return;
              }
            }
          });
        }

        var styleLength = 0;
        var keys = new Array();
        var keys2 = '';
        var modelStyleNum = 0;//规格总类别数量

        //所有规格的数量
        var styleAllNum = 0;
        var loadingFlag = 0;
        var style1 = res.data.commodity.style1;
        if (style1 != null && style1 != '' && style1 != undefined) {

          keys2 = '1_0';
          modelStyleNum++;
          wx.request({
            url: host + "datasheetapi/findAllforid",
            data: {
              id: style1
            },
            method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
            header: {
              'Accept': 'application/json'
            },
            success: function (res) {
              console.log("style");
              console.log(res);
              if (res.data.total > 0) {
                that.setData({
                  style1_name: res.data.rows[0].datasheet_com_name,
                  style1: res.data.total,
                  Style1: res.data.rows,
                });
                styleAllNum += res.data.total;
                keys[0] = new Array();
                for (var j = 0; j < res.data.total; j++) {      //二维长度为5
                  keys[0][j] = res.data.rows[j].datasheet_id;
                  that.data.sizeList.push(res.data.rows[j]);
                  that.data.Style1[j].clickTrue = true;
                }
                that.setData({
                  Style1: that.data.Style1,
                  keys: keys,
                })
                loadingFlag++;
                if (loadingFlag == 6) {
                  //组合sku
                  that.initSKU();
                }
              }
              if (res == null || res.data == null) {
                console.error('网络请求失败');
                return;
              }
            }
          });
        } else {
          loadingFlag++;
          if (loadingFlag == 6) {
            //组合sku
            that.initSKU();
          }
        }

        var style2 = res.data.commodity.style2;
        if (style2 != null && style2 != '' && style2 != undefined) {
          modelStyleNum++;
          keys2 = keys2 + '-2_0';
          wx.request({
            url: host + "datasheetapi/findAllforid",
            data: {
              id: style2
            },
            method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
            header: {
              'Accept': 'application/json'
            },
            success: function (res) {
              if (res.data.total > 0) {
                styleAllNum += res.data.total;
                that.setData({
                  style2_name: res.data.rows[0].datasheet_com_name,
                  style2: res.data.total,
                  Style2: res.data.rows,
                });
                keys[1] = new Array();
                for (var j = 0; j < res.data.total; j++) {      //二维长度为5
                  keys[1][j] = res.data.rows[j].datasheet_id;
                  that.data.sizeList.push(res.data.rows[j]);
                  that.data.Style2[j].clickTrue = true;
                }
                that.setData({
                  Style2: that.data.Style2,
                  keys: keys
                })
                loadingFlag++;
                if (loadingFlag == 6) {
                  //组合sku
                  that.initSKU();
                }
              }
              if (res == null || res.data == null) {
                console.error('网络请求失败');
                return;
              }
            }
          });
        } else {
          loadingFlag++;
          if (loadingFlag == 6) {
            //组合sku
            that.initSKU();
          }
        }

        var style3 = res.data.commodity.style3;
        if (style3 != null && style3 != '' && style3 != undefined) {
          modelStyleNum++;
          keys2 = keys2 + '-3_0';
          wx.request({
            url: host + "datasheetapi/findAllforid",
            data: {
              id: style3
            },
            method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
            header: {
              'Accept': 'application/json'
            },
            success: function (res) {
              if (res.data.total > 0) {
                styleAllNum += res.data.total;
                that.setData({
                  style3_name: res.data.rows[0].datasheet_com_name,
                  style3: res.data.total,
                  Style3: res.data.rows,
                });

                keys[2] = new Array();
                for (var j = 0; j < res.data.total; j++) {      //二维长度为5
                  keys[2][j] = res.data.rows[j].datasheet_id;
                  that.data.sizeList.push(res.data.rows[j]);
                  that.data.Style3[j].clickTrue = true;
                }
                that.setData({
                  Style3: that.data.Style3,
                  keys: keys
                });
                loadingFlag++;
                if (loadingFlag == 6) {
                  //组合sku
                  that.initSKU();
                }
              }
              if (res == null || res.data == null) {
                console.error('网络请求失败');
                return;
              }
            }
          });
        } else {
          loadingFlag++;
          if (loadingFlag == 6) {
            //组合sku
            that.initSKU();
          }
        }

        var style4 = res.data.commodity.style4;
        if (style4 != null && style4 != '' && style4 != undefined) {
          modelStyleNum++;
          keys2 = keys2 + '-4_0';
          wx.request({
            url: host + "datasheetapi/findAllforid",
            data: {
              id:style4
            },
            method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
            header: {
              'Accept': 'application/json'
            },
            success: function (res) {
              if (res.data.total > 0) {
                styleAllNum += res.data.total;
                that.setData({
                  style4_name: res.data.rows[0].datasheet_com_name,
                  style4: res.data.total,
                  Style4: res.data.rows,
                });
                keys[3] = new Array();
                for (var j = 0; j < res.data.total; j++) {      //二维长度为5
                  keys[3][j] = res.data.rows[j].datasheet_id;
                  that.data.sizeList.push(res.data.rows[j]);
                  that.data.Style4[j].clickTrue = true;
                }
                that.setData({
                  Style4: that.data.Style4,
                  keys: keys
                })
                loadingFlag++;
                if (loadingFlag == 6) {
                  //组合sku
                  that.initSKU();
                }
              }
              if (res == null || res.data == null) {
                console.error('网络请求失败');
                return;
              }
            }
          });
        } else {
          loadingFlag++;
          if (loadingFlag == 6) {
            //组合sku
            that.initSKU();
          }
        }

        var style5 = res.data.commodity.style5;
        if (style5 != null && style5 != '' && style5 != undefined) {
          modelStyleNum++;
          keys2 = keys2 + '-5_0';
          wx.request({
            url: host + "datasheetapi/findAllforid",
            data: {
              id: style5
            },
            method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
            header: {
              'Accept': 'application/json'
            },
            success: function (res) {
              if (res.data.total > 0) {
                styleAllNum += res.data.total;
                that.setData({
                  style5_name: res.data.rows[0].datasheet_com_name,
                  style5: res.data.total,
                  Style5: res.data.rows,
                });
                keys[4] = new Array();
                for (var j = 0; j < res.data.total; j++) {
                  keys[4][j] = res.data.rows[j].datasheet_id;
                  that.data.sizeList.push(res.data.rows[j]);
                  that.data.Style5[j].clickTrue = true;
                }
                that.setData({
                  Style5: that.data.Style5,
                  keys: keys
                })
                loadingFlag++;
                if (loadingFlag == 6) {
                  //组合sku
                  that.initSKU();
                }
              }
              if (res == null || res.data == null) {
                console.error('网络请求失败');
                return;
              }
            }
          });
        } else {
          loadingFlag++;
          if (loadingFlag == 6) {
            //组合sku
            that.initSKU();
          }
        }

        var dataList = new Object();
        //获取商品规则的组合【价格和库存】
        wx.request({
          url: host + 'api/commodityGroup/getAllGroupByCommodityId',
          data: {
            commodityId: that.data.com_id
          },
          method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
          header: {
            'Accept': 'application/json'
          },
          success: function (res) {
            console.log("CommodityId:");
            console.log(res);
            if (res.data.code == '200') {
              if (res.data.data.length > 0){
                var groupList = res.data.data;
                var sumTotal = 0;
                var dataLen = groupList.length;
                for (var i = 0; i < dataLen; i++) {
                  sumTotal += groupList[i].product_repertory;
                  var dataTit = groupList[i].datasheet_id;
                  var dataContList = {
                    id: groupList[i].id,
                    product_price: groupList[i].product_price,
                    product_repertory: groupList[i].product_repertory
                  };
                  dataList[dataTit] = dataContList;
                }
                that.setData({
                  sumTotal: sumTotal,
                  groupList: groupList,
                  dataList: dataList,
                  showNum: sumTotal
                })
                loadingFlag++;
                if (loadingFlag == 6) {
                  //组合sku
                  that.initSKU();
                }
              }else{

                that.setData({
                  sumTotal: 0,
                  showNum: 0
                })

                //每一个规则类别下的详细种类数量
                var style1 = that.data.style1;
                var style2 = that.data.style2;
                var style3 = that.data.style3;
                var style4 = that.data.style4;
                var style5 = that.data.style5;
                if (style1 > 0) {
                  for (var j = 0; j < style1; j++) {
                    that.data.Style1[j].clickTrue = false;
                    that.setData({
                      Style1: that.data.Style1,
                    })
                  }
                }

                if (style2 > 0) {
                  for (var j = 0; j < style2; j++) {
                    that.data.Style2[j].clickTrue = false;
                    that.setData({
                      Style2: that.data.Style2,
                    })
                  }
                }

                if (style3 > 0) {
                  for (var j = 0; j < style3; j++) {
                    var datasheetId = that.data.Style3[j].datasheet_id;
                    that.data.Style3[j].clickTrue = false;
                    that.setData({
                      Style3: that.data.Style3,
                    })
                  }
                }

                if (style4 > 0) {
                  for (var j = 0; j < style4; j++) {
                    that.data.Style4[j].clickTrue = false;
                    that.setData({
                      Style4: that.data.Style4,
                    })
                  }
                }

                if (style5 > 0) {
                  for (var j = 0; j < style5; j++) {
                    that.data.Style5[j].clickTrue = false;
                    that.setData({
                      Style5: that.data.Style5,
                    })
                  }
                }
                that.setData({
                  allHidden: 'allHidden'
                })
                wx.hideLoading();
              }
            }
          }
        })
        that.setData({
          showPrice: (res.data.maxAndMin.min == res.data.maxAndMin.max) ? res.data.maxAndMin.min :(res.data.maxAndMin.min + '-' + res.data.maxAndMin.max),
          minPrice: res.data.maxAndMin.min,//最低价格
          maxPrice: res.data.maxAndMin.max,//最高价格
          minNumber: res.data.commodity.commodity_num,
          num: res.data.commodity.commodity_num,
          keys2: [keys2],
          modelStyleNum: modelStyleNum,
          sizeList: that.data.sizeList,
          styleAllNum: styleAllNum,
          loadingFlag: that.data.loadingFlag
        });

        if (res == null || res.data == null) {
          console.error('网络请求失败');
          return;
        }
      }
    });


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

  onShow:function(e){
    var that = this;
    wx.showLoading({
      title: '',
      icon: 'loading',
      mask: true,
      success: function () {

      }
    })
    that.loadFun();
  },


  //获得对象的key
  getObjKeys: function (obj) {
    var that = this;
    if (obj !== Object(obj)) throw new TypeError('Invalid object');
    var keys = [];
    for (var key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        keys[keys.length] = key;
      }
    }
    return keys;
  },

  //初始化得到结果集
  initSKU: function () {
    var that = this;
    var dataList = that.data.dataList;//已有的规则组合信息

    //数据已有组合类
    var i, j, skuKeys = that.getObjKeys(dataList);

    //每一个规则类别下的详细种类数量
    var style1 = that.data.style1;
    var style2 = that.data.style2;
    var style3 = that.data.style3;
    var style4 = that.data.style4;
    var style5 = that.data.style5;

    for (i = 0; i < skuKeys.length; i++) {
      var skuKey = skuKeys[i];//一条SKU信息key
      var sku = dataList[skuKey]; //一条SKU信息value
      var skuKeyAttrs = skuKey.split("-"); //SKU信息key属性值数组

      skuKeyAttrs.sort(function (value1, value2) {
        return parseInt(value1) - parseInt(value2);
      });

      //对每个SKU信息key属性值进行拆分组合
      var combArr = that.combInArray(skuKeyAttrs);
      for (j = 0; j < combArr.length; j++) {
        that.addSKUResult(combArr[j], sku);
      }

      //结果集接放入SKUResult
      var SKUResult = that.data.SKUResult;
      SKUResult[skuKeyAttrs.join("-")] = {
        product_repertory: sku.product_repertory,
        product_price: [sku.product_price]
      };
    }

    var SKUResultLength = Object.keys(SKUResult).length;

    var forNum1 = 0, forNum2 = 0, forNum3 = 0, forNum4 = 0, forNum5 = 0;
    //初始化，现有单独规格是否有库存
    if (style1 > 0) {
      for (var j = 0; j < style1; j++) { 
        var datasheetId = that.data.Style1[j].datasheet_id;
        if (!SKUResult[datasheetId]) {
          forNum1++;
          that.data.Style1[j].clickTrue = false;
        } else {
          that.data.Style1[j].clickTrue = true;
        }
        that.setData({
          Style1: that.data.Style1,
        })
      }
    }

    if (style2 > 0) {
      for (var j = 0; j < style2; j++) {
        var datasheetId = that.data.Style2[j].datasheet_id;
        if (!SKUResult[datasheetId]) {
          forNum2++;
          that.data.Style2[j].clickTrue = false;
        } else {
          that.data.Style2[j].clickTrue = true;
        }
        that.setData({
          Style2: that.data.Style2,
        })
      }
    }

    if (style3 > 0) {
      for (var j = 0; j < style3; j++) {
        var datasheetId = that.data.Style3[j].datasheet_id;
        if (!SKUResult[datasheetId]) {
          forNum3++;
          that.data.Style3[j].clickTrue = false;
        } else {
          that.data.Style3[j].clickTrue = true;
        }
        that.setData({
          Style3: that.data.Style3,
        })
      }
    }

    if (style4 > 0) {
      for (var j = 0; j < style4; j++) {
        var datasheetId = that.data.Style4[j].datasheet_id;
        if (!SKUResult[datasheetId]) {
          forNum4++;
          that.data.Style4[j].clickTrue = false;
        } else {
          that.data.Style4[j].clickTrue = true;
        }
        that.setData({
          Style4: that.data.Style4,
        })
      }
    }

    if (style5 > 0) {
      for (var j = 0; j < style5; j++) {
        var datasheetId = that.data.Style5[j].datasheet_id;
        if (!SKUResult[datasheetId]) {
          forNum5++;
          that.data.Style5[j].clickTrue = false;
        } else {
          that.data.Style5[j].clickTrue = true;
        }
        that.setData({
          Style5: that.data.Style5,
        })
      }
    }

    that.setData({
      SKUResult: SKUResult,
      allHidden: 'allHidden'
    })
    wx.hideLoading();
  },

  //把组合的key放入结果集SKUResult
  addSKUResult: function ( combArrItem, sku) {
    var that = this;
    var key = combArrItem.join("-");
    var SKUResult = that.data.SKUResult;

    if (SKUResult[key]) {//SKU信息key属性·
      SKUResult[key].product_repertory += sku.product_repertory;
      SKUResult[key].product_price.push(sku.product_price);
    } else {
      SKUResult[key] = {
        product_repertory: sku.product_repertory,
        product_price: [sku.product_price]
      };
    }
    that.setData({
      SKUResult: SKUResult
    })
  },


  /**
   * 从数组中生成指定长度的组合
   * 方法: 先生成[0,1...]形式的数组, 然后根据0,1从原数组取元素，得到组合数组
   */
  combInArray: function (aData) {
    var that = this;
    if (!aData || !aData.length) {
      return [];
    }

    var len = aData.length;
    var aResult = [];

    for (var n = 1; n < len; n++) {
      var aaFlags = that.getCombFlags(len, n);
      while (aaFlags.length) {
        var aFlag = aaFlags.shift();
        var aComb = [];
        for (var i = 0; i < len; i++) {
          aFlag[i] && aComb.push(aData[i]);
        }
        aResult.push(aComb);
      }
    }
    return aResult;
  },

  /**
   * 得到从 m 元素中取 n 元素的所有组合
   * 结果为[0,1...]形式的数组, 1表示选中，0表示不选
   */
  getCombFlags: function (m, n) {
    var that = this;
    if (!n || n < 1) {
      return [];
    }

    var aResult = [];
    var aFlag = [];
    var bNext = true;
    var i, j, iCnt1;

    for (i = 0; i < m; i++) {
      aFlag[i] = i < n ? 1 : 0;
    }

    aResult.push(aFlag.concat());

    while (bNext) {
      iCnt1 = 0;
      for (i = 0; i < m - 1; i++) {
        if (aFlag[i] == 1 && aFlag[i + 1] == 0) {
          for (j = 0; j < i; j++) {
            aFlag[j] = j < iCnt1 ? 1 : 0;
          }
          aFlag[i] = 0;
          aFlag[i + 1] = 1;
          var aTmp = aFlag.concat();
          aResult.push(aTmp);
          if (aTmp.slice(-n).join("").indexOf('0') == -1) {
            bNext = false;
          }
          break;
        }
        aFlag[i] == 1 && iCnt1++;
      }
    }
    return aResult;
  },

  //选择规格时的判断 - 判断价格和库存
  chooseStyleSetData: function (datasheetId, clickNum) {
    var that = this;
    var styleAllNum = that.data.styleAllNum;
    var modelStyleNum = that.data.modelStyleNum;
    var clickBoxPrice = that.data.clickBoxPrice;//已选礼盒价格

    var SKUResult = that.data.SKUResult;

    //每个大规格下选择的小规格id
    var ruleClick1 = that.data.ruleClick1;
    var ruleClick2 = that.data.ruleClick2;
    var ruleClick3 = that.data.ruleClick3;
    var ruleClick4 = that.data.ruleClick4;
    var ruleClick5 = that.data.ruleClick5;

    //每一个规则类别下的详细种类数量
    var style1 = that.data.style1;
    var style2 = that.data.style2;
    var style3 = that.data.style3;
    var style4 = that.data.style4;
    var style5 = that.data.style5;


    if (clickNum > 0) {

      //获得组合key价格
      var selectedIds = [];

      (that.data.sheetid1 == '') ? '' : selectedIds.push(that.data.sheetid1);
      (that.data.sheetid2 == '') ? '' : selectedIds.push(that.data.sheetid2);
      (that.data.sheetid3 == '') ? '' : selectedIds.push(that.data.sheetid3);
      (that.data.sheetid4 == '') ? '' : selectedIds.push(that.data.sheetid4);
      (that.data.sheetid5 == '') ? '' : selectedIds.push(that.data.sheetid5);


      console.log("selectedIds:");
      console.log(selectedIds);
      selectedIds.sort(function (value1, value2) {
        return parseInt(value1) - parseInt(value2);
      });

      var len = selectedIds.length;

      console.log("selectedIds.join('-'):"+selectedIds.join('-'));

      var prices = SKUResult[selectedIds.join('-')].product_price;
      var maxPrice = parseFloat(Math.max.apply(Math, prices)) + + parseFloat(clickBoxPrice);
      var minPrice = parseFloat(Math.min.apply(Math, prices)) + + parseFloat(clickBoxPrice);

      
      var showNum = SKUResult[selectedIds.join('-')].product_repertory;//当前规格下的库存
      var showPrice = maxPrice > minPrice ? minPrice + "-" + maxPrice : maxPrice; //当前规格下的价格
      var num = this.data.minNumber;//当前数量
      if (num >= showNum){
        that.setData({
          minNumber: showNum
        })
      }
      that.setData({
        showPrice: showPrice,
        showNum: showNum
      })

      var siblingsSelectedObj = [];//已点选
      var siblingsSelectedObjId = [];//已点选的id的集合
      var noClickList = [];//未点选的id的集合
      var oldNoClickList = [];

      if (style1 > 0) {
        for (var i = 0; i < style1; i++) {
          var datasheet_id = that.data.Style1[i].datasheet_id;
          if (i == ruleClick1) {
            siblingsSelectedObjId.push(datasheet_id);
          } else {
            noClickList.push(datasheet_id);
            oldNoClickList.push(datasheet_id);
          }
        }
      }

      if (style2 > 0) {
        for (var i = 0; i < style2; i++) {
          var datasheet_id = that.data.Style2[i].datasheet_id;
          if (i == ruleClick2) {
            siblingsSelectedObjId.push(datasheet_id);
          } else {
            noClickList.push(datasheet_id);
            oldNoClickList.push(datasheet_id);
          }
        }
      }

      if (style3 > 0) {
        for (var i = 0; i < style3; i++) {
          var datasheet_id = that.data.Style3[i].datasheet_id;
          console.log("3-datasheetId: " + datasheet_id);
          console.log("3-1: " + i);
          console.log("3-ruleClick3: " + ruleClick3);
          if (i == ruleClick3) {
            siblingsSelectedObjId.push(datasheet_id);
          } else {
            noClickList.push(datasheet_id);
            oldNoClickList.push(datasheet_id);
          }
        }
      }

      if (style4 > 0) {
        for (var i = 0; i < style4; i++) {
          var datasheet_id = that.data.Style4[i].datasheet_id;
          if (i == ruleClick4) {
            siblingsSelectedObjId.push(datasheet_id);
          } else {
            noClickList.push(datasheet_id);
            oldNoClickList.push(datasheet_id);
          }
        }
      }

      if (style5 > 0) {
        for (var i = 0; i < style5; i++) {
          var datasheet_id = that.data.Style5[i].datasheet_id;
          if (i == ruleClick5) {
            siblingsSelectedObjId.push(datasheet_id);
          } else {
            noClickList.push(datasheet_id);
            oldNoClickList.push(datasheet_id);
          }
        }
      }

      var selectedLength = 0;  

      for (var i = 0; i < noClickList.length; i++) {

        var selectedLength = 0;
        var siblingsSelectedObjId = '';//选中规格的id
        var testAttrIds = [];//从选中节点中去掉选中的兄弟节点
       
        if (style1 > 0 && ruleClick1 != '-') {
          for (var m = 0; m < style1; m++){
            if (that.data.Style1[m].datasheet_id == noClickList[i]){
              if (that.data.Style1[ruleClick1].datasheet_id != noClickList[i]) {
                selectedLength = 1;
                siblingsSelectedObjId = that.data.Style1[ruleClick1].datasheet_id;
                break;
              }
            }
          }
        }

        if (style2 > 0 && ruleClick2 != '-') {
          for (var m = 0; m < style2; m++) {
            if (that.data.Style2[m].datasheet_id == noClickList[i]) {
              if (that.data.Style2[ruleClick2].datasheet_id != noClickList[i]) {
                selectedLength = 1;
                siblingsSelectedObjId = that.data.Style2[ruleClick2].datasheet_id;
                break;
              }
            }
          }
        }

        if (style3 > 0 && ruleClick3 != '-') {
          for (var m = 0; m < style3; m++) {
            if (that.data.Style3[m].datasheet_id == noClickList[i]) {
              if (that.data.Style3[ruleClick3].datasheet_id != noClickList[i]) {
                selectedLength = 1;
                siblingsSelectedObjId = that.data.Style3[ruleClick3].datasheet_id;
                break;
              }
            }
          }
        }

        if (style4 > 0 && ruleClick4 != '-') {
          for (var m = 0; m < style4; m++) {
            if (that.data.Style4[m].datasheet_id == noClickList[i]) {
              if (that.data.Style4[ruleClick4].datasheet_id != noClickList[i]) {
                selectedLength = 1;
                siblingsSelectedObjId = that.data.Style4[ruleClick4].datasheet_id;
                break;
              }
            }
          }
        }

        if (style5 > 0 && ruleClick5 != '-') {
          for (var m = 0; m < style5; m++) {
            if (that.data.Style5[m].datasheet_id == noClickList[i]) {
              if (that.data.Style5[ruleClick5].datasheet_id != noClickList[i]) {
                selectedLength = 1;
                siblingsSelectedObjId = that.data.Style5[ruleClick5].datasheet_id;
                break;
              }
            }
          }
        }

        if (selectedLength ) {    
          for (var j = 0; j < len; j++) {
            (selectedIds[j] != siblingsSelectedObjId) && testAttrIds.push(selectedIds[j]);
          }
        } else {
          testAttrIds = selectedIds.concat();
        }

        testAttrIds = testAttrIds.concat(noClickList[i]);

        testAttrIds.sort(function (value1, value2) {
          return parseInt(value1) - parseInt(value2);
        });

        if (style1 > 0) {
          for (var k = 0; k < style1; k++) {
            if (that.data.Style1[k].datasheet_id == noClickList[i]) {
              if (!SKUResult[testAttrIds.join('-')]) {
                that.data.Style1[k].clickTrue = false;
                if (that.data.ruleClick1 == k) {
                  that.data.ruleClick1 = '-';
                }
              } else {
                that.data.Style1[k].clickTrue = true;
              }
            }
          }
        }

        if (style2 > 0) {
          for (var k = 0; k < style2; k++) {
            if (that.data.Style2[k].datasheet_id == noClickList[i]) {
              if (!SKUResult[testAttrIds.join('-')]) {
                that.data.Style2[k].clickTrue = false;
                if (that.data.ruleClick2 == k){
                  that.data.ruleClick2 = '-';
                }
              } else {
                that.data.Style2[k].clickTrue = true;
              }
            }
          }
        }

        if (style3 > 0) {
          for (var k = 0; k < style3; k++) {
            if (that.data.Style3[k].datasheet_id == noClickList[i]) {
              if (!SKUResult[testAttrIds.join('-')]) {
                that.data.Style3[k].clickTrue = false;
                if (that.data.ruleClick3 == k) {
                  that.data.ruleClick3 = '-';
                }
              } else {
                that.data.Style3[k].clickTrue = true;
              }
            }
          }
        }

        if (style4 > 0) {
          for (var k = 0; k < style4; k++) {
            if (that.data.Style4[k].datasheet_id == noClickList[i]) {
              if (!SKUResult[testAttrIds.join('-')]) {
                that.data.Style4[k].clickTrue = false;
                if (that.data.ruleClick4 == k) {
                  that.data.ruleClick4 = '-';
                }
              } else {
                that.data.Style4[k].clickTrue = true;
              }
            }
          }
        }

        if (style5 > 0) {
          for (var k = 0; k < style5; k++) {
            if (that.data.Style5[k].datasheet_id == noClickList[i]) {
              if (!SKUResult[testAttrIds.join('-')]) {
                that.data.Style5[k].clickTrue = false;
                if (that.data.ruleClick5 == k) {
                  that.data.ruleClick5 = '-';
                }
              } else {
                that.data.Style5[k].clickTrue = true;
              }
            }
          }
        }
      }

    } else {
      var showPrice = that.data.showPrice;
      var showPrice = that.data.newPrice;
      var showNum = that.data.showNum;
      that.setData({
        showPrice: showPrice,
        showNum: showNum
      })
    }

    that.setData({
      Style1: that.data.Style1,
      Style2: that.data.Style2,
      Style3: that.data.Style3,
      Style4: that.data.Style4,
      Style5: that.data.Style5,
      ruleClick1: that.data.ruleClick1,
      ruleClick2: that.data.ruleClick2,
      ruleClick3: that.data.ruleClick3,
      ruleClick4: that.data.ruleClick4,
      ruleClick5: that.data.ruleClick5
    })
  },

  //立即购买下的规格选择
  ruleSelect: function (e) {
    var that = this
    var id = e.currentTarget.dataset.id;
    var datasheetId = e.currentTarget.dataset.sheetid;//规格id
    var ruleNum = e.currentTarget.dataset.rule;//当前规格1-5
    var styleLen = that.data.styleLen;
    var clickNum = that.data.clickNum;
    var clickBoxPrice = that.data.clickBoxPrice;

    if (ruleNum == 1) {
      if (that.data.ruleClick1 == id) {//当前为选中状态，变为取消状态
        clickNum = clickNum - 1;
        that.setData({
          ruleClick1: '-',
          rule1: '',
          styleLen: styleLen--,
          clickNum: clickNum,
          sheetid1: ''
        })

      } else {
        if (that.data.ruleClick1 == '-') {
          clickNum = clickNum + 1;
          that.setData({
            clickNum: clickNum,
          })
        }
        that.setData({
          ruleClick1: id,
          rule1: that.data.Style1[id].datasheet_name,
          styleLen: styleLen++,
          sheetid1: datasheetId
        })
      }
    } else if (ruleNum == 2) {
      if (that.data.ruleClick2 == id) {
        clickNum = clickNum - 1;
        that.setData({
          ruleClick2: '-',
          rule2: '',
          styleLen: styleLen--,
          clickNum: clickNum,
          sheetid2: ''
        })
      } else {
        if (that.data.ruleClick2 == '-') {
          clickNum = clickNum + 1;
          that.setData({
            clickNum: clickNum,
          })
        }
        that.setData({
          ruleClick2: id,
          rule2: that.data.Style2[id].datasheet_name,
          styleLen: styleLen++,
          sheetid2: datasheetId
        })
      }
    } else if (ruleNum == 3) {
      if (that.data.ruleClick3 == id) {
        clickNum = clickNum - 1;
        that.setData({
          ruleClick3: '-',
          rule3: '',
          styleLen: styleLen--,
          clickNum: clickNum,
          sheetid3: ''
        })
      } else {
        if (that.data.ruleClick3 == '-') {
          clickNum = clickNum + 1;
          that.setData({
            clickNum: clickNum,
          })
        }
        that.setData({
          ruleClick3: id,
          rule3: that.data.Style3[id].datasheet_name,
          styleLen: styleLen++,
          sheetid3: datasheetId,
        })
      }
    } else if (ruleNum == 4) {
      if (that.data.ruleClick4 == id) {
        clickNum = clickNum - 1;
        that.setData({
          ruleClick4: '-',
          rule4: '',
          styleLen: styleLen--,
          clickNum: clickNum,
          sheetid4: ''
        })
      } else {
        if (that.data.ruleClick4 == '-') {
          clickNum = clickNum + 1;
          that.setData({
            clickNum: clickNum,
          })
        }
        that.setData({
          ruleClick4: id,
          rule4: that.data.Style4[id].datasheet_name,
          styleLen: styleLen++,
          sheetid4: datasheetId
        })
      }
    } else {
      if (that.data.ruleClick5 == id) {
        clickNum = clickNum - 1;
        that.setData({
          ruleClick5: '-',
          rule5: '',
          styleLen: styleLen--,
          clickNum: clickNum,
          sheetid5: ''
        })
      } else {
        if (that.data.ruleClick5 == '-') {
          clickNum = clickNum + 1;
          that.setData({
            clickNum: clickNum,
          })
        }
        that.setData({
          ruleClick5: id,
          rule5: that.data.Style5[id].datasheet_name,
          styleLen: styleLen++,
          sheetid5: datasheetId
        })
      }
    }

    //分别与已点规格组合，判断是否有库存可选
    that.chooseStyleSetData(datasheetId, clickNum);

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

  //立即购买下的选择礼盒
  boxSelect: function (options) {
    var that = this
    var id = options.currentTarget.dataset.id;
    var boxPrice = that.data.gixboxService[id].box_price;

    var modelStyleNum = that.data.modelStyleNum;//规格类别数
    var clickNum = that.data.clickNum;
    if (boxPrice == '' || boxPrice == null || boxPrice == undefined) {
      that.setData({
        clickBoxPrice: 0
      })
    }

    if (that.data.boxClick == id) {//变为取消状态
      if (modelStyleNum == clickNum) {
        that.setData({
          showPrice: parseFloat(that.data.showPrice) - parseFloat(boxPrice)
        })
      }
      that.setData({
        boxClick: '-',
        selectBox: '',
        clickBoxPrice : 0
      })
      if (that.data.styleLen == 0) {
        that.setData({
          chooseResult: 0
        })
      }
      
    } else {

      if (modelStyleNum == clickNum) {
        that.setData({
          showPrice: parseFloat(that.data.showPrice) - parseFloat(that.data.clickBoxPrice) + parseFloat(boxPrice)
        })
      }
      that.setData({
        chooseResult: 1,
        boxClick: id,
        selectBox: that.data.gixboxService[id].giftbox_name,
        clickBoxPrice: boxPrice
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
        selectDingZhi: that.data.dingzhiService[id].process_name
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
    var showNum = that.data.showNum;
    let num = this.data.minNumber;
    if (num >= showNum){
      that.setData({
        hiddenmodal: false,
        modalCont: '超出库存',
        minNumber: showNum
      })
      setTimeout(function () {
        that.setData({
          hiddenmodal: true,
        })
      }, 1000)
      return false;
    }else{
      num++;
      if (num == showNum){
        this.setData({
          "minNumber": num,
        })
      }else{
        this.setData({
          "minNumber": num,
        })
      }
    }
  },

  //绑定减数量事件
  minusCount(e) {
    let num = this.data.minNumber;
    let minnum = this.data.num;
    if (num <= minnum) {
      that.setData({
        hiddenmodal: false,
        modalCont: '起订量为' + minnum + '件',
        minNumber: showNum
      })
      setTimeout(function () {
        that.setData({
          hiddenmodal: true,
        })
      }, 1000)
      return false;
    }
    num--;
    this.setData({
      "minNumber": num
    })
  },

  //手动填写数量
  writeNum: function (e) {
    var that = this;
    var val = e.detail.value;
    var minnum = that.data.num;//起订量
    var showNum = that.data.showNum;//获取库存

    if (parseInt(val) >= parseInt(showNum)) {//大于库存
      that.setData({
        minNumber: showNum
      })
    } else if (parseInt(val) < parseInt(minnum)) {//小于起订量
      that.setData({
        minNumber: minnum
      })
    } else {
      that.setData({
        minNumber: val
      })
    }
  },

  //加入购物车 - 打开选择弹窗
  addCart: function (e) {
    var that = this;
    var scrollTop = that.data.scrollTop;
    var com_id = that.data.com_id;//商品id
    var specialGoodMsgShowCount = that.data.specialGoodMsgShowCount;//有时效性的商品，提示显示的次数

    //判断商品是否已下架，若下架则不可点击
    var soldOutShow = that.data.soldOutShow;
    if (soldOutShow == true) {
      return false;
    }

    that.setData({
      chooseFlag: 0,//判断进入购买的入口【底部footer】
      stateId: 0,
      cont_hidden: 'cont_hidden'
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
    }.bind(this), 200);

    //判断是否是特定的时效商品
    if (com_id == '3419') {
      if (specialGoodMsgShowCount == 0) {
        that.setData({
          isSpecialGood: true,
          specialGoodMsgShowCount: specialGoodMsgShowCount + 1
        })
      }
    }

  },

  //立即购买 - 打开选择弹窗
  buyCart: function (e) {
    var that = this;
    var scrollTop = that.data.scrollTop;
    var com_id = that.data.com_id;//商品id
    var specialGoodMsgShowCount = that.data.specialGoodMsgShowCount;//有时效性的商品，提示显示的次数

    //判断商品是否已下架，若下架则不可点击
    var soldOutShow = that.data.soldOutShow;
    if (soldOutShow == true) {
      return false;
    }

    this.setData({
      chooseFlag: 0,//判断进入购买的入口【底部footer】
      stateId: 1,
      cont_hidden: 'cont_hidden'
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
    }.bind(this), 200);

    //判断是否是特定的时效商品
    if (com_id == '3419') {
      if (specialGoodMsgShowCount == 0) {
        that.setData({
          isSpecialGood: true,
          specialGoodMsgShowCount: specialGoodMsgShowCount + 1
        })
      }
    }
  },

  //跳转到购物车
  linkCart: function (e) {
    wx.navigateTo({
      url: '/pages/carInsert/carInsert'
    })
  },

  //收藏
  collect: function (e) {
    var dataState = e.currentTarget.dataset.state;
    var host = getApp().globalData.servsers;
    var un_id = getApp().globalData.un_id;
    var openid = getApp().globalData.openid;

    var that = this;
    if ((un_id == undefined || un_id == '' || un_id == null) || (openid == undefined || openid == '' || openid == null)) {
      wx.navigateTo({
        url: '/pages/authorize/authorize?link=buy',
      })
    } else {
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

    }
  },

  //立即购买-去付款
  tz: function (e) {
    var that = this;
    var host = getApp().globalData.servsers;
    var un_id = getApp().globalData.un_id;
    var openid = getApp().globalData.openid;

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

    var comGroupId = [];

    var styleName1 = '', styleName2 = '', styleName3 = '', styleName4 = '', styleName5 = '';
    var styleId1 = '', styleId2 = '', styleId3 = '', styleId4 = '', styleId5 = '';

    //规格 : 名称 当前选中的index 当前选中的对应数据Id

    var style1 = that.data.Style1;
    var style1 = that.data.Style1;
    if (style1 == undefined || style1 == '' || style1 == null) {
      styleName1 = '';
      styleId1 = '';
    } else {
      var styleIndex1 = that.data.ruleClick1;
      if (styleIndex1 == '-') {
        that.setData({
          hiddenmodal: false,
          modalCont: '请选择' + that.data.style1_name
        })
        setTimeout(function () {
          that.setData({
            hiddenmodal: true
          })
        }, 1000)
        return false;
      } else {
        styleId1 = that.data.Style1[styleIndex1].id;
        styleName1 = that.data.Style1[styleIndex1].datasheet_name;
        comGroupId.push(that.data.Style1[styleIndex1].datasheet_id);
      }
    }

    var style2 = that.data.Style2;
    if (style2 == undefined || style2 == '' || style2 == null) {
      styleName2 = '';
      styleId2 = '';
    } else {
      var styleIndex2 = that.data.ruleClick2;
      if (styleIndex2 == '-') {
        that.setData({
          hiddenmodal: false,
          modalCont: '请选择' + that.data.style2_name
        })
        setTimeout(function () {
          that.setData({
            hiddenmodal: true
          })
        }, 1000)
        return false;
      } else {
        styleId2 = that.data.Style2[styleIndex2].id;
        styleName2 = that.data.Style2[styleIndex2].datasheet_name;
        comGroupId.push(that.data.Style2[styleIndex2].datasheet_id);
      }
    }

    var style3 = that.data.Style3;
    if (style3 == undefined || style3 == '' || style3 == null) {
      styleName3 = '';
      styleId3 = '';
    } else {
      var styleIndex3 = that.data.ruleClick3;
      if (styleIndex3 == '-') {
        that.setData({
          hiddenmodal: false,
          modalCont: '请选择' + that.data.style3_name
        })
        setTimeout(function () {
          that.setData({
            hiddenmodal: true
          })
        }, 1000)
        return false;
      } else {
        styleId3 = that.data.Style3[styleIndex3].id;
        styleName3 = that.data.Style3[styleIndex3].datasheet_name;
        comGroupId.push(that.data.Style3[styleIndex3].datasheet_id);
      }
    }

    var style4 = that.data.Style4;
    if (style4 == undefined || style4 == '' || style4 == null) {
      styleName4 = '';
      styleId4 = '';
    } else {
      var styleIndex4 = that.data.ruleClick4;
      if (styleIndex4 == '-') {
        that.setData({
          hiddenmodal: false,
          modalCont: '请选择' + that.data.style4_name
        })
        setTimeout(function () {
          that.setData({
            hiddenmodal: true
          })
        }, 1000)
        return false;
      } else {
        styleId4 = that.data.Style4[styleIndex4].id;
        styleName4 = that.data.Style1[styleIndex4].datasheet_name;
        comGroupId.push(that.data.Style4[styleIndex4].datasheet_id);
      }
    }

    var style5 = that.data.Style5;
    if (style5 == undefined || style5 == '' || style5 == null) {
      styleName5 = '';
      styleId5 = '';
    } else {
      var styleIndex5 = that.data.ruleClick5;
      if (styleIndex5 == '-') {
        that.setData({
          hiddenmodal: false,
          modalCont: '请选择' + that.data.style5_name
        })
        setTimeout(function () {
          that.setData({
            hiddenmodal: true
          })
        }, 1000)
        return false;
      } else {
        styleId5 = that.data.Style5[styleIndex5].id;
        styleName5 = that.data.Style5[styleIndex5].datasheet_name;
        comGroupId.push(that.data.Style5[styleIndex5].datasheet_id);
      }

    }

    var comGroupIdVal = comGroupId.join('-');
    var saveStyleId = '';

    for (var i = 0; i < that.data.groupList.length;i++){
      if (that.data.groupList[i].datasheet_id == comGroupIdVal){
        saveStyleId = that.data.groupList[i].id;
      }
    }


    //礼盒 名称 当前选中的index 当前选中的对应数据Id
    var selectBox = this.data.gixboxService;
    if (selectBox == undefined || selectBox == '') {
      var selectBoxName = '';
      var selectBoxId = -1;
      var selectBoxPrice = 0;
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
      var selectDingZhiId = -1;
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

    if ((un_id == undefined || un_id == '' || un_id == null) || (openid == undefined || openid == '' || openid == null)) {
      wx.navigateTo({
        url: '/pages/authorize/authorize?link=buy',
      })
    } else {


      var name = that.data.title;
      var com_id = that.data.com_id;
      var logo = that.data.bannerSml;
      var cost = that.data.newPrice;
      var acceptance = that.data.acceptance;
      var cyc = that.data.cycle;
      var minNumber = that.data.minNumber;
      var limitNum = that.data.num;//起订量

      var allPrice = parseFloat(that.data.showPrice);//商品总价格【价格 + 礼盒价格】 
      var goodPrice = parseFloat(that.data.showPrice) - parseFloat(that.data.clickBoxPrice);//商品单独的价格


      if (id == 0) {//加入购物车

        let num = parseInt(that.data.minNumber);
        let oldNum = parseInt(that.data.cartNum);
        let newNum = oldNum + num;
        if (newNum > 99) {
          that.setData({
            'cartNum': '99+'
          })
        } else {
          that.setData({
            'cartNum': newNum
          })
        }

        //加入购物车
        wx.request({
          url: host + "shoppingcartapi/insertshoppingcart",
          data: {
            user_id: un_id,
            com_id: com_id,
            name: name,
            logo: logo,
            cost: goodPrice,
            cyc: cyc,
            num: minNumber,
            minNumber: limitNum,
            acceptance: acceptance,
            flag: 1,
            giftbox: selectBoxId,
            giftbox_name: selectBoxName,
            box_price: that.data.clickBoxPrice,
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
            style5_name: styleName5,
            style5: styleId5,
            comGroupId: saveStyleId,//商品组合规格id
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
          cost: goodPrice,//商品单独的价格
          cyc: cyc,
          num: minNumber,
          acceptance: acceptance,
          region: region,
          specifications: specifications,
          flag: 1,
          giftbox: selectBoxId,
          giftbox_name: selectBoxName,
          box_price: that.data.clickBoxPrice,
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
          new_price: that.data.showPrice,
          com_group_id: saveStyleId,//商品组合规格id
        }];

        this.setData({
          carts: carts
        })

        var newCarts = JSON.stringify(that.data.carts);
        newCarts = newCarts.replace(/&/g, "zss");
        wx.navigateTo({
          url: '/pages/confirmOrder/confirmOrder?carts=' + newCarts,
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
        timingFunction: 'linear'
      })

      this.animation = animation;
      animation.bottom(0).step()
      this.setData({
        isShow: false,
        cont_hidden: '',
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

    }
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
      chooseFlag: 1,
      cont_hidden: 'cont_hidden'
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
      stateId: 0,
      cont_hidden: 'cont_hidden'
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
        windBgShow: animation.export(),
        cont_hidden: ''
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
      chooseFlag: 0,
      cont_hidden: ''
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
      path: '/pages/buy/buy?com_id=' + that.data.com_id + '&from_flag=' + 1,
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
  },

  //关闭具有时效性商品的购买提示
  closeMsg: function () {
    var that = this;
    that.setData({
      isSpecialGood: false
    })
  },

  //返回首页
  backIndex: function (e) {
    wx.switchTab({
      url: '/pages/index/index',
    })
  }


})
var that;
var imageUtil = require('../../utils/util.js'); 