import React from 'react'
import Link from 'next/link'
import HomeIcon from '@/components/Icons/vuesax/broken/home.svg'
import ScanIcon from '@/components/Icons/vuesax/broken/scan.svg'
import styles from './bottomNav.module.css'

const BottomNav = () => {
    return (
        <ul className={styles.bottomNav}>
            <li className={`${styles.navContainer} shadow-md`}>
                <Link href="/" className={`${styles.scanButton} shadow`}>
                    <ScanIcon className={styles.scanIcon} />
                </Link>
                <span className={styles.navbarScanBlank}>
                </span>
                <Link href="/" className={styles.navLink}>
                    <HomeIcon className={styles.navIcon} />
                </Link>
                <Link href="/" className={styles.navLink}>
                    <HomeIcon className={styles.navIcon} />
                </Link>
                <Link href="/" className={styles.navLink}>
                    <HomeIcon className={styles.navIcon} />
                </Link>
            </li>
        </ul>
    )
}

export default BottomNav