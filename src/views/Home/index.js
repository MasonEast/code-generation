import React from 'react'
import { Layout, Button } from 'antd'
import './index.less'
import LeftSider from '@/components/left-sider'
import { Switch } from 'dva/router';
import RouteWithSubRoutes from '@/route/RouteWithSubRoutes'
import ReactDOM from 'react-dom/server'
import { connect } from 'react-redux'
import axios from 'axios'
import qs from 'qs'
import ContentView from '../Content'

const { Sider, Content } = Layout

// console.log(ReactDOM.renderToString(<LeftSider />))


const Home = (props) => {

    const handleClick = () => {
        axios({
            method: 'post',
            url: '/api/test',
            data: props.app.dom
        }).then(res => {
            console.log(res)
        })
    }
    return (
        <Layout className="home-box">
            <Sider className="home-left" theme="light">
                <h2>组件</h2>
                <LeftSider />
            </Sider>
            <Content>
                {/* <ContentView /> */}
                <Switch>
                    {
                        props.routes.map((route, i) => (
                            <RouteWithSubRoutes key={i} {...route} />
                        ))}
                </Switch>
            </Content>
            <Sider className="home-right" theme="light">
                <h2>属性栏</h2>
                <Button onClick={handleClick}>生成代码</Button>
            </Sider>
        </Layout>
    )
}

export default connect(
    ({ app }) => ({ app }),
    dispatch => ({
        userLogout: payload => dispatch({ type: 'app/USERLOGOUT', payload })       //退出登录，清除model里对应的user数据
    })
)(Home);