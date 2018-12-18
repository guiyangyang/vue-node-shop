// 引入mongoose 并 创建数据模型  导出数据模型
var mongoose = require('mongoose')
var Schema = mongoose.Schema;
var produtSchema = new Schema({
  "productId":String,
  "productName":{type:String},
  "salePrice":Number,
  "productImage":String,
  "productNum":String,
  "checked":String
  })

module.exports = mongoose.model('Good',produtSchema);
// Good 将会 搜索匹配 goods 数据库 默认 关联
// module.exports = mongoose.model('Good',produtSchema,'goods');
