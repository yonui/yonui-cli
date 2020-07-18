// import React from 'react';

export default function MetaConfig (metaInfo = {}) {
  const { name, api } = metaInfo
  console.log('name', name, 'api', api);
  return function (targetComponent, name, descriptor) {
    console.log(targetComponent, name, descriptor)
    const {defaultProps, propTypes} = aynalyProps(api)
    targetComponent.defaultProps = defaultProps;
    targetComponent.propTypes = propTypes;
  }
}
/**
 *  解析api，将默认的属性同步到类上
 * @param {array} api
 * api 中每个元素item说明
 * {
 *  name: 字段属性名,
 *  type: 属性类型,[array, bool, func, number, string, element, node ]
 *  defaultValue: 默认值，
 *  isMust: 是否必填，
 *  desc: 属性描述
 * }
 */
function aynalyProps (api = []) {
  const defaultProps = {};
  const propTypes = {};
  api.forEach(item => {
    const name = item?.name
    if (name) {
      const { type, defaultValue } = item;
      if (defaultValue || defaultValue == 0)
        defaultProps[name] = defaultValue
      if (type) {
        propTypes[name] = type
      }
    }
  })
  return {defaultProps, propTypes};
}
