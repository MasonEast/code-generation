/**
 * Created by csz on 2019/7/24
 */
import React, { Component } from "react";
import PropTypes from 'prop-types';
import { AgGridReact } from "ag-grid-react/main";
import ag_zh_CN from './locales/zh-CN';
// import {GridDatePicker, GridDatePickerRender} from './gridDatePicker'
import Pagination from '../pagination';
import AgLoading from './grid-loading';
import { Spin } from 'antd';
import './agGridTheme.scss'
import './agGrid.less'

const currentLang = window.localStorage.getItem('gyLang')||'zh_CN'; // grid国际化
const ag_langMap = {'zh_CN':ag_zh_CN, 'en_US':null};                    // 关联ag-Grid语言包 默认为英文en_US可设置为null

// grid基本默认配置 以下属性均可在使用AgGrid组件时传入对应Props修改
// 如修改列表的行高度为50,使用时<AgGrid rowHeight={50}/>
const gridOptions = {
    localeText:ag_langMap[currentLang],         // 国际化(根据本地localStorage的gyLang显示对应语言
    enableSorting:false,                        // 是否开启排序(默认false关闭、true开启)可在columnDefs对应列中单独配置sortable
    enableFilter:false,                         // 是否开启过滤(默认false关闭、true开启)可在columnDefs对应列中单独配置filter
    suppressMenuHide:true,                      // 是否阻止列菜单隐藏(默认false隐藏、true始终显示)
    rowDragManaged:true,                        // 是否支持行拖拽(true为支持、false为不支持)
    animateRows:true,                           // 是否显示行拖拽动画效果(true为显示、false为不显示)
    suppressRowClickSelection:false,            // 点击行是否会勾选该行(true为不勾选、false勾选)
    rowSelection:'multiple',                    // 行选中方式(单选single、多选multiple) 按住shift支持多选
    suppressCellSelection: true,                // 单元格是否允许选中，true：不选中，false：选中（默认）   
    rowStyle: {                                 // 行样式
        borderColor: '#e8e8e8',
    },
    headerHeight: 32,                           // 表头高度
    rowHeight: 40,                              // 默认行高
    enableCellTextSelection: false,             // 是否允许选中行内文本
}

// gird基本列配置（初始化表格默认使用以下配置来配置每一列）
// 如需修改基本列设置 则按以下格式传入自定义的基础列配置 如<AgGrid defaultColDef = {your_defaultColDef}>
// 如需单独个性化配置某列、可在columnDefs的对应列中添加相应属性进行个性化配置
const defaultColDef = {
    width:150,                                  // 列默认宽度px
    filter: 'agNumberColumnFilter',             // 列默认使用ag-grid提供的数字过滤器(文本过滤器'agTextColumnFilter'|日期过滤器'agDateColumnFilter')
    resizable: true,                            // 是否列可伸缩(true为支持列伸缩、false为禁止列伸缩)
    editable: false,                            // 是否列可编辑(默认false即不可编辑)可在columnDefs对应列中单独配置filter
    cellStyle: {                                // 单元格样式
        color: "#333",
        lineHeight: '40px'
    },
}

class AgGrid extends Component {
    constructor(props) {
        super(props);
        this.targetRowDataObject = null;        // 存储右键行数据对象
        this.state = {
            top: 0,
            left: '-10000px',
        };
        this.defaultColDef = {
            onCellContextMenu: (params)=>{
                const { event, api, node } = params;
                event.preventDefault();
                event.stopPropagation();
                api.deselectAll();              // 取消所有选中
                node.setSelected(true);         // 选中当前行
                if(this.props.contextMenu){
                    const { top, left } = this.computeContextMenuPosition(event.clientX, event.clientY);
                    this.setState({top, left})      // 设置右键菜单位置
                    this.targetRowDataObject = params;
                }
            }
        }
    }
    
    // 计算右键菜单位置
    computeContextMenuPosition = (clientX, clientY) => {
        const contextMenuNode = document.getElementById('ag-grid-context-menu');
        const screenW = window.innerWidth;          // 视窗宽度
        const screenH = window.innerHeight;         // 视窗高度
        const menuW = contextMenuNode.offsetWidth;        // 目标宽度
        const menuH = contextMenuNode.offsetHeight;       // 目标高度

        const right = (screenW - clientX) > menuW;
        const left = !right;
        const bottom = (screenH - clientY) > menuH;
        const top = !bottom;
        
        let position = {}
        if (right) { position.left = `${clientX}px`; }
        if (left) { position.left = `${clientX - menuW}px`; }
        if (bottom) { position.top = `${clientY}px`; }
        if (top) { position.top = `${clientY - menuH}px`; }

        return position;
    }

    // 列伸缩回调 (伸缩后可获取伸缩后的相关数据 可用于将来的保存布局)
    onColumnResized = (params)=>{
        // this.gridApi.resetRowHeights();
    }

    // 以某个字段计算行高（超过三张图片换行）
    // getRowHeight = (params) => {
    //     console.log(params);
    //     return 28 * (Math.floor(params.data.receiverAddress.length / 35) + 1)
    // }

    // 右键项点击
    onGridContextMenuItemClick = (menuItemObject) => {
        const { domEvent } = menuItemObject;
        domEvent.stopPropagation();
        domEvent.preventDefault();
        this.props.contextMenu.props.onClick(menuItemObject, this.targetRowDataObject)
    }

    componentDidMount(){
        // 干掉主表格区域浏览器默认右键
        document.getElementById('ag-grid-bolck').oncontextmenu = () => {
            return false;
        }
        // 全局监听mouseup，关闭右键列表
        document.addEventListener('mouseup', (e)=>{
            // 判断右键菜单是否显示在可视区域内（目前仅根据top来做区分）
            if(parseInt(this.state.top) > 0){
                e.stopPropagation();
                e.preventDefault();
                this.setState({top:0, left: '-10000px'})
            }
        })
    }

    componentWillUnmount(){
        document.removeEventListener('mouseup',null);
    }

    render() {
        const { pagination,contextMenu,loading,extraMaskHeight,columnDefs,rowData} = this.props ;
        const { top, left } = this.state;
        const hidePagination = (typeof pagination === 'boolean' && pagination == false); // 不使用分页
        const gridBodyHeight = hidePagination?`100%`:`calc(100% - 34px)`;                // 隐藏分页则100% 使用分页则减分页高度
        const loadingHeight  = typeof extraMaskHeight === 'number'?`calc(100% + ${extraMaskHeight}px)`:`100%`; // 隐藏分页、loading遮罩增加extraHeight

        // 添加行在总数据中的index
        if(rowData){
            const {page,pageSize,total} = pagination;
            if(page*pageSize<total) {
                rowData.forEach((item,index)=>{
                    let totalIndex = pageSize*(page-1)+index+1;
                    item['rowNum'] = totalIndex<10?"0"+totalIndex:totalIndex;
                })
            }
        }

        return (
            <React.Fragment>
                    <div
                        className="ag-theme-balham ag-grid-block"
                        id="ag-grid-bolck"
                        style={{width:'100%',height:'100%'}}
                    >
                        <div style={{height:gridBodyHeight}}>
                        <AgGridReact
                            {...gridOptions}                                    // ag-grid基础默认配置
                            defaultColDef={defaultColDef}                       // ag-grid默认列配置

                            {...this.props}                                     // 自定义props修改默认配置(对外暴露)
                            rowData = {rowData}                              // 表格行数据
                            // onGridReady={onGridReady}                        // 监听表格加载完毕
                            columnDefs={columnDefs}                             // 列配置细节
                            // getRowHeight={this.getRowHeight}                 // 行高设置
                            // context={context}                                // react组件的this
                            // frameworkComponents={frameworkComponents}        // 注册react组件

                            pagination={false}                                  // 完全屏蔽ag-grid的分页
                        />
                        </div>
                        {hidePagination ? '' :<Pagination {...pagination}/>}
                        <AgLoading loading={loading} style={{height:loadingHeight}}/>
                    </div>

                    {/*右键菜单*/}
                    {contextMenu && React.cloneElement(contextMenu, {
                        onClick: this.onGridContextMenuItemClick,
                        mode: "vertical",
                        id: 'ag-grid-context-menu',
                        className: "ag-grid-context-menu",
                        style: {top: top, left: left},
                    })}
            </React.Fragment>
        );
    }
}

// props校验
AgGrid.propTypes = {
    rowData:PropTypes.array,
    onGridReady:PropTypes.func,
    loading:PropTypes.bool,
    pagination:PropTypes.oneOfType([PropTypes.object, PropTypes.bool]),
    extraMaskHeight:PropTypes.number    // 扩展loading遮盖高度
};

// 默认属性
AgGrid.defaultProps = {
    rowData:null,
    loading: false,
};

export default AgGrid;