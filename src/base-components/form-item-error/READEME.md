#  FormItemError
基于antd Tooltip + Icon封装，在表单项校验失败时提示信息
> 注意：此组件使用定位样式，将 antd 默认的验证信息定位到表单尾部，可能会导致原本该被验证元素撑起的高度失效，从而导致 DOM 样式变动，只影响当前使用的 formItem 项。

##  API
FormItemError
## 使用方法
Option|default|type|Description
:----:|:-----:|:--:|:------:
text|''| string \| ReactNode | 校验信息文本
iconType| 'exclamation-circle' |string| antd icon 图标类型
placement| 'bottom' |string| 气泡框位置，可选 `top` `left` `right` `bottom` `topLeft` `topRight` `bottomLeft` `bottomRight` `leftTop` `leftBottom` `rightTop` `rightBottom`
overlayClassName| '' |string| 同 ToolTip 属性 `overlayClassName`
inputType| '' | string | 解决select下拉图标和校验图标重叠问题，默认input，可输入select，有需要后期可增加
## demo示例
```
import FormItemError from 'path/to/form-item-error';
...
// 基本用法
<FormItem label='text'>
    {getFieldDecorator(`waveName`, {
        rules: [ { required: true, message: <FormItemError text="必填项不能为空" /> } ],
    })(<Input />)}
</FormItem>
...

// 改变Tooltip背景色等
<FormItem label='text'>
    {getFieldDecorator(`waveName`, {
        rules: [ { required: true, message: <FormItemError overlayClassName='my-class' text="必填项不能为空" /> } ],
    })(<Input />)}
</FormItem>

// ---less---
@bg-color: red;
.my-class{
  .ant-tooltip-arrow::before{
    background-color: @bg-color;
  }
  .ant-tooltip-inner{
    background-color: @bg-color;
    color: blue;
  }
}
```