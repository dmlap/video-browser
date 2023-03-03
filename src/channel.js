import sanitizeHtml from 'sanitize-html'

/**
 * Queries an element with a given selector and returns the text
 * content of that element if found.
 *
 * @returns Array - if the selector matches a node, returns a
 * single-element array. The element is the HTML-sanitized text
 * content of that node. If the selector does not match anything,
 * returns an empty array.
 */
function textExtractor (el, selector) {
  const node = el.querySelector(selector)

  if (node) {
    return [node.textContent]
  }
  return []
}

/* default options for sanitizeHtml */
const NO_TAGS = { allowedTags: [] }

function parseAtom (feedUrl, dom) {
  const result = {
    feedUrl
  }

  for (const title of textExtractor(dom, 'feed > title')) {
    result.title = title
  }
  for (const description of textExtractor(dom, 'feed > summary')) {
    result.description = sanitizeHtml(description, NO_TAGS)
  }
  // try to find a channel image
  const thumbnailEl = dom.querySelector('feed > entry thumbnail')
  if (thumbnailEl) {
    result.image = thumbnailEl.attributes.url.textContent
  }
  for (const image of textExtractor(dom, 'feed > entry image, feed > logo')) {
    result.image = image
  }

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

  for (const title of textExtractor(entryEl, 'title')) {
    result.title = title
  }
  for (const content of entryEl.querySelectorAll('content')) {
    const src = content.attributes.url.textContent
    const type = content.attributes.type.textContent

    result.sources.push({ src, type })
  }
  result.id = result.sources[0].src

  for (const guid of textExtractor(entryEl, 'id')) {
    result.guid = guid
    result.id = result.guid
  }

  const thumbnailEl = entryEl.querySelector('thumbnail')
  if (thumbnailEl) {
    result.poster = thumbnailEl.attributes.url.textContent
  }
  for (const description of textExtractor(entryEl, 'description')) {
    result.description = sanitizeHtml(description, NO_TAGS)
  }

  return result
}

function parseRss (feedUrl, dom) {
  const channel = dom.querySelector('channel')
  const result = {
    feedUrl
  }

  for (const title of textExtractor(dom, 'channel > title')) {
    result.title = title
  }
  for (const description of textExtractor(dom, 'channel > description')) {
    result.description = sanitizeHtml(description, NO_TAGS)
  }

  const imageEl = dom.querySelector('channel > image, channel > itunes\\:image')
  if (imageEl) {
    for (const image of textExtractor(imageEl, 'url')) {
      // RSS-style image
      result.image = image
    }
    if (imageEl.attributes.href) {
      // iTunes-style image
      result.image = imageEl.attributes.href.textContent
    }
  }

  for (const category of textExtractor(dom, 'category')) {
    result.category = category
  }

  // keep videos from having cycling references to each other by
  // splitting off channel details
  // might be overkill but makes it less likely for mutations to
  // propagate in weird ways
  const channelDetail = Object.assign({}, result)
  result.videos = []

  for (const child of channel.querySelectorAll('item')) {
    const video = parseRssVideo(child, channelDetail)
    if (video && video.sources.length > 0) {
      result.videos.push(video)
    }
  }

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

  for (const title of  textExtractor(itemEl, 'title')) {
    result.title = title
  }

  for (const enclosure of itemEl.querySelectorAll('enclosure')) {
    const src = enclosure.attributes.url?.textContent
    const type = enclosure.attributes.type?.textContent

    result.sources.push({ src, type })
  }
  result.id = result.sources[0].src

  for (const guid of textExtractor(itemEl, 'guid')) {
    result.guid = guid
    result.id = result.guid
  }

  // check the various ways an image might be associated with this
  // video
  const imageEl = itemEl.querySelector('image, itunes\\:image')
  if (imageEl) {
    result.poster = imageEl.attributes.href.textContent
  }
  const contentImage = itemEl.querySelector('content[medium=image], content[type^=image]')
  if (contentImage) {
    result.poster = contentImage.attributes.url.textContent
  }

  for (const description of textExtractor(itemEl, 'description')) {
    result.description = sanitizeHtml(description, NO_TAGS)
  }

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
