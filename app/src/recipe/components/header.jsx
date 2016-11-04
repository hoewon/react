import React from 'react';
import {Button,Checkbox,DatePicker,Select,Radio,Form,Row,Col,Icon,message,notification,Modal,Input } from 'antd';

// 引入标准Fetch及IE兼容依赖
import 'whatwg-fetch';
import 'es6-promise/dist/es6-promise.min.js';
import 'fetch-ie8/fetch.js';

// 引入 新建广告系列按钮 组件
import BtnForm from './modalForm.jsx';

const FormItem = Form.Item;
const Option = Select.Option;
const RangePicker = DatePicker.RangePicker;

export default class Header extends React.Component {
  constructor(props) {
    super(props);
    // console.log(props);
    this.state = {
      selV: [''],
      selValue:'',
      sDate:'',
      eDate:'',
      ischecked: false,
    }
  }

  // 选择广告系列
  selChange = (value) => {
    this.setState({selValue: value});
  }

  // 选择日期范围
  dateChange = (value) => {
    this.setState({sDate: value[0].toLocaleDateString()});
    this.setState({eDate: value[1].toLocaleDateString()});
  }

  // 过滤无数据广告
  checkChange = (e) => {
    this.setState({ischecked: e.target.checked});
    if(e.target.checked == true) {
      message.config({top: 5});
      message.warning('过滤无数据广告已开启！');
    }
  }

  // 查询提示框
  confirmMsg = () => {
    // console.log(this.state.selValue);
    console.log(this.props.onOk);

  }



  render() {



    /*控制查询按钮状态*/
    let isDisabled = this.state.selValue ==='' ? true : false;

    /*时间控件初始的起止日期，间隔为30天*/
    let defaultStartDate = new Date();
    let defaultEndDate = new Date(defaultStartDate.getTime()+30*24*60*60*1000);

    return (
      <div id="header">
        <Form inline>
          <Row type="flex" justify="start" gutter={16} align="middle">
            <Col span="3" push="4">
              <FormItem>
                <BtnForm isNew={true} />
              </FormItem>
              </Col>
            <Col span="3" push="4">
              <FormItem>
                <BtnForm isNew={true} />
              </FormItem>
            </Col>
          </Row>
        </Form>
      </div>
    )
  }
}