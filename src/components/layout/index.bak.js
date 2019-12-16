import React from 'react'
import { connect } from 'react-redux'

const Layout = ({ app }) => {
    let children = app.dom.children

    function stateCompile (children) {
        let res = []
        if (children) {
            children.forEach((item, index) => {
                if (item.children) {
                    res[index] = stateCompile(item.children)
                } else {
                    res[index] = <item.type>{item.text}</item.type>
                }
            })
        }
        return res
    }
    console.log(stateCompile(children))
    return (

        <app.dom.type>
            {
                stateCompile(children)
            }
        </app.dom.type>

    )
}

// export default Layout

export default connect(
    ({ app }) => ({ app }),
    dispatch => ({
        userLogout: payload => dispatch({ type: 'app/USERLOGOUT', payload })       //退出登录，清除model里对应的user数据
    })
)(Layout);