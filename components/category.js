
import { useWizardStorage } from '../src/storage'
import styles from '../styles/Category.module.css'

import { useRouter } from './vlink'

export function Category ({ query }) {
  const router = useRouter()
  const wizardData = useWizardStorage()
  const category = wizardData.get().category

  function handleCategoryChange () {
    wizardData.set({ category: '' })
    router.reload()
  }

  return (
    <section className={styles.category}>
      <button onClick={handleCategoryChange}>Change category</button>
      <span>Currently used: {category || 'Not set'}</span>
    </section>
  )
}
