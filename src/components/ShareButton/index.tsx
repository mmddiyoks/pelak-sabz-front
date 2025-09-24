"use client"

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Share2, MapPin, ExternalLink, Copy, X } from 'lucide-react';
import GoogleMapIcon from '@/components/Icons/googleMap.svg';
import NeshanIcon from '@/components/Icons/neshan.svg';
import BaladIcon from '@/components/Icons/balad.svg';
import {
    Drawer,
    DrawerContent,
    DrawerDescription,
    DrawerHeader,
    DrawerTitle,
    DrawerTrigger,
    DrawerClose,
} from '@/components/ui/drawer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';

interface ShareDrawerProps {
    children: React.ReactNode;
    address: string;
    latitude?: number;
    longitude?: number;
    treeCode?: string;
}

const ShareDrawer: React.FC<ShareDrawerProps> = ({
    children,
    address,
    latitude,
    longitude,
    treeCode
}) => {
    const [isSharing, setIsSharing] = useState(false);

    const generateShareText = () => {
        let text = `درخت ${treeCode || 'انتخاب شده'}\n`;
        text += `آدرس: ${address}\n`;
        if (latitude && longitude) {
            text += `موقعیت: ${latitude}, ${longitude}`;
        }
        return text;
    };

    const shareToGoogleMaps = () => {
        if (latitude && longitude) {
            const url = `https://www.google.com/maps?q=${latitude},${longitude}`;
            window.open(url, '_blank');
            toast.success('موقعیت در Google Maps باز شد');
        } else {
            const url = `https://www.google.com/maps/search/${encodeURIComponent(address)}`;
            window.open(url, '_blank');
            toast.success('آدرس در Google Maps جستجو شد');
        }
    };

    const shareToNeshan = () => {
        if (latitude && longitude) {
            const url = `https://neshan.org/maps/@${latitude},${longitude},15z`;
            window.open(url, '_blank');
            toast.success('موقعیت در نشان باز شد');
        } else {
            const url = `https://neshan.org/maps/search/${encodeURIComponent(address)}`;
            window.open(url, '_blank');
            toast.success('آدرس در نشان جستجو شد');
        }
    };

    const shareToBalad = () => {
        if (latitude && longitude) {
            const url = `https://balad.ir/search?query=${latitude},${longitude}`;
            window.open(url, '_blank');
            toast.success('موقعیت در بالاد باز شد');
        } else {
            const url = `https://balad.ir/search?query=${encodeURIComponent(address)}`;
            window.open(url, '_blank');
            toast.success('آدرس در بالاد جستجو شد');
        }
    };

    const shareViaWebShare = async () => {
        if (navigator.share) {
            try {
                setIsSharing(true);
                await navigator.share({
                    title: `درخت ${treeCode || 'انتخاب شده'}`,
                    text: generateShareText(),
                    url: window.location.href,
                });
                toast.success('اطلاعات به اشتراک گذاشته شد');
            } catch (error) {
                console.error('خطا در اشتراک‌گذاری:', error);
                fallbackShare();
            } finally {
                setIsSharing(false);
            }
        } else {
            fallbackShare();
        }
    };

    const fallbackShare = () => {
        const text = generateShareText();
        if (navigator.clipboard) {
            navigator.clipboard.writeText(text).then(() => {
                toast.success('متن در کلیپ‌بورد کپی شد');
            }).catch(() => {
                toast.error('خطا در کپی کردن متن');
            });
        } else {
            toast.error('مرورگر شما از اشتراک‌گذاری پشتیبانی نمی‌کند');
        }
    };

    const copyToClipboard = () => {
        const text = generateShareText();
        if (navigator.clipboard) {
            navigator.clipboard.writeText(text).then(() => {
                toast.success('متن در کلیپ‌بورد کپی شد');
            }).catch(() => {
                toast.error('خطا در کپی کردن متن');
            });
        } else {
            toast.error('مرورگر شما از کپی کردن پشتیبانی نمی‌کند');
        }
    };

    return (
        <Drawer direction="bottom">
            <DrawerTrigger asChild>
                {children}
            </DrawerTrigger>
            <DrawerContent className="max-h-[85vh] z-[200] ">
                <div className="mx-auto w-full max-w-2xl overflow-y-scroll">
                    <DrawerHeader className="text-center">
                        <div className="flex items-center justify-between">
                            <DrawerTitle className="text-xl font-bold text-right">
                                اشتراک‌گذاری اطلاعات درخت
                            </DrawerTitle>

                        </div>
                        <DrawerDescription className="text-right">
                            آدرس و موقعیت درخت را با دیگران به اشتراک بگذارید
                        </DrawerDescription>
                    </DrawerHeader>

                    <div className="px-4 pb-4 space-y-4">
                        {/* اطلاعات درخت */}
                        <Card className="bg-white/80 backdrop-blur-sm border-green-200">
                            <CardHeader>
                                <CardTitle className="text-right flex items-center gap-2">
                                    <Share2 className="h-5 w-5 text-green-600" />
                                    اطلاعات درخت
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                <div className="text-right">
                                    <p className="text-sm font-medium text-gray-500">کد درخت:</p>
                                    <p className="text-base font-mono">{treeCode || 'نامشخص'}</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-sm font-medium text-gray-500">آدرس:</p>
                                    <p className="text-base">{address}</p>
                                </div>
                                {latitude && longitude && (
                                    <div className="grid grid-cols-2 gap-4 text-right">
                                        <div>
                                            <p className="text-sm font-medium text-gray-500">عرض جغرافیایی:</p>
                                            <p className="text-base font-mono">{latitude.toFixed(6)}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-gray-500">طول جغرافیایی:</p>
                                            <p className="text-base font-mono">{longitude.toFixed(6)}</p>
                                        </div>
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        {/* گزینه‌های اشتراک‌گذاری */}
                        <Card className="bg-white/80 backdrop-blur-sm border-green-200">
                            <CardHeader>
                                <CardTitle className="text-right">گزینه‌های اشتراک‌گذاری</CardTitle>
                                <CardDescription className="text-right">
                                    انتخاب کنید که چگونه می‌خواهید اطلاعات را به اشتراک بگذارید
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                {/* اشتراک‌گذاری عمومی */}
                                <Button
                                    onClick={shareViaWebShare}
                                    disabled={isSharing}
                                    className="w-full justify-start text-right bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white hover:text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300"
                                    variant="outline"
                                >
                                    <Share2 className="ml-2 h-4 w-4" />
                                    اشتراک‌گذاری عمومی
                                </Button>

                                <Separator />

                                {/* کپی کردن */}
                                <Button
                                    onClick={copyToClipboard}
                                    className="w-full justify-start text-right bg-gradient-to-r from-green-500 to-teal-600 hover:from-green-600 hover:to-teal-700 text-white hover:text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300"
                                    variant="outline"
                                >
                                    <Copy className="ml-2 h-4 w-4" />
                                    کپی کردن متن
                                </Button>

                                <Separator />

                                {/* نقشه‌ها */}
                                <div className="space-y-2">
                                    <p className="text-sm font-medium text-gray-500 text-right">باز کردن در نقشه‌ها:</p>

                                    <Button
                                        onClick={shareToGoogleMaps}
                                        className="w-full justify-start text-right bg-gradient-to-r from-blue-400 to-blue-600 hover:from-blue-500 hover:to-blue-700 text-white hover:text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300"
                                        variant="outline"
                                    >
                                        <GoogleMapIcon className="ml-2 h-5 w-5" />
                                        Google Maps
                                    </Button>

                                    <Button
                                        onClick={shareToNeshan}
                                        className="w-full justify-start text-right bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 text-white hover:text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300"
                                        variant="outline"
                                    >
                                        <NeshanIcon className="ml-2 h-5 w-5" />
                                        نشان
                                    </Button>

                                    <Button
                                        onClick={shareToBalad}
                                        className="w-full justify-start text-right bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white hover:text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300"
                                        variant="outline"
                                    >
                                        <BaladIcon className="ml-2 h-5 w-5" />
                                        بلد
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>

                        {/* پیش‌نمایش متن اشتراک‌گذاری */}
                        <Card className="bg-white/80 backdrop-blur-sm border-green-200">
                            <CardHeader>
                                <CardTitle className="text-right font-bold">پیش‌نمایش متن اشتراک‌گذاری</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="bg-green-200/50 p-3 rounded-lg text-right border border-green-100">
                                    <pre className="text-sm font-sans whitespace-pre-wrap  text-green-800 ">
                                        {generateShareText()}
                                    </pre>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </DrawerContent>
        </Drawer>
    );
};

export default ShareDrawer;
