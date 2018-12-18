var express = require('express'); //加载express
var router = express.Router();// 加载 express rouoter
var mongoose = require('mongoose'); // 加载 mongoose
var Goods =require('../models/goods');// 加载 数据模型

// 1、 mongoose 链接数据库
 mongoose.connect('mongodb://127.0.0.1:27017/dumall');
  // mongoose.connect('mongodb://root:123456@127.0.0.1:27017/dumall')//账号密码链接数据库

// 2、监听 数据库 链接 成功，失败，断开
 mongoose.connection.on("connected",function(){
   console.log('mongodb connected success.')
 })

 mongoose.connection.on("error",function(){
   console.log('mongodb connected error.')
 })

 mongoose.connection.on("disconnected",function(){
   console.log('mongodb disconnected .')
 })

// 查询  商品列表
 router.get('/list',function(req,res,next){  //二级 路由

   // 1. 实现 排序  分页   价格过滤
   let sort  = parseInt(req.param('sort'));  // 获取前端的参数 1 正序 -1 降序
   let page = req.param("page");   // express 通过 param 获取 请求参数；node 原生 通过url
   let pageSize =parseInt(req.param('pageSize'));// 获取分页、个数
   let priceLevel = req.param('priceLevel')  // 价格过滤 all 0(0-100) 1 2 3
   let priceGt = '',priceLte = '';   //价格 区间

   let params = {}

   if(priceLevel != 'all'){
     switch (priceLevel) {
       case '0': priceGt= 0;priceLte = 100;break;
       case '1': priceGt= 100;priceLte = 500;break;
       case '2': priceGt= 500;priceLte = 1000;break;
       case '3': priceGt= 1000;priceLte = 5000;break;
       // default:
     }
     params = {       // 价格 过滤 筛选
       salePrice:{
         $gt:priceGt,
         $lte:priceLte
       }
     }
   }
   // console.log('sort'+sort)
   // console.log('page'+page)
   // console.log('pageSize'+pageSize)
   //
   let skip = (page-1)*pageSize;  // 跳过 多少数据
   //

   let goodsModel = Goods.find(params).skip(skip).limit(pageSize);
    // find 可以创建模型，查找所有数据,跳过几条，并获取几条
   goodsModel.sort({'salePrice':sort})  // 所有数据 操作 json形式

   goodsModel.exec(function(err,doc){  //
   // Goods.find({},function(err,doc){  //通过模型  查找数据
     if(err){
       res.json({
         status:'1',
         msg:err
       })
     }else{
       res.json({
         status:'0',
         msg:'',
         result:{
           count:doc.length,
           list:doc
         }
       })
     }
   })

    // res.send('hello,good list')
 })

// 加入 购物车
router.post("/addCart",function(req,res,next){
  var userId = '100000077',productId = req.body.productId;//1、获取 用户id 商品id
  // post 取参 与 get 取参 不同 body param
  // console.log('req.body'+req.body.productId)
  var User = require('../models/user'); //2、获取 模型 数据
  User.findOne({ userId:userId},function(err,userDoc){
    if(err){
      res.json({
        status:"1",
        msg:err.message
      })
    }else{
      // console.log('userDoc'+userDoc)
      if(userDoc){// 3、用户 数据存在
        let goodsItem = '';
        userDoc.cartList.forEach(function(item){
          if(item.productId==productId){
            goodsItem = item;
          item.productNum++;
          }
        });
        if(goodsItem){// 4、购物车 商品已有 增加数量
          userDoc.save(function(err2,doc2){
            if(err2){
              res.json({
                status:'1',
                msg:err2.message
              })
            }else{
                res.json({
                  status:'0',
                  msg:'',
                  result:'success'
                })
            }
          })
        }else{  //5、购物车 新增 商品
          Goods.findOne({productId:productId},function(err1,doc1){
            if(err1){
              res.json({
                status:'1',
                msg:err1
              })
            }else{// 6、从总商品信息中 获取该商品信息 保存到购物车
                if(doc1){
                  doc1.productNum =1;
                  doc1.checked =1;
                  userDoc.cartList.push(doc1);
                  userDoc.save(function(err2,doc2){
                    if(err2){
                      res.json({
                        status:'1',
                        msg:err2.message
                      })
                    }else{
                        res.json({
                          status:'0',
                          msg:'',
                          result:'success'
                        })
                    }
                  })
                }
            }
          })
        }


      }
    }
  })

})
 module.exports = router;  //一定要写 这句
