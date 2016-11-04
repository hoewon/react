import React from 'react';
import {Breadcrumb} from 'antd';
import {Link} from 'react-router';
import EditForm from './components/editForm.jsx';

export default class EditPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {}
    }

    render() {
        const titleStyle = {
            padding: '10px 20px',
            background: '#ECECEC',
            marginBottom: 10,
            letterSpacing: 4,
            borderRadius: 5,
            fontSize: 20,
            overflow: 'hidden',
        };

        const id = this.props.params.rowId;
        return (
            <div>
                <div style={titleStyle}>

                    {/*面包屑导航*/}
                    <Breadcrumb separator=">">
                        <Breadcrumb.Item><Link to="/recipe">视频列表</Link></Breadcrumb.Item>
                        {/*从路由中获得的参数*/}
                        <Breadcrumb.Item>{(id === 'add') ? '新建视频' : '编辑视频'}</Breadcrumb.Item>
                    </Breadcrumb>
                </div>
                <EditForm id={id}/>
            </div>
        );
    }
}