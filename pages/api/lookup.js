import { index } from '../../src/fake-data'

/**
 * Lookup a specific channel by ID.
 * see https://performance-partners.apple.com/resources/documentation/itunes-store-web-service-search-api/#lookup
 */
export default function handler(request, response) {
  const channel = index[request.query?.collectionId]

  if (!channel) {
    return response.status(404).send()
  }

  return response.status(200).json(channel)
}
