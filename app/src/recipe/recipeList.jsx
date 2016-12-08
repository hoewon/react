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
      a:'',
      pagination: {size:'large'},
      loading: false,
      // 默认排序,
      filteredInfo:null,
      sortedInfo: {
        order: 'descend',
        //在这尝试排序ss
        columnKey: 'sn',
        //columnKey: 'publishedAt'
      },
    }
  }

  componentDidMount() {
    let { sortedInfo } = this.state;
    sortedInfo = sortedInfo || {};
    this.fetch({limit:10,page:1,sortField:sortedInfo.columnKey,sortOrder:sortedInfo.order});
  }
  url=()=>{}
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
        //console.log(r2.updatedAt+'c');

        console.log('bbbbbb',r2[1]);

        //克隆r3 固定用法 解析av数据
        //JSON.parse();JSON.stringify


        let r3 = JSON.parse(JSON.stringify(r2));
        console.log('r3',r3);
        let aaa=0;
        r3.map((i)=> {
          var query = new AV.Query('Route');
          query.equalTo('uid', i.objectId);
          query.find().then(function (o) {
            console.log('i',i);
            let r4 = JSON.parse(JSON.stringify(o));
            console.log('r4',r4[0]);

            if(r4[0]==undefined){
              console.log('空')
              r4[0]={
                createdAt:"2016-11-03T03:55:44.232Z",
                objectId: aaa,
                type: "recipe",
                uid: aaa,
                updatedAt: "2016-11-03T03:55:44.232Z",
                url: 'http://snaku.tv/'+"#"
              }

              console.log('赋值',r4[0])
            }else{

              r4[0].url='http://snaku.tv/'+r4[0].url;
              console.log('有')
            }
            aaa++;

             let www = Object.assign(i,r4[0]);
            console.log('www',www);
            //最近更新时间


          })
          i.updatedAt = u.time(i.updatedAt,'now');
          i.thistime = u.formatDate(new Date());
          //i.url = priorityEqualsZeroTodos.url;
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
        //  let that = this;
        //  //console.log('iiiiii',i);
        //  console.log(i.objectId);
        //  var query = new AV.Query('Route');
        //  query.equalTo('uid', i.objectId);
        //  query.find().then(function (results) {
        //    let a = that.state.a;
        //    var p =JSON.parse(JSON.stringify(results));
        //    //console.log('results',results);
        //    console.log('lailai',p[0].url);
        //
        //  }, function (error) {
        //  });

        });

          console.log('aar3',r3);
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
        width: '30%',
        key: 'objectId',
        //filteredValue: filteredInfo.title,
        sortOrder: sortedInfo.columnKey === 'title' && sortedInfo.order,
        render: (t, r)  => <a href={r.url? r.url:'#'} target='_blank'>{t}</a>,
      },
      {
        width: '10%',
        title: 'url',
        dataIndex: 'url',
        key: 'index',
        //sorter: true,
        //
        //filteredValue: filteredInfo.sn,
        sortOrder: sortedInfo.columnKey === 'url' && sortedInfo.order,
        render: (t, r)  => <a href={r.url? r.url:'#'} target='_blank'>{t}</a>,
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