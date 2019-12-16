import React, { useState, useEffect, useMemo, useCallback, useReducer } from 'react';
import lodash from 'lodash';
import { Button, Input, Row, Col, Table, Form, Select, Radio, Checkbox, DatePicker, message } from 'antd';
import ItemError from '../../base-components/form-item-error';
import FormCreater from '../../base-components/form-creater';
import { EditableFormRow, EditableCell } from '@/components/editCell/editTableFormRow';
import { Fetch } from '../../utils';
import './index.less'
// import GFrom from './form';

const fields = [
    {
        key: 'receiverName', 
		name: '收货人', 
		type: 'Input',
        decoratorOptions:{
			// rules: [{required: true, message: <ItemError text="必填项" />}], 
			rules: []
        },
        sigleRow: false
    },{
        key: 'receiverMobileBlur', 
		name: '收货手机', 
		type: 'Input',
        decoratorOptions:{
            rules: [], 
        },
        sigleRow: false
    }
]

const baseFormOptions = {
	layout: 'inline',
	labelCol: { span: 8 },
	wrapperCol: { span: 16 }
}
const createFormItems = (fields, isGen) => {
	return fields.map((item, i) => {
		return {
			itemOptions: {
				label: item.name,
				colon: item.colon,
				style: {
					width: '156px',
				}
			},
			fieldDecoratorParams: [item.key,{ ...item.decoratorOptions }],
			element: isGen ? (!!item.element ? `${item.element}` : '<Input />') : (item.element || <Input />)
		}
	})
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

const createDataSource = (fields) => {
	return fields.map((item, i) => {
		return {
			name: item.name,
			key: item.key,
			type: item.type,
			isRequired: 'N'
		}
	})
}
const formsRdcCal = (initData) => {
	console.log(initData)
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
	const [formsState, dispatchForms] = useReducer(formsReducer, {formOpts: baseFormOptions, operateFormData: null}, formsRdcCal)
	// const [formsState.formOpts, setFormOpts] = useState(lodash.cloneDeep(baseFormOptions));
	const [activeCls, setActiveCls] = useState('')
	const [dataSource, setDataSource] = useState(createDataSource(fields))
	const [formItems, setFormItems] = useState(createFormItems(fields))
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
			width: 120,
			type: 'Select',
			data: [
				{value: 'Y', text: '是'},
				{value: 'N', text: '否'},
			]
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
	// 右侧操作表单监听
	const operateEventOptions = {
		onValuesChange: (props, changedValues, allValues) => {
			let _formOpts;
			switch(Object.keys(changedValues)[0]){
				case 'formLayout':
					_formOpts = {
						...formsState.formOpts,
						layout: changedValues['formLayout']
					}
					break;
				case 'labelCol':
					_formOpts = {
						...formsState.formOpts,
						labelCol: {span: changedValues['labelCol']}
					}
					break;
				case 'wrapperCol':
					_formOpts = {
						...formsState.formOpts,
						wrapperCol: {span: changedValues['wrapperCol']}
					}
					break;
			}
			dispatchForms({
				type: 'operate',
				payload: {
					formOpts: _formOpts,
					operateFormData: allValues
				}
			})
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
		}
	]
	// 右侧操作表单控制渲染DOM
	const operateForm = useMemo(() => {
		return <FormCreater formOptions={operateLayout} formCreatOptions={operateEventOptions} formItems={operateItems} formData={formsState.operateFormData} />
	}, [formsState.formOpts])
	const handleSave = (row) => {
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
				isRequired: 'N'
			}
		])
	}
	// 删除表单项
	const onRowDelete = (index) => {
		dataSource.splice(index,1)
		setDataSource([...dataSource])
	}
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
	const formPreview = () => {
		const { newFields } = createNewFields();
		setFormItems(createFormItems(newFields))
	}

	const createEleFormItem = () => {
		Fetch.post('/test/writeJson',{body: {formOptions: formsState.formOpts, jsFile: renderEle()}}, 'json').then((res) => {
			message.success(res.msgs)
		})
	}
	// 生成代码
	const renderEle = () => {
		const { newFields, types } = createNewFields();
		let newItems = '';
		newFields.map((item, i) => {
			newItems += `
	{
		itemOptions: {
			label: '${item.name}',
			colon: ${item.colon || true},
			style: {
				width: '256px'
			}
		},
		fieldDecoratorParams: ['${item.key}', {rules: []}],
		element: <${item.type} />
	},`
		})
		return `
import React, { Component } from 'react';
import ItemError from '../../base-components/form-item-error';
import FormCreater from '../../base-components/form-creater';
import { ${Array.from(new Set(types)).join(', ')} } from 'antd';
import { formOptions } from './fields.json';

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