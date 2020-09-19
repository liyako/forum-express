const express = require('express')
const handlebars = require('express-handlebars')
const db = require('./models')
const bodyParser = require('body-parser')
const flash = require('connect-flash')
const session = require('express-session')
const passport = require('./config/passport')
const methodOverride = require('method-override')
const app = express()
const port = process.env.PORT || 3000
if (process.env.NODE_ENV !== 'production'){
  require('dotenv').config()
}

// 設定 view engine 使用 handlebars
app.engine('handlebars', handlebars({ 
  defaultLayout: 'main',
  helpers: require('./config/handlebars-helpers')
}))
app.set('view engine', 'handlebars')
app.use(bodyParser.urlencoded({ extended: true }))

// setup session and flash
app.use(session({ secret: 'secret', resave: false, saveUninitialized: false }))
app.use(flash())

// setup passport
app.use(passport.initialize())
app.use(passport.session())

// 把 req.flash 放到 res.locals 裡面
app.use((req, res, next) => {
    res.locals.success_messages = req.flash('success_messages')
    res.locals.error_messages = req.flash('error_messages')
    res.locals.user = req.user
    next()
})
//method
app.use(methodOverride('_method'))
//image
app.use('/upload', express.static(__dirname + '/upload'))
// 跟資料庫同步
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})

// 引入 routes 並將 app 傳進去，讓 routes 可以用 app 這個物件來指定路由
require('./routes')(app, passport)