import React, {Component} from "react";
import { Select } from 'antd';
import Select2 from '../../select-async'

export class GridSelect extends Component {
  constructor(props) {
    super(props);
    this.state = {
      value: this.props.value,
      valName: this.props.value
    };
  }
  //cell render 时，取值是当前的value
  getValue() {
    return this.state.valName;
  }
  setValue(value, valName){
    this.setState({ value, valName })
    this.props.node.setDataValue(this.props.colDef.selfId, value);     //改变行数据对应下拉框选项的id
  }
  onChange = (value,opt) => {
    const { onChange } = this.props;
    this.setValue(value, opt.props.children);
    onChange && onChange(value, opt)
  }

  render() {
    const { url, optionField, sourceData } = this.props;
    const { value, text } = optionField;
    return (!!url ? 
    <Select2
      {...this.props}
      onChange={this.onChange}
      value={this.state.value}
    /> :
    <Select
      {...this.props}
      onChange={this.onChange}
      value={this.state.value}
    >
      {!!sourceData && sourceData.map((opt, i) => {
        return <Select.Option key={i} value={opt[value]}>{opt[text]}</Select.Option>
      })}
    </Select>)
  }
};

export class GridSelectRender extends Component {
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
    return (<div>{this.state.value}</div>);
  }
};