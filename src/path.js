export function relative (from, to) {
  const froms = from.split('/')
  const tos = to.split('/')

  // find longest common path from root
  let diffIx = 0
  for (; diffIx < froms.length; diffIx++) {
    if (froms[diffIx] !== tos[diffIx]) {
      break
    }
  }

  // add '..' for each segment in `from` to the level of the common root
  // const fromEnd = froms.length - (froms[froms.length - 1] === '' ? 2 : 1)
  const result = froms.slice(diffIx, froms.length - 1)
  result.fill('..')

  // add any remaining segments in `to` after subtracting the common root
  for (let i = diffIx; i < tos.length; i++) {
    result.push(tos[i])
  }

  if (result.length === 0 || (result.length === 1 && result[0] === '')) {
    // [] or ['']
    return '.'
  }
  return result.join('/')
}
