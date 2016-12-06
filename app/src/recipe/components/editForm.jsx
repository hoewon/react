import React from 'react';
import {Button, Checkbox, Select, Radio, Form, Row, Col, Icon, Input, InputNumber, message} from 'antd';

const FormItem = Form.Item;
const RadioGroup = Radio.Group;
const RadioButton = Radio.Button;

import AV from 'leancloud-storage';
const Recipe = AV.Object.extend('Recipe');
const Tool = AV.Object.extend('Tool');

import ToolSelect from './toolSelect.jsx';
import CookSelect from './cookSelect.jsx';

const u = require('../../utils/utils');
//拖拽排序组件
const Sortable = require('react-anything-sortable');
//const SortableItem = require('./SortableItem');
import { SortableContainer } from 'react-anything-sortable';
//
import './editForm.less';

function updateTool(r, c) {
  // r=recipe c=category
  return new AV.Promise(function (resolve) {
    // 这个c必须存在 c.id .isCat .qty
    var category = AV.Object.createWithoutData('Category', c.objectId);
    // 用r跟c取值，如果存在，则更新，如果不存在，则新建
    var q1 = new AV.Query('Tool');
    q1.equalTo('recipe', r);
    q1.equalTo('category', category);
    q1.first().then(function (r1) {
      if (r1 === undefined) {
        var q2 = new Tool();
        q2.set('recipe', r);
        q2.set('category', category);
      } else {
        var q2 = r1;
      }
      q2.set('isCat', c.isCat);
      q2.set('qty', c.qty);
      q2.save().then((r2)=> {
        resolve(r2);
      });
    });
  })
};

class Editform extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      key: [0],
      loading: true,
      tools: [],
      cook: []
    }
  }

  componentDidMount() {

    const id = this.props.id;

    if (id === 'add') {
      this.setState({
        loading: false
      });
      this.uuid = 0;

    } else {
      var q1 = new AV.Query('Recipe');
      q1.include('image');
      q1.include('user');
      q1.get(id).then((r1)=> {
        var q2 = new AV.Query('Tool');
        q2.include('category');
        q2.equalTo('recipe', r1);
        q2.find().then((r2)=> {
          let r3 = r2.map((o)=> {
            return {
              objectId: o.get('category').id,
              title: o.get('category').get('title'),
              isCat: o.get('isCat'),
              qty: o.get('qty')
            }
          })
          let cook = [{objectId: r1.get('user').id, username: r1.get('user').get('username')}]
          let keys = Array.apply(null, {length: r3.length}).map(Function.call, Number);

          r1.set('tools', u.n2s(r3));
          r1.set('cook', r1.get('user').toJSON());
          r1.set('keys', keys);

          let rz = u.n2s(JSON.parse(JSON.stringify(r1)));
          // console.log('初始表单内容→→→→→', rz);
          this.uuid = keys.length;
          this.props.form.setFieldsValue(rz);
          this.setState({
            visible: true,
            loading: false,
            tools: r3,
            cook: cook
          });
        })
      }).catch((e)=> {
        message.error(e.message);
      })
    }
  }

  handleSubmit = (e) => {
    const id = this.props.id;
    e.preventDefault();
    this.props.form.validateFields((errors, values) => {
      var tools = u.s2n(values.tools);
      // console.log(values);
      if (!!errors) {
        message.error('表单中有错误，请检查');
        return;
      }
      if (id === 'add') {
        var q1 = new Recipe();
      } else {
        var q1 = AV.Object.createWithoutData('Recipe', this.props.id);
      }
      var cook = AV.Object.createWithoutData('_User', values.cook.objectId);
      // console.log('提交结果',cook);
      q1.set('user', cook);
      q1.set('title', values.title);
      q1.set('sn', values.sn);
      q1.set('desc', values.desc);
      // title,sn,desc,image,video,
      q1.save().then((r1)=> {
        this.setState({visible: false});
        AV.Promise.all(
          Object.keys(tools).map((k)=> {
            return updateTool(r1, tools[k])
          })
        ).then((r2)=> {
          var r21 = r2.map((o)=> {
            return o.id
          });
          let title = r1.attributes.title;
          if (id === 'add') {
            message.success('上传【' + title + '】完成');
          } else {
            var q3 = new AV.Query('Tool');
            q3.equalTo('recipe', q1);
            q3.notContainedIn('objectId', r21);
            q3.find().then(function (rz) {
              AV.Object.destroyAll(rz);
              // console.log('排除后的结果',o)
              message.success('【' + title + '】已更新');
            })
          }
        });
      }).catch((e)=> {
        message.error(e.message);
      })
    });
  }
  // 重置事件
  handleReset = (e) => {
    e.preventDefault();
    this.props.form.resetFields();
  }
  // 校验ID函数
  // checkNum = (rule, value, callback) => {
  //   if (value < 1000000 || value > 9999999) {
  //     callback(new Error('请输入7位数字'));
  //   } else {
  //     callback();
  //   }
  // }
  // 增加删除项

  remove = (k) => {
    const {form} = this.props;
    // can use data-binding to get
    let keys = form.getFieldValue('keys');
    keys = keys.filter((key) => {
      return key !== k;
    });
    // can use data-binding to set
    form.setFieldsValue({
      keys,
    });
  }

  add = () => {
    console.log(this.props);
    this.uuid++;
    const {form} = this.props;
    // can use data-binding to get
    let keys = form.getFieldValue('keys');
    console.log('1111keys',keys);
    console.log('2222this.uuid',this.uuid);
    keys = keys.concat(this.uuid);
    console.log('3333',keys);
    // can use data-binding to set
    // important! notify form to detect changes
    form.setFieldsValue({
      keys,
    });
  }

  render() {

    {/*定义表格元素样式*/
    }
    const formItemLayout = {
      labelCol: {span: 6},
      wrapperCol: {span: 10},
    };

    {/*解构赋值*/
    }
    const {getFieldProps, getFieldValue, getFieldError, isFieldValidating} = this.props.form;

    {/*接收参数*/
    }
    const id = this.props.id;


    getFieldProps('keys', {
      initialValue: [0],
    });

    getFieldProps('tools', {
      initialValue: [],
    });

    // getFieldProps('cook', {
    //   initialValue: {},
    // });

    var date = new Date()

    const title = getFieldProps('title', {
      rules: [
        { required: true, max:120, message: '必填，且小于120个字符' }
      ],
      initialValue: u.time(date),
    });

    const desc = getFieldProps('desc', {
      rules: [
        { required: true, max:1000, message: '必填，且小于1000个字符' }
      ]
    });

    const sn = getFieldProps('sn', {
      rules: [
        { required: true, min:4,max:4, message: '必填，4位数字' }
      ]
    });



    // var data = [{objectId:'54a224b3e4b0f1d1aea96f02',username:'hahahhah'}]

    // if (getFieldValue('cook.objectId')) {
    //
    //
    // } else {
    //   var data = []
    // }
    // 应为loading后才载入 去掉了判断
    // var data = [{objectId: getFieldValue('cook.objectId'), username: getFieldValue('cook.username')}]
    class SortableItem extends React.Component {
      render() {
        return (
            <SortableContainer>
              <div>
                your item
              </div>
            </SortableContainer>
        );
      }
    };

    // console.log('默认值',data)
    const formItems = getFieldValue('keys').map((k) => {
      return (
        //外面来一层拖拽组件

        <Form.Item {...formItemLayout}
            label={`标签${k}：`} key={k}
            sortData="{k}">
          <SortableContainer>
          <ToolSelect {...this.props} k={k} data={this.state.tools}/>
          <Input
            placeholder="用量"
            style={{ width: 100 }}
            {...getFieldProps(`tools.${k}.qty`,{
              rules: [
                { required: true, max:20, message: '必填，且小于20个字符' }
              ]
            })}/>
          <RadioGroup
            // name="status"
            {...getFieldProps(`tools.${k}.isCat`,{
              // rules: [
              //   { required: true, message: '必选' }
              // ]
            })}>
            <RadioButton value={true}>启动中</RadioButton>
            <RadioButton value={false}>暂停中</RadioButton>
          </RadioGroup>
          <Button onClick={() => this.remove(k)}>删除</Button>
          </SortableContainer>
        </Form.Item>



      );
    });
    const form =
      <div id="formWrapper">
        <Form horizontal>
          <FormItem {...formItemLayout} label="标题：">
            <Input type="text" {...title} />
          </FormItem>
          <FormItem {...formItemLayout} label="描述：">
            <Input type="textarea" {...desc} />
          </FormItem>
          <FormItem {...formItemLayout} label="序号：">
            <Input type="number" {...sn}/>
          </FormItem>
          <FormItem {...formItemLayout} label="作者：">
            <CookSelect {...this.props} data={this.state.cook}/>
          </FormItem>
            {formItems}
          <FormItem wrapperCol={{ span: 12, offset: 7 }}>
            <Button onClick={this.add} style={{ marginRight: 8 }}>新增好朋友</Button>
            <Button type="primary" onClick={this.handleSubmit}>确定</Button>&nbsp;&nbsp;&nbsp;
            <Button type="ghost" onClick={this.handleReset}>重置</Button>
          </FormItem>
        </Form>
      </div>

    const loading =
      <div>
        <i className="fa fa-cog fa-spin fa-3x fa-fw"></i>
      </div>

    return this.state.loading ? loading : form
      ;
  }
}

// 再包装一层
let EditForm = Form.create()(Editform);
export default EditForm;