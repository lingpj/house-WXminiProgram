<template>
  <div class="container">
    <h1>{{projectInfo.item}} 
      <!-- <span>更新于{{projectInfo.createtime}}</span> -->
       </h1>
    <swiper id="swiper" style="height:200px" v-if="imgUrls.length > 0" 
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
    
    <div class="locationBox">
        <div class="innerBox">
          <div @tap="bindcontroltap">
            <img src="/static/images/icon_location.png" alt="">
            <div>{{projectInfo.address}}</div>
          </div>
          <div>
            <img src="/static/images/ditie.png" alt="">
            <div>{{projectInfo.traffic_summary}}</div>
          </div>
        </div>
        <map id="map" @tap="bindcontroltap"  :markers="bigMap.markers"  :latitude="bigMap.lat" :longitude="bigMap.lng" ></map>
    </div>
    <div class="division"></div>
    <section class="baseInfo">
      <h2>基本信息</h2>
      <div>
        <div class="item">
          <span>建筑面积</span>
          <p>{{projectInfo.build_area || 0}}m²</p>
        </div>
        <div class="item">
          <span>交付运营时间</span>
          <p>{{projectInfo.delivery_time || ''}}</p>
        </div>
      </div>
      <div>
        <div class="item">
          <span>物业公司</span>
          <p>{{projectInfo.property || ''}}</p>
        </div>
        <div class="item">
          <span>物业费</span>
          <p>{{projectInfo.property_fee || ''}}元/m²·月</p>
        </div>
      </div>
      <div>
        <div class="item">
          <span>停车位数量</span>
          <p>{{projectInfo.park_count || 0}}</p>
        </div>
      </div>
      <footer class="item">
        <p style="color:gray;font-size:13px">项目简介</p>
        <p style="color:#111;font-size:13px;margin-top:5px;" v-html="projectInfo.remarker || ''"></p>
      </footer>
    </section>
    <div class="division"></div>
    <section class="service">
      <h2>项目配套</h2>
      <div>
        <div class="serviceItem" v-for="(item,index) in projectInfo.serviceList" :key="index">
          <img :src="item.img_url" alt="" class="">
          <p>{{item.name}}</p>
        </div>
      </div>
    </section>
    <div class="division"></div>
    <section class="enterpriseService">
      <h2>企业服务</h2>
      <div>
        <div class="serviceItem" v-for="(item,index) in projectInfo.enterpriseServiceList" :key="index">
          <img :src="item.img_url || '/static/images/zanwutupian.png'" :ref="'enterpriseImg'+index" @error="errorHandle($event,'enterpriseImg'+index)" alt="" class="">
          <p>{{item.name}}</p>
        </div>
      </div>
    </section>
    <div class="division"></div>
    <section class="emptyHouseList">
      <h2>房源列表</h2>
      <div>
         <ul >
           <li @click="emptyBuildHandle(item,index)" :class="{ buildActive: buildActive == index }" v-for="(item,index) in emptyHouseList" :key="index">{{item.build}}</li>
         </ul>
         <nav  >
           <div @click="areaHandle(item,index)" :class="{ buildActive: areaActive == index }" v-for="(item,index) in areaList" :key="index">{{item}}</div>
         </nav>
         <div class="box" v-for="(item,index) in (emptyHouseList[buildActive] ? emptyHouseList[buildActive].roomlist : [])" :key="index">
            <div class="floor">{{item.floor}}</div>
            <div class="blockArea" @click="blockAreaHandle(room)" v-for="(room,index2) in item.list" :key="index2">
              <div class="area">{{room.room}} | {{room.built_up_area}}m²</div>
            </div>
         </div>
      </div>
    </section>
    <div class="division"></div>
    <section class="address">
      <h2>10分钟步行圈</h2>
      <div class="location">
        <div><img src="/static/images/icon_location.png" alt="">位置：{{projectInfo.address}}</div>
        <map id="bigMap" :markers="bigMap.markers"  :latitude="bigMap.lat" :longitude="bigMap.lng" ></map>
        <div class="poiBox">
          <div @click="clickHandle(item)" :class="{ active:activePOI == index }" v-for="(item,index) in ['交通','银行','餐饮','酒店','健身']" :key="index">{{item}}</div>
        </div>
      </div>
    </section>
    <div class="footer">
      <button class="shareBtn" open-type="share" >分享给好友</button>
      <button class="chatBtn" @click="go2subscribe">预约看房</button>
    </div>
  </div>
</template>

<script>
import {fmtDate} from '../../utils/index.js'
export default {
  components: {},

  data() {
    return {
      imgUrls:['/static/images/zanwutupian.png'],
      projectInfo:{},
      bigMap:{
        markers:[],
        lat:'',
        lng:''
      },
      activePOI:-1,
      // 空置房源
      emptyHouseList:[],
      buildActive:0,
      areaActive:0,
      areaList:['200以下','200-400','400-600','600-1000','1000以上','全部'],
      currentArea:'200以下'
    };
  },
  mounted() {
  },
  onLoad(options){
    console.log('进来了',options)
    // console.log(JSON.parse(options.data))
    var self =this
    // 被分享进来
    new Promise((resolve,reject)=>{
     
      if(Object.keys(options).length >0 || options.data == 'projectListData' ){
         console.log('1')
        if( options.data == 'projectListData' || options.projectId){
          console.log('4')

          
          if(options.projectId){
            self.$http.get({
            url: "/park/info",
            data: { 
                  id:options.projectId,
                  page:1,
                  limit:10,
                }
            })
            .then(res => {
              console.log('res:',res)
                self.projectInfo = res.list[0]
                self.imgUrls = self.projectInfo.imageList.map(item =>item.url)
                resolve()
            })
            return
          }
          wx.getStorage({
            key: 'projectListData',
              success (res) {
              console.log('>>>>>',res.data)
              self.projectInfo = JSON.parse(res.data)
              self.imgUrls = self.projectInfo.imageList.map(item =>item.url)
              resolve()
            },
            fail(err){
              console.log('报错了，',err)
              
            }
          })
        }else{
          console.log('5')
           try {
              
              self.projectInfo = JSON.parse(options.data)
           } catch (error) {
             console.log('jsonParse报错')
             console.log(options.data+'"}')
              self.projectInfo = JSON.parse(options.data+'"}')
           }
           self.imgUrls = self.projectInfo.imageList.map(item =>item.url)
           resolve()
        }
      }else{

        console.log('2')
        
        wx.getStorage({
          key: 'projectInfo',
          success (res) {
            self.projectInfo = JSON.parse(res.data)
            // self.projectInfo.createtime = fmtDate(self.projectInfo.createtime,'yyyy-MM-dd')
            self.imgUrls = self.projectInfo.imageList.map(item =>item.url)
            console.log(self.projectInfo)
            resolve()
          }
        })
      }
    }).then(res=>{
      console.log('3')
      self.getEmptyHouseList()
      self.$QQMapWX.geocoder({
        address:self.projectInfo.address,
        success(res){
          console.log(res)
          self.bigMap = {
            markers:[{
              iconPath: "/static/images/location.png",
              id: 0,
              latitude: res.result.location.lat,
              longitude: res.result.location.lng,
              width: 50,
              height: 50,
              title:self.projectInfo.address
            }],
            lat:res.result.location.lat,
            lng:res.result.location.lng,
          }
        }
      })
      
      
    })
    
    
  },
  onShow() {
    
  },
  methods:{
    // 点击地图,进入路线导航
    bindcontroltap(){
      // let key ='QMHBZ-O4LLW-ZB4RY-RLAHW-YZOYK-CLFYY'; //使用在腾讯位置服务申请的key
      // let referer ='e通世界产业园招商平台';  //调用插件的小程序的名称
      // let endPoint = JSON.stringify({ //终点
      //   'name':this.projectInfo.address,
      //   'latitude': this.bigMap.lat,
      //   'longitude': this.bigMap.lng
      // });
      // wx.navigateTo({
      //   url:'plugin://routePlan/route-plan?key=' + key +'&referer=' + referer +'&endPoint=' + endPoint
      // });
      var self = this
      wx.getLocation({
        type: 'gcj02', //返回可以用于wx.openLocation的经纬度
        success: function(res) {
        
          wx.openLocation({
            latitude: self.bigMap.lat,
            longitude:self.bigMap.lng,
            name:self.projectInfo.address,
            scale: 28
            })
        }
        })
    },
    // 获取空置房源
    getEmptyHouseList(){
      var self = this
      var arr = this.currentArea.split('-')
      var min = 0,max=100000000;
      if(arr.length == 1){
        min = parseInt(arr) == 200 ? 0 : 1000
        max = parseInt(arr) == 200 ? 200 : 10000000
      }else{
        min = arr[0]
        max = arr[1]
      }
      if(this.currentArea == '全部'){
        min = 0
        max = 10000000000
      }
      self.$http.post({
        url: "/build/unoccupyRoomInfo",
        data: { 
          itemid:self.projectInfo.itemid,
          minarea:min,
          maxarea:max,
          }
      })
      .then(res => {
        self.emptyHouseList = res.data.map(item =>{
          var list= []
          item.roomlist.forEach(room =>{
            var exist = list.find(o => o.floor == room.floor)
            if(!exist){
              list = list.concat([{
                floor:room.floor,
                list:[room]
              }])
            }else{
              exist.list.push(room)
            }
          })
          item.roomlist = list
          return item
        }) || []
        console.log(self.emptyHouseList)
      })
    },
    // 空置房源详情
    blockAreaHandle(room){
      var value = JSON.stringify(room)
      wx.navigateTo({url:'/pages/houseDetail/main?&from=ProjectDetail&target='+value})
    },
    // 
    areaHandle(data,index){
      this.areaActive = index
      this.currentArea = data
      this.getEmptyHouseList()
    },
    emptyBuildHandle(data,index){
      console.log(data,index)
      this.buildActive = index
    },
    
    // 项目poi
    clickHandle(data){
      console.log(data) 
      this.activePOI = ['交通','银行','餐饮','酒店','健身'].indexOf(data)
      var self = this
      this.$QQMapWX.search({
          keyword: data,
          location:{
            latitude:this.bigMap.lat,
            longitude:this.bigMap.lng,
          },
          success: function(res) {
              console.log(res);
              self.bigMap.markers.length = 1
              var temp = res.data.map((element,index) => {
                return {
                  iconPath: "/static/images/location.png",
                  id: index+1,
                  latitude: element.location.lat,
                  longitude: element.location.lng,
                  width: 25,
                  height: 25,
                  title:element.title
                }
              });
               self.bigMap.markers = self.bigMap.markers.concat(temp)
              console.log('> poi',self.bigMap)
          },
      });
    },
    errorHandle(e,ref){
      console.log(e,ref)
      this.$ref[ref].src = '/static/images/zanwutupian.png'
    },
    // 预约看房
    go2subscribe(){
      console.log('----',this.projectInfo)
      var string = JSON.stringify(this.projectInfo)
      wx.navigateTo({url:'/pages/subscribe/main?data1='+string.slice(0,string.length / 2)+'&data2='+string.slice(string.length / 2)})
    }
  },
  onShareAppMessage: function (res) {
    console.log(res)
    if (res.from === 'button') {
      // 来自页面内转发按钮
      // console.log(res.target)
    }
    return {
      title: 123,
      path: '/pages/projectDetail/main?projectId='+this.projectInfo.itemid,
    }
  }
};
</script>

<style lang="scss" scoped>
.container{
  padding: 15px;
  padding-bottom: 50px;
  .emptyHouseList{
    nav{
      display: flex;
      flex-wrap: wrap;
      div{
        box-sizing: border-box;
        padding: 3px 5px;
        margin: 5px;
        border-radius: 4px;
        border: 1px solid #eee;
        font-size: 13px;
      }
    }
    .buildActive{
      background-color: rgb(41, 127, 240);
        color: #fff;
    }
    .box{
      position: relative;
      width: 100%;
      height: 70px;
      display: flex;
      flex-wrap: nowrap;
      overflow-x:scroll;
      align-items: center;
      padding-left: 30px;
      background-color: #eee;
      margin-bottom: 10px;
      .floor{
        position: absolute;
        bottom:0;
        left:0;
        width: 30px;
        height: 70px;
        line-height: 70px;
        background-color: #eee;
        font-size: 14px;
        text-align: center;
        color: gray;
      }
      .blockArea{
        background-color: rgb(41, 127, 240);
        color: #fff;
        margin-right: 15px;
        font-size: 13px;
        padding: 5px;
        min-width: 130px;
        border-radius: 4px;
      }
    }
    ul{
      display: flex;
      flex-wrap: wrap;
      li{
        box-sizing: border-box;
        padding: 3px 5px;
        margin: 5px;
        border-radius: 4px;
        border: 1px solid #eee;
        font-size: 13px;
      }
    }
  }
  .baseInfo{
    &>div{
      display: flex;
      margin:15px 0;
      .item{
        flex: 1;
        span{
          color: gray;
          font-size: 13px;
        }
        p{
          margin-top: 5px;
          font-size: 13px;
          color: #111;
        }
      }
    }
  }
  .service,.enterpriseService{
    &>div{
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .serviceItem{
      width: calc((100% - 30px) / 5);
      box-sizing: border-box;
      text-align: center;
      img{
        width: 30px;
        height: 30px;
      }
      p{
        font-size: 13px;
        color: gray;
        text-align: center;
      }
    }
  }
  
  .division{
    background-color: #eee;
    height: 10px;
    width: calc(100% + 30px);
    transform: translate(-15px,0);
  }
  h1{
    font-size: 24px;
    margin-bottom:20px;
    font-weight: bold;
    span{
      color: lightgray;
      font-size: 13px;
      float: right;
    }
  }
  #swiper{
    border-radius: 8px; 
    margin-bottom: 20px;
  }
  .locationBox{
    display: flex;
    align-items: center;
    padding-bottom: 10px;
    .innerBox{
      flex:1;
      display: flex;
      justify-content: space-between;
      flex-direction: column;
      font-size: 12px;
      color: gray;
      height: 70px;
      img{
        width: 20px;
        height: 20px;
      }
      &>div{
        display: flex;
        align-items: center;
      }
    }
    #map{
      width: 70px; 
      height: 70px;
      border-radius: 10px;
    }
  }
  section{
    padding: 15px 0;
    h2{
      border-left: 3px solid rgb(41, 127, 240);
      padding-left: 10px;
      font-size: 16px;
      font-weight: bold;
      margin-bottom: 15px;
    }
  }
  .address{
    .location{
      img{
        width: 20px;
        height: 20px;
        display: inline-block;
      }
    }
    .poiBox{
      display: flex;
      align-items: center;
      justify-content: center;
      &>div{
        flex: 1;
        box-sizing: border-box;
        padding: 8px 10px;
        margin: 10px;
        border-radius: 8px;
        border: 1px solid #eee;
        font-size: 13px;
      }
      .active{
        background-color: rgb(41, 127, 240);
        color: #fff;
      }
    }
    
    #bigMap{
      width: 100%;
      height: 150px;
      padding: 15px 0;
      border-bottom: 1px solid #eee;
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
}
</style>
