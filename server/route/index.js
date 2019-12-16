const Router = require('koa-router')
const fs = require('fs')
const path = require('path')
const router = new Router()


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

module.exports = router


