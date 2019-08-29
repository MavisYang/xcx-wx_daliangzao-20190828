// articleInfor.js
var app = getApp();
var WxParse = require('../../wxParse/wxParse.js');
var articleInfor = {
};
var articleInfor1 = {
};
Page({

  /**
   * 页面的初始数据
   */
  data: {
    id : '',//当前详情对应的id
    isSelect: false,
    articleInfor: articleInfor,
    articleInfor1: articleInfor1,
    find_content: '',
    find_content2: '',
    find_content3: '',
    find_content4: '',
    find_content5: '',
    goods1: '',
    goods2: '',
    goods3: '',
    goods4: '',
    goods5: '',
    find_name: '',
    find_sta: '',
    find_des: '',
    find_logo: '',
    find_yuedu: '',
    find_shoucang: '',
    find_sro: '',
    find_lev: '',
    img1: '',
    img2: '',
    img3: '',
    img4: '',
    img5: '',
    cmname1: '',
    cmname2: '',
    cmname3: '',
    cmname4: '',
    cmname5: '',

    title1: '',
    title2: '',
    title3: '',
    title4: '',
    title5: '',

    price1: '',
    price2: '',
    price3: '',
    price4: '',
    price5: '',
    
    id1: '',
    id2: '',
    id3: '',
    id4: '',
    id5: '',
    wxParseData:'',
    title: '',
    hiddenmodal: true, //弹窗
    modalCont: '',
    showBtn: false, //是否显示右侧返回首页按钮
    isSelectNew: 0,  //默认
    from_flag: 0
  },


  selectZan:function(e){
    var that = this;
    var opera = e.currentTarget.dataset.opera;
    var id = e.currentTarget.dataset.id;
    var find_shoucangnew = that.data.find_shoucang
    var host = getApp().globalData.servsers;
    var un_id = getApp().globalData.un_id;




    if (un_id != undefined && un_id != '' && un_id != null){
      if (opera == false) {
        //后台增加收藏数量
        wx.request({
          url: host + "findapi/updateFindforshoucang",
          data: {
            id: id
          },
          method: 'GET',
          header: {
            'Accept': 'application/json'
          },
          success: function (res) {
            var size = res.data.total;

            that.setData({
              navList: res.data.rows
            });
            if (res == null || res.data == null) {
              console.error('网络请求失败');
              return;
            }
          }
        })
        //后台增加收藏用户收藏数据
        wx.request({
          url: host + "collectionapi/insertcollection",
          data: {
            user_id: un_id,
            collection_clas: 1,
            collection_name: id,
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

        that.setData({
          isSelect: true,
          find_shoucang: parseInt(find_shoucangnew) + 1
        })
      } else {
        //后台删除收藏用户收藏数量
        wx.request({
          url: host + "collectionapi/deleteforxcx",
          data: {
            user_id: un_id,
            collection_clas: 1,
            collection_name: id,
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

        //后台删除收藏用户收藏数据
        wx.request({
          url: host + "findapi/updateFindforshoucangfu",
          data: {
            id: id
          },
          method: 'GET',
          header: {
            'Accept': 'application/json'
          },
          success: function (res) {
            var size = res.data.total;

            that.setData({
              navList: res.data.rows
            });
            if (res == null || res.data == null) {
              console.error('网络请求失败');
              return;
            }
          }
        })
        this.setData({
          isSelect: false,
          find_shoucang: parseInt(find_shoucangnew) - 1
        })
      }

    }

    
  },
  onLoad: function (options) {
    var that = this;
    // WxParse.wxParse('content', 'html', content, that, 5);
    var host = getApp().globalData.servsers;
    var un_id = getApp().globalData.un_id;
    that.data.id = options.id;

    if (un_id != undefined){
      wx.request({
        url: host + "collectionapi/findAllforxcx",
        data: {
          user_id: un_id,
          collection_clas: 1,
          collection_name: options.id,
        },
        method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
        header: {
          'Accept': 'application/json'
        },
        success: function (res) {
          //查看该用户是否收藏发现文章res.data.total =0 没有收藏
          if (res.data.total == 0) {
            that.setData({
              isSelect: false
            })
          } else {
            that.setData({
              isSelect: true
            })
          }
          if (res == null || res.data == null) {
            console.error('网络请求失败');
            return;
          }
        }
      })
    }
   
    //增加阅读量
    wx.request({
      url: host +"findapi/updateFindforread",
      data: {
        id: options.id
      },
      method: 'GET',
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
    that.setData({
      title: options.title,
      intro: options.intro,
      id: options.id,
      src: options.src,
      from_flag: options.from_flag,
    })

    if (options.from_flag == 1) {//从分享链接进入
      that.setData({
        showBtn: true
      })
    } else {
      that.setData({
        showBtn: false
      })
    }

    //首页banner
    wx.request({
      url: host+"findapi/findListview",
      data: {
        id: options.id
      },
      method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      header: {
        'Accept': 'application/json'
      },
      success: function (res) {
        // console.log(WxParse.wxParse('article', 'html', res.data.rows[0].find_content, that, 5));
        if(res.data.rows[0].goods1!=null){
          var article = res.data.rows[0].find_content;
          WxParse.wxParse('article', 'html', res.data.rows[0].find_content, that, 5)

          var article1 = res.data.rows[0].find_content2;
          WxParse.wxParse('article1', 'html', res.data.rows[0].find_content2, that, 5)

          var article2 = res.data.rows[0].find_content3;

          WxParse.wxParse('article2', 'html', res.data.rows[0].find_content3, that, 5)

          var article3 = res.data.rows[0].find_content4;

          WxParse.wxParse('article3', 'html', res.data.rows[0].find_content4, that, 5)

          var article4 = res.data.rows[0].find_content5;
          WxParse.wxParse('article4', 'html', res.data.rows[0].find_content5, that, 5)
          wx.request({
            url: host + "commodityapi/commoditview",
            data: {
              com_id: res.data.rows[0].goods1,
            },
            method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
            header: {
              'Accept': 'application/json'
            },
            success: function (res) {
              if (res.data.commodity == undefined){
                console.log('商品已下架');
                return false;
              }else{
                that.setData({
                  id1: res.data.commodity.id,
                  img1: host + 'images/' + res.data.images[0],
                  cmname1: res.data.commodity.commodity_name,
                  title1: res.data.commodity.commodity_des,
                  price1: res.data.commodity.commodity_sale,
                  oldPrice1: res.data.commodity.commodity_cost
                });
              }
              if (res == null || res.data == null) {
                console.error('网络请求失败');
                return;
              }
            }
          });
          
        }
        if (res.data.rows[0].goods2 != '0') {

          wx.request({
            url: host + "commodityapi/commoditview",
            data: {
              com_id: res.data.rows[0].goods2
            },
            method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
            header: {
              'Accept': 'application/json'
            },
            success: function (res) {
              if (res.data.commodity == undefined) {
                console.log('商品已下架');
                return false;
              } else {
                that.setData({
                  id2: res.data.commodity.id,
                  img2: host+'images/' + res.data.images[0],
                  cmname2: res.data.commodity.commodity_name,
                  title2: res.data.commodity.commodity_des,
                  price2: res.data.commodity.commodity_sale,
                  oldPrice2: res.data.commodity.commodity_cost
                });
              }
              if (res == null || res.data == null) {
                console.error('网络请求失败');
                return;
              }
            }
          })
        }
        if (res.data.rows[0].goods3 != '0') {

          wx.request({
            url: host + "commodityapi/commoditview",
            data: {
              com_id: res.data.rows[0].goods3
            },
            method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
            header: {
              'Accept': 'application/json'
            },
            success: function (res) {
              if (res.data.commodity == undefined) {
                console.log('商品已下架');
                return false;
              } else {
                that.setData({
                  id3: res.data.commodity.id,
                  img3: host+'images/' + res.data.images[0],
                  cmname3: res.data.commodity.commodity_name,
                  title3: res.data.commodity.commodity_des,
                  price3: res.data.commodity.commodity_sale,
                  oldPrice3: res.data.commodity.commodity_cost
                });
              }
              if (res == null || res.data == null) {
                console.error('网络请求失败');
                return;
              }
            }
          })
        }
        if (res.data.rows[0].goods4 != '0') {

          wx.request({
            url: host + "commodityapi/commoditview",
            data: {
              com_id: res.data.rows[0].goods4
            },
            method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
            header: {
              'Accept': 'application/json'
            },
            success: function (res) {
              if (res.data.commodity == undefined) {
                console.log('商品已下架');
                return false;
              } else {
                that.setData({
                  id4: res.data.commodity.id,
                  img4: host+'images/' + res.data.images[0],
                  cmname4: res.data.commodity.commodity_name,
                  title4: res.data.commodity.commodity_des,
                  price4: res.data.commodity.commodity_sale,
                  oldPrice4: res.data.commodity.commodity_cost
                });
              }
              if (res == null || res.data == null) {
                console.error('网络请求失败');
                return;
              }
            }
          })
        }
        if (res.data.rows[0].goods5 != '0') {

          wx.request({
            url: host + "commodityapi/commoditview",
            data: {
              com_id: res.data.rows[0].goods5
            },
            method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
            header: {
              'Accept': 'application/json'
            },
            success: function (res) {
              if (res.data.commodity == undefined) {
                console.log('商品已下架');
                return false;
              } else {
                that.setData({
                  id5: res.data.commodity.id,
                  img5: host+'images/' + res.data.images[0],
                  cmname5: res.data.commodity.commodity_name,
                  title5: res.data.commodity.commodity_des,
                  price5: res.data.commodity.commodity_sale,
                  oldPrice5: res.data.commodity.commodity_cost
                });
              }
              if (res == null || res.data == null) {
                console.error('网络请求失败');
                return;
              }
            }
          })
        }
       
        that.setData({
            find_content: res.data.rows[0].find_content,
            find_content2: res.data.rows[0].find_content2,
            find_content3: res.data.rows[0].find_content3,
            find_content4: res.data.rows[0].find_content4,
            find_content5: res.data.rows[0].find_content5,
            find_name: res.data.rows[0].find_name,
            find_sta: res.data.rows[0].find_sta,
            find_des: res.data.rows[0].find_des,
            find_logo: res.data.rows[0].find_logo,
            find_yuedu: res.data.rows[0].find_yuedu,
            find_shoucang: res.data.rows[0].find_shoucang,
            find_sro: res.data.rows[0].find_sro,
            find_lev: res.data.rows[0].find_lev,

            goods1: res.data.rows[0].goods1,
            goods2: res.data.rows[0].goods2,
            goods3: res.data.rows[0].goods3,
            goods4: res.data.rows[0].goods4,
            goods5: res.data.rows[0].goods5,

            title: res.data.rows[0].find_name
        });
        wx.setNavigationBarTitle({
          title: res.data.rows[0].find_name
        })
        if (res == null || res.data == null) {
          console.error('网络请求失败');
          return;
        }
      }
    });
    
  },
  onShareAppMessage: function (res) {//页面分享
    var that = this;
    var host = getApp().globalData.servsers;
    if (res.from === 'button') {
      // 来自页面内转发按钮
      console.log(res.target)
    }
    return {
      title: that.data.title,
      path: '/pages/articleInfor/articleInfor?id=' + that.data.id + '&from_flag=' + 1,
      imageUrl: that.data.find_logo,
      success: function (res) {
        // 转发成功
        that.setData({
          hiddenmodal: false,
          modalCont: '转发成功'
        })
        setTimeout(function () {
          that.setData({
            hiddenmodal: true
          })
        }, 1000)
      },
      fail: function (res) {
        // 转发失败
      }
    }
  },

  //返回首页
  backIndex: function (e) {
    wx.switchTab({
      url: '/pages/index/index',
    })
  }
  
})
var that;
var Util = require('../../utils/util.js'); 