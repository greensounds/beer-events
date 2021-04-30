import Link from 'next/link'
import styles from '@/styles/Footer.module.css'

export default function Footer () {
    return(
        <footer className={styles.footer}>
            <p>Copyright &copy; Beer Events 2021</p>
            <p>
                <Link href="/about">About this project</Link>
            </p>
        </footer>
    )
}