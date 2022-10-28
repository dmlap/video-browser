const path = require('path')
const fs = require('fs/promises')

/**
 * Create a map from `dest` locators to Components based on their
 * location in components/ directory.
 */
async function buildMap (componentsPath, outputName) {
  const components = []
  const entries = (await fs.readdir(componentsPath, {
    encoding: 'utf8',
    withFileTypes: true
  })).map((entry) => [entry, '.'])

  let fd
  try {
    fd = await fs.open(path.join(componentsPath, outputName), 'w')
    await fd.write('/**\n' +
             ' * This is a GENERATED FILE created by scripts/build-component-map.js.\n' +
             ' * To change the contents of this file, update that script appropriately.\n' +
             '**/\n\n')

    // gather path information and write out the imports
    for (let [entry, currentPath] = entries.pop(); entries.length > 0; [entry, currentPath] = entries.pop()) {
      if (currentPath === '.' && entry.name === outputName) {
        // don't process the output of this process
        continue
      }

      if (entry.isFile() && (/^\.(js|mjs)$/i).test(path.extname(entry.name))) {
        const entryPath = `${currentPath}/${entry.name}`
        console.log('Found component at', entryPath)
        const symbol = entry.name.replaceAll(path.delimiter, '_slash_')
              .replaceAll('.', '_dot_')
              .replaceAll('-', '_dash_')
        await fd.write(`import ${symbol} from '${entryPath}'` + '\n')
        components.push([entryPath, symbol])
        continue
      }

      if (entry.isDirectory()) {
        for (let newEntry of await fs.readdir(path.join(componentsPath, currentPath))) {
          entries.push([newEntry, path.join(currentPath, entry.name)])
        }
        continue
      }
    }

    // write out the ComponentMap entries
    await fd.write('\n')
    await fd.write('const ComponentMap = new Map()\n')
    for (let [path, symbol] of components) {
      const route = path.slice(2).replace(/\.(m)?js$/, '')
      await fd.write(`ComponentMap.set('${route}', ${symbol})` + '\n')
    }

    await fd.write('\n')
    await fd.write('export default ComponentMap\n')
  } finally {
    await fd.close()
  }
}

buildMap(path.resolve(__dirname, '../components'), 'component-map.js')
