<template>
  <div class="container">
    <div class="header">
      <h1>{{buildInfo.build}}</h1>
      <p>
        总面积：
        <span>{{buildInfo.built_up_area}}m²</span>
      </p>
      <p>
        总房源：
        <span>{{buildInfo.num}}间</span>
      </p>
      <p>
        预租均价：
        <span>{{buildInfo.rent}}元/m²·天</span>
      </p>
      <div class="overview">
        <div v-for="(item,index) in roomStatus"  :key="index" class="overviewItem">
            <div class="block" :style="{background:item.color}"></div>
            {{item.name}}({{item.statuscount}})
        </div>
      </div>
    </div>
    <div class="houseContainer">
      <div v-for="(item,index) in roomList" :key="index">
        <div class="overviewMsg">
          <div class="index">{{item.floor}}</div>
          <p>{{item.built_up_area}}m² &nbsp;&nbsp;|&nbsp;&nbsp; {{item.avgRent}}元/m²·天</p>
        </div>
        <div class="blockContainer">
          <div class="blockItem" v-for="(block,ind) in item.list " :style="{background:block.color}"  @click="go2Detail(item,block)" :key="ind">
            <p>{{block.room}}</p>
            <span>{{block.built_up_area}}m²</span>
            <img v-if="block.url" class="vr" src="/static/images/vr.png" alt="">
          </div>
        </div>
      </div>
    </div>
    <div class="addImg">
      <img src="/static/images/jiahao.png" alt="" >
    </div>
  </div>
</template>

<script>
export default {
  name: "",
  components: {},
  data() {
    return {
      buildList:[],
      buildInfo:{
        build:'',
        built_up_area:'',
        num:'',
        park:'',
        rent:'',
      },
      target: "",
      roomList:[],
      roomStatus:[],
      roomStatusDict:[]
    };
  },
  // 1: 已租 2: 已付意向金 3: 空置 4: 销控 
  mounted() {
    
  },
  
  onLoad: function(options) {
    this.target = JSON.parse(options.target);
    var { park,build } = this.target

    // 1、获取状态->颜色
    this.$http.get({
        url: '/roomstatus/all',
      }).then(res => {
        this.roomStatusDict = res
        // 2、获取租控图
        this.$http.post({
          url: '/room/infolist',
          data: {park,build}
        }).then(res => {
          console.log(this.roomStatusDict)
          this.buildList = res.buildList ||[]
          this.buildInfo = res.buildList[0] || {}
          this.buildInfo.rent = this.buildInfo.rent.toFixed(2)
          // 3、组织数据
          this.roomList = []
          res.roomList.forEach(item=>{
              var obj = this.roomList.find(o => o.floor == item.floor) || {}
              item.color = this.roomStatusDict.find(o => o.status == item.status).color
              if(Object.keys(obj).length >0){
                obj.list.push(item)
                obj.built_up_area+=item.built_up_area
                obj.sumRent += item.rent
              }else{
                obj.floor = item.floor
                obj.list = [item]
                obj.built_up_area = item.built_up_area
                obj.sumRent = item.rent
                this.roomList.push(obj)
              }
            })
            this.roomList.forEach(item =>{
              item.avgRent = (item.sumRent / item.list.length).toFixed(2)
              item.built_up_area = item.built_up_area.toFixed(2)
            })
            this.roomList = this.roomList.sort((a,b)=>{
              return a.floor - b.floor
            })
          this.roomStatus = res.roomStatus.map(item =>{
            item.name = ['已租','已付意向金','空置','销控'][item.status - 1]
            return item
          }) || []
          console.log(this.roomList)
        })
      })
  },
  methods: {
    go2Detail(parent,child){
      console.log(parent,child)
      var value  =  JSON.stringify(child)
      wx.navigateTo({url:'/pages/houseDetail/main?target='+value})
    },
  }
};
</script>

<style lang="scss" scoped>
.container {
  .vr{
    width: 20px;
    height: 20px;
    position: absolute;
    right: 0;
    top: 0;
  }
  .addImg{
    width: 50px;
    height: 50px;;
    background: lightgray;
    border-radius: 50%;
    position: fixed;
    bottom: 50px;
    right: 20px;
    z-index: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    img{
      width: 25px;
      height: 25px;
    }
  }
  .header{
    padding: 10px;
    box-shadow: 0 3px 5px lightgray;
    h1{
      font-size: 18px;
      font-weight: bold;
    }
    p{
      font-size: 14px;
      color: gray;
      margin: 15px 0;
      span{
        float: right;
        color: #111;
        font-weight: bold;
      }
    }
    .overview{
      display: flex;
      margin: 30px 0 20px 0;
      .overviewItem{
        width: 25%;
        display: flex;
        flex-direction: column;
        align-items: center;
        font-size: 12px;
      }
      .block{
        width: 20px;
        height: 20px;
        margin-bottom: 5px;
      }
    }
  }
  .houseContainer{
    padding: 10px;
    font-size: 12px;
    .overviewMsg{
      display: flex;
      align-items: center;
      margin-bottom: 15px;
      &>div{
        font-size: 14px;
        padding: 3px 10px;
        background: lightgray;
        text-align: center;
        border-radius: 10px;
        line-height: 20px;
        margin-right: 10px;
      }
    }
    .blockContainer{
      margin-bottom: 15px;
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      .blockItem{
        position: relative;
        width: 75px;
        height: 45px;
        background: rgb(229, 138, 154);
        margin-right: 10px;
        margin-bottom: 10px;
        color: #fff;
        line-height: 17.5px;
        padding: 5px;
        font-weight: 600;
        box-sizing: border-box;
      }
    }
  }
}
</style>
