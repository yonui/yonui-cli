const { getManifestJson } = require('./index');
const path = require('path');
const fse = require('fs-extra');
const components = {
    "LibraButton": "./components/LibraButton",
    "LibraButtonPlus": "./components/LibraButtonPlus",
    "basic": {
        "BsBtn": "./components/LibraButton1"
    }
}
const writeBuildEntry = () => {
    const manifestJson = getManifestJson();
    // console.log(components);
    
    let imp = ``;
    let regStr = '';
    let exp = {};
    const foo = ( obj, res={}) => {
        Object.keys(obj).map( item => {
            if (typeof obj[item] === 'string'){
                const _path = path.resolve(obj[item]);
                imp += `import ${item} from '${_path}';\nimport '${_path+'/style'}';\n`;
                regStr += `\\${obj[item]}|`;
                res[item] = item;
            }
            else {
                res[item] = {};
                foo(obj[item],res[item]);
            }
        })
    }
    foo(manifestJson.components,exp);
    // console.log(imp)
    // console.log(JSON.stringify(exp).replace(/'|"/g,''))
    fse.outputFile(path.resolve('./.libraui/temp/build/index.js'),imp+'export default '+JSON.stringify(exp).replace(/'|"/g,''))
}
module.exports = writeBuildEntry;