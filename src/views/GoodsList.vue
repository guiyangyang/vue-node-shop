<template lang="html">
<div class="">
 <nav-header></nav-header>
 <!--使用NavBread组建 并向其 solt 中 插入自定义内容  -->
 <nav-bread>
  <span slot="bread">Goods</span>
  <!-- <span slot="b">测试</span> -->
 </nav-bread>
  <div class="accessory-result-page accessory-page">
    <div class="container">
      <div class="filter-nav">
        <span class="sortby">Sort by:</span>
        <a href="javascript:void(0)" class="default cur">Default</a>
        <a href="javascript:void(0)" class="price"
        @click="sortGoods">
        Price
        <svg class="icon icon-arrow-short" v-bind="{'sort-up':sortFlag}">
          <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#icon-arrow-short"></use></svg></a>
        <a href="javascript:void(0)" class="filterby stopPop" @click="showFilterPop">Filter by</a>
      </div>
      <div class="accessory-result">
        <!-- filter -->
        <div class="filter stopPop" id="filter" v-bind:class="{'filterby-show':filterBy}">
          <dl class="filter-price">
            <dt>Price:</dt>
            <dd><a href="javascript:void(0)" v-bind:class="{'cur':priceChecked=='all'}" @click="priceChecked = 'all'">All</a></dd>
            <dd v-for="(price,index) in priceFilter">
              <a href="javascript:void(0)" @click="setPriceFilter(index)" v-bind:class="{'cur':priceChecked == index}">{{price.startPrice}} - {{price.endPrice}}</a>
            </dd>
          </dl>
        </div>

        <!-- search result accessories list -->
        <div class="accessory-list-wrap">
          <div class="accessory-list col-4">
            <ul >
              <li v-for="(item,index) in goodsList">
                <div class="pic">
                  <!-- <a href="#"><img v-bind:src="'/static/'+item.productImg" alt=""></a> -->
                  <a href="#"><img v-lazy="'/static/'+item.productImage" alt=""></a>
                </div>
                <div class="main">
                  <div class="name">{{item.productName}}</div>
                  <div class="price">{{item.salePrice}}</div>
                  <div class="btn-area">
                    <a href="javascript:;" class="btn btn--m" @click="addCart(item.productId)">加入购物车</a>
                  </div>
                </div>
              </li>
            </ul>
            <div class="load-more" v-infinite-scroll="loadMore" infinite-scroll-disabled="busy" infinite-scroll-distance="10">
             <img src="./../../static/loading-svg/loading-spinning-bubbles.svg" alt="" v-show ="loading">
          </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  <div class="md-overlay" v-show="overLayFlag" @click="closePop"></div>
<!--未登录 点击‘加入购物车’ 提示框  -->
  <modal v-bind:mdShow="mdShow" v-on:close="closeModal">
    <p slot="message">
      请先登录，否则无法加入到购物车中！
    </p>
    <div slot="btnGroup" class="">
   <a href="#" class="btn btn--m" @click="closeModal">关闭</a>
    </div>
  </modal>
<!--登录 “加入购物车” 成功提示框  -->
  <modal v-bind:mdShow="mdShowCart" v-on:close="closeModal">
    <p slot="message">
       <svg class="icon-status-ok">
         <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#icon-status-ok"></use>
       </svg>
       <span>加入购物车！</span>
    </p>
    <div slot="btnGroup" class="">
   <a href="#" class="btn btn--m" @click="mdShowCart=false">继续购物</a>
   <router-link  href="#" class="btn btn--m" to="/cart">查看购物车</router-link>
    </div>
  </modal>
  <nav-footer></nav-footer>
</div>
</template>

<script>
// vue 组建中  要引入css  import '../.css'
// assets 中 放置 组建的  静态资源 ；
// static 中放置 图片等资源，assets 中的图片 会打包编译称base64;
import './../assets/css/base.css'
import './../assets/css/product.css'
import './../assets/css/login.css'
import './../assets/css/checkout.css'
import NavHeader from '@/components/NavHeader.vue'
import NavFooter from '@/components/NavFooter.vue'
import NavBread from '@/components/NavBread.vue'
import Modal from '@/components/Modal.vue'
//@ 在build/webpack.base.conf.js  中  映射到 ‘src’

import axios from 'axios'


export default {
  data (){  //组建 data 必须是 函数  每个组建数据  是独立的
     return {
       goodsList:[],
       priceFilter:[
         {
           startPrice:'0.00',
           endPrice:'100.00'
         },
         {
           startPrice:'100.00',
           endPrice:'500.00'
         },
         {
           startPrice:'500.00',
           endPrice:'1000.00'
         },
         {
           startPrice:'1000.00',
           endPrice:'5000.00'
         }

       ],
       priceChecked:'all',
       filterBy:false,
       overLayFlag:false,
       sortFlag:true,//分页
       page:1,
       pageSize:3,
       busy:false,
       loading:false,  // 加载 动画
       mdShow:false,   //模态框 提示
       mdShowCart:false
     }
  },
  components:{
    NavHeader,
    NavFooter,
    NavBread,
    Modal
  },
  mounted:function(){
     this.getGoodsList()
  },
  methods:{
    getGoodsList(flag){// flag 判断是 分页 还是 滚动加载
      var param ={
         page:this.page,
         pageSize:this.pageSize,
         sort:this.sortFlag?1:-1,
         priceLevel:this.priceChecked    //价格过滤
      }
      // 前端 端口 8080，服务端口 3000，跨域 ->config/index.js 启用代理
      this.loading = true;  // 显示 加载动画
      axios.get("/goods/list",{
        params:param
      }).then((result)=>{
        if(result.status==200){
          var res = result.data.result.list;
          this.loading = false;
          if(flag == true){
            this.goodsList = this.goodsList.concat(res) //滚动 累加 数据
             if(result.data.result.count == 0){
               this.busy = true   //当数据 完毕 禁止 滚动加载
             }else{
               this.busy = false;
             }
          }else{
            this.goodsList = res;
            this.busy = false;
          }


          console.log('wer  123')
          // console.log(result)
        }else{
          console.log('req error')
        }

      })

    },
    setPriceFilter (index){  //价格 过滤
      this.priceChecked = index;
      this.page = 1;
      this.getGoodsList();
      this.closePop();
    },
    showFilterPop (){
      this.filterBy = true;
      this.overLayFlag = true;
    },
    closePop (){
      this.filterBy = false;
      this.overLayFlag = false;
    },
    sortGoods (){  // 分页 排序
      console.log('sortGoods')
      this.sortFlag = !this.sortFlag;
      this.page = 1;
      this.getGoodsList()
    },
    loadMore (){
      this.busy = true; //先禁止 滚动加载，避免 一直加载

      setTimeout(() => {
        this.page++;
        this.getGoodsList(true)
        // for (var i = 0, j = 10; i < j; i++) {
        //   this.data.push({ name: count++ });
        // }
        // this.busy = false;
      }, 500);
    },
    addCart (productId){
      axios.post('/goods/addCart',{
        productId:productId
      }).then((response)=>{
        let res=response.data;
        if(res.status == 0){
          // alert("加入 成功")
          this.mdShowCart=true;

          console.log('success 001')
          this.$store.commit('updateCartCount',1)
        }else{
          // alert("msg:"+res.msg)
          this.mdShow =true
          console.log('err 001')
          // console.log(res)
        }
      })
    },
    closeModal (){
      this.mdShow=false;
      this.mdShowCart=false;
    }

  }
}
</script>

<style lang="css">

.sort-up{
  transform: rotate(180deg);
  transition: transform .3s ease-out;
}
</style>
