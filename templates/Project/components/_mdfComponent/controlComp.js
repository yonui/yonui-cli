import React from 'react';
import compUtils from './common';
export default (WrapComponent, model) => {
  return class ControlComp extends React.Component {
    constructor (props) {
      super();
    }

    componentDidMount () {
      console.log('%c container didMount', 'color:red');
      compUtils.bind(this, model);
    }

    componentWillUnmount () {
      console.log('%c container Unmount', 'color:red');
      compUtils.unbind(this);
    }

    /**
     * 输入值改变之后出发事件
     * @param {*} value 当前输入框值
     */
    afterValueChange = (value) => {
      const currentModel = this.newModel || this.props.model;
      currentModel.setValue(value);
    }

    /**
     * 模型校验后的回调事件
     * @param {*} val 当前校验信息
     */
    validate (val) {
      this.setState({
        err: 'has-feedback has-' + val.type,
        msg: val.message
      });
    }

    setModelConfig = (data) => {
      compUtils.setModelConfig(this, data)
    }

    render () {
      const allProps = {
        ...this.props,
        ...this.state,
        afterValueChange: this.afterValueChange,
        setModelConfig: this.setModelConfig
      }
      return <WrapComponent {...allProps} />
    }
  }
}
