"use client"
import React from 'react';
import { motion } from 'framer-motion';
import { QrCodeIcon } from 'lucide-react';
import { cn } from "@/lib/utils";
import { AddressObject } from '@/context/CodeContext';
import {
    Drawer,
    DrawerClose,
    DrawerContent,
    DrawerFooter,
    DrawerHeader,
    DrawerTitle,
} from "@/components/ui/drawer";
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Logger } from '@/lib/logger/index';
import getAddress from '@/actions/getAddressAction';

const logger = Logger.get("SelectPlaqueDrawer");

interface SelectPlaqueDrawerProps {
    plaques: AddressObject[];
    isOpen: boolean;
    onClose: () => void;
    onSelectPlaque: (plaque: AddressObject) => void;
}

export default function SelectPlaqueDrawer({
    plaques,
    isOpen,
    onClose,
    onSelectPlaque
}: SelectPlaqueDrawerProps) {
    const router = useRouter();

    const handlePlaqueSelect = async (plaque: AddressObject) => {
        try {
            if (plaque.x && plaque.y) {
                const address = await getAddress([plaque.x, plaque.y])
                //@ts-ignore
                plaque.address_te = address
            }
            onSelectPlaque(plaque);
            router.push(`?key=${plaque.plate_id}`);
            onClose();
        } catch (error) {
            logger.error("Error selecting plaque:", error);
            toast.error("خطا در انتخاب پلاک");
        }
    };

    return (
        <Drawer open={isOpen} onOpenChange={onClose}>
            <DrawerContent className='bg-white border-none'>
                <div className="mx-auto w-full max-w-sm">
                    <DrawerHeader>
                        <DrawerTitle className="text-center">انتخاب پلاک</DrawerTitle>
                    </DrawerHeader>
                    <div className="p-4">
                        <div className="space-y-3 flex flex-col gap-4 max-h-[220px] overflow-y-scroll">
                            {plaques?.map((plaque, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                    className={cn(
                                        "p-4 rounded-lg bg-primary-gradient flex flex-row justify-between items-center text-white cursor-pointer",
                                        "transition-colors duration-200 hover:bg-primary/90"
                                    )}
                                    onClick={() => handlePlaqueSelect(plaque)}
                                >
                                    <div className="flex flex-col gap-4">
                                        <div className="flex items-center justify-between">
                                            <span className="text-sm font-medium">
                                                نوع: {Array.isArray(eval(plaque?.poi_type)) && eval(plaque?.poi_type)?.map((item: number, index: number) => {
                                                    return (
                                                        <span key={`select-poi-type-${index}-${plaque.plate_id}`}>
                                                            {/*@ts-ignore*/}
                                                            {poiData[item]}
                                                            {index < eval(plaque?.poi_type).length - 1 ? "، " : ""}
                                                        </span>
                                                    )
                                                }) || 'نامشخص'}
                                            </span>
                                        </div>
                                        <p className="text-lg font-bold">
                                            پلاک: {plaque.plate_no || 'نامشخص'}
                                        </p>
                                    </div>
                                    <QrCodeIcon className='w-10 h-10' />
                                </motion.div>
                            ))}
                        </div>
                    </div>
                    <DrawerFooter>
                        <DrawerClose asChild>
                            <Button variant="default" className="w-full">بستن</Button>
                        </DrawerClose>
                    </DrawerFooter>
                </div>
            </DrawerContent>
        </Drawer>
    );
}