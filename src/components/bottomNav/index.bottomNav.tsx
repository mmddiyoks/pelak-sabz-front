"use client"
import React from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import HomeIcon from '@/components/Icons/solar/Broken_/Essentional, UI_/Home Smile.svg'
import MapIcon from '@/components/Icons/solar/Broken_/Map & Location_/Map.svg'
import BoxIcon from '@/components/Icons/solar/Broken_/Essentional, UI_/Box.svg'
import styles from './bottomNav.module.css'

const BottomNav = () => {
    const [activeKey, setActiveKey] = React.useState<'map' | 'home' | 'box'>('home')

    const items = React.useMemo(() => ([
        { key: 'map' as const, href: '/map', Icon: MapIcon },
        { key: 'home' as const, href: '/', Icon: HomeIcon },
        { key: 'box' as const, href: '/box', Icon: BoxIcon },
    ]), [])

    const orderedItems = React.useMemo(() => {
        const center = items.find(i => i.key === activeKey)!
        const others = items.filter(i => i.key !== activeKey)
        // Keep a stable order for side items
        return [others[0], center, others[1]]
    }, [items, activeKey])

    return (
        <div className={styles.bottomNav}>
            <motion.ul className={styles.bottomNavList} layout>
                {orderedItems.map((item) => (
                    <motion.li key={item.key} layout className={styles.navItem}>
                        <Link
                            href={item.href}
                            className={`${styles.navLink} ${item.key === activeKey ? styles.navLinkActive : ''}`}
                            onClick={() => setActiveKey(item.key)}
                        >

                            <item.Icon className={styles.navIcon} />
                        </Link>
                    </motion.li>
                ))}
            </motion.ul>
        </div>
    )
}

export default BottomNav