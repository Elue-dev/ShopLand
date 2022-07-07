import ReactDOM from 'react-dom'
import loaderImg from '../../assets/loader.gif'
import styles from './loader.module.scss'

export default function Loader() {
  return ReactDOM.createPortal (
    <div className={styles.wrapper}>
        <div className={styles.loader}>
            <img src={loaderImg} alt="loading..." />
        </div>
    </div>,
    document.getElementById('loader')
  )
}
