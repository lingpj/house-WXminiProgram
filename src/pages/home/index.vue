<template>
  <div class="container"  >
    <div class="projectTitle"   @click="changeProject">{{projectInfo.item || '暂无'}}
      <img src="/static/images/arrow-2.png">
    </div>
    <div class="btnGroup">
      <div  @click="go2RentHandle">
        <img src="/static/images/app.png" alt="">
        <p>租控管理</p>
      </div>
      <div @click="go2ShareHandle">
        <img src="/static/images/zhuanfa.png" alt="">
        <p>推广分享</p>
      </div>
      <div @click="go2ProjectHandle">
        <img src="/static/images/parklist.png" alt="">
        <p>预约看房</p>
      </div>
      <div @click="go2CustomeHandle">
        <img src="/static/images/green.png" alt="">
        <p>客户管理</p>
      </div>
    </div>
    <div class="myShare">
      <h2>我的分享
        <span @click="go2ShareTop">分享排行榜></span>
      </h2>
      <div class="shareItem">
        <div>
          <p>{{myShareInfo.tenDays || 0}}</p>
          <span>近10天浏览人数</span>
        </div>
        <div>
          <p>{{myShareInfo.thirtyDays|| 0}}</p>
          <span>近30天浏览人数</span>
        </div>
        <div>
          <p>{{myShareInfo.yeardays|| 0}}</p>
          <span>近一年浏览人数</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>

var qqmapsdk;
export default {
  name: "",
  components: {},
  data() {
    return {
      topPadding:0,
      // 当前项目信息
      projectInfo:{
        item:'暂无'
      },
      // 项目列表
      projectList:[],
      openId:'',
      // 我的分享信息概况
      myShareInfo:{},
      loginFlag:false
    };
  },
  onShow(){
     
    var self = this
    console.log('查看Login')
     wx.getStorage({
        key: "login",
        success(res) {
          console.log('login >>',res);
          if(res.data){
            self.loginFlag =true
          }else{
            self.loginFlag =false
            // wx.switchTab({ url: "/pages/mine/main" });
          }
        },
        fail(res) {
          console.log('login fail >>>',res)
          self.loginFlag =false
          //  wx.switchTab({ url:  "/pages/mine/main" });
        },
    });
    
      wx.getSystemInfo({
          success: function (res) {
              console.log('res',res)
              console.log(res.statusBarHeight, 'statusBarHeight')
              self.topPadding = res.safeArea.top +44
          }
      })
  },
  async mounted() {
    
    var self =this
    // 拉取项目列表数据
    var r = await this.$http.get({
      url: "/park/info"
    });
    this.projectList = r.list;
    // 登录获取openid
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
              wx.setStorageSync("sessionKey", res.sessionKey);
              wx.setStorageSync("openId", res.openid);
              self.openId = res.openid
              self.getRecentShare()
            });
        } else {
          console.log("登录失败！" + res.errMsg);
        }
      }
    });
    wx.getStorage({
        key: "projectInfo",
        success(res) {
          console.log(res);
          self.projectInfo = JSON.parse(res.data)
        },
        fail(res) {
          self.projectInfo.item = '暂无'
        },
        complete(){
          self.getRecentShare()
        }
    });
  },
  methods: {
    // 客户管理
    go2CustomeHandle(){
      console.log(!this.loginFlag)
      if(!this.loginFlag){
        wx.showToast({title: '请先登录！',icon: "none",duration: 1000}) 
        wx.switchTab({
          url: '/pages/mine/main' 
        })
        return
      }
      wx.setStorageSync("customeUrl",('https://pwmall.parkwing.cn/01/#/home?token='+this.openId));
      wx.navigateTo({ url: "/pages/VR/main?target=1" });
    },
    // 分享排行榜
    go2ShareTop(){
      if(!this.projectInfo.itemid){
        wx.showToast({
          title: '请先选择项目！',
          icon: "none",
          duration: 1000
        })
        return
      }
      
      var params = JSON.stringify(this.myShareInfo.list)
      params = encodeURIComponent(params)
      console.log(params)
      wx.navigateTo({ url: "/pages/shareTop/main?data="+params });
    },
    // 推广分享
    go2ShareHandle(){
      if(!this.loginFlag){
        wx.showToast({title: '请先登录！',icon: "none",duration: 1000}) 
        wx.switchTab({
          url: '/pages/mine/main' 
        })
        return
      }
      if(!this.projectInfo.itemid){
        wx.showToast({title: '请先选择项目！',icon: "none",duration: 1000})
        return
      }
      wx.navigateTo({ url: "/pages/shareRecord/main?openId="+this.openId+'&itemId='+this.projectInfo.itemid});
    },
    // 我的分享
    getRecentShare(){
      var self = this
      if(!self.projectInfo.itemid || !self.openId){
        return
      }
      self.$http
        .post({
          url: "/share_record/total",
          data: { 
            itemid: self.projectInfo.itemid,
            openid: self.openId
          }
        })
        .then(res => {
          console.log(res);
           self.myShareInfo = res
        });
    },
    // 租控管理
    go2RentHandle() {
      if(!this.loginFlag){
        wx.showToast({title: '请先登录！',icon: "none",duration: 1000})
        wx.switchTab({
          url: '/pages/mine/main' 
        })
      }else if(!this.projectInfo.itemid){
        wx.showToast({title: '请先选择项目！',icon: "none",duration: 1000})
      }else if(this.projectInfo.item.length>2){
        var self = this;
        wx.setStorageSync("projectInfo",JSON.stringify(self.projectList.find(item => item.itemid == self.projectInfo.itemid)));
        wx.navigateTo({ url: "/pages/houseList/main" });
      }else{
        wx.showToast({
          title: '请先选择项目',
          icon: "none",
          duration: 1000
        })
      }
    },
    // 选项目
    changeProject(){
      var self = this
      wx.showActionSheet({
        itemList: self.projectList.map(item => item.item),
        success(res) {
          console.log(res.tapIndex);
          // 存储项目
          self.projectInfo = self.projectList[res.tapIndex]
          wx.setStorageSync("projectInfo",JSON.stringify(self.projectList[res.tapIndex]));
          self.getRecentShare()
        }
      });
    },
    go2ProjectHandle(){
      // wx.navigateTo({ url: "/pages/subscribe/main" });
      wx.navigateTo({ url: "/pages/projectList/main" });
    },
  }
};
</script>

<style lang="scss" scoped>
.container {
  padding: 0 15px 0 15px;
  position: relative;
  .projectTitle{
    // position: absolute;
    margin: 5px 0 10px 0;
    left: 15px;
    font-weight: bold;
    font-size: 14px;
    img{
      width: 10px;
      height: 10px;
    }
  }
  .btnGroup{
    display: flex;
    &>div{
      width: 25%;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      img{
        width: 40px;
        height: 40px;
      }
      p{
        font-size: 14px;
        margin-top: 10px;
      }
    }
  }
  .myShare{
    margin: 20px 0;
     border: 1px solid #eee;
      border-radius: 5px;
      box-shadow: 0 0 10px #eee;
      padding: 15px 10px;
    h2{
      font-size: 18px;
      font-weight: bold;
      margin-bottom: 15px;
      span{
        font-size: 12px;
        color: gray;
        float: right;
        font-weight: normal;
      }
    }
    .shareItem{
      display: flex;
      &>div{
        display: flex;
        flex: 1;
        flex-direction: column;
        align-items: center;
        justify-content: space-between;
         p{
            font-size: 16px;
            font-weight: bold;
            text-align: center;
            
          }
          span{
              font-size: 12px ;
              margin-top: 10px;
              color:gray;
            }
      }
      &>div:nth-child(2){
        border-left: 1px solid #eee;
        border-right: 1px solid #eee;
      }
    }
  }
}
</style>
