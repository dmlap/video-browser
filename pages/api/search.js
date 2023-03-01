import { data } from '../../src/fake-data'

/**
 * Perform a general-purpose search for channels or videos
 * see https://performance-partners.apple.com/resources/documentation/itunes-store-web-service-search-api/#searching
 */
export default function handler (request, response) {
  return response.status(200).json(data)
}
