import React, { Component }  from 'react';
import { Input, Select } from 'antd';

export default class WidthInput extends Component {
    constructor(props){
        super(props)
    }
    inputChange = (e) => {
        const number = parseInt(e.target.value || 0);
        if(isNaN(number)){ return; }
        this.widthInputChange({v: number, type: 'v'})
    }
    selectChange = (curr) => {
        this.widthInputChange({d: curr, type: 'd'})
    }

    widthInputChange = (chengedValue) => {
        const { onChange } = this.props;
        if(onChange){
            const vals = this.values();
            const { type } = chengedValue;
            let val;
            if(type === 'v'){
                val = chengedValue.v + vals.d;
            }else if(type === 'd'){
                val = vals.v + chengedValue.d;
            }
            onChange(val)
        }
    }

    values = () => {
        const { value } = this.props;
        const v = parseInt(value);
        const d = value.slice((v + '').length);
        return {v, d}
    }

    render(){
        const values = this.values();
        return <div>
            <Input 
                {...this.props}
                type='number'
                style={{width: '60%'}}
                value={values.v}
                onChange={this.inputChange}
                min={-1}
            />
            <Select style={{ width: '40%' }} value={values.d} onChange={this.selectChange}>
                <Select.Option value="px">px</Select.Option>
                <Select.Option value="%">%</Select.Option>
            </Select>
        </div>
    }
}