<template>
  <div>
    <button open-type="getUserInfo" @getuserinfo="getuserinfo">授权登录</button>
  </div>
</template>

<script>
export default {
  components: {},

  data() {
    return {};
  },

  methods: {
    getuserinfo(e) {
      var that = this;
      if (e.mp.detail.userInfo) {
        //用户按了允许授权按钮
        wx.showModal({
          content: "授权成功",
          showCancel: false,
          confirmText: "知道了",
          success: function(res) {
            wx.getUserInfo({
              success: function(res2) {
                console.log("用户信息》》", res2);
                wx.setStorageSync("userInfo", JSON.stringify(res2.userInfo));
                wx.navigateBack({
                  delta: 1
                });
              }
            });
          }
        });
      }
    },
  }
};
</script>

<style>
</style>
