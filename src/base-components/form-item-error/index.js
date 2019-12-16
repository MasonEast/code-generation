import React from 'react';
import { Tooltip, Icon } from 'antd';
import PropTypes from 'prop-types';
import './index.less'

export default class FormItemErrorPop extends React.Component{
  constructor(props){
    super(props)
    this.iconId = `icon-${new Date().getTime()}`;   // 唯一的id
  }
  componentDidMount(){
    // 一下做法目的：只改变当前使用组件的样式，不影响antd其他样式
    const selfErr = document.querySelector(`.ant-form-explain > .${this.iconId}`);
    const inputType = this.props.inputType;
    let rightPx = 0;
    switch (inputType) {
      case 'select':
          rightPx = 32;
        break;
      default:
          rightPx = 8;
        break;
    }
    if(!!selfErr){
      const style = {
        position: 'absolute',
        right: `${rightPx}px`,
        top: '0',
        transform: 'none',
        margin: '0',
        'line-height': 'unset',
        height: '100%'
      }
      for(let key in style){
        selfErr.parentElement.style[key] = style[key];
      }
    }
  }
  render(){
    const { text, iconType, placement, overlayClassName } = this.props;
    return <Tooltip placement={placement} title={text} className={this.iconId} overlayClassName={`overlay-error-form ${overlayClassName}`}>
      <Icon type={iconType} />
    </Tooltip>
  }
}

FormItemErrorPop.propTypes = {
  text: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.node
  ]),
  iconType: PropTypes.string,
  placement: PropTypes.string,
  overlayClassName: PropTypes.string
}

FormItemErrorPop.defaultProps = {
  text: '',
  iconType: 'exclamation-circle',
  placement: 'bottom',
  overlayClassName: ''
}