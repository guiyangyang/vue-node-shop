var express = require('express');
var router = express.Router();
require('./../util/util');//加载 日期工具类
/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

//2. 登录 接口
var User =require('./../models/user')
router.post("/login",function(req,res,next){
  let param={
    userName : req.body.userName,
    userPwd :req.body.userPwd
  }

  User.findOne(param,function(err,doc){
    if(err){
      res.json({
        status:'1',
        msg:err.message
      })
    }else{
      if(doc){
        res.cookie("userId",doc.userId,{
          path:'/',
          maxAge:1000*60*60
        });
        res.cookie("userName",doc.userName,{
          path:'/',
          maxAge:1000*60*60
        });
        // req.session.user =doc; //需要安装 express-session 插件
        res.json({
          status:'0',
          msg:'',
          result:{
            userName:doc.userName,

          }
        })
      }
    }
  })
})

// 3. 登出 接口
router.post("/logout",function(req,res,next){
    res.cookie('userId','',{ //删除 cookie
      path:'/',
      maxAge:-1
    })
    res.json({
      status:'0',
      msg:'',
      result:''
    })

})

//4.  登录校验
router.get('/checkLogin',function(req,res,next){
  if(req.cookies.userId){
       res.json({
         status:'0',
         msg:'',
         result:req.cookies.userName
       })
  }else{
    res.json({
      status:'1',
      msg:'未登录',
      result:''
    })
  }
})


// 5. 购物车 列表
router.get('/cartList',function(req,res,next){
  var userId = req.cookies.userId;
  User.findOne({userId:userId},function(err,doc){
    if(err){
      res.json({
        status:'1',
        msg:err.message,
        result:''
      })
    }else{
      if(doc){
        res.json({
          status:'0',
          msg:'',
          result:doc.cartList
        })
      }

    }
  })
})

// 6. 购物车 删除商品
router.post('/cartDel',function(req,res,next){

    var userId = req.cookies.userId , productId = req.body.productId;
    console.log('userId:'+userId)
    console.log('productId:'+productId)
    // 通过 update 删除数据
    User.update({userId:userId},{$pull:{'cartList':{'productId':productId}}},function(err,doc){
      if(err){
        res.json({
          status:'1',
          msg:err.message,
          result:''
        })
      }else{
        res.json({
          status:'0',
          msg:'',
          result:'success'
        })
      }
    })
})

// 7. 商品 数量 加减 -> 修改 二级数据中的  某条数据
router.post('/cartEdit',function(req,res,next){
var userId = req.cookies.userId,
    productId = req.body.productId,
    productNum=req.body.productNum;
    checked =req.body.checked;
    console.log("productNum:"+productNum)


    User.update({"userid":userId,"cartList.productId":productId},{
      // $set:{
      //   "cartList.productNum":productNum,
      //   "cartList.checked":checked
      // }
      "cartList.$.productNum":productNum,
        "cartList.$.checked":checked

    },function(err,doc){
      if(err){
        res.json({
          status:'1',
          msg:err.message,
          result:''
        })
      }else{
        res.json({
          status:'0',
          msg:'',
          result:'success'
        })
      }
    })

})

// 8. 购物车 全选
router.post('/editCheckAll',function(req,res,next){
  var userId = req.cookies.userId,
  checkAll =req.body.checkAll?'1':'0';

  User.findOne({'userId':userId},function(err,user){//批量 更新数据
    if(err){
      res.json({
        status:'1',
        msg:err.message,
        result:''
      })
    }else{
      user.cartList.forEach((item)=>{
        item.checked=checkAll
      })

      user.save(function(err1,doc){
        if(err1){
          res.json({
            status:'1',
            msg:err.message,
            result:''
          })
        }else {
          res.json({
            status:'0',
            msg:'',
            result:'suc'
          })
        }
      })

    }
  })
})

// 9. 查询 用户地址 接口
router.get('/addressList',function(req,res,next){
  var userId = req.cookies.userId;
  User.findOne({'userId':userId},function(err,doc){
    if(err){
      res.json({
        status:'1',
        msg:err.message,
        result:''
      })
    }else{
      res.json({
        status:'0',
        msg:'',
        result:doc.addressList
      })
    }
  })
})

// 10. 设置默认地址
router.post("/setDefualt",function(req,res,next){
  var userId = req.cookies.userId,
      addressId = req.body.addressId;
      if(!addressId){
        res.json({
          status:'1003',
          msg:'addressId is null',
          result:''
        })
      }else{
        User.findOne({'userId':userId},function(err,doc){
          if(err){
            res.json({
              status:'1',
              msg:err.message,
              result:''
            })
          }else {
            var addressList = doc.addressList;
            addressList.forEach((item) =>{
              if(item.addressId == addressId){
                item.isDefault = true
              }else{
                item.isDefault = false
              }
            })
            doc.save(function(err1,doc1){
              if(err1){
                res.json({
                  status:'1',
                  msg:err.message,
                  result:''
                })
              }else{
                res.json({
                  status:'0',
                  msg:'',
                  result:'suc'
                })
              }
            })
          }
        })

      }


})
//11. 删除 地址
router.post('/delAddress',function(req,res,next){
  var userId = req.cookies.userId,
      addressId = req.body.addressId;

      User.update({'userId':userId},{
        $pull:{                        // 删除 数据
          'addressList':{
            'addressId':addressId
          }
        }
      },function(err,doc){
        if(err){
          res.json({
            status:'1',
            msg:err.message,
            result:''
          })
        }else{
          res.json({
            status:'0',
            msg:'',
            result:'suc'
          })
        }
      })
})


// 12 生成订单
router.post('/payMent',function(req,res,next){
  var userId = req.cookies.userId,
      addressId = req.cookies.addressId,
      orderTotal=req.body.orderTotal;
      User.findOne({userId:userId},function(err,doc){
        if(err){
          res.json({
            status:'1',
            msg:err.message,
            result:''
          })

        }else {
          var address = '',goodsList = [];
          //获取 用户 地址信息
          doc.addressList.forEach((item)=>{
            if(addressId == item.addressId){
              address = item;
            }
          })

          doc.cartList.filter((item)=>{
            if(item.checked == '1'){
              goodsList.push(item)
            }
          })
          // 如何 随机生成  订单id 及 生成时间
          var platform = '622'; //假设 平台 代码
          var r1 = Math.floor(Math.random()*10);//取 0-9
          var r2 = Math.floor(Math.random()*10);//取 0-9
          var sysDate = new Date().Format('yyyyMMddhhmmss'); //利用uitl 生成系统时间
          var createDate = new Date().Format('yyyy-MM-dd hh:mm:ss');

          var orderId = platform + r1 + sysDate + r2; // 随机 生成 订单 id

          var order={  //生成 订单数据 再存储
            orderId:orderId,
            orderTotal:orderTotal,
            addressInfo:address,
            goodsList:goodsList,
            orderStatus:'1',
            createDate:createDate

          };

          doc.orderList.push(order)
          doc.save(function(err1,doc1){
            if(err){
              res.json({
                status:'1',
                msg:err.message,
                result:''
              })

            }else{
              res.json({
                status:'0',
                msg:'',
                result:{
                  orderId:order.orderId,
                  orderTotal:order.orderTotal
                }
              })
            }
          })
        }
      })
})

// 13 根据订单 id  查询 订单

router.get('/orderDetail',function(req,res,next){
  var orderId = req.param('orderId'),
       userId = req.cookies.userId;

       User.findOne({userId:userId},function(err,userInfo){
         if(err){
           res.json({
             status:'1',
             msg:err.message,
             result:''
           })
         }else{
           var orderList = userInfo.orderList;
           var orderTotal =0;
           if(orderList.length>0){
               orderList.forEach((item)=>{
                 if(item.orderId == orderId){
                   orderTotal = item.orderTotal;
                 }
               })

               if(orderTotal >0){
                 res.json({
                   status:'0',
                   msg:'',
                   result:{
                     orderId:orderId,
                     orderTotal:orderTotal
                   }
                 })
               }else {
                 res.json({
                   status:'12002',
                   msg:'无此订单',
                   result:''
                 })
               }


           }else{
             res.json({
               status:'12001',
               msg:'当前用户未创建订单',
               result:''
             })
           }
         }
       })
})

//14. 获取 购物车 商品数量
router.get('/getCartCount',function(req,res,next){
  if(req.cookies && req.cookies.userId){
    var userId = req.cookies.userId;
    User.findOne({userId:userId},function(err,doc){
      if(err){
        res.json({
          status:'1',
          msg:err.message,
          result:''
        })
      }else{
        var cartList = doc.cartList;
        let cartCount =0;
        cartList.map(function(item){
          cartCount += parseInt(item.productNum);
        })
        res.json({
          status:'0',
          msg:'',
          result:cartCount
        })
      }
    })
  }
})







module.exports = router;
