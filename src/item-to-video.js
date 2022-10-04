export default function itemToVideo (itemEl) {
  const enclosure = itemEl.querySelector('enclosure')
  const type = enclosure.attributes.type.textContent

  if (!type.startsWith('video')) {
    // filter out non-video episodes
    return
  }

  const result = {
    title: itemEl.querySelector('title').textContent,
    sources: [{
      src: enclosure.attributes.url.textContent,
      type: type
    }]
  }
  result.id = result.sources[0].src

  // use the guid for the ID if present
  const guid = itemEl.querySelector('guid')
  if (guid) {
    result.guid = guid.textContent
    result.id = result.guid
  }

  // check the various ways an image might be associated with this
  // video
  const imageEl = itemEl.querySelector('image')
  if (imageEl) {
    result.poster = imageEl.attributes.href.textContent
  }
  const contentImage = itemEl.querySelector('content[medium=image], content[type^=image]')
  if (contentImage) {
    result.poster = contentImage.attributes.url.textContent
  }

  const description = itemEl.querySelector('description')
  if (description) {
    result.description = description.textContent
  }

  return result
}
