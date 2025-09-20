
"use client";
import React, { useState } from 'react'
import Map from '@/components/Map/map'
import GlassButtons from '@/components/GlassButtons'
import config from '@/data/config.json'
import PelakBox from '@/components/pelak/index.pelak'

const page = () => {
    const [showOverflow, setShowOverflow] = useState(false);

    const handleYReachZero = () => {
        setShowOverflow(true);
    };

    return (
        <div className="min-h-screen bg-gray-50 relative">
            <div className={`h-[300px] relative ${showOverflow ? '' : 'overflow-hidden'}`}>
                <GlassButtons
                    onGpsClick={() => console.log('GPS کلیک شد')}
                    onShareClick={() => console.log('اشتراک‌گذاری کلیک شد')}
                />
                <Map center={config.center} zoom={14} className="w-full h-[300px]" />
                <PelakBox className="" onAnimationComplete={handleYReachZero} />
            </div>
            <div className="h-[500px]">fdsfd</div>
        </div>
    )
}

export default page