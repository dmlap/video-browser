import itemToVideo from './item-to-video'

export default function parseChannel (feedUrl, feedXml) {
  const dom = new DOMParser().parseFromString(feedXml, 'application/xml')
  const channel = dom.querySelector('channel')
  const result = {
    feedUrl
  }

  function maybeParseText(selector, propertyName) {
    const node = dom.querySelector(selector)
    if (node) {
      result[propertyName] = node.textContent
    }
  }

  maybeParseText('channel > title', 'title')
  maybeParseText('channel > description', 'description')
  maybeParseText('image', 'image')
  maybeParseText('category', 'category')

  // keep videos from having cycling references to each other by
  // splitting off channel details
  // might be overkill but makes it less likely for mutations to
  // propagate in weird ways
  const channelDetail = Object.assign({}, result)
  result.videos = []

  Array.from(channel.children).forEach((child) => {
    if (child.nodeName !== 'item') {
      return
    }

    if (!child.querySelector('enclosure[type^=video]')) {
      // filter out non-video episodes
      return
    }
    const video = itemToVideo(child, channelDetail)
    if (video) {
      result.videos.push(video)
    }
  })

  return result
}
