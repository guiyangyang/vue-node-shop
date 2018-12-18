import Vue from 'vue'
import Router from 'vue-router'
import GoodsList from '@/views/GoodsList'
import Title from '@/views/Title'
import Image from '@/views/Image'
import Cart from '@/views/Cart'
import Address from '@/views/Address'
import OrderConfirm from '@/views/OrderConfirm'
import OrderSuccess from '@/views/OrderSuccess'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/', //一个路由 同时 显示 三个视图组件 利用命名视图 一一对应
      name: 'GoodsList',
      components: {
        default:GoodsList,
        title:Title,
        img:Image
      }

  },
  {
    path:'/cart',
    name:'cart',
    component:Cart
  },
  {
    path:'/address',
    name:'address',
    component:Address
  },
  {
    path:'/orderConfirm',
    name:'orderConfirm',
    component:OrderConfirm
  },
  {
    path:'/OrderSuccess',
    name:'orderSuccess',
    component:OrderSuccess
  }

  ]
})
