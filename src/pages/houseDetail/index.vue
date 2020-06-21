<template>
  <div class='container'>
    <swiper style="height:240px" v-if="imgUrls.length > 0" 
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
    <div class="desc">
      <p>所属楼宇
        <span>{{dataObj.build}}</span>
      </p>
      <p>房号
        <span>{{dataObj.room}}</span>
      </p>
      <p>面积
        <span>{{dataObj.built_up_area}}m²</span>
      </p>
      <p>房源状态
        <span>{{dataObj.statusDesc}}</span>
      </p>
      <p>楼层
        <span>{{dataObj.floor}}</span>
      </p>
      <p>预租单价
        <span v-if="shareBtnVisible">{{dataObj.rent}}元/m²·天</span>
        <span v-else>详情咨询招商</span>
      </p>
      <p v-if="dataObj.url">360VR
        <span class="anchor" @click="VRHandle">查看房源</span>
      </p>
      <div>
        <p>房源描述
          <em v-html="dataObj.remarker || '-'"></em>
        </p>
      </div>
    </div>
    <footer v-if="shareBtnVisible">
      <!-- <div>
        <img src="/static/images/edit.png" alt="">
        <span>编辑</span>
      </div>
      <div>
        <img src="/static/images/laji.png" alt="">
        <span>编辑</span>
      </div> -->
      <section @click="shareHandle" >
        分享给好友
      </section>
    </footer>
    <div class="footer" v-else>
      <button class="shareBtn" @click="go2subscribe"  >预约看房</button>
      <button class="chatBtn" open-type="getPhoneNumber" @getphonenumber="getPhoneNumber">咨询招商部</button>
    </div>
  </div>
</template>

<script>
export default {
  name: '',
  components:{},
  data () {
    return {
      dataObj:{},
      imgUrls: [],
      shareBtnVisible:false,
      // sessionKey
      sessionKey:'',
      projectInfo:'',
      userInfo:'',
      openId:'',
    }
  },
  onLoad: function(options) {
    this.target = JSON.parse(options.target);
    console.log(this.target,options);
    this.shareBtnVisible = options.from ? false :true  
    this.$http.get({
      url: '/room/'+this.target.code,
    }).then(res => {
      this.dataObj = res.data
      this.dataObj.statusDesc = ['已租','已付意向金','空置','销控'][this.dataObj.status-1]
      this.imgUrls = this.dataObj.path.split(',')
    })
    var self = this
     wx.getStorage({
      key: 'sessionKey',
      success (res) {
        self.sessionKey = res.data
        console.log('sessionKey信息》',self.sessionKey)
      }
    })
    wx.getStorage({
      key: 'projectInfo',
      success (res) {
        self.projectInfo = JSON.parse(res.data)
        console.log('projectInfo信息》',self.projectInfo)
      }
    })
     wx.getStorage({
      key: 'userInfo',
      success (res) {
        self.userInfo = JSON.parse(res.data)
        console.log('userInfo信息》',self.userInfo)
      }
    })
    wx.getStorage({
      key: 'openId',
      success (res) {
        self.openId = res.data
        console.log('openId信息》',self.openId)
      }
    })
  },
  mounted(){},
  methods: {
    // 预约看房
    go2subscribe(){
      wx.setStorage({
        key:"subscribeData",
        data:JSON.stringify(this.projectInfo)
      })
      wx.navigateTo({url:'/pages/subscribe/main?build='+this.dataObj.build+'&room='+this.dataObj.room})
      // '&build='+this.dataObj.build+'&room='+this.dataObj.room})
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
   
          // console.log('获取手机号之后发送数据：',{
          //     "itemid": this.projectInfo.itemid,
          //     "infoid": this.dataObj.code ,
          //     "openid": this.openId,
          //     "nickname": this.$base64.encode(this.userInfo.nickName) ,
          //     "mobile": res.phoneNumber,
          //     "roomcode": dataObj.room
          //   })
          console.log(1)
          console.log(this.projectInfo.itemid)
          console.log(this.dataObj.code)
          console.log(this.openId)
          console.log(this.$base64.encode(this.userInfo.nickName))
          console.log(res.phoneNumber)
          console.log(this.dataObj.room)
          this.$http.post({
            url: '/contactus/add',
            data: {
              "itemid": this.projectInfo.itemid,
              "infoid": this.dataObj.code ,
              "openid": this.openId,
              "nickname": this.$base64.encode(this.userInfo.nickName) ,
              "mobile": res.phoneNumber,
              "roomcode": this.dataObj.room
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
          console.log('准备打电话》',this.projectInfo.phone)
          
          wx.makePhoneCall({
              phoneNumber:this.projectInfo.phone
            })
        })
      } 
    },
    VRHandle(){
      var value  =  this.dataObj.url
       wx.navigateTo({url:'/pages/VR/main?target='+value})
    },
    shareHandle(){
      var value = JSON.stringify(this.dataObj)
      wx.navigateTo({url:'/pages/shareEdit/main?target='+value})
    }
  }
}
</script>

<style lang='scss' scoped>
 .container{
   padding-bottom: 70px;
   background-color: #eee;
   .anchor{
     color: rgb(41, 127, 240);
   }
   .desc{
     background-color: #fff;
     p{
       font-size: 14px;
       font-weight: bold;
       border-bottom: 1px solid #eee;
       padding: 15px;
       span{
         font-weight: normal;
         float: right;
       }
       em{
         font-weight: normal;
         margin-top: 10px;
       }
     }
   }
   footer{
     z-index: 1;
     border-top: 1px solid #eee;
     display: flex;
     align-items: center;
     padding: 5px 15px;
     position: fixed;
     bottom: 0;
     left: 0;
     width: 100%;
     background-color: #fff;  
     &>div{
       display: flex;
       flex-direction: column;
       justify-content: center;
       font-size: 12px;
       width: 60px;
       align-items: center;
       img{
         width: 20px;
         height: 20px;
         margin-bottom: 3px;
       }
     }
     section{
      //  margin-left: 30px;
       background-color: rgb(41, 127, 240);
       color: #fff;
       font-size: 16px;
       border-radius: 5px;
       width: calc(100% - 30px);
       height: 50px;
       line-height: 50px;
       text-align: center;
     }
   }
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
</style>
