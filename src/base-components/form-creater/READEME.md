#  FormCreater
一个基于`Antd Form`二次封装的表单组件，主要功能用法与`Antd Form`完全一致，仅做了配置化处理

##  为什么二次封装Form
1、解决一个业务逻辑块内多个`form`表单获取值麻烦的问题 <br/>
2、简化`form`表单内展现多个元素时，重复编写Dom模块的问题，目前改为配置化 <br/>
3、统一管理表单Dom展现、逻辑处理等操作

##  API
FormCreater
## 使用方法
Option|default|type|Description
:----:|:-----:|:--:|:------:
formOptions|{ }|object|对应Antd [Form 配置](https://ant.design/components/form-cn/#Form)
formCreatOptions|{ }|object|对应Antd [Form.create(options)配置](https://ant.design/components/form-cn/#Form.create(options))
formItems|[ ]|array| 以数组形式整合formItem的配置（详见<a href="#formItems">formItems配置</a>）
formData| { }|object| {fieldName: value} 设置表单元素的值（不是默认值），这意味着FormCreater组件将变成<b>受控组件</b>，每次render需要传入对应的formData值(<span style='color: red'>请尽量避免使用此属性，否则会有较大的计算开销</span>)

>注意：formCreater是使用From.create(options)方法加工后的，ref在这里失效，获取ref请使用 wrappedComponentRef，[点击这里查看文档](https://ant.design/components/form-cn/#Form.create(options))

#### <a name='formItems'>formItems 配置</a>
每个子元素是一个对象，用来配置Antd Form中FormItem组件的相关内容
Option|default|type|Description
:----:|:-----:|:--:|:------:
itemOptions|{ }|object| 对应Antd [Form.Item](https://ant.design/components/form-cn/#Form.Item)
fieldDecoratorParams|[ ]|array| 对应Antd Form 中[getFieldDecorator(id, options) 参数](https://ant.design/components/form-cn/#getFieldDecorator(id,-options)-%E5%8F%82%E6%95%B0)<br/>如果不配置此项，则表示此表单元素不被form接管<br/>配置则表示由form接管，子元素与`getFieldDecorator`参数一致
element|null|ReactNode| From 表单要渲染的元素
notFormElement| false |boolean| true则表示不使用任何form表单结构，false则表示使用FromItem结构
parentNode | null | object | 设置Form.Item的父级元素，详见<a href="parentNode">parentNode配置</a>
>提示：formItems可在对象内嵌套使用，例：
```
formItems: [{
  ...
  parentNode: {
    tag: Row,
    span: 12
  },
  formItems: [{
    ...
  }]
}]
```
#### <a name='parentNode'>parentNode配置</a>
Option|default|type|Description
:----:|:-----:|:--:|:------:
tag | null | string \| ReactNode | 设置元素标签，eg: 'div' \| Row
... | ... | ... | 相对于tag的标签属性配置，示例如下

```
{
  ...
  parentNode: {
    tag: 'div',
    className: 'my-class',
    style: {
      width: "100%",
      height: "20px"
    }
  }
}
// or
{
  ...
  parentNode: {
    tag: Col,       //antd栅格布局组件及对应属性
    span: 12,
    offset: 8,
    ...
  }
}
```
## demo示例
```
import React, { Component } from 'react';
import { Row, Col, Input } from 'antd';
import FormCreater from '/path/to/formCreater';
import Select2 from '/path/to/select2'

export default class FormCreaterDemo Component{
  constructor(props){
    super(props)
  }
  createFormItems = () => {
    return {
      formItems: [
        // formItems 嵌套示例
        {
          parentNode: { tag: Row },               // tag属性可使用antd栅格布局插件
          formItems: [{
            itemOptions: {
              label: '店铺名称'
            },  
            parentNode: { tag: Col, span: 12 },    // 其他属性根据tag的不同，做相应改变
            fieldDecoratorParams: ['shopId', { rules: [{required: true, message: 'required'}] }],
            element: <Input />
          },{
            itemOptions: {
              label: '平台单号'
            },
            parentNode: { tag: Col, span: 12 },   // element 可使用二次封装的插件
            fieldDecoratorParams: ['code', { rules: [{required: true, message: 'required'}] }],
            element: <Selec2 url="/path/to/fetch" allowClear optionField={{ value: 'id', text: 'code'}} />
          },
          ...
          ]
        },
        // 非嵌套使用
        {
          itemOptions: {
            label: '会员名称'
          },
          fieldDecoratorParams: ['vipName',{ rules: [{required: true}] }],
          element: <Input placeholder='会员名称' />
        },
        // 非嵌套使用---添加外层父元素
        {
          parentNode: {
            tag: 'div',
            className: 'my-class',
            style: {
              width: "100%",
              height: '20px'
            }
          },
          itemOptions: {
            label: '仓库名称'
          },
          fieldDecoratorParams: [ 'platformCode' ],
          element: <Input />
        },
        // 使用antd 定义的Form.Item样式，form不接管此输入表单, 即不配置fieldDecoratorParams参数即可
        {
          itemOptions: {
            label: 'form未接管'
          },
          element: <Input />
        },
        // 不使用Form的任何样式，form也不接管此输入表单, 仅为写在form元素内的普通标签
        {
          notFormElement: true,
          element: <Input />
        }
      ]
    }
  }
  // 获取FormCreater实例
  submitForm = () => {
    const { form } = this.formCreaterDemoRef.props;
    form.validateFields((err, values) => {
      if (err) { return; }
      console.log(values)
    });
    form.resetFields()
  }
  render(){
    retrun (<div>
      <FormCreater wrappedComponentRef={c=>this.formCreaterDemoRef=c} {...this.createFormItems()} ></FormCreater>
      <Button onClick={this.submitForm}>提交</Button>
    </div>)
  }
}
```