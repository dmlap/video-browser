export default function JSONFetcher (...args) {
  return fetch(...args).then((response) => response.json())
}
