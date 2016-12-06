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
      data: this.props.data,
      value: '',
      focus: false
    }
  }

  handleSearch = (value)=> {
    console.log('搜索人名' + value);

    this.setState({value});
    // fetch(value, (data) => this.setState({ data }));
    d.searchCook(value).then((data)=> {
      this.setState({data})
    })
    // console.log(`selected ${value}`);
  }

  render() {
    const {getFieldProps} = this.props.form;
    const options = this.state.data.map(d => <Select.Option key={d.objectId}>{d.username}</Select.Option>);

    return (
      <Select
        showSearch
        style={{ width: 300 }}
        placeholder="请选择作者"
        optionFilterProp="children"
        notFoundContent="输入名称查找"
        onSearch={this.handleSearch}
        // onChange={this.handleChange}
        {...getFieldProps('cook.objectId',
            {
          rules: [{
            required: true,
            // whitespace: true,
            message: '请选择作者！'
          }]
        })
            }
      >
        {options}
      </Select>
    );
  }
}

// 再包装一层
export default toolSelect;