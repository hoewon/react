import React from 'react';
import {
    Button,
    Checkbox,
    Select,
    Radio,
    Switch,
    Form,
    Row,
    Col,
    Icon,
    Modal,
    Input,
    InputNumber,
    Cascader,
    Tooltip,
    Popconfirm,
    message
} from 'antd';

const FormItem = Form.Item;
const RadioGroup = Radio.Group;


import AV from 'leancloud-storage';
const Category = AV.Object.extend('Category');


class AformInModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      // id:props.objectId
    }
  }

  // 弹出框设置
  showModal = () => {
    this.setState({visible: true});
  }
  handleCancel = (e) => {
    this.setState({visible: false});
  }
  // 单击确定按钮提交表单
  handleSubmit = () => {

    // 判断是否有ID然后去更新
    if (this.props.id) {
      var cat = AV.Object.createWithoutData('Category', this.props.id);
    } else {
      // console.log(this.props.form.getFieldsValue());
      var cat = new Category();
    }
    cat.set('title', this.props.form.getFieldsValue().title);
    cat.save().then((o)=> {
      this.setState({visible: false});
      let title = o.attributes.title

      message.success(this.props.isNew ? '新建【' + title + '】完成' : '【' + title + '】已经更新');
    }).catch((e)=> {
      message.error(e.message);
    })


  }


  editForm(id) {
    // console.log(id)
    var query = new AV.Query('Category');
    query.get(id).then((r)=> {

      let o = JSON.parse(JSON.stringify(r));

      this.props.form.setFieldsValue(o);
      this.setState({visible: true});
    }).catch((e)=> {
      message.error(e.message);
    })
  }

  confirmDel() {
    // console.log(this.props)
    var todo = AV.Object.createWithoutData('Category', this.props.id);
    todo.destroy().then(()=> {
      message.success('这是一条成功提示');
    }).catch((e)=> {
      message.error(e.message);
    })
    // message.info('点击了确定');
  }

  render() {

    const formItemLayout = {
      labelCol: {span: 6},
      wrapperCol: {span: 16},
    };

    const {getFieldProps} = this.props.form;
    // console.log(this.props.form);

    return (
        <div>
          {
              this.props.isNew
                  ? <Button type="primary" onClick={this.showModal} size="large">新建标签</Button>
                  : <span>
                <Tooltip title="编辑" placement="left" onClick={()=>this.editForm(this.props.id)}>
                  <i className="fa fa-pencil"/>
                </Tooltip>&nbsp;&nbsp;
                <Popconfirm placement="topRight" title='确定要删除这个标签吗？' onConfirm={this.confirmDel} {...this.props}>
                  <Tooltip title="删除" placement="right"><i className="fa fa-trash" style={{color:'#FD5B5B'}}/></Tooltip>
                </Popconfirm>
           </span>
              }
          <Modal title="新建广告系列" visible={this.state.visible} onOk={this.handleSubmit} onCancel={this.handleCancel}>
            <Form horizontal form={this.props.form}>
              <FormItem {...formItemLayout} label="标签名称：">
                <Input type="text" {...getFieldProps('title')} />
              </FormItem>
            </Form>
          </Modal>
        </div>
    )
  }
}

let Btnform = Form.create()(AformInModal);
export default Btnform;