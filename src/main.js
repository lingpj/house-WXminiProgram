import Vue from 'vue'
import App from './App'
import WXrequest from './utils/request'
let base64 = require('js-base64').Base64;
var QQMapWX = require('../static/js/qqmap-wx-jssdk.js')
// 实例化API核心类
var qqmapsdk = new QQMapWX({
    key: 'QMHBZ-O4LLW-ZB4RY-RLAHW-YZOYK-CLFYY'
});
Vue.prototype.$QQMapWX = qqmapsdk
Vue.prototype.$http = WXrequest
Vue.prototype.$base64 = base64
Vue.config.productionTip = false
App.mpType = 'app'

const app = new Vue(App)
app.$mount()
