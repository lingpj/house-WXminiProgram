<template>
  <div class="container">
    <div>共{{list.length}}条数据</div>
      <div class="topItem" v-for="(item,index) in list" :key="index" @click="go2Detail(item)">
        <img class="projectImg" :src="item.path2 || '/static/images/zanwutupian.png'" alt="">
        <div>
          <div class="title">{{item.title}}</div>
          <div class="address"><img src="/static/images/location.png">{{item.park}}{{item.build}}{{item.room}} · {{item.built_up_area}}m²</div>
          <div class="look">{{item.num || 0}}次浏览</div>
          <div class="time">{{item.createtime}}</div>
          <div class="rent"><span>{{item.rent}}</span>元/m²·天</div>
        </div>
      </div>
  </div>
</template>

<script>
import {fmtDate} from '../../utils/index.js'
export default {
  components: {
    
  },

  data () {
    return {
      list:[],
    }
  },
  mounted(){

  },
  onLoad: function(options) {
    console.log(options)
    var self = this
    self.$http
      .post({
        url: "/share/total",
        data: { 
          itemid: options.itemId,
          openid: options.openId,
          pageNum:1,
          limit:100000
        }
      })
      .then(res => {
        self.list = res.list.map(item=>{
          item.createtime = fmtDate(new Date(item.createtime),'yyyy-MM-dd hh:mm:ss')
          item.path2 = item.path.split(',')[0]
          return item
        })

        console.log(res);
      });
  },
  created () {
     
  },
  methods:{
    go2Detail(data){
      wx.navigateTo({ url: "/pages/shareRecordDetail/main?code="+data.code });
    }
  }
}
</script>

<style lang="scss" scoped>
 .container{
   padding: 10px;
   .topItem{
     padding: 10px;
     border-bottom: 1px solid #eee;
     display: flex;
     margin: 15px 0;
     border-radius: 8px;
     box-shadow: 0 0 10px #eee; 
     .projectImg{
       width: 100px;
       height: 100px;
       margin-right: 10px;
       border-radius: 8px;
     }
     &>div{
       flex: 1;
       display: flex;
       flex-direction: column;
       height: 40px;
       justify-content: space-between;
       .title{
         font-size: 16px;
         font-weight:600;
       }
       .address{
         color: gray;
         font-size: 13px;
         img{
           width: 10px;
           height: 10px;
         }
       }
       .look{
         color: lightgray;
         font-size: 13px;
       }
       .time{
         color: gray;
         font-size: 13px;
       }
       .rent{
         font-size: 13px;
         span{
           color: orange;
           font-size: 18px;
         }
       }
     }
   }
 }
</style>
