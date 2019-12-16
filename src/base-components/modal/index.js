import React from "react"
import { Rnd } from "react-rnd"
import { Modal, Button, Icon } from 'antd'
import PropTypes from 'prop-types'
import './index.less'

const headerHeight = 54,
      footerHeight = 53;

class DragBody extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            x: 0,
            y: 0,
            isResizing: false,       // 是否正在拉伸
            isDragging: false,       // 是否正在拖拽
            width: props.width,      // 内容区域的宽度
            height: parseInt(props.height),    // 内容区域的高度
        }
        this.body = React.createRef()
    }
    onDrag = () => {
        if (!this.state.isDragging) { this.setState({ isDragging: true }) }
        this.props.onDrag && this.props.onDrag()
    }
    onDragStop = (e, d) => {
        this.setState({ x: d.x, y: d.y, isDragging: false })
        this.props.onDragStop && this.props.onDragStop() 
    }
    onResizeStart = () => {
        this.setState({ isResizing: true })
        this.props.onResizeStart && this.props.onResizeStart() 
    }
    onResize = (e, direction, ref, delta, position) => {
        this.setState({
            // width: ref.style.width,
            // height: ref.style.height,
            ...position,
            isResizing: true
        })
        this.props.onResize && this.props.onResize() 
    }
    onResizeStop = (e, direction, ref, delta, position) => {
        this.setState({
            width: ref.style.width,
            height: ref.style.height,
            ...position,
            isResizing: false
        })
        this.props.onResizeStop && this.props.onResizeStop() 
    }
    componentDidMount = () => {
        this.refreshHeight()
    }
    // 如果没有 modal 没有传入高度，modal 的高度自动撑开 = bodyHeight + headerHeight + footerHeight
    refreshHeight = () => {
        if (!this.state.height) {
            this.setState({
                height: this.body.current.clientHeight + headerHeight + footerHeight
            })
        }
    }
    render() {
        const { x, y, width, height, isResizing, isDragging } = this.state
        const { minWidth, minHeight, title, enableResizing, onCancel, cancelText, onOk, okText, footer } = this.props
        return (
            <Rnd
                className={{ 'rnd-resize': isResizing, 'rnd-drag': isDragging }}
                dragHandleClassName="rnd-modal-header"
                bounds="window"
                enableResizing={enableResizing}
                minWidth={minWidth}
                minHeight={minHeight}
                size={{ width, height }}
                position={{ x, y }}
                onDrag={this.onDrag}
                onDragStop={(e, d) => this.onDragStop(e, d)}
                onResize={this.onResize}
                onResizeStart={this.onResizeStart}
                onResizeStop={(e, direction, ref, delta, position) => this.onResizeStop(e, direction, ref, delta, position)}
            >
                <div
                    style={{
                        width,
                        height,
                        background: "#FFFFFF",
                    }}
                >
                    <div className="rnd-modal-header">
                        <div className="rnd-modal-title">{title}</div>
                        <Icon type="close" className="icon-close" onClick={onCancel}></Icon>
                    </div>
                    <div className="rnd-modal-container" style={{ display: isDragging ? "none" : "block", }}>
                        <div className="rnd-modal-body" style={{ height: `calc(${parseInt(height)}px - ${headerHeight}px - ${footerHeight}px` }}>
                            <div ref={this.body}>{this.props.children}</div>
                        </div>

                        {footer
                            ? <div className="rnd-modal-footer">{footer}</div>
                            : <div className="rnd-modal-footer">
                                <Button onClick={onCancel}>{cancelText}</Button>
                                <Button type="primary" onClick={onOk}>{okText}</Button>
                            </div>
                        }
                    </div>
                </div>
            </Rnd>
        )
    }
}

class DragModal extends React.Component {
    constructor(props) {
        super(props)
        this.body = React.createRef()
    }

    refreshHeight = () => {
        if (this.body.current) {
            this.body.current.refreshHeight()
        }
    }
    render() {
        return (
            <Modal
                {...this.props}
                closable={null}
                footer={null}
                title={null}
                destroyOnClose={true}
                wrapClassName={this.props.wrapClassName ?  `rnd-move-modal ${this.props.wrapClassName}` : 'rnd-move-modal'}
            >
                <DragBody ref={this.body}  {...this.props} />
            </Modal>
        )
    }
}

DragModal.defaultProps = {
    cancelText: '取消',
    okText: '确定',
    width: 520,        // modal  宽度默认值
    height: 0,         // modal 高度默认值0，即由内容自动撑开。
    minWidth: 300,     // 自定义拉伸缩小的最小宽度默认值
    minHeight: 200,    // 自定义拉伸缩小的最小高度默认值
    enableResizing: {   // 可拉伸的方向
        top: true,
        right: true,
        bottom: true,
        left: true,
        topRight: true,
        bottomRight: true,
        bottomLeft: true,
        topLeft: true
    }
}

DragModal.propTypes = {
    refreshHeight: PropTypes.func
}

export default DragModal
