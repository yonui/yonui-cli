
import ControlComp from './controlComp'
import ButtonComp from './buttonComp'
import ContainerComp from './containerComp'

function createComp (compInfo = {}) {
  const { type } = compInfo
  console.log('type', type);
  return function (targetCompent, name, descriptor) {
    console.log(targetCompent, name, descriptor)
    return getAbstractCompFactory(type, targetCompent)
  }
}

function getAbstractCompFactory (type = 'control', targetCompent) {
  switch (type) {
    case 'control':
      return ControlComp(targetCompent);
    case 'container':
      return ContainerComp(targetCompent);
    case 'button':
      return ButtonComp(targetCompent);
    default:
      console.log('%c 依赖基类不存在', 'color:red');
  }
}

export default createComp
