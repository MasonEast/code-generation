import React, { Component } from "react";
import { Divider, Badge } from 'antd'
import PropTypes from 'prop-types';
import './gridGoodsDetail.less'

// const badgeStyle = {
//   backgroundColor: '#fff',
//   color: '#0265FF',
//   padding: '0 4px',
//   border: '1px solid #dce1e6',
//   height: '16px',
//   lineHeight: '15px',
//   transform: 'translate(-50%, -50%)',
// }

class GridGoodsDetail extends Component {
  static propTypes = {
    // icon: PropTypes.element,
  }
  constructor(props) {
    super(props);
    this.state = {
      value: props.value
    }
  }
  refresh(params) {
    const {value} = params;
    this.setState({ value });
  }
  render() {
    const { value } = this.state;
    // console.log(value)
    if(!value) return <div />;
    let sum = null, _value = null, imgW = (value.length > 1 ? 24 : 32);
    if(value.length > 3){
      sum = value.length;
      _value = value.splice(0,3);
    }else{
      _value = value;
    }
    
    return (<div className="grid-goods-detail">
      {_value.map((item,i)=>{
        return <div key={i} className="detail-item">
          {/* //不使用 Badge 组件的原因：默认显示在右上角，通过样式重设在左上角后，会出现一个跳动过度效果 */}
          {/* <Badge count={item.count} className="item-badge">
            <div className="item-img-block" style={{width: `${imgW}px`, height: `${imgW}px`}}>
              <img src={item.imgSrc} width={imgW} alt="error" />
              <div className="item-badge">{item.count}</div>
            </div>
          </Badge> */}
          <div className="item-img-block" style={{width: `${imgW}px`, height: `${imgW}px`}}>
            <img src={item.imgSrc} width={imgW} alt="error" />
            <div className="item-badge-self">{item.count}</div>
          </div>
          <Divider type="vertical" />
          <span>{`${item.skuCode} *${item.count}`}</span>
        </div>
      })}
      {sum ? <div className="detail-goods-sum"><span className="sum-num">{sum}</span></div> : null}
    </div>);
  }
};

export default GridGoodsDetail;