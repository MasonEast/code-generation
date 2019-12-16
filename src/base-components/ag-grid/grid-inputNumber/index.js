/*
 * @Descripttion: AgGrid 数字输入框(单元格编辑)
 * @Author: sunjiaojiao 
 * @Date: 2019-11-22 17:28:10 
 * @LastEditors:   sunjiaojiao 
 * @LastEditTime: 2019-11-22 17:28:10 
 */

import React, {Component} from "react";
import { InputNumber,Row ,Col,Icon } from 'antd'

export class GridInputNumber extends Component {
  constructor(props) {
    super(props);
    this.state = {
      value: this.props.value
    };
  }
  //cell render 时，取值是当前的value
  getValue() {
    return this.state.value;
  }
  setValue(value){
    this.setState({ value })
    this.props.node.setDataValue(value);  //改变行数据对应的value
  }
  onChange = (value) => {
    const { onChange } = this.props;
    this.setValue(value);
    onChange && onChange(value)
  }

  render() {
    return (<InputNumber
      {...this.props}
      size= "small"
      min ={1}
      onChange={this.onChange}
      value={this.state.value}
    />)
  }
};

export class GridInputNumberRender extends Component {
  constructor(props) {
    super(props);
    this.state = {
      value: this.props.value
    }
  }
  refresh(props) {
    this.setState({value:props.value});
  }
  render() {
    console.log(this.props.saveBtnShow)
    return (
    <Row className="center-tab-panel-column">
      <Col span={12}>
       {this.state.value}
      </Col>
      <Col span={12} style={{textAlign:'right'}}>
      {this.props.column.colDef.editable && <Icon type="edit"/>}
      </Col>
   </Row>
    )
  }
};