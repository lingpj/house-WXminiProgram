<template>
  <div class="container">
    <!-- <button open-type="getUserInfo" @getuserinfo="getuserinfo">授权登录</button> -->
    <div class="header">
      <div>
        <span>{{sumRoom}}</span>
        <p>房源数量(间)</p>
      </div>
      <div class="middle">
        <span>{{sumSS}}</span>
        <p>总面积(m²)</p>
      </div>
      <div>
        <span>{{avgRent}}</span>
        <p>预租均价(元/m²·天)</p>
      </div>
    </div>
    <div
      v-for="(item,index) in dataList"
      :key="index"
      @click="go2Detail(item,index)"
      class="houseItem"
    >
      <img :src="item.url || '/static/images/zanwutupian.png'" alt>
      <div class="item">
        <div class="name">
          <p>{{item.build}}</p>
          <p>预租均价:{{item.rent}}m²·天</p>
        </div>
        <div class="room">
          <p>房源数:{{item.num}}间</p>
          <p>房源总面积:{{item.built_up_area}}m²</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "",
  components: {},
  data() {
    return {
      dataList: [],
      sumRoom: 0,
      sumSS: 0,
      avgRent: 0
    };
  },

  async mounted() {
    // // 获取用户基本信息
    // wx.getSetting({
    //   success(res) {
    //     console.log(res);
    //     if (res.authSetting["scope.userInfo"]) {
    //       // 已经授权，可以直接调用 getUserInfo 获取头像昵称
    //       wx.getUserInfo({
    //         success: function(res) {
    //           console.log("用户信息》》", res);
    //           wx.setStorageSync("userInfo", JSON.stringify(res.userInfo));
    //         }
    //       });
    //     }
    //   }
    // });

    var self = this;

    wx.getStorage({
      key: "projectInfo",
      success(res) {
        console.log(res)
        var id = JSON.parse(res.data).itemid;
        self.$http
          .post({
            url: "/room/buildinfo",
            data: { itemid: id }
          })
          .then(res => {
            console.log(res);
            // 列表data
            self.dataList = res.buildList.map(item =>{
              item.rent = item.rent.toFixed(2)
              return item
            }) || [];

            self.sumRoom = res.parkinfoList[0].num;
            self.sumSS = res.parkinfoList[0].built_up_area;
            self.avgRent = res.parkinfoList[0].rent.toFixed(2);
          });
      }
    });
  },
  methods: {
    
    go2Detail(item, index) {
      console.log(item, index);
      var value = JSON.stringify(item);
      wx.navigateTo({ url: "/pages/rentChart/main?target=" + value });
    },
    getuserinfo(e) {
      var that = this;
      console.log(e);
      if (e.mp.detail.userInfo) {
        console.log("000");
        //用户按了允许授权按钮
        wx.showModal({
          content: "授权成功",
          showCancel: false,
          confirmText: "知道了",
          success: function(res) {}
        });
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.container {
  padding: 20rpx;
  .header {
    display: flex;
    align-items: center;
    padding: 30px 5px;
    box-shadow: 0 0 5px lightgray;
    border-radius: 3px;
    justify-content: space-between;
    margin-bottom: 10px;
    & > div {
      text-align: center;
      span {
        font-size: 18px;
        font-weight: bold;
      }
      p {
        margin-top: 10px;
        font-size: 12px;
        color: gray;
      }
    }
    & > div:nth-child(2) {
      padding: 0 15px;
      border-left: 1px solid #eee;
      border-right: 1px solid #eee;
    }
  }
  .houseItem {
    display: flex;
    align-items: center;
    img {
      width: 80px;
      height: 80px;
      padding: 10px 10px 10px 0;
    }
    .item {
      flex: 1;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      .name,
      .room {
        font-size: 12px;
        p:first-child {
          float: left;
        }
        p:last-child {
          float: right;
        }
      }
      .name {
        p:first-child {
          font-size: 18px;
          font-weight: bold;
        }
      }
      .room {
        color: gray;
        margin-top: 30px;
      }
    }
  }
}
</style>
