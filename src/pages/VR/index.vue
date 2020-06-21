<template>
  <div>
      <web-view :src="url" style="width:100%;height:100%"></web-view>
  </div>
</template>

<script>

export default {
  components: {
    
  },

  data () {
    return {
      url:'',
    }
  },
  mounted(){

  },
  onLoad: function(options) {
    console.log(options)
    var target = options.target
    var self = this
    if(target == 1){
      
      wx.getStorage({
        key: "customeUrl",
        success(res) {
          self.url = res.data
        }
      })
    }else{
      this.url = target
    }
    
  },
  created () {
     
  }
}
</script>

<style>
 
</style>
