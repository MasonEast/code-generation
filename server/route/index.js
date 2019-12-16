const Router = require('koa-router')
const fs = require('fs')
const path = require('path')
const router = new Router()

// const blog = require('../models/blog')
// const user = require('../models/users')
// const tag = require('../models/tags')
// const responseOK = require('../middlewares/responseOk')

/**
 * 获取blog列表
 */

router.post('/test', async (ctx) => {
    console.log(ctx.request.body)
    // let data = ctx.request.body
    const body = ctx.request.body
    function stateCompile (children) {
        // const children = body.children
        let res = []
        if (children) {
            children.forEach((item, index) => {
                if (item.children) {
                    res[index] = `<${item.type} ${item.class ? `className="${item.class}"` : ''}>${stateCompile(item.children)}</${item.type}>`
                } else {
                    res[index] = `<${item.type} ${item.class ? `className="${item.class}"` : ''}>${item.text}</${item.type}>`
                }
            })
        }
        // return `<${body.type}>${res.join('')}</${body.type}>`
        return res.join(',').replace(/,/g, '\n')
    }
    let data = `<${body.type}>${stateCompile(body.children)}</${body.type}>`
    let jsheader = `
        import React from 'react'
        import { connect } from 'react-redux'
        import Layout from '@/components/layout'
        const {Header, Side, Content, Footer} = Layout
    `
    let template = `
        ${jsheader}
        const Cmp = () => {
            return (${data})
        }
        export default Cmp
    `
    // data = jsheader + '\n' + data
    fs.writeFile(path.join(process.cwd(), 'layout.js'), template, (err) => {
        if (err) {
            console.log(err)
            return;
        }
        console.log('success!')
    })
    ctx.body = {
        status: 0,
        template
    }
})

// router.get('/blog', async (context, next) => {
//     let queryId = context.request.query.id
//     let queryTag = context.request.query.tag
//     if (queryId) {
//         const item = await blog.getBlogById(queryId)
//         context.body = {
//             data: item,
//             status: 0
//         }
//         return
//     }
//     if (queryTag) {
//         const item = await blog.getBlogByTag(queryTag)
//         context.body = {
//             data: item,
//             status: 0
//         }
//         return
//     }
//     const blogs = await blog.getBlogs()
//     context.body = {
//         data: blogs,
//         status: 0
//     }
// })

// /**
//  * 添加blog
//  */
// router.post('/blog', async (ctx, next) => {
//     console.log('post', ctx.request.body)
//     const { title, author, content, tags, status } = ctx.request.body
//     await blog.add(title, author, content, tags, status)
//     if (!Number(status)) {
//         console.log('tags')
//         await tag.add(tags)
//     }
//     await next()
// }, responseOK)

// /**
//  * 删除blog
//  */
// router.delete('/blog/:id', async (context, next) => {
//     console.log('delete', context.request.query)
//     const { id, tags } = context.request.query
//     await blog.deleteBlog(id)
//     await tag.deleteTag(tags)
//     context.body = {
//         status: 0
//     }
// })

// /**
//  * 获取tags
//  */
// router.get('/tags', async (ctx, next) => {
//     const tags = await tag.getTags()
//     ctx.body = {
//         data: tags,
//         status: 0,
//         msg: '成功获取tags'
//     }
// })


// /**
//  * 登录
//  */
// router.post('/login', async (ctx) => {

//     if (!ctx.session.logged) {  // 如果登录属性为undefined或者false，对应未登录和登录失败
//         // 设置登录属性为false
//         ctx.session.logged = false;

//         // 取请求url解析后的参数对象，方便比对
//         const data = ctx.request.body
//         console.log(data)
//         // 判断用户名密码是否为空
//         if (data.email && data.password) {
//             const queryEmail = await user.queryEmail(data.email)

//             // 比对并分情况返回结果  
//             if (queryEmail) {  // 如果存在该用户名

//                 // 进行密码比对并返回结果 
//                 if (queryEmail[0].password === data.password) {
//                     ctx.session.logged = true;
//                     ctx.body = {
//                         status: 0,
//                         data: queryEmail[0],
//                         msg: '登录成功'
//                     }
//                 } else {
//                     ctx.body = {
//                         status: 1,
//                         data: {},
//                         msg: '密码错误'
//                     }
//                 }


//             } else {                    // 如果不存在该用户名                                          
//                 ctx.body = {
//                     status: 2,
//                     data: {},
//                     msg: '没有该用户，去注册吧'
//                 }
//             }
//         } else {
//             ctx.body = "用户名密码不能为空";
//         }
//     } else {
//         ctx.body = {
//             status: 0,
//             msg: "已登录"
//         };
//     }
// })

// /**
//  * 注册
//  */
// router.post('/register', async (ctx) => {
//     const data = ctx.request.body
//     console.log(data)
//     let queryres = await user.queryEmail(data.email)
//     if (queryres) {
//         ctx.body = {
//             status: 1,
//             data: {},
//             msg: '该邮箱已经存在哦'
//         }
//     } else {
//         await user.save(data)
//         ctx.body = {
//             status: 0,
//             data,
//             msg: '注册成功'
//         }
//     }

// })

module.exports = router


