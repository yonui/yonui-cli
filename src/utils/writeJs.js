const fse = require('fs-extra');
const path = require('path');
const { getLibraConfig, getDir } = require('../utils');
let templateJs = require('../../templates/templateJs');

const writeJs = () => {
    const basePath = getLibraConfig().sourcePath;
    const compList = getDir(basePath, 'dir', {
        exclude: /(_style)|(_utils)/
    } );
    console.log(compList)
    let importDemos = ``;
    let temp = `const temp = {`;
    compList.forEach((comp) => {
        const demoPath = `${basePath}/${comp}/demos`;
        const demoList = getDir(demoPath, 'file',{
            include: /(js)|(jsx)|(tsx)/
        });
        // temp += `${comp}:[`;
        // demoList.forEach((demo, demoIndex) => {
        //     importDemos += `import ${comp}Demo${demoIndex} from '../.${demoPath}/index';\n`;
        //     temp += `${comp}Demo${demoIndex},`
        // })

        importDemos += `import ${comp} from '../.${demoPath}/index';\n`;
        temp += `${comp}, `;
        // temp += `],`;
    })
    temp += `};`

    // const templateJs = fse.readFileSync(path.resolve(__dirname,'../../templates/view.js'),'utf8');
    const outputJs = templateJs.replace('@importDemos',importDemos).replace('@temp',temp);
    const outputFile = path.resolve('./.libraui/temp/temp.js');
    fse.ensureDirSync(path.resolve('./.libraui/temp'));
    fse.writeFileSync(outputFile, outputJs);
    console.log('write javascript file at',outputFile);
}

module.exports = writeJs;