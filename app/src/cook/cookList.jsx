import React from 'react';
import {Table, Icon, Tooltip, Button, message} from 'antd';

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

  displayAlert = () => {
    console.log('blablabla')
  }

  // 获取表格数据
  fetch = (params) => {

    this.setState({ loading: true });
    var q = new AV.Query("_User");
    q.count().then((count)=>{
      q.limit(params.limit);
      q.skip(params.limit*(params.page-1));

      if(params.sortOrder === 'descend'){
        q.descending(params.sortField);
      }else{
        q.ascending(params.sortField);
      }

      q.find().then((r2)=> {
        r2.map((i)=> {
          i.updatedAt = u.time(i.updatedAt, 'now');
          i.createdAt = u.time(i.createdAt);
        })
        let r3 = JSON.parse(JSON.stringify(r2));
        let pagination = this.state.pagination;
        pagination.total = count;

        this.setState({
          loading: false,
          data: r3,
          pagination,
        });
      }).catch((e) => {
        message.error(e.message);
      });
    }).catch((e) => {
      message.error(e.message);
    });
  }

  handleTableChange = (pagination, filters, sorter) =>{

    this.setState({
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

    let { sortedInfo } = this.state;
    sortedInfo = sortedInfo || {};
    /*定义表格列*/
    const columns = [
      {
        title: '用户名',
        dataIndex: 'username',
        sorter: true,
        // render: title => `${title.first} ${title.last}`,
        width: '40%',
        key: 'objectId',
        sortOrder: sortedInfo.columnKey === 'username' && sortedInfo.order,
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
        key: 'indexForSort',
        sorter: true,
        sortOrder: sortedInfo.columnKey === 'createdAt' && sortedInfo.order,
      },
      {
        width: '5%',
        title: '操作',
        dataIndex: 'handle',
        render: (t, r, i) => (
          <BtnForm isNew={false} id={r.objectId}/>
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