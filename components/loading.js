import styles from '../styles/Loading.module.css'

export default function Loading ({ modal }) {
  if (modal === undefined) {
    modal = true
  }
  return (<dialog open className={modal ? styles.modal : styles.nonModal}>
            <p className={styles.message}>Loading...</p>
          </dialog>)
}
