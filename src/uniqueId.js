let counter = 0

export default function uniqueId (prefix) {
  const result = (prefix || '') + counter
  counter++
  return result
}
