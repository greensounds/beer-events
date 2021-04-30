import Link from 'next/link'
import Layout from '@/components/Layout'
import styles from '@/styles/404.module.css'

export default function NotFoundPage () {
    return(
        <Layout title="Page not found">
            <div className={styles.error}>
                <h1>404</h1>
                <img src="/lupe.jpg" />
                <h4>Sorry there is nothing here.</h4>
                <Link href="/">Go back home</Link>
            </div>
        </Layout>
    )
}