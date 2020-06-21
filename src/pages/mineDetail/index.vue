<template>
  <div class="container">
      <section>
        <div class="key">头像</div>
        <img :src="info.headurl" alt="">
      </section>
      <section>
        <div class="key">姓名</div>
        <div class="value">{{info.nick_name}}</div>
      </section>
      <section>
        <div class="key">手机号</div>
        <div class="value">{{info.mobile}}</div>
      </section>
       <div  class="logoutBtn" @click="logoutBtnHandle">退出登录</div>
  </div>
</template>

<script>

export default {
  components: {
    
  },

  data () {
    return {
       info:{}
    }
  },
  onLoad(options){
    var self = this
    var openId = options.openId
    self.$http.post({
      url: "/role_employee/details",
      data: { 
          openid:openId
        }
    })
    .then(res => {
      self.info = res.list[0]
      self.info.nick_name = self.$base64.decode(self.info.nick_name)
    })
  },
  methods:{
    logoutBtnHandle(){
      wx.removeStorage({
        key: 'login',
        success (res) {
          wx.showToast({
            title: "退出成功！",
            icon: "none",
            duration: 1000
          });
          // wx.navigateTo({ url: "/pages/home/main" });
          wx.navigateBack({
            delta: 1
          });
        }
      })
    },
  }
}
</script>

<style lang="scss" scoped>
 
.logoutBtn{
  border-top: 10px solid #eee;
  text-align: center;
  height: 40px;
  line-height: 40px;
  font-size: 14px;
  border-bottom: 10px solid #eee;
}
.container{
  section{
    padding: 15px;
    border-bottom: 1px solid #eee;
    display: flex;
    justify-content: space-between;
    align-items: center;
    .key{
      font-size: 14px;
      font-weight:600;
    }
    .value{
      font-size: 14px;
    }
    img{
      width: 50px;
      height: 50px;
      border-radius: 50%;
    }
  }
}
</style>
