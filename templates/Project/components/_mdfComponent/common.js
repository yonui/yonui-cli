const compUtils = {
  bind: function (oThis) {
    const currentModel = oThis.props.model;
    if (currentModel) currentModel.addListener(oThis);
  },
  unbind: function (oThis) {
    const currentModel = oThis.props.model;
    if (currentModel) currentModel.removeListener(oThis);
  }
}

export default compUtils
