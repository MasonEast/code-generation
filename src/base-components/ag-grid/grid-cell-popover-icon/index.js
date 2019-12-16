import React, { Component } from "react";
import PropTypes from 'prop-types';
import { Popover, Row, Col, Input, Button } from 'antd'
import FormCreater from '../../form-creater';
import SelectChin from '../../../pages/homePage/orderDetail/cascader'
import Error from '../../form-item-error';
import '../grid-cell-trigger-icon/gridCellTriggerIcon.less'

class GridCellPopOverIcon extends Component {
  static propTypes = {
    icon: PropTypes.element,
  }
  constructor(props) {
    super(props);
    this.selectChinOption = null;
    const { value, icon } = props;
    this.state = {
      value,
      icon,
      popOverVisible: false
    }
  }
  refresh(params) {
    const {value} = params;
    this.setState({ value });
  }
  // 点击函数
  onClick = (onClick, e) => {
    this.setState({popOverVisible: true})
    if(onClick){
      onClick(this.props, e)
    }
  }
   // 气泡内地址保存修改
  editAddressSave = (e) => {
    e.preventDefault();
    const { form } = this.popOverAddressFormRef.props;
    form.validateFields({first: true}, (err, values) => {
      if (err) {
        return;
      }
      this.editAddressClose();
      // 测试是否可以带入到请求
      fetch("/test/path",{
          method: 'post',
          body: JSON.stringify(values),
      }).then(()=>{
          // 成功后重新渲染表格数据
      })
      // console.log(values, this.selectChinOption)
      this.props.node.setData({
        ...this.props.data,
        receiverName: values.receiverName,
        receiverMobileBlur: values.receiverMobileBlur,
        // receiverZip: 
      })
    });
}
  // 关闭地址修改气泡
  editAddressClose = () => {
    this.setState({popOverVisible: false})
  }
  formOptionInPopOver = () => {
    return {
        formOptions: {
            labelCol: {span: 8},
            wrapperCol: {span: 16},
            className: 'popover-form'
        },
        formItems: [
            {
                parentNode: {tag: Row},
                itemOptions: {
                    label:'所在地区',
                    labelCol: {span: 4},
                    wrapperCol: {span: 20}
                },
                fieldDecoratorParams: ['receiverZip',{ rules: [{required: true, message: <Error text="这里是中文验证信息" icon="exclamation-circle" />}] }],
                element: <SelectChin onChange={(val,opt)=>{this.selectChinOption = opt}} />
            },{
                parentNode: {tag: Row},
                itemOptions: {
                    label:'详细地址',
                    labelCol: {span: 4},
                    wrapperCol: {span: 20}
                },
                fieldDecoratorParams: ['detailAddress',{ rules: [{required: true, message: <Error text="这里是中文验证信息" icon="exclamation-circle" />}] }],
                element: <Input placeholder="到门牌号，如：2栋606室" />
            },
            {
                parentNode: {tag: Row},
                formItems: [{
                    parentNode: {tag: Col, span: 12},
                    itemOptions: {
                        label:'姓名'
                    },
                    fieldDecoratorParams: ['receiverName',{ rules: [{required: true, message: <Error text="这里是中文验证信息" icon="exclamation-circle" />}] }],
                    element: <Input />
                },{
                    parentNode: {tag: Col, span: 12},
                    itemOptions: {
                        label:'邮编'
                    },
                    fieldDecoratorParams: ['receiverMobileBlur'],
                    element: <Input />
                }]
            },
            {
                parentNode: {tag: Row},
                formItems: [{
                    parentNode: {tag: Col, span: 12},
                    itemOptions: {
                        label:'手机'
                    },
                    fieldDecoratorParams: ['mobileNum',{ rules: [{required: true, message: <Error text="这里是中文验证信息" icon="exclamation-circle" />}] }],
                    element: <Input />
                },{
                    parentNode: {tag: Col, span: 12},
                    itemOptions: {
                        label:'电话'
                    },
                    fieldDecoratorParams: ['phoneNum'],
                    element: <Input />
                }]
            },
            {
                parentNode: {tag: Row},
                itemOptions: {
                    wrapperCol: {span: 24}
                },
                fieldDecoratorParams: ['autoParseAddress'],
                element: <Input.TextArea placeholder="粘贴地址信息，自动拆分姓名、电话和地址" />
            },
            {
                notFormElement: true, //表示不使用任何form结构，true则仅element有效！默认为false
                element: <div className="auto-parse-btn"><Button type="link" size="small"><span className="iconfont icon-zhineng"></span>智能识别</Button></div>
            },
            {
                notFormElement: true, //表示不使用任何form结构，true则仅element有效！默认为false
                element: <div className="save-btn">
                    <Button onClick={this.editAddressClose}>取消</Button>
                    <Button type="primary" onClick={this.editAddressSave}>保存修改</Button>
                </div>
            },
        ],
    }
}
  createAddressPopOver = (data) => {
    return (<FormCreater wrappedComponentRef={f=>this.popOverAddressFormRef=f} {...this.formOptionInPopOver()} formData={data || {}} />)
  }
  handleVisibleChange = visible => {
    this.setState({popOverVisible: visible });
  };

  render() {
    const { value, icon } = this.state;
    if(this.props.data){
      this.props.data["receiverZip"] = ['110000']
    }
    return (<div className="cell-with-icon">
      <span>{value}</span>
      <Popover
        visible={this.state.popOverVisible} 
        overlayClassName="address-pop" 
        getPopupContainer={(triggerNode)=>{return document.querySelector('.ag-body-viewport')}} 
        placement="bottomRight" 
        autoAdjustOverflow={false} 
        arrowPointAtCenter={true} 
        content={this.createAddressPopOver.bind(this, this.props.data)()} 
        trigger="click" 
        onVisibleChange={this.handleVisibleChange}
      >
        { 
          icon && React.cloneElement(icon, {
            onClick: this.onClick.bind(this, icon.props.onClick)
          })
        }
      </Popover>
    </div>);
  }
};

export default GridCellPopOverIcon;