import React, {Component} from "react";
import { DatePicker } from 'antd'
import moment from 'moment';

export class GridDatePicker extends Component {
  constructor(props) {
    super(props);
    this.state = {
      value: this.props.value?moment(this.props.value,this.props.format):null
    };
  }
  //cell render 时，取值是当前的value
  getValue = ()=> {
    const {value} = this.state;
    let newValue = null;
    if(value){
      newValue = this.state.value.clone();
      newValue._f = this.props.format;          //由于antd点击 '此刻/今天' 的格式中没有 "_f"这个属性
    }
    return newValue;
  }
  setValue(value,format){
    this.setState({ value: value?moment(value,format):null })
  }
  onChange = (value) => {
    const { format, onChange } = this.props;
    this.setValue(value,format);
    onChange && onChange(value)
  }
  onOk = (value) => {
    const { format, onOk } = this.props;
    this.setValue(value,format);
    onOk && onOk(value)
  }

  render() {
    return (<DatePicker {...this.props} value={this.state.value} onChange={this.onChange} onOk={this.onOk} />);
  }
};

export class GridDatePickerRender extends Component {
  constructor(props) {
    super(props);
    this.state = {
      value: this.props.value
    }
  }
  refresh(params) {
    const {value} = params;
    this.setState({value: value?moment(value).format(value._f):''});
  }

  render() {
    return (<div>{this.state.value}</div>);
  }
};