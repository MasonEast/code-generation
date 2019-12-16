import React, { Component } from 'react';
import {Icon, Select, message} from 'antd/lib/index'
import PropTypes from 'prop-types'
import './index.less'

class Pagination extends Component{
    constructor(props){
        super(props);
        this.state={
            page:props.page,                                                    // 显示当前在第几页
            pageSizeOptions:props.pageSizeOptions,                              // 可选的每页大小数组
            pageSize:props.pageSize||props.pageSizeOptions[0],                  // 每页大小
            total:props.total,                                                  // 真实总条数
        }
    }

    static defaultProps = {
        page:1,
        total:null,
        pageSizeOptions: [50,100,200,500]
    }

    static propTypes = {
        page:PropTypes.number,
        total:PropTypes.number,
        onPageSizeChange: PropTypes.func,
        onPageChange: PropTypes.func,
    }


    // 改变每页大小 理论上当前页不变 但是如果 pageSize*page>total 则需要重新计算当前页 Select回调  （重点）
    onPageSizeChange = (pageSize) => {
        const {onPageSizeChange,total} = this.props;
        let {page} = this.state;
        if(total&&pageSize*page>total){
            page = Math.ceil(total/pageSize);
        }
        this.setState({page,pageSize});
        if(onPageSizeChange){
            onPageSizeChange(page,pageSize);
        }
    }

    // 上一页
    onPrev = () => {
        const {page,pageSize} = this.state;
        const {onPageChange} = this.props;
        if(page <= 1) {message.warning('已是第一页！');return}
        this.setState({page:page-1},()=>{
            if(onPageChange){
                onPageChange(page-1,pageSize);
            }
        })
    }

    // 下一页
    onNext = () => {
        const {page,pageSize} = this.state;
        const {total,onPageChange} = this.props;
        const totalPage = Math.ceil(total/pageSize);
        if( totalPage && page == totalPage ){message.warning('已是最后一页！');return}
        this.setState({page:page + 1},()=>{
            if(onPageChange){
                onPageChange(page+1,pageSize);
            }
        })
    }

    // 跳到第一页
    onFirst = () => {
        const {page,pageSize} = this.state;
        const {onPageChange} = this.props;
        if(page == 1) {message.warning('已是第一页！');return}
        this.setState({page:1},()=>{
            if(onPageChange){
                onPageChange(1,pageSize);
            }
        })
    }

    // 跳到最后一页 (重点）
    onLast = () => {
        const {page,pageSize} = this.state;
        const {total,onPageChange} = this.props;
        // 检验当前是否为最后一页
        const totalPage = Math.ceil(total/pageSize);
        if( totalPage && page == totalPage ){message.warning('已是最后一页！');return}

        const pageLast = Math.ceil(total/pageSize);
        this.setState({page:pageLast},()=>{
            if(onPageChange){
                onPageChange(pageLast,pageSize);
            }
        })
    }

    render(){
        const {page,pageSizeOptions,pageSize} = this.state;
        const {total} = this.props;

        const totalPage = Math.ceil(total/pageSize);

        return (<div className="antd-pagination" style={{textAlign:'right'}}>
            <div>
                <span>每页记录条数</span>
                <Select
                    size="small"
                    style={{width:55,marginLeft:10}}
                    value={pageSize}
                    onChange={this.onPageSizeChange}
                >
                    {pageSizeOptions.map((item,i)=>{return <Select.Option key={i} value={item}>{item}</Select.Option>})}
                </Select>
            </div>

            <div className="page-total-page" style={{marginLeft:10}}>
                <span className="text-middle">共{total}条</span>
                <span className="text-middle" style={{marginLeft:10}}>{page}/{totalPage}页</span>
            </div>
            <div className="page-jump-to" style={{marginLeft:20}}>
                <Icon type="step-backward" title="第一页" onClick={this.onFirst} />
                <Icon type="caret-left" title="上一页" onClick={this.onPrev} />
                <Icon type="caret-right" title="下一页" onClick={this.onNext} />
                <Icon type="step-forward" title="最后页" onClick={this.onLast} />
            </div>
        </div>)
    }
}

export default Pagination;