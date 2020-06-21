<template>
  <div>
    <p class="titleDesc">基本信息</p>
    <div class="form">
      <div class="form-item">
        <div class="form-item-title">
          分享标题
          <span class="require">*</span>
        </div>
        <input class="right" type="text" v-model="title" placeholder="建议不要超过15字" maxlength="15">
      </div>
      <div class="form-item">
        <div class="form-item-title">项目信息</div>
        <div class="right" @click="projectDetailHandle" style="text-align:right">></div>
      </div>
    </div>
    <p class="titleDesc">房源信息</p>
    <div class="houseInfo">
      <img :src=" houseInfo.pathImg ||  '/static/images/zanwutupian.png'" alt>
      <div class="contentBox">
        <div class="title">{{houseInfo.room}}</div>
        <div
          class="desc"
        >{{houseInfo.rent}}元/m²·天 {{houseInfo.built_up_area}} {{houseInfo.statusDesc}}</div>
      </div>
      <!-- <div class="arrow">></div> -->
    </div>
    <button type="primary" @click="bornHandle">生成</button>
  </div>
</template>

<script>
export default {
  components: {},

  data() {
    return {
      title: "",
      houseInfo: {
        path: "",
        statusDesc: "",
        built_up_area: "",
        rent: "",
        room: ""
      },
      openId:'',
    };
  },
  mounted() {},
  onShow(){
    this.title = ''
  },
  onLoad: function(options) {
    var self = this
    var target = JSON.parse(options.target);
    this.houseInfo = target;
    this.houseInfo.pathImg = this.houseInfo.path.split(',')[0]
    console.log(target);
    wx.getStorage({
      key: "openId",
        success(res) {
          self.openId = res.data
        }
    })
  },
  methods: {
    projectDetailHandle() {
      wx.navigateTo({ url: "/pages/projectDetail/main" });
    },

    bornHandle() {
      var self = this
      if (this.title.trim() == "") {
        wx.showToast({
          title: "请填写标题！",
          icon: "none",
          duration: 1000
        });
        return;
      }
      this.houseInfo.title = this.title;
      // 获取用户基本信息
      wx.getStorage({
        key: "userInfo",
        success(res) {
          console.log(res)
          if(res){
              self.$http.post({
                url: '/share/add',
                data: {
                  openid:self.openId,
                  title:self.title,
                  roomid:self.houseInfo.code,
                }
              }).then(res => {
                wx.navigateTo({
                  url: "/pages/sharePreview/main?role=self&target=" + JSON.stringify(self.houseInfo)+'&infoId='+res.id
                });
              })
              
          }else{
            wx.navigateTo({ url: "/pages/getAuth/main" });
          }
        },
        fail(res){
          console.log(res)
          wx.navigateTo({ url: "/pages/getAuth/main" });
        }
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.titleDesc {
  padding: 10px;
  background-color: #eee;
  color: gray;
  font-size: 12px;
}
button[type="primary"] {
  margin: 10px;
  background: rgb(41, 127, 240);
}
.form {
  padding: 0 10px;
  .form-item {
    padding: 10px 0;
    border-bottom: 1px solid #eee;
    display: flex;
    align-items: center;
    .form-item-title {
      font-weight: bold;
      font-size: 13px;
      width: 120px;
      .require {
        color: red;
      }
    }
    input[type="text"] {
      font-size: 13px;
    }
    .right {
      flex: 1;
    }
  }
}
.houseInfo {
  padding: 10px;
  display: flex;
  position: relative;
  border-bottom: 1px solid #eee;
  img {
    width: 50px;
    height: 50px;
    margin-right: 15px;
  }
  .contentBox {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    flex: 1;
    .title {
      font-weight: bold;
      font-size: 13px;
    }
    .desc {
      font-size: 12px;
      color: gray;
    }
  }
  .arrow {
    position: absolute;
    right: 10px;
    top: 50%;
    transform: translateY(-50%);
  }
}
</style>
