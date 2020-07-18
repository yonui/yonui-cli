import React from 'react';
import { Input } from 'yonui-ys';

import MDFComponent from './index';
import MetaConfig from './metaConfig';

// api 说明
// {
//   name: 字段属性名,
//   type: 属性类型,[array, bool, func, number, string, element, node ]
//   defaultValue: 默认值，
//   isMust: 是否必填，
//   desc: 属性描述
//  }
const api = [
  {
    name: 'value',
    defaultValue: 1,
    isMust: true,
    desc: '代表输入框值'
  },
  {
    name: 'className',
    defaultValue: 'default-class',
    isMust: false,
    desc: '控件样式名称'
  }
]

@MDFComponent({type: 'control'}) // @mdf 标识，参数改成对象模式，type，绑定模型是什么
@MetaConfig({name: '控件名字', api: api})
class Demo extends React.Component {
  constructor (props) {
    super(props)
    this.state = {}
  }

  open = () => {
    this.setState({
      open:true
    })
    this.props.onOpen()
  }

  handleChange = (e) => {
    const value = e && e.target ? e.target.value : e;
    const { afterValueChange } = this.props
    if (typeof afterValueChange == 'function')
      afterValueChange(value);
  }

  render () {
    const { value } = this.props;
    return <div className='panel'> Demo hello!!! <Input value={value} onChange={this.handleChange} /> </div>
  }
}

export default Demo
