## grid列细节配置 如配置一个两列的表格
```
// const columnDefs = [
//     {
//         headerName: "订单编号",                          // 该列列头名
//         field: "code",                                 // 该列字段
//         width: 150,                                    // 该列宽度(对应defaultColDef中的width)
//         sortable:true                                  // 该列可支持排序(对应gridOptions中的enableSorting)
//         sort:'asc',                                    // 该列默认排序方式(默认无排序、asc升序、desc降序)
//         drag:true                                      // 该列每行前有拖拽点(默认没有即false)
//         filter:false                                   // 该列是否有过滤器(对应defaultColDef中的filter)
//         hide:false                                     // 该列是否隐藏(默认显示即false)
//         pinned: "left"                                 // 该列锁定且置于左侧(默认不设置此属性、右边即right)

//         checkboxSelection: true,                       // 该列列头前呈现快捷选择框(默认不出现即false、也可使用函数返回)
//         headerCheckboxSelection: true,                 // 全选该列的每一行
//         headerCheckboxSelectionFilteredOnly: true,     // 全选该列过滤行

//         lockPosition:true,                             // 该列优先靠前显示
//     },
//     {
//         headerName: "仓库名称",
//         field: "warehouseName",
//         width: 100,
//         filter: "agNumberColumnFilter"
//     }]
```

# ag-grid表格内React组件封装介绍
没有按照ag-grid要求封装的React组件不能在表格内直接使用，以下文档仅对已经封装的组件做介绍，供后续开发参考使用。

## 开发步骤
#### <span id="anchor_cellRender1">1、创建 'cellRender' 组件</span>
ag-grid表格拿到数据后，对每个单元格执行`cellRender`函数（已配置的可视区域内的单元格），该列对应行的值会以 key 为`value`的形式，会通过`props`传递到`cellRender`组件，组件拿到`value`值后，可进行自定义`cellRender`初始化。
<br/><br/>
预留名为`refresh`的函数（必需），参数是 ag-grid 传过来的对象，包含数据data、api等，用于刷新`cellRender`的值及其他相关操作。
##### 示例：
```js
export class CellRender extends Component {
  constructor(props) {
    super(props);
    this.state = {
      value: this.props.value
    }
  }
  // refresh 函数必需，
  refresh(params) {
    this.setState({ value: params.value })
  }

  render() {
    return (<div>{this.state.value}</div>);
  }
};
```
#### <span id="anchor_cellRender2">2、创建 'cellEditor' 组件</span>
编辑单元格时，会调用`cellEditor`组件，该列对应行的值会以 key 为`value`的形式，会通过`props`传递到`cellEditor`组件，组件拿到`value`值后，可进行自定义`cellEditor`初始化。
<br/><br/>
预留名为`getValue`的函数（必需），无参；必须返回一个值，此方法会在单元格从编辑状态切换到非编辑状态时调用，之后会调用`cellRender`组件内的`refresh`函数，参数的 data、value 值已经改变，此时只需调用`setState`将值渲染到 dom 即可。
#### <span id="anchor_cellRender3">3、注册使用 'cellRender、cellEditor' 组件</span>
使用自定义的组件需在 ag-grid 内注册。React 组件使用属性 `frameworkComponents`注册，`frameworkComponents`是一个对象，格式`{ key: ReactComponent }`，key 在 colDef 配置中的`cellEditor | cellRenderer`中使用。
<br/><br/>
`cellEditor`组件自定义参数通过 colDef 配置 `cellEditorParams` 传入，在进入编辑状态时，ag-gird 会将值一并传入 `props` 对象。

> `cellRender、cellEditor`组件的`props`是以 ag-gird 对应行数据为基准的，会同时传入相应的 api 及方法等。

> 注意：以上用法仅适用于“所见即所得”的编辑渲染组件，即编辑的值与渲染的值为同一个字段值。如对于select编辑组件的value值与展示的text值不一致情况，需要做进一步处理。<br/>
1、在 columns 中配置隐藏列，`field`参数值应为 select 组件的 value 字段；下拉项列`field`值应为 select 组件的 text 字段；<br/>
2、在 `cellEditor`组件内 select 组件 change 后，调用 `props.node.setDataValue( colKey, newValue )`方法，更改隐藏列的 data 值；<i>注意：此方法不能改变未在 columns 中配置的字段值</i><br/>
3、其他编辑渲染相同
## <span id="anchor_4">示例 </span>
select cellEditor
```js
import React, {Component} from "react";
import Select2 from '../select2/select2'

export class GridSelect extends Component {
  constructor(props) {
    super(props);
    this.state = {
      value: this.props.value,
      valName: this.props.value     // 此处valName值并没有实际作用，仅返回给cellRender组件使用
    };
  }
  //cell render 时，取值是当前的value，初始化时不会调用此函数
  getValue() {
    return this.state.valName;
  }
  setValue(value, valName){
    this.setState({ value, valName })
    //改变行数据对应下拉框选项的id，此处在colDef中定义了colId属性，与隐藏列的field值一致
    this.props.node.setDataValue(this.props.colDef.colId, value);     
  }
  onChange = (value,opt) => {
    const { onChange } = this.props;
    this.setValue(value, opt.props.children);
    onChange && onChange(value, opt)
  }

  render() {
    return (<Select2
      {...this.props}     // Selcet2 的其他属性值在cellEditorParams配置中传入
      onChange={this.onChange}
      value={this.state.value}
    />)
  }
};
```
select cellRender
```js
export class GridSelectRender extends Component {
  constructor(props) {
    super(props);
    this.state = {
      value: this.props.value
    }
  }
  refresh(props) {    // props内的data、value值已经改变，此处只做渲染，初始化时不会调用此函数
    this.setState({value:props.value});
  }

  render() {
    return (<div>{this.state.value}</div>);
  }
};
```
在组件内注册使用
```js
import {GridSelect, GridSelectRender} from './gridSelect';

columnDefs: [{
  field: 'expressId',
  hide: true
},{
  headerName: 'selectColumn',
  field: 'expressName',
  colId: 'expressId',
  cellEditor: 'gridSelect',
  cellRenderer: 'gridSelectRender',
  cellEidtorParams: {
    style: { width: '100%' },
    url: '/path/to/get/selectOption',
    optionField: {
      value: 'id',
      text: 'name'
    }
  }
},
...
],
frameworkComponents: {
  gridSelect: GridSelect,
  gridSelectRender: GridSelectRender
}
...

<Grid 
  ...
  columnsDefs = {columnsDefs}
  frameworkComponents={frameworkComponents}
/>
```