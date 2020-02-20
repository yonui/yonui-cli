const { getManifestJson,getLibraConfig } = require('./index');
const path = require('path');
const fse = require('fs-extra');
const { formatPath } = require('./index');
const writeBuildEntry = () => {
    const manifestJson = getManifestJson();
    const { buildImport = {} } = getLibraConfig();
    // console.log(components);
    
    let imp = ``;

    let impLess = ``;
    if(buildImport.js){
        buildImport.js.forEach( item => {
            imp += `import '${item}';`
        })
    }

    if(buildImport.css){
        buildImport.css.forEach( item => {
            impLess += `@import '${item}';`
        })
    }
    // let regStr = '';
    let exp = {};
    const foo = ( obj, res={}) => {
        Object.keys(obj).map( item => {
            if (typeof obj[item] === 'string'){
                const _path = formatPath(path.join('../../../',obj[item])); //path.resolve(obj[item]);
                imp += `import ${item} from '${_path}';\n`;
                impLess += `@import '${_path}/style/index.less';\n`;
                res[item] = item;
            }
            else {
                res[item] = {};
                foo(obj[item],res[item]);
            }
        })
    }
    foo(manifestJson.components,exp);

    imp += `import './index.less';\nexport default ${JSON.stringify(exp).replace(/'|"/g,'')}`;
    fse.outputFile(path.resolve('./.libraui/temp/build/index.js'),imp);
    fse.outputFile(path.resolve('./.libraui/temp/build/index.less'),impLess)
}
module.exports = writeBuildEntry;