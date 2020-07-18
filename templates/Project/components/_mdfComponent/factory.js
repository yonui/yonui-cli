
import ControlComp from './controlComp'
import ButtonComp from './buttonComp'
import ContainerComp from './containerComp'

function createComp (compInfo = {}) {
  return function (targetCompent, name, descriptor) {
    console.log(targetCompent, name, descriptor)
    return getAbstractCompFactory(compInfo, targetCompent)
  }
}

function getAbstractCompFactory (compInfo, targetCompent) {
  const { type, model } = compInfo
  console.log('type', type);
  switch (type) {
    case 'control':
      return ControlComp(targetCompent, model);
    case 'container':
      return ContainerComp(targetCompent, model);
    case 'button':
      return ButtonComp(targetCompent);
    default:
      console.log('%c 依赖基类不存在', 'color:red');
  }
}

export default createComp
