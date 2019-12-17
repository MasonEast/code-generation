import React, { useState, useEffect, useMemo, useCallback, useReducer, useRef } from 'react';
import lodash from 'lodash';
import { Button, Input, Row, Col, Table, Form, Select, Radio, Checkbox, DatePicker, message } from 'antd';
import ItemError from '../../base-components/form-item-error';
import FormCreater from '../../base-components/form-creater';
import { EditableFormRow, EditableCell } from './components/editCell/editTableFormRow';
import WidthInput from './components/width-input';
import { Fetch } from '../../utils';
import './index.less'
// import GFrom from './form';

// 将 类型 下拉项选中的value字符串映射为对应元素
const mapTypesToEle = (type) => {
	switch(type){
		case 'Select':
			return <Select />
		case 'Input.TextArea':
			return <Input.TextArea />
		case 'Checkbox':
			return <Checkbox />
		case 'Radio':
			return <Radio />
		case 'DatePicker':
			return <DatePicker />
		case 'DatePicker.RangePicker':
			return <DatePicker.RangePicker />
		default:
			return <Input />
	}
}

const baseFormOptions = {
	layout: 'inline',
	labelCol: { span: 8 },
	wrapperCol: { span: 16 }
}
const createFormItems = (dataSource, itemWidth) => {
	let types = [], genItems = [];
	const formItems = dataSource.map((data, i) => {
		types.push(data.type);

		let lwColObj = {};
		const { labelCol, wrapperCol } = data;
		if(labelCol > -1){
			lwColObj['labelCol'] = {span: labelCol};
		}
		if(wrapperCol > -1){
			lwColObj['wrapperCol'] = {span: wrapperCol};
		}
		let trueWidth = itemWidth;
		if(parseInt(data.selfWidth) > -1){
			trueWidth = data.selfWidth;
		}
		genItems.push({
			key: data.key,
			type: data.type,
			name: data.name,
			width: trueWidth || '256px'
		})
		return {
			itemOptions: {
				...lwColObj,
				label: data.name,
				style: {
					width: trueWidth || '256px',
				}
			},
			fieldDecoratorParams: [data.key, { rules: data.isRequired === 'Y' ? [{required: true, message: <ItemError text="必填项" />}] : [] }],
			element: mapTypesToEle(data.type)
		}
	})
	return {formItems, types, genItems}
}
const compType = [
	{value: 'Input', text: 'Input'},
	{value: 'Input.TextArea', text: 'TextArea'},
	{value: 'Checkbox', text: 'Checkbox'},
	{value: 'Radio', text: 'Radio'},
	{value: 'Select', text: 'Select'},
	{value: 'DatePicker', text: 'DatePicker'},
	{value: 'DatePicker.RangePicker', text: 'RangeDatepicker'}
]

const initDataSource = () => {
	let source = [];
	for(let i = 0; i < 2; i++){
		source.push({
			name: 'name' + i,
			key: new Date().getTime() + i + '',
			type: 'Input',
			isRequired: 'N',
			labelCol: -1,
			wrapperCol: -1,
			selfWidth: '-1px'
		})
	}
	return source;
}
const formsRdcCal = (initData) => {
	return initData;
}
const formsReducer = (state, action) => {
	switch(action.type){
		case 'operate':
			return {...action.payload}
		default:
			throw new Error();
	}
}

const MainDesign = (props) => {
	const operateFormRef = useRef();
	const [formsState, dispatchForms] = useReducer(formsReducer, {formOpts: baseFormOptions, operateFormData: null}, formsRdcCal)
	// const [formsState.formOpts, setFormOpts] = useState(lodash.cloneDeep(baseFormOptions));
	const [activeCls, setActiveCls] = useState('')
	const [dataSource, setDataSource] = useState(initDataSource())
	const [formItems, setFormItems] = useState(createFormItems(dataSource).formItems)
	const _columns = [
		{
			title: '操作',
			key: 'action',
			width: 60,
			fixed: true,
			render: (text, record, index) => {
				return <div>
					<Button type="link" onClick={onRowDelete.bind('', index)}>删除</Button>
				</div>
			}
		},{
			title: '名称',
			dataIndex: 'name',
			editable: true,
			ellipsis: true,
			width: 120,
			key: 'name',
			type: 'Input'
		},{
			title: '字段',
			dataIndex: 'key',
			editable: true,
			ellipsis: true,
			width: 120,
			key: 'key',
			type: 'Input'
		},{
			title: '类型',
			dataIndex: 'type',
			editable: true,
			ellipsis: true,
			width: 120,
			key: 'type',
			type: 'Select',
			data: compType,
		},{
			title: '必填',
			dataIndex: 'isRequired',
			editable: true,
			ellipsis: true,
			key: 'isRequired',
			width: 100,
			type: 'Select',
			data: [
				{value: 'Y', text: '是'},
				{value: 'N', text: '否'},
			]
		},{
			title: 'label栅格数',
			dataIndex: 'labelCol',
			editable: true,
			ellipsis: true,
			key: 'labelCol',
			width: 120,
			type: 'label-wrapper-col'
		},{
			title: 'wrapper栅格数',
			dataIndex: 'wrapperCol',
			editable: true,
			ellipsis: true,
			key: 'wrapperCol',
			width: 120,
			type: 'label-wrapper-col'
		},{
			title: '表单项宽度',
			dataIndex: 'selfWidth',
			editable: true,
			ellipsis: true,
			key: 'selfWidth',
			width: 160,
			type: 'width-input'
		},
	]
	
	// 生成栅格占位数字
	const gridOption = () => {
		const gridOption = [];
		for(let i = 1; i <= 24; i++){
			gridOption.push(<Select.Option key={i} value={i}>{i}</Select.Option>)
		}
		return gridOption;
	}
	// 右侧操作表单基本布局
	const operateLayout = {
		layout: 'inline',
		labelCol: { span: 8 },
		wrapperCol: { span: 16 }
	}
	const widthChange = useCallback((width) => {
		return formItems.map((item, i) => {
			return {
				...item,
				itemOptions: {
					...item.itemOptions,
					style: {
						...item.itemOptions.style,
						width
					}
				}
			}
		})
	}, [formItems])
	// 右侧操作表单监听
	const operateEventOptions = {
		onValuesChange: (props, changedValues, allValues) => {
			let isEsc = false;
			let _formOpts = formsState.formOpts;
			switch(Object.keys(changedValues)[0]){
				case 'formLayout':
					// 当设置垂直布局时，所有宽度都占满
					if(changedValues['formLayout'] === 'vertical'){
						allValues = {
							...allValues,
							labelCol: 24,
							wrapperCol: 24
						}
						_formOpts = {
							layout: changedValues['formLayout'],
							labelCol: {span: 24},
							wrapperCol: {span: 24}
						}
					}else{
						allValues = {
							...allValues,
							labelCol: 8,
							wrapperCol: 16
						}
						_formOpts = {
							..._formOpts,
							layout: changedValues['formLayout'],
							labelCol: {span: 8},
							wrapperCol: {span: 16}
						}
					}
					break;
				case 'labelCol':
					_formOpts = {
						..._formOpts,
						labelCol: {span: changedValues['labelCol']}
					}
					break;
				case 'wrapperCol':
					_formOpts = {
						..._formOpts,
						wrapperCol: {span: changedValues['wrapperCol']}
					}
					break;
				case 'itemWidth': 
					isEsc = true;
					formPreview('', changedValues['itemWidth']);
					return;
				default:
					break;
			}
			if(!isEsc){
				dispatchForms({
					type: 'operate',
					payload: {
						formOpts: _formOpts,
						operateFormData: allValues
					}
				})
			}
		}
	};
	// 右侧操作布局表单
	const operateItems = [
		{
			itemOptions: {
				label: '表单布局',
				style: { width: '256px'}
			},
			fieldDecoratorParams: ['formLayout',{ initialValue: 'inline' }],
			element: <Select>
				{['inline','horizontal','vertical'].map((item, i) => {
					return <Select.Option key={i} value={item}>{item}</Select.Option>
				})}
			</Select>
		},{
			itemOptions: {
				label: 'label栅格数',
				style: { width: '256px'}
			},
			fieldDecoratorParams: ['labelCol', { initialValue: 8 }],
			element: <Select>
				{gridOption()}
			</Select>
		},{
			itemOptions: {
				label: '控件栅格数',
				style: { width: '256px'}
			},
			fieldDecoratorParams: ['wrapperCol', { initialValue: 16 }],
			element: <Select>
				{gridOption()}
			</Select>
		},{
			itemOptions: {
				label: '表单项宽度',
				style: { width: '256px'}
			},
			fieldDecoratorParams: ['itemWidth', { initialValue: '256px' }],
			element: <WidthInput />
		}
	]
	// 右侧操作表单控制渲染DOM
	const operateForm = useMemo(() => {
		return <FormCreater wrappedComponentRef={operateFormRef} formOptions={operateLayout} formCreatOptions={operateEventOptions} formItems={operateItems} formData={formsState.operateFormData} />
	}, [formsState.operateFormData])
	// 行内编辑栅格数超出范围提示
	const gridOutWarn = (row) => {
		let { wrapperCol, labelCol } = row;
		const warn = (tar, key) => {
			if(tar > 24){
				row[key] = 24
				message.warning('已设置为最大值：24')
			}else if(tar < -1){
				row[key] = -1
				message.warning('已设置为最小值：-1')
			}
		}
		warn(labelCol, 'labelCol');
		warn(wrapperCol, 'wrapperCol')
		return row;
	}
	// 行内编辑保存
	const handleSave = (row) => {
		row.labelCol = +row.labelCol;
		row.wrapperCol = +row.wrapperCol;
		row = gridOutWarn(row);
		console.log(row)
		
		const newData = [...dataSource];
		const index = newData.findIndex(item => row.key === item.key);
		const item = newData[index];
		newData.splice(index, 1, {
			...item,
			...row,
		});
		setDataSource(newData)
	}
	// 可编辑单元格增加监听
	const createColumns = (columns) => {
		return columns.map(col => {
			if (!col.editable) {
				return col;
			}
			return {
				...col,
				onCell: record => ({
					record,
					editable: col.editable,
					dataIndex: col.dataIndex,
					title: col.title,
					type: col.type,
					data: col.data || '',
					handleSave: handleSave,
				}),
			};
		});
	}
	const columns = createColumns(_columns)
	// 区块点击增加样式
	const formBlockClick = (e) => {
		e.stopPropagation();
		setActiveCls('active')
	}
	// render formConatainer
	const formContainer = useMemo(() => {
		return <div className={`form-container ${activeCls}`}>
			<FormCreater
				formOptions = {formsState.formOpts}
				formItems = {formItems}
			/>
		</div>
	}, [activeCls, formsState.formOpts, formItems])

	// 新增表单项
	const addFormItem = () => {
		setDataSource([
			...dataSource,
			{
				name: 'name',
				key: new Date().getTime() + '',
				type: 'Input',
				isRequired: 'N',
				labelCol: -1,
				wrapperCol: -1,
				selfWidth: '-1px'
			}
		])
	}
	// 删除表单项
	const onRowDelete = (index) => {
		dataSource.splice(index, 1)
		setDataSource([...dataSource])
	}
	// 根据表格数据生成表单fields
	const createNewFields = () => {
		let types = [];
		const newFields = dataSource.map((source, i) => {
			types.push(source.type.split('.')[0]);
			return {
				key: source.key, 
				name: source.name, 
				type: source.type,
				decoratorOptions:{
					rules: source.isRequired === 'Y' ? [{required: true, message: <ItemError text="必填项" />}] : []
				},
				element: mapTypesToEle(source.type)
			}
		})
		return { newFields, types }
	}
	// 预览表单
	const formPreview = (e, width) => {
		if(!width){
			width = operateFormRef.current.props.form.getFieldValue('itemWidth');
		}
		setFormItems(createFormItems(dataSource, width).formItems)
	}

	const createEleFormItem = () => {
		Fetch.post('/test/writeJson',{body: {formOptions: formsState.formOpts, jsFile: renderEle()}}, 'json').then((res) => {
			message.success(res.msgs)
		})
	}
	// 生成代码
	const renderEle = () => {
		const width = operateFormRef.current.props.form.getFieldValue('itemWidth');
		const { genItems, types } = createFormItems(dataSource, width);
		let newItems = '';
		genItems.map((item, i) => {
			newItems += `
	{
		itemOptions: {
			label: '${item.name}',
			colon: ${item.colon || true},
			style: {
				width: '${item.width}'
			}
		},
		fieldDecoratorParams: ['${item.key}', {rules: []}],
		element: <${item.type} />
	},`
		})
		const { layout, labelCol, wrapperCol} = formsState.formOpts;
		return `
import React, { Component } from 'react';
import ItemError from '../../base-components/form-item-error';
import FormCreater from '../../base-components/form-creater';
import { ${Array.from(new Set(types)).join(', ')} } from 'antd';

const formOptions = {
	layout: '${layout}',
	labelCol: { span: ${labelCol.span} },
	wrapperCol: { span: ${wrapperCol.span} }
}

const formItems = [${newItems}]

const formElement = () => {
	return <FormCreater 
		formOptions = {formOptions}
		formItems = {formItems}
	/>
}
export default formElement;
		`
	}
	
	return <Row style={{height: '100vh'}}>
		<Col span={14} onClick={formBlockClick} style={{height: '100%'}}>
			{formContainer}
			{/* <GFrom /> */}
		</Col>
		<Col span={10} className='edit-container'>
			<Row>
				{operateForm}
			</Row>
			<Row>
				<Table
					size='small'
					columns={columns}
					dataSource={dataSource}
					pagination={false}
					components={{
						body: {
							row: EditableFormRow,
							cell: EditableCell
						}
					}}
					scroll={{ x: 'max-content' }}
				/>
				<Button onClick={addFormItem}>新增表单项</Button>
				<Button onClick={formPreview}>预览</Button>
				<Button onClick={createEleFormItem}>生成</Button>
			</Row>
			<Row></Row>
		</Col>
	</Row>
}

export default MainDesign;