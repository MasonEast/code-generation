import React from 'react'
import { Menu, Icon } from 'antd';
import { Link } from 'dva/router';
import { connect } from 'react-redux'

const { SubMenu } = Menu;

class LeftSider extends React.Component {
    // submenu keys of first level
    rootSubmenuKeys = ['sub1', 'sub2', 'sub4'];

    state = {
        openKeys: ['sub1'],
    };

    onOpenChange = openKeys => {
        const latestOpenKey = openKeys.find(key => this.state.openKeys.indexOf(key) === -1);
        if (this.rootSubmenuKeys.indexOf(latestOpenKey) === -1) {
            this.setState({ openKeys });
        } else {
            this.setState({
                openKeys: latestOpenKey ? [latestOpenKey] : [],
            });
        }
    };

    // handleHMF = () => {
    //     let data = {
    //         type: 'Layout',
    //         title: '',
    //         class: 'layout-box',
    //         children: [
    //             {
    //                 type: 'Header',
    //                 title: '',
    //                 // children: [],
    //                 text: 'header'
    //             },
    //             {
    //                 type: 'Section',
    //                 title: '',
    //                 class: 'layout-section',
    //                 children: [
    //                     {
    //                         type: 'Side',
    //                         title: '',
    //                         class: 'layout-side',
    //                         // children: [],
    //                         text: 'side'
    //                     },
    //                     {
    //                         type: 'Content',
    //                         title: '',
    //                         // children: [],
    //                         text: 'Content'
    //                     },
    //                 ],
    //                 text: ''
    //             },
    //             {
    //                 type: 'Footer',
    //                 title: '',
    //                 text: 'footer'
    //             }
    //         ]
    //     }
    //     this.props.changeLayout(data)
    // }
    handleHMF = () => {
        let data = {
            type: 'Layout.Section',
            title: '',
            class: 'layout-section',
            children: [
                {
                    type: 'Side',
                    title: '',
                    class: 'layout-side',
                    // children: [],
                    text: 'side'
                },
                {
                    type: 'Layout',
                    title: '',
                    class: 'layout-box',
                    text: '',
                    children: [
                        {
                            type: 'Header',
                            title: '',
                            // children: [],
                            text: 'Header'
                        },
                        {
                            type: 'Content',
                            title: '',
                            // children: [],
                            text: 'Content'
                        },
                        {
                            type: 'Footer',
                            title: '',
                            text: 'footer'
                        }
                    ],

                },


            ]
        }
        this.props.changeLayout(data)
    }
    handleLMR = () => {
        let data = {
            type: 'Layout',
            title: '',
            class: 'layout-box',
            children: [
                {
                    type: 'Header',
                    title: '',
                    // children: [],
                    text: 'header'
                },
                {
                    type: 'Content',
                    title: '',
                    // children: [],
                    text: 'Content'
                },
                {
                    type: 'Footer',
                    title: '',
                    text: 'footer'
                }
            ]
        }
        this.props.changeLayout(data)
    }

    render () {
        return (
            <Menu
                mode="inline"
                openKeys={this.state.openKeys}
                onOpenChange={this.onOpenChange}
                style={{ width: 200 }}
            >
                <SubMenu
                    key="sub1"
                    title={
                        <span>
                            <Icon type="layout" />
                            <span>布局组件</span>
                        </span>
                    }
                >
                    {/* <Menu.Item key="1"><Link to="/layout">上中下布局</Link></Menu.Item> */}
                    <Menu.Item key="1" onClick={this.handleHMF}>左右布局</Menu.Item>
                    <Menu.Item key="2" onClick={this.handleLMR}>上中下布局</Menu.Item>
                </SubMenu>
                <SubMenu
                    key="sub2"
                    title={
                        <span>
                            <Icon type="form" />
                            <span>表单组件</span>
                        </span>
                    }
                >
                    <Menu.Item key="5">Option 5</Menu.Item>
                    <Menu.Item key="6">Option 6</Menu.Item>
                    <SubMenu key="sub3" title="Submenu">
                        <Menu.Item key="7">Option 7</Menu.Item>
                        <Menu.Item key="8">Option 8</Menu.Item>
                    </SubMenu>
                </SubMenu>
                <SubMenu
                    key="sub4"
                    title={
                        <span>
                            <Icon type="table" />
                            <span>表格组件</span>
                        </span>
                    }
                >
                    <Menu.Item key="9">Option 9</Menu.Item>
                    <Menu.Item key="10">Option 10</Menu.Item>
                    <Menu.Item key="11">Option 11</Menu.Item>
                    <Menu.Item key="12">Option 12</Menu.Item>
                </SubMenu>
            </Menu>
        );
    }
}


export default connect(
    ({ app }) => ({ app }),
    dispatch => ({
        changeLayout: data => dispatch({ type: 'app/CHANGELAYOUT', data })       //退出登录，清除model里对应的user数据
    })
)(LeftSider);