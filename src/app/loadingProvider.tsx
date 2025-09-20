"use client"
// import { AddressObject } from '@/context/CodeContext'
// Define AddressObject locally for now
interface AddressObject {
    plate_id: string;
    trees: any[];
    x?: number;
    y?: number;
    address_te?: string;
}
import { TreeObject, useTree } from '@/context/TreeContext'
import { useSearchParams } from 'next/navigation'
import React, { useState, useEffect, ReactNode } from 'react'
import { toast } from 'sonner'
import { Axios } from '@/lib/axios/axios';
import { requestHandler } from '@/lib/axios/requestHandler';
import { Logger } from '@/lib/logger/index';
import { deleteAdditinalsItemsInReq, getLocalStoragePlateInfo, setLocalStoragePlateInfo } from '@/lib/utils'
const logger = Logger.get("LoadingProvider");

export default function LoadingProvider({ children }: { children: ReactNode }) {
    const [isImageLoaded, setIsImageLoaded] = useState(false)
    const { isMouted } = useMouted()

    if (isMouted) {
        return (
            <>
                {children}

            </>
        )
    } else {
        return (
            <div className="bg-primary w-screen h-screen">
                <div className="flex justify-center items-center h-screen">
                    <div className="flex flex-col items-center gap-6 animate-fade-in">
                        {/* Tree animation in circle */}
                        <div className="relative">
                            <div
                                className="w-20 h-20 rounded-full border-4 border-white/30 relative overflow-hidden"
                                onAnimationEnd={() => setIsImageLoaded(true)}
                            >
                                {/* Filling border animation */}
                                <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-white border-r-white animate-spin-slow"></div>

                                {/* Tree SVG inside circle */}
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <svg
                                        width="32"
                                        height="32"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        className="text-white animate-pulse-slow"
                                    >
                                        {/* Tree trunk */}
                                        <rect x="11" y="18" width="2" height="4" fill="currentColor" />

                                        {/* Tree branches */}
                                        <path
                                            d="M12 2 L8 10 L12 8 L16 10 Z"
                                            fill="currentColor"
                                            className="animate-bounce"
                                        />
                                        <path
                                            d="M12 6 L9 14 L12 12 L15 14 Z"
                                            fill="currentColor"
                                            className="animate-bounce"
                                            style={{ animationDelay: '0.1s' }}
                                        />
                                        <path
                                            d="M12 10 L10 18 L12 16 L14 18 Z"
                                            fill="currentColor"
                                            className="animate-bounce"
                                            style={{ animationDelay: '0.2s' }}
                                        />
                                    </svg>
                                </div>
                            </div>
                        </div>
                        {/* Loading spinner overlay */}


                        {/* Text content with staggered animation */}
                        {isImageLoaded && (
                            <div className="flex flex-col items-center text-center space-y-2">
                                <p className="text-sm font-light text-white animate-fade-in-delay-1">
                                    {process.env.App_Name}
                                </p>
                                <p className="text-lg font-bold text-white animate-fade-in-delay-2">
                                    {process.env.App_Provider}
                                </p>
                            </div>
                        )}

                        {/* Loading dots */}
                        <div className="flex gap-2 mt-4 ">
                            <div className="w-2 h-2 bg-white rounded-full animate-bounce"></div>
                            <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                            <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}
const useMouted = () => {
    const [isMouted, setMouted] = useState<boolean>(false)
    const searchParams = useSearchParams()
    const key = searchParams.get('TreeCode')
    const { setTree, setLoading, isLoading } = useTree()
    const setInfo = (data: TreeObject) => {
        if (data) {
            setTree(data)
        }
    }

    const fetchKey = async (plate_id: string) => {
        try {
            const req = await requestHandler(() => Axios.get(`/Tree/GetByTreeCode?TreeCode=${plate_id}`))()

            if (req.code == "success") {
                console.log(req.data)
                if (req.data) {
                    return req.data
                } else {
                    toast.error("پلاکی با این کد پیدا نشد")
                    return null
                }
            } else {
                toast.error("پلاکی با این کد پیدا نشد")
                return null
            }
        } catch (error) {
            logger.error("Error fetching plate data:", error);
            toast.error("خطا در دریافت اطلاعات پلاک")
            return null
        }
    }

    const handlePlaqueSelect = (plaque: TreeObject) => {
        setLocalStoragePlateInfo(plaque)
        setInfo(plaque)
        setLocalStorageScannedHistorys([plaque] as unknown as [])
    }


    const handleLoading = async () => {
        const localStoragePlateInfo = getLocalStoragePlateInfo();
        try {
            if (!key) {
                if (localStoragePlateInfo) {

                    setInfo(localStoragePlateInfo)
                    // router.push(`?key=${localStoragePlateInfo.plate_id}`)
                    return
                }
                toast.error("پلاکی  پیدا نشد")
                return
            }
            if (key) {
                if (localStoragePlateInfo && key == localStoragePlateInfo.plate_id) {
                    setInfo(localStoragePlateInfo)
                    return
                }
                await fetchKey(key).then(async (data) => {



                    setLocalStoragePlateInfo(data)
                    setInfo(data)
                    setLocalStorageScannedHistorys([data] as unknown as [])
                }

                ).finally(() => {
                    setLoading(false)
                })
            }

        } catch (error) {
            console.log(error)
            toast.error("خطا در دریافت اطلاعات پلاک")
        } finally {
            setLoading(false)
            setMouted(true)
        }
    }
    useEffect(() => {
        handleLoading()
    }, [key])
    return { isMouted, handlePlaqueSelect, isLoading }
}





const setLocalStorageScannedHistorys = (data: []) => {
    const stored = window.localStorage.getItem("scanned_historys");
    if (!stored) return window.localStorage.setItem("scanned_historys", JSON.stringify([data]));
    const lastHistory = JSON.parse(stored);
    if (lastHistory.length) {
        try {
            window.localStorage.setItem("scanned_historys", JSON.stringify([...lastHistory, data]));
        } catch (error) {
            logger.error("Error saving scanned_historys to localStorage:", error);
        }
    }
}