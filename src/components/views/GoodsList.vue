<template lang="html">
  <div class="">
    这是goodslist页面
    <span>{{$route.params.goodsid}}</span><br>
    <router-link to="/goods/title">显示商品标题</router-link>
    <router-link to="/goods/img">显示商品图片</router-link>
    <!--子路由 地址  写全  -->
    <div class="">
      <router-view></router-view>
    </div>
  </div>
</template>

<script>
export default {
  name:'GoodsList',
  data (){
    return{
      msg:"hello vue"
    }
  }
}
</script>

<style lang="css">
</style>
