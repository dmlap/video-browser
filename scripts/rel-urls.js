/**
 * Replace all instances of the NextJS `assetPrefix` with a relative
 * path specifier. `assetPrefix` is set in next.config.js at the root
 * of this project.
 */

const fs = require('fs')
const NextConfig = require('../next.config.js')

const inputFile = process.argv[2]

if (!inputFile) {
  console.error('No input file specified')
  process.exit(1)
}

const pathToRoot = inputFile
  .match(/\//g)
  .slice(0, -1)
  .map((path) => '..')
  .join('/')
console.log(`Processing '${inputFile}' with relative path '${pathToRoot}'`)

if (!NextConfig.assetPrefix) {
  console.error('No NextJS assetPrefix configured')
  process.exit(1)
}
const prefix = RegExp(NextConfig.assetPrefix + '(/)?', 'g')

const replacement = pathToRoot.length > 0 ? pathToRoot + '/' : pathToRoot
const replaced = fs.readFileSync(inputFile, 'utf8').replace(prefix, replacement)

fs.writeFileSync(inputFile, replaced)
