export default function Error (attributes) {
  return (<div>
            Uh oh!
            <small>
            {
              attributes.message? attributes.message : 'Something went wrong'
            }
            </small>
          </div>)
}
