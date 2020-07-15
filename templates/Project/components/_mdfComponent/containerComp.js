import React from 'react';
import compUtils from './common';
export default (WrapComponent) => {
  return class ControlComp extends React.Component {
    constructor (props) {
      super();
    }

    componentDidMount () {
      console.log('%c container didMount', 'color:red');
      compUtils.bind(this);
      const { viewModel, meta } = this.props;
      viewModel.on('updateViewMeta', args => {
        const { code, visible } = args;
        if (code == meta.cGroupCode) {
          this.setState({ visible });
        }
      }, undefined, true);
    }

    componentWillUnmount () {
      console.log('%c container Unmount', 'color:red');
      compUtils.unbind(this);
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
