import React from 'react'
import { connect } from 'react-redux'
import Layout from '@/components/layout'
console.log(Layout.Header)
const { Header, Content, Footer, Side, Section } = Layout
const ContentView = (props) => {
    const dom = props.app.dom
    function stateCompile (children) {
        let res = []
        if (children) {
            children.forEach((item, index) => {
                if (item.children) {
                    res[index] = <item.type className={item.class || ''}>{stateCompile(item.children)}</item.type>
                } else {
                    res[index] = <item.type className={item.class || ''}>{item.text}</item.type>
                }
            })
        }
        return res
    }

    return (
        // <div>
        //     {
        //         dom.type && <dom.type className={dom.class || ''}>
        //             {stateCompile(dom.children)}
        //         </dom.type>
        //     }
        // </div>
        <Section>
            222
            <Side>111</Side>
            <Layout>
                <Header />
                <Content />

            </Layout>
        </Section>
    )
}

export default connect(
    ({ app }) => ({ app }),
    dispatch => ({
        userLogout: payload => dispatch({ type: 'app/USERLOGOUT', payload })       //退出登录，清除model里对应的user数据
    })
)(ContentView);