import React from 'react';
import { Input } from 'yonui-ys';

import MDFComponent from './index';
import metaConfig from './metaConfig';

@MDFComponent({type: 'control'}) // @mdf 标识，参数改成对象模式，type，绑定模型是什么
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
