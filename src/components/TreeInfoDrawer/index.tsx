"use client"

import React from 'react';
import { useTree } from '@/context/TreeContext';
import {
    Drawer,
    DrawerContent,
    DrawerDescription,
    DrawerHeader,
    DrawerTitle,
    DrawerTrigger,
    DrawerClose,
} from '@/components/ui/drawer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Info, X } from 'lucide-react';

interface TreeInfoDrawerProps {
    children: React.ReactNode;
}

const TreeInfoDrawer: React.FC<TreeInfoDrawerProps> = ({ children }) => {
    const { tree } = useTree();

    if (!tree) {
        return null;
    }

    const formatDate = (dateString: string | null) => {
        if (!dateString) return 'نامشخص';
        return new Date(dateString).toLocaleDateString('fa-IR');
    };

    const getHealthColor = (health: number) => {
        if (health >= 80) return 'bg-green-500';
        if (health >= 60) return 'bg-yellow-500';
        if (health >= 40) return 'bg-orange-500';
        return 'bg-red-500';
    };

    const getHealthText = (health: number) => {
        if (health >= 80) return 'عالی';
        if (health >= 60) return 'خوب';
        if (health >= 40) return 'متوسط';
        return 'ضعیف';
    };

    return (
        <Drawer direction="bottom">
            <DrawerTrigger asChild >
                {children}
            </DrawerTrigger>
            <DrawerContent className="max-h-[85vh] z-[200] ">
                <div className="mx-auto w-full max-w-2xl overflow-y-scroll">
                    <DrawerHeader className="text-center">
                        <div className="flex items-center justify-between">
                            <DrawerTitle className="text-xl font-bold text-right">
                                اطلاعات کامل درخت
                            </DrawerTitle>
                            <DrawerClose asChild>
                                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                    <X className="h-4 w-4" />
                                </Button>
                            </DrawerClose>
                        </div>
                        <DrawerDescription className="text-right">
                            جزئیات کامل درخت انتخاب شده
                        </DrawerDescription>
                    </DrawerHeader>

                    <div className="px-4 pb-4 space-y-4">
                        {/* اطلاعات اصلی */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-right flex items-center gap-2">
                                    <Info className="h-5 w-5" />
                                    اطلاعات اصلی
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                <div className="grid grid-cols-2 gap-4 text-right">
                                    <div>
                                        <p className="text-sm font-medium text-gray-500">نام درخت:</p>
                                        <p className="text-base">{tree.name}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-gray-500">کد:</p>
                                        <p className="text-base font-mono">{tree.code}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-gray-500">نوع درخت:</p>
                                        <p className="text-base">{tree.baseTreeType?.typeName}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-gray-500">نوع برگ:</p>
                                        <p className="text-base">{tree.baseTreeLeafType?.leafType}</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* وضعیت و سلامت */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-right">وضعیت و سلامت</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                <div className="flex items-center justify-between">
                                    <div className="text-right">
                                        <p className="text-sm font-medium text-gray-500">وضعیت درخت</p>
                                    </div>
                                    <Badge


                                        className={`text-sm  ${getHealthColor(tree.health * 10)}`}
                                    >
                                        {tree.baseTreeStatus?.statusName}
                                    </Badge>

                                </div>

                                <Separator className="bg-gray-200 h-1" />

                                <div className="space-y-2">
                                    <div className="flex items-center justify-between">
                                        <p className="text-sm font-medium text-gray-500">سلامت درخت</p>

                                        <div className="flex items-center gap-2">
                                            <div className={`w-3 h-3 rounded-full ${getHealthColor(tree.health * 10)}`}></div>
                                            <span className="text-sm font-medium">
                                                {getHealthText(tree.health * 10)} ({tree.health * 10}%)
                                            </span>
                                        </div>
                                    </div>

                                    <div className="w-full bg-gray-200 rounded-full h-2">
                                        <div
                                            className={`h-2 rounded-full ${getHealthColor(tree.health * 10)}`}
                                            style={{ width: `${tree.health * 10}%` }}
                                        ></div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* اطلاعات فیزیکی */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-right">اطلاعات فیزیکی</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="grid grid-cols-2 gap-4 text-right">
                                    <div>
                                        <p className="text-sm font-medium text-gray-500">قطر (سانتی‌متر):</p>
                                        <p className="text-base">{tree.diameter}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-gray-500">ارتفاع (متر):</p>
                                        <p className="text-base">{tree.height ? `${tree.height}` : 'نامشخص'}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-gray-500">سن:</p>
                                        <p className="text-base">{tree.age}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-gray-500">رده سنی:</p>
                                        <p className="text-base">{tree.ageGrade}</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* اطلاعات مکانی */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-right">اطلاعات مکانی</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                <div className="text-right">
                                    <p className="text-sm font-medium text-gray-500">آدرس:</p>
                                    <p className="text-base">{tree.address}</p>
                                </div>
                                <div className="grid grid-cols-2 gap-4 text-right">
                                    <div>

                                        <p className="text-sm font-medium text-gray-500">منطقه:</p>
                                        <p className="text-base">{tree.baseRegions?.regionName}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-gray-500">خیابان:</p>
                                        <p className="text-base">{tree.baseStreet?.streetName}</p>
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4 text-right">
                                    <div>
                                        <p className="text-sm font-medium text-gray-500">مختصات X:</p>
                                        <p className="text-base font-mono">{tree.x.toFixed(6)}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-gray-500">مختصات Y:</p>
                                        <p className="text-base font-mono">{tree.y.toFixed(6)}</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* اطلاعات کشاورزی */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-right">اطلاعات کشاورزی</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                <div className="grid grid-cols-2 gap-4 text-right">
                                    <div>
                                        <p className="text-sm font-medium text-gray-500">نوع آبیاری:</p>
                                        <p className="text-base">{tree.baseTreeIrrigation?.irrigationName}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-gray-500">تاریخ کاشت:</p>
                                        <p className="text-base">{formatDate(tree.plantingDate)}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-gray-500">تاریخ برداشت:</p>
                                        <p className="text-base">{formatDate(tree.harvestDate)}</p>
                                    </div>

                                </div>

                                {tree.description && (
                                    <>
                                        <Separator />
                                        <div className="text-right">
                                            <p className="text-sm font-medium text-gray-500">توضیحات:</p>
                                            <p className="text-base mt-1">{tree.description}</p>
                                        </div>
                                    </>
                                )}
                            </CardContent>
                        </Card>

                        {/* QR Code */}
                        {tree.qr && (
                            <Card>
                                <CardHeader>
                                    <CardTitle className="text-right">کد QR</CardTitle>
                                </CardHeader>
                                <CardContent className="text-center">
                                    <div className="bg-gray-100 p-4 rounded-lg inline-block">
                                        <p className="text-sm text-gray-600">کد QR موجود است</p>
                                        <p className="text-xs text-gray-500 mt-1">Object ID: {tree.objectID}</p>
                                    </div>
                                </CardContent>
                            </Card>
                        )}
                    </div>
                </div>
            </DrawerContent>
        </Drawer>
    );
};

export default TreeInfoDrawer;
