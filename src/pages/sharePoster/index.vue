<template>
  <!--index.wxml-->
  <view class="posterWrap">
    <canvas canvas-id="myQrcode" id="myQrcode"></canvas>
    <canvas canvas-id="posterCanvas" class="myCanvas"></canvas>
    <div class="fixed_container">
      <div class="fixed_inner">
        <div @click="handleShowImg">
          <!-- <img src="../../../static/images/haibao.png" alt /> -->
          <span>发送给朋友</span>
        </div>
        <div @click="handleSave">
          <!-- <img src="../../../static/images/weixin.png" alt /> -->
          <span>保存名片</span>
        </div>
      </div>
    </div>
  </view>
</template>
<script>
// import drawQrcode from 'weapp-qrcode'
import QRCode from '../../utils/QRcode.js'
export default {
  //index.js
  //获取应用实例
  data() {
    return {
      InfoSync: {},

    };
  },
  onLoad(options) {
    var self = this
    new QRCode('myQrcode',{
      text: 'https://pwmall.parkwing.cn',
      width: 60,
      height: 60,
      padding: 0, // 生成二维码四周自动留边宽度，不传入默认为0
      correctLevel: QRCode.CorrectLevel.L, // 二维码可辨识度
      callback: (res) => {
        console.log('res',res,res.path)
        self.draw(options,res.path)
        
      }
    })
    
  },
  methods: {
    draw(options,QRpath){
      console.log('onload >>',options)
      const InfoSync = wx.getSystemInfoSync();
      this.InfoSync = InfoSync;
      let bili = InfoSync.windowWidth / 375 * 1;
      console.log('bili',bili)
      const ctx = wx.createCanvasContext("posterCanvas");
      // this.saveThe(
      //   "https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1575527967726&di=172dcdd5a6f6b3a92a17d670793a6a50&imgtype=0&src=http%3A%2F%2Fb-ssl.duitang.com%2Fuploads%2Fitem%2F201303%2F10%2F20130310192450_S8HG8.thumb.700_0.jpeg",
      //   path => {
          // ctx.drawImage(path, 0, 0, 310 * bili, 455 * bili); //ctx.drawImage（图片路径，距离画布左边，距离画布右边，图片宽，图片高）
          // ctx.save(); // 保存当前绘画
          ctx.fillStyle = '#fff';
          ctx.fillRect(0,0,310*bili,455*bili);
          ctx.stroke();
          ctx.setFontSize(17); // 文字字号
          ctx.setTextAlign("left"); // 文字居中
          ctx.setFillStyle("#111"); // 文字颜色：fff
          ctx.fillText(options.build+'·'+options.room, 10*bili, 240*bili);
          ctx.fillText(options.build+'·'+options.room, 10*bili, 240*bili);

          ctx.setFontSize(14); // 文字字号
          ctx.setTextAlign("left"); // 文字居中
          ctx.setFillStyle("#111"); // 文字颜色：fff
          ctx.fillText(options.nickName+',推荐你看', 10*bili, 450*bili);
          ctx.fillText(options.nickName+',推荐你看', 10*bili, 450*bili);

          ctx.setFontSize(14); // 文字字号
          ctx.setTextAlign("left"); // 文字居中
          ctx.setFillStyle("#111"); // 文字颜色：fff
          ctx.fillText(options.address, 10*bili, 270*bili);

          ctx.setFontSize(16); // 文字字号
          ctx.setTextAlign("left"); // 文字居中
          ctx.setFillStyle("orange"); // 文字颜色：fff
          ctx.fillText(options.rent, 43*bili, 300*bili);
          ctx.setFontSize(14); // 文字字号
          ctx.setTextAlign("left"); // 文字居中
          ctx.setFillStyle("gray"); // 文字颜色：fff
          ctx.fillText('元/m²·天', 33*bili, 320*bili);

          ctx.moveTo(110*bili,290*bili);
          ctx.lineTo (110*bili,320*bili);       
          ctx.lineWidth = 1;          //设置线宽状态
          ctx.strokeStyle = '#eee' ;  //设置线的颜色状态
          ctx.stroke();               //进行绘制

          ctx.setFontSize(16); // 文字字号
          ctx.setTextAlign("left"); // 文字居中
          ctx.setFillStyle("orange"); // 文字颜色：fff
          ctx.fillText(options.built_up_area, 130*bili, 300*bili);
          ctx.setFontSize(14); // 文字字号
          ctx.setTextAlign("left"); // 文字居中
          ctx.setFillStyle("gray"); // 文字颜色：fff
          ctx.fillText('m²', 150*bili, 320*bili);

          ctx.moveTo(200*bili,290*bili);
          ctx.lineTo (200*bili,320*bili);       
          ctx.lineWidth = 1;          //设置线宽状态
          ctx.strokeStyle = '#eee' ;  //设置线的颜色状态
          ctx.stroke();               //进行绘制

          ctx.setFontSize(16); // 文字字号
          ctx.setTextAlign("left"); // 文字居中
          ctx.setFillStyle("orange"); // 文字颜色：fff
          ctx.fillText('简装', 225*bili, 300*bili);
          ctx.setFontSize(14); // 文字字号
          ctx.setTextAlign("left"); // 文字居中
          ctx.setFillStyle("gray"); // 文字颜色：fff
          ctx.fillText('装修', 225*bili, 320*bili);

          ctx.save();
          //圆形头像框
          // ctx.setStrokeStyle("rgba(0,0,0,0)");
          // ctx.arc(155 * bili, 94 * bili, 45 * bili, 0, 2 * Math.PI);
          // ctx.fill();
          //二维码
          // this.saveThe(
          //   "https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1575528227860&di=f644289e83c18cf73d44e76dec4c1246&imgtype=0&src=http%3A%2F%2Fn.sinaimg.cn%2Fsinacn%2Fw640h395%2F20180109%2F0ae9-fyqnici9075376.jpg",
          //   path => {
              ctx.drawImage(QRpath, 110*bili , 330*bili  , 90*bili  , 90*bili );
              ctx.save();
              //园区图
              this.saveThe(
                options.path.split(',')[0].replace(/http/,'https'),
                path => {
                  // ctx.clip();
                  ctx.drawImage(
                    path,
                    10*bili,
                    10*bili,
                    290*bili,
                    200*bili
                  );
                  ctx.save();
                  ctx.stroke();
                  ctx.draw();
                }
              );
          //   }
          // );
      //   }
      // );
    },
    // 小程序需要将图片下载下来，然后才能绘制到画布上
    saveThe(url, callback) {
      wx.getImageInfo({
        src: url, //服务器返回的图片地址
        success: res => {
          callback(res.path);
        },
        fail: function(res) {}
      });
    },
    // 点击保存时，将画布生成海报
    handleSave() {
      var that = this;
      wx.showLoading({
        title: "正在保存...",
        mask: true
      });
      wx.getSetting({
        success(res) {
          if (res.authSetting["scope.writePhotosAlbum"]) {
            that.saveImg();
          } else if (res.authSetting["scope.writePhotosAlbum"] === undefined) {
            wx.authorize({
              scope: "scope.writePhotosAlbum",
              success() {
                that.saveImg();
              },
              fail() {
                wx.hideLoading();
                wx.showToast({
                  title: "您没有授权，无法保存到相册",
                  icon: "none"
                });
              }
            });
          } else {
            wx.openSetting({
              success(res) {
                if (res.authSetting["scope.writePhotosAlbum"]) {
                  that.saveImg();
                } else {
                  wx.showToast({
                    title: "您没有授权，无法保存到相册",
                    icon: "none"
                  });
                }
              }
            });
          }
        },
        fail: err => {
          wx.hideLoading();
          wx.showToast({
            title: "出现了错误，请稍后再试",
            icon: "none"
          });
        }
      });
    },
    saveImg() {
      // 按照设备比例去计算图片和画布尺寸
      let bili = this.InfoSync.windowWidth / 375 * 1;
      wx.canvasToTempFilePath({
        x: 0,
        y: 0,
        width: 310 * bili,
        height: 455 * bili,
        destWidth: 310 * bili * this.InfoSync.pixelRatio,
        destHeight: 455 * bili * this.InfoSync.pixelRatio,
        fileType: "png",
        quality: 1,
        canvasId: "posterCanvas",
        success: function(res) {
          wx.hideLoading();
          var tempFilePath = res.tempFilePath;
          // 需要权限
          wx.saveImageToPhotosAlbum({
            filePath: tempFilePath,
            success(res) {
              wx.showModal({
                content: "图片已保存到相册，赶紧晒一下吧~",
                showCancel: false,
                confirmText: "好的",
                confirmColor: "#333"
              });
            },
            fail: function(res) {
              wx.hideLoading();
              wx.showToast({
                title: "没有相册权限",
                icon: "none",
                duration: 2000
              });
            }
          });
        },
        fail: err => {
          wx.hideLoading();
          wx.showToast({
            title: "出现了错误，请稍后再试",
            icon: "none"
          });
        }
      });
    },
    // 发送给朋友，以图片的方式，先生成临时图片地址，然后调用微信api显示转发
    handleShowImg() {
      let bili = this.InfoSync.windowWidth / 375 * 1;
      wx.canvasToTempFilePath({
        x: 0,
        y: 0,
        width: 310 * bili,
        height: 455 * bili,
        destWidth: 310 * bili * this.InfoSync.pixelRatio,
        destHeight: 455 * bili * this.InfoSync.pixelRatio,
        fileType: "png",
        quality: 1,
        canvasId: "posterCanvas",
        success: function(res) {
          wx.hideLoading();
          wx.previewImage({
            urls: [res.tempFilePath],
            current: res.tempFilePath
          });
        },
        fail: err => {
          wx.hideLoading();
          wx.showToast({
            title: "出现了错误，请稍后再试",
            icon: "none"
          });
        }
      });
    }
  }
};
</script>
<style scoped>
#myQrcode{
  width: 60px; 
  height: 60px;
  position:absolute;
  top: -1000px;
}
.posterWrap {
  min-height: 100%;
  padding: 40px 0;
  background-color: #f1f1f1;
}

.myCanvas {
  width: 310px;
  height: 455px;
  margin: 0 auto;
  background: #fff;
}

.fixed_container {
  position: fixed;
  bottom: 0;
  width: 100%;
  z-index: 1000;
}

.fixed_inner {
  display: flex;
  justify-content: space-between;
  border-top: 1rpx solid #e5e5e5;
  padding: 20rpx 32rpx;
  background: #ffffff;
  align-items: center;
}
.fixed_inner div {
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  border-radius: 5rpx;
  width: 330rpx;
  height: 76rpx;
  line-height: 76rpx;
  text-align: center;
  background: -webkit-linear-gradient(left, #27caac, #02ba8e);
  background: -o-linear-gradient(right, #27caac, #02ba8e);
  background: -moz-linear-gradient(right, #27caac, #02ba8e);
  background: linear-gradient(to right, #27caac, #02ba8e); /* 标准的语法 */
}
.fixed_inner div:last-child {
  background: -webkit-linear-gradient(left, #ff7179, #ff6459);
  background: -o-linear-gradient(right, #ff7179, #ff6459);
  background: -moz-linear-gradient(right, #ff7179, #ff6459);
  background: linear-gradient(to right, #ff7179, #ff6459);
}
.fixed_inner div img {
  width: 42rpx;
  height: 32rpx;
  margin-right: 11rpx;
}
</style>
