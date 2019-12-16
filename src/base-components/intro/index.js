import React, { Component } from 'react'
import { Steps } from 'intro.js-react'
import PropTypes from 'prop-types'
import 'intro.js/introjs.css'

const defaultOptions = {
    nextLabel: '下一步',
    prevLabel: '上一步',
    skipLabel: '跳过',
    doneLabel: '完成',
    showStepNumbers: false,
    keyboardNavigation: false,
    showBullets: false,
    exitOnOverlayClick: false, // 点击遮罩不关闭引导
    overlayOpacity: 0.4
};
export default class Intro extends Component {
    static defaultProps = {
        expireTime: null
    }
    constructor(props) {
        super(props)
    }
    getStep = (e) => {
        this.props.getRef(e)
    }
    initIntro = () => {
        let firstIntro, inDuration, needIntro;
        firstIntro = localStorage.getItem(this.props.storageName) === null ? true : false
        if (!this.props.expireTime) {  // 没有设置过期时间
            needIntro = firstIntro
        } else {
            inDuration = (new Date() - new Date(this.props.expireTime.startTime) > 0) && (new Date() - new Date(this.props.time.deadlineTime) < 0)
            needIntro = firstIntro && inDuration  // 第一次引导且在时间范围内。
        }
        if (needIntro) {
            this.props.onShowIntro()
        }
    }
    onExit = () => {
        if (this.props.storageName) {
            localStorage.setItem(this.props.storageName, false)
        }
        this.props.onExit && this.props.onExit()
        
    }
    componentDidMount() {
        this.initIntro()
    }
    render() {
        return (
            <Steps
                {...this.props} 
                initialStep={this.props.initialStep || 0}
                options={{  ...this.props.options, ...defaultOptions}}
                onExit={this.onExit}
                ref={this.getStep}
            />
        )
    }
}

Intro.propTypes = {
    expireTime: PropTypes.object,
    storageName: PropTypes.string,
    getRef: PropTypes.func,
}