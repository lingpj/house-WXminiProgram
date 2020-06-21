<template>
  <div class="container">
    <div>共{{list.length}}条数据</div>
      <div class="topItem" v-for="(item,index) in list" :key="index">
        <img class="projectImg" :src="item.headurl || '/static/images/zanwutupian.png'" alt="">
        <div>
          <div class="title">{{item.nickname}} <span @click="callHandle(item.mobile)" v-if="item.mobile"><img src="/static/images/dianhua2.png" alt=""> 联系TA</span> </div>
          <div class="shareTitle">看过：{{item.title}}</div>
          <div class="time">{{item.createtime}}<span><img src="/static/images/eye.png" alt=""> {{item.num || 0}}次浏览</span></div>
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
    console.log(JSON.parse(decodeURIComponent(options.data)))
    var self = this
    var target = JSON.parse(decodeURIComponent(options.data))
    this.list = target.map(item =>{
      item.nickname = this.$base64.decode(item.nickname)
      item.createtime = fmtDate(new Date(item.createtime),'yyyy-MM-dd hh:mm:ss')
      return item
    })
  },
  created () {
     
  },
  methods:{
    callHandle(_phone){
      console.log('电话：',_phone)
      wx.makePhoneCall({
          phoneNumber:_phone
        })
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
     img{
       width: 15px;
       height: 15px;
       vertical-align: middle;
     }
     .projectImg{
       width: 60px;
       height: 60px;
       margin-right: 15px;
       border-radius: 50%;
     }
     &>div{
       flex: 1;
       display: flex;
       flex-direction: column;
       height: 60px;
       justify-content: space-between;
       .title{
         font-size: 16px;
         font-weight:600;
         display: flex;
         justify-content: space-between;
         align-items: center;
         span{
           color: #1296db;
           font-size: 13px;
         }
       }
       .shareTitle,.time{
         font-size: 13px;
         color: gray;
         display: flex;
         justify-content: space-between;
         align-items: center;
       }
       .time{
         span{
           float: right;
         }
       }
        
     }
   }
 }
</style>
