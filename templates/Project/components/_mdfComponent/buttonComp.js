import React from 'react';
import compUtils from './common';
export default (WrapComponent, model) => {
  return class ButtonComp extends React.Component {
    componentDidMount () {
      console.log('%c container didMount', 'color:red');
      compUtils.bind(this);
    }

    componentWillUnmount () {
      console.log('%c container Unmount', 'color:red');
      compUtils.unbind(this);
    }

    afterClick () {
      const currentModel = this.props.model;
      currentModel?.fireEvent('click');
    }

    render () {
      const allProps = {
        ...this.props,
        ...this.state
      }
      return <WrapComponent {...allProps} />
    }
  }
}
