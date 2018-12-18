# d6

> A Vue.js project

## Build Setup

``` bash
# install dependencies
npm install

# serve with hot reload at localhost:8080
npm run dev

# build for production with minification
npm run build

# build for production and view the bundle analyzer report
npm run build --report
```

For a detailed explanation on how things work, check out the [guide](http://vuejs-templates.github.io/webpack/) and [docs for vue-loader](http://vuejs.github.io/vue-loader).


技术栈：vue+node+mongoDB，构建的商品购物网站；
功   能：注册，登录，商品列表懒加载，价格过滤，加入购物车，金额结算等；
数据表：dumall-goods、dumall-users

server文件夹:node后端代码

1.启动mongodb:  
      mongod
2.启动mongodbAdmin：（node10）（mongodb数据管理系统）
      npm start   //D:\downloads\adminmongo
3.链接数据库：
  3.1   server/routes/goods.js配置
            // 1、 mongoose 链接数据库 本地运行时
 mongoose.connect('mongodb://xiaoyang_manager:qqqwe123.@127.0.0.1:19999/dumall', {useNewUrlParser:true},function(err){
   if(err){
     console.log('connect err:'+err)
   }else{
     console.log('connect success!')
   }
 });
  3.2 启动： node server/bin/www
4.启动项目
    npm run dev


登录  admin 123456

