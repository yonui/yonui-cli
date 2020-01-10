const path = require('path');
const fse = require('fs-extra');
const { getLibraConfig } = require('../utils');
const createComponent = (componentName) => {
    const libraConfig = getLibraConfig();
    const { sourcePath, suffixType } = libraConfig;
    const target = path.resolve(`${sourcePath}/${componentName}`);
    const exists = fse.existsSync(target);
    if(exists){
        console.log('The component already exists, please rename it.')
    }
    else {
        // console.log('start')
        fse.copySync(path.join(__dirname,`../../templates/${suffixType === 'tsx' ? 'TSComponent' : 'JSComponent' }`),target);
        const indexPath = path.resolve(`${sourcePath}/index.${suffixType}`);
        const indexExists = fse.existsSync(indexPath);
        let indexFile = '';
        if(indexExists){
            indexFile = fse.readFileSync(path.resolve(`${sourcePath}/index.${suffixType}`),'utf8');
        }
        indexFile += `export { default as ${componentName} } from './${componentName}';\n`;
        fse.writeFileSync(path.resolve(`${sourcePath}/index.${suffixType}`),indexFile);
        console.log(`Component ${componentName} was successfully created.`)
    }
}

module.exports = createComponent;