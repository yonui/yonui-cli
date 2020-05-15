/**
 *
 */
const fs = require('fs')
const propertiesParser = require('properties-parser')
let objectAssign = require('object-assign');
const userPath = process.env.HOME || process.env.USERPROFILE;
function getCommands(fileName){
  let config = {};
  let argvs = process.argv;
  try{
    let attr
    if(argvs[2] == "set"){
      let data = propertiesParser.read(getRcFile(fileName));
      attr = argvs[3].split("=");
      data[attr[0]] = attr[1];
      config = data;
    } else {
      return null;
    }
    return config;
  }catch(e){
    return null;
  }

}
function set(fileName){
  let path = getRcFile(fileName);
  try{
    let valida = getValidateRc(fileName);
    if(!valida){
      let comm = getCommands(fileName);
      let editor = propertiesParser.createEditor();
      for (var item in comm) {
        editor.set(item, comm[item]);
      }
      fs.writeFileSync(path,editor.toString())
      // comm?fs.writeFileSync(path,JSON.stringify(comm)):"";
    }else{
      let comm = getCommands(fileName);
      let config = propertiesParser.read(path);
      if(comm){
        config = config||{};
        config = objectAssign(config,comm);
        let editor = propertiesParser.createEditor();
        for (var item in config) {
          editor.set(item, config[item]);
        }
        fs.writeFileSync(path,editor.toString())
      };
    }
  }catch(e){

  }
}

/**
 * 获取文件
 * @param {any} fileName
 * @returns
 */
function getRc(fileName){
  if(getValidateRc(fileName)){
    return propertiesParser.read(getRcFile(fileName));
  }else{
    return null;
  }
}
/**
 * 判断是否有Rc文件
 * @param {any} fileName
 * @returns  true、false
 */
function getValidateRc(fileName){
  try {
    fs.accessSync(getRcFile(fileName),fs.F_OK);
  }catch (e) {
    return false;
  }
  return true;
}

function getRcFile(fileName){
  let  filePath = fileName? userPath+"/."+fileName+"rc":"";
  return filePath;
}

module.exports = set
