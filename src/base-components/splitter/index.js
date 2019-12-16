import SplitterLayout from 'react-splitter-layout'
import 'react-splitter-layout/lib/index.css'
import React, { Component } from 'react'
import { Icon } from 'antd'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import './index.less'

const splitterLineSize = 16;

export default class Splitter extends Component {
    static defaultProps = {
        storageName: null,
        primaryIndex: 0,      // 默认主板块是第一个
        primaryMinSize: 40,   // 默认最小尺寸
        secondaryMinSize: 40,
        vertical: false,      // 默认水平方向
        showFold: false,      // 是否需要折叠区域，默认不显示
    }
    constructor(props) {
        super(props)
        this.state = {
            secondaryIndex: this.secondaryIndex(),  // 次板块的索引。默认左边为主板块 0， 右边为次板块 1。通过修改 width 属性修改两块的大小，width 属性始终在次板块上。 
            secondaryInitialSize: this.getInitSize(),
            visibleFold: false, // 默认不显示折叠区域
            visibleContent: true, // 是否显示次板块内容
        }

        props.showFold ? this.foldSize = 26 : this.foldSize = 0 
        this.splitter = React.createRef()
    }
    secondaryIndex = () => {
        let secondaryIndex
        this.props.primaryIndex === 0 ? secondaryIndex = 1 : secondaryIndex = 0  // primaryIndex = 0，次板块是 1，primaryIndex = 1,次板块是 0.
        return secondaryIndex
    }
    getInitSize = () => {
        let secondaryInitialSize
        if (this.props.storageName && localStorage.getItem(this.props.storageName)) {
            secondaryInitialSize = localStorage.getItem(this.props.storageName)
            return parseInt(secondaryInitialSize)
        } else if (this.props.secondaryInitialSize) {
            secondaryInitialSize = this.props.secondaryInitialSize
            return parseInt(secondaryInitialSize)
        } else {
            return undefined
        }
    }
    addSplitterButton = () => {
        const { vertical } = this.props
        const { secondaryIndex } = this.state
        // 将按钮 push 到分割线中
        this.splitterLine = document.querySelector('.layout-splitter')
        this.secondaryDom = document.querySelectorAll('.layout-pane')[secondaryIndex]
        let img = document.createElement('img')
        img.className = 'splitter-button'
        img.src = require('../../assets/images/splitter-button.svg')
        this.splitterLine.appendChild(img)
        this.splitterButton = document.querySelector('.splitter-button')

        if (vertical) {
            if (secondaryIndex === 1) {
                img.classList.add('bottom')
                img.onclick = () => this.onVertical('bottom')
            } else {
                img.classList.add('top')
                img.onclick = () => this.onVertical('top')
            }
            this.secondaryHeight = this.secondaryDom.style.height    // 垂直方向次板块初始高
            this.previewClassName = 'preview-secondaryDom-vertical'  // 垂直预览的 className
        } else {
            if (secondaryIndex === 1) {   // 右边为次板块，箭头指向右侧,折叠右侧
                img.classList.add('right')
                img.onclick = () => this.onHorizontal('right')
            } else {
                img.classList.add('left')
                img.onclick = () => this.onHorizontal('left')
            }
            this.secondaryWidth = this.secondaryDom.style.width       // 水平方向次板块初始宽
            this.previewClassName = 'preview-secondaryDom-horizontal' // 水平预览的 class
        }
    }
    onVertical = (direction) => {
        let opposite
        const { visibleFold, visibleContent } = this.state
        this.setState({ visibleFold: !visibleFold, visibleContent: !visibleContent })

        if (direction === 'top') { opposite = 'bottom' } else if (direction === 'bottom') { opposite = 'top' }
        if (this.secondaryDom.style.height === `${this.foldSize}px`) {
            this.secondaryDom.style.height = this.secondaryHeight
            this.splitterLine.style.cssText = 'pointer-events: auto'
        } else {
            this.secondaryHeight = this.secondaryDom.style.height   // 存储次板块宽度，折叠宽度设置为提示面板的宽度
            this.secondaryDom.style.height = `${this.foldSize}px`
            this.splitterLine.style.cssText = 'pointer-events: none'
            this.splitterButton.style.cssText = 'pointer-events: auto'
        }

        this.secondaryDom.classList.remove(this.previewClassName)
        this.splitterButton.classList.remove(direction)
        this.splitterButton.classList.add(opposite)
        this.splitterButton.onclick = () => this.onVertical(opposite)
    }
    onHorizontal = (direction) => {
        let opposite
        const { visibleFold, visibleContent } = this.state
        this.setState({ visibleFold: !visibleFold, visibleContent: !visibleContent })

        if (direction === 'left') { opposite = 'right' } else if (direction === 'right') { opposite = 'left' }
        if (this.secondaryDom.style.width === `${this.foldSize}px`) {    // 当折叠时，点击展开内容
            this.secondaryDom.style.width = this.secondaryWidth
            this.splitterLine.style.cssText = 'pointer-events: auto'
        } else {
            this.secondaryWidth = this.secondaryDom.style.width   // 存储次板块宽度，折叠宽度设置为提示面板的宽度
            this.secondaryDom.style.width = `${this.foldSize}px`
            this.splitterLine.style.cssText = 'pointer-events: none'
            this.splitterButton.style.cssText = 'pointer-events: auto'
        }

        this.secondaryDom.classList.remove(this.previewClassName)
        this.splitterButton.classList.remove(direction)
        this.splitterButton.classList.add(opposite)
        this.splitterButton.onclick = () => this.onHorizontal(opposite)
    }
    onFold = (direction) => {
        let size
        const { visibleContent } = this.state
        this.setState({ visibleContent: !visibleContent })
        if (direction === 'left' || direction === 'right') {
            size = 'width'
        } else {
            size = 'height'
        }

        if (visibleContent) { // 当次板块内容显示时，点击折叠收起内容。尺寸等于折叠面板
            this.secondaryDom.style.cssText = `${size}: ${this.foldSize}px`
            setTimeout(() => {
                this.secondaryDom.classList.remove(this.previewClassName)
            })
        } else { // 当次板块内容不显示时，点击展开显示内容。尺寸还原
            let str = size.replace(size[0], size[0].toUpperCase())
            let secondarySize = `secondary${str}` // secondaryWidth, secondaryHeight
            this.secondaryDom.classList.add(this.previewClassName)
            this.secondaryDom.style.cssText = `${size}: ${this[secondarySize]}`
        }

        document.querySelector(`.${this.previewClassName}`).style[`${direction}`] = 0   // 设置展开时预览窗口的位置
    }
    // 解决不可拖拽时，按钮可拖拽的问题
    onDragStart = () => {
        let primaryMinSize, secondaryMinSize
        const { visibleFold } = this.state
        if (visibleFold) { // 当显示折叠面板的时候，设置主板块和次板块的尺寸，使之不能拖拽
            primaryMinSize = this.splitterSize - splitterLineSize - this.foldSize
            secondaryMinSize = this.foldSize
        } else {
            primaryMinSize = this.props.primaryMinSize
            secondaryMinSize = this.props.secondaryMinSize
        }
        this.setState({ primaryMinSize, secondaryMinSize })
        this.props.onDragStart && this.props.onDragStart()
    }
    getSplitterSize = () => {
        const { vertical } = this.props
        if (vertical) {
            this.splitterSize = this.splitter.current.container.clientHeight
        } else {
            this.splitterSize = this.splitter.current.container.clientWidth
        }
    }
    componentDidMount() {
        this.getSplitterSize()   // 获取主板块次板块分割线一共占据的尺寸
        this.addSplitterButton() // 分割线上增加按钮
    }
    componentWillUnmount() {
        let num, str, flag
        const { vertical, storageName } = this.props
        if (vertical) { flag = 'height' } else { flag = 'width' }
        localStorage.setItem(storageName, parseInt(this.secondaryDom.style[flag]))
    }
    render() {
        const { vertical, foldText, showFold } = this.props
        const { primaryMinSize, secondaryMinSize, secondaryInitialSize, secondaryIndex, visibleFold, visibleContent } = this.state
        const childrenArr = React.Children.toArray(this.props.children)
        const itemClassNames = classNames('splitter-item', vertical ? 'splitter-vertical' : 'splitter-horizontal')
        // 主板块内容一直显示；当点击收齐时，次板块内容不显示。
        const visibleChildren0 = (secondaryIndex === 1 || (secondaryIndex === 0 && visibleContent))
        const visibleChildren1 = (secondaryIndex === 0 || (secondaryIndex === 1 && visibleContent))
        return (
            <SplitterLayout
                {...this.props}
                primaryMinSize={primaryMinSize}
                secondaryMinSize={secondaryMinSize}
                secondaryInitialSize={secondaryInitialSize}
                onDragStart={this.onDragStart}
                customClassName={this.props.customClassName ? `splitter-componented ${this.props.customClassName}` : 'splitter-componented'}
                ref={this.splitter}
            >
                <div className={itemClassNames}>
                    {
                        showFold
                        &&
                        <>
                            {secondaryIndex === 0 && visibleFold && !vertical && <div className="fold-panel fold-panel-left" onClick={() => this.onFold('left')}>
                                <Icon type="double-right" />
                                {foldText && <p>{foldText}</p>}
                            </div>}
                            {secondaryIndex === 0 && visibleFold && vertical && <div className="fold-panel fold-panel-top" onClick={() => this.onFold('top')}>
                                <Icon type="double-right" />
                                {foldText && <p>{foldText}</p>}
                            </div>}
                        </>
                    }
                    {visibleChildren0 && childrenArr[0]}
                </div>
                <div className={itemClassNames}>
                    {visibleChildren1 && childrenArr[1]}
                    {
                        showFold
                        &&
                        <>
                            {secondaryIndex === 1 && visibleFold && !vertical && <div className="fold-panel fold-panel-right" onClick={() => this.onFold('right')}>
                                <Icon type="double-left" />
                                {foldText && <p>{foldText}</p>}
                            </div>}
                            {secondaryIndex === 1 && visibleFold && vertical && <div className="fold-panel fold-panel-bottom" onClick={() => this.onFold('bottom')}>
                                <Icon type="double-left" />
                                {foldText && <p>{foldText}</p>}
                            </div>}
                        </>
                    }
                </div>
            </SplitterLayout>
        );
    }
}

Splitter.propTypes = {
    showFold: PropTypes.bool,
    storageName: PropTypes.string,
    foldText: PropTypes.string,
}
