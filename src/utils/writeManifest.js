const { getManifestJson } = require("./index");
const path = require("path");
const fse = require("fs-extra");
const { getLibraConfig } = require('../utils')
const { sourcePath } = getLibraConfig()

function customJsonStringify(key, value) {
  if (typeof value === "function") {
    return `/Function(${value.toString()})/`;
  }
  return value;
}

function customJsonParse(key, value) {
  if (
    typeof value === "string" &&
    value.startsWith("/Function(") &&
    value.endsWith(")/")
  ) {
    value = value.substring(10, value.length - 2);
    return eval(`(${value})`); // eslint-disable-line no-eval
  }
  return value;
}

const writeManifest = () => {
  const manifestJson = getManifestJson();

  const manifest = {};
  let manifestComponents = [];
  const loop = (obj, prefix = '') => {
    for (const key in obj) {
      const item = obj[key];
      if (typeof item === "string") {
        const libPath = item.replace(sourcePath, 'lib')
        console.log(path.resolve(libPath));
        const CLS = require(path.resolve(libPath)).default;
        if (typeof CLS !== "function") {
          // throw new Error(`${componentName} is not a Class`)
          console.warn(`${key} is not a Class`);
          continue;
        }
        let componentManifest = CLS.manifest || new CLS().manifest;
        if(componentManifest){
          componentManifest.name = prefix + key;
          manifestComponents.push(componentManifest)
        }
        
      } else {
        // res[key] = {};
        loop(item, `${key}.`);
      }
    };
  }

  loop(manifestJson.components);
  const output = {...manifestJson, components: manifestComponents};
  console.log(JSON.stringify(manifestComponents, customJsonStringify))
  // console.log(manifestComponents)
  // console.log('manifest target: ', path.resolve("./.libraui/dist/manifest.json"))
  fse.outputFileSync(
    path.resolve("./dist/manifest.json"),
    JSON.stringify(output, customJsonStringify)
  );
  process.exit(0)
};
module.exports = writeManifest;
