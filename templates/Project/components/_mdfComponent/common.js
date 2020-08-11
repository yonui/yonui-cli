const type2models = {
  simple: 'SimpleModel',
  list: 'ListModel',
  grid: 'GridModel',
  tag: 'TagModel',
  tree: 'TreeModel',
  refer: 'ReferModel'
}

const compUtils = {
  bind: function (oThis, model) {
    const newModelType = type2models[model];
    if (newModelType && typeof cb !== 'undefined') {
      const viewModel = oThis.props.viewModel || oThis.props.pageModel
      const cItemName = oThis.props.cItemName;
      oThis.newModel = new cb.models[newModelType](oThis.modelData || {});
      if (cItemName) {
        viewModel.removeProperty(cItemName)
        viewModel.addProperty(cItemName, oThis.newModel)
      }
    }
    const currentModel = oThis.newModel || oThis.props.model;
    if (currentModel) currentModel.addListener(oThis);
  },
  unbind: function (oThis) {
    const currentModel = oThis.newModel || oThis.props.model;
    if (currentModel) currentModel.removeListener(oThis);
  },
  setModelConfig: function (oThis, data) {
    // if (!(typeof cb == 'undefined')) {
    //   const currentModel = oThis.newModel || oThis.props.model;
    //   cb.models.BaseModel.call(currentModel, data);
    // }
    oThis.modelData = data;
  }
}

export default compUtils
