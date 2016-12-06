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
    Upload,
    message
} from 'antd';

import { Link } from 'react-router';
//antd  的一套
const Dragger = Upload.Dragger;
const FormItem = Form.Item;
const RadioGroup = Radio.Group;
//av数据的一套

import AV from 'leancloud-storage';

const Recipe = AV.Object.extend('Recipe');
//function
class AformInModal extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            visible: false,
            // id:props.objectId
        }
    }
    // 弹出框设置
    showModal = ()=>{
        this.setState({visible: true});
    }
    //传e.取消点击
    handleCancel=(e)=>{
        this.setState({visible: false});
        message.error('取消');
    }
    // 单击确定按钮提交表单
    handleSubmit = ()=>{

        // 判断是否有ID然后去更新
        if (this.props.id) {
            //av.object.createWithoutData
            // 更新操作是覆盖式的，云端会根据最后一次提交到服务器的有效请求来更新数据。更新是字段级别的操作，未更新的字段不会产生变动，这一点请不用担心。
            //LeanStorage 上的更新对象都是针对单个对象，云端会根据有没有 objectId 来决定是新增还是更新一个对象。
            //第一个参数是 className，第二个参数是 objectId
            var c = AV.Object.createWithoutData('Recipe', this.props.id);
        } else {
            // console.log(this.props.form.getFieldsValue());
            var c = new Recipe();
        }
        c.set('title', this.props.form.getFieldsValue().title);
        c.set('sn', this.props.form.getFieldsValue().sn);
        c.set('desc', this.props.form.getFieldsValue().desc);
        // title,sn,desc,image,video,
        c.save().then((o)=> {
            this.setState({visible: false});
            let title = o.attributes.title

            message.success(this.props.isNew ? '上传【' + title + '】完成' : '【' + title + '】已经更新');
        }).catch((e)=> {
            message.error(e.message);
        })


    }


    editForm = (id) =>{
        // console.log(id)
        var q = new AV.Query('Recipe');
        q.include('image');
        q.get(id).then((r)=> {



            let o = JSON.parse(JSON.stringify(r));
            console.log(o);


            o.image = o.image.url;



            this.props.form.setFieldsValue(o);
            this.setState({visible: true});
        }).catch((e)=> {
            message.error(e.message);
        })
    }

    confirmDel = () =>{
        // console.log(this.props)
        var todo = AV.Object.createWithoutData('Category', this.props.id);
        todo.destroy().then(()=> {
            message.success('这是一条成功提示');
        }).catch((e)=> {
            message.error(e.message);
        })
        // message.info('点击了确定');
    }

    upload = (file)=>{

        console.log(file);

        return new AV.Promise((resolve)=>{
            var name = 'a.mp4';

            var avFile = new AV.File(name, file);
            avFile.save().then(function(obj) {
                // 数据保存成功
                console.log(obj.url());
                resolve(obj.url());

            }, function(error) {
                // 数据保存失败
                console.log(error);
            });
        })



        // console.log(this.props.form.getFieldsValue().image);

        //
        // var fileUploadControl = $('#photoFileUpload')[0];
        //
        // console.log(fileUploadControl);

    }

    handleUpload = (file)=>{
        // console.log(file.file);
        // var fileUploadControl = $('#photoFileUpload')[0];
        //
        // console.log(fileUploadControl);

        // JS不支持10mb以上文件的上传，等云代码解决吧，upload跨域


    }

    render() {

        const formItemLayout = {
            labelCol: {span: 6},
            wrapperCol: {span: 16},
        };

        const {getFieldProps} = this.props.form;
        // console.log(this.props.form);


        const upload = {
            name: 'file',
            // beforeUpload: (file)=>{this.upload(file)},
            // showUploadList: false,
            // uploadOnSelect: false
            action: 'http://snaku.tv/upload',
        };


        // <Popconfirm placement="topRight" title='确定要删除这个标签吗？' onConfirm={this.confirmDel} {...this.props}>
        //   <Tooltip title="删除" placement="right"><i className="fa fa-trash" style={{color:'#FD5B5B'}}/></Tooltip>
        // </Popconfirm>

        // 删除功能暂时不要了，

        return (
            <div>
                {
                    this.props.isNew
                        ? <Button type="primary" onClick={this.showModal} size="large">上传视频</Button>
                        : <span>
                <Tooltip title="编辑"><Link to={"/recipe/edit/"+(this.props.id)}>
                    <i className="fa fa-pencil"/></Link>
                </Tooltip>&nbsp;&nbsp;

           </span>
                    }
                <Modal title="新建广告系列" visible={this.state.visible} onOk={this.handleSubmit} onCancel={this.handleCancel}>
                    <Form horizontal form={this.props.form}>
                        <FormItem {...formItemLayout} label="标题：">
                            <Input type="text" {...getFieldProps('title')} />
                        </FormItem>
                        <FormItem {...formItemLayout} label="描述：">
                            <Input type="textarea" {...getFieldProps('desc')} />
                        </FormItem>
                        <FormItem {...formItemLayout} label="序号：">
                            <Input type="number" {...getFieldProps('sn')} />
                        </FormItem>
                        <FormItem {...formItemLayout} label="图片：">
                            <Upload {...upload}>
                                <Button type="ghost">
                                    <Icon type="upload" /> 点击上传
                                </Button>
                            </Upload>
                        </FormItem>
                    </Form>
                </Modal>
            </div>
        )
    }
}

let Btnform = Form.create()(AformInModal);
export default Btnform;