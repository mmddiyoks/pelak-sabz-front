import React from 'react'
import Link from 'next/link'
import HomeIcon from '@/components/Icons/vuesax/broken/home.svg'
import MapIcon from '@/components/Icons/vuesax/broken/map.svg'
import BoxIcon from '@/components/Icons/vuesax/broken/box.svg'
import styles from './bottomNav.module.css'

const BottomNav = () => {
    return (
        <div className={styles.bottomNav}>
            <ul className={styles.bottomNavList}>

                <Link href="/" className={styles.navLink}>
                    <HomeIcon className={styles.navIcon} />
                </Link>
                <Link href="/" className={`${styles.navLink} ${styles.navLinkActive}`}>
                    <MapIcon className={styles.navIcon} />
                </Link>
                <Link href="/" className={styles.navLink}>
                    <BoxIcon className={styles.navIcon} />
                </Link>

            </ul >
        </div>

    )
}

export default BottomNav