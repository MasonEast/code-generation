const Koa = require('koa')
const cors = require('koa-cors')
const bodyParser = require('koa-bodyparser')
const router = require('./route')

//实例化koa
const app = new Koa();

//解除跨域限制， 这里用于demo， 这样做是不安全的
app.use(cors({
    origin: '*'
}))

//解析post请求的中间件
app.use(bodyParser());



//配置路由
app.use(router.routes()).use(router.allowedMethods())


const port = process.env.PORT || 5000

app.listen(port, () => {
    console.log(`port running at ${port}....`)
})




