import React, {Component, useMemo} from 'react';
import { Form } from 'antd';
import PropTypes from 'prop-types';

class _FormCreater extends Component{
  constructor(props){
    super(props)
  }
  renderFormItem = (formItems, getFieldDecorator) => {
    return formItems && formItems.map((item,i)=>{
      const {itemOptions, fieldDecoratorParams, element, notFormElement } = item;
      if(notFormElement && typeof notFormElement != 'boolean'){
        throw Error('Warning: Failed type: `notFormElement` expected `boolean`.')
      }
      if(!notFormElement){
        //Form.Item 元素
        const _formItem = <Form.Item key={i} {...itemOptions || {}}>
          {fieldDecoratorParams && getFieldDecorator(...fieldDecoratorParams)(
            element
          )}
          {!fieldDecoratorParams && element}
        </Form.Item>
        //Form.Item外的第一级父元素
        if(item.parentNode){
          const parentNodeOption = Object.assign({},item.parentNode);
          delete parentNodeOption.tag;
          return (<item.parentNode.tag {...parentNodeOption} key={i}>
            { item.formItems?this.renderFormItem(item.formItems,getFieldDecorator):_formItem}
          </item.parentNode.tag>)
        }
        return _formItem
      }else{
        return React.cloneElement(element,{key:i})
      }
    })
  }
  render(){
    const {form: {getFieldDecorator}, formOptions, formItems} = this.props;
    return(<Form {...formOptions}>
      {formItems.items?'':this.renderFormItem(formItems,getFieldDecorator)}
    </Form>)
  }
}

_FormCreater.propTypes = {
  formCreatOptions: PropTypes.object,
  formOptions: PropTypes.object,
  formItems: PropTypes.arrayOf(PropTypes.shape({
    itemOptions: PropTypes.object,
    fieldDecoratorParams: PropTypes.array,
    element: PropTypes.element,
    notFormElement: PropTypes.bool,
    parentNode: PropTypes.object
  })),
};

// class Index extends Component{
//   constructor(props){
//     super(props);
//     this.FormCreater = Form.create(this.handleFormCreatOpts(props || {}))(_FormCreater);
//   }
//   handleFormCreatOpts = () => {
//     const props = this.props;
//     let { formCreatOptions } = props;
//     if(!formCreatOptions){
//       formCreatOptions = {}
//     }
//     if(typeof formCreatOptions.mapPropsToFields == 'function'){
//       return formCreatOptions
//     }
//     let mapProps = {};
//     console.log(props.formData)
//     if('formData' in props && props.formData){
//       mapProps = {
//         mapPropsToFields: (props) => {  //如果传入 fromData 参数，则自动将值映射到对应表单
//           const {formData} = props;
//           const _fromInitialData = {};
//           if(formData){
//             Object.keys(formData).map((k,i)=>{
//               _fromInitialData[k] = Form.createFormField({value: formData[k]})
//             })
//           }
//           return _fromInitialData;
//         }
//       }
//     }
//     return {
//       ...formCreatOptions,
//       ...mapProps
//     }
//   }
//   //对外暴漏传入的输入对象
//   getFormCreaterData = () => {
//     return this.props.formData;
//   }
//   render(){
//     const FormCreater = this.FormCreater;
//     return <FormCreater {...this.props} />
//   }
// }

const Index = (props) => {
  const handleFormCreatOpts = (props) => {
    let { formCreatOptions } = props;
    if(!formCreatOptions){
      formCreatOptions = {}
    }
    if(typeof formCreatOptions.mapPropsToFields == 'function'){
      return formCreatOptions
    }
    let mapProps = {};
    if('formData' in props && props.formData){
      mapProps = {
        mapPropsToFields: (props) => {  //如果传入 fromData 参数，则自动将值映射到对应表单
          const {formData} = props;
          const _fromInitialData = {};
          if(formData){
            Object.keys(formData).map((k,i)=>{
              _fromInitialData[k] = Form.createFormField({value: formData[k]})
            })
          }
          return _fromInitialData;
        }
      }
    }
    return {
      ...formCreatOptions,
      ...mapProps
    }
  }

  const FormCreater = Form.create(handleFormCreatOpts(props || {}))(_FormCreater);
  return <FormCreater {...props} />;
}

export default Index;