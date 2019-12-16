在 antd modal 基础上，结合 react-rnd 使 modal 可拖拽和自定义拉伸。
# Usage
在 antd Modal 上增加了拖拽和自定义拉伸功能，其它 props 和使用方法同 antd Modal
```js
import Modal from '_baseComponents/modal'
<Modal
    width={1016}
    title="title"
    wrapClassName="wrapClassName"
    visible={visible}
    onCancel={onCancel}
    footer={...}
    ref={ref => this.modal = ref}
>
    <div>content<div>
</Modal>
```

# Props
除了 antd Modal 的 props 外，其它的 props 有：

height?: number | string;
modal 默认的高度

minWidth?: number | string;
设置自定义拉伸最小的宽度，比如 300，'300px'

minHeight?: number | string;
设置自定义拉伸最小的高度，比如 300，'300px'

# Instance API
refreshHeight()
异步更新内容区域的宽度。比如打开 modal 时，获取 modal 中的列表：
```js
<Button onClick={()=>{this.setState{visibleModal: true}, ()=>{
    this.setState({ visibleModal: true})
    setTimeout(()=>{
        this.setState({
            list:[1,2,3,4,5,6,7,8,9]
        },()=>{
            this.modal.current.refreshHeight() //异步加载完数据后，刷新一下高度
        })
    },1000)
    打开弹框
</Button>
```
其它拖拽拉伸事件属性等 API 参考 https://github.com/bokuweb/react-rnd
