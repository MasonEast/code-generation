左右拖拽分割为两块布局，Splitter 传入多个子元素只生效前两个。
# Dependencies
依赖 React，react-splitter-layout
# Usage
```js
import Splitter from '_baseComponents/splitter'
<Splitter>
    <Content1 />
    <Content2 />
</Splitter>
```
#props 
customClassName: PropTypes.string 
最外层 div 的className。

showFold: PropTypes.bool
是否需要显示折叠预览面板，默认 false。

storageName: PropTypes.string 
存储在 localStorage 尺寸的 key 值。如果需要持久化尺寸需要传的属性。

vertical: PropTypes.bool
设置是水平方向还是垂直方向。默认 false 水平方向分割为两个。

primaryIndex: PropTypes.number
设置主板块的索引。可传 0，1。默认是 0 即第一个子元素为主板块。

primaryMinSize: PropTypes.number
主板块的最小尺寸，默认是 0。

secondaryMinSize: PropTypes.number
次板块的最小尺寸。

secondaryInitialSize: PropTypes.number
次板块的尺寸，不传的话 Splitter 尝试将两块宽度等分。

percentage: PropTypes.bool
设置每一块的宽度单位是百分比还是像素，默认是 false，width 单位为 px。

onDragStart: PropTypes.func
拖拽开始的回调。

onDragEnd: PropTypes.func
拖拽结束的回调。

onSecondaryPaneSizeChange: PropTypes.func
当次板块尺寸变化时的回调。

属性来自 react-splitter-layout ：https://github.com/zesik/react-splitter-layout