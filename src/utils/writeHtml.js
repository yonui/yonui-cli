const fse = require('fs-extra');
const path = require('path');
const { getLib, getLibraConfig } = require('./index');
let templateHtml = require('../../templates/templateHtml');
const writeHtml = () => {
    const { extraImport } = getLibraConfig();
    let scriptInput = extraImport.js;
    let cssInput = extraImport.css;
    const lib = getLib();
    lib.map( item => {
        scriptInput += item.js ? `<script src="${item.js}"></script>\n` : '';
        cssInput += item.css ? `<link rel="stylesheet" href="${item.css}">` : ``;
    })
    // const templateHtml = fse.readFileSync(path.resolve(__dirname,'../../templates/view.html'),'utf8');
    const outputFile = path.resolve('./.libraui/temp/temp.html');
    let outputHtml = templateHtml.replace('@cssImport',cssInput).replace('@scriptImport',scriptInput);
    // fse.ensureDirSync(path.resolve('./temp'));
    // fse.writeFileSync(outputFile,outputHtml);
    fse.outputFileSync(outputFile,outputHtml); // outputFileSync在无目录时会自动创建目录，而writeFileSync不会
    console.log('write html file at',outputFile);
}

module.exports = writeHtml;