<template>
  <div>
     <!-- 被分享者第一次进，必须授权 -->
    <div class="shareModal" v-if="sharedModalVisible" >
      <div>
        <div class="title">
          是否确定授权登录
        </div>
        <div class="btns">
          <button open-type="getUserInfo" @getuserinfo="getuserinfo">确定</button>
          <button @click="back">取消</button>
        </div>
      </div>
    </div>
    <img src="/static/images/bg.jpg" alt class="bgImg">
    <div v-if="loginVisible" class="loginForm">
      <div class="phoneBox">
        手机号：
        <input type="number" v-model="phone" class="phoneText">
      </div>
      <div class="phoneBox">
        验证码：
        <input type="number" v-model="code" class="codeText">
        <button size="mini" type="primary" @click="sendCode">{{msg}}</button>
        <br>
      </div>
      <div class="btnBox">
        <button type="primary" @click="loginHandle">登录</button>
      </div>
    </div>
    <div v-else @click="go2Detail">
      <div class="infoBox">
        <img :src="userInfo.avatarUrl" class="headImg">
        <div class="info">
          <p>{{userInfo.nickName}}</p>
        </div>
        <img src="/static/images/right.png" class="arrow">
      </div>
    </div>
  </div>
</template>

<script>
export default {
  components: {},

  data() {
    return {
      phone: "",
      code: "",
      userInfo: "",
      openId: "",
      login: "",
      loginVisible: false,
      timer: "",
      msg: "发送",
      sharedModalVisible:false
    };
  },

  onShow() {
    var self = this;
    wx.getStorage({
      key: "userInfo",
      success(res) {
        console.log(res);

        if (res) {
          self.userInfo = JSON.parse(res.data);
        } else {
          self.sharedModalVisible = true
          // wx.navigateTo({ url: "/pages/getAuth/main" });
        }
      },
      fail(res) {
        self.sharedModalVisible = true
        // wx.navigateTo({ url: "/pages/getAuth/main" });
      }
    });
    wx.getStorage({
      key: "openId",
      success(res) {
        self.openId = res.data;
      }
    });
    wx.getStorage({
      key: "login",
      success(res) {
        self.loginVisible = false;
      },
      fail() {
        self.loginVisible = true;
      }
    });
  },
  methods: {
    getuserinfo(e) {
      var self = this;
      if (e.mp.detail.userInfo) {
        wx.getUserInfo({
          success: function(res2) {
            console.log("用户信息》》", res2);
            self.userInfo = res2.userInfo
            wx.setStorageSync("userInfo", JSON.stringify(res2.userInfo));
            self.sharedModalVisible = false
          }
        });
      } 
    },
    back(){
       wx.navigateTo({ url: "/pages/projectList/main" });
    },
    go2Detail() {
      wx.navigateTo({ url: "/pages/mineDetail/main?openId=" + this.openId });
    },
    logoutBtnHandle() {
      wx.removeStorage({
        key: "login",
        success(res) {
          wx.showToast({
            title: "退出成功！",
            icon: "none",
            duration: 1000
          });
        }
      });
      this.loginVisible = true;
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
      if(!this.code.trim() || !this.phone.trim()){
        return 
      }
      self.$http
        .post({
          url: "/role_employee/modify",
          data: {
            code: this.code,
            openid: this.openId,
            nick_name: this.$base64.encode(this.userInfo.nickName),
            mobile: this.phone,
            headurl: this.userInfo.avatarUrl
          }
        })
        .then(res => {
          if (res.status == 200 || res.code == 200) {
            wx.showToast({
              title: "登录成功！",
              icon: "none",
              duration: 1000
            });
            wx.setStorageSync("login", true);
            self.loginVisible = false;
          } else {
            wx.showToast({
              title: "登录失败！",
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
.phoneBox {
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  input {
    flex:1;
    font-size: 13px;
    color: gray;
  }
  button {
    position: absolute;
    right: 0px;
    bottom: 21px;
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
.shareModal{
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0,0,0,.8);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 9;
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
