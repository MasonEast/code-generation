import React from "react";
import { Rnd } from "react-rnd";
import { Modal, Button, Icon } from 'antd';
import './index.less'

const headerHeight = 55,
      footerHeight = 53,
      paddingHeight = 24,
      defaultWidth = 520,       // modal 宽度默认值
      defaultHeight = 300,      // modal 高度默认值
      defaultMinWidth = 300,    // 自定义拉伸缩小的最小宽度默认值
      defaultMinHeight = 200,   // 自定义拉伸缩小的最小高度默认值
      defaultCancelText = '取消',
      defaultOkText = '确定'
      
class DragBody extends React.Component {
    constructor(props) {
        super();
        this.state = {
            x: 0,
            y: 0,
            isResizing: false,
            isDragging: false,
            width: props.width || defaultWidth,      // 内容区域的宽度
            height: props.height || defaultHeight,   // 内容区域的高度
            enableResizing: {  
                top: false, 
                right: true, 
                bottom: true, 
                left: false, 
                topRight: false,
                bottomRight: true, 
                bottomLeft: false, 
                topLeft: false 
            }
        };
        this.body = React.createRef()
    }

    onDrag = () => {
        if (!this.state.isDragging) {
            this.setState({ isDragging: true });
        }
    }
    onDragStop = (e, d) => {
        this.setState({ x: d.x, y: d.y, isDragging: false });
    }
    onResizeStart = () => {
        this.setState({ isResizing: true });
    }
    onResizeStop = (e, direction, ref, delta, position) => {
        this.setState({
            width: ref.style.width,
            height: ref.style.height,
            ...position,
            isResizing: false
        })
    }
    componentDidMount = () => {
        this.refreshHight()
    }
    // 初始化设置内容区域的高度, modal 的高度 = bodyHeight + paddingHeight + headerHeight + footerHeight
    refreshHight = () => {
        this.setState({
            height: this.body.current.clientHeight + headerHeight + footerHeight + paddingHeight * 2
        })
    }
    render() {
        const { isResizing, isDragging } = this.state;
        return (
            <Rnd
                className={{ 'rnd-resize': isResizing, 'rnd-drag': isDragging }}
                dragHandleClassName="rnd-modal-header"
                bounds="window"
                enableResizing={this.state.enableResizing}
                minWidth={this.props.minWidth || defaultMinWidth}
                minHeight={this.props.minHeight || defaultMinHeight} 
                size={{ width: this.state.width, height: this.state.height }}
                position={{ x: this.state.x, y: this.state.y }}
                onDrag={this.onDrag}
                onDragStop={(e, d) => this.onDragStop(e, d)}
                onResizeStart={this.onResizeStart}
                onResizeStop={(e, direction, ref, delta, position) => this.onResizeStop(e, direction, ref, delta, position)}               
            >
                <div
                    style={{
                        width: this.state.width,
                        height: this.state.height,
                        background: "#FFFFFF",
                    }}
                >
                    <div className="rnd-modal-header">
                        <div className="rnd-modal-title">{this.props.title}</div>
                        <Icon type="close" className="icon-close" onClick={this.props.onCancel}></Icon>
                    </div>
                    <div className="rnd-modal-container" style={{ display: isDragging ? "none" : "block", }}>
                        <div className="rnd-modal-body" style={{ height: `calc(${parseInt(this.state.height)}px - ${headerHeight}px - ${footerHeight}px - ${paddingHeight}px)` }} >
                            <div ref={this.body}>{this.props.children}</div>
                        </div>

                        <div className="rnd-modal-footer">
                            <Button onClick={this.props.onCancel}>{this.props.cancelText || defaultCancelText}</Button>
                            <Button type="primary" onClick={this.props.onOk}>{this.props.okText || defaultOkText}</Button>
                        </div>
                    </div>
                </div>
            </Rnd>
        )
    }
}

class DragModal extends React.Component {
    constructor(props){
        super(props);
        this.body = React.createRef()
    }

    refreshHight = () =>{
        if(this.body.current){
            this.body.current.refreshHight()
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
                wrapClassName={`rnd-move-modal ${this.props.wrapClassName}`}
            >
                <DragBody ref={this.body}  {...this.props} />
            </Modal>
        );
    }
}

export default DragModal
