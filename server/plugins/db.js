module.exports = app => {
  const mongoose = require('mongoose')
  mongoose.connect('mongodb://127.0.0.1:27017/node-vue-moba', {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })

  require('require-all')(__dirname + '/../modules')
  // require('../modules/Ad')
  // require('../modules/AdminUser')
  // require('../modules/Article')
  // require('../modules/Category')
  // require('../modules/Hero')
  // require('../modules/Item')
}