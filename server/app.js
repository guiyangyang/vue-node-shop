var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var ejs = require('ejs');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var goodsRouter = require('./routes/goods');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.engine('.html',ejs.__express);
app.set('view engine', 'html');
// app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// 登录 拦截
app.use(function(req,res,next){
  if(req.cookies.userId){// 若cookie存在 执行下一步
    next()
  }else{
    // 商品列表的 req.originalUrl =  goods?page=2&pageSize=3&sort=1&priceLevel=all
    // 加入购物车 req.originalUrl =  /goods/addCart 故 不能使用条件判断 req.originalUrl.indexOf('/goods')>-1
    // 区分商品列表 购物车 /goods/list 、/goods/addCart
    //
    // 第二种方法  使用req.path  不用考虑 请求参数
    // if(req.originalUrl=='/users/login'||req.originalUrl=='/users/logout'||req.originalUrl.indexOf('/goods')>-1){
    // if(req.originalUrl=='/users/login'||req.originalUrl=='/users/logout'||req.originalUrl.indexOf('/goods/list')>-1){
    if(req.originalUrl=='/users/login'||req.originalUrl=='/users/logout'||req.path=='/goods/list'){
      next();//若是  点击 登录 或登出  商品列表 执行下一步 白名单
    }else{// 若是其他操作 则拦截 返回信息
      res.json({
        status:'10001',
        msg:'当前未登录',
        result:''
      })
    }
  }
})

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/goods', goodsRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
