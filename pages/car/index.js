// index.js
var likeList = [
  { url: '/pages/buy/buy?com_id=3292', imgSrc: 'https://www.daliangzao.net/images/c62671d2f0454054a9d9fbbc87965fcf.jpg', name: '【Herbacin/贺本清】小甘菊护手霜礼盒 ', oldPrice: '98', newPrice: '68' },
  { url: '/pages/buy/buy?com_id=3296', imgSrc: 'https://www.daliangzao.net/images/11d3bda623b241adb6aff125bd2a2477.jpg', name: '【FOREO】LUNA2 电动硅胶洁面仪', oldPrice: '1880', newPrice: '1373' },
  { url: '/pages/buy/buy?com_id=3539', imgSrc: 'https://www.daliangzao.net/images/359f87b24aaa4df899b1b7dfaa448911.jpg', name: '【Dyson戴森】Supersonic HD01吹风机（中国红甄选礼盒）', oldPrice: '3190', newPrice: '3190' },
  { url: '/pages/buy/buy?com_id=3294', imgSrc: 'https://www.daliangzao.net/images/323cce98818944248fb791115004b18e.jpg', name: '【大良造】粉色少女心生活礼盒（毛毯+眼罩+拖鞋）', oldPrice: '388', newPrice: '388' },
  { url: '/pages/buy/buy?com_id=3270', imgSrc: 'https://www.daliangzao.net/images/b942f40c711f4336ae8f6efecebd11b6.jpg', name: '【大良造】精致生活礼盒（香槟+巧克力）', oldPrice: '195', newPrice: '193' },
  { url: '/pages/buy/buy?com_id=3275', imgSrc: 'https://www.daliangzao.net/images/4152d74f27634b77bdae594c07c05f1c.jpg', name: '【大良造】创意办公礼盒（竹节笔+笔记本）', oldPrice: '311', newPrice: '311' }
];
Page({
  data: {
    contentShow : '',//初始整体内容隐藏，加载完成后显示
    likeList: likeList,
    carts: [],
    buyCarts: [],
    hasList: false,           // 列表是否有数据
    totalPrice: 0,            // 总价，初始为0
    selected: '',
    selectAllStatus: true,   // 全选状态，默认全选
    delBtnWidth: 160,         //删除按钮宽度单位（rpx）
    txtStyle: "",
    touchDel: 0,
    scrollY: true, //页面是否可滚动
    isMinus: true,
    isAdd : true,
    hidden: 'hidden',
    hiddenmodal: true, //弹窗
    maskBg: false,//支付提示蒙层
    paddingBottom: 0,
    un_id : '',
    shixiao_num : 0,//失效商品数量
    firstClick:0, //没有连点购买按钮
    combineList : [],//存放相同规格，不同礼盒和工艺的商品，合并后的数组【仅需 商品id，组合规格id，总数量】
  },
  onShow: function (e) {
    var that = this;
    that.loadFun();
  },

  loadFun: function () {
    //wx.showNavigationBarLoading();
    var that = this;
    var host = getApp().globalData.servsers;
    var un_id = getApp().globalData.un_id;
    wx.showLoading({
      title: '',
      icon: 'loading',
      mask: true,
      success: function () {

      }
    })

    that.setData({
      contentShow: '',//初始整体内容隐藏，加载完成后显示
      carts: [],
      buyCarts: [],
      hasList: false,           // 列表是否有数据
      totalPrice: 0,            // 总价，初始为0
      selected: '',
      selectAllStatus: true,   // 全选状态，默认全选
      delBtnWidth: 160,         //删除按钮宽度单位（rpx）
      txtStyle: "",
      touchDel: 0,
      scrollY: true, //页面是否可滚动
      isMinus: true,
      isAdd: true,
      hidden: 'hidden',
      hiddenmodal: true, //弹窗
      maskBg: false,//支付提示蒙层
      paddingBottom: 0,
      un_id: '',
      shixiao_num: 0,//失效商品数量
      firstClick: 0, //没有连点购买按钮
    })

   
    var shixiao_num = 0;
    that.setData({
      un_id: un_id,
      firstClick:0
    })
    
    if (un_id != undefined && un_id != '' && un_id != null){

      wx.request({
        url: host + "shoppingcartapi/shoppingcartview",
        data: {
          user_id: un_id
        },
        method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
        header: {
          'Accept': 'application/json'
        },
        success: function (res) {
          console.log(res);
          if (res.data.total > 0) {
            that.setData({
              carts: res.data.rows,
              hasList: true,
              paddingBottom: 100
            });

            var carts = res.data.rows;

            console.log(res.data.rows);
            var cartsLength = res.data.rows.length;

            
            //检测库存
            that.checkCommodityGroupRepertory(cartsLength, 0, 0, 0);
          }else{
            that.setData({
              contentShow: 'contentShow'
            })
            wx.hideLoading();
          }
          if (res == null || res.data == null) {
            console.error('网络请求失败');
            return;
          }
        }
      });

    }
  },

  //检测商品售罄
  checkCommodityGroupRepertory: function (cartsLength, total, flagNum, shixiao_num){
    var that = this;
    var host = getApp().globalData.servsers;
    var un_id = getApp().globalData.un_id;
    //shixiao_num  :  失效商品数量【失效+售罄】
    var carts = that.data.carts;

    if (cartsLength == 0){
      console.log("cartsLength:" + cartsLength);
      console.log("shixiao_num:" + shixiao_num);
      console.log("flagNum:" + flagNum);
      var len = carts.length;
      if (flagNum == (len - shixiao_num) && flagNum > 0) {
        that.setData({
          selectAllStatus: true,
          totalPrice: total.toFixed(2)
        });
      } else {
        that.setData({
          selectAllStatus: false,
          totalPrice: total.toFixed(2)
        });
      }
      that.setData({
        carts: carts
      })
      that.getTotalPrice();
      that.setData({
        contentShow: 'contentShow'
      })
      console.log(carts);
      wx.hideLoading();
      
    }else{
      cartsLength -= 1;

      wx.request({
        url: host + "commodityapi/commoditview",
        data: {
          com_id: carts[cartsLength].com_id
        },
        method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
        header: {
          'Accept': 'application/json'
        },
        success: function (res) {
          console.log("load:");
          console.log(res);
          //有此商品
          if (res.data.total > 0) {
            carts[cartsLength].limitNum= parseInt(res.data.commodity.commodity_num);//同步起订量
            that.setData({
              carts: carts
            })
            if (res.data.commodity.commodity_flag != 0) {//此商品为下架商品
              carts[cartsLength].num = parseInt(carts[cartsLength].num);
              carts[cartsLength].limitNum = parseInt(carts[cartsLength].limitNum);
              carts[cartsLength].flag = 0;//取消勾选
              carts[cartsLength].canBuy = true;//默认有库存
              shixiao_num += 1;
              that.setData({
                shixiao_num: shixiao_num,
                carts: carts
              })
              that.checkCommodityGroupRepertory(cartsLength, total, flagNum, shixiao_num);

            }else{
              //不是失效商品，检测库存是否充足
              wx.request({
                url: host + "api/commodityGroup/checkCommodityGroupRepertory",
                data: {
                  datasheetGroupId: carts[cartsLength].com_group_id
                },
                method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
                header: {
                  'Accept': 'application/json'
                },
                success: function (res) {
                  console.log(res);
                  if (res.data.code == '200') {
                    carts[cartsLength].canBuy = res.data.data.canBuy;//有无库存
                    carts[cartsLength].repertory = res.data.data.repertory;//当前规格的库存数量

                    //库存充足
                    if (res.data.data.canBuy == true) {
                      
                      if (res.data.data.repertory < carts[cartsLength].limitNum || res.data.data.repertory < carts[cartsLength].num || parseInt(carts[cartsLength].num) < parseInt(carts[cartsLength].limitNum)) {
                        carts[cartsLength].canBuy = false;
                        carts[cartsLength].flag = 0;//取消勾选
                        shixiao_num += 1;
                      } else {
                        if (carts[cartsLength].box_price == '' || carts[cartsLength].box_price == null || carts[cartsLength].box_price == undefined) {
                          carts[cartsLength].box_price = 0;
                        }
                        carts[cartsLength].new_price = parseFloat(carts[cartsLength].cost) + parseFloat(carts[cartsLength].box_price);

                        if (carts[cartsLength].flag == 1) {//当前为选中
                          flagNum += 1;
                          total += carts[cartsLength].num * carts[cartsLength].new_price;
                        }
                      }

                    } else {
                      carts[cartsLength].flag = 0;//取消勾选
                      shixiao_num += 1;
                    }
                    carts[cartsLength].num = parseInt(carts[cartsLength].num);
                    that.setData({
                      shixiao_num: shixiao_num,
                      carts: carts
                    })
                    that.checkCommodityGroupRepertory(cartsLength, total, flagNum, shixiao_num);
                  }

                }
              })
              //request结束
            }
          }else{
            carts[cartsLength].num = parseInt(carts[cartsLength].num);
            carts[cartsLength].limitNum = parseInt(carts[cartsLength].limitNum);
            carts[cartsLength].flag = 0;//取消勾选
            carts[cartsLength].canBuy = true;//默认有库存
            shixiao_num += 1;
            that.setData({
              shixiao_num: shixiao_num,
              carts: carts
            })
            that.checkCommodityGroupRepertory(cartsLength, total, flagNum, shixiao_num);
          }

        }
      })
      //非失效商品判断结束
    }
  },


  //当前商品选中事件
  selectList(e) {
    var that = this;
    var host = getApp().globalData.servsers;
    var index = e.currentTarget.dataset.index;
    var carts = that.data.carts;
    var selected = carts[index].flag;
    var com_id = carts[index].com_id;//商品唯一标识id
    var cartsLength = that.data.carts.length;
    var shixiao_num = that.data.shixiao_num;
    var flagNum = 0;


    //检测商品是否下架
    wx.request({
      url: host + "commodityapi/commoditview",
      data: {
        com_id: com_id
      },
      method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      header: {
        'Accept': 'application/json'
      },
      success: function (res) {
        //有此商品
        if (res.data.total > 0) {
          carts[index].limitNum = parseInt(res.data.commodity.commodity_num);//同步起订量
          that.setData({
            carts: carts
          })
          console.log(res.data.commodity.commodity_flag);
          if (res.data.commodity.commodity_flag != 0) {//此商品为下架商品

            carts[index].commodity_flag = 1;
            carts[index].flag = 0;
            shixiao_num++;
            that.setData({
              shixiao_num: shixiao_num,
            })

          } else {


            //不是失效商品，检测库存是否充足
            wx.request({
              url: host + "api/commodityGroup/checkCommodityGroupRepertory",
              data: {
                datasheetGroupId: carts[index].com_group_id
              },
              method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
              header: {
                'Accept': 'application/json'
              },
              success: function (res) {
                if (res.data.code == '200') {
                  carts[index].canBuy = res.data.data.canBuy;//有无库存
                  carts[index].repertory = res.data.data.repertory;//当前规格的库存数量

                  if (res.data.data.canBuy){

                    if (res.data.data.repertory < carts[index].limitNum || res.data.data.repertory < carts[index].num || parseInt(carts[index].num) < parseInt(carts[index].limitNum)) {//库存小于 商品数量或最低起订量
                      carts[index].canBuy = false;
                      carts[index].flag = 0;//取消勾选
                      shixiao_num += 1;
                      that.setData({
                        shixiao_num: shixiao_num,
                        hiddenmodal: false,
                        modalCont: '商品已售罄！'
                      })
                      setTimeout(function () {
                        that.setData({
                          hiddenmodal: true,
                          firstClick: 0
                        })
                      }, 1500)
                    }else{

                      //同类别数量和【商品id相同，规格id相同】
                      var combineNum = 0;
                      if (selected == 0) {//勾选操作，分别和勾选商品加和比对
                        var sumNum = parseInt(carts[index].num);
                        for (var t = 0; t < carts.length; t++) {  
                          if (carts[t].flag == 1) {//同勾选商品比对
                            if (carts[t].com_id == carts[index].com_id && carts[t].com_group_id == carts[index].com_group_id) {
                              sumNum += parseInt(carts[t].num); 
                            }
                          }
                        }
                        console.log("sumNum:" + sumNum);
                        console.log("repertory:" + res.data.data.repertory);
                        if (sumNum > res.data.data.repertory) {
                          that.setData({
                            hiddenmodal: false,
                            modalCont: '库存不足！'
                          })
                          setTimeout(function () {
                            that.setData({
                              hiddenmodal: true
                            })
                          }, 1500)
                          return false;
                        }else{
                          carts[index].flag = 1;
                          for (var i = 0; i < cartsLength; i++) {
                            if (carts[i].flag == 1) {
                              flagNum++;
                            }
                          }
                          if (flagNum == (cartsLength - shixiao_num) && flagNum > 0) {
                            that.setData({
                              selectAllStatus: true,
                            })
                          }
                        }

                      } else {
                        carts[index].flag = 0;
                        if (that.data.selectAllStatus == true) {
                          that.setData({
                            selectAllStatus: false
                          })
                        }
                      }
                    }                 

                  }else{
                    carts[index].flag = 0;
                    shixiao_num++;
                    that.setData({
                      shixiao_num: shixiao_num,
                      hiddenmodal: false,
                      modalCont: '此商品已售罄！'
                    })
                    setTimeout(function () {
                      that.setData({
                        hiddenmodal: true,
                        firstClick: 0
                      })
                    }, 1500)
                    return false;
                  }
                  that.setData({
                    carts: carts
                  })
                  that.getTotalPrice();
                }
              }
            })
          }
        } else {//无此商品
          carts[index].commodity_flag = 1;
          carts[index].flag = 0;
          shixiao_num++;
          that.setData({
            carts: carts,
            shixiao_num: shixiao_num,
            hiddenmodal: false,
            modalCont: '此商品已下架！'
          })
          that.getTotalPrice();
          setTimeout(function () {
            that.setData({
              hiddenmodal: true,
              firstClick: 0
            })
          }, 1500)
          return false;
        }
        
      }
    })
  },

  //购物车全选事件
  selectAll(e) {
    var that = this;
    var host = getApp().globalData.servsers;

    var selectAllStatus = that.data.selectAllStatus;
    selectAllStatus = !selectAllStatus;
    let carts = that.data.carts;
    var len = carts.length;
    wx.showLoading({
      title: '',
      icon: 'loading',
      mask: true,
      success: function () {

      }
    })
    that.selectSta(len, selectAllStatus);
    
  },

  //全选-分别做请求，判断是否下架，是否有库存
  selectSta: function (len, selectAllStatus){
    var that = this;
    var host = getApp().globalData.servsers;
    var carts = that.data.carts;
    var shixiao_num = that.data.shixiao_num;

    if (len == 0) {
      that.setData({
        selectAllStatus: selectAllStatus,
      });

      that.getTotalPrice();
      wx.hideLoading();
    } else {
      len -= 1;
      var com_id = carts[len].com_id;
      if (selectAllStatus == true) {//全部选中
      
        //检测商品是否下架
        wx.request({
          url: host + "commodityapi/commoditview",
          data: {
            com_id: com_id
          },
          method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
          header: {
            'Accept': 'application/json'
          },
          success: function (res) {
            //有此商品
            if (res.data.total > 0) {
              carts[len].limitNum = parseInt(res.data.commodity.commodity_num);//同步起订量
              that.setData({
                carts: carts
              })
              if (res.data.commodity.commodity_flag != 0) {//此商品为下架商品

                carts[len].commodity_flag = 1;
                carts[len].flag = 0;
                shixiao_num++;
                that.setData({
                  carts: carts,
                  shixiao_num: shixiao_num,
                  selectAllStatus: selectAllStatus,
                })
                that.selectSta(len, selectAllStatus);

              } else {

                //不是失效商品，检测库存是否充足
                wx.request({
                  url: host + "api/commodityGroup/checkCommodityGroupRepertory",
                  data: {
                    datasheetGroupId: carts[len].com_group_id
                  },
                  method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
                  header: {
                    'Accept': 'application/json'
                  },
                  success: function (res) {
                    console.log(res);
                    if (res.data.code == '200') {
                      carts[len].canBuy = res.data.data.canBuy;//有无库存
                      carts[len].repertory = res.data.data.repertory;//当前规格的库存数量

                      if (res.data.data.canBuy) {
                        if (res.data.data.repertory < carts[len].limitNum || res.data.data.repertory < carts[len].num || parseInt(carts[len].num) < parseInt(carts[len].limitNum)) {
                          carts[len].canBuy = false;
                          carts[len].flag = 0;//取消勾选
                          shixiao_num += 1;
                        }else{

                          var sumNum = parseInt(carts[len].num);
                          for (var t = 0; t < len ; t++) {
                            if (carts[t].com_id == carts[len].com_id && carts[t].com_group_id == carts[len].com_group_id) {
                                sumNum += parseInt(carts[t].num);
                            }
                          }
                          console.log("全选-sumNum:" + sumNum);
                          console.log("全选-repertory:" + res.data.data.repertory);
                          if (sumNum > res.data.data.repertory) {
                            carts[len].flag = 0;  
                            selectAllStatus = false;
                          }else{
                            carts[len].flag = 1;
                            carts[len].new_price = parseFloat(carts[len].cost) + parseFloat(carts[len].box_price);
                          }
                        }

                      }else{
                        carts[len].flag = 0;  
                        shixiao_num++;
                      }
                      that.setData({
                        carts: carts,
                        shixiao_num: shixiao_num,
                        selectAllStatus: selectAllStatus,
                      })
                      that.selectSta(len, selectAllStatus);
                    }
                  }
                }) 
              
              }
            } else {
              carts[len].commodity_flag = 1;
              shixiao_num++;
              that.setData({
                carts: carts,
                shixiao_num: shixiao_num,
                selectAllStatus: selectAllStatus,
              })
              that.selectSta(len, selectAllStatus);
            }
          }
        })
      }else{
        carts[len].flag = 0;  
        that.setData({
          carts: carts
        })
        that.selectSta(len, selectAllStatus);
      }
    }  
  },

  //绑定加数量事件
  addCount(e) {
    var that = this;
    var host = getApp().globalData.servsers;
    var index = e.currentTarget.dataset.index;
    var carts = that.data.carts;
    var com_id = carts[index].com_id;
    var num = parseInt(carts[index].num);
    var com_group_id = carts[index].com_group_id;//组合id
    var shixiao_num = that.data.shixiao_num;
    

    //检测商品是否下架
    wx.request({
      url: host + "commodityapi/commoditview",
      data: {
        com_id: com_id
      },
      method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      header: {
        'Accept': 'application/json'
      },
      success: function (res) {
        //有此商品
        if (res.data.total > 0) {
          carts[index].limitNum = parseInt(res.data.commodity.commodity_num);//同步起订量
          that.setData({
            carts: carts
          })
          if (res.data.commodity.commodity_flag != 0) {//此商品为下架商品

            carts[index].commodity_flag = 1;
            carts[index].flag = 0;
            shixiao_num++;
            that.setData({
              carts: carts,
              shixiao_num: shixiao_num,
            })
            that.getTotalPrice();

          } else {

            //判断库存
            wx.request({
              url: host + "api/commodityGroup/checkCommodityGroupRepertory",
              data: {
                datasheetGroupId: com_group_id
              },
              method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
              header: {
                'Accept': 'application/json'
              },
              success: function (res) {
                if (res.data.code == '200') {
                  var canBuy = res.data.data.canBuy;
                  carts[index].canBuy = res.data.data.canBuy;
                  carts[index].repertory = res.data.data.repertory;
                  //库存充足
                  if (res.data.data.canBuy == true) {

                    if (res.data.data.repertory > carts[index].num) {
                      num++;
                      carts[index].num = num;
                    } else if (res.data.data.repertory < carts[index].num){
                      carts[index].num = res.data.data.repertory;
                      that.setData({
                        hiddenmodal: false,
                        modalCont: '仅有' + res.data.data.repertory + '件该宝贝，赶快抢购吧~'
                      })
                      setTimeout(function () {
                        that.setData({
                          hiddenmodal: true,
                          carts: carts
                        })
                      }, 2000)
                    }
                  }else{
                    shixiao_num++;
                  }
                  that.setData({
                    carts: carts,
                    shixiao_num: shixiao_num,
                  })
                  that.getTotalPrice();
                }else{
                  carts[index].commodity_flag = 1;
                  carts[index].flag = 0;
                  shixiao_num++;
                  that.setData({
                    carts: carts,
                    shixiao_num: shixiao_num,
                  })
                  that.getTotalPrice();
                }
              }
            })
          } 
        }else{
          carts[index].commodity_flag = 1;
          carts[index].flag = 0;
          shixiao_num++;
          that.setData({
            carts: carts,
            shixiao_num: shixiao_num,
          })
          that.getTotalPrice();
        }
      }
    })
  },

  //绑定减数量事件
  minusCount(e) {
    var that = this;
    var host = getApp().globalData.servsers;
    const index = e.currentTarget.dataset.index;
    let carts = this.data.carts;
    var com_id = carts[index].com_id;
    let num = parseInt(carts[index].num);
    let minnum = parseInt(carts[index].limitNum);
    var shixiao_num = that.data.shixiao_num;

    //检测商品是否下架
    wx.request({
      url: host + "commodityapi/commoditview",
      data: {
        com_id: com_id
      },
      method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      header: {
        'Accept': 'application/json'
      },
      success: function (res) {
        //有此商品
        if (res.data.total > 0) {
          carts[index].limitNum = parseInt(res.data.commodity.commodity_num);//同步起订量
          that.setData({
            carts: carts
          })
          if (res.data.commodity.commodity_flag != 0) {//此商品为下架商品

            carts[index].commodity_flag = 1;
            carts[index].flag = 0;
            shixiao_num++;
            that.setData({
              shixiao_num: shixiao_num,
            })

          } else {


            //判断库存
            wx.request({
              url: host + "api/commodityGroup/checkCommodityGroupRepertory",
              data: {
                datasheetGroupId: carts[index].com_group_id
              },
              method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
              header: {
                'Accept': 'application/json'
              },
              success: function (res) {
                if (res.data.code == '200') {
                  var canBuy = res.data.data.canBuy;
                  carts[index].canBuy = res.data.data.canBuy;
                  carts[index].repertory = res.data.data.repertory;
                  //库存充足
                  if (res.data.data.canBuy == true) {

                    console.log("+:num" + parseInt(carts[index].num));
                    console.log("+:limitNum" + parseInt(carts[index].limitNum));

                    if (res.data.data.repertory >= parseInt(carts[index].num)){
                      if (parseInt(carts[index].num) > parseInt(carts[index].limitNum)) {
                        num--;
                        carts[index].num = num;
                      }else{
                        carts[index].flag = 0;
                        shixiao_num++;
                        that.setData({
                          carts: carts,
                          shixiao_num: shixiao_num,
                        })
                      }
                    }else{
                      carts[index].commodity_flag = 1;
                      carts[index].flag = 0;
                      shixiao_num++;
                      that.setData({
                        shixiao_num: shixiao_num,
                      })
                    }
                      
                  } else {
                    shixiao_num++;
                  }
                  that.setData({
                    carts: carts,
                    shixiao_num: shixiao_num,
                  })
                  that.getTotalPrice();
                }
              }
            })
           
          }
        } else {
          carts[index].commodity_flag = 1;
          carts[index].flag = 0;
          shixiao_num++;
          that.setData({
            shixiao_num: shixiao_num,
          })
        }
        that.setData({
          carts: carts
        })
        that.getTotalPrice();
      }
    })
  },

  //立即购买
  tz: function () {
    var that = this;
    var carts = that.data.carts;
    var len = that.data.carts.length;
    var chooseNum = 0;//当前勾选商品数量
    that.setData({
      firstClick : 1
    })
    for (var i = 0; i < len; i++ ){
      if (that.data.carts[i].flag == 1){
        chooseNum ++;
      }
    }
    if (chooseNum > 0){
      that.setData({
        buyCarts: []
      })
      wx.showLoading({
        title: '',
        icon: 'loading',
        mask: true,
        success: function () {
        }
      })
      that.selectCartsSta(len);
    }else{
      that.setData({
        hiddenmodal: false,
        modalCont: '还没有选择宝贝！'
      })
      setTimeout(function () {
        that.setData({
          hiddenmodal: true,
          firstClick:0
        })
      }, 1500)
      return false;
    }

  },

  //检查立即购买的商品中是否有下架商品
  selectCartsSta: function (len){
    var that = this;
    var host = getApp().globalData.servsers;
    var carts = that.data.carts;
    var lenOld = that.data.carts.length;  
    var shixiao_num = that.data.shixiao_num;

    if (len == 0) {
      if (lenOld > 0){
        that.setData({
          carts: carts,
          buyCarts: that.data.buyCarts
        });
        var newCarts = JSON.stringify(that.data.buyCarts);
        newCarts = newCarts.replace(/&/g, "zss");
        wx.navigateTo({
          url: '/pages/confirmOrder/confirmOrder?carts=' + newCarts,
        })
        that.getTotalPrice();
      }else{
        return false;
      } 
      
      
    } else {

      len -= 1;

      if (carts[len].flag == 1) {//检测立即购买中的商品，是否下架

        var com_id = carts[len].com_id;
        //检测商品是否下架
        wx.request({
          url: host + "commodityapi/commoditview",
          data: {
            com_id: com_id
          },
          method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
          header: {
            'Accept': 'application/json'
          },
          success: function (res) {
            //有此商品
            if (res.data.total > 0) {
              carts[len].limitNum = parseInt(res.data.commodity.commodity_num);//同步起订量
              that.setData({
                carts: carts
              })
              if (res.data.commodity.commodity_flag != 0) {//此商品为下架商品
                carts[len].commodity_flag = 1;
                carts[len].flag = 0;
                that.getTotalPrice();
                shixiao_num++;
                wx.hideLoading(); 
                that.setData({
                  hiddenmodal: false,
                  modalCont: '"' + carts[len].name + '"已下架，请重新选择！'
                })
                setTimeout(function () {
                  that.setData({
                    shixiao_num: shixiao_num,
                    carts: carts,
                    firstClick: 0,
                    hiddenmodal: true
                  })
                  
                }, 3000)
                return false;

              } else {


                //判断库存
                wx.request({
                  url: host + "api/commodityGroup/checkCommodityGroupRepertory",
                  data: {
                    datasheetGroupId: carts[len].com_group_id
                  },
                  method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
                  header: {
                    'Accept': 'application/json'
                  },
                  success: function (res) {
                    if (res.data.code == '200') {
                      var canBuy = res.data.data.canBuy;
                      carts[len].canBuy = res.data.data.canBuy;
                      //库存充足
                      if (res.data.data.canBuy == true) {
                        if (res.data.data.repertory < carts[len].num) {
                          carts[len].canBuy = false;
                          carts[len].flag = 0;//取消勾选
                          wx.hideLoading(); 
                          shixiao_num++;
                          that.setData({
                            hiddenmodal: false,
                            modalCont: '"' + carts[len].name + '"库存不足，请重新选择！'
                          })
                          setTimeout(function () {
                            that.setData({
                              carts: carts,
                              firstClick: 0,
                              shixiao_num: shixiao_num,
                              hiddenmodal: true
                            })
                          }, 3000)
                          that.getTotalPrice();
                          return false;
                        }else{

                          var sumNum = parseInt(carts[len].num);
                          console.log("num:" + sumNum);
                          for (var t = 0; t < len ; t++) {
                            if (carts[t].com_id == carts[len].com_id && carts[t].com_group_id == carts[len].com_group_id) {
                              sumNum += parseInt(carts[t].num);
                            }
                          }
                          console.log("立即购买-sumNum:" + sumNum);
                          console.log("立即购买-repertory:" + res.data.data.repertory);
                          if (sumNum > res.data.data.repertory) {
                            wx.hideLoading(); 
                            that.setData({
                              hiddenmodal: false,
                              modalCont: '"' + carts[len].name + '-' + carts[len].style1_name + carts[len].style2_name + carts[len].style3_name + carts[len].style4_name + carts[len].style5_name + '",库存仅剩' + res.data.data.repertory + '件，请重新选择！'
                            })
                            setTimeout(function () {
                              that.setData({
                                carts: carts,
                                firstClick: 0,
                                hiddenmodal: true
                              })
                            }, 3000);
                            return false;

                          } else {
                            carts[len].flag = 1;
                            carts[len].new_price = parseFloat(carts[len].cost) + parseFloat(carts[len].box_price);
                          }

                          that.data.buyCarts.push(carts[len]);
                          that.selectCartsSta(len);
                          that.getTotalPrice();
                        }
                        
                      }else{
                        carts[len].flag = 0;//取消勾选
                        shixiao_num++;
                        wx.hideLoading(); 
                        that.setData({
                          hiddenmodal: false,
                          modalCont: '"' + carts[len].name + '"已售罄，请重新选择！'
                        })
                        setTimeout(function () {
                          that.setData({
                            carts: carts,
                            firstClick: 0,
                            shixiao_num: shixiao_num,
                            hiddenmodal: true
                          })
                        }, 3000);
                        that.getTotalPrice();
                        return false;
                      }
                      
                    }
                  }
                })
                
              }
            } else {
              carts[len].commodity_flag = 1;
              carts[len].flag = 0;
              shixiao_num++;
              wx.hideLoading(); 
              that.setData({
                hiddenmodal: false,
                modalCont: '存在下架商品，请重新选择！'
              })
              setTimeout(function () {
                that.setData({
                  carts: carts,
                  firstClick: 0,
                  shixiao_num: shixiao_num,
                  hiddenmodal: true
                })
                
              }, 2000);
              that.getTotalPrice();
              return false;
            }
          }
        })

      }else{
        that.selectCartsSta(len);
      }
    }  
  },

  buyUrl: function (e) {//跳转到当前商品对应的购买页
    var that = this;
    var host = getApp().globalData.servsers;
    var id = e.currentTarget.dataset.comid;
    wx.request({
      url: host + "commodityapi/commoditview",
      data: {
        com_id: id,
      },
      method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      header: {
        'Accept': 'application/json'
      },
      success: function (res) {
        if (res.data.total > 0) {
          wx.navigateTo({
            url: '/pages/buy/buy?com_id=' + id
          })
        } else {
          that.setData({
            hiddenmodal: false,
            modalCont: '该商品已下架！'
          })
          setTimeout(function () {
            that.setData({
              hiddenmodal: true
            })
          }, 2000)
          return false;
        }
      }

    })
  },

  touchS: function (e) {
    if (e.touches.length == 1) {
      this.setData({
        //设置触摸起始点水平方向位置
        startX: e.touches[0].clientX
      });
    }
  },
  touchM: function (e) {
    if (e.touches.length == 1) {
      //手指移动时水平方向位置
      var moveX = e.touches[0].clientX;
      //手指起始点位置与移动期间的差值
      var disX = this.data.startX - moveX;
      var delBtnWidth = this.data.delBtnWidth;
      var index = e.currentTarget.dataset.index;
      // var txtStyle = "";
      if (disX == 0 || disX < 0) {//如果移动距离小于等于0，文本层位置不变
        this.setData({
          touchDel: index,
          txtStyle: "0"
        })

      } else if (disX > 0) {//移动距离大于0，文本层left值等于手指移动距离
        this.setData({
          touchDel: index,
          txtStyle: "-" + disX + "rpx",
          // scrollY: false
        })
        if (disX >= delBtnWidth) {
          //控制手指移动距离最大值为删除按钮的宽度
          this.setData({
            touchDel: index,
            txtStyle: "-" + delBtnWidth + "rpx",
            // scrollY: false
          })
        }
      }
      //获取手指触摸的是哪一项
      // var index = e.target.dataset.index;
      // var list = this.data.list;
      // list[index].txtStyle = txtStyle;
      // //更新列表的状态
      // this.setData({
      //   list: list
      // });
    }
  },

  touchE: function (e) {
    if (e.changedTouches.length == 1) {
      //手指移动结束后水平位置
      var endX = e.changedTouches[0].clientX;
      //触摸开始与结束，手指移动的距离
      var disX = this.data.startX - endX;
      var delBtnWidth = this.data.delBtnWidth;
      var index = e.currentTarget.dataset.index;
      //如果距离小于删除按钮的1/2，不显示删除按钮
      // var txtStyle = disX > delBtnWidth / 2 ? "left:-" + delBtnWidth + "px" : "left:0px";

      this.setData({
        touchDel: index,
        txtStyle: disX > delBtnWidth / 2 ? "-" + delBtnWidth + "rpx" : "0px",
        // scrollY : disX > delBtnWidth / 2 ? false : true
      })


      //获取手指触摸的是哪一项
      // var index = e.target.dataset.index;
      // var list = this.data.list;
      // list[index].txtStyle = txtStyle;
      // //更新列表的状态
      // this.setData({
      //   list: list
      // });
    }
  },
  //获取元素自适应后的实际宽度
  getEleWidth: function (w) {
    var real = 0;
    try {
      var res = wx.getSystemInfoSync().windowWidth;
      var scale = (750 / 2) / (w / 2);//以宽度750px设计稿做宽度的自适应
      real = Math.floor(res / scale);
      return real;
    } catch (e) {
      return false;
    }
  },

  //点击删除按钮事件
  delItem: function (e) {
    var that = this;
    //获取列表中要删除项的下标
    var host = getApp().globalData.servsers;
    var index = e.currentTarget.dataset.index;
    var id = e.currentTarget.dataset.id;
    var flag = e.currentTarget.dataset.flag;
    var shixiao_num = that.data.shixiao_num;//失效数量
    let carts = that.data.carts;
    var cartsLength = that.data.carts.length;
    
    that.setData({
      txtStyle: 0
    });

    //删除购物车数据
    wx.request({
      url: host + "shoppingcartapi/deleteshoppingcart",
      data: {
        id: id
      },
      method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      header: {
        'Accept': 'application/json'
      },
      success: function (res) {
        carts.splice(index, 1);
        that.setData({
          carts: carts
        });
        var cartsLength = carts.length;
        var flagNum = cartsLength - shixiao_num;
        if (cartsLength == 0){
          that.setData({
            hasList: false,
            paddingBottom: 0
          })
        }else{
          if (flag == 0) {
            if (flagNum > 0) {
              that.setData({
                selectAllStatus: true
              });
            } else {
              that.setData({
                selectAllStatus: false
              });
            }
            that.getTotalPrice();
          } else {
            //删除的是失效商品
            shixiao_num--;
            that.setData({
              shixiao_num: shixiao_num
            })
          }
        }
        
        if (res == null || res.data == null) {
          console.error('网络请求失败');
          return;
        }
      }
    });

  },
  
  //下拉刷新
  onPullDownRefresh: function (e) {
    var that = this;
    that.loadFun();
    wx.stopPullDownRefresh();
  },

  /**
   * 计算总价
   */
  getTotalPrice() {
    let carts = this.data.carts;//获取购物车列表
    let total = 0;
    for (let i = 0; i < this.data.carts.length; i++) {
      if (carts[i].flag == 1 && carts[i].commodity_flag == 0) { // 判断选中[flag = 1]并且是上架[commodity_flag = 0]的商品，才会计算价格
        total += carts[i].num * (parseFloat(carts[i].cost) + parseFloat(carts[i].box_price));   // 所有价格加起来
      }
    }
    this.setData({
      carts: carts,
      totalPrice: total.toFixed(2)
    });
  }

})
var that;
var Util = require('../../utils/util.js'); 