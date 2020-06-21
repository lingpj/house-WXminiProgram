<template>
  <div class="container">
     <div v-for="(item,index) in projectList" :key="index" class="projectItem">
       <div class="title">{{item.item}}</div>
       <swiper style="height:200px" 
          :indicator-dots='true'
          indicator-color='#d8d8d8'
          indicator-active-color = '#ffad36'
          :autoplay='true'
          :interval='3000'
          :duration='1000'
          :circular='true' >
          <block v-for="(image, _index) in [item.imageList[0]]" :key="_index" >
            <swiper-item>
              <image style="width:100%" :src="image.url"  ></image>
            </swiper-item>
          </block>
        </swiper>
        <div class="VRbtn" v-if="item.url" @click="go2VR(item)">VR</div>
         <div class="NAVbtn" v-if="item.url" @click="go2NAV(item)">导航</div>
        
       <div class="desc">{{item.summary || ''}}</div>
       <div class="toDetail" @click="go2Detail(item)">点击进入</div>
     </div>
  </div>
</template>

<script>
export default {
  components: {},

  data() {
    return {
      projectList:[],
      totalCount:0
    };
  },

  onShow() {
      this.$http.get({
        url: "/park/info",
        data: {}
      })
      .then(res => {
        this.projectList = res.list
        this.totalCount = res.totalCount
      })
  },
  methods:{
    go2NAV(data){
      // 点击地图,进入路线导航
      var self = this
      this.$QQMapWX.geocoder({
          address:data.address,
          success(res){
              // let key ='QMHBZ-O4LLW-ZB4RY-RLAHW-YZOYK-CLFYY'; //使用在腾讯位置服务申请的key
              // let referer ='e通世界产业园招商平台';  //调用插件的小程序的名称
              // let endPoint = JSON.stringify({ //终点
              //   'name':data.address,
              //   'latitude': res.result.location.lat,
              //   'longitude': res.result.location.lng,
              // });
              // wx.navigateTo({
              //   url:'plugin://routePlan/route-plan?key=' + key +'&referer=' + referer +'&endPoint=' + endPoint
              // });
              wx.getLocation({
                type: 'gcj02', //返回可以用于wx.openLocation的经纬度
                success: function() {
                  
                  wx.openLocation({
                    latitude:  res.result.location.lat,
                    longitude: res.result.location.lng,
                    name:data.address,
                    scale: 28
                    })
                }
                })
          }
        })
      
    },
     go2VR(data){
      if(data.url){
        wx.navigateTo({ url: "/pages/VR/main?target="+data.url });
      }
      
    },
    go2Detail(data){
      // console.log(data)
      // console.log(JSON.stringify(data))
       wx.setStorageSync('projectListData',JSON.stringify(data))
      wx.navigateTo({ url: "/pages/projectDetail/main?data=projectListData" });
    }
  }
};
</script>

<style lang="scss" scoped>
.VRbtn{
    position: absolute;
    width: 70px;
    height: 30px;
    right: 5px;
    top: 47px;
    line-height: 30px;
    color: #fff;
    font-size: 14px;
    background: rgba(41, 127, 240, 0.8);
    text-align: center;
    border-radius: 5px;
  }
  .NAVbtn{
    position: absolute;
    width: 70px;
    height: 30px;
    right: 5px;
    top: 87px;
    line-height: 30px;
    color: #fff;
    font-size: 14px;
    background: rgba(41, 127, 240, 0.8);
    text-align: center;
    border-radius: 5px;
  }
.container{
  padding: 10px 10px;
  .projectItem{
    position: relative;
    margin-bottom: 20px;
    position: relative;
    padding-bottom: 50px;
        border-bottom: 1px solid #eee;
  }
  .title{
    border-left: 7px solid rgb(41, 127, 240);
    padding: 3px;
    padding-left: 10px;
    margin-bottom: 10px;
    border-bottom: 1px solid #eee;
  }
  .desc{
    margin-top: 10px;
    text-indent: 20px;
    font-size: 14px;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp:5;
    -webkit-box-orient: vertical;
    line-height: 25px;
    letter-spacing: 1px;
  }
  .toDetail{
      color: rgb(41, 127, 240);
      border: 1px solid  rgb(41, 127, 240);
      border-radius: 5px;
      text-align: center;
      height: 25px;
      line-height: 25px;
      padding: 0 7px;
      font-size: 14px;
      position: absolute;
      right:0;
      bottom:5px;
    }
}
</style>
