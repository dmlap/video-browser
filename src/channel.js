function textExtractor (el, target) {
  return (selector, propertyName) => {
    const node = el.querySelector(selector)
    if (node) {
      target[propertyName] = node.textContent
    }
  }
}

function parseAtom (feedUrl, dom) {
  const result = {
    feedUrl
  }

  const maybeParseText = textExtractor(dom, result)

  maybeParseText('feed > title', 'title')
  maybeParseText('feed > summary', 'description')
  // try to find a channel image
  const thumbnailEl = dom.querySelector('feed > entry thumbnail')
  if (thumbnailEl) {
    result.image = thumbnailEl.attributes.url.textContent
  }
  maybeParseText('feed > entry image', 'image')
  maybeParseText('feed > logo', 'image')

  // keep videos from having cycling references to each other by
  // splitting off channel details
  // might be overkill but makes it less likely for mutations to
  // propagate in weird ways
  const channelDetail = Object.assign({}, result)
  result.videos = []

  for (const entryEl of dom.querySelectorAll('feed > entry')) {
    const video = parseAtomVideo(entryEl, channelDetail)
    if (video && video.sources.length > 0) {
      result.videos.push(video)
    }
  }

  return result
}

/**
 * Extract the video data from an <entry> in an Atom feed. The second
 * argument contains metadata about the channel (i.e. Atom feed) that
 * the itemEl is sourced from.
 */
function parseAtomVideo (entryEl, channelDetail) {
  const result = {
    sources: [],
    channelDetail
  }
  const maybeParseText = textExtractor(entryEl, result)

  maybeParseText('title', 'title')
  for (const content of entryEl.querySelectorAll('content')) {
    const src = content.attributes.url.textContent
    const type = content.attributes.type.textContent

    result.sources.push({ src, type })
  }
  result.id = result.sources[0].src

  maybeParseText('id', 'guid')
  if (result.guid) {
    result.id = result.guid
  }

  const thumbnailEl = entryEl.querySelector('thumbnail')
  if (thumbnailEl) {
    result.poster = thumbnailEl.attributes.url.textContent
  }
  maybeParseText('description', 'description')

  return result
}

function parseRss (feedUrl, dom) {
  const channel = dom.querySelector('channel')
  const result = {
    feedUrl
  }

  const maybeParseText = textExtractor(dom, result)

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

    const video = parseRssVideo(child, channelDetail)
    if (video && video.sources.length > 0) {
      result.videos.push(video)
    }
  })

  return result
}

/**
 * Extract the video data from an <item> in an RSS feed. The second
 * argument contains metadata about the channel (i.e. RSS feed) that
 * the itemEl is sourced from.
 */
function parseRssVideo (itemEl, channelDetail) {
  const result = {
    sources: [],
    channelDetail
  }
  const maybeParseText = textExtractor(itemEl, result)

  maybeParseText('title', 'title')
  for (const enclosure of itemEl.querySelectorAll('enclosure')) {
    const src = enclosure.attributes.url.textContent
    const type = enclosure.attributes.type.textContent

    result.sources.push({ src, type })
  }
  result.id = result.sources[0].src

  maybeParseText('guid', 'guid')
  if (result.guid) {
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

  maybeParseText('description', 'description')

  return result
}

export default function parseChannel (feedUrl, feedXml) {
  const dom = new DOMParser().parseFromString(feedXml, 'application/xml')

  if ((/.*\/\/www\.w3\.org\/.*\/Atom/i).test(dom.documentElement.namespaceURI)) {
    return parseAtom(feedUrl, dom)
  } else {
    return parseRss(feedUrl, dom)
  }
}
