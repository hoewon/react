import React from 'react';
//import { Router} from 'react-router'
import {Table, Icon, Tooltip, Button, message} from 'antd';

import { Link } from 'react-router';


// 引入标准Fetch及IE兼容依赖
import 'whatwg-fetch';
import 'es6-promise/dist/es6-promise.min.js';
import 'fetch-ie8/fetch.js';

import AV from 'leancloud-storage';

const u = require('../utils/utils');

import './list.less';
// 引入组件
import Title from '../components/title.jsx';
import Header from './components/header.jsx';
import BtnForm from './components/modalForm.jsx';

export default class Antdes extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      publishedAt:'',
      pagination: {size:'large'},
      loading: false,
      // 默认排序,
      filteredInfo:null,
      sortedInfo: {
        order: 'descend',
        //在这尝试排序ss
        columnKey: 'updatedAt',
        //columnKey: 'publishedAt'
      },
    }
  }

  componentDidMount() {
    let { sortedInfo } = this.state;
    sortedInfo = sortedInfo || {};
    this.fetch({limit:10,page:1,sortField:sortedInfo.columnKey,sortOrder:sortedInfo.order});
  }
  //columnKey
  displayAlert = () => {
    console.log('blablabla')
  }

  // 获取表格数据 function
  fetch = (params) => {

    this.setState({ loading: true });
    var q = new AV.Query("Recipe");
    q.count().then((count)=>{
      //定义查询条数
      q.limit(params.limit);
      //定义翻转页数
      q.skip(params.limit*(params.page-1));
      // 想在查询的同时获取关联对象的属性则一定要使用 `include` 接口用来指定返回的 `key`
      q.include('image');
      q.include('video');
      //q.include('createdAt');
      //q.include('updateAt');
      //排序 按照
      if(params.sortOrder === 'descend'){
        q.descending(params.sortField);
      }else{
        q.ascending(params.sortField);
      }

      q.find().then((r2)=> {
        //批量操作
        console.log('bbbbbb',r2[1]);

        //console.log(r2.updatedAt+'c');

        //克隆r3 固定用法 解析av数据
        //JSON.parse();JSON.stringify
        let r3 = JSON.parse(JSON.stringify(r2));
        console.log('r3',r3);
        //console.log(u.formatDate(new   Date()));
        r3.map((i)=> {
          //console.log('iiiiii',i);
          //最近更新时间
          i.updatedAt = u.time(i.updatedAt,'now');
          i.thistime = u.formatDate(new Date());
          //console.log('i.thistime',i.thistime)
          //第一次创建时间 固定 不会被改变
          i.createdAt = u.time(i.createdAt);
          //console.log(i.publishedAt.iso)
          i.publishedAt = u.time(i.publishedAt.iso);
          console.log(i.publishedAt);
          console.log(i.thistime);
          if(i.publishedAt<i.thistime){
            //  发布时间小于当前时间不变色
          i.timed = true;
          }else{
            //发布时间大于当前时间 变红
          i.timed= false
          }

          console.log(i.timed);
        });
        let pagination = this.state.pagination;
        // console.log('recipe列表', r3);

        pagination.total = count;

        this.setState({
          loading: false,
          data: r3,
          pagination,
        });
      }).catch((e) => {//批量操作的错误提示
        message.error(e.message);
      });
    }).catch((e) => {//查询的错误提示
      message.error(e.message);
    });
  }
  //function
  handleTableChange = (pagination, filters, sorter) =>{

    this.setState({
      filteredInfo: filters,
      sortedInfo: {
        order: sorter.order,
        columnKey: sorter.field,
      },
    });

    const pager = this.state.pagination;
    pager.current = pagination.current;
    this.setState({
      pagination: pager,
    });

    this.fetch({
      limit: pagination.pageSize,
      page: pagination.current,
      sortField: sorter.field,
      sortOrder: sorter.order,
      ...filters,
    });
  }

  render() {

    let { sortedInfo/*,filteredInfo*/ } = this.state;
    sortedInfo = sortedInfo || {};
    //
    //filteredInfo = filteredInfo || {};
    /*定义表格列*/
    const columns = [
      {
        title: '名称',
        dataIndex: 'title',
        sorter: true,
        // render: title => `${title.first} ${title.last}`,
        width: '40%',
        key: 'objectId',
        //filteredValue: filteredInfo.title,
        sortOrder: sortedInfo.columnKey === 'title' && sortedInfo.order,
        render: (t, r)  => <a href={r.image?r.image.url:'#'} target='_blank'>{t}</a>,
      },
      {
        width: '10%',
        title: '作品序号',
        dataIndex: 'sn',
        key: 'indexForSort',
        sorter: true,
        //
        //filteredValue: filteredInfo.sn,
        sortOrder: sortedInfo.columnKey === 'sn' && sortedInfo.order,
        render: (t, r)  => <a href={r.video?r.video.url:'#'} target='_blank'>{t}</a>,
      },
      //
      {
        width: '10%',
        title: '视频地址',
        dataIndex: 'address',
        render: (t, r)  => <a href={r.video?r.video.url:'#'} target='_blank'>{r.video?r.video.url:'#'}</a>,


      },
      //
      {
        width: '5%',
        title: '更新时间',
        dataIndex: 'updatedAt',
        sorter: true,
        //
        //filteredValue: filteredInfo.updateAt,
        sortOrder: sortedInfo.columnKey === 'updatedAt' && sortedInfo.order,
      },
      {

        width: '5%',
        title: '创建日期',
        dataIndex: 'createdAt',
        //key: 'indexForSort',
        //
        //filteredValue: filteredInfo.createdAt,
        sorter: true,
        sortOrder: sortedInfo.columnKey === 'createdAt' && sortedInfo.order,

      },
      {
        width: '10%',
        title: '发布日期',
        dataIndex: 'publishedAt',

        //
        //filteredValue: filteredInfo.createdAt,
        sorter: true,
        sortOrder: sortedInfo.columnKey === 'publishedAt' && sortedInfo.order,
        render:(t,r) =><div className={r.timed?'':'red'}  >{r.publishedAt}</div>,
      },
      {
        width: '5%',
        title: '操作',
        dataIndex: 'handle',
        render: (t, r, i) => (
            <Tooltip title="编辑"><Link to={"/recipe/edit/"+(r.objectId)}>
              <i className="fa fa-pencil"/></Link>
            </Tooltip>
        )
      }];

    return (
        <div id="wrap">
          <Title titleName="标签" onMouseOver={this.displayAlert}/>
          <Button onClick={this.reload}>查询</Button>
          <Header />
          <div id="table">
            <Table

                columns={columns}
                rowKey='objectId'
                size="middle"
                rowKey={record => record.objectId}
                dataSource={this.state.data}
                pagination={this.state.pagination}
                loading={this.state.loading}
                onChange={this.handleTableChange}
            />

          </div>
        </div>
    )
  }

}