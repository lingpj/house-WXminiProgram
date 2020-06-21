<template>
  <div>
      <img class="banner" :src="projectInfo.imageList[0].url" alt="">
      <div class="innerBox">
        <div class="phoneBox">
        <div> 看房日期：</div>
        <picker style="flex:1" mode="date"  :value="appointment_date" :start="startDate" end="2099-01-01" @change="bindDateChange">
            <view class="picker">
              <span style="font-size:14px;" v-if="!appointment_date">请选择: </span>
              <span style="font-size:14px;">{{appointment_date}}</span>
            </view>
          </picker>
        </div>
        <div class="phoneBox">
          <div>预约房源：</div>
          <input type="number" disabled  :value="subscribeHouese" class="phoneText">
        </div>
        <div class="phoneBox">
          <div>客户姓名：</div>
          <input type="text" v-model="name" class="phoneText">
        </div>
        <div class="phoneBox">
        <div> 手机号：</div>
          <input type="number" v-model="phone" class="phoneText">
          <button size="mini" type="primary" open-type="getPhoneNumber" @getphonenumber="getPhoneNumber" >获取</button>
        </div>
        <div class="phoneBox">
          <div>验证码：</div>
          <input type="number" v-model="code" class="codeText">
          <button size="mini" type="primary" @click="sendCode">{{msg || '发送'}}</button>
          <br>
        </div>
        <div class="phoneBox">
          <div style="align-self: flex-start">备注：</div>
          <textarea  v-model="remark" class="phoneText"></textarea>
        </div>
        <div class="btnBox">
          <button type="primary" @click="loginHandle">确认提交</button>
        </div>
      </div>
  </div>
</template>

<script>
import {fmtDate} from '../../utils/index.js'
export default {
  components: {},

  data() {
    return {
      phone: "",
      code: "",
      timer: "",
      msg: "发送",
      name:'',
      appointment_date:fmtDate(new Date(),'yyyy-MM-dd'),
      remark:'',
      // 项目信息
      projectInfo:{},
      build:'',
      room:'',
      startDate: fmtDate(new Date(),'yyyy-MM-dd'),
      sessionKey:'',
    };
  },
  computed:{
    subscribeHouese(){
      return this.projectInfo.item + (this.build ? `|${this.build}|${this.room}|` : '' )
    }
  },
  onShow() {
    var self = this;
    this.phone = ''
    this.code = ''
    this.timer = ''
    this.msg = '发送'
    this.name = ''
    this.appointment_date = ''
    this.remark = ''
    this.startDate = fmtDate(new Date(),'yyyy-MM-dd')
    
  },
  onLoad(option){
    console.log('预约',option)
    var self = this
    var data = ''
    if(option.data1 || option.data2){ 
      // console.log(option.data1 +option.data2+'"}')
      if(option.data2.endsWith('}')){
        console.log('}"结尾')
        data = JSON.parse(option.data1 +option.data2)
      }else{
        console.log('没有结尾')
        data = JSON.parse(option.data1 +option.data2+'"}')
      }
      this.projectInfo = data
      this.build = option.build || ''
      this.room = option.room || ''
    }else{  
      
      wx.getStorage({
        key: 'subscribeData',
        success (res) {
          data = JSON.parse(res.data)
          self.projectInfo = data
          self.build = option.build || ''
          self.room = option.room || ''
        }
      })
      
    }
    
        
   
    
     wx.getStorage({
      key: 'sessionKey',
      success (res) {
        console.log('sessionKey',res.data)
        self.sessionKey = res.data
        console.log('sessionKey信息》',self.sessionKey)
      }
    })

  },
  methods: {
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
            // _phone = res.phoneNumber
            this.phone = res.phoneNumber
        })
      } 
    },
    bindDateChange(e){
      console.log(e)
      var self = this
      
        this.appointment_date = e.target.value
    },
    sendCode() {
      if (this.phone.replace(/\s/g, "").length != 11) {
        wx.showToast({
          title: "请填写正确的11位手机号！",
          icon: "none",
          duration: 1000
        });
        return;
      }
      if (this.timer) {
        return;
      }
      var self = this;
      self.$http
        .post({
          url: "/sms/code",
          data: {
            mobile: this.phone,
            type: "2"
          }
        })
        .then(res => {
          if (res.status == 200 || res.code == 200) {
            wx.showToast({
              title: "发送成功！",
              icon: "none",
              duration: 1000
            });
            self.msg = 59;
            self.timer = setInterval(function() {
              if (self.msg == 0) {
                self.msg = "发送";
                clearInterval(self.timer);
                self.timer = null;
              } else {
                self.msg--;
              }
            }, 1000);
          } else {
            wx.showToast({
              title: "发送失败！",
              icon: "none",
              duration: 1000
            });
          }
        });
    },
    loginHandle() {
      var self = this;
      if(!this.code.trim() || !this.phone.trim() || !this.name.trim()){
        wx.showToast({
          title: "请填写验证码、手机号、昵称！",
          icon: "none",
          duration: 1000
        });
        return 
      }
      if(!this.appointment_date){
        wx.showToast({
          title: "请选择日期！",
          icon: "none",
          duration: 1000
        });
        return 
      }
      if(this.appointment_date < fmtDate(new Date(),'yyyy-MM-dd')){
        wx.showToast({
              title: "预约日期不能小于当前日期！",
              icon: "none",
              duration: 1000
            });
            return
      }
      self.$http
        .post({
          url: "/house/appointment",
          data: {
            code: this.code,
            mobile: this.phone,
            remark:this.remark,
            appointment_date:this.appointment_date,
            name:this.name,
            room:this.projectInfo.item + (this.build ? `|${this.build}|${this.room}|` : '' )
          }
        })
        .then(res => {
          if(res.code == 200){
            wx.showToast({
              title: "提交成功！",
              icon: "none",
              duration: 1000
            });
            setTimeout(() => {
              wx.navigateBack({
                  delta: 1
                });
            }, 1000);
          }else{
            wx.showToast({
              title: res.msg,
              icon: "none",
              duration: 1000
            });
          }
        });
    }
  }
};
</script>

<style lang="scss" scoped>
textarea{
  height: 100px;
}
.innerBox{
  width: 90%;
  margin-left:5%;
  margin-top: -70px;
  border:1px solid #eee;
  box-shadow: 0 0 5px #eee;
  border-radius: 10px;
  padding: 20px 10px;
  box-sizing: border-box;
  position: relative;
  background-color: #fff;
  z-index: 10;
}
.phoneBox {
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  margin-bottom: 20px;
  &>div:nth-child(1){
    width: 80px;
    font-size: 14px;
    text-align: right;
  }
  textarea{
     flex:1;
    font-size: 13px;
    color: gray;
  }
  input{
    flex:1;
    font-size: 13px;
    color: gray;
    height: 30px;
  }
  button {
    line-height: 32px;
    height: 32px;
    position: absolute;
    right: 0px;
    bottom:0;
    z-index: 2;
    background-color: #fff;
    color: #111;
  }
}
.logoutBtn {
  margin-left: 50%;
  transform: translateX(-50%);
}
.phoneText,
.codeText {
  border: 1px solid #eee;
  border-radius: 5px;
  width: 120px;
}
.banner{
  width:100%;
}
.bgImg {
  width: 100%;
}
.loginForm {
  padding: 20px;
  .phoneBox {
    padding-bottom: 20px;
    margin: 20px 0;
    border-bottom: 1px solid #eee;
  }
  input {
    height: 30px;
  }
  & > div {
  }
  .btnBox {
    text-align: center;
    button {
      // width: 150px;
      margin-bottom: 20px;
    }
  }
}
.infoBox {
  background-color: #fff;
  width: calc(100% - 50px);
  margin: 0 10px;
  margin-top: -30px;
  border: 1px solid #eee;
  box-shadow: 0 0 10px #eee;
  padding: 15px;
  display: flex;
  align-items: center;
  border-radius: 5px;
  position: relative;
  .arrow {
    width: 15px;
    height: 15px;
    position: absolute;
    right: 10px;
    top: 50%;
    transform: translateY(-50%);
  }
  .headImg {
    width: 80px;
    height: 80px;
    border-radius: 50%;
  }
  .info {
    flex: 1;
    height: 80px;
    margin-left: 15px;
    p {
      font-size: 18px;
      font-weight: bold;
    }
  }
}
</style>
