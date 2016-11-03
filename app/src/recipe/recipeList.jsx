import React from 'react';
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
//import Header from './components/header.jsx';
//import BtnForm from './components/modalForm.jsx';

export default class Antdes extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      pagination: {size:'large'},
      loading: false,
      // 默认排序
      sortedInfo: {
        order: 'descend',
        columnKey: 'updatedAt',
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
      //排序 按照
      if(params.sortOrder === 'descend'){
        q.descending(params.sortField);
      }else{
        q.ascending(params.sortField);
      }

      q.find().then((r2)=> {
        //批量操作
        r2.map((i)=> {
          //最近更新时间
          i.updatedAt = u.time(i.updatedAt, 'now');
          //第一次创建时间 固定 不会被改变
          i.createdAt = u.time(i.createdAt);
        });
        //克隆r2
        let r3 = JSON.parse(JSON.stringify(r2));
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
      sortedInfo: {
        order: sorter.order,
        field:sorter.field,
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

    let { sortedInfo } = this.state;
    sortedInfo = sortedInfo || {};
    /*定义表格列*/
    const columns = [
      {
        title: '名称',
        dataIndex: 'title',
        sorter: true,
        // render: title => `${title.first} ${title.last}`,
        width: '40%',
        key: 'objectId',
        sortOrder: sortedInfo.columnKey === 'title' && sortedInfo.order,
        render: (t, r)  => <a href={r.image?r.image.url:'#'} target='_blank'>{t}</a>,
      },
      {
        width: '10%',
        title: '作品序号',
        dataIndex: 'sn',
        //默认排序
        key: 'indexForSort',
        sorter: true,
        sortOrder: sortedInfo.columnKey === 'updatedAt' && sortedInfo.order,
        render: (t, r)  => <a href={r.video?r.video.url:'#'} target='_blank'>{t}</a>,
      },
      {
        width: '5%',
        title: '更新时间',
        dataIndex: 'updatedAt',
        sorter: true,
        sortOrder: sortedInfo.columnKey === 'updatedAt' && sortedInfo.order,
      },
      {
        width: '10%',
        title: '创建日期',
        dataIndex: 'createdAt',
        //key: 'indexForSort',
        sorter: true,
        sortOrder: sortedInfo.columnKey === 'createdAt' && sortedInfo.order,
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
        {/* <Button onClick={this.reload}>查询</Button>
        <Header />*/}
        <div id="table">
          <Table
            columns={columns}
            rowKey='objectId'
            size="middle"
            rowKey={record => record.registered}
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