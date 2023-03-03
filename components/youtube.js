import Layout from './layout'
import { SearchCarousel } from '../components/carousel'
import { useYouTubeData } from '../pages/api/youtube'
import { useWizardStorage } from '../src/storage'

export default function YouTube ({ query }) {
  const wizardData = useWizardStorage()
  const category = wizardData.get().category

  const youtube = useYouTubeData(query || category)

  return (
    <>

      <h1>YouTube</h1>
      <SearchCarousel isList response={youtube} />
    </>
  )
}

YouTube.getLayout = function (page) {
  return (<Layout instantSearch>{page}</Layout>)
}
