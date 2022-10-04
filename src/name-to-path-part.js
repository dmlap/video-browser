export default function nameToPathPart (name) {
  return name.toLowerCase().replace(/[ -]+/g, '-').replace(/[()]*/g, '').slice(0, 20)
}
