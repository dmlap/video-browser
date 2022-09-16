export default function nameToPathPart (name) {
  return name.toLowerCase().replace(/[ -]+/g, '-')
}
