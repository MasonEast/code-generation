import React, { PureComponent, Component } from 'react';
import { Select } from 'antd'
import PropTypes from 'prop-types';
import { Fetch } from '../../utils'

class Select2 extends PureComponent{
  constructor(props){
    super(props)
    this.state = {
      optsData: null,
      selectVal: props.value
    }
    this.valueType = 'string'
    this.separator = '-'
  }
  //将props对象中的值映射到state
  static getDerivedStateFromProps(nextProps) {
    // Should be a controlled component.
    if ('value' in nextProps) {
      return {
        selectVal: nextProps.value,
      };
    }
    return null;
  }
  //重新加载select下拉项
  load(params){
    this.getSelectData(params);
  }
  componentDidMount(){
    this.getSelectData();
  }
  componentWillUnmount(){
    this.setState = () => { return }    // 清除异步操作
  }
  //远程获取下拉数据项，成功后设置state
  getSelectData = (params) => {
    const {url, requestOptions, defaultValue, dataOrigin} = this.props;
    if(!url){
      throw Error('url is required!');
    }
    if(params && requestOptions){
      requestOptions.body = params;
    }
    Fetch(url, requestOptions || {}).then(data => {
      const _data = dataOrigin ? data[dataOrigin] : data;
      
      if(_data instanceof Array){
        if(defaultValue){
          this.setState({optsData: _data, selectVal: defaultValue});
        }else{
          this.setState({optsData: _data})
        }
      }else{
        console.log(`%c data origin must be an Array, but rececived ${Object.prototype.toString.call(_data)}`, 'color: red')
      }
    })
  }
  //下拉选项改变
  selectOnChange = (selectVal, opt) => {
    if (!('value' in this.props)) {
      this.setState({ selectVal });
    }
    this.triggerChange( selectVal, opt );
  }
  //统一触发onChange函数
  triggerChange = (changedValue, opt) => {
    // Should provide an event to pass value to Form.
    const { onChange } = this.props;
    if (onChange) {
      const { optsData } = this.state;
      let record = null;
      //区分多选与单选情况
      if(opt instanceof Array){
        record = [];
        opt.map((item,i)=>{
          record.push(optsData[item.key])
        })
      }else if(opt instanceof Object){
        record = optsData[opt.key];
      }
      onChange(changedValue, opt, record);
    }
  };
  //根据不同数据格式生成下拉框的value
  createOptionValue = (opt, value, separator) =>{
    let _val = null;
    if(value instanceof Array && value.length > 0){
      _val = [];
      value.map((v,i)=>{
        _val.push(opt[v])
      })
      return _val.join(separator || '-')
    }
    return opt[value]
  }
  render(){
    const {optsData, selectVal} = this.state;
    const {optionField: {value,text,separator, textSeparator}, renderOptions} = this.props;

    return (<Select {...this.props} onChange={this.selectOnChange} value={selectVal}>
      {(!!optsData && optsData.length) && (!!renderOptions ? renderOptions(optsData, Select) : optsData.map((opt,i)=>{
        return <Select.Option key={i} value={this.createOptionValue(opt, value, separator)}>{this.createOptionValue(opt, text, textSeparator)}</Select.Option>
      }))}
    </Select>)
  }
}

Select2.propTypes = {
  url: PropTypes.string,                    //The URL we want to request
  requestOptions: PropTypes.object,         //The options we want to pass to "fetch"
  optionField: PropTypes.shape({            //定义下拉项展示的value值及名称
    value: PropTypes.oneOfType([            //value值
      PropTypes.string,
      PropTypes.array
    ]).isRequired,
    text: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.array
    ]).isRequired,                          // 下拉项显示的名称
    separator: PropTypes.string,            // 获取数据时分隔符
    textSeparator: PropTypes.string,
  }),
  dataOrigin: PropTypes.string,
  renderOptions: PropTypes.func
};

Select2.defaultProps = {
  url: '',
  requestOptions: {},
  optionField: {
    value: '',
    text: '',
    separator: '-'
  },
  dataOrigin: null
};

export default Select2;