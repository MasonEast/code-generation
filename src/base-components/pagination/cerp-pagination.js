import React, { Component } from 'react';
import {Icon, Select, Input, message} from 'antd/lib/index'
import PropTypes from 'prop-types'
import './index.less'

class Pagination extends Component{
    constructor(props){
        super(props);
        this.state={
            page:props.page,                                        // 显示当前在第几页
            pageSizeOptions:props.pageSizeOptions,                  // 可选的每页大小数组
            pageSize:props.pageSize||props.pageSizeOptions[0],      // 每页大小
            total:props.total,                                      // 真实总条数
        }
    }

    static defaultProps = {
        page:1,
        total:null,
        falseTotal:1000000,
        pageSizeOptions: [50,100,200,500]
    }

    static propTypes = {
        page:PropTypes.number,
        total:PropTypes.number,
        falseTotal:PropTypes.number,
        onPageSizeChange: PropTypes.func,
        onPageChange: PropTypes.func,
        refreshTotal: PropTypes.func,
    }

    componentWillReceiveProps(nextProps, nextContext) {
        const {total,falseTotal,onPageChange,pageSize,page} = nextProps;
        //（如果不是最后页 total始终为1000000）（如果当前页是最后页 total为真实总条数）
        if(this.props.page == page && this.props.pageSize == pageSize) return false;
        if(total&&total!=falseTotal){
            let page = Math.ceil(total/this.state.pageSize);
            this.setState({page},()=>{
                if(onPageChange){
                    onPageChange(page,pageSize);
                }
            });
        }
    }

    // 改变每页大小 理论上当前页不变 但是如果 pageSize*page>total 则需要重新计算当前页 Select回调  （重点）
    onPageSizeChange = (pageSize) => {
        const {onPageSizeChange,total,falseTotal} = this.props;
        let {page} = this.state;
        if(total&&total!=falseTotal&&pageSize*page>total){
            page = Math.ceil(total/pageSize);
        }
        this.setState({page,pageSize},()=>{
            if(onPageSizeChange){
                onPageSizeChange(page,pageSize);
            }
        });

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
        const {total,onPageChange,falseTotal} = this.props;
        // 检验当前是否为最后一页
        const totalPage = Math.ceil(total/pageSize);
        if( totalPage && page == totalPage ){message.warning('已是最后一页！');return}

        // 跳至最后页 使用falseTotal作为总页数 但是不需要将总页数显示
        const pageLast = Math.ceil(falseTotal/pageSize);
        if(onPageChange){
            onPageChange(pageLast,pageSize);
        }
    }

    // 输入第几页页码
    onInputPage = (e) => {
        e.preventDefault();
        let page = e.currentTarget.value;
        if(page >= 0){
            this.setState({page});
        }
    }

    // 回车查找输入页的数据 （重点）
    onPagePressEnter = (e) =>{
        e.preventDefault();
        const {pageSize} = this.state;
        const {total,onPageChange,falseTotal} = this.props;
        const totalPage = Math.ceil(total/pageSize);
        let page = e.currentTarget.value - 0;

        if(totalPage&&total!=falseTotal){
            if(page > totalPage){
                this.setState({page: totalPage},()=>{
                    if(onPageChange){
                        onPageChange(totalPage,pageSize)
                    }
                })
                message.warning("已设置为最大页数")
                return;
            }else if(page == totalPage){
                return;
            }else if(page < totalPage){
                if(page <= 1){
                    page = 1
                }
            }
        }

        if(page){
            this.setState({page},()=>{
                if(onPageChange){
                    onPageChange(page,pageSize)
                }
            });
        }else{
            this.setState({page: ''});
            message.warning("请输入正确的页数!")
        }
    }

    // 刷新获取总条数
    onRefreshTotal = () => {
        const {refreshTotal} = this.props;
        if(refreshTotal){
            refreshTotal().then(total=>{
                if(total){
                    this.setState({total});
                }
            });
        }
    }

    render(){
        const {page,pageSizeOptions,pageSize,total} = this.state;

        const trueTotalPage = total?Math.ceil(total/pageSize):null;

        return (<div className="erp-pagination">
            <div>
                <Select
                    size="small"
                    style={{width:100}}
                    value={pageSize}
                    onChange={this.onPageSizeChange}
                >
                    {pageSizeOptions.map((item,i)=>{return <Select.Option key={i} value={item}>{item + '条/页'}</Select.Option>})}
                </Select>
            </div>
            <div className="page-jump-to">
                <Icon type="step-backward" title="第一页" onClick={this.onFirst} />
                <Icon type="caret-left" title="上一页" onClick={this.onPrev} />
                <span>
          第 <Input
                    // ref={input => this.pageInput = input} />
                    size='small'
                    style={{width:'50px'}}
                    onChange={this.onInputPage}
                    onPressEnter={this.onPagePressEnter}
                    title={page}
                    value={page}
                /> 页
        </span>
                <Icon type="caret-right" title="下一页" onClick={this.onNext} />
                <Icon type="step-forward" title="最后页" onClick={this.onLast} />
            </div>
            <div className="page-total">
        <span>
          <span className="text-middle">共</span> <Input
            className="text-middle"
            size='small'
            addonAfter={<Icon
                className="redo-btn"
                size="small"
                type="redo"
                onClick={this.onRefreshTotal}
            />}
            title={total}
            style={{width:80}}
            value={total}
            readOnly
        /> <span className="text-middle">条记录</span>
        </span>
            </div>
            <div className="page-total-page">
        <span>
          <span className="text-middle">共</span>
          <Input
              className="text-middle"
              size='small'
              style={{width:'50px'}}
              title={trueTotalPage}
              value={trueTotalPage}
              readOnly
          />
          <span className="text-middle">页</span>
        </span>
            </div>
        </div>)
    }
}

export default Pagination;