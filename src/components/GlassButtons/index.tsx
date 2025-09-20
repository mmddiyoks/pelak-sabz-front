"use client";
import React from 'react';
import { Button } from '@/components/ui/button';
import { Navigation, Share2 } from 'lucide-react';

interface GlassButtonsProps {
    onGpsClick?: () => void;
    onShareClick?: () => void;
}

const GlassButtons: React.FC<GlassButtonsProps> = ({
    onGpsClick,
    onShareClick
}) => {
    const handleGpsClick = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    console.log('موقعیت GPS:', position.coords);
                    onGpsClick?.();
                },
                (error) => {
                    console.error('خطا در دریافت موقعیت GPS:', error);
                }
            );
        } else {
            console.error('مرورگر شما از GPS پشتیبانی نمی‌کند');
        }
    };

    const handleShareClick = async () => {
        if (navigator.share) {
            try {
                await navigator.share({
                    title: 'نقشه سبز',
                    text: 'نقشه سبز - مشاهده موقعیت مکانی',
                    url: window.location.href,
                });
                onShareClick?.();
            } catch (error) {
                console.error('خطا در اشتراک‌گذاری:', error);
            }
        } else {
            // Fallback: کپی کردن لینک
            try {
                await navigator.clipboard.writeText(window.location.href);
                alert('لینک کپی شد!');
                onShareClick?.();
            } catch (error) {
                console.error('خطا در کپی کردن لینک:', error);
            }
        }
    };

    return (
        <div className="absolute top-4 right-4 z-10 flex gap-2">
            {/* دکمه GPS */}
            <Button
                variant="ghost"
                size="icon"
                onClick={handleGpsClick}
                className="h-12 w-12 rounded-full bg-white/20 backdrop-blur-md border border-white/30 shadow-lg hover:bg-white/30 transition-all duration-200 hover:scale-105"
            >
                <Navigation className="h-5 w-5 text-white" />
            </Button>

            {/* دکمه اشتراک‌گذاری */}
            <Button
                variant="ghost"
                size="icon"
                onClick={handleShareClick}
                className="h-12 w-12 rounded-full bg-white/20 backdrop-blur-md border border-white/30 shadow-lg hover:bg-white/30 transition-all duration-200 hover:scale-105"
            >
                <Share2 className="h-5 w-5 text-white" />
            </Button>
        </div>
    );
};

export default GlassButtons;
