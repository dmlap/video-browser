import { SearchCarousel } from './carousel'
import { Category } from './category'
import Layout from './layout'
import { useITunesData } from '../pages/api/itunes'
import { useWizardStorage } from '../src/storage'

export default function Podcasts ({ query }) {
  const wizardData = useWizardStorage()
  const category = wizardData.get().category

  const itunes = useITunesData(query || category)

  console.log(itunes, 'itunes')

  return (
    <>
      <Category />
      <h1>Podcasts</h1>
      <SearchCarousel isList response={itunes} />
    </>
  )
}

Podcasts.getLayout = function (page) {
  return (<Layout instantSearch>{page}</Layout>)
}
