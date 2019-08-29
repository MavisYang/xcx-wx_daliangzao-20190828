// pages/patternList/patternList.js
var navlist = [
    { id: " ", title: "综合", icon: "../../images/search_list_zh_pre.png" },
    { id: "price", title: "价格", icon: "../../images/search_list_zh_n.png" }
];

// 热销新品
var contentList = [
];

Page({
    data: {
        pageNo: 1,
        activeIndex: 0,
        navList: navlist,
        contentList: contentList,
        navId: 0,
        systemInfo: [],
        loadingHidden: false,
        list: [],
        num: 1,
        limt: 20,
        tab: '',
        pre0: "../../images/search_list_zh_pre.png",
        n0: "../../images/search_list_zh_n.png",
        pre: "../../images/search_list_zh_pre.png",
        n: "../../images/search_list_zh_n.png",
        noActPrice: '/images/search_jt_price_up.png',
        dataVal: "0",
        hidden: false,
        page: 0,
        size: 20,
        hasMore: true,
        hasRefesh: false,
        commodity_name: '',
        host: '',
        searchPageNum: 0,   // 设置加载的第几次，默认是第一次  
        callbackcount: 10,      //返回数据的个数  
        searchLoading: false, //"上拉加载"的变量，默认false，隐藏  
        searchLoadingComplete: false,  //“没有数据”的变量，默认false，隐藏  
        tab: '',
        tabVal: '',
        activeId1 : '商务选礼',
        activeId2: '',
        activeId3: '',
        posYes : false,  //当前滚动条位置是否是
        screenH : '',  //屏幕高度
        scrollTop : 0, //滚动高度
        scrollTopFlag: 0,//滚动高度标志位
        showMsg: true,  //显示切换模式提示
        showChangeModel: false,  //显示切换模式确认弹窗
        collectState : false ,  //商品是否收藏
        scrollFlag : false,
        scrollId : ''
    },
    onLoad: function (options) {
        var that = this;
        var host = getApp().globalData.servsers;
        var un_id = getApp().globalData.un_id;

        wx.getSystemInfo({
          success: function (res) {
            that.setData({
              screenH: res.windowHeight
            })
          }
        })  

        var activeId1 = options.activeId1;
        var activeId2 = options.activeId2;
        var activeId3 = options.activeId3;

        var activeName1 = options.activeName1;
        var activeName2 = options.activeName2;
        var activeName3 = options.activeName3;

        that.setData({
            activeId1: activeId1,
            activeId2: activeId2,
            activeId3: activeId3,
            activeName1: activeName1,
            activeName2: activeName2,
            activeName3: activeName3
        })

        
        //检索商品列表
        wx.request({
          url: host + "commodityapi/findCommodityByPrms",
            data: {
              purposeId: activeId1,
              objectId: activeId2,
              priceType: activeId3,
              sortType :1,
              offset: 0,
              limit: 10
            },
            method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
            header: {
                'Accept': 'application/json'
            },
            success: function (res) {
                that.setData({
                    contentList: res.data.rows,
                    searchPageNum: 0,   //第一次加载，设置1  
                    searchSongList: [],  //放置返回数据的数组,设为空  
                    isFromSearch: true,  //第一次加载，设置true  
                    searchLoading: true,  //把"上拉加载"的变量设为true，显示  
                    searchLoadingComplete: false //把“没有数据”设为false，隐藏 
                });
                if (res.data.rows.length < 10) {
                    that.setData({
                        searchPageNum: 0,   //第一次加载，设置1  
                        searchSongList: [],  //放置返回数据的数组,设为空  
                        isFromSearch: true,  //第一次加载，设置true  
                        searchLoading: false,  //把"上拉加载"的变量设为true，显示  
                        searchLoadingComplete: false //把“没有数据”设为false，隐藏 
                    });
                }
                if (res == null || res.data == null) {
                    console.error('网络请求失败');
                    return;
                }
            }
        });

    },
    //切换TAB
    tagChoose: function (options) {
        var that = this
        var id = options.currentTarget.dataset.id;
        var index = e.currentTarget.dataset.index;
        var type = e.currentTarget.dataset.dataType;
        if (id == "price" && type == '1') {//价格
            that.setData({
                activeIndex: index,
                pageNo: 1,
                pre: "../../images/search_list_zh_n.png"
            })
        } else {//综合
            //设置当前样式
            if (type == '0') {//选择综合
                that.setData({
                    noActPrice: '/images/search_jt_price_up.png'
                })
            }
            that.setData({
                activeIndex: index,
                pageNo: 1
            })
        }
    },

    onTapTag: function (e) {
        var that = this;
        var host = getApp().globalData.servsers;
        var tab = e.currentTarget.id;
        var index = e.currentTarget.dataset.index;
        var tabType = e.currentTarget.dataset.type;
        var tabVal = e.currentTarget.dataset.val;//标志是否是一个tab点击多次（价格）
        that.setData({
            tab: tab,
            tabVal: tabVal,
            searchPageNum: 0
        })

        if (tab == "price" && tabVal == '0') {//切换数据 为  从低到高  （箭头朝上） 
            wx.request({
              url: host + "commodityapi/findCommodityByPrms",
                data: {
                  purposeId: that.data.activeId1,
                  objectId: that.data.activeId2,
                  priceType: that.data.activeId3,
                  sortType : 2,
                  offset: 0,
                  limit: 10
                },
                method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
                header: {
                    'Accept': 'application/json'
                },
                success: function (res) {
                    that.setData({
                        contentList: res.data.rows,
                        activeIndex: index,
                        tab: tab,
                        scrollTop: 0, //回到顶部
                        pageNo: 1,
                        dataVal: "1",
                        pre: "../../images/search_list_zh_n.png",
                        searchPageNum: 0,   //第一次加载，设置1  
                        searchSongList: [],  //放置返回数据的数组,设为空  
                        isFromSearch: true,  //第一次加载，设置true  
                        searchLoading: true,  //把"上拉加载"的变量设为true，显示  
                        searchLoadingComplete: false //把“没有数据”设为false，隐藏 
                    });
                    if (res.data.rows.length < 10) {
                        that.setData({
                            searchPageNum: 0,   //第一次加载，设置1  
                            searchSongList: [],  //放置返回数据的数组,设为空  
                            isFromSearch: true,  //第一次加载，设置true  
                            searchLoading: false,  //把"上拉加载"的变量设为true，显示  
                            searchLoadingComplete: false //把“没有数据”设为false，隐藏 
                        });
                    }
                    if (res == null || res.data == null) {
                        console.error('网络请求失败');
                        return;
                    }
                }
            });

        } else if (tab == "price" && tabVal == '1') {//切换数据 为  从高到低  （箭头朝下）
            wx.request({
              url: host + "commodityapi/findCommodityByPrms",
                data: {
                  purposeId: that.data.activeId1,
                  objectId: that.data.activeId2,
                  priceType: that.data.activeId3,
                  sortType: 3,
                  offset: 0,
                  limit: 10
                },
                method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
                header: {
                    'Accept': 'application/json'
                },
                success: function (res) {
                    that.setData({
                        contentList: res.data.rows,
                        activeIndex: index,
                        tab: tab,
                        scrollTop: 0, //回到顶部
                        pageNo: 1,
                        dataVal: "0",
                        pre: "../../images/search_list_zh_pre.png",
                        searchPageNum: 0,   //第一次加载，设置1  
                        searchSongList: [],  //放置返回数据的数组,设为空  
                        isFromSearch: true,  //第一次加载，设置true  
                        searchLoading: true,  //把"上拉加载"的变量设为true，显示  
                        searchLoadingComplete: false //把“没有数据”设为false，隐藏 
                    });
                    if (res.data.rows.length < 10) {
                        that.setData({
                            searchPageNum: 0,   //第一次加载，设置1  
                            searchSongList: [],  //放置返回数据的数组,设为空  
                            isFromSearch: true,  //第一次加载，设置true  
                            searchLoading: false,  //把"上拉加载"的变量设为true，显示  
                            searchLoadingComplete: false //把“没有数据”设为false，隐藏 
                        });
                    }
                    if (res == null || res.data == null) {
                        console.error('网络请求失败');
                        return;
                    }
                }
            });

        } else { 

            //检索商品列表
            wx.request({
              url: host + "commodityapi/findCommodityByPrms",
                data: {
                  purposeId: that.data.activeId1,
                  objectId: that.data.activeId2,
                  priceType: that.data.activeId3,
                  sortType: 1,
                  offset: 0,
                  limit: 10
                },
                method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
                header: {
                    'Accept': 'application/json'
                },
                success: function (res) {
                    that.setData({
                        contentList: res.data.rows,
                        scrollTop: 0, //回到顶部
                        host: host, searchPageNum: 0,   //第一次加载，设置1  
                        searchSongList: [],  //放置返回数据的数组,设为空  
                        isFromSearch: true,  //第一次加载，设置true  
                        searchLoading: true,  //把"上拉加载"的变量设为true，显示  
                        searchLoadingComplete: false //把“没有数据”设为false，隐藏 
                    });
                    if (res.data.rows.length < 10) {
                        that.setData({
                            searchPageNum: 0,   //第一次加载，设置1  
                            searchSongList: [],  //放置返回数据的数组,设为空  
                            isFromSearch: true,  //第一次加载，设置true  
                            searchLoading: false,  //把"上拉加载"的变量设为true，显示  
                            searchLoadingComplete: false //把“没有数据”设为false，隐藏 
                        });
                    }
                    if (res == null || res.data == null) {
                        console.error('网络请求失败');
                        return;
                    }
                }
            });
            that.setData({
                activeIndex: index,
                tab: tab,
                pageNo: 1,
                pre: "../../images/search_list_zh_pre.png"
            })

        }
    },

    fetchSearchList: function () {//加载更多

        var that = this;
        var host = getApp().globalData.servsers;

        var forid = that.data.forid;
        var tab = that.data.tab;
        var tabVal = that.data.tabVal;
        if (tab == "price" && tabVal == '0') {//切换数据 为  从低到高  （箭头朝上） 
            wx.request({
              url: host + "commodityapi/findCommodityByPrms",
              data: {
                purposeId: that.data.activeId1,
                objectId: that.data.activeId2,
                priceType: that.data.activeId3,
                sortType: 2,
                offset: parseInt(that.data.searchPageNum),
                limit: 10
              },
              method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
              header: {
                  'Accept': 'application/json'
              },
              success: function (res) {
                  if (res.data.rows.length != 0) {
                      let contentList = [];
                      //如果isFromSearch是true从data中取出数据，否则先从原来的数据继续添加  
                      that.data.isFromSearch ? contentList = res.data.rows : contentList = that.data.contentList.concat(res.data.rows)
                      that.setData({
                          contentList: contentList, //获取数据数组   
                          searchLoading: true   //把"上拉加载"的变量设为false，显示  
                      });
                      //没有数据了，把“没有数据”显示，把“上拉加载”隐藏  
                  } else {
                      that.setData({
                          searchLoadingComplete: true, //把“没有数据”设为true，显示  
                          searchLoading: false  //把"上拉加载"的变量设为false，隐藏  
                      });
                  }

                  if (res == null || res.data == null) {
                      console.error('网络请求失败');
                      return;
                  }
                  wx.hideNavigationBarLoading(
                      that.setData({
                          hidden: 'hidden'
                      })
                  )
              }
          });
        } else if (tab == "price" && tabVal == '1') {//切换数据 为  从高到低  （箭头朝下）
            wx.request({
              url: host + "commodityapi/findCommodityByPrms",
              data: {
                purposeId: that.data.activeId1,
                objectId: that.data.activeId2,
                priceType: that.data.activeId3,
                sortType: 3,
                offset: parseInt(that.data.searchPageNum),
                limit: 10
              },
              method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
              header: {
                  'Accept': 'application/json'
              },
              success: function (res) {
                  if (res.data.rows.length != 0) {
                      let contentList = [];
                      //如果isFromSearch是true从data中取出数据，否则先从原来的数据继续添加  
                      that.data.isFromSearch ? contentList = res.data.rows : contentList = that.data.contentList.concat(res.data.rows)
                      that.setData({
                          contentList: contentList, //获取数据数组   
                          searchLoading: true   //把"上拉加载"的变量设为false，显示  
                      });
                      //没有数据了，把“没有数据”显示，把“上拉加载”隐藏  
                  } else {
                      that.setData({
                          searchLoadingComplete: true, //把“没有数据”设为true，显示  
                          searchLoading: false  //把"上拉加载"的变量设为false，隐藏  
                      });
                  }

                  if (res == null || res.data == null) {
                      console.error('网络请求失败');
                      return;
                  }
                  wx.hideNavigationBarLoading(
                      that.setData({
                          hidden: 'hidden'
                      })
                  )
              }
          });
        } else {
            //检索商品列表
            wx.request({
              url: host + "commodityapi/findCommodityByPrms",
              data: {
                purposeId: that.data.activeId1,
                objectId: that.data.activeId2,
                priceType: that.data.activeId3,
                sortType: 1,
                offset: parseInt(that.data.searchPageNum),
                limit: 10
              },
              method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
              header: {
                  'Accept': 'application/json'
              },
              success: function (res) {
                  if (res.data.rows.length != 0) {
                      let contentList = [];
                      //如果isFromSearch是true从data中取出数据，否则先从原来的数据继续添加  
                      that.data.isFromSearch ? contentList = res.data.rows : contentList = that.data.contentList.concat(res.data.rows)
                      that.setData({
                          contentList: contentList, //获取数据数组   
                          searchLoading: true   //把"上拉加载"的变量设为false，显示  
                      });
                      //没有数据了，把“没有数据”显示，把“上拉加载”隐藏  
                  } else {
                      that.setData({
                          searchLoadingComplete: true, //把“没有数据”设为true，显示  
                          searchLoading: false  //把"上拉加载"的变量设为false，隐藏  
                      });
                  }

                  if (res == null || res.data == null) {
                      console.error('网络请求失败');
                      return;
                  }
                  wx.hideNavigationBarLoading(
                      that.setData({
                          hidden: 'hidden'
                      })
                  )
              }
          });
        }
    },
    // //滚动到底部触发事件  
    // searchScrollLower: function () {
    //     var that = this;
    //     if (that.data.searchLoading && !that.data.searchLoadingComplete) {
    //         that.setData({
    //             searchPageNum: that.data.searchPageNum + 1,  //每次触发上拉事件，把searchPageNum+1  
    //             isFromSearch: false  //触发到上拉事件，把isFromSearch设为为false  
    //         });
    //         that.fetchSearchList();
    //     }
    // },

  //下拉
  onReachBottom:function(){
    var that = this;
    if (that.data.searchLoading && !that.data.searchLoadingComplete) {
      that.setData({
        searchPageNum: that.data.searchPageNum + 1,  //每次触发上拉事件，把searchPageNum+1  
        isFromSearch: false  //触发到上拉事件，把isFromSearch设为为false  
      });
      that.fetchSearchList();
    }
  },


    //重新选择
    returnChoose:function(e){
        wx.navigateTo({
            url: '/pages/patternMenu/patternMenu'
        })
    },

    //购物车
    goCar:function(e){
        wx.navigateTo({
          url: '/pages/carInsert/carInsert'
        })
    },

    //监测滚动位置，当滚动位置达到2.5p时，显示“回到顶部”按钮
    onPageScroll:function(e){
      var that = this;
      var screenH = that.data.screenH;
      screenH = screenH * 2.5;

      that.setData({
        scrollTopFlag: e.scrollTop,
        scrollFlag : true
      })
      if (e.scrollTop  >= screenH){
        that.setData({
          posYes : true
        })
      }else{
        that.setData({
          posYes: false
        })
      }

    },

    //回到顶部
    goTop:function(e){
      var that = this;
      that.setData({
        posYes: false
      })
      wx.pageScrollTo({
        scrollTop: 0,
        duration: 300
      })
    },

    //关闭切换模式提示
    closeMsg: function (e) {
      var that = this;
      that.setData({
        showMsg: false
      })
    },

    //打开切换提示
    openChangeModel: function (e) {
      var that = this;
      that.setData({
        showMsg: false,
        showChangeModel: true
      })
    },

    //跳转至一键选礼
    goChooseGift: function (e) {
      var that = this;
      that.setData({
        showChangeModel: false
      })
      wx.switchTab({
        url: '/pages/index/index'
      })
    },

    //关闭切换模式确认弹窗
    closeChangeModel: function (e) {
      var that = this;
      that.setData({
        showChangeModel: false
      })
    },

    //收藏
    collect: function (e) {
      var that = this;
      var dataState = e.currentTarget.dataset.state;
      var id = e.currentTarget.dataset.id;
      var comid = e.currentTarget.dataset.comid;
      var host = getApp().globalData.servsers;
      var un_id = getApp().globalData.un_id;

      var contentList = that.data.contentList;

      if (un_id != undefined && un_id != '' && un_id != null){
        console.log(dataState);

        if (!dataState) {
          //后台增加收藏用户收藏数据
          wx.request({
            url: host + "collectionapi/insertcollection",
            data: {
              user_id: un_id,
              collection_clas: 2,
              collection_name: comid
            },
            method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
            header: {
              'Accept': 'application/json'
            },
            success: function (res) {
              that.setData({
                collectState: true
              })
              if (res == null || res.data == null) {
                console.error('网络请求失败');
                return;
              }
            }
          })
          contentList[id].collectState = true;
          that.setData({
            contentList: contentList
          })
        } else {

          wx.request({
            url: host + "collectionapi / deleteforxcx",
            data: {
              user_id: un_id,
              collection_clas: 2,
              collection_name: comid,
            },
            method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
            header: {
              'Accept': 'application/json'
            },
            success: function (res) {
              that.setData({
                collectState: false
              })
              if (res == null || res.data == null) {
                console.error('网络请求失败');
                return;
              }
            }
          })
          contentList[id].collectState = false;
          that.setData({
            contentList: contentList
          })
        }
      }
    },
})
var that;
var Util = require('../../utils/util.js'); 