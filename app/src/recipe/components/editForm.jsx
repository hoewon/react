import React from 'react';
import {Button,DatePicker, Checkbox, Select, Radio, Form, Row, Col, Icon, Input, InputNumber, message} from 'antd';

const FormItem = Form.Item;
const RadioGroup = Radio.Group;
const RadioButton = Radio.Button;

import AV from 'leancloud-storage';
const Recipe = AV.Object.extend('Recipe');
//const Tool = AV.Object.extend('Tool');
const Tag = AV.Object.extend('Tag');
const m = require('moment');

import ToolSelect from './toolSelect.jsx';
import CookSelect from './cookSelect.jsx';

const u = require('../../utils/utils');
//拖拽排序组件
//import React from 'react';
import Dragula from 'react-dragula';
//import '../../../../node_modules/dragula/dragula'

//
//
//
//import HTML5Backend from 'react-dnd-html5-backend';
//import { DragDropContext } from 'react-dnd';
////把应用的根组件包装在 DragDropContext 中
//export default DragDropContext(HTML5Backend)(form);
///*---------------------------*/
//// 2把可以拖拽的组件包装在 DragSource 中
////设置 type
////设置 spec，让组件可以响应拖拽事件
////设置 collect，把拖拽过程中需要信息注入组件的 props
//import { DragSource } from 'react-dnd';
//// 唯一
//const type ='aaa';
////响应拖拽事件
//const spec={}
//
//
//;
////返回object注入props
//function collect(connect, monitor) { ... }
//export default DragSource(type, spec, collect)(formItems);
///*---------------------------*/
//// 3把可以接受拖拽的组件包装在 DropTarget 中
////设置 type
////设置 spec，让组件可以响应拖拽事件
////设置 collect，把拖拽过程中需要信息注入组件的 props
//import { DropTarget } from 'react-dnd';
//
//export default DropTarget(types, spec, collect)(formItems);
//
import './editForm.less';

//function updateTool(r, c) {
//  // r=recipe c=category
//
//
//  return new AV.Promise(function (resolve) {
//    // 这个c必须存在 c.id .isCat .qty
//    var category = AV.Object.createWithoutData('Category', c.objectId);
//    // 用r跟c取值，如果存在，则更新，如果不存在，则新建
//    var q1 = new AV.Query('Tag');
//    q1.equalTo('recipe', r);
//    q1.equalTo('category', category);
//    q1.first().then(function (r1) {
//      if (r1 === undefined) {
//        var q2 = new Tool();
//        q2.set('recipe', r);
//        q2.set('category', category);
//      } else {
//        var q2 = r1;
//      }
//      q2.set('isCat', c.isCat);
//      q2.set('qty', c.qty);
//      q2.save().then((r2)=> {
//        resolve(r2);
//      });
//    });
//  })
//};


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
      console.log('id',id);
      q1.get(id).then((r1)=> {
        console.log('r11111',r1);
        var q2 = new AV.Query('Tag');
        q2.ascending('sort');
        q2.include('category');
        q2.equalTo('recipe', r1);
        q2.find().then((r2)=> {

         //let r4=JSON.parse(JSON.stringify(r2))
         // console.log('r4',r4)
          console.log('r2',r2)
          let r3 = r2.map((o)=> {
            console.log('o',o);
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
          //r1.set('sort', keys);

          let rz = u.n2s(JSON.parse(JSON.stringify(r1)));
           console.log('初始表单内容→→→→→', rz);




          //把txt属性加入rz中，sort用的也是这种方式。
        rz.txt= rz.desc.replace(/<br\/>/g,"\n");
          rz.time= u.time(r1.attributes.publishedAt);
          rz.sn=parseInt(rz.sn)
          this.uuid = keys.length-1;
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
//发布时间
onChange=(value, dateString)=> {
  console.log('Selected Time: ', value);
  console.log('Formatted Selected Time: ', dateString);
  const {form} = this.props;
  // can use data-binding to get
  let time = form.getFieldValue('time');
  form.setFieldsValue({
   time:u.time(value)
  });
}
  handleSubmit = (e) => {
    const id = this.props.id;
    e.preventDefault();
    this.props.form.validateFields((errors, values) => {
      var tools = u.s2n(values.tools);
       console.log('values.desc',values);
      if (!!errors) {
        message.error('表单中有错误，请检查');
        return;
      }
      if (id === 'add') {
        var q1 = new Recipe();
      } else {
        var q1 = AV.Object.createWithoutData('Recipe', this.props.id);
        //console.log('qqq',q1);
      }
      var cook = AV.Object.createWithoutData('_User', values.cook.objectId);
      // console.log('提交结果',cook);
      console.log('q1',q1);
      //{"__type":"Date","iso":"2019-06-29T01:39:35.931Z"}
      const times = m(values.time).toISOString();
      console.log('times',times);
      const published ={
        "__type":"Date","iso":times
      }

      q1.set('publishedAt',published);
      q1.set('user', cook);
      console.log('title',values.title)
      q1.set('title', values.title);
      q1.set('duration', values.duration);

      q1.set('sn', parseInt(values.sn));
      //正则匹配换行符\n 存储称<br/>
      let text =values.txt.replace(/\n/g,"<br/>");
      q1.set('desc',text );
      // title,sn,desc,image,video,
      q1.save().then(()=> {
        this.setState({visible: false});
      //  AV.Promise.all(
      //    Object.keys(tools).map((k)=> {
      //      //return updateTool(r1, tools[k])
      //    })
      //  ).then((r2)=> {
      //    console.log('r2',r2)
      //    var r21 = r2.map((o)=> {
      //      return o.id
          });

          //let title = r1.attributes.title;

          if (id === 'add') {
            //message.success('上传【' + title + '】完成');
          } else {
            //var q3 = new AV.Query('Tag');
            //q3.equalTo('recipe', q1);
            //q3.notContainedIn('objectId', r21);
            //q3.find().then(function (rz) {
            //  AV.Object.destroyAll(rz);
              // console.log('排除后的结果',o)
              message.success('【' +values.title + '】已更新');
            //})
          }
        });
      //}).catch((e)=> {
      //  message.error(e.message);
      //})
    //});
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
    console.log('kkk',k);
    let keys = form.getFieldValue('keys');
    keys = keys.filter((key) => {
      return key !== k;
    });

      const id = this.props.id;
      var q1 = new AV.Query('Recipe');
      q1.include('image');
      q1.include('user');
      q1.get(id).then((r1)=> {
        var q2 = new AV.Query('Tag');
        q2.include('category');
        console.log('r1', r1.id);
        q2.equalTo('recipe', r1);
        q2.find().then((r2)=> {

          console.log('r2', r2[0].attributes.sort);

          let r3 = r2.map((o)=> {
            console.log('o',o.attributes.sort);
            if(k==o.attributes.sort){
              let tag = AV.Object.createWithoutData('Tag', o.id);
                  tag.destroy().then(
                        function (success) {
                           //删除成功
                  alert('删除成功')
                  }, function (error) {
                     //删除失败
                  alert('失败')

                        });
            }
          })
        })
      })

    // can use data-binding to set
    form.setFieldsValue({
      keys,
    });
    //const key = number.text().trim().split('标签');
    //console.log('bbbbb',key)
    //const id = this.props.id;
    ////继承应该是大写，之前一直小写，取不出数据
    //let recipe = AV.Object.createWithoutData('Recipe', id);

  }

  sort=()=>{
    const number = $('.key');
    console.log('key',number.text().trim());
    //replace
    const key = number.text().trim().split('标签');
    console.log('b',key)
    let a=[]
    for(let i =1;i<key.length;i++){

        a[i-1]=(key[i]);
      }
    let c=[]
    console.log('a',a)
    a.map((b)=>{
      console.log('b',b);

      c.push(parseInt(b));

    })

    const {form} = this.props;
    let keys = form.getFieldValue('keys');
    let tools= form.getFieldValue('tools');


    this.setState({keys:c})
    //form.setFieldsValue({
    //  keys:c
    //});
    this.props.form.validateFields((errors, values) =>{
      var tools = u.s2n(values.tools);
      console.log('values',values);
      console.log('keys',keys);
      console.log('tools',tools);

      console.log('c',c);
      //结果
      let arr=[];
      for(let i=0;i<=c.length-1;i++){
        const a =tools[c[i]];
       a.sort=i;
       //let b = Object.assign(a,sort)
    console.log('a',a);


        arr.push(a);
      }
      console.log('arr',arr);


      const id = this.props.id;
      //继承应该是大写，之前一直小写，取不出数据
      let recipe = AV.Object.createWithoutData('Recipe', id);


      function updateTags (cat){

        return new AV.Promise(function (resolve) {
          let q1 = new AV.Query(Tag);
          let category = AV.Object.createWithoutData('Category', cat.objectId);
          //console.log('category',category)

          //console.log('q1',q1)
          //console.log('2');
          q1.equalTo('category', category);

          q1.equalTo('recipe', recipe);
          console.log('recipe',recipe);
          q1.first().then(function (r1) {
          console.log('r1',r1);
            if(r1 === undefined){

              // 新建对象
              var r2 = new Tag();

              console.log('r2');
              r2.set('category', category);
              r2.set('recipe', recipe);
              console.log('aa',r2);
              //   其余参数
              console.log('cat',cat)
              r2.set('isCat', cat.isCat);
              r2.set('qty', cat.qty);
              r2.set('sort', cat.sort);
              r2.save().then(()=>{
                resolve(r2)
                console.log('a');
              })
            }else{

              console.log('aa',r1);
              //   其余参数
              r1.set('category', category);
              r1.set('recipe', recipe);
              r1.set('isCat', cat.isCat);
              r1.set('qty', cat.qty);
              r1.set('sort', cat.sort);
              r1.save().then(()=>{
                resolve(r1)
                console.log('a');
              })
            }

          })
        })
      }

      // 存储开始 显示圈
      AV.Promise.all(arr.map((o) => {
        return updateTags(o)
      })).then((r) => {
        //   存储成功 关闭圈
        message.success('完成');
      })
    })

    //let recipe = values.objectId;





}
  add = () => {
    console.log(this.props);
    this.uuid++;
    const {form} = this.props;
    // can use data-binding to get
    let keys = form.getFieldValue('keys');
    keys = keys.concat(this.uuid);
    // can use data-binding to set
    // important! notify form to detect changes
    form.setFieldsValue({
      keys,
    });
  }
  dragDecorator = (componentBackingInstance) => {
  if (componentBackingInstance) {
    let options = { };
    Dragula([componentBackingInstance],{
      removeOnSpill: true
    }, options)
        .on('over', function (e1) {
      console.log('over',e1);
    }).on('drop', function (e2,target) {
      console.log('drop',e2.id);
      //let keys = form.getFieldValue('keys');
      console.log('drop',target);

    }).on('over', function (e3, container,source) {


    }).on('out', function (e4, container,source) {


    });

  }
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
    const time = getFieldProps('time');
    const desc = getFieldProps('txt', {
      rules: [
        { required: true, max:1000, message: '必填，且小于1000个字符' }
      ]

    });
    const duration=getFieldProps('duration');
//const time = getFieldProps('publishedAt.iso');
    const sn = getFieldProps('sn'
    //    , {
    //  rules: [
    //    { required: true, min:4,max:4, message: '必填，4位数字' }
    //  ]
    //}
    );


    // var data = [{objectId:'54a224b3e4b0f1d1aea96f02',username:'hahahhah'}]

    // if (getFieldValue('cook.objectId')) {
    //
    //
    // } else {
    //   var data = []
    // }
    // 应为loading后才载入 去掉了判断
    // var data = [{objectId: getFieldValue('cook.objectId'), username: getFieldValue('cook.username')}]

    // console.log('默认值',data)
    const formItems = getFieldValue('keys').map((k) => {
      return (
        //外面来一层拖拽组件
          <div             id={k} >
        <Form.Item {...formItemLayout}
            label={`标签${k}：`}
            key={k}
            sortData="{k}"
           data-id="{k}"
            className="key"
        >

          <ToolSelect {...this.props} k={k} data={this.state.tools}/>
          <Input
            placeholder="用量"
            style={{ width: 100 }}
            {...getFieldProps(`tools.${k}.qty`
            //    ,{
            //  rules: [
            //    { required: true, max:20, message: '必填，且小于20个字符' }
            //  ]
            //}
            )}/>
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
        </Form.Item>
          </div>


      );
    });
    //const SortableItem =getFieldValue('keys').map((k) =>{
    //  console.log('kkkakak',k)
    //  return (
    //
    //    <SortableContainer key={k} sortData="{k}">
    //      <div>
    //        {formItems}
    //      </div>
    //    </SortableContainer>
    //  );
    //});
    const form =
      <div id="formWrapper"  >
        <Form horizontal>
          <FormItem {...formItemLayout} label="标题：">
            <Input type="text" {...title} />
          </FormItem>

          <FormItem{...formItemLayout} label="发布时间：">
          <DatePicker   showTime
              {...time}

                        onChange={this.onChange}/>
            </FormItem>
          <FormItem {...formItemLayout} label="描述：">
            <Input type="textarea"  {...desc} autosize={{ minRows: 2, maxRows: 6 }}/>
          </FormItem>
          <FormItem {...formItemLayout} label="序号：">
            <Input type="number" {...sn}/>
          </FormItem>
          <FormItem {...formItemLayout} label="时长">
            <Input type="text" {...duration} />
          </FormItem>
          <FormItem {...formItemLayout} label="作者：">
            <CookSelect {...this.props} data={this.state.cook}/>
          </FormItem>
          <div ref={this.dragDecorator}>
          {formItems}
            </div>
          <FormItem wrapperCol={{ span: 12, offset: 7 }}>
            <Button onClick={this.add}  style={{ marginRight: 8 }}>新增好朋友</Button>
            <Button type="primary" onClick={this.handleSubmit}>确定</Button>&nbsp;&nbsp;&nbsp;
            <Button type="ghost" onClick={this.handleReset}>重置</Button>
            <Button  onClick={this.sort}>排序</Button>
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

