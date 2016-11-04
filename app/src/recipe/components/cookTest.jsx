import React from 'react';
import {Button, Checkbox, Select, Radio, Form, Row, Col, Icon, Input, InputNumber, message} from 'antd';

import './editForm.less';

const FormItem = Form.Item;
const RadioGroup = Radio.Group;
const RadioButton = Radio.Button;


import AV from 'leancloud-storage';
const Recipe = AV.Object.extend('Recipe');
const Tool = AV.Object.extend('Tool');


const u = require('../../utils/utils');
const d = require('../../utils/data');