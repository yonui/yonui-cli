const fse = require('fs-extra');
const path = require('path');
const { getLibraConfig, getDir } = require('../utils');

const writeResources = () => {
    const basePath = getLibraConfig().sourcePath;
    const compList = getDir(basePath, 'dir', {
        exclude: /(_style)|(_utils)/
    });
    let demoMap = {};
    compList.forEach(comp => {
        demoMap[comp] = {};
        getDir(`${basePath}/${comp}/demos`, 'file', {
            exclude: /(index\.)|(\.css)|(\.less)/,
            include: /\.[jt]sx?$/
        })
            // .map( item => item.replace(/\.[jt]sx?$/,""))
            .forEach(item => {
                const resourcePath = `${basePath}/${comp}/demos/${item}/`;
                demoMap[comp][item] = fse.readFileSync(path.resolve(resourcePath), 'utf8')
            })
            demoMap[comp]['API'] = fse.readFileSync(`${basePath}/${comp}/README.md`, 'utf8')
    })
    const outputFile = path.resolve('./.libraui/temp/resources.json');
    fse.outputFileSync(outputFile, JSON.stringify(demoMap))
}

module.exports = writeResources;