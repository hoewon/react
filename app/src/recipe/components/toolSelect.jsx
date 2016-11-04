import React from 'react';
import {Button, Checkbox, Select, Radio, Form, Row, Col, Icon, Input, InputNumber, message} from 'antd';

import './editForm.less';

const FormItem = Form.Item;
const RadioGroup = Radio.Group;
const RadioButton = Radio.Button;


import AV from 'leancloud-storage';
const Recipe = AV.Object.extend('Recipe');
const Tool = AV.Object.extend('Tool');


const u = require('../../utils/utils');
const d = require('../../utils/data');


class toolSelect extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: props.data,
      value: '',
      focus: false,
    }
  }


  componentDidMount() {
    // console.log('11');


  }



  handleChange = (value)=> {
    // console.log(value);

    // this.setState({ value });
    // fetch(value, (data) => this.setState({ data }));
    d.searchCat(value).then((data)=>{

      this.setState({ data })
      console.log('tools搜索结果',data)
    })
    // console.log(`selected ${value}`);
  }

  handleFocusBlur =(e)=> {
    // console.log('???');

    this.setState({
      focus: e.target === document.activeElement,
    });
  }

  render() {
    // console.log(this.props)


    const {getFieldProps, getFieldValue, getFieldError, isFieldValidating} = this.props.form;


    const k = this.props.k;

    const options = this.state.data.map(d => <Select.Option key={d.objectId} label={d.title}>{d.title}</Select.Option>);

    return (
      <Select
        // showSearch
        value={'tools,${k}.title'}
        // placeholder={this.props.placeholder}
        // notFoundContent=""
        // defaultActiveFirstOption={false}
        // showArrow={false}
        // filterOption={false}
        onChange={this.handleChange}
        // onFocus={this.handleFocusBlur}
        // onBlur={this.handleFocusBlur}
        // optionLabelProp='label'
        // {...getFieldProps(`tools.${k}.id`,{'trigger':'onSelect'})}
        showSearch
        style={{ width: 200 }}
        placeholder="请选择原料/工具"
        optionFilterProp="children"
        notFoundContent="输入关键字查找"
        onSearch={this.handleChange}
        {...getFieldProps(`tools.${k}.objectId`, {
          rules: [{
            required: true,
            whitespace: true,
            message: '你好友的名字捏！',
          }],
        },)}

      >
        {options}
      </Select>
    );
  }
}

// 再包装一层
export default toolSelect;