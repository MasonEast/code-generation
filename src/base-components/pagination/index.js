import React, { Component } from 'react';
import CerpPagination from './cerp-pagination';
import AntdPagination from './antd-pagination';

export default class Pagination extends Component{
  constructor(props){
    super(props);
  }

  render(){
    const {type} = this.props;
    return type == 'cerp'?<CerpPagination {...this.props}/>:<AntdPagination {...this.props}/>;
  }
}
