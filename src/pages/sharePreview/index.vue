<template>
  <div class="container">
    <!-- <div class="shareModal" v-if="shareModalVisible" @click="shareModalVisible = false">
      <button open-type="share" type="primary">分享</button>
    </div> -->
    <!-- 被分享者第一次进，必须授权 -->
    <div class="shareModal" v-if="sharedModalVisible" >
      <div>
        <div class="title">
          是否确定授权登录
        </div>
        <div class="btns">
          <button open-type="getUserInfo" @getuserinfo="getuserinfo">确定</button>
          <button @click="back2Home">取消</button>
        </div>
      </div>
    </div>
    <h1>{{houseInfo.build+'-'+houseInfo.room}} 
      <span>更新于{{projectInfo.createtime}}</span>
       </h1>
    <swiper id="swiper" style="height:200px" :current="current" v-if="imgUrls.length > 0" 
      :indicator-dots='true'
      indicator-color='#d8d8d8'
      indicator-active-color = '#ffad36'
      :autoplay='true'
      :interval='3000'
      :duration='1000'
      :circular='true' >
      <block v-for="(item, index) in imgUrls" :key="index" >
        <swiper-item>
          <image style="width:100%" :src="item"  ></image>
        </swiper-item>
      </block>
    </swiper>
    <div class="VRbtn" v-if="houseInfo.url" @click="go2VR">VR</div>
    
    <div class="locationBox">
        <div class="innerBox">
          <div>
            <img src="/static/images/icon_location.png" alt="">
            <div @click="bindcontroltap">{{projectInfo.address}}</div>
          </div>
          <div>
            <img src="/static/images/ditie.png" alt="">
            <div>{{projectInfo ? projectInfo.traffic_summary : iteminfo[0].traffic_summary}}</div>
          </div>
        </div>
        <map id="map" :markers="map.markers" @tap="bindcontroltap"  :latitude="map.lat" :longitude="map.lng" ></map>
    </div>
    <div class="rentBox">
        <div @click="rentClick">
          <p >{{houseInfo.rent}}</p>
          <span>租金单价(元/m²·天)</span>
        </div>
        <div>
          <p>{{houseInfo.built_up_area}}</p>
          <span>m²</span>
        </div>
        <div @click="decorateClick">
          <p>装修</p>
          <span>{{houseInfo.decorate_type || '-'}}</span>
        </div>
    </div>
    <div class="division"></div>
    <section>
      <h2>房源描述</h2>
      <div class="innerBox" style="font-size:14px;color:gray" v-html="houseInfo.remarker || '-'">
      </div>
    </section>
    <div class="division"></div>
    <section class="chat">
      <h2>免费咨询</h2>
      <div class="innerBox">
        <img :src="role == 'other' ? employee.headurl : userInfo.avatarUrl" alt="" class="avatarUrl">
        <div class="">
          <p class="name">{{role == 'other' ? employee.nick_name : userInfo.nickName}}</p>
          <p class="desc">租赁顾问</p>
        </div>
        <button class="phoneBtn" open-type="getPhoneNumber" @getphonenumber="getPhoneNumber2"><img src="/static/images/dianhua.png" alt="" class="phone"></button>
      </div>
    </section>
    <div class="division"></div>
    <section class="project">
      <h2>所属项目 <span @click="lookProjectDetail">查看项目 >></span></h2>
      <div class="innerBox" @click="lookProjectDetail">
        <img :src="projectInfo.imageList ? (projectInfo.imageList.length>0 ? projectInfo.imageList[0].url : '/static/images/zanwutupian.png') : '/static/images/zanwutupian.png' " alt="" class="avatarUrl">
        <div class="">
          <p class="name">{{projectInfo.item}}</p>
        </div>
      </div>
    </section>
    <div class="division"></div>
    <div class="footer">
      <button class="shareBtn" open-type="share" >分享给好友</button>
      <button class="chatBtn" open-type="getPhoneNumber" @getphonenumber="getPhoneNumber">咨询招商部</button>
    </div>
    <div class="previewImg" v-if="previewImg > -1" @click="previewImg = -1">
      <!-- <img :src="previewImg" alt="" @click="previewImg = '' "> -->
       <swiper id="swiper2" style="height:300px" :current="previewImg" 
          :indicator-dots='true'
          indicator-color='#d8d8d8'
          indicator-active-color = '#ffad36'
          :autoplay='false'
          :circular='true' >
          <block v-for="(item, index) in imgUrls" :key="index" >
            <swiper-item>
              <image style="width:100%; height:100%" :src="item"  ></image>
            </swiper-item>
          </block>
        </swiper>
    </div>
  </div>
</template>

<script>
import {fmtDate} from '../../utils/index.js'
import { Promise } from 'q';
export default {
  components: {},

  data() {
    return {
      imgUrls:[],
      map:{
        markers:[],
        lat:'',
        lng:'',
      },
      // 项目信息
      projectInfo:{},
      // 房源信息
      houseInfo:{},
      // 个人信息
      userInfo:{},
      openId:'',
      // 展示分享modal
      shareModalVisible:true,
      // 被分享者，授权
      sharedModalVisible:false,
      // 后端根据房源生成的code
      code:'',
      // 房源code
      roomCode:'',
      // sessionKey
      sessionKey:'',
      employee:{
        headurl:'',
        nick_name:'',
        mobile:'',
      },
      infoId:'',
      isCellPhone:false,
      iteminfo:{},
      // 角色，当前时被分享还是分享
      role:'self',
      previewImg:-1,
    };
  },
  mounted() {
  },
  onLoad: function(options) {
    console.log('onload >>',options)
    // 被分享
    var self = this
    if(options.code){
      this.role = 'other'
      this.infoId = options.code
      this.roomCode = options.roomCode
      // 获取openid
      this.loginGetOpenId()
      // 去授权
      console.log('被分享》',self.userInfo)
      if(Object.keys(self.userInfo).length <1){
        this.sharedModalVisible = true
      }
      // 获取项目详情
      self.$http.post({
        url: '/share/info',
        data: {
          code:options.code,
        }
      }).then(res => {
          console.log('获取项目详情',res)
          this.imgUrls = res.roominfo.path.split(',')
          this.iteminfo = res.iteminfo
          this.projectInfo = {
            item:res.roominfo.item,
            address:res.roominfo.address,
            createtime:fmtDate(res.shareinfo.createtime,'yyyy-MM-dd'),
            itemid:res.roominfo.item_id,
            decorate_type:res.roominfo.decorate_type,
            remarker:res.roominfo.remarker,
          }
          this.houseInfo = {
            build:res.roominfo.build,
            room:res.roominfo.room,
            phone:res.roominfo.phone,
            built_up_area:res.roominfo.built_up_area,
            rent:res.roominfo.rent,
            url:res.roominfo.url,
            path:res.roominfo.path,
            remarker:res.roominfo.remarker
          }
          this.projectInfo.imageList = res.iteminfo[0].imageList
          console.log('>>>>MMM   ',this.projectInfo.imageList)
          this.employee = res.employee
          this.employee.nick_name = this.$base64.decode(this.employee.nick_name) 
          // nickname存在，记录被分享人信息
          console.log('nickname存在，记录被分享人信息',this.userInfo)
          if(this.userInfo.nickName){
            this.shareRecord()
          }
          wx.setNavigationBarTitle({title: res.shareinfo.title})
          
      })
      
    }else{
      this.role = 'self'
      var target = JSON.parse(options.target);
      this.infoId = options.infoId
      this.houseInfo = target;
      this.imgUrls = this.houseInfo.path.split(',')
      console.log('房源信息》',target);
      wx.setNavigationBarTitle({title: this.houseInfo.title})
    }
    console.log('role : ',this.role)
    this.showMap()
  },
  onShow() {
    this.previewImg = -1
    wx.hideHomeButton()
    var self =this
    wx.getStorage({
      key: 'projectInfo',
      success (res) {
        self.projectInfo = JSON.parse(res.data)
        self.projectInfo.createtime = fmtDate(self.projectInfo.createtime,'yyyy-MM-dd')
        console.log('项目信息》',self.projectInfo)
      }
    })
    wx.getStorage({
      key: 'userInfo',
      success (res) {
        self.userInfo = JSON.parse(res.data)
        console.log('个人信息》',self.userInfo)
      }
    })
    wx.getStorage({
      key: 'openId',
      success (res) {
        self.openId = res.data
        console.log('openId信息》',self.openId)
      }
    })
    wx.getStorage({
      key: 'sessionKey',
      success (res) {
        self.sessionKey = res.data
        console.log('sessionKey信息》',self.sessionKey)
      }
    })
  },
  methods:{
   
    // 租金点击
    rentClick(){
      var previewImg = this.imgUrls[0]
      if(previewImg){
        this.previewImg = 0
      }
    },
    // 装修点击
    decorateClick(){
      var previewImg = this.imgUrls[1]
      if(previewImg){
        this.previewImg = 1
      }
    },
    showMap(){
      var self = this
      // 显示位置
      setTimeout(() => {
        self.$QQMapWX.geocoder({
          address:self.projectInfo.address,
          success(res){
            console.log(res)
            self.map = {
              markers:[{
                iconPath: "/static/images/location.png",
                id: Math.random(),
                latitude: res.result.location.lat,
                longitude: res.result.location.lng,
                width: 50,
                height: 50,
                zIndex:213,
                title:self.projectInfo.address
              }],
              lat:res.result.location.lat,
              lng:res.result.location.lng,
            }
          }
        })
      }, 300);
    },
    // 点击地图,进入路线导航
    bindcontroltap(){
      // let key ='QMHBZ-O4LLW-ZB4RY-RLAHW-YZOYK-CLFYY'; //使用在腾讯位置服务申请的key
      // let referer ='e通世界产业园招商平台';  //调用插件的小程序的名称
      // let endPoint = JSON.stringify({ //终点
      //   'name':this.projectInfo.address,
      //   'latitude': this.map.lat,
      //   'longitude': this.map.lng
      // });
      // wx.navigateTo({
      //   url:'plugin://routePlan/route-plan?key=' + key +'&referer=' + referer +'&endPoint=' + endPoint
      // });
      var self = this
      wx.getLocation({
        type: 'gcj02', //返回可以用于wx.openLocation的经纬度
        success: function(res) {
        
          wx.openLocation({
            latitude: self.map.lat,
            longitude:self.map.lng,
            name:self.projectInfo.address,
            scale: 28
            })
        }
        })
    },
    back2Home(){
      // wx.switchTab({
      //    url: '/pages/home/main' 
      // });
      wx.navigateTo({ url:'/pages/projectList/main'  });
    },
    go2VR(){
      var params = this.houseInfo.url
      console.log('VRurl >',params)
      wx.navigateTo({ url: "/pages/VR/main?target="+params });
    },
    getPhoneNumber2(e){
      this.getPhoneNumber(e,true)
    },
    // 查看项目详情
    lookProjectDetail(){
      var params = ''
      if(this.roomCode){
        params = "?data="+JSON.stringify(this.iteminfo[0])
      }
      console.log('params',params)
      wx.navigateTo({ url: "/pages/projectDetail/main"+params });
    },
    // 获取手机号
    getPhoneNumber(e,flag){
       var self = this

      console.log(e)
      
     
      if(e.mp.detail.encryptedData){
        this.$http.post({
          url: '/srAuth/getPhoneNum',
          data: {
            encryptedData:e.mp.detail.encryptedData,
            session_key:this.sessionKey,
            iv:e.mp.detail.iv,
          }
        }).then(res => {
          console.log('获取手机号之后发送数据：',{
              "itemid": this.projectInfo.itemid,
              "infoid": this.infoId ,
              "openid": this.openId,
              "nickname": this.$base64.encode(this.userInfo.nickName) ,
              "mobile": res.phoneNumber,
              "roomcode": this.roomCode || this.houseInfo.code
            })
          this.$http.post({
            url: '/contactus/add',
            data: {
              "itemid": this.projectInfo.itemid,
              "infoid": this.infoId ,
              "openid": this.openId,
              "nickname": this.$base64.encode(this.userInfo.nickName) ,
              "mobile": res.phoneNumber,
              "roomcode": this.roomCode || this.houseInfo.code
            }
          }).then(res => {

          })
          this.$http.post({
            url: '/share_record/modifyMobile',
            data: {
              "openid": this.openId,
              "mobile": res.phoneNumber ,
            }
          }).then(res => {
            
          })
          console.log('准备打电话》',this.houseInfo)
          console.log('准备打电话》',flag)
          console.log('准备打电话》',this.employee)
          console.log('准备打电话》',res.phoneNumber)
          var _phone = this.houseInfo.phone || this.projectInfo.phone
          if(flag){
            _phone = this.employee.mobile || res.phoneNumber
          }
          if(flag && this.role =='self'){
            _phone = res.phoneNumber
          }
          console.log('最终电话》',_phone)
          wx.makePhoneCall({
              phoneNumber:_phone
            })
        })
      }else{
        
      }
    },
    shareHandle(){
      var self = this
      // wx.showActionSheet({
      //   itemList: ['分享给好友'],
      //   // itemList: ['分享给好友', '生成图片分享至朋友圈'],
      //   success (res) {
      //     console.log(res.tapIndex)
      //     // 1、分享好友
      //     if(res.tapIndex == 0){
      //         self.shareModalVisible = true
      //     }else if(res.tapIndex == 1){
      //       // 2、成功分享图
      //       var params = ''
      //       for (var k in self.houseInfo) {
      //         params += k+'='+self.houseInfo[k]+'&'
      //       }
      //       params+= 'address='+self.projectInfo.address
      //       params+= '&nickName='+self.userInfo.nickName
      //       wx.navigateTo({ url: "/pages/sharePoster/main?"+params });
      //     }
      //   },
      //   fail (res) {
      //     console.log(res.errMsg)
      //   }
      // })
    },
    getuserinfo(e) {
      var self = this;
      if (e.mp.detail.userInfo) {
        wx.getUserInfo({
          success: function(res2) {
            console.log("用户信息》》", res2);
            self.userInfo = res2.userInfo
            wx.setStorageSync("userInfo", JSON.stringify(res2.userInfo));
            self.sharedModalVisible = false
            // 记录被分享人进来
            self.shareRecord()
          }
        });
      }
    },
    loginGetOpenId(){
      // 登录获取openid
      var self = this
      wx.login({
        success(res) {
          console.log(res);
          if (res.code) {
            self.$http
              .post({
                url: "/srAuth/getOpenid",
                data: { code: res.code }
              })
              .then(res => {
                console.log(res);
                self.openId = res.openid
                self.sessionKey = res.sessionKey
                wx.setStorageSync("sessionKey", res.sessionKey);
                wx.setStorageSync("openId", res.openid);
              });
          } else {
            console.log("登录失败！" + res.errMsg);
          }
        }
      });
    },
    // 记录当前被分享人的信息
    shareRecord(){
      var self = this
      self.$http.post({
        url: '/share_record',
        data: {
            "infoid": this.infoId,
            "openid": self.openId,
            "nickname": self.$base64.encode(self.userInfo.nickName),
            "headurl": self.userInfo.avatarUrl,
            "mobile": ""
        }
      }).then(res => {
          
      })
    } 
  },
  onShareAppMessage: function (res) {
    console.log(res)
    if (res.from === 'button') {
      // 来自页面内转发按钮
      // console.log(res.target)
    }
    return {
      title: (this.houseInfo.park || projectInfo.item) +'-'+this.houseInfo.build+'-'+this.houseInfo.room,
      path: '/pages/sharePreview/main?code='+this.infoId+'&roomCode='+this.houseInfo.code,
    }
  }
};
</script>

<style lang="scss" scoped>
.container{
  padding: 15px;
  padding-bottom: 70px;
  .VRbtn{
    position: absolute;
    width: 70px;
    height: 30px;
    right: 15px;
    top: 67px;
    line-height: 30px;
    color: #fff;
    font-size: 14px;
    background: rgba(41, 127, 240, 0.8);
    text-align: center;
    border-radius: 5px;
  }
  .shareModal{
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0,0,0,.5);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 2;
    &>div{
      border-radius: 10px;
      width: 300px;
      border: 1px solid #eee;
      .title{
        text-align: center;
        height: 100px;
        line-height: 100px;
        color: #fff;
      }
      .btns{
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding-bottom: 20px;
      }
    }
  }
  .rentBox{
    display: flex;
    margin: 15px 0;
    &>div{
      flex: 1;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      p{
        font-size: 18px;
        font-weight: bold;
        color: orange;
      }
      span{
        margin-top: 10px;
        font-size: 12px;
        color: gray;
        font-weight: normal;
      }
    }
    &>div:nth-child(2){
      border-left: 1px solid #eee;
      border-right: 1px solid #eee;
    }
  }
  .previewImg{
    position: fixed;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(1,1,1,.9);
    z-index: 123;
    #swiper2{
      position: relative;
      top: 50%;
      transform: translateY(-50%);
    }
    // img{
    //   width: 100%;
    //   height: 300px;
    //   position: absolute;
    //   top:50%;
    //   transform: translateY(-50%);
    // }
  }
  .footer{
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 60px;
    padding: 10px 15px;
    display: flex;
    justify-content: space-between;
    background-color: #fff;
    border-top: 1px solid #eee;
    font-size: 14px;
    box-sizing: border-box;
    .shareBtn{
      background-color: orange;
      color: #fff;
      text-align: center;
      line-height: 40px;
      height: 40px;
      width: 150px;
      padding: 0;
      margin: 0;
    }
    .chatBtn{
      padding: 0;
      width: 150px;
      background-color: rgb(41, 127, 240);
      color: #fff;
      text-align: center;
      line-height: 40px;
      height: 40px;
      margin: 0;
    }
  }
  .division{
    background-color: #eee;
    height: 10px;
    width: calc(100% + 30px);
    transform: translate(-15px,0);
  }
  h1{
    font-size: 24px;
    margin-bottom:20px;
    font-weight: bold;
    display: flex;
    justify-content: space-between;
    align-items: center;
    span{
      color: lightgray;
      font-size: 13px;
      font-weight: normal;
    }
  }
  #swiper{
    border-radius: 8px; 
    margin-bottom: 20px;
  }
  .chat,.project{
    h2{
      span{
        float: right;
        color: lightgray;
        font-size: 13px;
        font-weight: normal;
      }
    }
    .innerBox{
      display: flex;
      align-items: center;
      position: relative;
      padding-left: 10px;
      .avatarUrl{
        width: 50px;
        height: 50px;
        border-radius: 5px;
        margin-right: 15px;
      }
      button::after{
        border: none;
        background: none;
      }
      .phoneBtn{
        width: 15px;
        height: 15px;
        background: none;
        position: absolute;
        right: 0;
        bottom: 0;
        top: 50%;
        transform: translateY(-50%);
      }
      div{
        flex:1;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        height: 50px;
        .name{
          font-size: 16px;
          font-weight: bold;
        }
        .desc{
          font-size: 12px;
          color: lightgray;
        }
      }
      .phone{
        position: absolute;
        width: 15px;
        height: 15px;
      }
    }
  }
  .locationBox{
    display: flex;
    align-items: center;
    padding-bottom: 15px;
    border-bottom: 1px solid #eee;
    .innerBox{
      flex:1;
      display: flex;
      justify-content: space-between;
      flex-direction: column;
      font-size: 12px;
      color: gray;
      height: 70px;
      img{
        width: 20px;
        height: 20px;
      }
      &>div{
        display: flex;
        align-items: center;
      }
    }
    #map{
      width: 70px; 
      height: 70px;
      border-radius: 10px;
    }
  }
  section{
    padding: 15px 0;
    h2{
      border-left: 3px solid rgb(41, 127, 240);
      padding-left: 10px;
      font-size: 16px;
      font-weight: bold;
      margin-bottom: 15px;
    }
  }
  .address{
    .location{
      img{
        width: 20px;
        height: 20px;
        display: inline-block;
      }
    }
    #bigMap{
      width: 100%;
      height: 150px;
      padding: 15px 0;
      border-bottom: 1px solid #eee;
    }
  }
}
</style>
