import styles from '../styles/Loading.module.css'

export default function Loading () {
  return (<dialog open className={styles.modal}>
            <p className={styles.message}>Loading...</p>
          </dialog>)
}
