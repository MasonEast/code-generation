在 antd modal 基础上，结合 react-rnd 使 modal 可拖拽和自定义拉伸。

#Props
minWidth?: number | string;
设置自定义拉伸最小的宽度，比如 300，'300px'

minHeight?: number | string;
设置自定义拉伸最小的高度，比如 300，'300px'

其它属性同 antd modal

#Instance API
refreshHeight()
异步更新内容区域的宽度。比如打开 modal 时，获取 modal 中的列表：
```js
</Button onClick={()=>{this.setState{visibleModal: true}, ()=>{
    this.setState({ visibleModal: true})
    setTimeout(()=>{
        this.setState({
            list:[1,2,3,4,5,6,7,8,9]
        },()=>{
            this.modaldrag.current.refreshHight() //异步加载完数据后，刷新一下高度
        })
    },1000)
    打开弹框
</Button>