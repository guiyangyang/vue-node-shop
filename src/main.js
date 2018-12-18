// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import VueLazyload from 'vue-lazyload'
import infiniteScroll from 'vue-infinite-scroll' //滚动 插件
Vue.use(infiniteScroll)

import Vuex from 'vuex'
Vue.use(Vuex);
// 若 vuex 管理 状态 不是 很多时，就不需要新建项目目录
// 此项目中，navHeader 组件 被多次使用，并且 用户名、购物车数量 都需要时时显示 交互，
// 故 此两个状态 需要 提到 vuex中进行管理
const store = new Vuex.Store({
  state:{
    niceName:'',
    cartCount:0
  },
  mutations:{
    updateUserInfo (state,niceName){
      state.niceName = niceName;
    },
    updateCartCount (state,cartCount){
      state.cartCount += cartCount;
    },
    initCartCount (state,cartCount){
      state.cartCount = cartCount;
    }
  }

})




//定义 全局 过滤器
// import {currency} from './util/currency'
// Vue.filter('currency',currency)


Vue.config.productionTip = false
Vue.use(VueLazyload,{
  loading:'/static/loading-svg/loading-bars.svg'
})




/* eslint-disable no-new */
new Vue({
  el: '#app',
  store,
  router,
  components: { App },
  template: '<App/>'
})
