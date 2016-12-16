import React from 'react';
import ReactDOM from 'react-dom';
import createHistory from 'history/lib/createHashHistory';
const history = createHistory();

// 引入单个页面（包括嵌套的子页面）
import Init from './main.jsx';
import Welcome from './welcome/welcome.jsx';
//import Profile from './profile/profile.jsx';
import Recipe from './recipe/recipeList.jsx';
import RecipeEdit from'./recipe/recipeEdit.jsx';
import Category from './category/categoryList.jsx';
import Campaign from './campaign/campaign.jsx';
import Edit from './edit/edit.jsx';
import Counter from './counter/counter.jsx';
import Charts from './charts/charts.jsx';
import Last from './last/last.jsx';
import NotFoundPage from './nofind/nofind.jsx';
import Login from './login/login.jsx';
import Cook from './cook/cookList.jsx';

// 引入垫片兼容IE
require('es5-shim');
require('es5-shim/es5-sham');
require('console-polyfill');

// 引入React-Router模块
import {Router, Route, Link, hashHistory, IndexRoute, Redirect, IndexLink} from 'react-router';

import AV from 'leancloud-storage';
AV.init({
    appId:'4s28kj56ii60yqy30pvxg19k7ssf38x8fo5x01veltmqwugx',
    appKey:'hxfq3kx6qo1ia2pau6z6k0a0z36tmbcl88l3fi8k4ixr3sjc'
});

AV.Promise.setPromisesAPlusCompliant(true);
AV.Promise.setDebugError(true);
//
// AV.initialize("4s28kj56ii60yqy30pvxg19k7ssf38x8fo5x01veltmqwugx", "hxfq3kx6qo1ia2pau6z6k0a0z36tmbcl88l3fi8k4ixr3sjc");
//
// // 开发环境
// AV.setProduction(0);

// 引入Antd组件
import {Menu, Icon} from 'antd';
const SubMenu = Menu.SubMenu;
// 配置路由，并将路由注入到id为init的DOM元素中
ReactDOM.render(
    <Router history={history} >        
        <Route path="/login" component={Login} />
        <Route path="/" component={Init} >
            <IndexRoute component={Welcome}/>
            { /*<Route path="profile" component={Profile} /> */}
            <Route path="recipe" component={Recipe}/>
           <Route path="recipe/edit/:rowId" component={RecipeEdit}/>
           <Route path="category" component={Category}/>
            <Route path="cook" component={Cook}/>
            <Route path="campaign" component={Campaign} />
            <Route path="counter" component={Counter} />
            <Route path="charts" component={Charts} />
            <Route path="last" component={Last} />
            <Route path="edit/:rowId" component={Edit} />
            {/* 404 */}
            <Route path='/404' component={NotFoundPage} />                    
            {/* 其他重定向到 404 */}
            <Redirect from='*' to='/404' />
        </Route>
    </Router>
    , document.querySelector('#init')

)

