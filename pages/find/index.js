// pages/find/find.js
var app = getApp();
var imgSrcHttp = 'https://www.daliangzao.net/images/';
var tabImgList = [
  {
    imageFooterTitle : '我们的作品',
    imgList:[
      { imageSrc: imgSrcHttp + 'find_tab_1/1-benchilaganxiang.jpg', imgLogo: imgSrcHttp + 'find_tab_1/logo-benchi.jpg', url:''},
      { imageSrc: imgSrcHttp + 'find_tab_1/2-duoleshi.jpg', imgLogo: imgSrcHttp + 'find_tab_1/logo-duoleshi.jpg', url: ''},
      { imageSrc: imgSrcHttp + 'find_tab_1/3-hagendasifengyebijiben.jpg', imgLogo: imgSrcHttp + 'find_tab_1/logo-hagendasi.jpg', url: ''},
      { imageSrc: imgSrcHttp + 'find_tab_1/4-hagendasishuijingqiu.jpg', imgLogo: imgSrcHttp + 'find_tab_1/logo-hagendasi.jpg', url: ''},
      { imageSrc: imgSrcHttp + 'find_tab_1/5-hagendasiyaoshikou.jpg', imgLogo: imgSrcHttp + 'find_tab_1/logo-hagendasi.jpg', url: ''},
      { imageSrc: imgSrcHttp + 'find_tab_1/6-hanshulihe.jpg', imgLogo: imgSrcHttp + 'find_tab_1/logo-hanshu.jpg', url: ''},
      { imageSrc: imgSrcHttp + 'find_tab_1/7-huishi.jpg', imgLogo: imgSrcHttp + 'find_tab_1/logo-huishi.jpg', url: ''},
      { imageSrc: imgSrcHttp + 'find_tab_1/8-huishigonghuiruhuilihe.jpg', imgLogo: imgSrcHttp + 'find_tab_1/logo-huishi.jpg', url: ''},
      { imageSrc: imgSrcHttp + 'find_tab_1/9-jiandabinfenle.jpg', imgLogo: imgSrcHttp + 'find_tab_1/logo-jianda.jpg', url: ''},
      { imageSrc: imgSrcHttp + 'find_tab_1/10-kafeibeiyinyuehe.jpg', imgLogo: imgSrcHttp + 'find_tab_1/logo-xingbake.jpg', url: ''},
      { imageSrc: imgSrcHttp + 'find_tab_1/11-kaidilake.jpg', imgLogo: imgSrcHttp + 'find_tab_1/logo-kaidilake.jpg', url: ''},
      { imageSrc: imgSrcHttp + 'find_tab_1/12-kaidilakexiangkuang.jpg', imgLogo: imgSrcHttp + 'find_tab_1/logo-kaidilake.jpg', url: ''},
      { imageSrc: imgSrcHttp + 'find_tab_1/13-miqilinluntai.jpg', imgLogo: imgSrcHttp + 'find_tab_1/logo-miqilinluntai.jpg', url: ''},
      { imageSrc: imgSrcHttp + 'find_tab_1/14-motianlunyinyuehe.jpg', imgLogo: imgSrcHttp + 'find_tab_1/logo-xingbake.jpg', url: ''},
      { imageSrc: imgSrcHttp + 'find_tab_1/15-qingrenjieyaoshikou.jpg', imgLogo: imgSrcHttp + 'find_tab_1/logo-xingbake.jpg', url: ''},
      { imageSrc: imgSrcHttp + 'find_tab_1/16-shengdanyinyuelihe.jpg', imgLogo: imgSrcHttp + 'find_tab_1/logo-xingbake.jpg', url: ''},
      { imageSrc: imgSrcHttp + 'find_tab_1/17-taipingyangkafei.jpg', imgLogo: imgSrcHttp + 'find_tab_1/logo-taipingyangkafei.jpg', url: ''},
      { imageSrc: imgSrcHttp + 'find_tab_1/18-xingbakebijiben.jpg', imgLogo: imgSrcHttp + 'find_tab_1/logo-xingbake.jpg', url: ''},
      { imageSrc: imgSrcHttp + 'find_tab_1/19-xingbakebingxiangtie.jpg', imgLogo: imgSrcHttp + 'find_tab_1/logo-xingbake.jpg', url: ''},
      { imageSrc: imgSrcHttp + 'find_tab_1/20-xingbakechengshixiong.jpg', imgLogo: imgSrcHttp + 'find_tab_1/logo-xingbake.jpg', url: ''},
      { imageSrc: imgSrcHttp + 'find_tab_1/21-xingbakeqioakelilihe.jpg', imgLogo: imgSrcHttp + 'find_tab_1/logo-xingbake.jpg', url: ''},
      { imageSrc: imgSrcHttp + 'find_tab_1/22-xingbakeshoulian.jpg', imgLogo: imgSrcHttp + 'find_tab_1/logo-xingbake.jpg', url: ''},
      { imageSrc: imgSrcHttp + 'find_tab_1/23-xingbakeshuijingbei.jpg', imgLogo: imgSrcHttp + 'find_tab_1/logo-xingbake.jpg', url: ''},
      { imageSrc: imgSrcHttp + 'find_tab_1/24-xingbakeyinghuaxilie.jpg', imgLogo: imgSrcHttp + 'find_tab_1/logo-xingbake.jpg', url: ''},
      { imageSrc: imgSrcHttp + 'find_tab_1/25-xiongbakeyinghuaxilie.jpg', imgLogo: imgSrcHttp + 'find_tab_1/logo-xingbake.jpg', url: ''},
      { imageSrc: imgSrcHttp + 'find_tab_1/26-xingxiangkabingxiangtie.jpg', imgLogo: imgSrcHttp + 'find_tab_1/logo-xingbake.jpg', url: ''},
      { imageSrc: imgSrcHttp + 'find_tab_1/27-xuefulan.jpg', imgLogo: imgSrcHttp + 'find_tab_1/logo-xuefulan.jpg', url: '' },
      { imageSrc: imgSrcHttp + 'find_tab_1/28-yinghuashuqian.jpg', imgLogo: imgSrcHttp + 'find_tab_1/logo-xingbake.jpg', url: '' }
    ]
  },
  {
    imageFooterTitle: '佳节好礼',
    imgList: [
      { imageSrc: imgSrcHttp + 'find_tab_2/zt_1.jpg', url: '/pages/articleInfor/articleInfor?id=2923' },
      { imageSrc: imgSrcHttp + 'find_tab_2/zt_3.jpg', url: '/pages/articleInfor/articleInfor?id=2926' },
      { imageSrc: imgSrcHttp + 'find_tab_2/zt_4.jpg', url: '/pages/articleInfor/articleInfor?id=2927' },
      { imageSrc: imgSrcHttp + 'find_tab_2/zt_5.png', url: '/pages/articleInfor/articleInfor?id=2928' },
      { imageSrc: imgSrcHttp + 'find_tab_2/zt_2.png', url: '/pages/articleInfor/articleInfor?id=2917' },
    ]
  },
  {
    imageFooterTitle: '',
    imgList: []
  }
  
];

Page({
  data: {
    imgSrcHttp:'https://www.daliangzao.net/images/',
    navList: [],
    contentList:[],
    imgList:[],
    tabImgList: tabImgList, //经典案例
    imgWidth : 0,
    imgHeight : 0,
    screenWidth:0,

    imageWidth: 0,
    imageHeight: 0,

    phoneWidth: 0,  //屏幕宽 根据屏幕的宽度,三分之一为li的宽度  
    phoneHeight: 0, //屏幕高  
    swiperWidth: 0,

    imgindex: 23,//中间的下标 重点  
    imgindex2: 4,//中间显示需要改的位置1
    middlePhoneWidthMarLeft: 0, //背景的图片的margin-left=-aaa   
    middlePhoneWidth: 0, //背景  
    swiperUlWidth: 0, //移动的ul的宽度   
    swiperLiWidth: 0, //移动的li的宽度  
    swiperLeft: 0,  //移动的定位left  
    firstLeft : 0, 

    swiperUlWidth2: 0, //移动的ul的宽度   
    swiperLiWidth2: 0, //移动的li的宽度  
    swiperLeft2: 0,  //移动的定位left  
    firstLeft2: 0, 

    animationData: {},//运动   
    animationData2: {},//运动   
    startClientX: 0,//点击开始 X 轴位置  
    endClientX: 0,//点击结束 X 轴位置  
    images: [], //图片的数据  
    images2 : [],
    styleArr: [], //所有图片的样式数组 对中间的图片放大的操作组 
    styleArr2: [], //所有图片的样式数组 对中间的图片放大的操作组 
    duration: 1000, //动画时间  
    bigImgWidth : 0,//中间大图的宽度
    bigImgHeight : 0,
    smallImgWidth : 0 ,
    smallImgHeight : 0,

    bigImgWidth2: 0,//中间大图的宽度
    bigImgHeight2: 0,
    smallImgWidth2: 0,
    smallImgHeight2: 0,

    imagesTitle : '',
    smallTop : 0,  //小图距离顶部距离
    top : 0,
    urlTop : 182,//外围view的top值
    addTop : 208,//带有logo标的，外围高度增加
    tab : 0 ,
    imgLeft : 0,
    imgRight : 0,
    prop : 0,  //当前屏幕下，rpx与px的比例
    prop2 : 0,
    systemInfor : '',
    pixelRatio : '',
    prorpNew :'',
    tabVal :0 //默认tab选中值
  }, 
  onLoad: function () {
    var that = this;
    var host = getApp().globalData.servsers;
    //品牌定制
    wx.request({
      url: host+"findclassifyapi/findclassifyxcx",
      data: {},
      method: 'GET',
      header: {
        'Accept': 'application/json'
      },
      success: function (res) {
        var size = res.data.total;

        that.setData({
          navList: res.data.rows
        });
        console.log(res.data.rows);
        if (res == null || res.data == null) {
          console.error('网络请求失败');
          return;
        }
      }
    })

    //品牌定制
    wx.request({
      url: host + "findapi/findall",
      data: {},
      method: 'GET',
      header: {
        'Accept': 'application/json'
      },
      success: function (res) {
        var size = res.data.total;
        that.setData({
          contentList: res.data.rows
        });
        if (res == null || res.data == null) {
          console.error('网络请求失败');
          return;
        }
      }
    })

    //===取屏幕宽度=======  
    wx.getSystemInfo({
      success: function (res) { 
        that.setData({
          phoneWidth: res.windowWidth,
          systemInfor: res.platform,
          pixelRatio : res.pixelRatio
        })
        console.log("--" + res.pixelRatio);
      }
    });

    var phoneWidth = that.data.phoneWidth;
    var bigImgWidth = parseInt(phoneWidth * 0.68);
    var bigImgHeight = parseInt(1246 * bigImgWidth / 1024);

    var bigImgWidth2 = parseInt(phoneWidth * 0.68);
    var bigImgHeight2 = parseInt(800 * bigImgWidth / 526);

    var smallImgWidth = parseInt(phoneWidth * 0.58);
    var smallImgHeight = parseInt(1246 * smallImgWidth / 1024);

    var smallImgWidth2 = parseInt(phoneWidth * 0.58);
    var smallImgHeight2 = parseInt(800 * smallImgWidth / 526);

    var imgLeft = parseInt(phoneWidth * 0.08);
    var imgRight = parseInt(phoneWidth * 0.04);

    var prop = phoneWidth/750;
    var prop2 = 750 / phoneWidth;
    var prorpNew = '';

    var systemInfor = that.data.systemInfor;
    console.log(systemInfor);
    if (systemInfor == 'ios'){
      prorpNew = that.data.pixelRatio * 0.1;
      console.log(prorpNew);
    }else{
      prorpNew = that.data.pixelRatio / 2;
    }


    // var smallTop = parseInt((bigImgHeight - 502)/2);
    var smallTop = parseInt((bigImgHeight - smallImgHeight));
    
    that.setData({
      images: that.data.tabImgList[0].imgList,
      images2: that.data.tabImgList[1].imgList,
      imagesTitle: that.data.tabImgList[0].imageFooterTitle,
      persNub: 27,
      swiperLeft:0,
      swiperLeft2 : 0,
      firstLeft: 0,
      smallTop: smallTop,
      imgLeft: imgLeft
    })

    let swiperLiWidth = that.data.swiperLiWidth;//li宽
    swiperLiWidth = phoneWidth * 0.66 ;   //li的宽度赋值
    var arrimages = that.data.images;//获取图片Arr的数组  
    var arrimages2 = that.data.images2;//获取图片Arr的数组  
    let swiperUlWidth = that.data.swiperUlWidth; //移动的ul 的宽度  
    let swiperUlWidth2 = that.data.swiperUlWidth2; //移动的ul 的宽度  
    swiperUlWidth = swiperLiWidth * arrimages.length + phoneWidth * 0.1;  //赋值移动的ul 的宽度  
    swiperUlWidth2 = swiperLiWidth * arrimages2.length + phoneWidth * 0.1;  //赋值移动的ul 的宽度  


    //初始化所有的图片的宽高
    let styleArr = that.data.styleArr;
    for (let i = 0; i < arrimages.length; i++) {
      var obj = {
        imgwidth: smallImgWidth,
        imgheight: smallImgHeight,
        top: that.data.smallTop,
        animationliscal: ""
      }
      styleArr.push(obj)
    }
    styleArr[22] = {
      imgwidth: bigImgWidth,
      imgheight: bigImgHeight,
      top: 0,
      animationliscal: ""
    }; 

    let styleArr2 = that.data.styleArr2;
    for (let i = 0; i < arrimages2.length; i++) {
      var obj = {
        imgwidth: smallImgWidth2,
        imgheight: smallImgHeight2,
        top: that.data.smallTop,
        animationliscal: ""
      }
      styleArr2.push(obj)
    }
    styleArr2[3] = {//中间显示需要改的位置2
      imgwidth: bigImgWidth2,
      imgheight: bigImgHeight2,
      top: 0,
      animationliscal: ""
    }; 



    that.setData({
      styleArr: styleArr,
      styleArr2: styleArr2,
      swiperUlWidth: swiperUlWidth,
      swiperUlWidth2: swiperUlWidth2,
      swiperLiWidth: swiperLiWidth,
      bigImgWidth: bigImgWidth,
      bigImgHeight: bigImgHeight,
      smallImgWidth: smallImgWidth,
      smallImgHeight: smallImgHeight,
      bigImgWidth2: bigImgWidth2,
      bigImgHeight2: bigImgHeight2,
      smallImgWidth2: smallImgWidth2,
      smallImgHeight2: smallImgHeight2,
      phoneWidth: phoneWidth,
      prop: prop,
      prop2: prop2,
      prorpNew: prorpNew,
      swiperLeft: - (that.data.phoneWidth * 0.66 - prorpNew) * 22 ,
      swiperLeft2: - (that.data.phoneWidth * 0.66 - prorpNew) * 3  //中间显示需要改的位置3
    })

  },

  startTou: function (e) {
    let that = this;
    that.data.startClientX = e.touches[0].clientX;  //触摸按下 距离屏幕左边的值  

  },
  scroll: function (e) {
    let that = this;
    that.data.endClientX = e.touches[0].clientX; //滑动值  

  },
  endTou: function (e) {
    let that = this;  
    var animation = wx.createAnimation({
      duration: 1000,
      timingFunction: 'linear',
    })

    //大图宽高
    var bigImgWidth = that.data.bigImgWidth;
    var bigImgHeight = that.data.bigImgHeight;
    var smallImgWidth = that.data.smallImgWidth;
    var smallImgHeight = that.data.smallImgHeight;
    var prop = that.data.prop;
    var prorpNew = that.data.prorpNew;
    var prop2 = prorpNew;

    var swiperLiWidthLeft = that.data.swiperLiWidth;
    this.animation = animation;
    let startClientX = that.data.startClientX;
    let endClientX = that.data.endClientX;
    let phoneWidth = that.data.phoneWidth;
    if (endClientX == 0) {   //move的值为0 时定为点击
      if (startClientX < phoneWidth / 2 - 70) {  //点击开始的位置,与图片的一半减70px  为左边点击  
        this.animation = animation;
        animation.left(that.data.swiperLeft).step({ duration: 1000 }) //移动动画  
        let imgindex = that.data.imgindex - 1; //下标值  
        if (imgindex < 1) {
          console.log("超出了最小数组长度")
          return;
        }
        that.setData({
          swiperLeft: Math.floor(that.data.swiperLeft + phoneWidth * 0.66　- prop2),  //ul向右移动值  
          imgindex: that.data.imgindex - 1, //下标值  
          animationData: animation.export()
        })

        let styleArr = that.data.styleArr;
        var arrimages = that.data.images;//获取图片Arr的数组  
        for (let i = 0; i < arrimages.length; i++) {
          styleArr[i] = {
            imgwidth: smallImgWidth,
            imgheight: smallImgHeight,
            top: that.data.smallTop,
            animationliscal: ""
          }
        }
        var imgindex = that.data.imgindex;
        styleArr[imgindex] = {
          imgwidth: bigImgWidth,
          imgheight: bigImgHeight,
          top : 0 ,
          animationliscal: ""
        };
        that.setData({
          styleArr: styleArr
        })
        console.log("左边点击1:" + that.data.imgindex)

      } else if (startClientX > phoneWidth / 2 + 70) {   //点击开始的位置,与图片的一半减70px  为右边点击  

        let imgindex = that.data.imgindex + 1;
        if (imgindex > that.data.images.length ) {
          console.log("超出了数组最大长度")
          return;
        }
        let styleArr = that.data.styleArr;
        var arrimages = that.data.images;//获取图片Arr的数组  
        for (let i = 0; i < arrimages.length; i++) {
          styleArr[i] = {
            imgwidth: smallImgWidth,
            imgheight: smallImgHeight,
            top : that.data.smallTop,
            animationliscal: ""
          }
        }
        styleArr[imgindex] = {
          imgwidth: bigImgWidth,
          imgheight: bigImgHeight,
          top: 0,
          animationliscal: ""
        };
        that.setData({
          styleArr: styleArr
        })
        console.log("右边点击1:" + that.data.imgindex)

        animation.left(that.data.swiperLeft).step({ duration: 1000 })  //移动动画  
        that.setData({
          swiperLeft: Math.floor(that.data.swiperLeft - phoneWidth * 0.66 + prop2),//UL向左移动  
          imgindex: that.data.imgindex + 1, //下标的值  
          animationData: animation.export()
        })
      } else {   //点击中间的大图,带参跳入图片的详情  
        var tab = that.data.tab;
        if(tab == 1){
          let imgindexclick = that.data.imgindex;
          let url = that.data.images[imgindexclick].url;
          url = 2917;
          wx.navigateTo({
            url: '/pages/articleInfor/articleInfor?id=' + url
          })
        }

        
      }
    } else {  //滑动左边 ul向左移动 右边的小图放大  滑动右边ul向右移动 右边的小图放大  
      if (endClientX - startClientX > 0) {
        let imgindex = that.data.imgindex - 1;
        if (imgindex < 1) {
          console.log("超出了")
          return;
        }
        animation.left(that.data.swiperLeft).step({ duration: 1000 }) //移动动画  
        that.setData({
          swiperLeft: Math.floor(that.data.swiperLeft + phoneWidth * 0.66 - prop2), //右边滑动 ul向右移动  
          imgindex: that.data.imgindex - 1,
          animationData: animation.export()
        })
        
        let styleArr = that.data.styleArr;
        var arrimages = that.data.images;//获取图片Arr的数组  
        for (let i = 0; i < arrimages.length; i++) {
          styleArr[i] = {
            imgwidth: smallImgWidth,
            imgheight: smallImgHeight,
            top: that.data.smallTop,
            animationliscal: ""
          }
        }
        var imgindex = that.data.imgindex;
        styleArr[imgindex-1] = {
          imgwidth:bigImgWidth,
          imgheight: bigImgHeight,
          top: 0,
          animationliscal: ""
        };
        that.setData({
          styleArr: styleArr
        })
        console.log("右边滑动2:" + that.data.imgindex)

      }
      if (endClientX - startClientX < 0) {
        let imgindex = that.data.imgindex + 1;
        if (imgindex > that.data.images.length ) {
          console.log("超出了")
          return;
        }

        this.animation = animation;
        animation.left(that.data.swiperLeft).step({ duration: 1000 }) //移动动画  

        that.setData({
          swiperLeft: Math.floor(that.data.swiperLeft - phoneWidth * 0.66 + prop2),  //左边滑动 ul向左移动  
          imgindex: that.data.imgindex + 1, //下标的值  
          animationData: animation.export()
        })    

        let styleArr = that.data.styleArr;
        var arrimages = that.data.images;//获取图片Arr的数组  
        for (let i = 0; i < arrimages.length; i++) {
          styleArr[i] = {
            imgwidth: smallImgWidth,
            imgheight: smallImgHeight,
            top: that.data.smallTop
          }
        }
        var imgindex = that.data.imgindex;
        styleArr[imgindex-1] = {
          imgwidth: bigImgWidth,
          imgheight: bigImgHeight,
          top: 0
        };
        that.setData({
          styleArr: styleArr
        })
        console.log("左边滑动2:" + that.data.imgindex);
      }

    }  
    let NewstyleArr = that.data.styleArr;    
    that.setData({
      startClientX: 0,
      endClientX: 0,  
      styleArr: NewstyleArr
    })  

  },



  endTou2: function (e) {
    let that = this;
    var animation = wx.createAnimation({
      duration: 1000,
      timingFunction: 'linear',
    })

    //大图宽高
    var bigImgWidth2 = that.data.bigImgWidth2;
    var bigImgHeight2 = that.data.bigImgHeight2;
    var smallImgWidth2 = that.data.smallImgWidth2;
    var smallImgHeight2 = that.data.smallImgHeight2;
    var prop = that.data.prop;
    var prop2 = prop;

    var swiperLiWidthLeft = that.data.swiperLiWidth;
    this.animation = animation;
    let startClientX = that.data.startClientX;
    let endClientX = that.data.endClientX;
    let phoneWidth = that.data.phoneWidth;
    if (endClientX == 0) {   //move的值为0 时定为点击
      if (startClientX < phoneWidth / 2 - 70) {  //点击开始的位置,与图片的一半减70px  为左边点击  
        this.animation = animation;
        animation.left(that.data.swiperLeft2).step({ duration: 1000 }) //移动动画  
        let imgindex = that.data.imgindex2 - 1; //下标值  
        if (imgindex < 1) {
          console.log("超出了最小数组长度")
          return;
        }
        that.setData({
          swiperLeft2: Math.floor(that.data.swiperLeft2 + phoneWidth * 0.66 　- prop2),  //ul向右移动值  
          imgindex2: that.data.imgindex2 - 1, //下标值  
          animationData2: animation.export()
        })

        let styleArr2 = that.data.styleArr2;
        var arrimages2 = that.data.images2;//获取图片Arr的数组  
        for (let i = 0; i < arrimages2.length; i++) {
          styleArr2[i] = {
            imgwidth: smallImgWidth2,
            imgheight: smallImgHeight2,
            top: that.data.smallTop,
            animationliscal: ""
          }
        }
        var imgindex = that.data.imgindex2;
        styleArr2[imgindex] = {
          imgwidth: bigImgWidth2,
          imgheight: bigImgHeight2,
          top: 0,
          animationliscal: ""
        };
        that.setData({
          styleArr2: styleArr2
        })
        console.log("左边点击1:" + that.data.imgindex2)

      } else if (startClientX > phoneWidth / 2 + 70) {   //点击开始的位置,与图片的一半减70px  为右边点击  

        let imgindex = that.data.imgindex2 + 1;
        if (imgindex > that.data.images.length) {
          console.log("超出了数组最大长度")
          return;
        }
        let styleArr2 = that.data.styleArr2;
        var arrimages2 = that.data.images2;//获取图片Arr的数组  
        for (let i = 0; i < arrimages2.length; i++) {
          styleArr2[i] = {
            imgwidth: smallImgWidth2,
            imgheight: smallImgHeight2,
            top: that.data.smallTop,
            animationliscal: ""
          }
        }
        styleArr2[imgindex] = {
          imgwidth: bigImgWidth2,
          imgheight: bigImgHeight2,
          top: 0,
          animationliscal: ""
        };
        that.setData({
          styleArr2: styleArr2
        })
        console.log("右边点击1:" + that.data.imgindex2)

        animation.left(that.data.swiperLeft).step({ duration: 1000 })  //移动动画  
        that.setData({
          swiperLeft2: Math.floor(that.data.swiperLeft2 - phoneWidth * 0.66 + prop2),//UL向左移动  
          imgindex2: that.data.imgindex2 + 1, //下标的值  
          animationData2: animation.export()
        })
      } else {   //点击中间的大图,带参跳入图片的详情  
        var tab = that.data.tab;
        if (tab == 1) {
          // let imgindexclick = that.data.imgindex2;
          // console.log(that.data.images2);
          // let url = that.data.images2[imgindexclick].url;
          
          // url = 2923;
          // wx.navigateTo({
          //   url: '/pages/articleInfor/articleInfor?id=' + url
          // })
        }


      }
    } else {  //滑动左边 ul向左移动 右边的小图放大  滑动右边ul向右移动 右边的小图放大  
      if (endClientX - startClientX > 0) {
        let imgindex = that.data.imgindex2 - 1;
        if (imgindex < 1) {
          console.log("超出了")
          return;
        }
        animation.left(that.data.swiperLeft2).step({ duration: 1000 }) //移动动画  
        that.setData({
          swiperLeft2: Math.floor(that.data.swiperLeft2 + phoneWidth * 0.66 - prop2), //右边滑动 ul向右移动  
          imgindex2: that.data.imgindex2 - 1,
          animationData2: animation.export()
        })

        let styleArr2 = that.data.styleArr2;
        var arrimages2 = that.data.images2;//获取图片Arr的数组  
        for (let i = 0; i < arrimages2.length; i++) {
          styleArr2[i] = {
            imgwidth: smallImgWidth2,
            imgheight: smallImgHeight2,
            top: that.data.smallTop,
            animationliscal: ""
          }
        }
        var imgindex = that.data.imgindex2;
        styleArr2[imgindex - 1] = {
          imgwidth: bigImgWidth2,
          imgheight: bigImgHeight2,
          top: 0,
          animationliscal: ""
        };
        that.setData({
          styleArr2: styleArr2
        })
        console.log("右边滑动2:" + that.data.imgindex2)

      }
      if (endClientX - startClientX < 0) {
        let imgindex = that.data.imgindex2 + 1;
        if (imgindex > that.data.images.length) {
          console.log("超出了")
          return;
        }

        this.animation = animation;
        animation.left(that.data.swiperLeft2).step({ duration: 1000 }) //移动动画  

        that.setData({
          swiperLeft2: Math.floor(that.data.swiperLeft2 - phoneWidth * 0.66 + prop2),  //左边滑动 ul向左移动  
          imgindex2: that.data.imgindex2 + 1, //下标的值  
          animationData2: animation.export()
        })

        let styleArr2 = that.data.styleArr2;
        var arrimages2 = that.data.images2;//获取图片Arr的数组  
        for (let i = 0; i < arrimages2.length; i++) {
          styleArr2[i] = {
            imgwidth: smallImgWidth2,
            imgheight: smallImgHeight2,
            top: that.data.smallTop
          }
        }
        var imgindex = that.data.imgindex2;
        styleArr2[imgindex - 1] = {
          imgwidth: bigImgWidth2,
          imgheight: bigImgHeight2,
          top: 0
        };
        that.setData({
          styleArr2: styleArr2
        })
        console.log("左边滑动2:" + that.data.imgindex2);
      }

    }
    let NewstyleArr2 = that.data.styleArr2;
    that.setData({
      startClientX: 0,
      endClientX: 0,
      styleArr2: NewstyleArr2
    })

  },


  //tab切换图片内容
  changeTab:function(e){
    var that = this;
    var index = e.currentTarget.dataset.index;
    var images=0 , imagesTitle=0 , addTop=0 , urlTop=0 , tab=0;
    if(index == 0){
      addTop = 208;
      urlTop = 182;
      images = that.data.tabImgList[index].imgList;
      imagesTitle = that.data.tabImgList[index].imageFooterTitle;
    } else if (index == 1){
      addTop = 80;
      urlTop = 50;
      images = that.data.tabImgList[index].imgList;
      imagesTitle = that.data.tabImgList[index].imageFooterTitle;
    }else{
      images = [];
      imagesTitle = '';
    }

    that.setData({
      images: images,
      imagesTitle: imagesTitle,
      addTop: addTop,
      urlTop : urlTop,
      tab : index,
      tabVal: index
    });
    
  },

  onPullDownRefresh: function (e) {
    wx.stopPullDownRefresh();
  }

})

var contentList = []
var that;
var Util = require('../../utils/util.js'); 