
"use client";
import React, { useState } from 'react'
import Map from '@/components/Map/map'
import GlassButtons from '@/components/GlassButtons'
import config from '@/data/config.json'
import servicesData from '@/data/services.json'
import PelakBox from '@/components/pelak/index.pelak'
import { useTree } from '@/context/TreeContext'
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Camera, FileText, MapPin, Shield, Send } from 'lucide-react'

const page = () => {
    const [showOverflow, setShowOverflow] = useState(false);
    const [imagesReady, setImagesReady] = useState({ mobile: false, banner: false });
    const handleYReachZero = () => {
        setShowOverflow(true);
    };

    // تابع‌های سرویس‌ها
    const handleReportService = () => {
        console.log('سرویس ارسال گزارش کلیک شد');
        // TODO: پیاده‌سازی سرویس ارسال گزارش
    };

    const handlePhotoService = () => {
        console.log('سرویس ارسال عکس درخت کلیک شد');
        // TODO: پیاده‌سازی سرویس ارسال عکس
    };

    const handlePlateService = () => {
        console.log('سرویس درخواست نصب پلاک کلیک شد');
        // TODO: پیاده‌سازی سرویس نصب پلاک
    };

    const handleArticle7Service = () => {
        console.log('سرویس ماده 7 کلیک شد');
        // TODO: پیاده‌سازی سرویس ماده 7
    };

    // framer-motion variants for staggered entrance of service items
    const containerVariants = {
        hidden: { opacity: 1 },
        visible: {
            opacity: 1,
            transition: {
                delayChildren: 1,
                staggerChildren: 0.1,
            },
        },
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 16 },
        visible: { opacity: 1, y: 0 },
    };


    return (
        <div className="min-h-screen bg-gray-50 relative">
            <div className={`h-[350px] relative ${showOverflow ? '' : 'overflow-hidden'}`}>


                <Map center={config.center} zoom={14} className="w-full h-[350px]" />
                <PelakBox className="" onAnimationComplete={handleYReachZero} />
            </div>
            <div className=" px-3 pt-14 mt-3">
                <div className={`flex items-center justify-center relative overflow-hidden mb-4 transition-opacity duration-500 ${imagesReady.mobile && imagesReady.banner ? 'opacity-100' : 'opacity-0'}`}>
                    <motion.img
                        src="/MOBILE.png"
                        alt="globe"
                        width={100}
                        height={100}
                        className='h-auto absolute top-0 left-1.5 w-[75px] max-[380px]:w-[60px] '
                        onLoad={() => setImagesReady(prev => ({ ...prev, mobile: true }))}
                        animate={imagesReady.mobile && imagesReady.banner ? { y: [0, 10, 0] } : undefined}
                        transition={{ duration: 1, delay: 2, ease: 'easeInOut' }}
                    />
                    <Image
                        src="/BANNER137.png"
                        alt="globe"
                        width={100}
                        height={110}
                        className='w-full h-full'
                        quality={100}
                        unoptimized
                        onLoadingComplete={() => setImagesReady(prev => ({ ...prev, banner: true }))}
                    />
                </div>

                <Card className="w-full rounded-2xl shadow-sm  mt-4 mb-[100px] bg-white/90">
                    <CardHeader className="p-4 pb-2">
                        <CardTitle className="text-sm font-semibold text-gray-800">خدمات پلاک</CardTitle>
                    </CardHeader>
                    <CardContent className="p-4 pt-2">
                        <motion.div
                            className="grid grid-cols-1 gap-3"
                            variants={containerVariants}
                            initial="hidden"
                            animate="visible"
                        >
                            {/* سرویس ارسال گزارش */}
                            <motion.div
                                variants={itemVariants}
                                onClick={handleReportService}
                                className="flex items-center justify-between p-3 rounded-xl bg-gradient-to-r from-blue-50 to-blue-100 border border-blue-200 hover:from-blue-100 hover:to-blue-150 transition-all duration-200 transform hover:scale-[1.02] hover:shadow-lg cursor-pointer"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="p-2 rounded-lg bg-blue-500 text-white">
                                        <FileText className="h-4 w-4" />
                                    </div>
                                    <div>
                                        <h4 className="text-sm font-semibold text-gray-800">ارسال گزارش</h4>
                                        <p className="text-xs text-gray-600">گزارش وضعیت درخت</p>
                                    </div>
                                </div>
                                <Send className="h-4 w-4 text-blue-500" />
                            </motion.div>

                            {/* سرویس ارسال عکس درخت */}
                            <motion.div
                                variants={itemVariants}
                                onClick={handlePhotoService}
                                className="flex items-center justify-between p-3 rounded-xl bg-gradient-to-r from-green-50 to-green-100 border border-green-200 hover:from-green-100 hover:to-green-150 transition-all duration-200 transform hover:scale-[1.02] hover:shadow-lg cursor-pointer"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="p-2 rounded-lg bg-green-500 text-white">
                                        <Camera className="h-4 w-4" />
                                    </div>
                                    <div>
                                        <h4 className="text-sm font-semibold text-gray-800">ارسال عکس درخت</h4>
                                        <p className="text-xs text-gray-600">ثبت تصویر از وضعیت درخت</p>
                                    </div>
                                </div>
                                <Send className="h-4 w-4 text-green-500" />
                            </motion.div>

                            {/* سرویس درخواست نصب پلاک */}
                            <motion.div
                                variants={itemVariants}
                                className="flex items-center justify-between p-3 rounded-xl bg-gradient-to-r from-orange-50 to-orange-100 border border-orange-200 hover:from-orange-100 hover:to-orange-150 transition-all duration-200 transform hover:scale-[1.02] hover:shadow-lg cursor-pointer"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="p-2 rounded-lg bg-orange-500 text-white">
                                        <MapPin className="h-4 w-4" />
                                    </div>
                                    <div>
                                        <h4 className="text-sm font-semibold text-gray-800">درخواست نصب پلاک</h4>
                                        <p className="text-xs text-gray-600">نصب پلاک شناسایی درخت</p>
                                    </div>
                                </div>
                                <Send className="h-4 w-4 text-orange-500" />
                            </motion.div>

                            {/* سرویس ماده 7 */}
                            <motion.div
                                variants={itemVariants}
                                onClick={handleArticle7Service}
                                className="flex items-center justify-between p-3 rounded-xl bg-gradient-to-r from-purple-50 to-purple-100 border border-purple-200 hover:from-purple-100 hover:to-purple-150 transition-all duration-200 transform hover:scale-[1.02] hover:shadow-lg cursor-pointer"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="p-2 rounded-lg bg-purple-500 text-white">
                                        <Shield className="h-4 w-4" />
                                    </div>
                                    <div>
                                        <h4 className="text-sm font-semibold text-gray-800">ماده 7</h4>
                                        <p className="text-xs text-gray-600">درخواست بر اساس ماده 7</p>
                                    </div>
                                </div>
                                <Send className="h-4 w-4 text-purple-500" />
                            </motion.div>
                        </motion.div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}

export default page