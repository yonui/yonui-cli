const fse = require('fs-extra');
const path = require('path');
const { getLibraConfig, getDir, getManifestJson } = require('../utils');

const writeResources = () => {
    const components = getManifestJson().components;
    const { sourcePath } = getLibraConfig();
    let demoList = [];
    let demoPath = [];
    const writeHelper = ( obj, prePath = './') => {
        Object.keys(obj).forEach( item => {
            if( typeof(obj[item]) === 'string'){
                console.log(`${prePath}${item}`);
        let template = `
import React from 'react';
import ReactDOM from 'react-dom';
`
        let component = {};
        let demos = [];
        getDir(`${obj[item]}/demos`, 'file', {
            exclude: /(index\.)|(\.css)|(\.less)/,
            include: /\.[jt]sx?$/
        }).forEach(demoItem => {
            const resourcePath = `${obj[item]}/demos/${demoItem}`;
            const demoName = `_${item}_${demoItem.replace(/\.[jt]sx?$/, "")}`;
            const sourceCode = fse.readFileSync(path.resolve(resourcePath), 'utf8');
            const name = sourceCode.match(/@name:(.*)/g)[0].replace(/@name:\s*/, '');
            const description = sourceCode.match(/@description:(.*)/g)[0].replace(/@description:\s*/, '');
            const code = sourceCode.replace(/\/\*(.|\r|\n|\t)*\*\//, '');
            demos.push({
                id: demoName,
                name,
                description,
                code,
            });
            // const _path = path.resolve(resourcePath,resourcePath);
            const _path = path.join(resourcePath)
            template += `import ${demoName} from '../../../${_path}';\nReactDOM.render(<${demoName} />,document.getElementById('${demoName}'));\n`;
        })
        component['component'] = item;
        component['readme'] = fse.readFileSync(`${obj[item]}/README.md`, 'utf8');
        component['demos'] = demos;
        component['path'] = `${prePath}${item}`;
        demoList.push(component);
        const outputFileJS = path.resolve(`./.libraui/temp/demo`,`${prePath}${item}.js`);
        // console.log(`${prePath}${item}.js`)
        demoPath.push(`${prePath}${item}`)
        fse.outputFileSync(outputFileJS, template)
            }
            else {
                writeHelper(obj[item],`${prePath}${item}/`);
            }
        })
    }
    writeHelper(components);
    const outputFile = path.resolve(`./.libraui/demo/resources.json`);
    fse.outputFileSync(outputFile, JSON.stringify(demoList))
    fse.outputJSONSync(path.resolve('./.libraui/temp/demo/demo-path.json'),demoPath);
}
// writeResources();

module.exports = writeResources;