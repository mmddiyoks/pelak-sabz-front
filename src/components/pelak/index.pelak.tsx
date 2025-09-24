"use client"

import React, { useEffect, useState } from 'react';
import { useTree } from '@/context/TreeContext';
import { toast } from 'sonner';
import { motion } from 'framer-motion';
import QrCodeIcon from '../Icons/qr_code.svg';
import TreeInfoDrawer from '../TreeInfoDrawer';
import ShareDrawer from '../ShareButton';
import { Button } from '@/components/ui/button';
import { Info, Share2 } from 'lucide-react';
interface PelakProps {
    className?: string;
    onAnimationComplete?: () => void;
}


const PelakBox: React.FC<PelakProps> = ({ className = "", onAnimationComplete }) => {
    const { tree } = useTree();
    const [isAnimationComplete, setIsAnimationComplete] = useState(false);
    const [showWhiteBox, setShowWhiteBox] = useState(false);

    useEffect(() => {
        if (!tree) {
            toast.error("هیچ درختی انتخاب نشده است");
        }
    }, [tree]);

    if (!tree) {
        return null;
    }

    return (
        <>


            {tree && showWhiteBox && (
                <motion.div
                    className="absolute flex flex-row justify-between items-center bottom-9 left-4 right-4 z-10 bg-white/90 backdrop-blur-sm rounded-lg p-3 pb-4 shadow-lg"
                    initial={{
                        y: 100,
                        opacity: 0
                    }}
                    animate={{
                        y: 0,
                        opacity: 1
                    }}
                    transition={{
                        duration: 0.5,
                        ease: [0.25, 0.46, 0.45, 0.94]
                    }}
                >
                    <div className="text-xs text-gray-600 flex-1">
                        نام: {tree.name} | سلامت: {tree.health * 10}% | سن: {tree.age}
                    </div>
                </motion.div>
            )}
            <motion.div
                className={`absolute flex flex-col justify-center sh-[100px] inset-x-2  bottom-0   bg-[#3F9771] rounded-3xl border-2 border-white shadow-lg pelak-inner-glow ${className}`}
                style={{
                    boxShadow: 'inset 2px 3px 50px 0px rgba(255, 255, 255, 0.48), inset -2px -3px 18px 0px rgba(0, 0, 0, 0.10), 0 3px 10px 0px rgba(73, 180, 134, 0.24), 0 4px 4px 0px rgba(0, 0, 0, 0.10)'
                }}
                initial={{
                    y: 50,
                    rotateX: 45,
                    scale: 0.9,
                    zIndex: 50
                }}
                animate={{
                    y: [50, 0.0, 50],
                    rotateX: [45, 0, 0],
                    scale: [0.9, 1, 1],
                    zIndex: 200
                }}
                transition={{
                    duration: 1,
                    ease: [0.25, 0.46, 0.45, 0.94],
                    delay: 0.1
                }}
                onUpdate={(latest) => {
                    if (+latest.y <= 1.0 && !isAnimationComplete) {
                        setIsAnimationComplete(true);
                        // نمایش جعبه سفید بعد از 200ms تاخیر
                        setTimeout(() => {
                            setShowWhiteBox(true);
                        }, 200);
                        if (onAnimationComplete) {
                            onAnimationComplete();
                        }
                    }
                }}
            >
                {/* Content */}
                <div className=" w-full z-10 p-3 gap-3 flex flex-row  items-center">
                    <QrCodeIcon className="w-[70px] h-[70px] text-white" />

                    {/* First Row - Code */}
                    <div className="flex items-center justify-between w-full">
                        <div className="flex items-center gap-2 absolute top-2 left-2">
                            <TreeInfoDrawer >
                                <Button
                                    size="sm"
                                    variant="secondary"
                                    className="h-8 w-8 p-0   rounded-full bg-white/20 hover:bg-white/30 text-white border border-white/30"
                                >
                                    <Info className="h-4 w-4" />
                                </Button>
                            </TreeInfoDrawer>
                            <ShareDrawer
                                address={tree.address}
                                latitude={tree.y}
                                longitude={tree.x}
                                treeCode={tree.code}
                            >
                                <Button
                                    size="sm"
                                    variant="secondary"
                                    className="h-8 w-8 p-0 rounded-full bg-white/20 hover:bg-white/30 text-white border border-white/30"
                                >
                                    <Share2 className="h-4 w-4" />
                                </Button>
                            </ShareDrawer>
                        </div>
                        <div className="text-right flex flex-col gap-1">
                            <p className="text-white font-bold text-sm">
                                کد: {tree.code}
                            </p>
                            <p className="text-white font-normal text-xs">
                                آدرس: {tree.address}
                            </p>
                            <div className='flex flex-row gap-4'>
                                {tree.baseTreeType?.typeName && (
                                    <p className="text-white font-normal text-xs">
                                        نوع درخت: {tree.baseTreeType?.typeName}
                                    </p>
                                )}
                                {tree.baseTreeStatus?.statusName && (
                                    <p className="text-white font-normal text-xs">
                                        وضعیت: {tree.baseTreeStatus?.statusName}
                                    </p>
                                )}
                            </div>

                        </div>
                    </div>
                </div>
            </motion.div>
        </>
    );
};

export default PelakBox;
