import React, { Component } from "react";
import PropTypes from 'prop-types';
import './gridCellTriggerIcon.less'

class GridCellTriggerIcon extends Component {
  static propTypes = {
    icon: PropTypes.element,
  }
  constructor(props) {
    super(props);
    const { value, icon } = props;
    this.state = {
      value,
      icon,
    }
  }
  refresh(params) {
    const {value} = params;
    this.setState({ value });
  }
  // 点击函数
  onClick = (onClick, e) => {
    if(onClick){
      onClick(this.props, e)
    }
  }

  render() {
    const { value, icon } = this.state;
    return (<div className="cell-with-icon">
      <span>{value}</span>
      { 
        icon && React.cloneElement(icon, {
          onClick: this.onClick.bind(this, icon.props.onClick)
        })
      }
    </div>);
  }
};

export default GridCellTriggerIcon;