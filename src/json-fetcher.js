export default (...args) => fetch(...args).then((response) => response.json())
